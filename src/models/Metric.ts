import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { MetricType } from "./MetricType";
import { User } from "./User";

@Entity()
export class Metric {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("float")
  value: number;

  @Column("text")
  unit: string;

  @Column("float")
  defaultValue: number;

  @Column({ type: "date" })
  date: Date;

  @CreateDateColumn({ type: "datetime" })
  createdAt: Date;

  @ManyToOne(() => MetricType, (metricType) => metricType.metrics, {
    eager: true,
  })
  @JoinColumn({ name: "metricTypeId" })
  metricType: MetricType;
  
  @ManyToOne(() => User, (user) => user.metrics) // Many metrics can belong to one user
  @JoinColumn({ name: "userId" }) // This specifies the column in Metric table for foreign key
  user: User;
}
