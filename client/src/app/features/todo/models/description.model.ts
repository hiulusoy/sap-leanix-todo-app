export interface DescriptionInputModel {
  title: string;
  keywords?: string;
  priority?: string;
  startDate?: string | Date;
  dueDate?: string | Date;
  labels?: string[];
  state?: string;
}
