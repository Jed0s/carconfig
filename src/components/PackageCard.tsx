import type { Dataset, Package, Trim } from "../data/schema";
import { formatUsd, packagePrice } from "../data/format";
import { FeatureItem } from "./FeatureItem";
import { ConfidenceBadge } from "./ConfidenceBadge";

interface Props {
  pkg: Package;
  trim: Trim;
  features: Dataset["features"];
  packageNames: Record<string, string>;
}

export function PackageCard({ pkg, trim, features, packageNames }: Props) {
  const available = pkg.availableOn.includes(trim.id);
  const price = packagePrice(pkg, trim.id);
  const standard = new Set(trim.standardFeatures);

  return (
    <article className={`card${available ? "" : " is-unavailable"}`}>
      <header className="card-head">
        <h3>
          {pkg.name} <ConfidenceBadge value={pkg.confidence} />
        </h3>
        <span className="price">
          {!available ? "Not offered on " + trim.name : price !== undefined ? formatUsd(price) : "Price unknown"}
        </span>
      </header>

      {(pkg.requires?.length || pkg.includes?.length) && (
        <p className="deps">
          {pkg.requires?.length ? (
            <>Requires {pkg.requires.map((id) => packageNames[id] ?? id).join(", ")}. </>
          ) : null}
          {pkg.includes?.length ? (
            <>Includes {pkg.includes.map((id) => packageNames[id] ?? id).join(", ")}.</>
          ) : null}
        </p>
      )}

      <ul className="features">
        {pkg.features.map((id) => {
          const f = features[id];
          if (!f) return null;
          return <FeatureItem key={id} feature={f} tag={standard.has(id) ? "already standard" : undefined} />;
        })}
      </ul>

      {pkg.notes && <p className="note">{pkg.notes}</p>}
    </article>
  );
}
