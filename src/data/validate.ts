import type { Dataset } from "./schema";

/**
 * Checks that every id a dataset refers to actually exists.
 * Returns a list of human-readable problems (empty when the data is consistent).
 */
export function validateDataset(data: Dataset): string[] {
  const problems: string[] = [];
  const featureIds = new Set(Object.keys(data.features));

  for (const [id, f] of Object.entries(data.features)) {
    if (f.replaces && !featureIds.has(f.replaces)) {
      problems.push(`feature "${id}": replaces unknown feature "${f.replaces}"`);
    }
  }

  for (const y of data.years) {
    const trimIds = new Set(y.trims.map((t) => t.id));
    const packageIds = new Set(y.packages.map((p) => p.id));

    for (const t of y.trims) {
      for (const f of t.standardFeatures) {
        if (!featureIds.has(f)) problems.push(`${y.year} trim "${t.id}": unknown feature "${f}"`);
      }
    }

    for (const p of y.packages) {
      const where = `${y.year} package "${p.id}"`;
      for (const f of p.features) {
        if (!featureIds.has(f)) problems.push(`${where}: unknown feature "${f}"`);
      }
      for (const t of p.availableOn) {
        if (!trimIds.has(t)) problems.push(`${where}: unknown trim "${t}"`);
      }
      for (const r of [...(p.requires ?? []), ...(p.includes ?? [])]) {
        if (!packageIds.has(r)) problems.push(`${where}: unknown package "${r}"`);
      }
      if (p.priceUsd && typeof p.priceUsd === "object") {
        for (const t of Object.keys(p.priceUsd)) {
          if (!trimIds.has(t)) problems.push(`${where}: price for unknown trim "${t}"`);
        }
      }
    }
  }
  return problems;
}
