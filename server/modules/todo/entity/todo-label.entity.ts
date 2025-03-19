import {Column, Entity, ManyToMany, PrimaryGeneratedColumn} from 'typeorm';
import {TodoEntity} from "./todo.entity";

@Entity({name: 'todo_labels'})
export class TodoLabelEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: 'varchar', length: 50, unique: true})
    name!: string;

    @ManyToMany(() => TodoEntity, todo => todo.labels)
    todos!: TodoEntity[];
}
