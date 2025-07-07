

export interface Task {
  id: string;
  tag?: string;
  title: string;
  dueDate?: string
}

export interface ColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  /*This is a callback function that allows the child (Column) to update
  part of the parent's state (Board)
  */
  activeId?: string | null
}

export interface PopupProps {
  isOpen: boolean;
  // position: {x: number, y: number};
  onClose: () => void;
  children: React.ReactNode;
}