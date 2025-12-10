import axios from "axios";
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchNationality = async (name) => {
  try {
    const url = `https://api.nationalize.io?name=${name}`;
    const res = await axios.get(url);

    if (!res.data.country.length) {
      return { country: "Unknown", probability: 0 };
    }

    const best = res.data.country[0];
    return {
      country: best.country_id,
      probability: best.probability
    };

  } catch (err) {
    // If API limit reached → wait + retry
    if (err.response?.status === 429) {
      console.log("⚠️ Rate limit hit. Waiting 1.5 seconds...");
      await wait(1500);
      return fetchNationality(name); // retry
    }

    console.log("❌ API error:", err.message);
    return { country: "Unknown", probability: 0 };
  }
};
