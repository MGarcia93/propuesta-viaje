#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "fs";
import { join, basename } from "path";
import { cwd } from "process";

const PROJECT_ROOT = process.env.PROJECT_ROOT || cwd();
const YAMLS_DIR = join(PROJECT_ROOT, "src/content/trips");
const ASSETS_DIR = join(PROJECT_ROOT, "src/assets/trips");

// ── Wikimedia Commons API helpers ──────────────────────────────

async function searchWikimedia(query, limit = 6) {
  const params = new URLSearchParams({
    action: "query",
    list: "search",
    srsearch: query,
    srnamespace: "6", // File namespace
    srlimit: String(limit),
    format: "json",
    origin: "*",
  });

  const url = `https://commons.wikimedia.org/w/api.php?${params}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "mcp-image-finder/1.0 (travel-planner)" },
  });
  const data = await res.json();

  if (!data.query?.search) return [];

  return data.query.search.map((r) => ({
    title: r.title,
    snippet: r.snippet?.replace(/<[^>]*>/g, ""),
  }));
}

async function getImageUrl(filename) {
  const params = new URLSearchParams({
    action: "query",
    titles: filename,
    prop: "imageinfo",
    iiprop: "url|size|mime",
    iiurlwidth: "1920",
    format: "json",
    origin: "*",
  });

  const url = `https://commons.wikimedia.org/w/api.php?${params}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "mcp-image-finder/1.0 (travel-planner)" },
  });
  const data = await res.json();

  const pages = data.query?.pages;
  if (!pages) return null;

  const page = Object.values(pages)[0];
  if (!page.imageinfo?.[0]) return null;

  const info = page.imageinfo[0];
  return {
    originalUrl: info.url,
    thumbUrl: info.thumburl || info.url,
    width: info.width,
    height: info.height,
    size: info.size,
    mime: info.mime,
  };
}

