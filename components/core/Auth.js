"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/");
      }
    }, [router.push]);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
