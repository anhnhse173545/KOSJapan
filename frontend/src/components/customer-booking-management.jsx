'use client';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

// ... (rest of the imports and constants remain the same)

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

  // ... (rest of the CreateTripForm component remains the same)
}

export function CustomerBookingManagement() {
  // ... (state and useEffect hooks remain the same)

  const handleTripCreated = (createdTrip) => {
    const updatedBookings = bookings.map(b => 
      b.id === createdTrip.bookingId ? { ...b, trip: createdTrip } : b)
    setBookings(updatedBookings)
    setFilteredBookings(updatedBookings)
    
    // Add a pop-up notification when a trip is created successfully
    toast({
      title: "Trip Created",
      description: `Trip for booking ${createdTrip.bookingId} has been created successfully.`,
      duration: 5000, // Display for 5 seconds
    })
  }

  // ... (rest of the component remains the same)

  return (
    (<div className="space-y-6">
      {/* ... (existing JSX remains the same) */}
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
      {/* ... (rest of the JSX remains the same) */}
    </div>)
  );
}