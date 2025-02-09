import { useEffect, useState } from "react";
import Layout from "@/components/core/Layout";
import UsersDataTable from "@/components/profiles/users/UsersDataTable";
import withAuth from "@/components/core/Auth";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);
  const [users, setUsers] = useState([]);
  const [rolelist, setRoleList] = useState([]);

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
        setUsers(data);
        setIsLoading(false);
      });

    fetch("/api/users/getRoles", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setRoleList(data);
        //console.log(data);
        setIsLoadingRoles(false);
      });
  }, [isLoading]);

  if (isLoading || isLoadingRoles) {
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
        {users && (
          <UsersDataTable
            userdata={users}
            rolelist={rolelist}
            onSave={(e) => setIsLoading(true)}
          />
        )}
      </div>
    </Layout>
  );
};

export default withAuth(App);
