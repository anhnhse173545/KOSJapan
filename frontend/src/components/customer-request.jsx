'use client';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2, Search, Eye } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { toast } from "@/components/ui/use-toast"

const PAGE_SIZE = 10

const bookingStatusOptions = [
  "Requested",
  "Approved Quote",
  "Paid Booking",
  "Canceled"
]

const tripStatusOptions = [
  "Not Started",
  "In Progress",
  "Completed",
  "Canceled"
]

export function CustomerRequest() {
  const [bookings, setBookings] = useState([])
  const [filteredBookings, setFilteredBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/booking/sale-staff/AC0002?timestamp=${new Date().getTime()}`
        )
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        setBookings(data)
        setFilteredBookings(data)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  useEffect(() => {
    const filtered = bookings.filter(booking => 
      booking.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.description.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredBookings(filtered)
    setCurrentPage(1)
  }, [searchTerm, bookings])

  const handleBookingStatusUpdate = async (booking) => {
    if (!booking.newBookingStatus) return

    try {
      const response = await fetch(`http://localhost:8080/api/booking/update/${booking.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...booking,
          status: booking.newBookingStatus,
        }),
      })

      if (!response.ok) {
        throw new Error('Booking status update failed')
      }

      const updatedBooking = await response.json()
      updateBookingInState(updatedBooking)
      toast({
        title: "Success",
        description: "Booking status updated successfully",
      })
    } catch (error) {
      console.error('Error updating booking status:', error)
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      })
    }
  }

  const handleTripStatusUpdate = async (booking) => {
    if (!booking.newTripStatus) return

    try {
      const response = await fetch(`http://localhost:8080/api/trip/update/${booking.trip.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: booking.newTripStatus,
        }),
      })

      if (!response.ok) {
        throw new Error('Trip status update failed')
      }

      const updatedTrip = await response.json()
      updateTripStatusInState(booking.id, updatedTrip.status)
      toast({
        title: "Success",
        description: "Trip status updated successfully",
      })
    } catch (error) {
      console.error('Error updating trip status:', error)
      toast({
        title: "Error",
        description: "Failed to update trip status",
        variant: "destructive",
      })
    }
  }

  const updateBookingInState = (updatedBooking) => {
    const updatedBookings = bookings.map(b => 
      b.id === updatedBooking.id ? { ...b, ...updatedBooking, newBookingStatus: undefined } : b)
    setBookings(updatedBookings)
    setFilteredBookings(updatedBookings)
  }

  const updateTripStatusInState = (bookingId, newTripStatus) => {
    const updatedBookings = bookings.map(b => 
      b.id === bookingId ? { ...b, trip: { ...b.trip, status: newTripStatus }, newTripStatus: undefined } : b)
    setBookings(updatedBookings)
    setFilteredBookings(updatedBookings)
  }

  const paginatedBookings = filteredBookings.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const totalPages = Math.ceil(filteredBookings.length / PAGE_SIZE)

  if (loading) {
    return (
      (<div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>)
    );
  }

  if (error) {
    return (
      (<Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>)
    );
  }

  return (
    (<Card className="w-full">
      <CardHeader>
        <CardTitle>Customer Booking Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-[300px]" />
          </div>
          <Button onClick={() => navigate('/createTrip')}>Create New Booking</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Customer Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Booking Status</TableHead>
              <TableHead>Trip Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedBookings.map(booking => (
              <TableRow key={booking.id}>
                <TableCell>{booking.id}</TableCell>
                <TableCell>{booking.customer.name}</TableCell>
                <TableCell>{booking.customer.email}</TableCell>
                <TableCell>{booking.description}</TableCell>
                <TableCell>{new Date(booking.createAt).toLocaleString()}</TableCell>
                <TableCell>{booking.status}</TableCell>
                <TableCell>{booking.trip.status}</TableCell>
                <TableCell>
                  <div className="flex flex-col space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/createTrip/${booking.id}`)}>Edit</Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate(`/viewTrip/${booking.trip.id}`)}>
                      <Eye className="mr-2 h-4 w-4" /> View Trip
                    </Button>
                    <Select
                      value={booking.newBookingStatus || ''}
                      onValueChange={(value) => {
                        const updatedBookings = bookings.map(b =>
                          b.id === booking.id ? { ...b, newBookingStatus: value } : b)
                        setBookings(updatedBookings)
                      }}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Booking Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {bookingStatusOptions.map(status => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button size="sm" onClick={() => handleBookingStatusUpdate(booking)}>Update Booking</Button>
                    <Select
                      value={booking.newTripStatus || ''}
                      onValueChange={(value) => {
                        const updatedBookings = bookings.map(b =>
                          b.id === booking.id ? { ...b, newTripStatus: value } : b)
                        setBookings(updatedBookings)
                      }}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Trip Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {tripStatusOptions.map(status => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button size="sm" onClick={() => handleTripStatusUpdate(booking)}>Update Trip</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1} />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink onClick={() => setCurrentPage(i + 1)} isActive={currentPage === i + 1}>
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardContent>
    </Card>)
  );
}