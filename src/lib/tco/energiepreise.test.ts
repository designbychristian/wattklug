import { describe, expect, it } from "vitest";

import { ENERGIEPREISE_CACHE_V0_1, energiepreisFuer } from "./energiepreise";

describe("energiepreisFuer", () => {
  it("ordnet jeder Antriebsart den passenden Energieträgerpreis zu", () => {
    expect(energiepreisFuer("bev", ENERGIEPREISE_CACHE_V0_1)).toBe(ENERGIEPREISE_CACHE_V0_1.strom);
    expect(energiepreisFuer("diesel", ENERGIEPREISE_CACHE_V0_1)).toBe(ENERGIEPREISE_CACHE_V0_1.diesel);
    expect(energiepreisFuer("fcev", ENERGIEPREISE_CACHE_V0_1)).toBe(ENERGIEPREISE_CACHE_V0_1.wasserstoff);
  });

  it("rechnet Hybrid/PHEV wie einen Benziner", () => {
    expect(energiepreisFuer("hybrid", ENERGIEPREISE_CACHE_V0_1)).toBe(ENERGIEPREISE_CACHE_V0_1.benzin);
    expect(energiepreisFuer("benzin", ENERGIEPREISE_CACHE_V0_1)).toBe(ENERGIEPREISE_CACHE_V0_1.benzin);
  });
});
