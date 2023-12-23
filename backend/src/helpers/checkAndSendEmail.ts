import { AnimeList, IAnime } from "../modules/anime/model";
import EmailLog from "../modules/email/model";
import { IUser } from "../modules/user/model";
import { sendEmailToUser } from "../services/emailService";

export const findAnimeByMalId = async ({
  malId,
  Model = AnimeList,
}: {
  malId: number;
  Model?: typeof AnimeList;
}) => {
  const animeList = await Model.findOne({ "animes.malId": malId }).lean();
  return animeList;
};

export const checkLogExistOnEmail = async ({
  userId,
  animeId,
  episodeNumber,
  Model = EmailLog,
}: {
  userId: string;
  animeId: number;
  episodeNumber: number;
  Model?: typeof EmailLog;
}) => {
  const emailLogExists = await Model.findOne({
    userId,
    animeId,
    episodeNumber,
  });

  return emailLogExists;
};

export const findLatestEpisodeNumber = ({
  animeList,
  malId,
  lastCheckedEpisodeNumber,
}: {
  animeList: Awaited<ReturnType<typeof findAnimeByMalId>>;
  malId: number;
  lastCheckedEpisodeNumber: number;
}) => {
  let latestEpisodeNumber = lastCheckedEpisodeNumber;
  if (animeList) {
    const foundedAnime = animeList.animes.find((a) => a.malId === malId);
    if (foundedAnime) {
      latestEpisodeNumber = foundedAnime.lastCheckedEpisodeNumber;
    }
  }

  return latestEpisodeNumber;
};

export const checkAndSendEmail = async ({
  user,
  anime,
  _findAnimeByMalId = findAnimeByMalId,
  _sendEmailToUser = sendEmailToUser,
  _findLatestEpisodeNumber = findLatestEpisodeNumber,
  _checkLogExistOnEmail = checkLogExistOnEmail,
}: {
  user: IUser;
  anime: IAnime;
  _findAnimeByMalId?: typeof findAnimeByMalId;
  _sendEmailToUser?: typeof sendEmailToUser;
  _findLatestEpisodeNumber?: typeof findLatestEpisodeNumber;
  _checkLogExistOnEmail?: typeof checkLogExistOnEmail;
}) => {
  const animeList = await _findAnimeByMalId({ malId: anime.malId });

  const latestEpisodeNumber = _findLatestEpisodeNumber({
    animeList,
    malId: anime.malId,
    lastCheckedEpisodeNumber: anime.lastCheckedEpisodeNumber,
  });

  const emailLogExists = await _checkLogExistOnEmail({
    userId: user._id,
    animeId: anime.malId,
    episodeNumber: latestEpisodeNumber,
  });

  if (!emailLogExists) {
    await _sendEmailToUser(user, anime, latestEpisodeNumber);
  }
};
