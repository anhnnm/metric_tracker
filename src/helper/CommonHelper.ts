import { METRIC_TYPES, UNITS } from "../constants/CommonConstants";
import moment from "moment";

export class CommonHelper {
  static isValidDate(dateStr: string): boolean {
    const date = new Date(dateStr);

    return !isNaN(date.getTime());
  }

  static converToMeter(value, unit) {
    switch (unit) {
      case UNITS.DISTANCE.CENTIMETER: // cm to meter
        return value / 100;
      case UNITS.DISTANCE.INCH: // inch to meter
        return value * 0.0254;
      case UNITS.DISTANCE.FEET: // feet to meter
        return value * 0.3048;
      case UNITS.DISTANCE.YARD: // yard to meter
        return value * 0.9144;
      case UNITS.DISTANCE.METER:
        return value;
      default:
        throw new Error(`Unsupported unit: ${unit}`);
    }
  }

  static convertToCelsius(value, unit) {
    switch (unit) {
      case UNITS.TEMPERATURE.C:
        return value;
      case UNITS.TEMPERATURE.F:
        return ((value - 32) * 5) / 9;
      case UNITS.TEMPERATURE.K:
        return value - 273.15;
      default:
        throw new Error(`Unsupported unit: ${unit}`);
    }
  }

  static convertMetertoSpecifyUnit(value, unit) {
    switch (unit) {
      case UNITS.DISTANCE.CENTIMETER:
        return value * 100;
      case UNITS.DISTANCE.INCH:
        return value * 39.3701;
      case UNITS.DISTANCE.FEET:
        return value * 3.28084;
      case UNITS.DISTANCE.YARD:
        return value * 1.09361;
      case UNITS.DISTANCE.METER:
        return value;
      default:
        return 0;
    }
  }

  static convertCelsiusToSpecifyUnit(value: number, unit: string): number {
    switch (unit) {
      case UNITS.TEMPERATURE.F:
        return value * 9;
      case UNITS.TEMPERATURE.K:
        return value + 273.15;
      case UNITS.TEMPERATURE.C:
        return value;
      default:
        throw new Error(`Unsupported temperature unit: ${unit}`);
    }
  }

  static isValidConstant(key, constants, value): boolean {
    return constants[key] == value;
  }

  static getFromToDateByPeriod(period: string, unit) {
    if (!period || !unit) throw new Error("Invalid Parmeter");
    
    const currentDate = moment();
    const toDate = currentDate.format("YYYY-MM-DD");
    const fromDate = currentDate.subtract(period, unit).format("YYYY-MM-DD");

    return { fromDate, toDate };
  }
}
