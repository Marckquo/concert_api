import { Admin } from '../admin/admin.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Show {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    cid: string;

    @Column()
    contractAddress: string;
    
    @ManyToOne(() => Admin, (admin) => admin.shows)
    owner: Admin
}
