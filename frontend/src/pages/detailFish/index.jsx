import { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronLeft, Loader2, CreditCard } from 'lucide-react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function KoiDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [koi, setKoi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(''); // New state for notification

  const koiImages = [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzcBtmj3RHFskdPjhXC6Fn3E7Cvh4N1v9yBw&s',
    'https://t4.ftcdn.net/jpg/05/75/48/57/360_F_575485756_WSQ6ZzqMhD0JnPcEupxyKikKKCE5p5jo.jpg',
    // ... other images
  ];

  const getRandomImage = (images) => {
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  };

  useEffect(() => {
    const fetchKoi = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/fish-order/customer/AC0007`);
        const order = response.data.find(order => order.id === id);
        if (order) {
          setKoi(order);
        } else {
          setError('Koi order not found');
        }
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchKoi();
  }, [id]);

  const handleReject = async () => {
    try {
      const apiUrl = `http://localhost:8080/fish-order/${koi.bookingId}/${koi.farmId}/update`;
      
      // Set both paymentStatus and status to 'Rejected'
      const updatedData = {
        paymentStatus: 'Rejected',
        status: 'Rejected',
      };
  
      await axios.put(apiUrl, updatedData);
      
      // Update both states in the koi object
      setKoi(prev => ({ ...prev, paymentStatus: 'Rejected', status: 'Rejected' }));
  
      // Set notification message
      setNotification('Koi order has been rejected successfully.');
    } catch (error) {
      console.error('Failed to update status:', error);
      setError('Failed to update status');
    }
  };
  

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!koi) {
    return <div className="text-center">Koi not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-center mb-8">Koi Detail</h1>

        {/* Notification Message */}
        {notification && (
          <div className="bg-green-500 text-white p-4 rounded mb-4 text-center">
            {notification}
          </div>
        )}

        {koi.fishOrderDetails.map((orderDetail, index) => (
          <motion.div
            key={orderDetail.fish.fish_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{orderDetail.fish.fish_variety_name}</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                  <img
                    src={getRandomImage(koiImages)}
                    alt={orderDetail.fish.fish_variety_name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <p><span className="font-semibold">Koi ID:</span> {orderDetail.fish.fish_id}</p>
                  <p><span className="font-semibold">Length:</span> {orderDetail.fish.length} cm</p>
                  <p><span className="font-semibold">Weight:</span> {orderDetail.fish.weight} kg</p>
                  <p><span className="font-semibold">Description:</span> {orderDetail.fish.description}</p>
                  <p><span className="font-semibold">Price:</span> ${orderDetail.price}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        <div className="mt-8 space-y-4">
          {['Pending', 'Deposited', 'In Transit', 'Delivering'].includes(koi.status) && (
            <Button 
              className="w-full"
              variant="destructive"
              onClick={handleReject}
            >
              Rejected
            </Button>
          )}

          {/* Other buttons... */}
          <div className="mt-8 space-y-4">
  {/* Other buttons */}
  {koi.status === 'Pending' && (
    <Button 
      className="w-full" 
      variant="default" 
      onClick={() => navigate(`/paykoi50/${koi.id}`)}
    >
      Pay 50%
    </Button>
  )}

  {/* Finish Payment button for Delivering status */}
  {(koi.paymentStatus === 'Delivering' && koi.status === 'Delivering') && (
    <Button 
      className="w-full"
      onClick={() => navigate(`/paykoi100/${koi.id}`)}
    >
      <CreditCard className="w-4 h-4 mr-2" />
      Finish Payment
    </Button>
  )}

  {/* Back to My Koi link */}
  <Link to="/mykoi" className="block text-center">
    <Button variant="outline" className="w-full">
      <ChevronLeft className="w-4 h-4 mr-2" />
      Back to My Koi
    </Button>
  </Link>
</div>
         
        </div>
      </motion.div>
    </div>
  );
}
