'use client';

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2, Search, PlusCircle, CalendarIcon } from "lucide-react"
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
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const PAGE_SIZE = 10

const bookingStatusOptions = [
  "Requested",
  "Approved Quote",
  "Paid Booking",
  "Canceled"
]

const tripStatusOptions = [
  "Pending",
  "Approved",
  "Completed",
  "On-going"
]

const formSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }),
  departureAirport: z.string().min(1, "Departure airport is required"),
  price: z.number().min(0, "Price must be a positive number"),
  description: z.string().min(1, "Description is required"),
})

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function CreateTripForm({ onTripCreated, bookingId }) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bookingId: bookingId || "",
      startDate: new Date(),
      endDate: new Date(),
      departureAirport: "",
      price: 0,
      description: "",
    },
  })

  async function onSubmit(values) {
    setIsLoading(true)
    try {
      const response = await fetch(`http://localhost:8080/api/booking/${values.bookingId}/create-trip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate: values.startDate.toISOString(),
          endDate: values.endDate.toISOString(),
          departureAirport: values.departureAirport,
          price: values.price,
          description: values.description,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create trip')
      }

      const data = await response.json()
      toast({
        title: "Success",
        description: "Trip created successfully",
      })
      onTripCreated(data)
    } catch (error) {
      console.error('Error creating trip:', error)
      toast({
        title: "Error",
        description: "Failed to create trip",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    (<Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="bookingId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Booking ID</FormLabel>
              <FormControl>
                <Input placeholder="Enter booking ID" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Start Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={`w-[240px] pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}>
                      {field.value ? (
                        formatDate(field.value)
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )} />
        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>End Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={`w-[240px] pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}>
                      {field.value ? (
                        formatDate(field.value)
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )} />
        <FormField
          control={form.control}
          name="departureAirport"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Departure Airport</FormLabel>
              <FormControl>
                <Input placeholder="Enter departure airport" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter price"
                  {...field}
                  onChange={e => field.onChange(parseFloat(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter trip description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Trip"}
        </Button>
      </form>
    </Form>)
  );
}

export default function CustomerRequestJsx() {
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

  const handleTripCreated = (createdTrip) => {
    const updatedBookings = bookings.map(b => 
      b.id === createdTrip.bookingId ? { ...b, trip: createdTrip } : b)
    setBookings(updatedBookings)
    setFilteredBookings(updatedBookings)
  }

  const paginatedBookings = filteredBookings.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const totalPages = Math.ceil(filteredBookings.length / PAGE_SIZE)

  if (loading) {
    return (
      (<div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-4 animate-spin" />
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
    (<div className="space-y-6">
      <Card className="w-full">
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
            <Button onClick={() => navigate('/createBooking')}>Create New Booking</Button>
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
                  <TableCell>{booking.trip ? booking.trip.status : 'No Trip'}</TableCell>
                  <TableCell>
                    <div className="flex flex-col space-y-2">
                      {/* {booking.trip ? ( */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/ss-dashboard/view-tripplans/${booking.id}`)}>
                          View Trip
                        </Button>
                      {/* ) : ( */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <PlusCircle className="mr-2 h-4 w-4" />
                              Create Trip
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Create Trip for Booking {booking.id}</DialogTitle>
                            </DialogHeader>
                            <CreateTripForm onTripCreated={handleTripCreated} bookingId={booking.id} />
                          </DialogContent>
                        </Dialog>
                      {/* )} */}
                      {booking.trip && (
                        <>
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
                        </>
                      )}
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
      </Card>
    </div>)
  );
}