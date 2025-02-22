import { useEffect, useState } from "react";
import Layout from "@/components/core/Layout";
import withAuth from "@/components/core/Auth";
import SurveyDataTable from "@/components/tools/survey/SurveyDataTable";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("/api/survey/admin/getSurveyList", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setSurveys(data);
        setIsLoading(false);
      });
  }, [isLoading]);

  if (isLoading) {
    return (
      <Layout>
        <div className="mx-8 font-sans">
          <h2 className="text-2xl font-bold font-sans text-gray-800 mb-6">
            Surveys
          </h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-8 font-sans text-xs">
        <h2 className="text-2xl font-bold font-sans text-gray-800 mb-12">
          Surveys
        </h2>
        {surveys && (
          <SurveyDataTable
            surveydata={surveys}
            onSave={(e) => setIsLoading(true)}
          />
        )}
      </div>
    </Layout>
  );
};

export default withAuth(App);
