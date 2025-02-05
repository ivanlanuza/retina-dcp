import Layout from "@/components/core/Layout";
import UsersDataTable from "@/components/profiles/users/UsersDataTable";

export default function Dashboard() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold font-sans text-gray-800 mb-6">
          Users
        </h2>
        <UsersDataTable />
      </div>
    </Layout>
  );
}
