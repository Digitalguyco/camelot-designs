// Used only to let the shop display USD alongside the canonical Naira
// price — never for anything that needs to settle real money, so a
// best-effort free API with a hardcoded fallback is fine here.
const FALLBACK_NGN_PER_USD = 1500;

export async function getNgnPerUsd(): Promise<number> {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: 21600 }, // 6 hours
    });
    if (!res.ok) throw new Error(`rate fetch failed: ${res.status}`);
    const data = await res.json();
    const rate = data?.rates?.NGN;
    if (typeof rate === "number" && rate > 0) return rate;
    throw new Error("NGN rate missing from response");
  } catch {
    return FALLBACK_NGN_PER_USD;
  }
}
