import { describe, expect, it } from "vitest";

import { OFFLINE_HTML, offlineResponse } from "./offline-page";

const EXTERNAL_RESOURCE_RE = /(?:src|href)="(?:https?:)?\/\//u;

describe("offline page", () => {
  it("answers 503 with an uncached HTML page", async () => {
    const response = offlineResponse();
    expect(response.status).toBe(503);
    expect(response.headers.get("content-type")).toBe(
      "text/html; charset=utf-8"
    );
    expect(response.headers.get("cache-control")).toBe("no-store");
    await expect(response.text()).resolves.toBe(OFFLINE_HTML);
  });

  it("covers the four site languages and the contact address", () => {
    for (const lang of ["lt", "en", "uk", "ru"]) {
      expect(OFFLINE_HTML).toContain(`<section lang="${lang}">`);
    }
    expect(OFFLINE_HTML).toContain('href="mailto:info@nesveskvienas.lt"');
  });

  it("loads nothing from other sites", () => {
    expect(OFFLINE_HTML).not.toMatch(EXTERNAL_RESOURCE_RE);
    expect(OFFLINE_HTML).not.toContain("<script");
  });
});
