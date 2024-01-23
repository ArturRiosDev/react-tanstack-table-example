import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { Cols, ReactTableProps } from "../type";
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { Button, Input } from "@kofile/gds-react";
import {
  SkipForward,
  SkipBack,
  ArrowFatLinesUp,
  ArrowFatLinesDown,
  MagnifyingGlass,
  ArrowsDownUp,
} from "@phosphor-icons/react";
import { EditableCell } from "./EditableCell";

// declare module '@tanstack/react-table' {
//   interface TableMeta<TData extends RowData> {
//     updateData: (rowIndex: number, columnId: string, value: unknown) => void
//   }
// }



export const SimpleTable = <T extends Cols>({ data }: ReactTableProps<T>) => {

  const [dataTable,setData] = useState(data)

  const cols = useMemo<ColumnDef<T>[]>(
    () => [
      {
        header: "ID",
        accessorKey: "id",
        footer: "My ID",
      },
      //How to personalize a new custom column
      {
        header: "Full Name",
        size: 225,
        accessorFn: (row) => `${row.name} ${row.lastName}`,
      },
      // {
      //   header: "Name",
      //   accessorKey: "name",
      //   footer: "My Name"
      // },
      // {
      //     header: "Last Name",
      //     accessorKey: "lastName",
      //     footer: "My last name"
      //   },
      {
        header: "Email",
        accessorKey: "email",
        footer: "My Email",
      },
      {
        header: "Country",
        accessorKey: "country",
        footer: "My country",
        cell: EditableCell 
      },
      {
        header: "Date of Birth",
        cell: (row) => dayjs(row.getValue() as Date).format("DD/MM/YYYY"),
        accessorKey: "dateOfBirth",
        footer: "My date of birth",
      },
    ],
    []
  );
  //state to sort
  const [sorting, setSorting] = useState<SortingState>([]);
  //state to filter
  const [filtering, setFiltering] = useState("");

  const table = useReactTable({
    data: dataTable,
    columns: cols,
    state: {
      sorting,
      globalFilter: filtering,
    },
    meta :{
      updateData: (rowIndex:number, columnId:string, value:unknown) => setData(
        prev => prev.map(
        (row, index)=>
          index === rowIndex ? {
            ...prev[rowIndex],
            [columnId]: value
          } : row
        )
      )
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
    columnResizeMode: "onChange",
  });

  return (
    <div>
      <div className="flex mb-2">
        <Input altbackground={true}>
          <Input.LeftIcon>
            <MagnifyingGlass size={25} />
          </Input.LeftIcon>
          <Input.Input
            placeholder="Search"
            value={filtering}
            onChange={(e) => setFiltering(e.target.value)}
          />
        </Input>
      </div>
      <table style={{ width: `${table.getCenterTotalSize()}` }}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  style={{ position: "relative", width: `${header.getSize()}` }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  {header.column.getCanSort() && (
                    <ArrowsDownUp
                      style={{ cursor: "pointer" }}
                      size={20}
                      onClick={header.column.getToggleSortingHandler()}
                    />
                  )}
                  {
                    {
                      asc: <ArrowFatLinesUp size={20} />,
                      desc: <ArrowFatLinesDown size={20} />,
                    }[(header.column.getIsSorted() as string) ?? null]
                  }
                  {header.column.getCanResize() && (
                    <div
                    onDoubleClick={()=> header.column.resetSize()}
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      className={`resizer ${
                        header.column.getIsResizing() ? "isResizing" : ""
                      }`}
                    ></div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} style={{ width: cell.column.getSize() }}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((footer) => (
                <th key={footer.id}>
                  {flexRender(
                    footer.column.columnDef.footer,
                    footer.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
      <div className="container mt-2">
        <div className="row d-flex justify-content-between">
          <Button
            size="lg"
            background="outlined"
            variant="neutral"
            className="col-2"
            onClick={() => table.setPageIndex(0)}
          >
            First Page
          </Button>
          <Button
            size="lg"
            background="outlined"
            variant="neutral"
            className="col-2"
            onClick={() => table.previousPage()}
          >
            Previous Page <SkipBack size={20} />
          </Button>
          <Button
            size="lg"
            background="outlined"
            variant="neutral"
            className="col-2"
            onClick={() => table.nextPage()}
          >
            Next Page <SkipForward size={20} />
          </Button>
          <Button
            size="lg"
            background="outlined"
            variant="neutral"
            className="col-2"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          >
            Last Page
          </Button>
        </div>
      </div>
    </div>
  );
};
