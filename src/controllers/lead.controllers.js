import Lead from "../models/lead.model.js";
import { fetchNationality } from "../utils/fetchNationality.js";
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const processBatch = async (req, res) => {
  try {
    const { names } = req.body;
    const nameArr = names.split(",").map(n => n.trim());

    const results = [];
    for (let name of nameArr) {
      await wait(100);
      const userCountryData = await fetchNationality(name);
      const status = userCountryData.probability > 0.6 ? "Verified" : "To Check";
      const lead = await Lead.create({ name, country: userCountryData.country, probability: userCountryData.probability, status });
      results.push(lead);
    }

    res.status(200).json({ success: true, data: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const allLeads = async (req, res) => {
  try{
    const leads = await Lead.find();
    res.status(200).json(leads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
}