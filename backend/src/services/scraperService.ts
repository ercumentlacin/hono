import axios from "axios";
import cheerio from "cheerio";

export const scrapeLatestEpisodeInfo = async (malId: number) => {
  try {
    // İlk olarak ana anime sayfasına gidin
    const mainPageUrl = `https://myanimelist.net/anime/${malId}`;
    let { data } = await axios.get(mainPageUrl);
    let $ = cheerio.load(data);

    // 'Episodes' sayfasının URL'sini bulun
    const episodesPageUrl = $(
      "#horiznav_nav > ul:nth-child(1) > li:nth-child(3) > a:nth-child(1)"
    ).attr("href");

    if (!episodesPageUrl) throw new Error("episodesPageUrl not found");

    // 'Episodes' sayfasına gidin
    data = await axios.get(episodesPageUrl).then((response) => response.data);

    $ = cheerio.load(data);

    // Pagination'dan son sayfaya gitmek için URL'yi bulun
    const lastPageUrl = $(".pagination").find("a.link:last-child").attr("href");

    if (lastPageUrl) {
      // Son sayfaya gidin
      data = await axios.get(lastPageUrl).then((response) => response.data);
      $ = cheerio.load(data);
    }

    // En son bölüm bilgilerini çekin
    const latestEpisode = $(".episode-list-data").last();
    const episodeNumber = latestEpisode.find(".episode-number").text().trim();
    const releaseDate = latestEpisode.find(".episode-aired").text().trim();

    return {
      episodeNumber,
      releaseDate: new Date(releaseDate),
    };
  } catch (error) {
    console.error("Error scraping MyAnimeList:", error);
    return null;
  }
};
