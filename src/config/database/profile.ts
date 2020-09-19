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
    id: ObjectID;

    @Column()
    guildId: string;

    @Column()
    userId: string;

    @Column({ default: 0 })
    xp: number;

    @Column({ default: 1 })
    level: number;

    @Column()
    fields: Record<string, string>;
}
