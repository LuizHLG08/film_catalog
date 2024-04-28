import { Films } from "src/modules/films/entities/films.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"

@Entity({name: 'users'})
export class Users {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({name: 'name', nullable: false})
    name: string;
    
    @Column({name: 'email', nullable: false, unique: true})
    email: string;

    @Column({name: 'password', nullable: false})
    password: string;

    @OneToMany(() => Films, films => films.owner)
    films?: Films[];

    @CreateDateColumn({name: 'created_at'})
    createdAt: string;

    @CreateDateColumn({name: 'updated_at'})
    updatedAt: string;
}
