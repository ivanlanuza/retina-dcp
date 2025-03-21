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
import { jwtDecode } from "jwt-decode";

export default function AddEntrySidebar({
  open,
  onClose,
  onSave,
  customerlist,
}) {
  const [newrecordname, setNewRecordName] = useState("");
//   const [newrecorddscription, setNewRecordDescription] = useState("");
  const [validationerror, setValidationError] = useState("");

  const [newItem, setNewItem] = useState({
    name: "",
    // description: "",
  });

  if (!open) return null;

  async function handleSubmitClose(closeonsave) {
    var errorflag = false;
    setValidationError("");

    if (newrecordname == "" || newrecordname == null) {
      errorflag = true;
      setValidationError("Please input valid client account name!");
    }

    // if (newrecorddscription == "" || newrecorddscription == null) {
    //   errorflag = true;
    //   setValidationError("Please input description!");
    // }

    if (errorflag === false) {
      setValidationError("");
      const token = localStorage.getItem("token");
      const decodedToken = jwtDecode(token);
      const accountid = parseInt(decodedToken.accountId);
      let datapass = JSON.stringify({
        name: newrecordname,
        // description: newrecorddscription,
        accountId: accountid
      });

      const response = await fetch("/api/masterdata/roles/create", {
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
        setNewRecordName("");
        // setNewRecordDescription("");
        setValidationError("");
      }
    }
  }

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg p-4 transform transition-transform duration-300 ease-in-out">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Add New Role</h2>
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
            value={newrecordname}
            onChange={(e) => {
              setNewRecordName(e.target.value);
              setValidationError("");
            }}
          />
        </div>
        {/* <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            name="description"
            value={newrecorddscription}
            onChange={(e) => {
              setNewRecordDescription(e.target.value);
              setValidationError("");
            }}
            type="text"
          />
        </div> */}
      </div>
      <Button className="mt-8 w-full" onClick={(e) => handleSubmitClose(true)}>
        Add Roles
      </Button>
      <p className="mt-4 text-xs text-red-400">{validationerror}</p>
    </div>
  );
}
