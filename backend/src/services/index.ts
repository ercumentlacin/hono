import axios from "axios";
import cheerio from "cheerio";

interface Season {
  malId: string | undefined;
  title: string;
  imageUrl: string | undefined;
  createdDate: string;
  episodesAndDuration: string;
  preLine: string;
}

export const searchAnimeOnMAL = async (animeName: string) => {
  try {
    const response = await axios.get(
      `https://myanimelist.net/search/all?q=${encodeURI(animeName)}&cat=all`
    );
    const html = response.data;
    const $ = cheerio.load(html);
    const searchResults: unknown[] = [];

    // MyAnimeList'teki arama sonuçları sayfasındaki her anime için döngü
    $(".list.di-t.w100").each((index, element) => {
      const title = $(element).find(".information a").text().trim();
      const imageUrl = $(element).find("img").attr("data-src");
      const malId = $(element)
        .find("a")
        ?.attr("href")
        ?.match(/anime\/(\d+)/)?.[1];

      // Sadece belirli bir sayıda sonuç göstermek için kontrol ekleyebilirsiniz
      if (searchResults.length < 5) {
        searchResults.push({ malId, title, imageUrl });
      }
    });

    return searchResults;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const searchSeasonOnMAL = async () => {
  try {
    const response = await axios.get("https://myanimelist.net/anime/season");
    const html = response.data;
    const $ = cheerio.load(html);

    const animeList: Season[] = [];

    $(".seasonal-anime").each((index, element) => {
      const genres: string[] = [];
      const title = $(element).find(".h2_anime_title a").text().trim();
      const imageUrl = $(element).find(".image img").attr("src");
      const malId = $(element)
        .find(".h2_anime_title a")
        ?.attr("href")
        ?.match(/anime\/(\d+)/)?.[1];

      const createdDate = $(element)
        .find(".prodsrc .info .item:nth-child(1)")
        .text()
        .trim();
      const episodesAndDuration = $(element)
        .find(".prodsrc .info .item:nth-child(2)")
        .text()
        .trim()
        .replace("\n          ", "");

      $(element)
        .find(".genre")
        .each((genreIndex, genreElement) => {
          const genre = $(genreElement).find("a").text().trim();

          genres.push(genre);
        });

      const preLine = $(element).find(".preline").text().trim();

      const anime = {
        malId,
        title,
        imageUrl,
        createdDate,
        episodesAndDuration,
        preLine,
        genres,
      };
      animeList.push(anime);
    });

    return animeList;
  } catch (error) {
    console.error(error);
    return [];
  }
};
