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
import { Badge } from "@/components/ui/badge";
import DeleteModal from "@/components/core/DeleteModal";

import EditViewSidebar from "./EditViewSidebar";
import AddEntrySidebar from "./AddEntrySidebar";
import { useEffect } from "react";

export default function BrandsDataTable({ data, onSave }) {
  //const [data, setData] = useState(locationsdata);
  const ITEMS_PER_PAGE = PAGINATION_LIMIT;

  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [filter, setFilter] = useState("");
  const [editViewSidebar, setEditViewSidebar] = useState({
    open: false,
    mode: "view",
    item: null,
  });
  const [addEntrySidebar, setAddEntrySidebar] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, item: null });

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

  const handleEdit = (item) => {
    setEditViewSidebar({ open: true, mode: "edit", item });
  };

  const handleView = (item) => {
    setEditViewSidebar({ open: true, mode: "view", item });
  };

  const handleDelete = (item) => {
    setDeleteModal({ open: true, item });
  };

  async function confirmDelete() {
    if (deleteModal.item) {
      const token = localStorage.getItem("token");
      let datapass = JSON.stringify({
        id: deleteModal.item.id,
      });

      const response = await fetch("/api/masterdata/brands/delete", {
        body: datapass,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "DELETE",
      });
      if (response.ok) {
        setDeleteModal({ open: false, item: null });
        onSave();
      }
    }
  }

  return (
    <div className="container mt-4 font-sans text-gray-900">
      <div className="flex justify-between mb-4">
        <Input
          placeholder="Filter brands..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        <div className="space-x-2">
          <Button
            onClick={() => {
              setAddEntrySidebar(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>
          <CSVLink data={filteredData} filename={"brands_download.csv"}>
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
              {["name", "description"].map((column) => (
                <th
                  key={column}
                  className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort(column)}
                >
                  {column}
                  {sortColumn === column &&
                    (sortDirection === "asc" ? (
                      <ArrowUp className="inline ml-1" />
                    ) : (
                      <ArrowDown className="inline ml-1" />
                    ))}
                </th>
              ))}
              <th className="px-4 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                  {item.name}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                  {item.description}
                </td>
                <td className="px-2 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 font-medium">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(item)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleView(item)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
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

      <EditViewSidebar
        open={editViewSidebar.open}
        mode={editViewSidebar.mode}
        item={editViewSidebar.item}
        onClose={() => setEditViewSidebar(false)}
        onSave={onSave}
      />

      <AddEntrySidebar
        open={addEntrySidebar}
        onClose={() => setAddEntrySidebar(false)}
        onSave={onSave}
      />

      <DeleteModal
        open={deleteModal.open}
        onClose={() => {
          setDeleteModal({ open: false, item: null });
        }}
        onConfirm={(e) => confirmDelete()}
        username={deleteModal.item?.name}
        title="Are you sure you want to delete this client account?"
        description={`This action cannot be undone. This will permanently delete the client account ${deleteModal.item?.name} and remove their data from our servers.`}
        proceedbutton={`Delete ${deleteModal.item?.name}`}
      />
    </div>
  );
}
