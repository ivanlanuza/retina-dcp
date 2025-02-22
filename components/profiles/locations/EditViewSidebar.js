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
  item,
  onClose,
  onSave,
  customerlist,
}) {
  const [editeditemname, setEditedItemname] = useState("");
  const [editedgeocoordinates, setEditedGeocoordinates] = useState("");
  const [editedcustomer, setEditedCustomer] = useState("");
  const [editedtags, setEditedTags] = useState("");
  const [validationerror, setValidationError] = useState("");

  useEffect(() => {
    if (item) {
      setEditedItemname(item.name);
      setEditedGeocoordinates(item.geocoordinates);
      setEditedCustomer(item.customerid);
      setEditedTags(item.tags);
    }
  }, [item]);

  if (!open || !item.id) return null;

  async function handleSubmitClose(closeonsave) {
    var errorflag = false;
    setValidationError("");

    if (editeditemname == "" || editeditemname == null) {
      errorflag = true;
      setValidationError("Please input valid itemname!");
    }

    if (editedcustomer == "" || editedcustomer == null) {
      errorflag = true;
      setValidationError("Please select a client account!");
    }

    if (errorflag === false) {
      setValidationError("");
      const token = localStorage.getItem("token");
      let datapass = JSON.stringify({
        id: item.id,
        name: editeditemname,
        geocoordinates: editedgeocoordinates,
        customerid: editedcustomer,
        tags: editedtags,
      });

      const response = await fetch("/api/locations/edit", {
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
        setEditedGeocoordinates("");
        setEditedCustomer("");
        setEditedTags("");
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
          <Label htmlFor="itemname">Location</Label>
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
          <Label htmlFor="geocoordinates">Geo Coordinates</Label>
          <Input
            id="geocoordinates"
            name="geocoordinates"
            value={editedgeocoordinates}
            onChange={(e) => {
              setEditedGeocoordinates(e.target.value);
              setValidationError("");
            }}
            readOnly={mode === "view"}
          />
        </div>
        <div>
          <Label htmlFor="customer">Client Account</Label>
          <Select
            value={editedcustomer}
            onValueChange={(e) => {
              setEditedCustomer(e);
              setValidationError("");
            }}
            disabled={mode === "view"}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a Client Account" />
            </SelectTrigger>
            <SelectContent>
              {customerlist.map((item) => (
                <SelectItem key={item.name} value={item.id}>
                  {item.name}
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
