'use client';;
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { Calendar, DollarSign, MapPin } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

export default function ViewTripPlanComponent() {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/trips/${tripId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch trip data')
        }
        const data = await response.json()
        setTrip(data)
      } catch (err) {
        setError('Error fetching trip data. Please try again later.')
        console.error('Error fetching trip data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTripData()
  }, [tripId])

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
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
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of destinations for this trip.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trip.destinations.map((destination) => (
                <TableRow key={destination.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4" />
                      {destination.name}
                    </div>
                  </TableCell>
                  <TableCell>{destination.description}</TableCell>
                  <TableCell>{format(new Date(destination.startDate), 'PP')}</TableCell>
                  <TableCell>{format(new Date(destination.endDate), 'PP')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button onClick={() => navigate(-1)} variant="outline">Back to Bookings</Button>
      </div>
    </div>)
  );
}