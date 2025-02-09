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
  const [newrecordusername, setNewRecordUsername] = useState("");
  const [newrecordpassword, setNewRecordPassword] = useState("");
  const [newrecordstatus, setNewRecordStatus] = useState(true);
  const [newrecordrole, setNewRecordRole] = useState("");
  const [newrecordtags, setNewRecordTags] = useState("");
  const [newrecordpasswordconfirm, setNewRecordPasswordConfirm] = useState("");
  const [validationerror, setValidationError] = useState("");

  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    status: "active",
    role: "",
    tags: "",
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

  async function handleSubmitClose(closeonsave) {
    var errorflag = false;
    setValidationError("");

    if (newrecordusername == "" || newrecordusername == null) {
      errorflag = true;
      setValidationError("Please input valid username!");
    }

    if (
      newrecordpassword == "" ||
      newrecordpassword == null ||
      newrecordpassword.length < 4
    ) {
      errorflag = true;
      setValidationError("Please select a better password!");
    }

    if (newrecordpassword != newrecordpasswordconfirm) {
      errorflag = true;
      setValidationError("Passwords do not match!");
    }

    if (newrecordrole == "" || newrecordrole == null) {
      errorflag = true;
      setValidationError("Please select a role!");
    }

    if (errorflag === false) {
      setValidationError("");
      const token = localStorage.getItem("token");
      let datapass = JSON.stringify({
        username: newrecordusername,
        password: newrecordpassword,
        status: newrecordstatus,
        role: newrecordrole,
        tags: newrecordtags,
      });

      const response = await fetch("/api/users/create", {
        body: datapass,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
      });

      if (response.ok) {
        if (closeonsave) {
          onClose();
          onSave();
        }
        setNewRecordPassword("");
        setNewRecordPasswordConfirm("");
        setNewRecordUsername("");
        setNewRecordStatus("");
        setNewRecordRole("");
        setNewRecordTags("");
        setValidationError("");
      }
    }
  }

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
            value={newrecordusername}
            onChange={(e) => {
              setNewRecordUsername(e.target.value);
              setValidationError("");
            }}
          />
        </div>
        <div>
          <Label htmlFor="firstName">Password</Label>
          <Input
            id="password"
            name="password"
            value={newrecordpassword}
            onChange={(e) => {
              setNewRecordPassword(e.target.value);
              setValidationError("");
            }}
            type="password"
          />
        </div>
        <div>
          <Label htmlFor="firstName">Confirm Password</Label>
          <Input
            id="passwordconfirm"
            name="passwordconfirm"
            value={newrecordpasswordconfirm}
            onChange={(e) => {
              setNewRecordPasswordConfirm(e.target.value);
              setValidationError("");
            }}
            type="password"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Label htmlFor="status">Status</Label>
          <Switch
            id="status"
            checked={newrecordstatus}
            onCheckedChange={(e) => {
              setNewRecordStatus(!newrecordstatus);
            }}
          />
          <span>{newUser.status}</span>
        </div>
        <div>
          <Label htmlFor="role">Role</Label>
          <Select
            value={newrecordrole}
            onValueChange={(e) => {
              setNewRecordRole(e);
              //alert(e);
              setValidationError("");
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {rolelist.map((role) => (
                <SelectItem key={role.name} value={role.id}>
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
            value={newrecordtags}
            onChange={(e) => {
              setNewRecordTags(e.target.value);
              setValidationError("");
            }}
            placeholder="Comma-separated tags"
          />
        </div>
      </div>
      <Button className="mt-8 w-full" onClick={(e) => handleSubmitClose(true)}>
        Add User
      </Button>
      <p className="mt-4 text-xs text-red-400">{validationerror}</p>
    </div>
  );
}
