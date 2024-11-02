'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, CheckCircle2, XCircle, Calendar, User, Phone, Mail, FileText } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { motion } from "framer-motion"
import { useNavigate } from 'react-router-dom'

export default function BookingHistoryPage({ customerId = 'AC0007' }) {
  const [bookingHistory, setBookingHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate(); // For navigation
  useEffect(() => {
    const fetchBookingHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/booking/customer/AC0007`)
        const filteredBookings = response.data.filter(booking =>
          booking.status === 'Completed' || booking.status === 'Canceled'
        )
        setBookingHistory(filteredBookings)
      } catch (err) {
        setError('Lỗi khi tải lịch sử đặt chỗ.')
      } finally {
        setLoading(false)
      }
    }

    fetchBookingHistory()
  }, [customerId])

  if (loading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-12 w-[300px]" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-[250px] w-full rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-6">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle className="text-lg font-semibold">Lỗi</AlertTitle>
        <AlertDescription className="text-sm">{error}</AlertDescription>
      </Alert>
    )
  }

  return (

    <div className="space-y-8 p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      
      <motion.h1 
        className="text-4xl font-bold tracking-tight text-gray-900"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Customer booking history
      </motion.h1>
      {bookingHistory.length === 0 ? (
        <Alert className="bg-white/50 backdrop-blur-sm border-gray-200">
          <AlertCircle className="h-5 w-5 text-blue-500" />
          <AlertTitle className="text-lg font-semibold text-gray-900">Notification</AlertTitle>
          <AlertDescription className="text-gray-600">
          There is no booking history with status completed or canceled.
          </AlertDescription>
        </Alert>
      ) : (
        <motion.div 
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
        >
          {bookingHistory.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden bg-white/70 backdrop-blur-sm border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gray-50 border-b border-gray-200">
                  <CardTitle className="flex items-center justify-between text-lg">
                    <span className="font-semibold text-gray-700">Booking Id: {booking.id}</span>
                    <Badge 
                      variant={booking.status === 'Completed' ? 'default' : 'destructive'}
                      className={`px-2 py-1 text-xs font-medium ${
                        booking.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {booking.status === 'Completed' ? (
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                      ) : (
                        <XCircle className="mr-1 h-3 w-3" />
                      )}
                      {booking.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <dl className="grid gap-3 text-sm">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      <dt className="font-medium text-gray-600 mr-2">Customer's Name:</dt>
                      <dd className="text-gray-900">{booking.customer.name}</dd>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      <dt className="font-medium text-gray-600 mr-2">Email:</dt>
                      <dd className="text-gray-900">{booking.customer.email}</dd>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-500" />
                      <dt className="font-medium text-gray-600 mr-2">Phone:</dt>
                      <dd className="text-gray-900">{booking.customer.phone}</dd>
                    </div>
                    <div className="flex items-start">
                      <FileText className="h-4 w-4 mr-2 text-gray-500 mt-1" />
                      <dt className="font-medium text-gray-600 mr-2">Description:</dt>
                      <dd className="text-gray-900">{booking.description}</dd>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <dt className="font-medium text-gray-600 mr-2">Created At:</dt>
                      <dd className="text-gray-900">{new Date(booking.createAt).toLocaleString('vi-VN', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit'
                      })}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
      <button  onClick={() => navigate(-1)}>Back</button>
    </div>
  )
}