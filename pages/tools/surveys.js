import Layout from "@/components/core/Layout";
import UsersDataTable from "@/components/profiles/users/UsersDataTable";
//import useAuth from "@/utils/frontend/useAuth";

export default function Dashboard() {
  //  useAuth();
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold font-sans text-gray-800 mb-6">
          Surveys
        </h2>
      </div>
    </Layout>
  );
}
