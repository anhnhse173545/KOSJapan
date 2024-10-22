'use client';
import React, { useState, useEffect } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useParams, useNavigate } from 'react-router-dom'
import * as z from "zod"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

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

export function CreateTripForm({
  onTripCreated,
  bookingId
}) {
  const bookingIdd = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [bookingDetails, setBookingDetails] = useState(null)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bookingId: bookingId,
      startDate: new Date(),
      endDate: new Date(),
      departureAirport: "",
      price: 0,
      description: "",
    },
  })

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/booking/get/${bookingIdd}`)
        if (!response.ok) {
          throw new Error('Failed to fetch booking details')
        }
        const data = await response.json()
        setBookingDetails(data)
      } catch (error) {
        console.error('Error fetching booking details:', error)
        toast({
          title: "Error",
          description: "Failed to fetch booking details",
          variant: "destructive",
        })
      }
    }

    fetchBookingDetails()
  }, [bookingId])

  async function onSubmit(values) {
    setIsLoading(true)
    try {
      const response = await fetch(`http://localhost:8080/api/booking/${bookingIdd}/create-trip`, {
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
    (<div className="container mx-auto px-4 py-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create Trip for Booking {bookingId}</CardTitle>
        </CardHeader>
        <CardContent>
          {bookingDetails && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Booking Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Customer Name:</p>
                  <p>{bookingDetails.customer.name}</p>
                </div>
                <div>
                  <p className="font-medium">Customer Email:</p>
                  <p>{bookingDetails.customer.email}</p>
                </div>
                <div>
                  <p className="font-medium">Booking Description:</p>
                  <p>{bookingDetails.description}</p>
                </div>
                <div>
                  <p className="font-medium">Booking Status:</p>
                  <p>{bookingDetails.status}</p>
                </div>
                <div>
                  <p className="font-medium">Created At:</p>
                  <p>{new Date(bookingDetails.createAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
          <Separator className="my-8" />
          <Form {...form}>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                              className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}>
                              {field.value ? (
                                format(field.value, "PPP")
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
                              className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}>
                              {field.value ? (
                                format(field.value, "PPP")
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
              </div>
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
                        onChange={(e) => field.onChange(parseFloat(e.target.value))} />
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
                      <Textarea placeholder="Enter trip description" {...field} className="min-h-[100px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Trip"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>)
  );
}