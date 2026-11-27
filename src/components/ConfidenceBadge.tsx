import type { Confidence } from "../data/schema";

const label: Record<Confidence, string> = {
  verified: "Verified",
  likely: "Likely",
  uncertain: "Unverified",
};

const title: Record<Confidence, string> = {
  verified: "Confirmed from an official order guide or brochure.",
  likely: "Several secondary sources agree, but not confirmed from an official document.",
  uncertain: "Single source or best guess. Double-check before relying on it.",
};

/** Small badge; renders nothing for verified or missing values to keep the page calm. */
export function ConfidenceBadge({ value }: { value?: Confidence }) {
  if (!value || value === "verified") return null;
  return (
    <span className={`confidence confidence-${value}`} title={title[value]}>
      {label[value]}
    </span>
  );
}
