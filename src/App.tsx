import { useMemo, useState } from "react";
import { dataset } from "./data/load";
import { formatUsd } from "./data/format";
import { diffConfigs, packageChange, previousConfig, type Config } from "./data/diff";
import type { Package } from "./data/schema";
import { FeatureItem } from "./components/FeatureItem";
import { PackageCard } from "./components/PackageCard";
import { ConfidenceBadge } from "./components/ConfidenceBadge";
import { CompareView } from "./components/CompareView";

const { data, isSample } = dataset;
const years = [...data.years].sort((a, b) => b.year - a.year);
const names = (pkgs: Package[]) => pkgs.map((p) => p.name).join(", ");
const count = (n: number, one: string, many = one) => `${n} ${n === 1 ? one : many}`;

type Mode = "explore" | "compare";

export default function App() {
  const [mode, setMode] = useState<Mode>("explore");
  const [year, setYear] = useState(years[0]?.year);
  const modelYear = years.find((y) => y.year === year) ?? years[0];
  const [trimId, setTrimId] = useState(modelYear?.trims[0]?.id);
  const [showUnavailable, setShowUnavailable] = useState(false);
  const [showChanges, setShowChanges] = useState(true);
  const [compare, setCompare] = useState<{ from: Config; to: Config } | null>(null);

  const trim = modelYear?.trims.find((t) => t.id === trimId) ?? modelYear?.trims[0];

  const packageNames = useMemo(
    () => Object.fromEntries((modelYear?.packages ?? []).map((p) => [p.id, p.name])),
    [modelYear],
  );

  if (!modelYear || !trim) return <main className="page">No data yet.</main>;

  const current: Config = { year: modelYear, trim };
  const previous = previousConfig(data, current);
  const highlight = showChanges && previous ? previous : undefined;
  const diff = highlight ? diffConfigs(highlight, current) : undefined;

  const openCompare = () => {
    setCompare({ from: previous ?? current, to: current });
    setMode("compare");
  };

  const packages = modelYear.packages.filter((p) => showUnavailable || p.availableOn.includes(trim.id));
  const hiddenCount = modelYear.packages.length - packages.length;
  const newStandard = new Map(diff?.nowStandard.map((c) => [c.id, c]));

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
        <nav className="tabs" aria-label="View">
          <button type="button" className="tab" aria-pressed={mode === "explore"} onClick={() => setMode("explore")}>
            Explore
          </button>
          <button type="button" className="tab" aria-pressed={mode === "compare"} onClick={openCompare}>
            Compare
          </button>
        </nav>
      </header>

      {mode === "compare" && compare ? (
        <CompareView data={data} from={compare.from} to={compare.to} onChange={(from, to) => setCompare({ from, to })} />
      ) : (
        <>
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

          {previous && (
            <div className="changes-bar">
              <label className="toggle">
                <input type="checkbox" checked={showChanges} onChange={(e) => setShowChanges(e.target.checked)} />
                Highlight changes since {previous.year.year}
              </label>
              {diff && (
                <span className="changes-summary">
                  {count(diff.nowStandard.length, "newly standard")} · {count(diff.noLongerStandard.length, "no longer standard")} ·{" "}
                  {count(diff.addedPackages.length, "new package", "new packages")} ·{" "}
                  {count(diff.removedPackages.length, "discontinued")}
                </span>
              )}
              <button type="button" className="link-btn" onClick={openCompare}>
                Full comparison →
              </button>
            </div>
          )}

          {modelYear.notes && <p className="note">{modelYear.notes}</p>}

          <section>
            <h2>
              Standard on {modelYear.year} {trim.name} <ConfidenceBadge value={trim.confidence} />
            </h2>
            {trim.notes && <p className="note">{trim.notes}</p>}
            <ul className="features standard">
              {trim.standardFeatures.map((id) => {
                const c = newStandard.get(id);
                return data.features[id] ? (
                  <FeatureItem
                    key={id}
                    feature={data.features[id]}
                    change={c ? "new" : undefined}
                    note={c?.fromPackages.length ? `was in ${names(c.fromPackages)}` : undefined}
                  />
                ) : null;
              })}
              {diff?.noLongerStandard.map((c) =>
                data.features[c.id] ? (
                  <FeatureItem
                    key={c.id}
                    feature={data.features[c.id]}
                    change="removed"
                    note={c.toPackages.length ? `now in ${names(c.toPackages)}` : "no longer offered"}
                  />
                ) : null,
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
                <PackageCard
                  key={p.id}
                  pkg={p}
                  trim={trim}
                  features={data.features}
                  packageNames={packageNames}
                  change={highlight && p.availableOn.includes(trim.id) ? packageChange(p, highlight) : undefined}
                />
              ))}
            </div>
            {diff && diff.removedPackages.length > 0 && (
              <p className="discontinued">
                <span className="change-badge removed">Discontinued</span> Offered in {previous!.year.year}, gone in{" "}
                {modelYear.year}: {names(diff.removedPackages)}
              </p>
            )}
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
        </>
      )}
    </main>
  );
}
