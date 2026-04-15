#!/usr/bin/env node

/**
 * Installs/updates Obsidian community plugins into .obsidian/plugins.
 * Plugin IDs come from .obsidian/community-plugins.json (if present),
 * or from REQUIRED_PLUGIN_IDS below.
 */

const fs = require("node:fs/promises");
const path = require("node:path");

const REQUIRED_PLUGIN_IDS = [
  "dataview",
  "obsidian-tasks-plugin",
  "templater-obsidian",
  "calendar",
  "obsidian-kanban",
];

const VAULT_ROOT = process.cwd();
const OBSIDIAN_DIR = path.join(VAULT_ROOT, ".obsidian");
const COMMUNITY_PLUGINS_FILE = path.join(OBSIDIAN_DIR, "community-plugins.json");
const PLUGINS_DIR = path.join(OBSIDIAN_DIR, "plugins");
const REGISTRY_URL =
  "https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-plugins.json";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";

function githubHeaders(extraHeaders = {}) {
  const headers = {
    "User-Agent": "obsidian-plugin-installer-script",
    Accept: "application/vnd.github+json",
    ...extraHeaders,
  };

  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }

  return headers;
}

async function readPluginIds() {
  try {
    const raw = await fs.readFile(COMMUNITY_PLUGINS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      throw new Error("Expected an array");
    }
    return [...new Set(parsed.filter((item) => typeof item === "string"))];
  } catch (_error) {
    return REQUIRED_PLUGIN_IDS;
  }
}

async function writeCommunityPlugins(pluginIds) {
  const content = `${JSON.stringify(pluginIds, null, 2)}\n`;
  await fs.mkdir(OBSIDIAN_DIR, { recursive: true });
  await fs.writeFile(COMMUNITY_PLUGINS_FILE, content, "utf8");
}

async function fetchJson(url, headers = {}) {
  const response = await fetch(url, { headers });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Request failed (${response.status}) for ${url}\n${body.slice(0, 250)}`
    );
  }

  return response.json();
}

async function downloadFile(url, destination) {
  const response = await fetch(url, {
    headers: githubHeaders({ Accept: "application/octet-stream" }),
  });
  if (!response.ok) {
    throw new Error(`Failed to download ${url} (${response.status})`);
  }
  const fileBuffer = Buffer.from(await response.arrayBuffer());
  await fs.writeFile(destination, fileBuffer);
}

async function fetchCommunityRegistry() {
  const registry = await fetchJson(REGISTRY_URL, githubHeaders());
  if (!Array.isArray(registry)) {
    throw new Error("Community plugin registry is not an array.");
  }
  const byId = new Map();
  for (const plugin of registry) {
    if (plugin && typeof plugin.id === "string") {
      byId.set(plugin.id, plugin);
    }
  }
  return byId;
}

async function installPlugin(pluginMeta) {
  const { id, repo } = pluginMeta;
  if (!id || !repo) {
    throw new Error(`Plugin metadata incomplete: ${JSON.stringify(pluginMeta)}`);
  }

  console.log(`\n→ Installing ${id} from ${repo}`);

  const releaseUrl = `https://api.github.com/repos/${repo}/releases/latest`;
  const release = await fetchJson(releaseUrl, githubHeaders());
  const assets = Array.isArray(release.assets) ? release.assets : [];
  const assetMap = new Map(assets.map((asset) => [asset.name, asset]));

  const requiredFiles = ["manifest.json", "main.js"];
  const optionalFiles = ["styles.css"];
  const pluginDir = path.join(PLUGINS_DIR, id);
  await fs.mkdir(pluginDir, { recursive: true });

  for (const fileName of requiredFiles) {
    const asset = assetMap.get(fileName);
    if (!asset || !asset.browser_download_url) {
      throw new Error(
        `Release for ${id} is missing required asset: ${fileName}`
      );
    }
    await downloadFile(asset.browser_download_url, path.join(pluginDir, fileName));
    console.log(`  ✓ ${fileName}`);
  }

  for (const fileName of optionalFiles) {
    const asset = assetMap.get(fileName);
    if (!asset || !asset.browser_download_url) {
      continue;
    }
    await downloadFile(asset.browser_download_url, path.join(pluginDir, fileName));
    console.log(`  ✓ ${fileName}`);
  }
}

async function main() {
  const pluginIds = await readPluginIds();
  await fs.mkdir(PLUGINS_DIR, { recursive: true });

  console.log("Fetching Obsidian community plugin registry...");
  const registryById = await fetchCommunityRegistry();

  const pluginMetas = [];
  const missingIds = [];

  for (const id of pluginIds) {
    const meta = registryById.get(id);
    if (!meta) {
      missingIds.push(id);
      continue;
    }
    pluginMetas.push(meta);
  }

  if (missingIds.length > 0) {
    console.warn(
      `Skipping unknown plugin IDs (not found in registry): ${missingIds.join(", ")}`
    );
  }

  if (pluginMetas.length === 0) {
    throw new Error("No valid plugin IDs found to install.");
  }

  for (const pluginMeta of pluginMetas) {
    await installPlugin(pluginMeta);
  }

  await writeCommunityPlugins(pluginIds);
  console.log("\nDone. Plugin files are installed in .obsidian/plugins.");
  console.log(
    "Open Obsidian and ensure Community Plugins + Restricted Mode settings are configured."
  );
}

main().catch((error) => {
  console.error("\nPlugin installation failed.");
  console.error(error.message || error);
  process.exitCode = 1;
});
