/* eslint-disable no-await-in-loop */
/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
import { AnimeList } from "../modules/anime/model";
import { User } from "../modules/user/model";

import { checkAndSendEmail } from "./checkAndSendEmail";
import { checkNewEpisode } from "./checkNewEpisode";

export const checkForNewEpisodesAndNotify = async () => {
  const users = await User.find();
  for (const user of users) {
    const animeList = await AnimeList.findOne({ user: user._id });
    if (!animeList) continue;
    for (const anime of animeList.animes) {
      const isNewEpisodeAvailable = await checkNewEpisode(anime);
      if (isNewEpisodeAvailable) {
        await checkAndSendEmail(user, anime);
      }
    }
  }
};
