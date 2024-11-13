import  { useEffect, useState } from 'react';
import axios from 'axios';
import './ngu.css'; // Import CSS file
import { useNavigate, useParams } from 'react-router-dom';

const UserDetailPage = () => {
  const { id } = useParams(); // Get accountId from URL
  const [userDetails, setUserDetails] = useState(null); // Store user details
  const [formData, setFormData] = useState({}); // Store form data for editing
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [isEditing, setIsEditing] = useState(false); // Toggle edit mode
  const [selectedImage, setSelectedImage] = useState(null); // Store selected image for upload
  const navigate = useNavigate(); // For navigation

  // API URL
  const API_URL = 'http://localhost:8080';

  // Default profile image URL
  const defaultProfileImage = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  // Fetch user details from API
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/accounts/${id}/detail`);
        setUserDetails(response.data);
        setFormData(response.data); // Initialize formData with fetched data
      } catch (err) {
        setError(err.response ? err.response.data.message : 'Error loading user details.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  // Handle input field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Toggle edit mode
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  // Save changes and update user details
  const handleSaveChanges = async () => {
    try {
      const { password, phone, role, ...dataToUpdate } = formData; // Exclude unnecessary fields
      const response = await axios.put(`${API_URL}/accounts/${id}/update`, dataToUpdate);

      if (response.status === 200) {
        setUserDetails(formData);
        setIsEditing(false);
      }
    } catch (err) {
      setError('Error updating user information.');
      console.error(err);
    }
  };

  // Handle image change
  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  // Upload image
  const handleImageUpload = async () => {
    if (!selectedImage) {
      setError('Please select an image before uploading.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedImage);  // Ensure the field name is 'file'

    try {
      const response = await axios.post(`${API_URL}/media/account/${id}/upload/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Ensure Content-Type is multipart/form-data
        },
      });

      if (response.status === 200) {
        setUserDetails({ ...userDetails, mediaUrl: response.data.imageUrl });
        setSelectedImage(null);
      }
    } catch (err) {
      if (err.response) {
        setError(`Error: ${err.response.data.message || 'Unable to upload image.'}`);
      } else {
        setError('Unknown error occurred while uploading image.');
      }
      console.error(err);
    }
  };

  // Display loading state
  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  // Display error message
  if (error) {
    return <div className="error-message">{error}</div>;
  }

  // Check if mediaUrl is valid
  const mediaUrl = userDetails.mediaUrl?.startsWith('https') ? userDetails.mediaUrl : defaultProfileImage;

  return (
    <div className="user-detail-container">
      <h1>User Details</h1>
      {userDetails && (
        <div>
          {/* Display user image */}
          <img
            src={mediaUrl || defaultProfileImage}  // Use default image if mediaUrl is not available
            alt="Profile"
            className="profile-image"
          />
          <div className="user-info">
            {isEditing ? (
              <div>
                <p><strong>ID:</strong> {userDetails.id}</p>
                <p>
                  <strong>Name:</strong>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    placeholder="Enter name"
                  />
                </p>
                <p>
                  <strong>Email:</strong>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    placeholder="Enter email"
                  />
                </p>
                <p>
                  <strong>Address:</strong>
                  <input
                    type="text"
                    name="address"
                    value={formData.address || ''}
                    onChange={handleInputChange}
                    placeholder="Enter address"
                  />
                </p>
                <button className="button" onClick={handleSaveChanges}>Save Changes</button>
                <button className="back-button" onClick={handleEditToggle}>Cancel</button>
              </div>
            ) : (
              <div>
                <p><strong>ID:</strong> {userDetails.id}</p>
                <p><strong>Name:</strong> {userDetails.name}</p>
                <p><strong>Phone:</strong> {userDetails.phone || "No phone number"}</p>
                <p><strong>Email:</strong> {userDetails.email}</p>
                <p><strong>Address:</strong> {userDetails.address}</p>
                <p><strong>Role:</strong> {userDetails.role}</p>
              </div>
            )}
          </div>

          {isEditing && (
            <div className="form-container">
              <input type="file" onChange={handleImageChange} />
              <button className="button" onClick={handleImageUpload}>Upload Image</button>
            </div>
          )}

          <div className="button-container">
            <button className="back-button" onClick={() => navigate(-1)}>Go Back</button>
            <button className="button" onClick={handleEditToggle}>{isEditing ? 'Cancel' : 'Edit Profile'}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetailPage;
