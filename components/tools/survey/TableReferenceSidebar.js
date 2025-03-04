import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { REFERENCE_TABLE_OPTIONS } from "@/lib/data";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TableReferenceSidebar({ open, item, onClose }) {
  if (item) {
    const referenceoptions = REFERENCE_TABLE_OPTIONS;
    const [screenlocation, setScreenLocation] = useState(1);
    const [referencetable, setReferenceTable] = useState(
      item.options
        ? { id: 0, value: item.options.reference_row }
        : { id: "", value: "" }
    );
    const [displaydata, setDisplayData] = useState(
      item.options.length > 0 ? item.options[0].display_data : []
    );
    const [columns, setColumns] = useState(
      item.options.length > 0
        ? item.options[0].columns
        : [
            { title: "", type: "Text", required: false, options: "" },
            { title: "", type: "Text", required: false, options: "" },
          ]
    );
    const [datalist, setDataList] = useState(
      item.options.length > 0 ? item.options[0].datalist : []
    );
    const [itemlist, setItemList] = useState();

    useEffect(() => {
      const token = localStorage.getItem("token");

      fetch("/api/masterdata/products/getProducts", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setItemList(data);
        });
    }, []);

    const handleCheckboxChange = (id, value, field, checked) => {
      setDisplayData(
        (prev) =>
          checked
            ? [...prev, { id, value, field }] // Add item if checked
            : prev.filter((item) => item.id !== id) // Remove item if unchecked
      );
    };

    const handleItemListChange = (id, productid, name, checked) => {
      setDataList(
        (prev) =>
          checked
            ? [...prev, { id, productid, name }] // Add item if checked
            : prev.filter((item) => item.id !== id) // Remove item if unchecked
      );
    };

    const handleChange = (index, field, value) => {
      setColumns((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        )
      );
    };

    const findTitle = (array, id, field = null) => {
      const item = array.find((item) => item.id === id);

      if (!item) return null; // Return null if ID not found
      if (typeof item[field] === "object") {
        return item[field]?.name || null; // Access nested key if it's an object
      }

      return item[field] || null; // Return main field if item is object
    };

    return (
      <div>
        {item && (
          <div>
            {/* Overlay */}
            <div
              className={cn(
                "fixed inset-0 bg-black/80 z-70 transition-opacity",
                open ? "opacity-100" : "opacity-0 pointer-events-none"
              )}
              onClick={onClose}
            />
            <aside
              className={cn(
                "fixed right-0 top-0 h-full w-1/2 max-w-1/2 bg-background z-50",
                "shadow-lg transition-transform duration-300 ease-in-out",
                "transform",
                open ? "translate-x-0" : "translate-x-full"
              )}
            >
              <div className="p-6 h-full flex flex-col bg-zinc-50">
                {/* Header */}
                <div className="flex justify-between items-center mb-0">
                  <p className="text-xl font-semibold">Configure Table Input</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="rounded-full"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="mb-6">
                  <p className="text-xs font-thin">Q: {item.question}</p>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto mt-4 px-2 pb-12 pt-4 border rounded-md bg-white">
                  {/* Your sidebar content here */}
                  <ScrollArea className="h-full">
                    {screenlocation === 1 && (
                      <div className="space-y-2">
                        <p className="text-md font-semibold mb-6">
                          Step 1: Choose Master Data Table to use
                        </p>
                        <div>
                          <RadioGroup className="pl-4">
                            {referenceoptions.map((option, index) => (
                              <div
                                key={index}
                                className="flex items-center space-x-2 mb-1 "
                              >
                                <RadioGroupItem
                                  value={option.value}
                                  id={index}
                                  onClick={() =>
                                    setReferenceTable({
                                      id: index,
                                      value: option.value,
                                    })
                                  }
                                  checked={referencetable.id === index}
                                  disabled={option.disabled}
                                />
                                <Label htmlFor={index} className="font-thin">
                                  {option.value}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      </div>
                    )}

                    {screenlocation === 2 && (
                      <div className="space-y-2">
                        <p className="text-md font-semibold mb-6">
                          Step 2: Choose two fields to display
                        </p>
                        <div>
                          {referenceoptions[referencetable.id].fields.map(
                            (option, index) => {
                              const id = index;
                              const isChecked = displaydata.some(
                                (item) => item.id === id
                              ); // Check if it's in the state

                              return (
                                <div
                                  key={index}
                                  className="items-top flex space-x-2 mt-2"
                                >
                                  <Checkbox
                                    id={index}
                                    checked={isChecked} // Set checked state
                                    onCheckedChange={(checked) =>
                                      handleCheckboxChange(
                                        index,
                                        option.value,
                                        option.field,
                                        checked
                                      )
                                    }
                                  />
                                  <div className="grid gap-1.5 leading-none">
                                    <label
                                      htmlFor={index}
                                      className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                      {option.value}
                                    </label>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}

                    {screenlocation === 3 && (
                      <div className="space-y-2">
                        <p className="text-md font-semibold mb-6">
                          Step 3: Input column names for the data you want to
                          collect.
                        </p>
                        {columns.map((field, index) => (
                          <div
                            key={index}
                            className=" p-4 px-4 border-b border-t border-gray-400 bg-gray-100"
                          >
                            <div className="grid grid-cols-3 gap-2 ">
                              <div>
                                <Label className="block text-xs font-medium mb-1">
                                  Column Title
                                </Label>
                                <Input
                                  value={field.title}
                                  onChange={(e) =>
                                    handleChange(index, "title", e.target.value)
                                  }
                                  placeholder="Enter column title"
                                  className="bg-white text-xs"
                                />
                              </div>
                              <div>
                                <Label className="block text-xs font-medium mt-0 mb-1">
                                  Answer Type
                                </Label>
                                <Select
                                  onValueChange={(value) =>
                                    handleChange(index, "type", value)
                                  }
                                  value={field.type}
                                >
                                  <SelectTrigger className="w-full bg-white font-sans">
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white font-sans">
                                    <SelectItem value="text">Text</SelectItem>
                                    <SelectItem value="number">
                                      Number
                                    </SelectItem>
                                    <SelectItem value="date">Date</SelectItem>
                                    <SelectItem value="Dropdown">
                                      Dropdown
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label className="block text-xs font-medium mt-0 mb-1">
                                  Mandatory?
                                </Label>
                                <Select
                                  onValueChange={(value) =>
                                    handleChange(index, "required", value)
                                  }
                                  value={field.required}
                                >
                                  <SelectTrigger className="w-full bg-white font-sans">
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white font-sans">
                                    <SelectItem value={false}>NO</SelectItem>
                                    <SelectItem value={true}>YES</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            {field.type === "Dropdown" && (
                              <div className="mt-6 mb-0">
                                <Label className="block text-xs font-medium">
                                  Dropdown Options (comma separated)
                                </Label>
                                <Input
                                  value={field.options}
                                  onChange={(e) =>
                                    handleChange(
                                      index,
                                      "options",
                                      e.target.value
                                    )
                                  }
                                  placeholder="e.g. Option 1, Option 2, Option 3"
                                  className="bg-white"
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {screenlocation === 4 && (
                      <div className="space-y-2">
                        <p className="text-md font-semibold mb-6">
                          Step 4: Select the items to include in the survey.
                        </p>
                        {itemlist && (
                          <div>
                            {itemlist.map((option, index) => {
                              const id = index;
                              const isChecked = datalist.some(
                                (item) => item.id === id
                              ); // Check if it's in the state

                              return (
                                <div
                                  key={index}
                                  className="items-top flex space-x-2 mt-2"
                                >
                                  <Checkbox
                                    id={index}
                                    checked={isChecked} // Set checked state
                                    onCheckedChange={(checked) =>
                                      handleItemListChange(
                                        index,
                                        option.id,
                                        option.name,
                                        checked
                                      )
                                    }
                                  />
                                  <div className="grid gap-1.5 leading-none">
                                    <label
                                      htmlFor={index}
                                      className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                      {option.name}
                                    </label>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {screenlocation === 5 && (
                      <div className="space-y-2">
                        <p className="text-md font-semibold mb-6">
                          Step 5: Here is a preview of your table component.
                        </p>
                        <div>
                          <table className="border-2 border-gray-600 font-sans w-full text-xs">
                            <thead>
                              <tr>
                                <th className="p-2 border text-left bg-gray-600 text-white">
                                  {referencetable.value}
                                </th>

                                {columns.map(
                                  (field, index) =>
                                    field.title.length > 0 && (
                                      <th
                                        className="p-2 border  text-left bg-gray-600 text-white"
                                        key={index}
                                      >
                                        {field.title}
                                      </th>
                                    )
                                )}
                              </tr>
                            </thead>
                            <tbody>
                              {datalist.map((item, index) => (
                                <tr key={index}>
                                  <td className="p-2 border">
                                    <p className="font-semibold text-gray-600">
                                      {findTitle(
                                        itemlist,
                                        item.productid,
                                        displaydata[0].field
                                      )}
                                    </p>
                                    {displaydata.length > 1 && (
                                      <p className="font-thin text-gray-600">
                                        {findTitle(
                                          itemlist,
                                          item.productid,
                                          displaydata[1].field
                                        )}
                                      </p>
                                    )}
                                  </td>
                                  {columns.map(
                                    (field, index) =>
                                      field.title.length > 0 && (
                                        <td
                                          className="p-2 border text-xs"
                                          key={index}
                                        >
                                          {field.type === "Dropdown" ? (
                                            <Select>
                                              <SelectTrigger className="w-full bg-white font-sans text-xs">
                                                <SelectValue placeholder="Select type" />
                                              </SelectTrigger>
                                              <SelectContent className="bg-white font-sans">
                                                {field.options
                                                  .split(",")
                                                  .map((option, index) => (
                                                    <SelectItem
                                                      value={option}
                                                      key={index}
                                                      className="text-xs"
                                                    >
                                                      {option}
                                                    </SelectItem>
                                                  ))}
                                              </SelectContent>
                                            </Select>
                                          ) : (
                                            <Input
                                              type={field.type}
                                              placeholder=""
                                              className="bg-white text-xs"
                                            />
                                          )}
                                        </td>
                                      )
                                  )}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </ScrollArea>
                </div>

                {/* Footer (optional) */}
                <div className="border-t pt-4 mt-4 gap-4 space-x-4 flex justify-center">
                  <Button
                    onClick={() => setScreenLocation(screenlocation - 1)}
                    className="w-1/2"
                    disabled={screenlocation === 1}
                  >
                    Back
                  </Button>

                  <Button
                    onClick={() => {
                      if (screenlocation === 2) {
                        if (displaydata.length > 2 || displaydata.length < 1) {
                          alert("Please select 1 to 2 columns");
                          return;
                        }
                      }
                      if (screenlocation === 3) {
                        if (columns[0].title.length < 1) {
                          alert("Please input at least one field.");
                          return;
                        }
                      }
                      if (screenlocation === 4) {
                        if (datalist.length < 1) {
                          alert("Please select at least one item.");
                          return;
                        }
                      }

                      if (screenlocation === 5) {
                        onClose(referencetable, displaydata, columns, datalist);
                        setScreenLocation(1);
                        return;
                      }
                      setScreenLocation(screenlocation + 1);
                    }}
                    className="w-1/2"
                  >
                    {screenlocation === 5 ? "Save" : "Next"}
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    );
  }
}
