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

export default function AddEntrySidebar({ open, onClose, onSave, rolelist }) {
  const [newUser, setNewUser] = useState({
    username: "",
    firstName: "",
    lastName: "",
    status: "active",
    role: "User",
    tags: [],
  });

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (checked) => {
    setNewUser((prev) => ({
      ...prev,
      status: checked ? "active" : "inactive",
    }));
  };

  const handleRoleChange = (value) => {
    setNewUser((prev) => ({ ...prev, role: value }));
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(",").map((tag) => tag.trim());
    setNewUser((prev) => ({ ...prev, tags }));
  };

  const handleSave = () => {
    onSave(newUser);
    setNewUser({
      username: "",
      firstName: "",
      lastName: "",
      status: "active",
      role: "User",
      tags: [],
    });
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg p-4 transform transition-transform duration-300 ease-in-out">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Add New User</h2>
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
            value={newUser.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="firstName">Password</Label>
          <Input
            id="password"
            name="password"
            value={newUser.password}
            onChange={handleChange}
            type="password"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="status">Status</Label>
          <Switch
            id="status"
            checked={newUser.status === "active"}
            onCheckedChange={handleStatusChange}
          />
          <span>{newUser.status}</span>
        </div>
        <div>
          <Label htmlFor="role">Role</Label>
          <Select value={newUser.role} onValueChange={handleRoleChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {rolelist.map((role) => (
                <SelectItem key={role.id} value={role.name}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="tags">Tags</Label>
          <Input
            id="tags"
            name="tags"
            value={newUser.tags.join(", ")}
            onChange={handleTagsChange}
            placeholder="Comma-separated tags"
          />
        </div>
      </div>
      <Button className="mt-4 w-full" onClick={handleSave}>
        Add User
      </Button>
    </div>
  );
}
