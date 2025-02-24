import { useEffect, useState } from "react";
import Layout from "@/components/core/Layout";
import withAuth from "@/components/core/Auth";
import DTRTable from "@/components/tools/dtr/DTRTable";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dtrs, setDTRs] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("/api/collaboration/dtr/getAll", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setDTRs(data);
        setIsLoading(false);
      });
  }, [isLoading]);

  if (isLoading) {
    return (
      <Layout>
        <div className="mx-8 font-sans">
          <h2 className="text-2xl font-bold font-sans text-gray-800 mb-6">
            Daily Time Records
          </h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-8 font-sans text-xs">
        <h2 className="text-2xl font-bold font-sans text-gray-800 mb-12">
          Daily Time Records
        </h2>
        {dtrs && <DTRTable data={dtrs} />}
      </div>
    </Layout>
  );
};

export default withAuth(App);
