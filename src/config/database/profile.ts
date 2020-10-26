import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "./base";
import { GuildUser } from "./user";

@Entity()
export class Profile extends BaseEntity {
    @Column("jsonb")
    @ManyToOne(() => GuildUser)
    user: GuildUser;

    @Column("jsonb")
    fields: Record<string, string>;

    @Column({ default: false })
    main: boolean;
}
