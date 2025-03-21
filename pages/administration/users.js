import { useEffect, useState } from "react";
import Layout from "@/components/core/Layout";
import UsersDataTable from "@/components/profiles/users/UsersDataTable";
import withAuth from "@/components/core/Auth";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);
  const [isLoadingAgencies, setIsLoadingAgencies] = useState(true);
  const [isLoadingTeams, setIsLoadingTeams] = useState(true);
  const [users, setUsers] = useState([]);
  const [rolelist, setRoleList] = useState([]);
  const [teamlist, setTeamList] = useState([]);
  const [agencylist, setAgencyList] = useState([]);

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
    
      fetch("/api/masterdata/agencies/getAgencies", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setAgencyList(data);
          //console.log(data);
          setIsLoadingAgencies(false);
        });

        fetch("/api/masterdata/teams/getTeams", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            setTeamList(data);
            //console.log(data);
            setIsLoadingTeams(false);
          });
  }, [isLoading]);

  if (isLoading || isLoadingRoles || isLoadingAgencies || isLoadingTeams) {
    return (
      <Layout>
        <div className="mx-8 font-sans text-xs">
          <h2 className="text-2xl font-bold font-sans text-gray-800 mb-12">
            Users
          </h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-8 font-sans text-xs">
        <h2 className="text-2xl font-bold font-sans text-gray-800 mb-12">
          Users
        </h2>
        {users && (
          <UsersDataTable
            userdata={users}
            rolelist={rolelist}
            agencylist={agencylist}
            teamlist={teamlist}
            onSave={(e) => setIsLoading(true)}
          />
        )}
      </div>
    </Layout>
  );
};

export default withAuth(App);
