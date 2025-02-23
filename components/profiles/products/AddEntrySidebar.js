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
  supplierlist,
}) {
  const [newrecordname, setNewRecordName] = useState("");
  const [newrecorddescription, setNewRecordDescription] = useState("");
  const [newrecordbarcode, setNewRecordBarcode] = useState("");
  const [newrecordsupplier, setNewRecordSupplier] = useState("");
  const [newrecordexternalcode, setNewRecordExternalCode] = useState("");
  const [newrecordtags, setNewRecordTags] = useState("");
  const [validationerror, setValidationError] = useState("");

  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    barcode: "",
    externalcode: "",
    supplier: "",
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

    if (newrecorddescription == "" || newrecorddescription == null) {
      errorflag = true;
      setValidationError("Please input geo coordinates!");
    }

    if (errorflag === false) {
      setValidationError("");
      const token = localStorage.getItem("token");
      let datapass = JSON.stringify({
        name: newrecordname,
        description: newrecorddescription,
        barcode: newrecordbarcode,
        supplierid: newrecordsupplier,
        externalcode: newrecordexternalcode,
        tags: newrecordtags,
      });

      const response = await fetch("/api/masterdata/products/create", {
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
        setNewRecordDescription("");
        setNewRecordBarcode("");
        setNewRecordSupplier("");
        setNewRecordExternalCode("");
        setNewRecordTags("");
        setValidationError("");
      }
    }
  }

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg p-4 transform transition-transform duration-300 ease-in-out">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Add New Product</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X />
        </Button>
      </div>
      <div className="space-y-4">
        <div>
          <Label htmlFor="itemname">Product Name</Label>
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
          <Label htmlFor="description">Product Description</Label>
          <Input
            id="description"
            name="description"
            value={newrecorddescription}
            onChange={(e) => {
              setNewRecordDescription(e.target.value);
              setValidationError("");
            }}
            type="text"
          />
        </div>
        <div>
          <Label htmlFor="barcode">Product Barcode</Label>
          <Input
            id="barcode"
            name="barcode"
            value={newrecordbarcode}
            onChange={(e) => {
              setNewRecordBarcode(e.target.value);
              setValidationError("");
            }}
            type="text"
          />
        </div>
        <div>
          <Label htmlFor="externalcode">Product External Code</Label>
          <Input
            id="externalcode"
            name="externalcode"
            value={newrecordexternalcode}
            onChange={(e) => {
              setNewRecordExternalCode(e.target.value);
              setValidationError("");
            }}
            type="text"
          />
        </div>

        <div>
          <Label htmlFor="role">Supplier</Label>
          <Select
            value={newrecordsupplier}
            onValueChange={(e) => {
              setNewRecordSupplier(e);
              //alert(e);
              setValidationError("");
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a supplier" />
            </SelectTrigger>
            <SelectContent>
              {supplierlist.map((item) => (
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
        Add Product
      </Button>
      <p className="mt-4 text-xs text-red-400">{validationerror}</p>
    </div>
  );
}
