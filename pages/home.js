import Layout from "@/components/core/Layout";

export default function Dashboard() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto font-sans">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-gray-600">Main content area</p>
        </div>
      </div>
    </Layout>
  );
}
