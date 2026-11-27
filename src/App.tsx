import { useMemo, useState } from "react";
import { dataset } from "./data/load";
import { formatUsd } from "./data/format";
import { FeatureItem } from "./components/FeatureItem";
import { PackageCard } from "./components/PackageCard";
import { ConfidenceBadge } from "./components/ConfidenceBadge";

const { data, isSample } = dataset;
const years = [...data.years].sort((a, b) => b.year - a.year);

export default function App() {
  const [year, setYear] = useState(years[0]?.year);
  const modelYear = years.find((y) => y.year === year) ?? years[0];
  const [trimId, setTrimId] = useState(modelYear?.trims[0]?.id);
  const [showUnavailable, setShowUnavailable] = useState(false);

  const trim = modelYear?.trims.find((t) => t.id === trimId) ?? modelYear?.trims[0];

  const packageNames = useMemo(
    () => Object.fromEntries((modelYear?.packages ?? []).map((p) => [p.id, p.name])),
    [modelYear],
  );

  if (!modelYear || !trim) return <main className="page">No data yet.</main>;

  const packages = modelYear.packages.filter((p) => showUnavailable || p.availableOn.includes(trim.id));
  const hiddenCount = modelYear.packages.length - packages.length;

  return (
    <main className="page">
      <header className="top">
        <p className="eyebrow">{data.model.make}</p>
        <h1>
          {data.model.name} <span className="engine">{data.model.engine}</span>
        </h1>
        {isSample && (
          <p className="banner" role="status">
            Sample data. Real package data is being researched and will replace it.
          </p>
        )}
      </header>

      <section className="controls" aria-label="Choose a year and trim">
        <fieldset>
          <legend>Year</legend>
          <div className="pills">
            {years.map((y) => (
              <button
                key={y.year}
                type="button"
                className="pill"
                aria-pressed={y.year === modelYear.year}
                onClick={() => {
                  setYear(y.year);
                  if (!y.trims.some((t) => t.id === trimId)) setTrimId(y.trims[0]?.id);
                }}
              >
                {y.year}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>Trim</legend>
          <div className="pills">
            {modelYear.trims.map((t) => (
              <button
                key={t.id}
                type="button"
                className="pill"
                aria-pressed={t.id === trim.id}
                onClick={() => setTrimId(t.id)}
              >
                {t.name}
                {t.baseMsrpUsd !== undefined && <span className="pill-sub">{formatUsd(t.baseMsrpUsd)}</span>}
              </button>
            ))}
          </div>
        </fieldset>
      </section>

      {modelYear.notes && <p className="note">{modelYear.notes}</p>}

      <section>
        <h2>
          Standard on {modelYear.year} {trim.name} <ConfidenceBadge value={trim.confidence} />
        </h2>
        {trim.notes && <p className="note">{trim.notes}</p>}
        <ul className="features standard">
          {trim.standardFeatures.map((id) =>
            data.features[id] ? <FeatureItem key={id} feature={data.features[id]} /> : null,
          )}
        </ul>
      </section>

      <section>
        <div className="section-head">
          <h2>Packages and options</h2>
          {(hiddenCount > 0 || showUnavailable) && (
            <label className="toggle">
              <input
                type="checkbox"
                checked={showUnavailable}
                onChange={(e) => setShowUnavailable(e.target.checked)}
              />
              Show packages not offered on {trim.name}
              {!showUnavailable && ` (${hiddenCount})`}
            </label>
          )}
        </div>
        <div className="grid">
          {packages.map((p) => (
            <PackageCard key={p.id} pkg={p} trim={trim} features={data.features} packageNames={packageNames} />
          ))}
        </div>
      </section>

      {modelYear.sources?.length ? (
        <footer className="sources">
          <h2>Sources</h2>
          <ul>
            {modelYear.sources.map((s) => (
              <li key={s.title}>{s.url ? <a href={s.url}>{s.title}</a> : s.title}</li>
            ))}
          </ul>
        </footer>
      ) : null}
    </main>
  );
}
