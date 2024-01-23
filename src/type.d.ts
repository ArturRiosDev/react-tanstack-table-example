// import { ColumnDef } from "@tanstack/react-table";

export interface ReactTableProps<T extends Cols> {
  data: T[];
}

export type Cols = {
  id: number;
  name: string;
  lastName: string;
  email: string;
  country: string;
  dateOfBirth: string;
};
