'use client';
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Plus, Trash } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

const tripStatusOptions = [
  "Not Started",
  "In Progress",
  "Completed",
  "Canceled"
]

export function ViewTripComponent() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)
  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newDestination, setNewDestination] = useState({ name: '', description: '' })
  const [isAddingDestination, setIsAddingDestination] = useState(false)
  const [newTrip, setNewTrip] = useState({ customerId: '', salesStaffId: '', status: 'Not Started' })

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const tripResponse = await fetch(`http://localhost:8080/api/trip/get/${id}`)
        if (!tripResponse.ok) {
          if (tripResponse.status === 404) {
            setTrip(null)
            setLoading(false)
            return
          }
          throw new Error('Failed to fetch trip data')
        }
        const tripData = await tripResponse.json()
        setTrip(tripData)

        const destinationsResponse = await fetch(`http://localhost:8080/api/trip-destination/${id}/list`)
        if (!destinationsResponse.ok) throw new Error('Failed to fetch destinations')
        const destinationsData = await destinationsResponse.json()
        setDestinations(destinationsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchTripData()
  }, [id])

  const handleStatusUpdate = async (newStatus) => {
    try {
      const response = await fetch(`http://localhost:8080/api/trip/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!response.ok) throw new Error('Failed to update trip status')
      const updatedTrip = await response.json()
      setTrip(updatedTrip)
      toast({ title: "Success", description: "Trip status updated successfully" })
    } catch (err) {
      toast(
        { title: "Error", description: "Failed to update trip status", variant: "destructive" }
      )
    }
  }

  const handleDeleteTrip = async () => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/trip/${id}`, { method: 'DELETE' })
        if (!response.ok) throw new Error('Failed to delete trip')
        toast({ title: "Success", description: "Trip deleted successfully" })
        navigate('/trips') // Assuming you have a trips list page
      } catch (err) {
        toast(
          { title: "Error", description: "Failed to delete trip", variant: "destructive" }
        )
      }
    }
  }

  const handleAddDestination = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/trip-destination/${id}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDestination),
      })
      if (!response.ok) throw new Error('Failed to add destination')
      const addedDestination = await response.json()
      setDestinations([...destinations, addedDestination])
      setNewDestination({ name: '', description: '' })
      setIsAddingDestination(false)
      toast({ title: "Success", description: "Destination added successfully" })
    } catch (err) {
      toast(
        { title: "Error", description: "Failed to add destination", variant: "destructive" }
      )
    }
  }

  const handleDeleteDestination = async (destinationId) => {
    if (window.confirm('Are you sure you want to delete this destination?')) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/trip-destination/${destinationId}/delete`,
          { method: 'DELETE' }
        )
        if (!response.ok) throw new Error('Failed to delete destination')
        setDestinations(destinations.filter(d => d.id !== destinationId))
        toast({ title: "Success", description: "Destination deleted successfully" })
      } catch (err) {
        toast(
          { title: "Error", description: "Failed to delete destination", variant: "destructive" }
        )
      }
    }
  }

  const handleCreateTrip = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/trip/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTrip),
      })
      if (!response.ok) throw new Error('Failed to create trip')
      const createdTrip = await response.json()
      setTrip(createdTrip)
      toast({ title: "Success", description: "Trip created successfully" })
    } catch (err) {
      toast(
        { title: "Error", description: "Failed to create trip", variant: "destructive" }
      )
    }
  }

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
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>)
    );
  }

  if (!trip) {
    return (
      (<Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Trip</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="customerId">Customer ID</Label>
              <Input
                id="customerId"
                value={newTrip.customerId}
                onChange={(e) => setNewTrip({...newTrip, customerId: e.target.value})} />
            </div>
            <div>
              <Label htmlFor="salesStaffId">Sales Staff ID</Label>
              <Input
                id="salesStaffId"
                value={newTrip.salesStaffId}
                onChange={(e) => setNewTrip({...newTrip, salesStaffId: e.target.value})} />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={newTrip.status}
                onValueChange={(value) => setNewTrip({...newTrip, status: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {tripStatusOptions.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleCreateTrip}>Create Trip</Button>
          </div>
        </CardContent>
      </Card>)
    );
  }

  return (
    (<Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Trip Details - {trip.id}</span>
          <Button variant="destructive" onClick={handleDeleteTrip}>
            <Trash className="mr-2 h-4 w-4" /> Delete Trip
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customerId">Customer ID</Label>
              <Input id="customerId" value={trip.customerId} readOnly />
            </div>
            <div>
              <Label htmlFor="salesStaffId">Sales Staff ID</Label>
              <Input id="salesStaffId" value={trip.salesStaffId} readOnly />
            </div>
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={trip.status} onValueChange={handleStatusUpdate}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {tripStatusOptions.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Destinations</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {destinations.map(destination => (
                  <TableRow key={destination.id}>
                    <TableCell>{destination.name}</TableCell>
                    <TableCell>{destination.description}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteDestination(destination.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Dialog open={isAddingDestination} onOpenChange={setIsAddingDestination}>
              <DialogTrigger asChild>
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" /> Add Destination
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Destination</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newDestination.name}
                      onChange={(e) => setNewDestination({ ...newDestination, name: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={newDestination.description}
                      onChange={(e) => setNewDestination({ ...newDestination, description: e.target.value })} />
                  </div>
                </div>
                <Button onClick={handleAddDestination}>Add Destination</Button>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>)
  );
}