import { useEffect, useState } from "react";
import Layout from "@/components/core/Layout";
import withAuth from "@/components/core/Auth";
import CompetitorsDataTable from "@/components/profiles/competitors/CompetitorsDataTable";

const Competitors = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [competitors, setCompetitors] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("/api/masterdata/competitors/getCompetitors", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCompetitors(data);
        setIsLoading(false);
      });
  }, [isLoading]);

  if (isLoading) {
    return (
      <Layout>
        <div className="mx-8 font-sans text-sm">
          <h2 className="text-2xl font-bold font-sans text-gray-800 mb-6">
            Competitors
          </h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-8 font-sans text-xs">
        <h2 className="text-2xl font-bold font-sans text-gray-800 mb-12">
          Competitors
        </h2>

        {competitors && (
          <CompetitorsDataTable
            data={competitors}
            onSave={(e) => setIsLoading(true)}
          />
        )}
      </div>
    </Layout>
  );
};

export default withAuth(Competitors);