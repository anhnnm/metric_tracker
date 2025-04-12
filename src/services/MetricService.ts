import { Database } from "../config/database";
import { Metric, MetricType } from "../models/index";
import { CommonHelper } from "../helper/CommonHelper";
import {
  METRIC_TYPES,
  UNITS,
  DATABASE_TABLE,
  ERROR_MESSAGE,
} from "../constants/CommonConstants";
import { User } from "../models/User";

export default class MetricService {
  // Lấy danh sách tất cả metric types
  async getAllMetricByTypes(query, userId) {
    let { type, unit } = query;
    if (isNaN(parseInt(userId))) throw new Error(ERROR_MESSAGE.INVALID_USER);

    const existingUser = await Database.getInstance().manager.findOneBy(User, {
      id: userId,
    });
    if (!existingUser) throw new Error(ERROR_MESSAGE.INVALID_USER);

    if (!type) throw Error(ERROR_MESSAGE.INVALID_TYPE);

    const existingMetricType = await Database.getInstance().manager.findOneBy(
      MetricType,
      { name: type }
    );
    if (!existingMetricType) throw new Error(ERROR_MESSAGE.INVALID_METRIC_TYPE);

    if (!unit) {
      unit =
        type == METRIC_TYPES.DISTANCE
          ? UNITS.DISTANCE.METER
          : type == METRIC_TYPES.TEMPERATURE
          ? UNITS.TEMPERATURE.C
          : null;
    }

    const isValidUnit = CommonHelper.isValidConstant(
      unit.toLocaleUpperCase(),
      UNITS[type.toLocaleUpperCase()],
      unit
    );
    if (!isValidUnit) throw Error(ERROR_MESSAGE.INVALID_UNIT);

    const result = await Database.getInstance().manager.find(Metric, {
      where: {
        metricType: {
          name: type,
        },
        user: {
          id: userId,
        },
      },
      relations: ["metricType", "user"],
      select: ["defaultValue", "date"],
    });
    if (!result || result.length == 0) return [];

    const mappedResult = result.map((r) => {
      const value =
        type == METRIC_TYPES.DISTANCE
          ? CommonHelper.convertMetertoSpecifyUnit(r.defaultValue, unit)
          : CommonHelper.convertCelsiusToSpecifyUnit(r.defaultValue, unit);
      return { date: r.date, value, unit };
    });

    return mappedResult;
  }

  async statisticMetricsLatestByDate(query, userId) {
    let { type, period, unit } = query;
    const existingUser = await Database.getInstance().manager.findOneBy(User, {
      id: userId,
    });
    if (!existingUser) throw new Error(ERROR_MESSAGE.INVALID_USER);

    if (isNaN(period)) throw new Error(ERROR_MESSAGE.INVALID_PERIOD);

    if (!type) throw Error(ERROR_MESSAGE.INVALID_TYPE);

    const existingMetricType = await Database.getInstance().manager.findOneBy(
      MetricType,
      { name: type }
    );
    if (!existingMetricType) throw new Error(ERROR_MESSAGE.INVALID_METRIC_TYPE);

    if (!unit) {
      unit =
        type == METRIC_TYPES.DISTANCE
          ? UNITS.DISTANCE.METER
          : type == METRIC_TYPES.TEMPERATURE
          ? UNITS.TEMPERATURE.C
          : null;
    }

    const isValidUnit = CommonHelper.isValidConstant(
      unit.toLocaleUpperCase(),
      UNITS[type.toLocaleUpperCase()],
      unit
    );
    if (!isValidUnit) throw Error(ERROR_MESSAGE.INVALID_UNIT);

    const { fromDate, toDate } = CommonHelper.getFromToDateByPeriod(
      period,
      "months"
    );
    const rawQuery = `WITH CTE AS (
    SELECT m.date, m.defaultValue,
           ROW_NUMBER() OVER (PARTITION BY userId, date ORDER BY m.createdAt DESC) AS RowNum
    FROM ${DATABASE_TABLE.METRIC} m
    JOIN ${DATABASE_TABLE.METRIC_TYPE} mt ON m.metricTypeId = mt.id
    WHERE mt.name = ?
      AND m.date BETWEEN ? AND ? and m.userId=?
    )
    SELECT date, defaultValue
    FROM CTE
    WHERE RowNum = 1
    ORDER BY date DESC;
`;
    const result = await Database.getInstance().query(rawQuery, [
      type,
      fromDate,
      toDate,
      userId,
    ]);

    const mappedResult = result.map((r) => {
      const value =
        type == METRIC_TYPES.DISTANCE
          ? CommonHelper.convertMetertoSpecifyUnit(r.defaultValue, unit)
          : CommonHelper.convertCelsiusToSpecifyUnit(r.defaultValue, unit);
      return { date: r.date, value, unit };
    });

    return mappedResult;
  }

  async addMetric(data, userId) {
    if (
      !data ||
      !data.date ||
      !data.unit ||
      isNaN(data.value) ||
      !data.metricType ||
      isNaN(parseInt(userId))
    )
      throw new Error(ERROR_MESSAGE.DATA_EMPTY);

    const isValidDate = CommonHelper.isValidDate(data.date);
    if (!isValidDate) throw new Error(ERROR_MESSAGE.INVALID_DATE);

    const existingMetricType = await Database.getInstance().manager.findOneBy(
      MetricType,
      { name: data.metricType }
    );
    if (!existingMetricType) throw new Error(ERROR_MESSAGE.INVALID_METRIC_TYPE);

    const existingUser = await Database.getInstance().manager.findOneBy(User, {
      id: userId,
    });
    if (!existingUser) throw new Error(ERROR_MESSAGE.INVALID_USER);

    const isValidUnit = CommonHelper.isValidConstant(
      data.unit.toLocaleUpperCase(),
      UNITS[data.metricType.toLocaleUpperCase()],
      data.unit
    );
    if (!isValidUnit) throw Error(ERROR_MESSAGE.INVALID_UNIT);

    const defaultValue =
      data.metricType == METRIC_TYPES.DISTANCE
        ? CommonHelper.converToMeter(data.value, data.unit)
        : CommonHelper.convertToCelsius(data.value, data.unit);

    const newMetric = new Metric();
    newMetric.date = data.date;
    newMetric.metricType = existingMetricType;
    newMetric.value = data.value;
    newMetric.unit = data.unit;
    newMetric.defaultValue = defaultValue;
    newMetric.user = existingUser;
    await Database.getInstance().getRepository(Metric).save(newMetric);
  }
}
