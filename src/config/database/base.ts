import { Entity, PrimaryGeneratedColumn, BaseEntity as Base } from "typeorm";

@Entity()
export class BaseEntity extends Base {
    @PrimaryGeneratedColumn()
    id: string;
}
