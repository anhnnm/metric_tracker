import { DataSource } from "typeorm";
import { Metric, MetricType, User } from "../models/index";

export class Database {
  private static connection: DataSource;

  public static getInstance(): DataSource {
    if (!this.connection) {
      this.connection = new DataSource({
        type: "sqlite",
        database: process.env.DB_NAME || "metric.db",
        entities: [Metric, MetricType, User],
        synchronize: true,
        logging: false,
      });
    }

    return this.connection;
  }

  public static async initialize(): Promise<DataSource> {
    const dataSource = this.getInstance();
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
      console.log("✅ Database initialized");
    }
    return dataSource;
  }
}
