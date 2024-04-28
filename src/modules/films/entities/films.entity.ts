import { Users } from "src/modules/users/entities/users.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'films'})
export class Films {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({name: 'name', nullable: false})
    name: string;

    @Column({name: 'year', nullable: false})
    year: number;

    @Column({name: 'price', nullable: false})
    price: number;

    @Column({name: 'description', nullable: false})
    description: string;

    @CreateDateColumn({name: 'created_at'})
    createdAt: string;

    @CreateDateColumn({name: 'updated_at'})
    updatedAt: string;

    @Column({name: 'owner_id', nullable: true})
    ownerId?: string;

    @ManyToOne(() => Users, users => users.id)
    @JoinColumn({name: 'owner', referencedColumnName: 'id'})
    owner?: Users;
}