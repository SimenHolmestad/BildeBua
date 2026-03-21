import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../../..");

export default async function globalSetup() {
  execFileSync(
    "bash",
    ["-lc", "source .venv/bin/activate && python3 -m scripts.reset_e2e_state && python3 -m scripts.seed_e2e_screenshots"],
    { cwd: repoRoot, stdio: "inherit" }
  );
}
