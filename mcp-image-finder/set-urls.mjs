#!/usr/bin/env node

import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join, basename } from "path";

const YAMLS_DIR = "/home/max/viaje-tanto-spec/src/content/trips";

const QUERIES = {
  "Ciudad Prohibida vista desde la Plaza de Tiananmén": "Forbidden City Beijing aerial",
  "Tejados de la Ciudad Prohibida vistos desde Jingshan": "Forbidden City rooftops Jingshan",
  "Gran Muralla en la sección de Mutianyu": "Great Wall Mutianyu",
  "Gran Muralla en Mutianyu": "Great Wall Mutianyu",
  "Calle tradicional de un hutong de Beijing": "Beijing hutong street",
  "Hutong tradicional de Beijing": "Beijing hutong",
  "Templo del Cielo en Beijing": "Temple of Heaven Beijing",
  "Templo del Cielo": "Temple of Heaven",
  "Calle nocturna de Beijing": "Beijing Wangfujing night",
  "Ciudad Prohibida y sus patios": "Forbidden City courtyard",
  "Tejados de la Ciudad Prohibida desde Jingshan": "Forbidden City rooftops",
  "Ciudad Prohibida vista desde Tiananmén": "Forbidden City Beijing",
  "Pilares de arenisca de Zhangjiajie entre nubes": "Zhangjiajie pillars clouds",
  "Pilares de Zhangjiajie entre nubes": "Zhangjiajie mountains",
  "Pilares de Zhangjiajie": "Zhangjiajie pillars",
  "Pilares de arenisca de Zhangjiajie": "Zhangjiajie sandstone",
  "Pilares de Zhangjiajie cubiertos por niebla": "Zhangjiajie fog",
  "Ascensor Bailong junto a los acantilados": "Bailong Elevator Zhangjiajie",
  "Ascensor Bailong": "Bailong Elevator",
  "Ascensor Bailong en Zhangjiajie": "Bailong Elevator",
  "Tianzi Mountain entre niebla": "Tianzi Mountain",
  "Tianzi Mountain": "Tianzi Mountain",
  "Montañas de Tianzi entre nubes": "Tianzi Mountain clouds",
  "Puerta del Cielo de Tianmen Mountain": "Tianmen Cave",
  "Puerta del Cielo de Tianmen": "Tianmen Cave",
  "Puerta del Cielo en Tianmen Mountain": "Tianmen Cave",
  "Teleférico de Tianmen sobre las montañas": "Tianmen Mountain cable car",
  "Teleférico de Tianmen": "Tianmen Mountain cable car",
  "Teleférico de Tianmen Mountain": "Tianmen Mountain cable car",
  "Sendero de Golden Whip Stream": "Golden Whip Stream Zhangjiajie",
  "Sendero tranquilo dentro de Zhangjiajie": "Zhangjiajie trail",
  "Pilares de Yuanjiajie": "Yuanjiajie",
  "Mercados de electrónica de Huaqiangbei": "Huaqiangbei electronics",
  "Mercados de Huaqiangbei": "Huaqiangbei",
  "Huaqiangbei en Shenzhen": "Huaqiangbei",
  "Robots y drones expuestos en Shenzhen": "Shenzhen technology",
  "Robots y drones en Shenzhen": "Shenzhen technology",
  "Robots y drones expuestos en Huaqiangbei": "Huaqiangbei",
  "Componentes electrónicos y puestos de reparación": "Huaqiangbei components",
  "Componentes electrónicos en Huaqiangbei": "Huaqiangbei",
  "Componentes electrónicos y puestos de reparación en Shenzhen": "Huaqiangbei",
  "Tiendas de electrónica de Huaqiangbei": "Huaqiangbei shops",
  "Distrito de Futian iluminado": "Futian Shenzhen night",
  "Distrito de Futian iluminado de noche": "Futian Shenzhen night",
  "Distrito de Futian": "Futian Shenzhen",
  "Shenzhen Bay y skyline moderno": "Shenzhen Bay skyline",
  "Shenzhen Bay y skyline": "Shenzhen Bay skyline",
  "Shenzhen Bay": "Shenzhen Bay",
  "Puerto y paseo de Shekou Sea World": "Shekou Shenzhen",
  "Drones y prototipos en Shenzhen": "Shenzhen drones",
  "Futian iluminado": "Futian Shenzhen night",
  "Skyline nocturno de Chongqing junto a los ríos": "Chongqing skyline night",
  "Skyline nocturno de Chongqing": "Chongqing skyline night",
  "Monorriel de Liziba atravesando un edificio": "Chongqing monorail",
  "Monorriel de Liziba": "Chongqing monorail",
  "Monorriel de Chongqing": "Chongqing monorail",
  "Hongya Cave iluminada": "Hongya Cave",
  "Raffles City y Chaotianmen de noche": "Raffles City Chongqing",
  "Raffles City y Chaotianmen": "Raffles City Chongqing",
  "Hot pot tradicional de Chongqing": "Chongqing hotpot",
  "Hot pot de Chongqing": "Chongqing hotpot",
  "Calles y comida de Chongqing": "Chongqing street food",
  "Hot pot y calles de Chongqing": "Chongqing hotpot",
  "Hot pot y skyline nocturno de Chongqing": "Chongqing night",
  "Chongqing iluminado": "Chongqing night",
  "Skyline nocturno de Shanghai visto desde el río": "Shanghai Pudong night",
  "Shanghai de noche": "Shanghai skyline night",
  "Shanghai Pudong nocturno": "Shanghai Pudong night",
  "Casas iluminadas sobre los acantilados de Wangxian Valley": "Wangxian Valley night",
  "Río, puente y construcciones tradicionales en Wangxian Valley": "Wangxian Valley",
  "Río y puente dentro de Wangxian Valley": "Wangxian Valley bridge",
  "Wangxian Valley iluminado": "Wangxian Valley",
  "Calle de Wangxian Valley de noche": "Wangxian Valley night",
};

