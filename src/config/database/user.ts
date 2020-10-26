import { Entity, Column, JoinColumn, OneToMany, ManyToOne } from "typeorm";
import { BaseEntity } from "./base";
import { Guild } from "./guild";
import { Profile } from "./profile";

@Entity()
export class GuildUser extends BaseEntity {
    @Column("jsonb")
    @ManyToOne(() => Guild)
    guild: Guild;

    @Column()
    userId: string;

    @Column("jsonb")
    @JoinColumn()
    @OneToMany(() => Profile, (profile) => profile.user)
    profiles: Profile[];

    @Column({ default: 0 })
    xp: number;

    @Column({ default: 1 })
    level: number;
}
