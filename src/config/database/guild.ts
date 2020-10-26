import { Entity, Column, JoinColumn, OneToMany } from "typeorm";
import { BaseEntity } from "./base";
import { GuildUser } from "./user";

@Entity()
export class Guild extends BaseEntity {
    @Column()
    guildId: string;

    @Column("jsonb")
    @JoinColumn()
    @OneToMany(() => GuildUser, (gu) => gu.guild)
    users: GuildUser[];

    @Column("jsonb")
    suggestionChannels: string[];
}