async function downloadImage(imageUrl, savePath) {
  const res = await fetch(imageUrl, {
    headers: { "User-Agent": "mcp-image-finder/1.0 (travel-planner)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

  const buffer = Buffer.from(await res.arrayBuffer());
  const dir = savePath.substring(0, savePath.lastIndexOf("/"));
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(savePath, buffer);
  return { saved: savePath, size: buffer.length };
}

// ── YAML parsing helpers ───────────────────────────────────────

function extractMissingImages(yamlContent, yamlPath) {
  const missing = [];
  const lines = yamlContent.split("\n");
  let currentAlt = null;
  let currentSrc = null;
  let currentSection = "";
  let imageBlock = {};
  let inImagesArray = false;
  let depth = 0;

  // Simple state machine to find images with src: null
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Track if we're inside an images array
    if (trimmed === "images:") {
      inImagesArray = true;
      continue;
    }

    if (inImagesArray) {
      // New image entry
      if (trimmed.startsWith("- src:")) {
        // Save previous if missing
        if (imageBlock.src === null && imageBlock.alt) {
          missing.push({ ...imageBlock, yamlPath, line: i });
        }
        imageBlock = {};
        const srcVal = trimmed.replace("- src:", "").trim();
        imageBlock.src = srcVal === "null" ? null : srcVal;
      } else if (trimmed.startsWith("alt:")) {
        imageBlock.alt = trimmed.replace("alt:", "").trim().replace(/^["']|["']$/g, "");
      } else if (trimmed.startsWith("caption:")) {
        imageBlock.caption = trimmed.replace("caption:", "").trim().replace(/^["']|["']$/g, "");
      } else if (trimmed.startsWith("size:")) {
        imageBlock.size = trimmed.replace("size:", "").trim();
      } else if (trimmed.startsWith("orientation:")) {
        imageBlock.orientation = trimmed.replace("orientation:", "").trim();
      } else if (trimmed.startsWith("status:")) {
        imageBlock.status = trimmed.replace("status:", "").trim();
      } else if (!trimmed.startsWith("-") && !trimmed.startsWith("src:") && trimmed !== "" && !trimmed.startsWith("#")) {
        // End of images array
        if (imageBlock.src === null && imageBlock.alt) {
          missing.push({ ...imageBlock, yamlPath, line: i });
        }
        inImagesArray = false;
        imageBlock = {};
      }
    }
  }

  // Don't forget last image
  if (imageBlock.src === null && imageBlock.alt) {
    missing.push({ ...imageBlock, yamlPath });
  }

  return missing;
}

// ── MCP Server ─────────────────────────────────────────────────

const server = new Server(
  { name: "mcp-image-finder", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "list-missing-images",
      description:
        "Read all trip YAML files and list images that have src: null. Returns alt text descriptions that can be used to search for images.",
      inputSchema: {
        type: "object",
        properties: {
          yamlFile: {
            type: "string",
            description: "Optional: specific YAML filename to check. If omitted, checks all YAMLs.",
          },
        },
      },
    },
    {
      name: "search-place-images",
      description:
        "Search Wikimedia Commons for images of a travel destination. Returns URLs and metadata for matching images.",
      inputSchema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Search query, e.g. 'Zhangjiajie sandstone pillars' or 'Forbidden City Beijing'",
          },
          limit: {
            type: "number",
            description: "Max results (default 6)",
            default: 6,
          },
        },
        required: ["query"],
      },
    },
    {
      name: "download-image",
      description:
        "Download an image from a URL and save it to the project's asset directory for a specific trip.",
      inputSchema: {
        type: "object",
        properties: {
          imageUrl: {
            type: "string",
            description: "URL of the image to download",
          },
          tripSlug: {
            type: "string",
            description: "Trip slug, e.g. 'china-clasica-tecnologica-12-dias'",
          },
          filename: {
            type: "string",
            description: "Filename to save as, e.g. 'forbidden-city.jpg'",
          },
          updateYaml: {
            type: "boolean",
            description: "If true, also update the YAML src field (default true)",
            default: true,
          },
          yamlLine: {
            type: "number",
            description: "Line number in YAML where the src: null is (from list-missing-images)",
          },
        },
        required: ["imageUrl", "tripSlug", "filename"],
      },
    },
    {
      name: "search-and-download",
      description:
        "Combined: search for an image by place description and download the best match. One-step for convenience.",
      inputSchema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Search query derived from alt text, e.g. 'Pilares de arenisca de Zhangjiajie'",
          },
          tripSlug: {
            type: "string",
            description: "Trip slug for saving",
          },
          filename: {
            type: "string",
            description: "Filename to save as",
          },
          yamlPath: {
            type: "string",
            description: "Full path to the YAML file to update",
          },
          altText: {
            type: "string",
            description: "The alt text to match in the YAML for updating src",
          },
        },
        required: ["query", "tripSlug", "filename"],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "list-missing-images": {
        let files = [];
        if (args?.yamlFile) {
          const fullPath = args.yamlFile.startsWith("/")
            ? args.yamlFile
            : join(YAMLS_DIR, args.yamlFile);
          if (!existsSync(fullPath)) {
            return { content: [{ type: "text", text: `File not found: ${fullPath}` }] };
          }
          files = [fullPath];
        } else {
          if (!existsSync(YAMLS_DIR)) {
            return { content: [{ type: "text", text: `YAML directory not found: ${YAMLS_DIR}` }] };
          }
          files = readdirSync(YAMLS_DIR)
            .filter((f) => f.endsWith(".yaml"))
            .map((f) => join(YAMLS_DIR, f));
        }

        const results = [];
        for (const f of files) {
          const content = readFileSync(f, "utf-8");
          const missing = extractMissingImages(content, f);
          if (missing.length > 0) {
            const slug = basename(f, ".yaml");
            results.push({
              yamlFile: basename(f),
              slug,
              missingCount: missing.length,
              images: missing,
            });
          }
        }

        const summary = results
          .map(
            (r) =>
              `📄 ${r.yamlFile} (${r.slug}):\n` +
              r.images
                .map(
                  (img, i) =>
                    `  ${i + 1}. alt: "${img.alt}" | caption: "${img.caption || ""}" | size: ${img.size || "?"} | orientation: ${img.orientation || "?"}`
                )
                .join("\n")
          )
          .join("\n\n");

        const total = results.reduce((s, r) => s + r.missingCount, 0);
        return {
          content: [
            {
              type: "text",
              text: `Found ${total} missing images across ${results.length} YAML file(s):\n\n${summary}\n\nTip: Use the alt text as search query for 'search-place-images' or 'search-and-download'.`,
            },
          ],
        };
      }

      case "search-place-images": {
        const query = args?.query;
        if (!query) {
          return { content: [{ type: "text", text: "query is required" }] };
        }

        const limit = args?.limit || 6;
        const results = await searchWikimedia(query, limit);

        if (results.length === 0) {
          return {
            content: [
              {
                type: "text",
                text: `No images found for "${query}". Try a different query in English (e.g. "Great Wall of China" instead of "Gran Muralla").`,
              },
            ],
          };
        }

        // Get URLs for each result
        const enriched = [];
        for (const r of results) {
          const info = await getImageUrl(r.title);
          enriched.push({
            title: r.title,
            ...info,
          });
        }

        const listing = enriched
          .map(
            (r, i) =>
              `${i + 1}. ${r.title}\n   Size: ${r.width}x${r.height} | ${(r.size / 1024 / 1024).toFixed(1)}MB\n   URL: ${r.thumbUrl || r.originalUrl}`
          )
          .join("\n\n");

        return {
          content: [
            {
              type: "text",
              text: `Found ${enriched.length} images for "${query}":\n\n${listing}\n\nUse 'download-image' or 'search-and-download' to save one.`,
            },
          ],
        };
      }

      case "download-image": {
        const { imageUrl, tripSlug, filename, updateYaml, yamlLine } = args;
        if (!imageUrl || !tripSlug || !filename) {
          return {
            content: [{ type: "text", text: "imageUrl, tripSlug, and filename are required" }],
          };
        }

        const saveDir = join(ASSETS_DIR, tripSlug);
        const savePath = join(saveDir, filename);

        const result = await downloadImage(imageUrl, savePath);

        let yamlUpdated = false;
        if (updateYaml !== false && yamlLine) {
          const yamlPath = join(YAMLS_DIR, `${tripSlug}.yaml`);
          if (existsSync(yamlPath)) {
            const content = readFileSync(yamlPath, "utf-8");
            const lines = content.split("\n");
            // Find the src: null near the given line and replace
            const relativePath = `src/assets/trips/${tripSlug}/${filename}`;
            for (let i = Math.max(0, yamlLine - 10); i < Math.min(lines.length, yamlLine + 5); i++) {
              if (lines[i].includes("src: null")) {
                lines[i] = lines[i].replace("src: null", `src: "${relativePath}"`);
                yamlUpdated = true;
                break;
              }
            }
            if (yamlUpdated) {
              writeFileSync(yamlPath, lines.join("\n"));
            }
          }
        }

        return {
          content: [
            {
              type: "text",
              text: `✅ Downloaded: ${savePath}\n   Size: ${(result.size / 1024).toFixed(1)}KB\n   YAML updated: ${yamlUpdated ? "yes" : "no (provide yamlLine to auto-update)"}`,
            },
          ],
        };
      }

      case "search-and-download": {
        const { query, tripSlug, filename, yamlPath, altText } = args;
        if (!query || !tripSlug || !filename) {
          return {
            content: [{ type: "text", text: "query, tripSlug, and filename are required" }],
          };
        }

        // Search
        const results = await searchWikimedia(query, 3);
        if (results.length === 0) {
          return {
            content: [
              {
                type: "text",
                text: `No images found for "${query}". Try a broader English query.`,
              },
            ],
          };
        }

        // Get URL of first result
        const info = await getImageUrl(results[0].title);
        if (!info) {
          return {
            content: [{ type: "text", text: `Could not get image URL for "${results[0].title}"` }],
          };
        }

        // Download
        const saveDir = join(ASSETS_DIR, tripSlug);
        const savePath = join(saveDir, filename);
        const dlResult = await downloadImage(info.thumbUrl || info.originalUrl, savePath);

        // Update YAML if path provided
        let yamlUpdated = false;
        const yPath = yamlPath || join(YAMLS_DIR, `${tripSlug}.yaml`);
        if (existsSync(yPath)) {
          const content = readFileSync(yPath, "utf-8");
          const lines = content.split("\n");
          const relativePath = `src/assets/trips/${tripSlug}/${filename}`;

          if (altText) {
            // Find by alt text
            for (let i = 0; i < lines.length; i++) {
              if (lines[i].includes(`alt: "${altText}"`)) {
                // Look backwards for src: null
                for (let j = i; j >= Math.max(0, i - 10); j--) {
                  if (lines[j].includes("src: null")) {
                    lines[j] = lines[j].replace("src: null", `src: "${relativePath}"`);
                    yamlUpdated = true;
                    break;
                  }
                }
                break;
              }
            }
          } else {
            // Find first src: null
            for (let i = 0; i < lines.length; i++) {
              if (lines[i].includes("src: null")) {
                lines[i] = lines[i].replace("src: null", `src: "${relativePath}"`);
                yamlUpdated = true;
                break;
              }
            }
          }

          if (yamlUpdated) {
            writeFileSync(yPath, lines.join("\n"));
          }
        }

        return {
          content: [
            {
              type: "text",
              text: [
                `✅ Found and downloaded image for "${query}"`,
                `   Source: ${results[0].title}`,
                `   Saved: ${savePath}`,
                `   Size: ${(dlResult.size / 1024).toFixed(1)}KB`,
                `   Dimensions: ${info.width}x${info.height}`,
                `   YAML updated: ${yamlUpdated ? "yes" : "no"}`,
              ].join("\n"),
            },
          ],
        };
      }

      default:
        return {
          content: [{ type: "text", text: `Unknown tool: ${name}` }],
        };
    }
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error: ${error.message}` }],
    };
  }
});

// ── Start ──────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
