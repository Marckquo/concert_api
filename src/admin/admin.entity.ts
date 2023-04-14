import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Show } from "../show/show.entity";

@Entity()
export class Admin {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    walletAddress: string;

    @OneToMany(() => Show, (show) => show.owner)
    shows: Show[]
}
