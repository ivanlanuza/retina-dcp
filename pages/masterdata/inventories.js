import { useEffect, useState } from "react";
import Layout from "@/components/core/Layout";
import withAuth from "@/components/core/Auth";
import { CSVLink } from "react-csv";
import {
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const LocationsInventory = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [inventorySearch, setInventorySearch] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("token");
  
    fetch("/api/locations/getLocations", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch locations");
        return res.json();
      })
      .then((data) => {
        setLocations(data);
      })
      .catch((err) => {
        console.error("Error fetching locations:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const fetchInventory = (locationId) => {
    setInventoryLoading(true);
    const token = localStorage.getItem("token");
    
    fetch(`/api/masterdata/inventory/get?locationid=${locationId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) {
            return { body: { inventory: [] } };
          }
          throw new Error("Failed to fetch inventory");
        }
        return res.json();
      })
      .then((data) => {
        setInventory(data.body?.inventory || []);
      })
      .catch((err) => {
        console.error("Error fetching inventory:", err);
        setInventory([]);
      })
      .finally(() => {
        setInventoryLoading(false);
      });
  };

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
    fetchInventory(location.id);
  };

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const filteredInventory = inventory.filter(item =>
    item.product?.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
    (item.product?.description?.toLowerCase().includes(inventorySearch.toLowerCase()))
  );

  const getCSVData = () => {
    return filteredInventory.map(item => ({
      "Product Name": item.product?.name || '',
      "Product Description": item.product?.description || '',
      "Old Count": item.oldinventorycount,
      "Adjustment": item.adjustmentqty,
      "New Count": item.newinventorycount,
      "Transaction Type": item.transactionType?.name || ''
    }));
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="mx-8 font-sans text-sm">
          <h2 className="text-2xl font-bold font-sans text-gray-800 mb-6">Locations</h2>
          <p>Loading locations...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-8 font-sans text-xs">
        <h2 className="text-2xl font-bold font-sans text-gray-800 mb-6">Inventory</h2>

        {/* Search and Download Controls */}
        <div className="flex justify-between mb-4">
          <div className="w-1/3">
            <input
              type="text"
              placeholder="Search Locations"
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="w-2/3 flex justify-end gap-4">
            {selectedLocation && (
              <input
                type="text"
                placeholder="Search Inventory"
                value={inventorySearch}
                onChange={(e) => setInventorySearch(e.target.value)}
                className="w-1/2 p-2 border border-gray-300 rounded"
                disabled={!selectedLocation}
              />
            )}
            {selectedLocation && (
              <CSVLink 
              data={getCSVData()} 
              filename={`${selectedLocation.name.replace(/\s+/g, '_')}_inventory.csv`}
              className="inline-flex items-center"
            >
              <Button>
                <Download className="mr-2 h-4 w-4" /> Download List
              </Button>
            </CSVLink>
            )}
          </div>
        </div>

        <div className="flex gap-8">
          {/* Locations List */}
          <div className="w-1/3">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-medium text-gray-700">All Locations</h3>
              </div>
              <ul className="divide-y divide-gray-200">
                {filteredLocations.map((location) => (
                  <li 
                    key={location.id} 
                    className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${selectedLocation?.id === location.id ? 'bg-blue-50' : ''}`}
                    onClick={() => handleLocationClick(location)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">{location.name} {location.id}</p>
                        <p className="text-xs text-gray-500">{location.customer?.name}</p>
                      </div>
                      <div className="text-xs text-gray-400">{location.tags}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Inventory Details */}
          <div className="w-2/3">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-medium text-gray-700">
                  {selectedLocation ? `${selectedLocation.name} Inventory` : 'Select a location'}
                </h3>
                {selectedLocation && (
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedLocation.customer?.name} • {selectedLocation.geocoordinates || 'No coordinates'}
                  </p>
                )}
                {inventory.length > 0 && inventory[0].transactionType?.name && (
                  <p className="text-xs text-gray-500 mt-1">{inventory[0].transactionType.name}</p>
                )}
              </div>

              {selectedLocation ? (
                inventoryLoading ? (
                  <div className="p-8 text-center text-gray-500">Loading inventory...</div>
                ) : filteredInventory.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Old Count</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adjustment</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">New Count</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredInventory.map((item) => (
                          <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{item.product?.name}</div>
                              <div className="text-xs text-gray-500">{item.product?.description}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.oldinventorycount}</td>
                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${item.adjustmentqty >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {item.adjustmentqty >= 0 ? '+' : ''}{item.adjustmentqty}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.newinventorycount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">No inventory records found for this location</div>
                )
              ) : (
                <div className="p-8 text-center text-gray-500">Please select a location to view inventory</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default withAuth(LocationsInventory);