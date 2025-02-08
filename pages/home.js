import { useState, useEffect } from "react";
import Layout from "@/components/core/Layout";
import withAuth from "@/components/core/Auth";

const Home = () => {
  return (
    <Layout>
      <div className="font-sans">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-gray-600">Main content area</p>
        </div>
      </div>
    </Layout>
  );
};

export default withAuth(Home);
