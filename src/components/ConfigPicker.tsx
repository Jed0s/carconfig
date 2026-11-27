import type { Dataset } from "../data/schema";
import type { Config } from "../data/diff";

interface Props {
  label: string;
  data: Dataset;
  value: Config;
  onChange: (c: Config) => void;
}

/** Compact year + trim picker used by Compare mode. */
export function ConfigPicker({ label, data, value, onChange }: Props) {
  const years = [...data.years].sort((a, b) => b.year - a.year);
  return (
    <fieldset className="picker">
      <legend>{label}</legend>
      <select
        aria-label={`${label} year`}
        value={value.year.year}
        onChange={(e) => {
          const year = years.find((y) => y.year === Number(e.target.value))!;
          const trim = year.trims.find((t) => t.id === value.trim.id) ?? year.trims[0];
          onChange({ year, trim });
        }}
      >
        {years.map((y) => (
          <option key={y.year} value={y.year}>
            {y.year}
          </option>
        ))}
      </select>
      <select
        aria-label={`${label} trim`}
        value={value.trim.id}
        onChange={(e) => onChange({ year: value.year, trim: value.year.trims.find((t) => t.id === e.target.value)! })}
      >
        {value.year.trims.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>
    </fieldset>
  );
}
