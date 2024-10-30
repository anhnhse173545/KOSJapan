import { useEffect, useState } from 'react';
import axios from 'axios';
import './ngu.css'; // Import CSS file
import { useNavigate } from 'react-router-dom';

const UserDetailPage = ({ accountId }) => {
  const [userDetails, setUserDetails] = useState(null); // Store fetched user details
  const [formData, setFormData] = useState({}); // Store form data for editing
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error message state
  const [isEditing, setIsEditing] = useState(false); // Edit mode toggle
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/accounts/AC0007/detail`);
        setUserDetails(response.data);
        setFormData(response.data); // Initialize formData with fetched data
      } catch (err) {
        setError('Error loading user details.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [accountId]);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Toggle edit mode
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  // Save changes and optionally upload image
  const handleSaveChanges = async () => {
    try {
        const { password, phone, role, ...dataToUpdate } = formData; // Exclude sensitive fields if necessary
        const formDataToSend = new FormData();
        
        formDataToSend.append("userDetails", JSON.stringify(dataToUpdate));
 // Convert other data to JSON
        
       

        await axios.put(`http://localhost:8080/accounts/AC0007/update`, formDataToSend, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Update state accordingly
        setIsEditing(false);
       
    } catch (err) {
        setError('Error updating user details.');
    }
};


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="user-detail-container">
      <h1>User Details</h1>
      {userDetails && (
        <div>
          <img 
            src={userDetails.profile_image || "https://i.pinimg.com/236x/59/f0/d0/59f0d0067c5d04c5db5f92f517767002.jpg"} 
            alt="Profile" 
            className="profile-image" 
          />
          <div className="user-info">
            {isEditing ? (
              <div>
                <p><strong>ID:</strong> {userDetails.id}</p>
                <p>
                  <strong>Name:</strong> 
                  <input type="text" name="name" value={formData.name || ''} onChange={handleInputChange} />
                </p>
                <p>
                  <strong>Email:</strong> 
                  <input type="email" name="email" value={formData.email || ''} onChange={handleInputChange} />
                </p>
                <p>
                  <strong>Address:</strong> 
                  <input type="text" name="address" value={formData.address || ''} onChange={handleInputChange} />
                </p>
               
                <button className="back-button" onClick={handleSaveChanges}>Save Changes</button>
                <button className="back-button" onClick={handleEditToggle}>Cancel</button>
              </div>
            ) : (
              <div>
                <p><strong>ID:</strong> {userDetails.id}</p>
                <p><strong>Name:</strong> {userDetails.name}</p>
                <p><strong>Phone:</strong> {userDetails.phone || "No phone available"}</p>
                <p><strong>Email:</strong> {userDetails.email}</p>
                <p><strong>Address:</strong> {userDetails.address}</p>
                <p><strong>Role:</strong> {userDetails.role}</p>
              </div>
            )}
          </div>
          <button className="back-button" onClick={() => navigate(-1)}>Back</button>
          <button className="back-button" onClick={handleEditToggle}>Edit Profile</button>
        </div>
      )}
    </div>
  );
};

export default UserDetailPage;
