"use client";

import { PAGINATION_LIMIT } from "@/lib/data";
import { useState, useMemo } from "react";
import { CSVLink } from "react-csv";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Edit,
  Eye,
  Trash,
  Plus,
  Upload,
  MapPin,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DTRTable({ data }) {
  const ITEMS_PER_PAGE = 10;

  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [filter, setFilter] = useState("");

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      Object.values(item).some(
        (value) =>
          value != null &&
          value.toString().toLowerCase().includes(filter.toLowerCase())
      )
    );
  }, [data, filter]);

  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;
    return [...filteredData].sort((a, b) => {
      if (a[sortColumn] < b[sortColumn])
        return sortDirection === "asc" ? -1 : 1;
      if (a[sortColumn] > b[sortColumn])
        return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortColumn, sortDirection]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedData, currentPage]);

  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  return (
    <div className="container mt-4 font-sans text-gray-900">
      <div className="flex justify-between mb-4">
        <Input
          placeholder="Filter time entries..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        <div className="space-x-2">
          <CSVLink data={filteredData} filename={"dtr_download.csv"}>
            {/*we can still remove some columns and spead other columns*/}
            <Button>
              <Download className="mr-2 h-4 w-4" /> Download List
            </Button>
          </CSVLink>
        </div>
      </div>

      <div className="overflow-x-auto font-sans">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              {["user name", "date", "checkIn", "checkOut", "location"].map(
                (column) => (
                  <th
                    key={column}
                    className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort(column)}
                  >
                    {column === "externalcode" ? "External Code" : column}
                    {sortColumn === column &&
                      (sortDirection === "asc" ? (
                        <ArrowUp className="inline ml-1" />
                      ) : (
                        <ArrowDown className="inline ml-1" />
                      ))}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr key={item.id} className="py-2">
                <td className="px-6 py-3 whitespace-no-wrap border-b border-gray-200">
                  {item.user.username}
                </td>
                <td className="px-6 whitespace-no-wrap border-b border-gray-200">
                  {item.date}
                </td>
                <td className="px-6 whitespace-no-wrap border-b border-gray-200">
                  {item.checkIn}
                </td>
                <td className="px-6  whitespace-no-wrap border-b border-gray-200">
                  {item.checkOut}
                </td>
                <td className="px-6 whitespace-no-wrap border-b border-gray-200">
                  {item.locations.name}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
          {Math.min(currentPage * ITEMS_PER_PAGE, sortedData.length)} of{" "}
          {sortedData.length} entries
        </div>
        <div className="space-x-2">
          <Button
            onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            onClick={() =>
              setCurrentPage((page) => Math.min(page + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
