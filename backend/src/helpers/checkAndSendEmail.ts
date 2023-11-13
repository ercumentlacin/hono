import { AnimeList, IAnime } from "../modules/anime/model";
import EmailLog from "../modules/email/model";
import { IUser } from "../modules/user/model";
import { sendEmailToUser } from "../services/emailService";

export const checkAndSendEmail = async (user: IUser, anime: IAnime) => {
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
