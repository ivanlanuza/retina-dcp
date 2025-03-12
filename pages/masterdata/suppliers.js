import { useEffect, useState } from "react";
import Layout from "@/components/core/Layout";
import withAuth from "@/components/core/Auth";
// import SuppliersDataTable from "@/components/profiles/suppliers/SuppliersDataTable";
import SupplierDataTable from "@/components/profiles/suppliers/SupplierDataTable";


const Suppliers = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("/api/masterdata/suppliers/getSuppliers", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setSuppliers(data);
        setIsLoading(false);
      });
  }, [isLoading]);

  if (isLoading) {
    return (
      <Layout>
        <div className="mx-8 font-sans text-sm">
          <h2 className="text-2xl font-bold font-sans text-gray-800 mb-6">
            Suppliers
          </h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-8 font-sans text-xs">
        <h2 className="text-2xl font-bold font-sans text-gray-800 mb-12">
          Suppliers
        </h2>

        {suppliers && (
          <SupplierDataTable
            data={suppliers}
            onSave={(e) => setIsLoading(true)}
          />
        )}
      </div>
    </Layout>
  );
};

export default withAuth(Suppliers);