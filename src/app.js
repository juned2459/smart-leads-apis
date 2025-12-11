import express from "express";
import cors from "cors";
import leadRoutes from "./routes/lead.routes.js";
import { startSyncCron } from "./cron/syncVerified.js";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
 
app.use(express.json({ limit: "16kb" }));

app.get('/', (req, res) => {
  res.send('welcome to smart leads api server');
});
app.use("/api/leads", leadRoutes);

// Start cron
startSyncCron();

export default app ;
