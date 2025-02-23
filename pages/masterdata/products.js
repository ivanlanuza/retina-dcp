import { useEffect, useState } from "react";
import Layout from "@/components/core/Layout";
import ProductsDataTable from "@/components/profiles/products/ProductsDataTable";
import withAuth from "@/components/core/Auth";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(true);
  const [supplierlist, setSupplierList] = useState([]);

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
        setProducts(data);
        setIsLoading(false);
        //console.log(data);
      });

    fetch("/api/masterdata/suppliers/getSuppliers", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setSupplierList(data);
        //console.log(data);
        setIsLoadingSuppliers(false);
      });
  }, [isLoading]);

  if (isLoading || isLoadingSuppliers) {
    return (
      <Layout>
        <div className="mx-8 font-sans text-sm">
          <h2 className="text-2xl font-bold font-sans text-gray-800 mb-6">
            Products
          </h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-8 font-sans text-xs">
        <h2 className="text-2xl font-bold font-sans text-gray-800 mb-12">
          Products
        </h2>

        {products && (
          <ProductsDataTable
            data={products}
            supplierlist={supplierlist}
            onSave={(e) => setIsLoading(true)}
          />
        )}
      </div>
    </Layout>
  );
};

export default withAuth(App);
