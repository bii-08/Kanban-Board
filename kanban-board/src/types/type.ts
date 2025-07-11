

export type Task = {
  id: string;
  tag?: string;
  title: string;
  dueDate?: string;
  tagColor?: string;
}

export type Columns = {
  todo: Task[];
  inProgress: Task[];
  inReview: Task[];
  done: Task[];
}

export interface ColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  /*This is a callback function that allows the child (Column) to update
  part of the parent's state (Board)
  */
  headingColor: string;
  activeId?: string | null;
  overId?: string | null
}

export interface PopupProps {
  isOpen: boolean;
  // position: {x: number, y: number};
  onClose: () => void;
  children: React.ReactNode;
}