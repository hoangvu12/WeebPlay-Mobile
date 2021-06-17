import axios from "axios";

const BASE_URL = "https://weebplay.glitch.me/api/v1/anime";

class API {
  static async getAnimeList() {
    const URL = BASE_URL;

    return fetchData(URL);
  }

  static async getAnimeInfo(slug) {
    const URL = `${BASE_URL}/info?slug=${slug}`;

    return fetchData(URL);
  }

  static async getEpisodeInfo(animeId, episode = 1) {
    const episodeIndex = episode - 1;

    const URL = `${BASE_URL}/${animeId}/episode/${episodeIndex}`;

    return fetchData(URL);
  }

  static async getAnimeListFromType(typeSlug, page = 1) {
    const URL = `${BASE_URL}/type/${typeSlug}/page/${page}`;

    return fetchData(URL);
  }

  static async searchAnime(query, limit = 24) {
    const URL = `${BASE_URL}/search?keyword=${query}&limit=${limit}`;

    return fetchData(URL);
  }
}

const fetchData = async (URL) => {
  const { data } = await axios.get(URL);

  return data;
};

export default API;
