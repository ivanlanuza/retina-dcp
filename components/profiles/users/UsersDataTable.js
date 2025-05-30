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
import DeleteModal from "../../core/DeleteModal";
import EditViewSidebar from "./EditViewSidebar";
import AddEntrySidebar from "./AddEntrySidebar";
import AssignLocationsSidebar from "./AssignLocationsSidebar";
import { useEffect } from "react";

export default function UsersDataTable({ userdata, rolelist, agencylist, teamlist, onSave }) {
  const [data, setData] = useState(userdata);
  const ITEMS_PER_PAGE = PAGINATION_LIMIT;

  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [filter, setFilter] = useState("");
  const [editViewSidebar, setEditViewSidebar] = useState({
    open: false,
    mode: "view",
    user: null,
  });
  const [addEntrySidebar, setAddEntrySidebar] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, user: null });
  const [assignLocationsSidebar, setAssignLocationsSidebar] = useState({
    open: false,
    user: null,
  });

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

  const handleEdit = (user) => {
    setEditViewSidebar({ open: true, mode: "edit", user });
  };

  const handleView = (user) => {
    setEditViewSidebar({ open: true, mode: "view", user });
  };

  const handleDelete = (user) => {
    setDeleteModal({ open: true, user });
  };

  async function confirmDelete() {
    if (deleteModal.user) {
      const token = localStorage.getItem("token");
      let datapass = JSON.stringify({
        userid: deleteModal.user.id,
      });

      const response = await fetch("/api/users/delete", {
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

  const handleAssignLocations = (user) => {
    setAssignLocationsSidebar({ open: true, user });
  };

  const handleSaveLocations = (userId, locations) => {
    setData(
      data.map((user) => (user.id === userId ? { ...user, locations } : user))
    );
    setAssignLocationsSidebar({ open: false, user: null });
  };

  return (
    <div className="container mt-4 font-sans text-gray-900">
      <div className="flex justify-between mb-4">
        <Input
          placeholder="Filter users..."
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
          <CSVLink data={filteredData} filename={"users_download.csv"}>
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
              {["username", "status", "roleId", "agencyid", "teamid"].map((column) => (
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
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Tags
              </th>
              <th className="px-4 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                  {user.username}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                  <Badge
                    variant={user.status === "ACTIVE" ? "secondary" : "outline"}
                  >
                    {user.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                  {user.role.name}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                  {user?.agency?.name}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                  {user?.team?.name}
                </td>
                <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                  {user.tags &&
                    user.tags.split(",").map((tag) => (
                      <Badge key={tag} variant="outline" className="mr-1">
                        {tag}
                      </Badge>
                    ))}
                </td>
                <td className="px-2 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 font-medium">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(user)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleView(user)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(user)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAssignLocations(user)}
                  >
                    <MapPin className="h-4 w-4" />
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
        user={editViewSidebar.user}
        onClose={() => setEditViewSidebar(false)}
        onSave={onSave}
        rolelist={rolelist}
        agencylist={agencylist}
        teamlist={teamlist}
      />

      <AddEntrySidebar
        open={addEntrySidebar}
        onClose={() => setAddEntrySidebar(false)}
        onSave={onSave}
        rolelist={rolelist}
        agencylist={agencylist}
        teamlist={teamlist}
      />

      <DeleteModal
        open={deleteModal.open}
        onClose={() => {
          setDeleteModal({ open: false, user: null });
        }}
        onConfirm={(e) => confirmDelete()}
        username={deleteModal.user?.username}
        title="Are you sure you want to delete this user?"
        description={`This action cannot be undone. This will permanently delete the user account for ${deleteModal.user?.username} and remove their data from our servers.`}
        proceedbutton={`Delete ${deleteModal.user?.username}`}
      />

      <AssignLocationsSidebar
        open={assignLocationsSidebar.open}
        user={assignLocationsSidebar.user}
        onClose={() => setAssignLocationsSidebar({ open: false, user: null })}
        onSave={handleSaveLocations}
      />
    </div>
  );
}
