import {LabelModel} from './label.model';
import {TodoPriority} from '../../../../../../server/modules/todo/enums/todo-priority.enum';

export interface TodoModel {
  id: number;
  title: string;
  state: 'pending' | 'completed';
  active: boolean;
  description?: string;
  labels?: LabelModel[];
  priority?: TodoPriority;
  startDate?: Date;
  dueDate?: Date;
  hasDueDate?: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
  order?: number;
}
