import { spawnSync } from "node:child_process";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/WhiteDent";
if (basePath && !/^\/[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_-]+)*$/.test(basePath)) {
  throw new Error("NEXT_PUBLIC_BASE_PATH must be empty or a path such as /WhiteDent");
}
const result = spawnSync(process.execPath, ["node_modules/next/dist/bin/next", "build"], {
  stdio: "inherit",
  env: { ...process.env, NEXT_PUBLIC_BASE_PATH: basePath, WHITEDENT_STATIC_EXPORT: "1" },
});
if (result.error) throw result.error;
process.exit(result.status ?? 1);
