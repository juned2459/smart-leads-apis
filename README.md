# Setup Instructions
1. Clone this repository 
   a. git clone https://github.com/juned2459/smart-leads.git
   b. cd smart-leads-apis

2. Install dependencies
   a. npm install

3. Environment setup
   a. Create a file named: /.env
   b. Add the following in .env file :
      PORT=8000
      MONGODB_URI=mongodb path
      CORS_ORIGIN=*
   c. MongoDB will connect to mongodb path

4. Run the server in development mode using npm run dev
5. Run the production build using npm start


# Architectural Explanation
1. Batch API Request Handling
   a. Inside /controllers/lead.controllers.js, names from the frontend are provided as a comma-separated string:
      const nameArr = names.split(",").map(n => n.trim());

   b. Each name is processed sequentially to avoid API rate-limit issues:
      for (let name of nameArr) {
        await wait(100); // small delay
        const userCountryData = await fetchNationality(name);
        ...
      }

2. Status Determination Logic
   a. status = probability > 0.6 ? "Verified" : "To Check";
   
   b. Then each lead is saved to MongoDB:
      await Lead.create({ name, country, probability, status });

3. Preventing Duplicate Syncs
   a. Inside the cron job (cron/syncVerified.js):
   Rule: Sync only that leads which have Verified status and synced is false and its implementation is like that
   const verifiedLeads = await Lead.find({ status: "Verified", synced: false });
   for (const lead of verifiedLeads) {
    console.log(`[CRM Sync] Sending verified lead ${lead.name} to Sales Team...`);
    lead.synced = true;
    await lead.save();
   }

   b. Cron schedule is Runs every 5 minutes :- cron.schedule("*/5 * * * *", async () => { ... })

4. API Endpoints
   a. POST /api/leads/process
      payload request : {"names": "Peter, Aditi, Ravi"}
      api response : { "success": true, "data": [...]}

   b. GET /api/leads/all
      Returns all stored leads.

5. Database Model
   {
    name: String,
    country: String,
    probability: Number,
    status: "Verified" | "To Check",
    synced: Boolean (default: false)
   }

6. Database Screenshot :-
   <img width="1517" height="912" alt="image" src="https://github.com/user-attachments/assets/3e6ab7bf-06df-4b0c-b8dd-722581750dc1" />

