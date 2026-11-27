import type { Dataset } from "./schema";

/**
 * Picks up every JSON file in /data at build time.
 * A real file (e.g. challenger-3.6.json) wins over its *.sample.json twin.
 */
const files = import.meta.glob<Dataset>("../../data/*.json", {
  eager: true,
  import: "default",
});

function pickDataset(): { data: Dataset; isSample: boolean; file: string } {
  const entries = Object.entries(files).sort(([a], [b]) => a.localeCompare(b));
  const real = entries.find(([path]) => !path.endsWith(".sample.json"));
  const chosen = real ?? entries[0];
  if (!chosen) throw new Error("No dataset found in /data");
  const [path, data] = chosen;
  return { data, isSample: path.endsWith(".sample.json"), file: path.split("/").pop()! };
}

export const dataset = pickDataset();
