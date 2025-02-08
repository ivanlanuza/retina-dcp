import { useEffect, useState } from "react";
import Layout from "@/components/core/Layout";
import UsersDataTable from "@/components/profiles/users/UsersDataTable";
import withAuth from "@/components/core/Auth";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);

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
        setIsLoading(false);
        //console.log(data.body.users);
      });
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto font-sans">
          <h2 className="text-2xl font-bold font-sans text-gray-800 mb-6">
            Users
          </h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold font-sans text-gray-800 mb-6">
          Users
        </h2>

        <UsersDataTable userdata={users} />
      </div>
    </Layout>
  );
};

export default withAuth(Home);
