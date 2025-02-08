import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EditViewSidebar({ open, mode, user, onClose, onSave }) {
  const [editedUser, setEditedUser] = useState(null);

  useEffect(() => {
    if (user) {
      setEditedUser({ ...user });
    }
  }, [user]);

  if (!open || !editedUser) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (checked) => {
    setEditedUser((prev) => ({
      ...prev,
      status: checked ? "active" : "inactive",
    }));
  };

  const handleRoleChange = (value) => {
    setEditedUser((prev) => ({ ...prev, role: value }));
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(",").map((tag) => tag.trim());
    setEditedUser((prev) => ({ ...prev, tags }));
  };

  const handleSave = () => {
    if (editedUser) {
      onSave(editedUser);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-64 bg-white shadow-lg p-4 transform transition-transform duration-300 ease-in-out">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          {mode === "edit" ? "Edit User" : "View User"}
        </h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X />
        </Button>
      </div>
      <div className="space-y-4">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            value={editedUser.username}
            onChange={handleChange}
            readOnly={mode === "view"}
          />
        </div>
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            value={editedUser.firstName}
            onChange={handleChange}
            readOnly={mode === "view"}
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            value={editedUser.lastName}
            onChange={handleChange}
            readOnly={mode === "view"}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="status">Status</Label>
          <Switch
            id="status"
            checked={editedUser.status === "active"}
            onCheckedChange={handleStatusChange}
            disabled={mode === "view"}
          />
          <span>{editedUser.status}</span>
        </div>
        <div>
          <Label htmlFor="role">Role</Label>
          <Select
            value={editedUser.role}
            onValueChange={handleRoleChange}
            disabled={mode === "view"}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="User">User</SelectItem>
              <SelectItem value="Guest">Guest</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="tags">Tags</Label>
          <Input
            id="tags"
            name="tags"
            value={editedUser.tags}
            onChange={handleTagsChange}
            readOnly={mode === "view"}
          />
        </div>
      </div>
      {mode === "edit" && (
        <Button className="mt-4 w-full" onClick={handleSave}>
          Save Changes
        </Button>
      )}
    </div>
  );
}
