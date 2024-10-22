import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2, Search, PlusCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { toast } from "@/components/ui/use-toast"

const PAGE_SIZE = 10
const API_BASE_URL = 'http://localhost:8080/api'

const tripStatusOptions = ["Pending", "Approved", "Completed", "On-going"]

const BookingRow = ({ booking, onTripStatusUpdate }) => {
  const navigate = useNavigate()
  const [newTripStatus, setNewTripStatus] = useState('')

  return (
    <TableRow>
      <TableCell>{booking.id}</TableCell>
      <TableCell>{booking.customer.name}</TableCell>
      <TableCell>{booking.customer.email}</TableCell>
      <TableCell>{booking.description}</TableCell>
      <TableCell>{new Date(booking.createAt).toLocaleString()}</TableCell>
      <TableCell>{booking.status}</TableCell>
      <TableCell>{booking.trip ? booking.trip.status : 'No Trip'}</TableCell>
      <TableCell>
        <div className="flex flex-col space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/ss-dashboard/view-tripplans/${booking.id}`)}
          >
            View Trip
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(`/ss-dashboard/create-trip/${booking.id}`)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Trip
          </Button>
          {booking.trip && (
            <>
              <Select value={newTripStatus} onValueChange={setNewTripStatus}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Trip Status" />
                </SelectTrigger>
                <SelectContent>
                  {tripStatusOptions.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size="sm" onClick={() => onTripStatusUpdate(booking.id, newTripStatus)}>
                Update Trip
              </Button>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  )
}

const CustomerRequestManagement = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const navigate = useNavigate()

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/booking/sale-staff/AC0002?timestamp=${new Date().getTime()}`
      )
      if (!response.ok) throw new Error('Network response was not ok')
      const data = await response.json()
      setBookings(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  const filteredBookings = bookings.filter(booking => 
    booking.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.description.toLowerCase().includes(searchTerm.toLowerCase()))

  const paginatedBookings = filteredBookings.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const totalPages = Math.ceil(filteredBookings.length / PAGE_SIZE)

  const handleTripStatusUpdate = async (bookingId, newStatus) => {
    if (!newStatus) return

    try {
      const booking = bookings.find(b => b.id === bookingId)
      const response = await fetch(`${API_BASE_URL}/trip/update/${booking.trip.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error('Trip status update failed')

      const updatedTrip = await response.json()
      setBookings(prevBookings => prevBookings.map(b => 
        b.id === bookingId ? { ...b, trip: { ...b.trip, status: updatedTrip.status } } : b))
      toast({ title: "Success", description: "Trip status updated successfully" })
    } catch (error) {
      console.error('Error updating trip status:', error)
      toast(
        { title: "Error", description: "Failed to update trip status", variant: "destructive" }
      )
    }
  }

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  )

  if (error) return (
    <Alert variant="destructive" className="m-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Customer Booking Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-full md:w-[300px]"
              />
            </div>
            <Button onClick={() => navigate('/createBooking')} className="w-full md:w-auto">
              Create New Booking
            </Button>
          </div>
          <div className="overflow-x-auto">
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
                  <BookingRow
                    key={booking.id}
                    booking={booking}
                    onTripStatusUpdate={handleTripStatusUpdate}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                />
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
                  disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardContent>
      </Card>
    </div>
  )
}

export default CustomerRequestManagement