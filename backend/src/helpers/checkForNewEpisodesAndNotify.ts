/* eslint-disable no-await-in-loop */
/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
import { AnimeList, IAnime } from "../modules/anime/model";
import EmailLog from "../modules/email/model";
import { IUser, User } from "../modules/user/model";

// Scrape işlemleri için ayrı bir servis modülü
import { scrapeLatestEpisodeInfo } from "../services/scraperService";

// Email gönderimi için ayrı bir servis modülü
import { sendEmailToUser } from "../services/emailService";

const checkNewEpisode = async (anime: IAnime) => {
  const latestEpisodeInfo = await scrapeLatestEpisodeInfo(anime.malId);

  if (!latestEpisodeInfo) return false;

  const latestEpisodeNumber = parseInt(latestEpisodeInfo.episodeNumber, 10);
  const latestEpisodeDate = new Date(latestEpisodeInfo.releaseDate);

  if (latestEpisodeNumber <= anime.lastCheckedEpisodeNumber) return false;

  const animeList = await AnimeList.findOne({ "animes.malId": anime.malId });
  if (!animeList) return false;

  const animeToUpdate = animeList.animes.find((a) => a.malId === anime.malId);
  if (!animeToUpdate) return false;

  animeToUpdate.lastCheckedEpisodeNumber = latestEpisodeNumber;
  animeToUpdate.lastCheckedEpisodeDate = latestEpisodeDate;
  await animeList.save();

  return true;
};

const checkAndSendEmail = async (user: IUser, anime: IAnime) => {
  let latestEpisodeNumber = anime.lastCheckedEpisodeNumber;

  const animeList = await AnimeList.findOne({ "animes.malId": anime.malId });
  if (animeList) {
    const foundedAnime = animeList.animes.find((a) => a.malId === anime.malId);
    if (foundedAnime) {
      latestEpisodeNumber = foundedAnime.lastCheckedEpisodeNumber;
    }
  }

  console.log({ latestEpisodeNumber });

  const emailLogExists = await EmailLog.findOne({
    userId: user._id,
    animeId: anime.malId,
    episodeNumber: latestEpisodeNumber,
  });

  if (!emailLogExists) {
    await sendEmailToUser(user, anime, latestEpisodeNumber);
  }
};

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
