import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Show {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    cid: string;

    @Column()
    contractAddress: string;
}
