import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ObjectID,
    ObjectIdColumn,
    BaseEntity,
} from "typeorm";

@Entity()
export class Profile extends BaseEntity {
    @ObjectIdColumn()
    @PrimaryGeneratedColumn()
    id: ObjectID;

    @Column()
    guildId: string;

    @Column()
    userId: string;

    @Column({ default: 0 })
    xp: number;

    @Column({ default: 1 })
    level: number;

    @Column("json")
    fields: Record<string, string>;
}
