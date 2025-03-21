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

export default function EditViewSidebar({
  open,
  mode,
  user,
  onClose,
  onSave,
  rolelist,
  agencylist,
  teamlist
}) {
  const [editedusername, setEditedUsername] = useState("");
  const [editedfirstname, setEditedFirstName] = useState("");
  const [editedlastname, setEditedLastName] = useState("");
  const [editedstatus, setEditedStatus] = useState("");
  const [editedrole, setEditedRole] = useState("");
  const [editedtags, setEditedTags] = useState("");
  const [validationerror, setValidationError] = useState("");
  const [editedagency, setEditedAgency] = useState("");
  const [editedteam, setEditedTeam] = useState("");

  useEffect(() => {
    if (user) {
      setEditedUsername(user.username);
      setEditedFirstName(user.firstname);
      setEditedLastName(user.lastname);
      setEditedStatus(user.status);
      setEditedRole(user.roleId);
      setEditedTags(user.tags);
      setEditedAgency(user.agencyid);
      setEditedTeam(user.teamid);
    }
  }, [user]);

  if (!open || !user.id) return null;

  async function handleSubmitClose(closeonsave) {
    var errorflag = false;
    setValidationError("");

    if (editedusername == "" || editedusername == null) {
      errorflag = true;
      setValidationError("Please input valid username!");
    }

    if (editedrole == "" || editedrole == null) {
      errorflag = true;
      setValidationError("Please select a role!");
    }

    if (editedagency == "" || editedagency == null) {
      errorflag = true;
      setValidationError("Please select a agency!");
    }

    if (editedteam == "" || editedteam == null) {
      errorflag = true;
      setValidationError("Please select a team!");
    }

    if (errorflag === false) {
      setValidationError("");
      const token = localStorage.getItem("token");
      let datapass = JSON.stringify({
        userid: user.id,
        username: editedusername,
        firstname: editedfirstname,
        lastname: editedlastname,
        status: editedstatus,
        role: editedrole,
        tags: editedtags,
        agency: editedagency,
        team: editedteam,
      });

      const response = await fetch("/api/users/edit", {
        body: datapass,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "PUT",
      });

      if (response.ok) {
        if (closeonsave) {
          onClose();
          onSave();
        }
        setEditedUsername("");
        setEditedFirstName("");
        setEditedLastName("");
        setEditedStatus("");
        setEditedRole("");
        setEditedTags("");
        setValidationError("");
        setEditedAgency("");
        setEditedTeam("");
      }
    }
  }

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg p-4 transform transition-transform duration-300 ease-in-out">
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
            value={editedusername}
            onChange={(e) => {
              setEditedUsername(e.target.value);
              setValidationError("");
            }}
            readOnly={mode === "view"}
          />
        </div>
        <div>
          <Label htmlFor="username">First Name</Label>
          <Input
            id="firstname"
            name="firstname"
            value={editedfirstname}
            onChange={(e) => {
              setEditedFirstName(e.target.value);
              setValidationError("");
            }}
            readOnly={mode === "view"}
          />
        </div>
        <div>
          <Label htmlFor="username">Last Name</Label>
          <Input
            id="lastname"
            name="lastname"
            value={editedlastname}
            onChange={(e) => {
              setEditedLastName(e.target.value);
              setValidationError("");
            }}
            readOnly={mode === "view"}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="status">Status</Label>
          <Switch
            id="status"
            checked={editedstatus != "ACTIVE" ? false : true}
            onCheckedChange={(e) => {
              setEditedStatus(editedstatus != "ACTIVE" ? "ACTIVE" : "INACTIVE");
              setValidationError("");
            }}
            disabled={mode === "view"}
          />
          <span>{editedstatus}</span>
        </div>
        <div>
          <Label htmlFor="role">Role</Label>
          <Select
            value={editedrole}
            onValueChange={(e) => {
              setEditedRole(e);
              setValidationError("");
            }}
            disabled={mode === "view"}
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
          <Label htmlFor="role">Agency</Label>
          <Select
            value={editedagency}
            onValueChange={(e) => {
              setEditedAgency(e);
              setValidationError("");
            }}
            disabled={mode === "view"}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a agency" />
            </SelectTrigger>
            <SelectContent>
              {agencylist.map((agency) => (
                <SelectItem key={agency.name} value={agency.id}>
                  {agency.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="role">Team</Label>
          <Select
            value={editedteam}
            onValueChange={(e) => {
              setEditedTeam(e);
              setValidationError("");
            }}
            disabled={mode === "view"}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a team" />
            </SelectTrigger>
            <SelectContent>
              {teamlist.map((team) => (
                <SelectItem key={team.name} value={team.id}>
                  {team.name}
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
            value={editedtags}
            onChange={(e) => {
              setEditedTags(e.target.value);
              setValidationError("");
            }}
            readOnly={mode === "view"}
          />
        </div>
      </div>
      {mode === "edit" && (
        <Button
          className="mt-4 w-full"
          onClick={(e) => handleSubmitClose(true)}
        >
          Save Changes
        </Button>
      )}
      <p className="mt-4 text-xs text-red-400">{validationerror}</p>
    </div>
  );
}
