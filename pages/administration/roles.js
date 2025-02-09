import Layout from "@/components/core/Layout";
import withAuth from "@/components/core/Auth";

const App = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold font-sans text-gray-800 mb-6">
          Roles
        </h2>
      </div>
    </Layout>
  );
};

export default withAuth(App);
