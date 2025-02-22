import { useEffect, useState } from "react";
import Layout from "@/components/core/Layout";
import LocationsDataTable from "@/components/profiles/locations/LocationsDataTable";
import withAuth from "@/components/core/Auth";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [locations, setLocations] = useState([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(true);
  const [customerlist, setCustomerList] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("/api/locations/getLocations", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setLocations(data);
        setIsLoading(false);
        //console.log(data);
      });

    fetch("/api/masterdata/customers/getCustomers", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCustomerList(data);
        //console.log(data);
        setIsLoadingCustomers(false);
      });
  }, [isLoading]);

  if (isLoading || isLoadingCustomers) {
    return (
      <Layout>
        <div className="mx-8 font-sans text-sm">
          <h2 className="text-2xl font-bold font-sans text-gray-800 mb-6">
            Locations
          </h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-8 font-sans text-xs">
        <h2 className="text-2xl font-bold font-sans text-gray-800 mb-6">
          Locations
        </h2>

        {locations && (
          <LocationsDataTable
            data={locations}
            customerlist={customerlist}
            onSave={(e) => setIsLoading(true)}
          />
        )}
      </div>
    </Layout>
  );
};

export default withAuth(App);
