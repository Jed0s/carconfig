import { useId, useState } from "react";
import type { Feature } from "../data/schema";

interface Props {
  feature: Feature;
  /** Shown as a small tag next to the name, e.g. "already standard". */
  tag?: string;
  /** Highlights a change compared with another year. */
  change?: "new" | "removed";
  /** Short extra context under or next to the name, e.g. "was in Plus Package". */
  note?: string;
}

/** A feature name with an info button that reveals a plain-language hint. */
export function FeatureItem({ feature, tag, change, note }: Props) {
  const [open, setOpen] = useState(false);
  const hintId = useId();

  const classes = ["feature", `cat-${feature.category}`];
  if (tag) classes.push("is-muted");
  if (change) classes.push(`is-${change}`);

  return (
    <li className={classes.join(" ")}>
      {change === "new" && <span className="change-badge new">New</span>}
      {change === "removed" && <span className="change-badge removed">Removed</span>}
      <span className="feature-name">
        {feature.name}
        {note && <span className="feature-note">{note}</span>}
      </span>
      {tag && <span className="tag">{tag}</span>}
      <span className="hint-wrap">
        <button
          type="button"
          className="hint-btn"
          aria-label={`What is ${feature.name}?`}
          aria-describedby={hintId}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          onBlur={() => setOpen(false)}
        >
          ?
        </button>
        <span id={hintId} role="tooltip" className={`hint${open ? " is-open" : ""}`}>
          {feature.hint}
        </span>
      </span>
    </li>
  );
}
