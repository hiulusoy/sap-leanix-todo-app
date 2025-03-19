// Interface for description generation inputs
interface DescriptionInput {
    title: string;
    keywords?: string;
    priority?: string;
    startDate?: string | Date;
    dueDate?: string | Date;
    labels?: string[] | { name: string }[];
    state?: string;
}
