import  { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './CreateTripDestination.scss'; // Đảm bảo đường dẫn đúng đến CSS

const CreateTripDestination = () => {
    const { tripId } = useParams(); // Lấy tripId từ URL
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [name, setName] = useState('');
    const [image, setImage] = useState(null); // Giả sử đây là đường dẫn hình ảnh
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); // Ngăn chặn hành động mặc định của form

        const tripDestinationData = {
            farm: {
                address,
                phoneNumber,
                name,
                image, // Nếu có hình ảnh, bạn có thể gửi đường dẫn hoặc null
            },
        };

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/trip-destination/${tripId}/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tripDestinationData),
            });

            if (!response.ok) {
                throw new Error('Không thể tạo điểm đến');
            }

            const data = await response.json(); // Lấy dữ liệu phản hồi từ server
            setSuccess('Điểm đến đã được tạo thành công!');
            setError(null);
            console.log('Created Trip Destination:', data);
            
            // Chuyển hướng sau khi thành công
            setTimeout(() => navigate(`/trip/${tripId}`), 2000);
        } catch (error) {
            setError(error.message);
            setSuccess(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-trip-destination">
            <h2>Tạo Điểm Đến Mới</h2>
            {loading && <div className="loading">Loading...</div>}
            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}
            <form onSubmit={handleSubmit}>
                <label>
                    Địa Chỉ Nông Trại:
                    <input 
                        type="text" 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)} 
                        required 
                        aria-label="Farm Address"
                    />
                </label>
                <label>
                    Số Điện Thoại:
                    <input 
                        type="text" 
                        value={phoneNumber} 
                        onChange={(e) => setPhoneNumber(e.target.value)} 
                        required 
                        aria-label="Farm Phone Number"
                    />
                </label>
                <label>
                    Tên Nông Trại:
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                        aria-label="Farm Name"
                    />
                </label>
                <label>
                    Hình Ảnh:
                    <input 
                        type="text" 
                        value={image || ''} 
                        onChange={(e) => setImage(e.target.value)} 
                        aria-label="Farm Image"
                    />
                </label>
                <button type="submit">Tạo Điểm Đến</button>
            </form>
            <button onClick={() => navigate(-1)} className="back-button">Quay Lại</button>
        </div>
    );
};

export default CreateTripDestination;
