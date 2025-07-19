import { useState } from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Box,
  Flex,
  Text,
  Icon,
  Skeleton,
} from "@chakra-ui/react";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Props<T> = {
  columns: ColumnDef<T>[];
  data: T[];
  onRowClick?: (row: Row<T>) => void;
  defaultVisibility?: Record<string, boolean>;
  loading?: boolean; // NEW: loading state prop
};

export default function DataGrid<T>({
  defaultVisibility,
  columns,
  data,
  onRowClick,
  loading = false, // NEW: default false
}: Props<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    defaultVisibility || {}
  );
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <Box w="full" overflowX="auto">
      <Table variant="simple" size="sm">
        <Thead bg="gray.50">
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Th
                  key={header.id}
                  fontSize="sm"
                  fontWeight="semibold"
                  whiteSpace="nowrap">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {loading ? (
            // Show skeleton loaders when loading
            Array.from({ length: 5 }).map((_, index) => (
              <Tr key={index}>
                {columns.map((_, colIdx) => (
                  <Td key={colIdx}>
                    <Skeleton height="20px" />
                  </Td>
                ))}
              </Tr>
            ))
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <Tr
                key={row.id}
                cursor={onRowClick ? "pointer" : "default"}
                _hover={onRowClick ? { bg: "gray.50" } : undefined}
                onClick={() => onRowClick?.(row)}
                bg={row.getIsSelected() ? "gray.100" : "transparent"}>
                {row.getVisibleCells().map((cell) => (
                  <Td
                    key={cell.id}
                    fontSize="sm"
                    fontWeight="medium"
                    whiteSpace="nowrap"
                    p={4}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={columns.length} textAlign="center" py={10}>
                No results.
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>

      <Flex
        align="center"
        justify="space-between"
        px={4}
        py={3}
        flexWrap="wrap"
        gap={3}>
        <Text fontSize="sm">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </Text>
        <Flex gap={2}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            isDisabled={!table.getCanPreviousPage() || loading}
            leftIcon={<Icon as={ArrowLeft} boxSize={4} />}>
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            isDisabled={!table.getCanNextPage() || loading}
            rightIcon={<Icon as={ArrowRight} boxSize={4} />}>
            Next
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}
