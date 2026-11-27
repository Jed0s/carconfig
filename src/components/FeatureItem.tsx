import { useId, useState } from "react";
import type { Feature } from "../data/schema";

interface Props {
  feature: Feature;
  /** Shown as a small tag next to the name, e.g. "already standard". */
  tag?: string;
}

/** A feature name with an info button that reveals a plain-language hint. */
export function FeatureItem({ feature, tag }: Props) {
  const [open, setOpen] = useState(false);
  const hintId = useId();

  return (
    <li className={`feature cat-${feature.category}${tag ? " is-muted" : ""}`}>
      <span className="feature-name">{feature.name}</span>
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
