'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Trash2 } from "lucide-react"

export default function TripApiTesterComponent() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [newTripData, setNewTripData] = useState({
    startDate: '',
    endDate: '',
    departureAirport: '',
    price: '',
    status: 'Pending',
  })

  const apiUrl = 'http://localhost:8081/api/trip'

  const fetchTrips = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${apiUrl}/list`)
      if (!response.ok) {
        throw new Error('Failed to fetch trips')
      }
      const data = await response.json()
      setTrips(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTrip = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${apiUrl}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTripData),
      })
      if (!response.ok) {
        throw new Error('Failed to create trip')
      }
      await fetchTrips()
      setNewTripData({
        startDate: '',
        endDate: '',
        departureAirport: '',
        price: '',
        status: 'Pending',
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTrip = async (id) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${apiUrl}/delete/${id}`, {
        method: 'PUT',
      })
      if (!response.ok) {
        throw new Error('Failed to delete trip')
      }
      await fetchTrips()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    (<div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Trip API Tester</h1>
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="list">List Trips</TabsTrigger>
          <TabsTrigger value="create">Create Trip</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>List All Trips</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={fetchTrips} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Fetch Trips'}
              </Button>
              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {trips.length > 0 && (
                <div className="mt-4 space-y-4">
                  {trips.map((trip) => (
                    <Card key={trip.id}>
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p><strong>ID:</strong> {trip.id}</p>
                            <p><strong>Start Date:</strong> {new Date(trip.startDate).toLocaleString()}</p>
                            <p><strong>End Date:</strong> {new Date(trip.endDate).toLocaleString()}</p>
                            <p><strong>Departure Airport:</strong> {trip.departureAirport}</p>
                            <p><strong>Price:</strong> ${trip.price}</p>
                            <p><strong>Status:</strong> {trip.status}</p>
                            <p><strong>Destinations:</strong> {trip.tripDestinations.length}</p>
                          </div>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDeleteTrip(trip.id)}
                            disabled={loading}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create New Trip</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTrip} className="space-y-4">
                <Input
                  type="datetime-local"
                  placeholder="Start Date"
                  value={newTripData.startDate}
                  onChange={(e) => setNewTripData({ ...newTripData, startDate: e.target.value })}
                  required />
                <Input
                  type="datetime-local"
                  placeholder="End Date"
                  value={newTripData.endDate}
                  onChange={(e) => setNewTripData({ ...newTripData, endDate: e.target.value })}
                  required />
                <Input
                  placeholder="Departure Airport"
                  value={newTripData.departureAirport}
                  onChange={(e) => setNewTripData({ ...newTripData, departureAirport: e.target.value })}
                  required />
                <Input
                  type="number"
                  placeholder="Price"
                  value={newTripData.price}
                  onChange={(e) => setNewTripData({ ...newTripData, price: e.target.value })}
                  required />
                <div className="text-sm text-gray-500">Status: Pending (default)</div>
                <Button type="submit" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create Trip'}
                </Button>
              </form>
              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>)
  );
}