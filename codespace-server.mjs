#!/usr/bin/env node
/**
 * Coding Circle Codespace Server — Standalone Codebase API
 *
 * A lightweight HTTP server that provides codebase access APIs for the
 * Coding Circle Dashboard. Runs in any GitHub Codespace regardless of
 * the project's technology stack.
 *
 * Usage:
 *   CODESPACE_TOKEN=your_secret PROJECT_PATH=/workspaces/repo node codespace-server.mjs
 *
 * No npm install required — uses only Node.js built-ins.
 */

import { createServer } from "http";
import { readFile, writeFile, readdir, stat, mkdir, access } from "fs/promises";
import { exec } from "child_process";
import { promisify } from "util";
import { join, resolve, relative, extname, dirname } from "path";
import { URL } from "url";

const execAsync = promisify(exec);

// Configuration
const PORT = 3001;
const CODESPACE_TOKEN = process.env.CODESPACE_TOKEN;
const PROJECT_PATH = process.env.PROJECT_PATH || process.cwd();

// Validate token is configured
if (!CODESPACE_TOKEN) {
  console.error("ERROR: CODESPACE_TOKEN environment variable is not set.");
  console.error("Set it before starting the server:");
  console.error("  CODESPACE_TOKEN=your_secret node codespace-server.mjs");
  process.exit(1);
}

// File extensions to include in context
const CODE_EXTENSIONS = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".json", ".md", ".css", ".scss",
  ".html", ".sql", ".yaml", ".yml", ".sh", ".py", ".go", ".rs",
  ".java", ".c", ".cpp", ".h", ".dart", ".swift", ".kt", ".rb"
]);

// Directories to skip
const SKIP_DIRS = new Set([
  "node_modules", ".git", ".next", "dist", "build", "coverage",
  "__pycache__", ".cache", ".turbo", ".dart_tool", ".pub-cache"
]);

/**
 * Validate that a path is safe (no path traversal)
 */
function validatePath(basePath, filePath) {
  // Reject paths with ..
  if (filePath.includes("..")) {
    return { valid: false, error: "Path traversal (..) is not allowed" };
  }

  const resolved = resolve(basePath, filePath);
  const baseResolved = resolve(basePath);

  // Ensure resolved path is within base directory
  if (!resolved.startsWith(baseResolved)) {
    return { valid: false, error: "Path resolves outside project directory" };
  }

  return { valid: true, resolved };
}

/**
 * Parse URL query parameters
 */
function parseQuery(url) {
  const parsed = new URL(url, "http://localhost");
  const params = {};
  for (const [key, value] of parsed.searchParams) {
    params[key] = value;
  }
  return { pathname: parsed.pathname, params };
}

/**
 * Parse JSON body from request
 */
async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

/**
 * Send JSON response
 */
function sendJson(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-codespace-token"
  });
  res.end(JSON.stringify(data));
}

/**
 * Recursively list files in a directory
 */
async function listFilesRecursive(dir, basePath, maxDepth = 5, currentDepth = 0) {
  if (currentDepth >= maxDepth) return [];

  const files = [];
  try {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      // Skip hidden files (except .context) and ignored directories
      if (entry.name.startsWith(".") && entry.name !== ".context") continue;
      if (SKIP_DIRS.has(entry.name)) continue;

      const fullPath = join(dir, entry.name);
      const relativePath = relative(basePath, fullPath);

      if (entry.isDirectory()) {
        files.push(relativePath + "/");
        const subFiles = await listFilesRecursive(fullPath, basePath, maxDepth, currentDepth + 1);
        files.push(...subFiles);
      } else if (entry.isFile()) {
        const ext = extname(entry.name).toLowerCase();
        if (CODE_EXTENSIONS.has(ext) || entry.name === "Dockerfile" || entry.name === "Makefile") {
          files.push(relativePath);
        }
      }
    }
  } catch (e) {
    // Directory not readable, skip
  }

  return files;
}

/**
 * Route: GET /api/codebase/validate-path
 */
async function handleValidatePath(params) {
  const projectPath = params.projectPath || PROJECT_PATH;

  try {
    await access(projectPath);
    const stats = await stat(projectPath);

    if (!stats.isDirectory()) {
      return { valid: false, path: projectPath, error: "Path is not a directory" };
    }

    return { valid: true, path: projectPath };
  } catch (e) {
    return { valid: false, path: projectPath, error: `Path not found: ${e.message}` };
  }
}

/**
 * Route: GET /api/codebase/status
 */
