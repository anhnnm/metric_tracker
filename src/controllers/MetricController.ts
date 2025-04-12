import { Request, Response } from "express";
import MetricService from "../services/MetricService";
import { ResponseHelper } from "../helper/ResponseHelper";

export class MetricController {
  private metricService: MetricService;
  constructor() {
    this.metricService = new MetricService();
  }
  async getMetrics(req: Request, res: Response) {
    try {
      const metrics = await this.metricService.getAllMetricByTypes(
        req.query,
        req.params.id
      );
      ResponseHelper.success(res, "Success", metrics);
    } catch (error) {
      ResponseHelper.error(res, error.message);
    }
  }

  // Thêm một metric mới
  async addMetric(req: Request, res: Response) {
    try {
      await this.metricService.addMetric(req.body, req.headers.userid);
      ResponseHelper.success(res, "Success");
    } catch (error) {
      ResponseHelper.error(res, error.message);
    }
  }

  async statisticMetricsLatestByDate(req: Request, res: Response) {
    try {
      const metrics = await this.metricService.statisticMetricsLatestByDate(
        req.query,
        req.params.id
      );
      ResponseHelper.success(res, "Success", metrics);
    } catch (error) {
      ResponseHelper.error(res, error.message);
    }
  }
}
