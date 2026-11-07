import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { tmpdir } from "node:os";
import { createHash } from "node:crypto";

const root = resolve(".");
const output = resolve("out");
const git = (...args) => execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
const expectedOrigin = "https://github.com/FeelFord/WhiteDent.git";
if (git("remote", "get-url", "--push", "origin") !== expectedOrigin) throw new Error("Unexpected push repository");
if (git("status", "--porcelain")) throw new Error("Commit or preserve source changes before publishing");
if (git("branch", "--show-current") !== "main") throw new Error("Publish only from the reviewed main branch");
if (!existsSync(join(output, ".nojekyll"))) throw new Error("Run npm run build:pages first");
if (existsSync(join(output, "CNAME"))) throw new Error("A custom domain is not authorized");
if (createHash("sha256").update(readFileSync(join(output, "brand/whitedent-logo.png"))).digest("hex") !== "6fb759068bdc3016356aedab774851150498bb6f01eb9c7dd9533333d3857de5") throw new Error("Logo differs from the original");

let htmlCount = 0;
function validate(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error("Do not publish symlinks");
    if (entry.isDirectory()) { validate(path); continue; }
    if (/^(?:\.env|\.git$)|\.(?:key|pem|p12|pfx|db|sqlite|zip|log)$/.test(entry.name)) throw new Error("Unexpected confidential/generated file in out");
    if (entry.name.endsWith(".html")) {
      const html = readFileSync(path, "utf8");
      if (!/<meta\b[^>]*name="robots"[^>]*content="[^"]*noindex/.test(html)) throw new Error(`Missing noindex: ${path}`);
      htmlCount++;
    }
  }
}
validate(output);
if (htmlCount < 12) throw new Error("Incomplete static export");
if (!readFileSync(join(output, "index.html"), "utf8").includes("/WhiteDent/_next/")) throw new Error("Wrong base path for GitHub Pages");

const sourceCommit = git("rev-parse", "HEAD");
const remoteLine = git("ls-remote", "--heads", "origin", "refs/heads/gh-pages");
let parent;
if (remoteLine) {
  parent = remoteLine.split(/\s/)[0];
  git("fetch", "--no-tags", "origin", "refs/heads/gh-pages");
  const previous = JSON.parse(git("show", `${parent}:deployment-info.json`));
  if (previous.project !== "WhiteDent-demo") throw new Error("Existing gh-pages is not our demo; refusing to replace it");
}
writeFileSync(join(output, "deployment-info.json"), JSON.stringify({ project: "WhiteDent-demo", sourceCommit, basePath: "/WhiteDent", mode: "demo" }, null, 2) + "\n");

const temporary = mkdtempSync(join(tmpdir(), "whitedent-pages-index-"));
const env = { ...process.env, GIT_INDEX_FILE: join(temporary, "index") };
const gitDir = git("rev-parse", "--absolute-git-dir");
const stage = (...args) => execFileSync("git", [`--git-dir=${gitDir}`, `--work-tree=${output}`, ...args], { cwd: output, env, encoding: "utf8" }).trim();
try {
  stage("read-tree", "--empty");
  stage("add", "--force", "--all", "--", ".");
  const tree = stage("write-tree");
  const commitArgs = ["commit-tree", tree, ...(parent ? ["-p", parent] : []), "-m", `deploy: WhiteDent demo from ${sourceCommit.slice(0, 7)}`];
  const deploymentCommit = git(...commitArgs);
  // One exact branch; never force, never push tags or change the source branch.
  git("-c", "push.followTags=false", "push", "--recurse-submodules=no", "origin", `${deploymentCommit}:refs/heads/gh-pages`);
  const actual = git("ls-remote", "--heads", "origin", "refs/heads/gh-pages").split(/\s/)[0];
  if (actual !== deploymentCommit) throw new Error("Could not verify the remote deployment branch");
  console.log(JSON.stringify({ sourceCommit, deploymentCommit, htmlPages: htmlCount, branch: "gh-pages", expectedUrl: "https://feelford.github.io/WhiteDent/", note: "Confirm Pages is enabled for gh-pages at /(root) and verify the public URL." }, null, 2));
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
