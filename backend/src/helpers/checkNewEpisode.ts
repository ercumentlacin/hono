import { AnimeList, IAnime } from "../modules/anime/model";
import { scrapeLatestEpisodeInfo } from "../services/scraperService";

export const checkNewEpisode = async (anime: IAnime) => {
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