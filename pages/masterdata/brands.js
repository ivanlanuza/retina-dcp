import { useEffect, useState } from "react";
import Layout from "@/components/core/Layout";
import withAuth from "@/components/core/Auth";
import BrandsDataTable from "@/components/profiles/brands/BrandsDataTable";

const Brands = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("/api/masterdata/brands/getBrands", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setBrands(data);
        setIsLoading(false);
      });
  }, [isLoading]);

  if (isLoading) {
    return (
      <Layout>
        <div className="mx-8 font-sans text-sm">
          <h2 className="text-2xl font-bold font-sans text-gray-800 mb-6">
            Brands
          </h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-8 font-sans text-xs">
        <h2 className="text-2xl font-bold font-sans text-gray-800 mb-12">
          Brands
        </h2>

        {brands && (
          <BrandsDataTable
            data={brands}
            onSave={(e) => setIsLoading(true)}
          />
        )}
      </div>
    </Layout>
  );
};

export default withAuth(Brands);