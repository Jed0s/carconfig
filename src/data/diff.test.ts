import { describe, expect, it } from "vitest";
import type { Dataset, ModelYear } from "./schema";
import { diffConfigs, packageChange, previousConfig } from "./diff";

const y2019: ModelYear = {
  year: 2019,
  trims: [{ id: "sxt", name: "SXT", standardFeatures: ["camera", "cloth"] }],
  packages: [
    { id: "plus", name: "Plus", availableOn: ["sxt"], features: ["leather", "heated", "parksense"] },
    { id: "nav", name: "Nav", availableOn: ["sxt"], features: ["nav"] },
    { id: "old", name: "Old", availableOn: ["sxt"], features: ["cd"] },
  ],
};
const y2020: ModelYear = {
  year: 2020,
  trims: [
    { id: "sxt", name: "SXT", standardFeatures: ["camera", "parksense"] },
    { id: "gt", name: "GT", standardFeatures: ["camera"] },
  ],
  packages: [
    { id: "plus", name: "Plus", availableOn: ["sxt"], features: ["leather", "heated", "cloth"] },
    { id: "tech", name: "Tech", availableOn: ["sxt"], features: ["nav", "acc"] },
  ],
};
const data = { years: [y2020, y2019] } as unknown as Dataset;
const from = { year: y2019, trim: y2019.trims[0] };
const to = { year: y2020, trim: y2020.trims[0] };
const names = (xs: { id: string }[]) => xs.map((x) => x.id).sort();

describe("diffConfigs", () => {
  const d = diffConfigs(from, to);
  it("finds features that became standard, remembering their old package", () => {
    expect(names(d.nowStandard)).toEqual(["parksense"]);
    expect(names(d.nowStandard[0].fromPackages)).toEqual(["plus"]);
  });
  it("finds features that left standard and where they went", () => {
    expect(names(d.noLongerStandard)).toEqual(["cloth"]);
    expect(names(d.noLongerStandard[0].toPackages)).toEqual(["plus"]);
  });
  it("separates new, dropped and moved options", () => {
    expect(names(d.newOptions)).toEqual(["acc"]);
    expect(names(d.droppedOptions)).toEqual(["cd"]);
    expect(names(d.movedBetweenPackages)).toEqual(["nav"]);
  });
  it("lists added and removed packages", () => {
    expect(names(d.addedPackages)).toEqual(["tech"]);
    expect(names(d.removedPackages)).toEqual(["nav", "old"]);
  });
});

describe("previousConfig", () => {
  it("finds the closest earlier year with the same trim", () => {
    expect(previousConfig(data, to)?.year.year).toBe(2019);
  });
  it("returns undefined when the trim did not exist before", () => {
    expect(previousConfig(data, { year: y2020, trim: y2020.trims[1] })).toBeUndefined();
  });
});

describe("packageChange", () => {
  it("reports added and removed package items", () => {
    const c = packageChange(y2020.packages[0], from)!;
    expect(c.isNew).toBe(false);
    expect([...c.addedFeatures]).toEqual(["cloth"]);
    expect(c.removedFeatures).toEqual(["parksense"]);
  });
  it("flags packages that did not exist last year", () => {
    expect(packageChange(y2020.packages[1], from)?.isNew).toBe(true);
  });
});
