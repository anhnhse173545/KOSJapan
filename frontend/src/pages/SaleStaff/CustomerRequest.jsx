import React, { useEffect, useState } from 'react';
import './CustomerRequest.scss';
import { useNavigate } from 'react-router-dom';

function CustomerRequest() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
 

    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
              const response = await fetch(`http://localhost:8080/api/booking/sale-staff/AC0002?timestamp=${new Date().getTime()}`);
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

    // Handle status change
    const handleStatusUpdate = async (booking) => {
        try {
            const response = await fetch(`http://localhost:8080/api/booking/update/${booking.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...booking, status: booking.newStatus }), // Update status
            });

            if (!response.ok) {
                throw new Error('Status update failed');
            }

            const updatedBooking = await response.json();
            setBookings(bookings.map(b => (b.id === updatedBooking.id ? updatedBooking : b)));
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
                        <th>Customer Name</th>
                        <th>Email</th>
                        <th>Description</th>
                        <th>Created At</th>
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
                                {/* Dropdown for changing status */}
                                <select
                                    value={booking.newStatus || ''} // Use local state for each booking
                                    onChange={(e) => {
                                        const updatedBookings = bookings.map(b =>
                                            b.id === booking.id ? { ...b, newStatus: e.target.value } : b
                                        );
                                        setBookings(updatedBookings);
                                    }}
                                >
                                    <option value="">--Change Status--</option>
                                    <option value="Requested">Requested</option>
                                    <option value="Approved Quote">Approved Quote</option>
                                    <option value="Paid Booking">Paid Booking</option>
                                    <option value="On-going">On-going</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Canceled">Canceled</option>
                                </select>
                                <button onClick={() => handleStatusUpdate(booking)}>Update Status</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CustomerRequest;
