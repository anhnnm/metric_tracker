import express from "express";
import { MetricController } from "../controllers/MetricController";

const router = express.Router();
const metricController = new MetricController();
router.get("/statistic/:id", (req, res) => metricController.statisticMetricsLatestByDate(req, res));
router.get("/:id", (req, res) => metricController.getMetrics(req, res));
router.post("/", (req, res) => metricController.addMetric(req, res));

export default router;
