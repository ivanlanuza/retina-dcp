import { useState, useEffect } from "react";
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
  user,
  onClose,
  onSave,
}) {
  const [selectedLocations, setSelectedLocations] = useState([]);

  useEffect(() => {
    if (user && user.locations) {
      setSelectedLocations(user.locations);
    } else {
      setSelectedLocations([]);
    }
  }, [user]);

  if (!open || !user) return null;

  const handleLocationToggle = (locationId) => {
    setSelectedLocations((prev) =>
      prev.includes(locationId)
        ? prev.filter((id) => id !== locationId)
        : [...prev, locationId]
    );
  };

  const handleSave = () => {
    onSave(user.id, selectedLocations);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-64 bg-white shadow-lg p-4 transform transition-transform duration-300 ease-in-out">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Assign Locations</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X />
        </Button>
      </div>
      <p className="text-sm mb-4">Assign locations for {user.username}</p>
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
