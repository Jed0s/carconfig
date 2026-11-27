import type { Package } from "./schema";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export const formatUsd = (n: number) => usd.format(n);

/** Price of a package for one trim, or undefined when unknown. */
export function packagePrice(pkg: Package, trimId: string): number | undefined {
  if (pkg.priceUsd === undefined) return undefined;
  if (typeof pkg.priceUsd === "number") return pkg.priceUsd;
  return pkg.priceUsd[trimId];
}
