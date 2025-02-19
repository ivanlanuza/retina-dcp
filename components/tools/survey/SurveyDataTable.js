"use client";

import { PAGINATION_LIMIT } from "@/lib/data";
import { useState, useMemo } from "react";
import { CSVLink } from "react-csv";
import Link from "next/link";
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
  ListTodo,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";
import DeleteModal from "../../core/DeleteModal";
import SurveyDataView from "./SurveyDataView";

export default function SurveyDataTable({ surveydata, onSave }) {
  const [data, setData] = useState(surveydata);
  const ITEMS_PER_PAGE = PAGINATION_LIMIT;

  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [filter, setFilter] = useState("");
  const [editViewSidebar, setEditViewSidebar] = useState({
    open: false,
    mode: "view",
    surveyid: null,
  });
  const [deleteModal, setDeleteModal] = useState({ open: false, user: null });

  const filteredData = useMemo(() => {
    return data.filter((user) =>
      Object.values(user).some(
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

  const handleView = (survey) => {
    setEditViewSidebar({ open: true, mode: "view", surveyid: survey });
  };

  const handleDelete = (survey) => {
    setDeleteModal({ open: true, survey });
  };

  async function confirmDelete() {
    if (deleteModal.survey) {
      const token = localStorage.getItem("token");
      let datapass = JSON.stringify({
        surveyid: deleteModal.survey.id,
      });

      const response = await fetch("/api/survey/admin/delete", {
        body: datapass,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "PUT",
      });
      if (response.ok) {
        setDeleteModal({ open: false, user: null });
        onSave();
      }
    }
  }

  return (
    <div className="container mt-4 font-sans text-gray-900">
      <div className="flex justify-between mb-4">
        <Input
          placeholder="Filter surveys..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        <div className="space-x-2">
          <Link href="/tools/surveycreate">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Button>
          </Link>
          <CSVLink data={filteredData} filename={"survey_download.csv"}>
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
              {["title", "status", "description"].map((column) => (
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
                  {item.title}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                  <Badge
                    variant={item.status === "open" ? "secondary" : "outline"}
                  >
                    {item.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                  {item.description.substring(0, 40)}
                </td>

                <td className="px-2 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 font-medium">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleView(item.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleResponses(item)}
                  >
                    <ListTodo className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item)}
                    className="text-red-300"
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

      <SurveyDataView
        open={editViewSidebar.mode}
        mode={editViewSidebar.mode}
        surveyid={editViewSidebar.surveyid}
        onClose={() => setEditViewSidebar({ open: false })}
      />

      <DeleteModal
        open={deleteModal.open}
        onClose={() => {
          setDeleteModal({ open: false, survey: null });
        }}
        onConfirm={(e) => confirmDelete()}
        username={deleteModal.survey?.title}
        title="Are you sure you want to delete this survey?"
        description={`This action cannot be undone. This will permanently delete the survey ${deleteModal.survey?.title} and remove their data from our servers.`}
        proceedbutton={`Delete ${deleteModal.survey?.title}`}
      />
    </div>
  );
}
