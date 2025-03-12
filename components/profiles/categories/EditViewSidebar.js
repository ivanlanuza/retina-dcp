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

export default function EditViewSidebar({ open, mode, item, onClose, onSave }) {
  const [editeditemname, setEditedItemname] = useState("");
  const [editeddescription, setEditedDescription] = useState("");
  const [validationerror, setValidationError] = useState("");

  useEffect(() => {
    if (item) {
      setEditedItemname(item.name);
      setEditedDescription(item.description);
    }
  }, [item]);

  if (!open || !item.id) return null;

  async function handleSubmitClose(closeonsave) {
    var errorflag = false;
    setValidationError("");

    if (editeditemname == "" || editeditemname == null) {
      errorflag = true;
      setValidationError("Please input valid name!");
    }

    if (editeddescription == "" || editeddescription == null) {
      errorflag = true;
      setValidationError("Please add a description!");
    }

    if (errorflag === false) {
      setValidationError("");
      const token = localStorage.getItem("token");
      let datapass = JSON.stringify({
        id: item.id,
        name: editeditemname,
        description: editeddescription,
      });

      const response = await fetch("/api/masterdata/categories/edit", {
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
        setEditedItemname("");
        setEditedDescription("");
        setValidationError("");
      }
    }
  }

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg p-4 transform transition-transform duration-300 ease-in-out">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          {mode === "edit" ? "Edit Item" : "View Item"}
        </h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X />
        </Button>
      </div>
      <div className="space-y-4">
        <div>
          <Label htmlFor="itemname">Name</Label>
          <Input
            id="itemname"
            name="itemname"
            value={editeditemname}
            onChange={(e) => {
              setEditedItemname(e.target.value);
              setValidationError("");
            }}
            readOnly={mode === "view"}
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            name="description"
            value={editeddescription}
            onChange={(e) => {
              setEditedDescription(e.target.value);
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
