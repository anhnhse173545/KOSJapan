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
  const [imageFile, setImageFile] = useState(null); // Store the selected image file
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/accounts/AC0007/detail`);
        setUserDetails(response.data);
        setFormData(response.data); // Initialize formData with fetched data
      } catch (err) {
        setError('Lỗi khi tải thông tin người dùng.');
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

  // Handle image file change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file); // Store the selected image file
  };

  // Toggle edit mode
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  // Save changes and optionally upload image
  const handleSaveChanges = async () => {
    try {
      const { password, phone, role, ...dataToUpdate } = formData; // Exclude password, phone, and role from update data

      // Prepare form data for uploading image
      const formDataToSend = new FormData();
      for (const key in dataToUpdate) {
        formDataToSend.append(key, dataToUpdate[key]);
      }
      if (imageFile) {
        formDataToSend.append('profile_image', imageFile); // Append the image file
      }

      // Send the PUT request to update user details
      await axios.put(`http://localhost:8080/accounts/AC0007/update`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set the content type for form data
        },
      });

      // Update displayed data
      setUserDetails({ ...dataToUpdate, profile_image: imageFile ? URL.createObjectURL(imageFile) : userDetails.profile_image });
      setIsEditing(false); // Exit edit mode
      setImageFile(null); // Clear the image file
    } catch (err) {
      setError('Lỗi khi cập nhật thông tin người dùng.');
    }
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="user-detail-container">
      <h1>Thông tin người dùng</h1>
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
                <p>
                  <strong>Profile Image:</strong> 
                  <input type="file" accept="image/*" onChange={handleImageChange} />
                </p>
                <button className="back-button" onClick={handleSaveChanges}>Save Changes</button>
                <button className="back-button" onClick={handleEditToggle}>Cancel</button>
              </div>
            ) : (
              <div>
                <p><strong>ID:</strong> {userDetails.id}</p>
                <p><strong>Name:</strong> {userDetails.name}</p>
                <p><strong>Phone:</strong> {userDetails.phone || "09819156357"}</p>
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
