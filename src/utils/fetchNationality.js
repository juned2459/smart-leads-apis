import axios from "axios";

export const fetchNationality = async (name) => {
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
};
