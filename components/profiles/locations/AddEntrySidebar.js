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

export default function AddEntrySidebar({
  open,
  onClose,
  onSave,
  customerlist,
}) {
  const [newrecordname, setNewRecordName] = useState("");
  const [newrecordgeocoordinates, setNewRecordGeocoordinates] = useState("");
  const [newrecordcustomer, setNewRecordCustomer] = useState("");
  const [newrecordtags, setNewRecordTags] = useState("");
  const [validationerror, setValidationError] = useState("");

  const [newItem, setNewItem] = useState({
    name: "",
    geocoordinates: "",
    customer: "",
    tags: "",
  });

  if (!open) return null;

  async function handleSubmitClose(closeonsave) {
    var errorflag = false;
    setValidationError("");

    if (newrecordname == "" || newrecordname == null) {
      errorflag = true;
      setValidationError("Please input valid location name!");
    }

    if (newrecordgeocoordinates == "" || newrecordgeocoordinates == null) {
      errorflag = true;
      setValidationError("Please input geo coordinates!");
    }

    if (newrecordcustomer == "" || newrecordcustomer == null) {
      errorflag = true;
      setValidationError("Please select a Client Account!");
    }

    if (errorflag === false) {
      setValidationError("");
      const token = localStorage.getItem("token");
      let datapass = JSON.stringify({
        name: newrecordname,
        geocoordinates: newrecordgeocoordinates,
        customerid: newrecordcustomer,
        tags: newrecordtags,
      });

      const response = await fetch("/api/locations/create", {
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
        setNewRecordGeocoordinates("");
        setNewRecordCustomer("");
        setNewRecordTags("");
        setValidationError("");
      }
    }
  }

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg p-4 transform transition-transform duration-300 ease-in-out">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Add New Location</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X />
        </Button>
      </div>
      <div className="space-y-4">
        <div>
          <Label htmlFor="itemname">Location Name</Label>
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
        <div>
          <Label htmlFor="geocoordinates">Geo Coordinates</Label>
          <Input
            id="geocoordinates"
            name="geocoordinates"
            value={newrecordgeocoordinates}
            onChange={(e) => {
              setNewRecordGeocoordinates(e.target.value);
              setValidationError("");
            }}
            type="text"
          />
        </div>
        <div>
          <Label htmlFor="role">Client Account</Label>
          <Select
            value={newrecordcustomer}
            onValueChange={(e) => {
              setNewRecordCustomer(e);
              //alert(e);
              setValidationError("");
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a client account" />
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
        Add Location
      </Button>
      <p className="mt-4 text-xs text-red-400">{validationerror}</p>
    </div>
  );
}
