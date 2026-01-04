"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  getSortedRowModel,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  const positions = [
    "RW",
    "LW",
    "CB",
    "Pivot",
    "Goalkeeper",
    "Defender",
    "Playmaker",
  ];
  return (
    <div>
      <div className="flex items-center py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-4">
              Filter by Nationality
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            {Array.from(new Set(data.map((item: any) => item.nationality)))
              .filter(Boolean)
              .map((nationality) => (
                <DropdownMenuItem
                  key={nationality}
                  onClick={() =>
                    table.getColumn("nationality")?.setFilterValue(nationality)
                  }
                >
                  {nationality}
                </DropdownMenuItem>
              ))}
            <DropdownMenuItem
              onClick={() => table.getColumn("nationality")?.setFilterValue("")}
            >
              Clear Filter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-4">
              Filter by Club
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            {Array.from(new Set(data.map((item: any) => item.club)))
              .filter(Boolean)
              .map((club) => (
                <DropdownMenuItem
                  key={club}
                  onClick={() => table.getColumn("club")?.setFilterValue(club)}
                >
                  {club}
                </DropdownMenuItem>
              ))}
            <DropdownMenuItem
              onClick={() => table.getColumn("club")?.setFilterValue("")}
            >
              Clear Filter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-4">
              Filter by Position
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            {positions.map((position) => (
              <DropdownMenuItem
                key={position}
                onClick={() =>
                  table.getColumn("position")?.setFilterValue(position)
                }
              >
                {position}
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem
              onClick={() => table.getColumn("position")?.setFilterValue("")}
            >
              Clear Filter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow key={`${row.id}-${index}`}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
