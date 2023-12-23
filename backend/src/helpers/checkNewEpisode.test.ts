import { describe, expect, it, vi } from "vitest";
import { checkNewEpisode } from "./checkNewEpisode";

describe("checkNewEpisode", () => {
  it("should return false if latestEpisodeInfo is null", async () => {
    const scrapeLatestEpisodeInfo = vi.fn(() => null) as any;
    const anime = {
      malId: 1,
      lastCheckedEpisodeNumber: 1,
    } as any;
    const result = await checkNewEpisode({
      anime,
      _scrapeLatestEpisodeInfo: scrapeLatestEpisodeInfo,
    });
    expect(result).toBe(false);
  });

  it("should return false if latestEpisodeNumber is less than or equal to lastCheckedEpisodeNumber", async () => {
    const scrapeLatestEpisodeInfo = vi.fn(() => ({
      episodeNumber: "1",
      releaseDate: "2021-01-01",
    })) as any;
    const anime = {
      malId: 1,
      lastCheckedEpisodeNumber: 2,
    } as any;
    const result = await checkNewEpisode({
      anime,
      _scrapeLatestEpisodeInfo: scrapeLatestEpisodeInfo,
    });
    expect(result).toBe(false);
  });

  it("should return false if animeList not founded", async () => {
    const scrapeLatestEpisodeInfo = vi.fn(() => ({
      episodeNumber: "2",
      releaseDate: "2021-01-01",
    })) as any;
    const anime = {
      malId: 1,
      lastCheckedEpisodeNumber: 1,
    } as any;

    const AnimeList = {
      findOne: vi.fn(() => null),
    } as any;

    const result = await checkNewEpisode({
      anime,
      _scrapeLatestEpisodeInfo: scrapeLatestEpisodeInfo,
      _AnimeList: AnimeList,
    });
    expect(result).toBe(false);
  });

  it("should return false if animeToUpdate not founded", async () => {
    const scrapeLatestEpisodeInfo = vi.fn(() => ({
      episodeNumber: "2",
      releaseDate: "2021-01-01",
    })) as any;
    const anime = {
      malId: 1,
      lastCheckedEpisodeNumber: 1,
    } as any;

    const AnimeList = {
      findOne: vi.fn(() => ({
        animes: [],
      })),
    } as any;

    const result = await checkNewEpisode({
      anime,
      _scrapeLatestEpisodeInfo: scrapeLatestEpisodeInfo,
      _AnimeList: AnimeList,
    });
    expect(result).toBe(false);
  });

  it("should return true if animeToUpdate founded", async () => {
    const scrapeLatestEpisodeInfo = vi.fn(() => ({
      episodeNumber: "2",
      releaseDate: "2021-01-01",
    })) as any;
    const anime = {
      malId: 1,
      lastCheckedEpisodeNumber: 1,
    } as any;

    const AnimeList = {
      findOne: vi.fn(() => ({
        animes: [
          {
            malId: 1,
          },
        ],
        save: vi.fn(),
      })),
    } as any;

    const result = await checkNewEpisode({
      anime,
      _scrapeLatestEpisodeInfo: scrapeLatestEpisodeInfo,
      _AnimeList: AnimeList,
    });
    expect(result).toBe(true);
  });
});
