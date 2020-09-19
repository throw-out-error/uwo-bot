import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ObjectID,
    ObjectIdColumn,
    BaseEntity,
} from "typeorm";

@Entity()
export class Settings extends BaseEntity {
    @ObjectIdColumn()
    @PrimaryGeneratedColumn()
    id: ObjectID;

    @Column()
    guildId: string;

    @Column()
    suggestionChannels: string[];
}
