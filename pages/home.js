import { useState, useEffect } from "react";
import Layout from "@/components/core/Layout";
import withAuth from "@/components/core/Auth";
import Dashboard from "@/components/core/Dashboard";

const Home = () => {
  return (
    <Layout>
      <Dashboard />;
    </Layout>
  );
};

export default withAuth(Home);
