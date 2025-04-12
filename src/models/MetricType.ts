import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from "typeorm";
import { Metric } from "./Metric";

@Entity()
export class MetricType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: "text" })
  name: string;

  @CreateDateColumn({ type: "datetime" })
  createdAt: Date;

  @OneToMany(() => Metric, (metric) => metric.metricType)
  metrics: Metric[];
}
