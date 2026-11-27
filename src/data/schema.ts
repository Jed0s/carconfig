/**
 * Data schema for carconfig.
 *
 * One JSON file per model + engine, stored in `data/<slug>.json`
 * (for example `data/challenger-3.6.json`). Everything a page needs to
 * render comes from that single file.
 */

/** Stable, lowercase kebab-case id, e.g. "blacktop", "parksense-rear". */
export type Id = string;

export interface Dataset {
  /** Bump when the shape changes. */
  schemaVersion: 1;
  model: ModelInfo;
  /**
   * Feature dictionary, keyed by feature id. Trims and packages refer to
   * features by id, so a hint is written once and reused everywhere.
   */
  features: Record<Id, Feature>;
  /** Model years, any order (the UI sorts them). */
  years: ModelYear[];
}

export interface ModelInfo {
  make: string; // "Dodge"
  name: string; // "Challenger"
  engine: string; // "3.6L Pentastar V6"
  notes?: string;
}

export type FeatureCategory =
  | "safety"
  | "technology"
  | "comfort"
  | "appearance"
  | "performance"
  | "audio"
  | "other";

export interface Feature {
  name: string; // "ParkView rear back-up camera"
  category: FeatureCategory;
  /** Plain-language explanation shown as the hover/tap hint. */
  hint: string;
  /**
   * Id of a standard feature this one is a style or spec variant of, e.g.
   * "rear-spoiler-black" replaces "rear-spoiler". When a package lists it on a
   * trim that has the original, the UI says "replaces standard ..." instead of
   * "already standard".
   */
  replaces?: Id;
}

export interface ModelYear {
  year: number;
  trims: Trim[];
  packages: Package[];
  notes?: string;
  sources?: Source[];
}

export interface Trim {
  id: Id; // "sxt", "gt"
  name: string; // "SXT"
  /** Base MSRP in USD for that year, if known. */
  baseMsrpUsd?: number;
  /** Features that come standard on this trim. */
  standardFeatures: Id[];
  confidence?: Confidence;
  notes?: string;
}

export interface Package {
  id: Id; // "plus-group"
  name: string; // "Plus Group"
  /** Trim ids this package can be ordered on. */
  availableOn: Id[];
  /** Option price in USD, if known. Can differ per trim. */
  priceUsd?: number | Partial<Record<Id, number>>;
  /** Features the package adds. */
  features: Id[];
  /** Package ids that must also be ordered. */
  requires?: Id[];
  /** Package ids this package already contains. */
  includes?: Id[];
  confidence?: Confidence;
  notes?: string;
  sources?: Source[];
}

/**
 * How sure we are about a trim or package entry.
 * verified: from an official order guide or brochure.
 * likely: from secondary sources that agree.
 * uncertain: single source or from memory; treat with care.
 */
export type Confidence = "verified" | "likely" | "uncertain";

export interface Source {
  title: string;
  url?: string;
}
