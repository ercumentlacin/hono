/* eslint-disable no-await-in-loop */
/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
import { AnimeList } from "../modules/anime/model";
import { User } from "../modules/user/model";

import { checkAndSendEmail } from "./checkAndSendEmail";
import { checkNewEpisode } from "./checkNewEpisode";

export const checkForNewEpisodesAndNotify = async ({
  _User = User,
  _AnimeList = AnimeList,
  _checkNewEpisode = checkNewEpisode,
  _checkAndSendEmail = checkAndSendEmail,
} = {}) => {
  const users = await _User.find();
  for (const user of users) {
    const animeList = await _AnimeList.findOne({ user: user._id });
    if (!animeList) continue;
    for (const anime of animeList.animes) {
      const isNewEpisodeAvailable = await _checkNewEpisode({ anime });
      if (isNewEpisodeAvailable) {
        await _checkAndSendEmail({ user, anime });
      }
    }
  }
};
