import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import { TodoState } from '../enums/todo-state.enum';
import { TodoPriority } from '../enums/todo-priority.enum';
import { TodoLabelEntity } from './todo-label.entity';

@Entity({ name: 'todos' })
export class TodoEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 255 })
    title!: string;

    @Column({
        type: 'enum',
        enum: TodoState,
        default: TodoState.Pending
    })
    state!: TodoState;

    @Column({
        type: 'enum',
        enum: TodoPriority,
        default: TodoPriority.Medium
    })
    priority!: TodoPriority;

    @Column({ default: true })
    active!: boolean;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column({ type: 'timestamp', nullable: true })
    startDate?: Date;

    @Column({ type: 'timestamp', nullable: true })
    dueDate?: Date;

    @Column({ default: false })
    hasDueDate!: boolean;

    @Column({ type: 'varchar', length: 100, nullable: true })
    createdBy?: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    updatedBy?: string;

    @Column({ type: 'int', default: 0 })
    order!: number;

    @ManyToMany(() => TodoLabelEntity, label => label.todos, { cascade: false })
    @JoinTable({ name: 'todo_labels_link' })
    labels!: TodoLabelEntity[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;
}
