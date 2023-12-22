import { Mock, describe, expect, it, vi } from "vitest";
import {
  checkLogExistOnEmail,
  findAnimeByMalId,
  findLatestEpisodeNumber,
} from "./checkAndSendEmail";
import { AnimeList } from "../modules/anime/model";
import EmailLog from "../modules/email/model";

describe("checkAndSendEmail", () => {
  describe("findAnimeByMalId", () => {
    const Model = vi.hoisted(() => ({
      findOne: vi.fn(() => ({
        lean: vi.fn(),
      })),
    })) as unknown as typeof AnimeList;

    it("should return null if anime not founded", async () => {
      (Model.findOne as Mock).mockImplementation(() => ({
        lean: () => null,
      }));
      const animeList = await findAnimeByMalId({ malId: 1, Model });

      expect(animeList).toBe(null);
    });

    it("should return animeList if anime founded", async () => {
      (Model.findOne as Mock).mockImplementation(() => ({
        lean: () => ({ animes: [{ malId: 1 }] }),
      }));
      const animeList = await findAnimeByMalId({ malId: 1, Model });

      expect(animeList).toEqual({ animes: [{ malId: 1 }] });
    });
  });

  describe("checkLogExistOnEmail", () => {
    it("should return null if emailLog not founded", async () => {
      const Model = vi.hoisted(() => ({
        findOne: vi.fn(),
      })) as unknown as typeof EmailLog;
      (Model.findOne as Mock).mockResolvedValue(null);
      const emailLogExists = await checkLogExistOnEmail({
        userId: "1",
        animeId: 1,
        episodeNumber: 1,
        Model,
      });

      expect(emailLogExists).toBe(null);
    });

    it("should return emailLog if emailLog founded", async () => {
      const Model = vi.hoisted(() => ({
        findOne: vi.fn(),
      })) as unknown as typeof EmailLog;
      (Model.findOne as Mock).mockResolvedValue({ id: 1 });
      const emailLogExists = await checkLogExistOnEmail({
        userId: "1",
        animeId: 1,
        episodeNumber: 1,
        Model,
      });

      expect(emailLogExists).toEqual({ id: 1 });
    });
  });

  describe("findLatestEpisodeNumber", () => {
    it("should return lastCheckedEpisodeNumber if animeList not founded", () => {
      const animeList = null;
      const malId = 1;
      const lastCheckedEpisodeNumber = 1;
      const latestEpisodeNumber = findLatestEpisodeNumber({
        animeList,
        malId,
        lastCheckedEpisodeNumber,
      });

      expect(latestEpisodeNumber).toBe(1);
    });

    it("should return lastCheckedEpisodeNumber if anime not founded", () => {
      const animeList = {
        animes: [
          {
            imageUrl: "https://cdn.myanimelist.net/images/anime/10/78745.jpg",
            malId: 1,
            title: "Shingeki no Kyojin",
            _id: "60f0b1b9c9b7a4b4e8f1b3b1",
            lastCheckedEpisodeDate: "2021-07-16T15:00:00.000Z",
            lastCheckedEpisodeNumber: 1,
          },
        ],
      } as any;

      const malId = 1;
      const lastCheckedEpisodeNumber = 1;
      const latestEpisodeNumber = findLatestEpisodeNumber({
        animeList,
        malId,
        lastCheckedEpisodeNumber,
      });

      expect(latestEpisodeNumber).toBe(1);
    });
  });

  describe('checkAndSendEmail', () => {  })
});
