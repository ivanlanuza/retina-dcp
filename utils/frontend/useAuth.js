import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";

export default function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; 
      if (decodedToken.exp < currentTime) {
        // Token is expired
        localStorage.removeItem("token");
        router.replace("/");
      } else {
        // Token is valid
        setIsAuthenticated(true);
        router.replace("/home");
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      router.replace("/");
    }
  }, [router]);

  return isAuthenticated;
}