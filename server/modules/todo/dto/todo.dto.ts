export interface TodoDto {
    id: number;
    title: string;
    state: 'pending' | 'completed';
    active: boolean;
    description?: string;
    labels?: string[];
    startDate?: Date;
    dueDate?: Date;
    hasDueDate?: boolean;
    createdBy?: string;
    updatedBy?: string;
    createdAt: string;
    updatedAt: string;
}
