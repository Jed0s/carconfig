import type { Dataset, Package } from "../data/schema";
import { diffConfigs, type Config, type FeatureChange } from "../data/diff";
import { formatUsd } from "../data/format";
import { ConfigPicker } from "./ConfigPicker";
import { FeatureItem } from "./FeatureItem";

interface Props {
  data: Dataset;
  from: Config;
  to: Config;
  onChange: (from: Config, to: Config) => void;
}

const names = (pkgs: Package[]) => pkgs.map((p) => p.name).join(", ");
const label = (c: Config) => `${c.year.year} ${c.trim.name}`;

export function CompareView({ data, from, to, onChange }: Props) {
  const d = diffConfigs(from, to);
  const total =
    d.nowStandard.length +
    d.noLongerStandard.length +
    d.newOptions.length +
    d.droppedOptions.length +
    d.movedBetweenPackages.length +
    d.addedPackages.length +
    d.removedPackages.length;

  const group = (
    title: string,
    help: string,
    items: FeatureChange[],
    change: "new" | "removed" | undefined,
    note: (c: FeatureChange) => string | undefined,
  ) =>
    items.length ? (
      <section className="diff-group">
        <h3>
          {title} <span className="count">{items.length}</span>
        </h3>
        <p className="note">{help}</p>
        <ul className="features">
          {items.map((c) =>
            data.features[c.id] ? (
              <FeatureItem key={c.id} feature={data.features[c.id]} change={change} note={note(c)} />
            ) : null,
          )}
        </ul>
      </section>
    ) : null;

  const msrp = (c: Config) => (c.trim.baseMsrpUsd !== undefined ? formatUsd(c.trim.baseMsrpUsd) : "unknown");

  return (
    <>
      <section className="controls compare-controls" aria-label="Choose what to compare">
        <ConfigPicker label="From" data={data} value={from} onChange={(c) => onChange(c, to)} />
        <button type="button" className="swap" aria-label="Swap" onClick={() => onChange(to, from)}>
          ⇄
        </button>
        <ConfigPicker label="To" data={data} value={to} onChange={(c) => onChange(from, c)} />
      </section>

      <p className="compare-summary">
        Base price: {msrp(from)} → {msrp(to)}.{" "}
        {total === 0
          ? `No differences in features or packages between ${label(from)} and ${label(to)}.`
          : `${total} difference${total === 1 ? "" : "s"} going from ${label(from)} to ${label(to)}.`}
      </p>

      <div className="diff-grid">
        {group("Now standard", `Standard on ${label(to)}, not on ${label(from)}.`, d.nowStandard, "new", (c) =>
          c.fromPackages.length ? `was in ${names(c.fromPackages)}` : "was not offered",
        )}
        {group(
          "No longer standard",
          `Standard on ${label(from)}, not on ${label(to)}.`,
          d.noLongerStandard,
          "removed",
          (c) => (c.toPackages.length ? `now in ${names(c.toPackages)}` : "no longer offered"),
        )}
        {group("New options", `Not offered on ${label(from)} at all.`, d.newOptions, "new", (c) =>
          `in ${names(c.toPackages)}`,
        )}
        {group("Options dropped", `Offered on ${label(from)}, gone on ${label(to)}.`, d.droppedOptions, "removed", (c) =>
          `was in ${names(c.fromPackages)}`,
        )}
        {group(
          "Moved between packages",
          "Still optional, but you get it from a different package.",
          d.movedBetweenPackages,
          undefined,
          (c) => `${names(c.fromPackages)} → ${names(c.toPackages)}`,
        )}
        {d.addedPackages.length || d.removedPackages.length ? (
          <section className="diff-group">
            <h3>Packages</h3>
            <p className="note">A renamed package shows up as one removed and one new.</p>
            <ul className="pkg-list">
              {d.addedPackages.map((p) => (
                <li key={"+" + p.id}>
                  <span className="change-badge new">New</span> {p.name}
                </li>
              ))}
              {d.removedPackages.map((p) => (
                <li key={"-" + p.id} className="is-removed">
                  <span className="change-badge removed">Removed</span> <span className="feature-name">{p.name}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </>
  );
}
