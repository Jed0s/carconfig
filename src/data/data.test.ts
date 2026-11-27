import { describe, expect, it } from "vitest";
import type { Dataset } from "./schema";
import { validateDataset } from "./validate";

const files = import.meta.glob<Dataset>("../../data/*.json", { eager: true, import: "default" });

describe("datasets in /data", () => {
  it("has at least one file", () => expect(Object.keys(files).length).toBeGreaterThan(0));

  for (const [path, data] of Object.entries(files)) {
    it(`${path.split("/").pop()} refers only to ids it defines`, () => {
      expect(data.schemaVersion).toBe(1);
      expect(validateDataset(data)).toEqual([]);
    });
  }
});

describe("validateDataset", () => {
  it("flags a feature that replaces an unknown feature", () => {
    const data: Dataset = {
      schemaVersion: 1,
      model: { make: "X", name: "Y", engine: "Z" },
      features: { a: { name: "A", category: "other", hint: "", replaces: "missing" } },
      years: [],
    };
    expect(validateDataset(data)).toEqual(['feature "a": replaces unknown feature "missing"']);
  });
});
