import { useEffect, useState } from "react";
import Layout from "@/components/core/Layout";
import CustomersDataTable from "@/components/profiles/customers/CustomersDataTable";
import withAuth from "@/components/core/Auth";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("/api/masterdata/customers/getCustomers", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data);
        setIsLoading(false);
      });
  }, [isLoading]);

  if (isLoading) {
    return (
      <Layout>
        <div className="mx-8 font-sans text-sm">
          <h2 className="text-2xl font-bold font-sans text-gray-800 mb-6">
            Client Accounts
          </h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-8 font-sans text-xs">
        <h2 className="text-2xl font-bold font-sans text-gray-800 mb-12">
          Client Accounts
        </h2>

        {customers && (
          <CustomersDataTable
            data={customers}
            onSave={(e) => setIsLoading(true)}
          />
        )}
      </div>
    </Layout>
  );
};

export default withAuth(App);
