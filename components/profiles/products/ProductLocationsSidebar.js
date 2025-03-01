import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export default function ProductLocationsSidebar({ open, mode, item, onClose }) {
  const [locationdata, setLocationData] = useState();

  useEffect(() => {
    if (item) {
      const token = localStorage.getItem("token");

      fetch(
        "/api/masterdata/products/getFullProductLocations?" +
          new URLSearchParams({
            itemid: parseInt(item.id),
          }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setLocationData(data.body);
          //console.log(data.body);
        });
    }
  }, [item]);

  const handleLocationToggle = (locationId) => {
    // Update the location data state
    setLocationData((prev) => {
      return {
        ...prev,
        itemlocations: prev.itemlocations.map((location) => {
          if (location.id === locationId) {
            return {
              ...location,
              is_active: location.is_active === "1" ? "0" : "1",
            };
          }
          return location;
        }),
      };
    });
  };

  async function handleSubmit() {
    const filteredData = locationdata.itemlocations.filter(
      (item) => item.is_active !== item.historical_record
    );

    if (filteredData.length === 0) {
      onClose();
      return;
    }

    const createData = filteredData.filter((item) => item.has_record === "0");

    const updateData = filteredData.filter((item) => item.has_record === "1");

    const token = localStorage.getItem("token");

    const response = await fetch(
      "/api/masterdata/products/updateProductLocations",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          itemid: parseInt(item.id),
          createlocations: createData,
          updatelocations: updateData,
        }),
      }
    );

    if (response.ok) {
      onClose();
    }
  }

  return (
    <div>
      {locationdata && (
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
              <div className="flex justify-between items-center mb-8">
                <p className="text-xl font-semibold">
                  Assign Locations for {item ? item.name : ""}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto mt-4 px-2 pb-12 pt-4 border rounded-md bg-white">
                {/* Your sidebar content here */}

                <ScrollArea className="h-full">
                  <div className="space-y-2">
                    <table className="min-w-full bg-white">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                            Carried
                          </th>
                          <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                            Location
                          </th>
                          <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                            Inventory Count
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {locationdata.itemlocations.map((location) => (
                          <tr key={location.id}>
                            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                              <Checkbox
                                id={`location-${location.id}`}
                                checked={location.is_active === "1" ? 1 : 0}
                                onCheckedChange={() =>
                                  handleLocationToggle(location.id)
                                }
                                disabled={location.inventorycount > 0}
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                              {location.name}
                            </td>
                            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                              {location.inventorycount}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </ScrollArea>
              </div>

              {/* Footer (optional) */}
              <div className="border-t pt-4 mt-4">
                <Button onClick={() => handleSubmit()} className="w-full">
                  Save
                </Button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

/*import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

const SAMPLE_LOCATIONS = [
  { id: "1", name: "Store A" },
  { id: "2", name: "Store B" },
  { id: "3", name: "Store C" },
  { id: "4", name: "Store D" },
  { id: "5", name: "Store E" },
  // Add more sample locations as needed
];

export default function AssignLocationsSidebar({
  open,
  item,
  onClose,
  onSave,
}) {
  const [selectedLocations, setSelectedLocations] = useState([]);

  useEffect(() => {
    if (item && item.locations) {
      setSelectedLocations(item.locations);
    } else {
      setSelectedLocations([]);
    }
  }, [item]);

  if (!open || !item) return null;

  const handleLocationToggle = (locationId) => {
    setSelectedLocations((prev) =>
      prev.includes(locationId)
        ? prev.filter((id) => id !== locationId)
        : [...prev, locationId]
    );
  };

  const handleSave = () => {
    onSave(item.id, selectedLocations);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-1/3 bg-white shadow-lg p-4 transform transition-transform duration-300 ease-in-out">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Assign Locations</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X />
        </Button>
      </div>
      <p className="text-sm mb-4">Assign locations for {item.itemname}</p>
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-2">
          {SAMPLE_LOCATIONS.map((location) => (
            <div key={location.id} className="flex items-center space-x-2">
              <Checkbox
                id={`location-${location.id}`}
                checked={selectedLocations.includes(location.id)}
                onCheckedChange={() => handleLocationToggle(location.id)}
              />
              <label
                htmlFor={`location-${location.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {location.name}
              </label>
            </div>
          ))}
        </div>
      </ScrollArea>
      <Button className="mt-4 w-full" onClick={handleSave}>
        Save Locations
      </Button>
    </div>
  );
}
*/
