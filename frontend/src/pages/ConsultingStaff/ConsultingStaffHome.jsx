import { useState, useEffect } from "react";

const ConsultingStaffHome = () => {
  const [userName, setUserName] = useState("Loading..."); // State to hold fetched user name

  useEffect(() => {
    // Fetch user details from the API when the component mounts
    const fetchUserName = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/accounts/AC0004/detail"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setUserName(data.name); // Assuming the API response has a `name` field
      } catch (error) {
        console.error("Failed to fetch user details:", error);
        setUserName("Error fetching name");
      }
    };

    fetchUserName();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  return (
    <div>
      <h1>Welcome, {userName}!</h1> {/* Display the fetched user name */}
      <p>We wish you a good working day!</p>
    </div>
  );
};

export default ConsultingStaffHome;
