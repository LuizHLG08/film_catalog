import { Users } from "src/modules/users/entities/users.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: string;

    @Column({name: 'owner_id', nullable: true})
    ownerId?: string;

    @ManyToOne(() => Users, users => users.id)
    @JoinColumn({name: 'owner', referencedColumnName: 'id'})
    owner?: Users;

    constructor(film?: Partial<Films>) {
        this.id = film?.id
        this.name = film?.name
        this.year = film?.year
        this.price = film?.price
        this.description = film?.description
        this.ownerId = film?.ownerId
        this.createdAt = film?.createdAt
        this.updatedAt = film?.updatedAt
    }
}
