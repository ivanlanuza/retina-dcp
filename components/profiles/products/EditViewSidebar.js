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
  supplierlist,
  brandlist,
  categorylist
}) {
  const [editeditemname, setEditedItemname] = useState("");
  const [editeddescription, setEditedDescription] = useState("");
  const [editedbarcode, setEditedBarcode] = useState("");
  const [editedexternalcode, setEditedExternalCode] = useState("");
  const [editedtags, setEditedTags] = useState("");
  const [editedsupplier, setEditedSupplier] = useState("");
  const [validationerror, setValidationError] = useState("");
  const [editedbrand, setEditedBrand] = useState("");
  const [editedcategory, setEditedCategory] = useState("");

  useEffect(() => {
    if (item) {
      setEditedItemname(item.name);
      setEditedDescription(item.description);
      setEditedBarcode(item.barcode);
      setEditedExternalCode(item.externalcode);
      setEditedTags(item.tags);
      setEditedSupplier(item.supplierid);
      setEditedBrand(item.brandid);
      setEditedCategory(item.categoryid);
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

    if (editeddescription == "" || editeddescription == null) {
      errorflag = true;
      setValidationError("Please select a client account!");
    }

    if (errorflag === false) {
      setValidationError("");
      const token = localStorage.getItem("token");
      let datapass = JSON.stringify({
        id: item.id,
        name: editeditemname,
        description: editeddescription,
        barcode: editedbarcode,
        externalcode: editedexternalcode,
        tags: editedtags,
        supplierid: editedsupplier,
        brandid: editedbrand,
        categoryid: editedcategory,
      });

      const response = await fetch("/api/masterdata/products/edit", {
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
        setEditedBarcode("");
        setEditedExternalCode("");
        setEditedSupplier("");
        setEditedTags("");
        setValidationError("");
        setEditedBrand("");
        setEditedCategory("");
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
          <Label htmlFor="itemname">Product</Label>
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
        <div>
          <Label htmlFor="description">Barcode</Label>
          <Input
            id="barcode"
            name="barcode"
            value={editedbarcode}
            onChange={(e) => {
              setEditedBarcode(e.target.value);
              setValidationError("");
            }}
            readOnly={mode === "view"}
          />
        </div>
        <div>
          <Label htmlFor="description">External Code</Label>
          <Input
            id="externalcode"
            name="externalcode"
            value={editedexternalcode}
            onChange={(e) => {
              setEditedExternalCode(e.target.value);
              setValidationError("");
            }}
            readOnly={mode === "view"}
          />
        </div>
        <div>
          <Label htmlFor="supplier">Supplier</Label>
          <Select
            value={editedsupplier}
            onValueChange={(e) => {
              setEditedSupplier(e);
              setValidationError("");
            }}
            disabled={mode === "view"}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a Supplier" />
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
          <Label htmlFor="supplier">Brand</Label>
          <Select
            value={editedbrand}
            onValueChange={(e) => {
              setEditedBrand(e);
              setValidationError("");
            }}
            disabled={mode === "view"}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a Brand" />
            </SelectTrigger>
            <SelectContent>
              {brandlist.map((item) => (
                <SelectItem key={item.name} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="supplier">Category</Label>
          <Select
            value={editedcategory}
            onValueChange={(e) => {
              setEditedCategory(e);
              setValidationError("");
            }}
            disabled={mode === "view"}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a Category" />
            </SelectTrigger>
            <SelectContent>
              {categorylist.map((item) => (
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
