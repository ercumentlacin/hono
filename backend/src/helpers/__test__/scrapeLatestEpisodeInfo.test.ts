import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import { scrapeLatestEpisodeInfo } from "../../services/scraperService";

const mocks = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
}));

vi.mock("axios", async (importActual) => {
  const actual = await importActual<typeof import("axios")>();

  const mockAxios = {
    default: {
      ...actual.default,
      get: mocks.get,
      post: mocks.post,
    },
  };

  return mockAxios;
});

describe("scrapeLatestEpisodeInfo", () => {
  it("should return the latest episode info", async () => {
    const malId = 53887; // Test için bir MyAnimeList ID'si

    const htmlContent = await fs.readFile(
      path.join(
        `/workspaces/hono/backend/src/helpers/__mocks__/anime/${malId}.mock.html`
      ),
      {
        encoding: "utf8",
      }
    );
    const htmlContentEpisodes = await fs.readFile(
      path.join(
        `/workspaces/hono/backend/src/helpers/__mocks__/anime/${malId}.episodes.mock.html`
      ),
      {
        encoding: "utf8",
      }
    );

    mocks.get.mockResolvedValueOnce({
      data: htmlContent,
    });
    mocks.get.mockResolvedValueOnce({
      data: htmlContentEpisodes,
    });
    mocks.get.mockResolvedValueOnce({
      data: "<html>...</html>",
    });

    const result = await scrapeLatestEpisodeInfo(malId);
    expect(result).toBeTruthy();
    if (result) {
      expect(result.episodeNumber).toBeDefined();
      expect(result.releaseDate).toBeDefined();
    }
  });
});
