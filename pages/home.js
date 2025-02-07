import { useState, useEffect } from "react";
import Layout from "@/components/core/Layout";
import useAuth from "../utils/frontend/useAuth";
import axios from 'axios';

export default function Dashboard() {
  useAuth();

  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      const token = localStorage.getItem("token");
  
      const response = await axios({
        method: "GET",
        url: "http://localhost:3000/api/locations/getLocations",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      setLocations(response.data.body);
    };
  
    fetchLocations();
  }, []);

  useEffect(() => {
    console.log("Fetched Locations:", locations);
  }, [locations]);

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