async function handleStatus(params) {
  const projectPath = params.projectPath || PROJECT_PATH;

  try {
    // Get current branch
    const { stdout: branchOut } = await execAsync(
      `git -C "${projectPath}" branch --show-current`
    );
    const branch = branchOut.trim() || "unknown";

    // Get git status
    const { stdout: statusOut } = await execAsync(
      `git -C "${projectPath}" status --porcelain`
    );

    const lines = statusOut.trim().split("\n").filter(Boolean);
    const modified = [];
    const untracked = [];

    for (const line of lines) {
      const status = line.substring(0, 2);
      const file = line.substring(3);

      if (status.includes("?")) {
        untracked.push(file);
      } else {
        modified.push(file);
      }
    }

    return { branch, modified, untracked };
  } catch (e) {
    // Not a git repo or git not available
    return { branch: "unknown", modified: [], untracked: [], error: e.message };
  }
}

/**
 * Route: GET /api/codebase/read
 */
async function handleRead(params) {
  const projectPath = params.projectPath || PROJECT_PATH;
  const filePath = params.filePath;

  if (!filePath) {
    return { error: "filePath parameter is required" };
  }

  const validation = validatePath(projectPath, filePath);
  if (!validation.valid) {
    return { error: validation.error };
  }

  try {
    const content = await readFile(validation.resolved, "utf-8");
    const stats = await stat(validation.resolved);
    const lines = content.split("\n").length;

    return {
      content,
      path: filePath,
      size: stats.size,
      lines
    };
  } catch (e) {
    return { error: `Failed to read file: ${e.message}` };
  }
}

/**
 * Route: POST /api/codebase/write
 */
async function handleWrite(body) {
  const projectPath = body.projectPath || PROJECT_PATH;
  const filePath = body.filePath;
  const content = body.content;
  const operation = body.operation || "write";

  if (!filePath) {
    return { success: false, error: "filePath is required" };
  }

  const validation = validatePath(projectPath, filePath);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  try {
    if (operation === "delete") {
      const { unlink } = await import("fs/promises");
      await unlink(validation.resolved);
      return { success: true, path: filePath, operation: "deleted" };
    }

    if (operation === "create") {
      // Check if file already exists
      try {
        await access(validation.resolved);
        return { success: false, error: "File already exists" };
      } catch {
        // File doesn't exist, good to create
      }
    }

    // Ensure directory exists
    await mkdir(dirname(validation.resolved), { recursive: true });

    // Write the file
    await writeFile(validation.resolved, content || "", "utf-8");

    return { success: true, path: filePath, operation };
  } catch (e) {
    return { success: false, error: `Failed to ${operation} file: ${e.message}` };
  }
}

/**
 * Route: GET /api/codebase/context
 */
async function handleContext(params) {
  const projectPath = params.projectPath || PROJECT_PATH;

  try {
    // Check for .context directory
    const contextDir = join(projectPath, ".context");
    let contextContent = "";
    const files = [];

    try {
      await access(contextDir);
      // Read all .md files from .context/
      const contextFiles = await readdir(contextDir);
      for (const file of contextFiles) {
        if (file.endsWith(".md")) {
          const content = await readFile(join(contextDir, file), "utf-8");
          contextContent += `\n\n## ${file}\n\n${content}`;
          files.push(`.context/${file}`);
        }
      }
    } catch {
      // No .context directory, list top-level files instead
      const topLevel = await readdir(projectPath);
      for (const entry of topLevel) {
        if (entry.startsWith(".")) continue;
        const stats = await stat(join(projectPath, entry));
        files.push(stats.isDirectory() ? `${entry}/` : entry);
      }
      contextContent = "No .context directory found. Top-level files listed.";
    }

    return { context: contextContent.trim(), files };
  } catch (e) {
    return { error: `Failed to get context: ${e.message}` };
  }
}

/**
 * Route: POST /api/codebase/index
 */
async function handleIndex(body) {
  const projectPath = body.projectPath || PROJECT_PATH;

  try {
    // List all code files
    const files = await listFilesRecursive(projectPath, projectPath);

    // Create .context directory if it doesn't exist
    const contextDir = join(projectPath, ".context");
    await mkdir(contextDir, { recursive: true });

    // Generate index.md
    const indexContent = `# Codebase Index

Generated: ${new Date().toISOString()}
Project: ${projectPath}
Files indexed: ${files.length}

## File Listing

${files.map(f => `- ${f}`).join("\n")}
`;

    await writeFile(join(contextDir, "index.md"), indexContent, "utf-8");

    return { success: true, filesIndexed: files.length };
  } catch (e) {
    return { success: false, error: `Failed to index: ${e.message}` };
  }
}

/**
 * Route: GET /api/codebase/files
 * Lists files in a directory (for list_files tool)
 */
async function handleFiles(params) {
  const projectPath = params.projectPath || PROJECT_PATH;
  const directory = params.directory || "";

  const validation = validatePath(projectPath, directory);
  if (!validation.valid) {
    return { error: validation.error };
  }

  const targetDir = directory ? validation.resolved : projectPath;

  try {
    const files = await listFilesRecursive(targetDir, projectPath, 3);
    return { files, directory: directory || "." };
  } catch (e) {
    return { error: `Failed to list files: ${e.message}` };
  }
}

