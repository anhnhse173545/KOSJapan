import React, { useEffect, useState } from 'react';
import './index.scss';
import { useNavigate } from 'react-router-dom';

function App() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [newDescription, setNewDescription] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/booking/sale-staff/AC0002');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setBookings(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

 

    const handleUpdate = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/booking/${selectedBooking.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...selectedBooking, description: newDescription }),
            });

            if (!response.ok) {
                throw new Error('Update failed');
            }

            const updatedBooking = await response.json();
            setBookings(bookings.map(b => (b.id === updatedBooking.id ? updatedBooking : b)));
            setSelectedBooking(null); // Đóng modal sau khi cập nhật
            setNewDescription('');
        } catch (error) {
            setError(error.message);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="App">
            <h1>Customer Booking</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Customer name</th>
                        <th>Email</th>
                        <th>Description</th>
                        <th>Create at</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map(booking => (
                        <tr key={booking.id}>
                            <td>{booking.id}</td>
                            <td>{booking.customer.name}</td>
                            <td>{booking.customer.email}</td>
                            <td>{booking.description}</td>
                            <td>{new Date(booking.createAt).toLocaleString()}</td>
                            <td>{booking.status}</td>
                            <td>
                                <button onClick={() => navigate(`/createTrip/${booking.id}`)}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedBooking && (
                <div className="edit-modal">
                    <h2>Edit Booking</h2>
                    <label>
                        Mô Tả:
                        <input 
                            type="text" 
                            value={newDescription} 
                            onChange={(e) => setNewDescription(e.target.value)} 
                        />
                    </label>
                    <button onClick={handleUpdate}>Cập nhật</button>
                    <button onClick={() => setSelectedBooking(null)}>Hủy</button>
                </div>
            )}
        </div>
    );
}

export default App;
