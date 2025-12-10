import cron from "node-cron";
import Lead from "../models/lead.model.js";

export const startSyncCron = () => {
  cron.schedule("*/5 * * * *", async () => {
    console.log("Cron: Checking for verified leads...");

    const verifiedLeads = await Lead.find({ status: "Verified", synced: false });

    for (const lead of verifiedLeads) {
      console.log(`[CRM Sync] Sending verified lead ${lead.name} to Sales Team...`);

      lead.synced = true;
      await lead.save();
    }
  });
};
