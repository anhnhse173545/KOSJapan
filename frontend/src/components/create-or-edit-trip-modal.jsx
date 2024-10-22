'use client'

import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, Loader2 } from "lucide-react"

const API_BASE_URL = 'http://localhost:8080/api'

export function CreateOrEditTripModal({ isOpen, onClose, booking, onTripCreated }) {
  const [step, setStep] = useState('trip')
  const [tripDetails, setTripDetails] = useState({
    startDate: '',
    endDate: '',
    departureAirport: '',
    price: '',
    description: ''
  })
  const [destinations, setDestinations] = useState([])
  const [newDestination, setNewDestination] = useState({
    farmId: '',
    visitDate: '',
    description: ''
  })
  const [farms, setFarms] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isOpen && booking) {
      fetchFarms()
      if (booking.trip) {
        setTripDetails({
          startDate: booking.trip.startDate ? booking.trip.startDate.split('T')[0] : '',
          endDate: booking.trip.endDate ? booking.trip.endDate.split('T')[0] : '',
          departureAirport: booking.trip.departureAirport || '',
          price: booking.trip.price || '',
          description: booking.trip.description || ''
        })
        fetchTripDestinations(booking.trip.id)
      } else {
        setTripDetails({
          startDate: '',
          endDate: '',
          departureAirport: '',
          price: '',
          description: ''
        })
        setDestinations([])
      }
    }
  }, [isOpen, booking])

  const fetchFarms = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/farm/list`)
      if (!response.ok) throw new Error('Failed to fetch farms')
      const data = await response.json()
      setFarms(data)
    } catch (error) {
      console.error('Error fetching farms:', error)
      setError('Failed to fetch farms')
    }
  }

  const fetchTripDestinations = async (tripId) => {
    if (!tripId) return
    try {
      const response = await fetch(`${API_BASE_URL}/trip-destination/${tripId}/list`)
      if (!response.ok) throw new Error('Failed to fetch trip destinations')
      const data = await response.json()
      setDestinations(data)
    } catch (error) {
      console.error('Error fetching trip destinations:', error)
      setError('Failed to fetch trip destinations')
    }
  }

  const handleCreateOrUpdateTrip = async (e) => {
    e.preventDefault()
    if (!booking) return
    setLoading(true)
    setError(null)
    try {
      const url = booking.trip
        ? `${API_BASE_URL}/trip/update/${booking.trip.id}`
        : `${API_BASE_URL}/booking/${booking.id}/create-trip`
      const method = booking.trip ? 'PUT' : 'POST'
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tripDetails)
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create/update trip')
      }
      const data = await response.json()
      onTripCreated(data)
      setStep('destinations')
    } catch (error) {
      console.error('Error creating/updating trip:', error)
      setError(error.message || 'Failed to create/update trip')
    } finally {
      setLoading(false)
    }
  }

  const handleAddDestination = async (e) => {
    e.preventDefault()
    if (!booking || !booking.trip) return
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/trip-destination/${booking.trip.id}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDestination)
      })
      if (!response.ok) throw new Error('Failed to add destination')
      const data = await response.json()
      setDestinations([...destinations, data])
      setNewDestination({ farmId: '', visitDate: '', description: '' })
    } catch (error) {
      console.error('Error adding destination:', error)
      setError('Failed to add destination')
    } finally {
      setLoading(false)
    }
  }

  if (!booking) return null

  return (
    (<Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{booking.trip ? 'Edit Trip' : 'Create Trip'}</DialogTitle>
          <DialogDescription>
            {step === 'trip' ? 'Enter trip details' : 'Manage trip destinations'}
          </DialogDescription>
        </DialogHeader>
        <Tabs value={step} onValueChange={setStep}>
          <TabsList>
            <TabsTrigger value="trip">Trip Details</TabsTrigger>
            <TabsTrigger value="destinations" disabled={!booking.trip}>Destinations</TabsTrigger>
          </TabsList>
          <TabsContent value="trip">
            <form onSubmit={handleCreateOrUpdateTrip}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={tripDetails.startDate}
                      onChange={(e) => setTripDetails({ ...tripDetails, startDate: e.target.value })}
                      required />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={tripDetails.endDate}
                      onChange={(e) => setTripDetails({ ...tripDetails, endDate: e.target.value })}
                      required />
                  </div>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="departureAirport">Departure Airport</Label>
                  <Input
                    id="departureAirport"
                    value={tripDetails.departureAirport}
                    onChange={(e) => setTripDetails({ ...tripDetails, departureAirport: e.target.value })}
                    required />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    value={tripDetails.price}
                    onChange={(e) => setTripDetails({ ...tripDetails, price: e.target.value })}
                    required />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={tripDetails.description}
                    onChange={(e) => setTripDetails({ ...tripDetails, description: e.target.value })}
                    required />
                </div>
              </div>
              {error && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {booking.trip ? 'Update Trip' : 'Create Trip'}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="destinations">
            <div className="space-y-4">
              <div className="border rounded-md p-4">
                <h4 className="font-semibold mb-2">Add New Destination</h4>
                <form onSubmit={handleAddDestination} className="space-y-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="farmId">Farm</Label>
                    <Select
                      value={newDestination.farmId}
                      onValueChange={(value) => setNewDestination({ ...newDestination, farmId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a farm" />
                      </SelectTrigger>
                      <SelectContent>
                        {farms.map((farm) => (
                          <SelectItem key={farm.id} value={farm.id}>{farm.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="visitDate">Visit Date</Label>
                    <Input
                      id="visitDate"
                      type="date"
                      value={newDestination.visitDate}
                      onChange={(e) => setNewDestination({ ...newDestination, visitDate: e.target.value })}
                      required />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="destinationDescription">Description</Label>
                    <Textarea
                      id="destinationDescription"
                      value={newDestination.description}
                      onChange={(e) => setNewDestination({ ...newDestination, description: e.target.value })}
                      required />
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Add Destination
                  </Button>
                </form>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Existing Destinations</h4>
                {destinations.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Farm</TableHead>
                        <TableHead>Visit Date</TableHead>
                        <TableHead>Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {destinations.map((destination) => (
                        <TableRow key={destination.id}>
                          <TableCell>{destination.farm.name}</TableCell>
                          <TableCell>{new Date(destination.visitDate).toLocaleDateString()}</TableCell>
                          <TableCell>{destination.description}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p>No destinations added yet.</p>
                )}
              </div>
            </div>
            {error && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>)
  );
}