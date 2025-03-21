import { useEffect, useState } from "react";
import Layout from "@/components/core/Layout";
import withAuth from "@/components/core/Auth";
import TeamsDataTable from "@/components/profiles/teams/TeamsDataTable";

const Teams = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("/api/masterdata/teams/getTeams", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setTeams(data);
        setIsLoading(false);
      });
  }, [isLoading]);

  if (isLoading) {
    return (
      <Layout>
        <div className="mx-8 font-sans text-sm">
          <h2 className="text-2xl font-bold font-sans text-gray-800 mb-6">
            Teams
          </h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-8 font-sans text-xs">
        <h2 className="text-2xl font-bold font-sans text-gray-800 mb-12">
          Teams
        </h2>

        {teams && (
          <TeamsDataTable
            data={teams}
            onSave={(e) => setIsLoading(true)}
          />
        )}
      </div>
    </Layout>
  );
};

export default withAuth(Teams);