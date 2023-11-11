import axios from "axios";
import cheerio from "cheerio";

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
