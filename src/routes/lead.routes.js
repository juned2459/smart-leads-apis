import { Router } from "express";
import { processBatch, allLeads } from "../controllers/lead.controllers.js";

const router = Router();

router.route("/process").post(processBatch);
router.route("/all").get(allLeads);

export default router;
