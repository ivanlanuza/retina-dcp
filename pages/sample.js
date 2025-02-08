import { useState, useEffect } from "react";
import Layout from "@/components/core/Layout";

export default function Dashboard() {
  const [users, setUsers] = useState();

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("/api/users/getUsers", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.body.users);
        console.log(data.body.users);
      });
  }, []);

  return (
    <Layout>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <p className="text-gray-600">Main content area</p>
        {users &&
          users.map((user) => (
            <p key={user.id}>
              <p>{user.username}</p>
              <p>{user.id}</p>
              <p>{user.id}</p>
              <p>{user.id}</p>
            </p>
          ))}
      </div>
    </Layout>
  );
}
