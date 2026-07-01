#!/usr/bin/env node

/**
 * Batch image downloader for trip YAML files.
 * Reads all YAMLs, finds images with src: null, searches Wikimedia Commons,
 * downloads best match, and updates the YAML.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "fs";
import { join, basename } from "path";

const PROJECT_ROOT = "/home/max/viaje-tanto-spec";
const YAMLS_DIR = join(PROJECT_ROOT, "src/content/trips");
const ASSETS_DIR = join(PROJECT_ROOT, "src/assets/trips");

// ── Translation map: Spanish alt text → English search query ──

const QUERY_MAP = {
  // Beijing
  "Ciudad Prohibida vista desde la Plaza de Tiananmén": "Forbidden City Beijing aerial view",
  "Tejados de la Ciudad Prohibida vistos desde Jingshan": "Forbidden City rooftops from Jingshan Park",
  "Gran Muralla en la sección de Mutianyu": "Great Wall Mutianyu section",
  "Calle tradicional de un hutong de Beijing": "Beijing hutong traditional street",
  "Templo del Cielo en Beijing": "Temple of Heaven Beijing",
  "Templo del Cielo": "Temple of Heaven Beijing",
  "Calle nocturna de Beijing": "Beijing Wangfujing night street",
  "Ciudad Prohibida y sus patios": "Forbidden City courtyard Beijing",
  "Gran Muralla en Mutianyu": "Great Wall Mutianyu",
  "Tejados de la Ciudad Prohibida desde Jingshan": "Forbidden City rooftops Jingshan",
  "Hutong tradicional de Beijing": "Beijing hutong traditional alley",
  
  // Zhangjiajie
  "Pilares de arenisca de Zhangjiajie entre nubes": "Zhangjiajie sandstone pillars clouds",
  "Ascensor Bailong junto a los acantilados": "Bailong Elevator Zhangjiajie",
  "Tianzi Mountain entre niebla": "Tianzi Mountain fog Zhangjiajie",
  "Puerta del Cielo de Tianmen Mountain": "Tianmen Cave Zhangjiajie",
  "Puerta del Cielo de Tianmen": "Tianmen Cave Zhangjiajie",
  "Puerta del Cielo en Tianmen Mountain": "Tianmen Cave Zhangjiajie",
  "Teleférico de Tianmen sobre las montañas": "Tianmen Mountain cable car",
  "Pilares de Yuanjiajie": "Yuanjiajie pillars Zhangjiajie",
  "Teleférico de Tianmen": "Tianmen Mountain cable car",
  "Sendero de Golden Whip Stream": "Golden Whip Stream Zhangjiajie",
  "Sendero tranquilo dentro de Zhangjiajie": "Zhangjiajie forest trail",
  "Pilares de Zhangjiajie": "Zhangjiajie pillars",
  "Montañas de Tianzi entre nubes": "Tianzi Mountain clouds Zhangjiajie",
  
  // Shenzhen
  "Mercados de electrónica de Huaqiangbei": "Huaqiangbei electronics market Shenzhen",
  "Robots y drones expuestos en Shenzhen": "Shenzhen technology robots drones",
  "Robots y drones expuestos en Huaqiangbei": "Huaqiangbei robots drones Shenzhen",
  "Distrito de Futian iluminado": "Futian district Shenzhen night skyline",
  "Distrito de Futian iluminado de noche": "Futian district Shenzhen night skyline",
  "Shenzhen Bay y skyline moderno": "Shenzhen Bay skyline",
  "Puerto y paseo de Shekou Sea World": "Shekou Sea World Shenzhen harbor",
  "Futian iluminado": "Futian Shenzhen night skyline",
  "Shenzhen Bay y skyline": "Shenzhen Bay skyline",
  "Componentes electrónicos y puestos de reparación": "Huaqiangbei electronic components market",
  "Distrito de Futian": "Futian district Shenzhen",
  "Tiendas de electrónica de Huaqiangbei": "Huaqiangbei electronics shops Shenzhen",
  "Mercados de Huaqiangbei": "Huaqiangbei market Shenzhen",
  
  // Chongqing
  "Skyline nocturno de Chongqing junto a los ríos": "Chongqing skyline night rivers",
  "Monorriel de Liziba atravesando un edificio": "Chongqing Liziba monorail through building",
  "Monorriel de Liziba": "Chongqing Liziba monorail building",
  "Hongya Cave iluminada": "Hongya Cave Chongqing night",
  "Raffles City y Chaotianmen de noche": "Raffles City Chaotianmen Chongqing night",
  "Hot pot tradicional de Chongqing": "Chongqing hot pot traditional",
  "Calles y comida de Chongqing": "Chongqing street food",
  "Hot pot y calles de Chongqing": "Chongqing hot pot street food",
  "Chongqing iluminado": "Chongqing skyline night",
  "Monorriel de Chongqing": "Chongqing monorail through building",
  
  // Shanghai
  "Skyline nocturno de Shanghai visto desde el río": "Shanghai skyline Pudong night river",
  "Shanghai de noche": "Shanghai skyline night",
  
  // Wangxian Valley
  "Casas iluminadas sobre los acantilados de Wangxian Valley": "Wangxian Valley cliff houses night",
  "Río, puente y construcciones tradicionales en Wangxian Valley": "Wangxian Valley traditional bridge river",
  "Wangxian Valley iluminado": "Wangxian Valley night lights",
};

// ── Wikimedia API ──────────────────────────────────────────────

async function searchWikimedia(query, limit = 3) {
  const params = new URLSearchParams({
    action: "query",
    list: "search",
    srsearch: query,
    srnamespace: "6",
    srlimit: String(limit),
    format: "json",
    origin: "*",
  });

  const url = `https://commons.wikimedia.org/w/api.php?${params}`;
  const res = await fetchWithRetry(url, {
    headers: { "User-Agent": "mcp-image-finder/1.0 (travel-planner)" },
  });
  const data = await res.json();
  return data.query?.search || [];
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
  const res = await fetchWithRetry(url, {
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
  const res = await fetchWithRetry(imageUrl, {
    headers: { "User-Agent": "mcp-image-finder/1.0 (travel-planner)" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const dir = savePath.substring(0, savePath.lastIndexOf("/"));
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(savePath, buffer);
  return buffer.length;
}

// ── YAML helpers ───────────────────────────────────────────────

function extractMissingImages(yamlContent) {
  const missing = [];
  const lines = yamlContent.split("\n");
  let imageBlock = {};
  let inImagesArray = false;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    if (trimmed === "images:") {
      inImagesArray = true;
      continue;
    }

    if (inImagesArray) {
      if (trimmed.startsWith("- src:")) {
        if (imageBlock.src === null && imageBlock.alt) {
          missing.push({ ...imageBlock });
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
      } else if (
        !trimmed.startsWith("-") &&
        !trimmed.startsWith("src:") &&
        trimmed !== "" &&
        !trimmed.startsWith("#") &&
        !trimmed.startsWith("status:")
      ) {
        if (imageBlock.src === null && imageBlock.alt) {
          missing.push({ ...imageBlock });
        }
        inImagesArray = false;
        imageBlock = {};
      }
    }
  }

  if (imageBlock.src === null && imageBlock.alt) {
    missing.push({ ...imageBlock });
  }

  return missing;
}

function updateYamlSrc(yamlContent, altText, relativePath) {
  const lines = yamlContent.split("\n");
  let updated = false;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(`alt: "${altText}"` || lines[i].includes(`alt: '${altText}'`))) {
      for (let j = i; j >= Math.max(0, i - 10); j--) {
        if (lines[j].includes("src: null")) {
          lines[j] = lines[j].replace("src: null", `src: "${relativePath}"`);
          updated = true;
          break;
        }
      }
      if (updated) break;
    }
  }

  return { content: lines.join("\n"), updated };
}

// ── Main ───────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchWithRetry(url, options, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const res = await fetch(url, options);
    if (res.status === 429) {
      const wait = Math.pow(2, attempt + 2) * 1000; // 4s, 8s, 16s
      console.log(`    ⏳ Rate limited, waiting ${wait / 1000}s...`);
      await sleep(wait);
      continue;
    }
    return res;
  }
  throw new Error("Rate limited after retries");
}

function sanitizeFilename(alt, index) {
  return alt
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 50) + `-${index}.jpg`;
}

async function processYaml(yamlFile) {
  const slug = basename(yamlFile, ".yaml");
  const yamlPath = join(YAMLS_DIR, yamlFile);
  const content = readFileSync(yamlPath, "utf-8");
  const missing = extractMissingImages(content);

  console.log(`\n📄 ${yamlFile} — ${missing.length} missing images`);

  if (missing.length === 0) {
    console.log("  ✅ No missing images!");
    return;
  }

  let yamlContent = content;
  let downloaded = 0;
  let failed = 0;

  for (let i = 0; i < missing.length; i++) {
    const img = missing[i];
    const query = QUERY_MAP[img.alt] || img.alt;
    const filename = sanitizeFilename(img.alt, i + 1);

    console.log(`  [${i + 1}/${missing.length}] "${img.alt}"`);
    console.log(`    Query: "${query}"`);

    try {
      // Search
      const results = await searchWikimedia(query, 3);
      if (results.length === 0) {
        // Try broader query
        const words = query.split(" ");
        const broader = words.slice(0, 2).join(" ");
        console.log(`    ⚠️  No results, trying broader: "${broader}"`);
        const retry = await searchWikimedia(broader, 3);
        if (retry.length === 0) {
          console.log(`    ❌ No images found`);
          failed++;
          continue;
        }
        results.push(...retry);
      }

      // Get URL
      const info = await getImageUrl(results[0].title);
      if (!info) {
        console.log(`    ❌ Could not get URL`);
        failed++;
        continue;
      }

      // Download
      const savePath = join(ASSETS_DIR, slug, filename);
      const size = await downloadImage(info.thumbUrl || info.originalUrl, savePath);

      // Update YAML
      const relativePath = `src/assets/trips/${slug}/${filename}`;
      const result = updateYamlSrc(yamlContent, img.alt, relativePath);
      yamlContent = result.content;

      console.log(`    ✅ ${filename} (${(size / 1024).toFixed(0)}KB) ${result.updated ? "→ YAML updated" : "⚠️ YAML not updated"}`);
      downloaded++;

      // Rate limit: 3s between requests to avoid 429
      await sleep(3000);
    } catch (err) {
      console.log(`    ❌ Error: ${err.message}`);
      failed++;
    }
  }

  // Write updated YAML
  writeFileSync(yamlPath, yamlContent);
  console.log(`\n  Summary: ${downloaded} downloaded, ${failed} failed`);
}

async function main() {
  console.log("🌍 Batch Image Downloader for Trip YAMLs");
  console.log("━".repeat(50));

  const yamlFiles = readdirSync(YAMLS_DIR).filter((f) => f.endsWith(".yaml"));
  console.log(`Found ${yamlFiles.length} YAML files\n`);

  for (const yamlFile of yamlFiles) {
    await processYaml(yamlFile);
  }

  console.log("\n" + "━".repeat(50));
  console.log("✅ Done!");
}

main().catch(console.error);