/**
 * Route: GET /api/codebase/search
 * Searches for a pattern in files (for search_files tool)
 */
async function handleSearch(params) {
  const projectPath = params.projectPath || PROJECT_PATH;
  const query = params.query;
  const directory = params.directory || "";

  if (!query) {
    return { error: "query parameter is required" };
  }

  let searchPath = projectPath;
  if (directory) {
    const validation = validatePath(projectPath, directory);
    if (!validation.valid) {
      return { error: validation.error };
    }
    searchPath = validation.resolved;
  }

  try {
    // Use grep to search for the pattern
    const { stdout } = await execAsync(
      `grep -rn --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --include="*.json" --include="*.md" --include="*.css" --include="*.html" --include="*.py" --include="*.go" --include="*.dart" --include="*.yaml" --include="*.yml" "${query.replace(/"/g, '\\"')}" "${searchPath}" 2>/dev/null || true`,
      { maxBuffer: 1024 * 1024 }
    );

    const matches = [];
    const lines = stdout.trim().split("\n").filter(Boolean);

    for (const line of lines.slice(0, 50)) { // Limit to 50 matches
      const colonIndex = line.indexOf(":");
      if (colonIndex === -1) continue;

      const filePath = line.substring(0, colonIndex);
      const rest = line.substring(colonIndex + 1);
      const secondColon = rest.indexOf(":");
      const lineNum = secondColon > 0 ? parseInt(rest.substring(0, secondColon), 10) : 0;
      const excerpt = secondColon > 0 ? rest.substring(secondColon + 1).trim() : rest;

      matches.push({
        file: relative(projectPath, filePath),
        line: lineNum,
        excerpt: excerpt.substring(0, 200),
      });
    }

    return { matches, query, totalMatches: lines.length };
  } catch (e) {
    return { error: `Search failed: ${e.message}` };
  }
}

/**
 * Main request handler
 */
async function handleRequest(req, res) {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, x-codespace-token"
    });
    res.end();
    return;
  }

  // Authenticate
  const token = req.headers["x-codespace-token"];
  if (token !== CODESPACE_TOKEN) {
    sendJson(res, 401, { error: "Unauthorized: Invalid or missing x-codespace-token" });
    return;
  }

  // Parse request
  const { pathname, params } = parseQuery(req.url);

  try {
    // Route requests
    if (pathname === "/api/codebase/validate-path" && req.method === "GET") {
      const result = await handleValidatePath(params);
      sendJson(res, result.valid === false && result.error ? 400 : 200, result);
    }
    else if (pathname === "/api/codebase/status" && req.method === "GET") {
      const result = await handleStatus(params);
      sendJson(res, 200, result);
    }
    else if (pathname === "/api/codebase/read" && req.method === "GET") {
      const result = await handleRead(params);
      sendJson(res, result.error ? 400 : 200, result);
    }
    else if (pathname === "/api/codebase/write" && req.method === "POST") {
      const body = await parseBody(req);
      const result = await handleWrite(body);
      sendJson(res, result.success ? 200 : 400, result);
    }
    else if (pathname === "/api/codebase/context" && req.method === "GET") {
      const result = await handleContext(params);
      sendJson(res, result.error ? 400 : 200, result);
    }
    else if (pathname === "/api/codebase/index" && req.method === "POST") {
      const body = await parseBody(req);
      const result = await handleIndex(body);
      sendJson(res, result.success ? 200 : 400, result);
    }
    else if (pathname === "/api/codebase/files" && req.method === "GET") {
      const result = await handleFiles(params);
      sendJson(res, result.error ? 400 : 200, result);
    }
    else if (pathname === "/api/codebase/search" && req.method === "GET") {
      const result = await handleSearch(params);
      sendJson(res, result.error ? 400 : 200, result);
    }
    else {
      sendJson(res, 404, { error: `Route not found: ${req.method} ${pathname}` });
    }
  } catch (e) {
    console.error("Request error:", e);
    sendJson(res, 500, { error: e.message });
  }
}

// Start server
const server = createServer(handleRequest);

server.listen(PORT, () => {
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  Coding Circle codebase server running on port " + PORT);
  console.log("  Project: " + PROJECT_PATH);
  console.log("  Token: configured");
  console.log("═══════════════════════════════════════════════════════════");
  console.log("");
  console.log("Endpoints:");
  console.log("  GET  /api/codebase/validate-path?projectPath=...");
  console.log("  GET  /api/codebase/status?projectPath=...");
  console.log("  GET  /api/codebase/read?projectPath=...&filePath=...");
  console.log("  POST /api/codebase/write");
  console.log("  GET  /api/codebase/context?projectPath=...");
  console.log("  POST /api/codebase/index");
  console.log("  GET  /api/codebase/files?projectPath=...&directory=...");
  console.log("  GET  /api/codebase/search?projectPath=...&query=...");
  console.log("");
  console.log("All requests require header: x-codespace-token");
  console.log("");
});
