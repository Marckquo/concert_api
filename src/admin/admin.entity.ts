import { Show } from "src/show/show.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Admin {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    walletAddress: string;

    @OneToMany(() => Show, (show) => show.owner)
    shows: Show[]
}