async function search(q) {
  try {
    const p = new URLSearchParams({
      action: "query", list: "search", srsearch: q,
      srnamespace: "6", srlimit: "2", format: "json", origin: "*"
    });
    const r = await fetch(`https://commons.wikimedia.org/w/api.php?${p}`, {
      headers: { "User-Agent": "trip-finder/1.0" }, signal: AbortSignal.timeout(15000)
    });
    if (r.status === 429) return "rate_limit";
    const d = await r.json();
    return d.query?.search || [];
  } catch { return "error"; }
}

async function getUrl(title) {
  try {
    const p = new URLSearchParams({
      action: "query", titles: title, prop: "imageinfo",
      iiprop: "url", iiurlwidth: "1920", format: "json", origin: "*"
    });
    const r = await fetch(`https://commons.wikimedia.org/w/api.php?${p}`, {
      headers: { "User-Agent": "trip-finder/1.0" }, signal: AbortSignal.timeout(15000)
    });
    if (r.status === 429) return null;
    const d = await r.json();
    const page = Object.values(d.query?.pages || {})[0];
    return page?.imageinfo?.[0]?.thumburl || page?.imageinfo?.[0]?.url || null;
  } catch { return null; }
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  console.log("🔗 Setting Wikimedia URLs (incremental save)\n");

  const files = readdirSync(YAMLS_DIR).filter(f => f.endsWith(".yaml"));

  for (const yamlFile of files) {
    const yamlPath = join(YAMLS_DIR, yamlFile);
    let yaml = readFileSync(yamlPath, "utf-8");
    const slug = basename(yamlFile, ".yaml");

    // Find nulls
    const lines = yaml.split("\n");
    const missing = [];
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes("src: null")) {
        for (let j = i + 1; j < Math.min(lines.length, i + 8); j++) {
          const m = lines[j].match(/alt:\s*"(.+?)"/);
          if (m) { missing.push({ line: i, alt: m[1] }); break; }
        }
      }
    }

    console.log(`📄 ${yamlFile} — ${missing.length} null`);
    let ok = 0, fail = 0;

    for (const item of missing) {
      const query = QUERIES[item.alt] || item.alt;
      process.stdout.write(`  "${item.alt}" → `);

      await sleep(5000);
      const results = await search(query);

      if (results === "rate_limit") { console.log("⏳ rate limit, skip"); fail++; continue; }
      if (results === "error" || !results || results.length === 0) { console.log("❌"); fail++; continue; }

      await sleep(3000);
      const url = await getUrl(results[0].title);
      if (!url) { console.log("❌ no url"); fail++; continue; }

      // Update and SAVE immediately
      const yLines = readFileSync(yamlPath, "utf-8").split("\n");
      yLines[item.line] = yLines[item.line].replace('src: null', `src: "${url}"`);
      writeFileSync(yamlPath, yLines.join("\n"));

      console.log(`✅`);
      ok++;
    }

    console.log(`  → ${ok} found, ${fail} failed\n`);
  }

  console.log("✅ Done!");
}

main().catch(e => console.error("Fatal:", e.message));
