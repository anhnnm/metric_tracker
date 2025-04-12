import express from 'express';
import metricRoutes from './MetricRoute';

const router = express.Router();

// Gộp các route con lại
router.use('/metrics', metricRoutes);
// router.use('/metric-types', metricTypeRoutes);

export default router;
