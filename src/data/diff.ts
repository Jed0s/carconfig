import type { Dataset, Id, ModelYear, Package, Trim } from "./schema";

/** One year + trim combination. */
export interface Config {
  year: ModelYear;
  trim: Trim;
}

/** Where a feature sits for one config. */
export interface Placement {
  standard: boolean;
  /** Packages (offered on this trim) that add the feature. */
  packages: Package[];
}

export function placements(config: Config): Map<Id, Placement> {
  const map = new Map<Id, Placement>();
  const get = (id: Id) => {
    let p = map.get(id);
    if (!p) map.set(id, (p = { standard: false, packages: [] }));
    return p;
  };
  for (const id of config.trim.standardFeatures) get(id).standard = true;
  for (const pkg of offeredPackages(config)) {
    for (const id of pkg.features) get(id).packages.push(pkg);
  }
  return map;
}

export function offeredPackages({ year, trim }: Config): Package[] {
  return year.packages.filter((p) => p.availableOn.includes(trim.id));
}

/** The closest earlier year that offers the same trim, if any. */
export function previousConfig(data: Dataset, current: Config): Config | undefined {
  const earlier = data.years
    .filter((y) => y.year < current.year.year)
    .sort((a, b) => b.year - a.year);
  for (const year of earlier) {
    const trim = year.trims.find((t) => t.id === current.trim.id);
    if (trim) return { year, trim };
  }
  return undefined;
}

export interface FeatureChange {
  id: Id;
  /** Packages that offered it in the "from" config. */
  fromPackages: Package[];
  /** Packages that offer it in the "to" config. */
  toPackages: Package[];
}

export interface ConfigDiff {
  /** Standard in "to", not standard in "from" (may have been in a package). */
  nowStandard: FeatureChange[];
  /** Standard in "from", not standard in "to" (may have moved into a package). */
  noLongerStandard: FeatureChange[];
  /** Not available at all in "from", optional in "to". */
  newOptions: FeatureChange[];
  /** Optional in "from", not available at all in "to". */
  droppedOptions: FeatureChange[];
  /** Optional in both, but in a different set of packages. */
  movedBetweenPackages: FeatureChange[];
  addedPackages: Package[];
  removedPackages: Package[];
}

const ids = (pkgs: Package[]) =>
  pkgs
    .map((p) => p.id)
    .sort()
    .join(",");

export function diffConfigs(from: Config, to: Config): ConfigDiff {
  const a = placements(from);
  const b = placements(to);
  const empty: Placement = { standard: false, packages: [] };
  const diff: ConfigDiff = {
    nowStandard: [],
    noLongerStandard: [],
    newOptions: [],
    droppedOptions: [],
    movedBetweenPackages: [],
    addedPackages: [],
    removedPackages: [],
  };

  for (const id of new Set([...a.keys(), ...b.keys()])) {
    const pa = a.get(id) ?? empty;
    const pb = b.get(id) ?? empty;
    const change: FeatureChange = { id, fromPackages: pa.packages, toPackages: pb.packages };
    if (!pa.standard && pb.standard) diff.nowStandard.push(change);
    else if (pa.standard && !pb.standard) diff.noLongerStandard.push(change);
    else if (pa.standard && pb.standard) continue;
    else if (!pa.packages.length && pb.packages.length) diff.newOptions.push(change);
    else if (pa.packages.length && !pb.packages.length) diff.droppedOptions.push(change);
    else if (ids(pa.packages) !== ids(pb.packages)) diff.movedBetweenPackages.push(change);
  }

  const pkgA = offeredPackages(from);
  const pkgB = offeredPackages(to);
  diff.addedPackages = pkgB.filter((p) => !pkgA.some((q) => q.id === p.id));
  diff.removedPackages = pkgA.filter((p) => !pkgB.some((q) => q.id === p.id));
  return diff;
}

/** How one package's contents changed between two configs (matched by package id). */
export interface PackageChange {
  isNew: boolean;
  addedFeatures: Set<Id>;
  removedFeatures: Id[];
}

export function packageChange(pkg: Package, previous: Config | undefined): PackageChange | undefined {
  if (!previous) return undefined;
  const before = offeredPackages(previous).find((p) => p.id === pkg.id);
  if (!before) return { isNew: true, addedFeatures: new Set(), removedFeatures: [] };
  return {
    isNew: false,
    addedFeatures: new Set(pkg.features.filter((f) => !before.features.includes(f))),
    removedFeatures: before.features.filter((f) => !pkg.features.includes(f)),
  };
}
