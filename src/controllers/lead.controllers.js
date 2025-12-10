import Lead from "../models/lead.model.js";
import { fetchNationality } from "../utils/fetchNationality.js";

export const processBatch = async (req, res) => {
  try {
    const { names } = req.body;
    const nameArr = names.split(",").map(name => name.trim());

    const results = await Promise.all(
      nameArr.map(async (name) => {
        const userCountryData = await fetchNationality(name);
        const status = userCountryData.probability > 0.6 ? "Verified" : "To Check";
        const lead = await Lead.create({ name, country: userCountryData.country, probability: userCountryData.probability, status });
        return lead;
      })
    );
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