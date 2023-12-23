import { beforeEach, describe, expect, it, vi } from "vitest";
import { checkForNewEpisodesAndNotify } from "./checkForNewEpisodesAndNotify";

describe("checkForNewEpisodesAndNotify", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should invoke function of checkAndSendEmail", async () => {
    const users = [
      {
        _id: "1",
        email: "test@mail.com",
      },
    ] as any;

    const find = vi.fn(() => users) as any;
    const checkNewEpisode = vi.fn(() => true) as any;
    const checkAndSendEmail = vi.fn(() => {}) as any;
    const User = {
      find,
    } as any;
    const findOne = vi.fn(() => ({
      animes: [
        {
          malId: 1,
          lastCheckedEpisodeNumber: 1,
        },
      ],
    })) as any;
    const AnimeList = {
      findOne,
    } as any;

    await checkForNewEpisodesAndNotify({
      _User: User,
      _checkNewEpisode: checkNewEpisode,
      _checkAndSendEmail: checkAndSendEmail,
      _AnimeList: AnimeList,
    });

    expect(checkAndSendEmail).toBeCalled();
  });

  it("should not invoke function of checkAndSendEmail if new episode not available", async () => {
    const users = [
      {
        _id: "1",
        email: "test@mail.com",
      },
    ] as any;

    const find = vi.fn(() => users) as any;

    const checkNewEpisode = vi.fn(() => false) as any;
    const checkAndSendEmail = vi.fn(() => {}) as any;
    const User = {
      find,
    } as any;
    const findOne = vi.fn(() => ({
      animes: [
        {
          malId: 1,
          lastCheckedEpisodeNumber: 1,
        },
      ],
    })) as any;
    const AnimeList = {
      findOne,
    } as any;

    await checkForNewEpisodesAndNotify({
      _User: User,
      _checkNewEpisode: checkNewEpisode,
      _checkAndSendEmail: checkAndSendEmail,
      _AnimeList: AnimeList,
    });

    expect(checkAndSendEmail).not.toBeCalled();
  });

  it("continue if animeList falsy", async () => {
    const users = [
      {
        _id: "1",
        email: "test@mail.com",
      },
      {
        _id: "2",
        email: "test2@mail.com",
      },
    ] as any;

    const find = vi.fn(() => users) as any;
    const checkNewEpisode = vi.fn(() => true) as any;
    const checkAndSendEmail = vi.fn(() => {}) as any;
    const User = {
      find,
    } as any;
    const findOne = vi.fn(({ user }) => {
      if (user === "1") {
        return {
          animes: [
            {
              malId: 1,
              lastCheckedEpisodeNumber: 1,
            },
          ],
        };
      }
      return null;
    }) as any;

    const AnimeList = {
      findOne,
    } as any;

    await checkForNewEpisodesAndNotify({
      _User: User,
      _checkNewEpisode: checkNewEpisode,
      _checkAndSendEmail: checkAndSendEmail,
      _AnimeList: AnimeList,
    });

    expect(checkAndSendEmail).toBeCalledTimes(1);
  });
});
