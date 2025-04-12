import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Metric } from "./Metric"; // Assuming you have a Metric entity

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;

  @Column({ unique: true, type:'text'})
  email: string;

  @OneToMany(() => Metric, (metric) => metric.user)
  metrics: Metric[];
}