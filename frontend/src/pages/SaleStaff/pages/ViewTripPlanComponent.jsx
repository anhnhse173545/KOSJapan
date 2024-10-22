'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { Calendar, DollarSign, MapPin, Loader2, AlertCircle, Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ViewTripPlanComponent() {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [booking, setBooking] = useState(null)
  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingDestination, setEditingDestination] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [farms, setFarms] = useState([])
  const [varieties, setVarieties] = useState([])

  useEffect(() => {
    if (bookingId) {
      Promise.all([
        fetchTripData(),
        fetchFarms(),
        fetchVarieties(),
        fetchBooking()
      ]).finally(() => setLoading(false))
    } else {
      setError('No booking ID provided')
      setLoading(false)
    }
  }, [bookingId])

  const handleApiResponse = async (response, errorMessage) => {
    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const errorData = await response.json();
        throw new Error(errorData.message || `${errorMessage}: ${response.status}`);
      } else {
        const text = await response.text();
        console.error(`Unexpected response:`, text);
        throw new Error(`${errorMessage}: Unexpected response from server`);
      }
    }
    return response.json();
  }

  const fetchTripData = async () => {
    try {
      const response = await fetch(`/api/booking/${bookingId}/trip`)
      const data = await handleApiResponse(response, 'Error fetching trip data')
      setTrip(data)
    } catch (err) {
      console.error('Error fetching trip data:', err)
      setError(err.message)
    }
  }

  const fetchFarms = async () => {
    try {
      const response = await fetch('/api/farm/list')
      const data = await handleApiResponse(response, 'Error fetching farms')
      setFarms(data)
    } catch (err) {
      console.error('Error fetching farms:', err)
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  const fetchVarieties = async () => {
    try {
      const response = await fetch('/api/variety/list')
      const data = await handleApiResponse(response, 'Error fetching varieties')
      setVarieties(data)
    } catch (err) {
      console.error('Error fetching varieties:', err)
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  const fetchBooking = async () => {
    try {
      const response = await fetch(`/api/booking/${bookingId}`)
      const data = await handleApiResponse(response, 'Error fetching booking')
      setBooking(data)
    } catch (err) {
      console.error('Error fetching booking:', err)
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  const handleCreateDestination = async (newDestination) => {
    try {
      if (!trip || !trip.id) {
        throw new Error('Trip data is not available')
      }

      if (!newDestination.farmId) {
        throw new Error('Please select a farm')
      }

      const requestBody = {
        farmId: parseInt(newDestination.farmId, 10),
        visitDate: newDestination.visitDate,
        description: newDestination.description,
      }

      const response = await fetch(`/api/trip-destination/${trip.id}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      await handleApiResponse(response, 'Error creating destination')
      await fetchTripData()
      toast({
        title: "Success",
        description: "Destination created successfully",
      })
    } catch (err) {
      console.error('Error creating destination:', err)
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  const handleUpdateDestination = async (updatedDestination) => {
    try {
      const response = await fetch(`/api/trip-destination/${updatedDestination.id}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          farmId: parseInt(updatedDestination.farm.id, 10),
          visitDate: updatedDestination.visitDate,
          description: updatedDestination.description,
        }),
      })
      await handleApiResponse(response, 'Error updating destination')
      await fetchTripData()
      toast({
        title: "Success",
        description: "Destination updated successfully",
      })
    } catch (err) {
      console.error('Error updating destination:', err)
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  const handleDeleteDestination = async (destinationId) => {
    try {
      const response = await fetch(`/api/trip-destination/${destinationId}/delete`, {
        method: 'DELETE',
      })
      await handleApiResponse(response, 'Error deleting destination')
      await fetchTripData()
      toast({
        title: "Success",
        description: "Destination deleted successfully",
      })
    } catch (err) {
      console.error('Error deleting destination:', err)
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      (<div className="flex justify-center items-center h-screen">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading...
              </div>)
    );
  }

  if (error) {
    return (
      (<div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => navigate(-1)} variant="outline" className="mt-4">
          Back to Bookings
        </Button>
      </div>)
    );
  }

  if (!trip) {
    return <div className="text-center">No trip data found.</div>;
  }

  return (
    (<div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Trip Plan Details</CardTitle>
          <CardDescription>View your trip plan information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bookingId">Booking ID</Label>
              <Input id="bookingId" value={trip.bookingId} readOnly />
            </div>
            <div>
              <Label htmlFor="departureAirport">Departure Airport</Label>
              <Input id="departureAirport" value={trip.departureAirport} readOnly />
            </div>
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                <Input id="startDate" value={format(new Date(trip.startDate), 'PP')} readOnly />
              </div>
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                <Input id="endDate" value={format(new Date(trip.endDate), 'PP')} readOnly />
              </div>
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <div className="flex items-center">
                <DollarSign className="mr-2 h-4 w-4" />
                <Input id="price" value={`$${trip.price.toFixed(2)}`} readOnly />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={trip.description} readOnly className="h-24" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Trip Destinations</CardTitle>
          <div className="flex justify-end">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingDestination(null)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Destination
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{editingDestination ? 'Edit Destination' : 'Add New Destination'}</DialogTitle>
                  <DialogDescription>
                    {editingDestination ? 'Edit the destination details below.' : 'Enter the details for the new destination.'}
                  </DialogDescription>
                </DialogHeader>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const formData = new FormData(e.currentTarget)
                    const destinationData = {
                      farmId: formData.get('farmId'),
                      visitDate: formData.get('visitDate'),
                      description: formData.get('description'),
                    }
                    if (editingDestination) {
                      handleUpdateDestination({ ...editingDestination, ...destinationData })
                    } else {
                      handleCreateDestination(destinationData)
                    }
                    setIsDialogOpen(false)
                  }}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="farmId" className="text-right">
                        Farm
                      </Label>
                      <Select
                        name="farmId"
                        defaultValue={editingDestination?.farm?.id?.toString()}
                        required>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select a farm" />
                        </SelectTrigger>
                        <SelectContent>
                          {farms.map((farm) => (
                            <SelectItem key={farm.id} value={farm.id.toString()}>{farm.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="visitDate" className="text-right">
                        Visit Date
                      </Label>
                      <Input
                        id="visitDate"
                        name="visitDate"
                        type="date"
                        defaultValue={editingDestination?.visitDate?.split('T')[0]}
                        className="col-span-3"
                        required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        defaultValue={editingDestination?.description}
                        className="col-span-3"
                        required />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">{editingDestination ? 'Update' : 'Add'} Destination</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {trip.destinations && trip.destinations.length > 0 ? (
            <Table>
              <TableCaption>A list of destinations for this trip.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Farm</TableHead>
                  <TableHead>Visit Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Varieties</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trip.destinations.map((destination) => (
                  <TableRow key={destination.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4" />
                        {destination.farm.name}
                      </div>
                    </TableCell>
                    <TableCell>{format(new Date(destination.visitDate), 'PP')}</TableCell>
                    <TableCell>{destination.description}</TableCell>
                    <TableCell>
                      {destination.farm.varieties.map(variety => variety.name).join(', ')}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingDestination(destination)
                            setIsDialogOpen(true)
                          
                          }}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteDestination(destination.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center">No destinations found for this trip.</div>
          )}
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button onClick={() => navigate(-1)} variant="outline">Back to Bookings</Button>
      </div>
    </div>)
  );
}