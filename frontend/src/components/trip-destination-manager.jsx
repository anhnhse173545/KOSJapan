'use client';
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { format } from 'date-fns'
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

export function TripDestinationManagerComponent() {
  const { tripId } = useParams()
  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDestination, setSelectedDestination] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    fetchDestinations()
  }, [tripId])

  const fetchDestinations = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/trip-destination/${tripId}/list`)
      if (!response.ok) throw new Error('Failed to fetch destinations')
      const data = await response.json()
      setDestinations(data)
    } catch (error) {
      console.error('Error fetching destinations:', error)
      toast({
        title: "Error",
        description: "Failed to fetch destinations. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const destination = Object.fromEntries(formData.entries())

    try {
      const url = selectedDestination
        ? `http://localhost:8080/api/trip-destination/${selectedDestination.id}/update`
        : `http://localhost:8080/api/trip-destination/${tripId}/create`
      const method = selectedDestination ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(destination),
      })

      if (!response.ok) throw new Error('Failed to save destination')

      toast({
        title: "Success",
        description: `Destination ${selectedDestination ? 'updated' : 'created'} successfully.`,
      })

      setIsDialogOpen(false)
      fetchDestinations()
    } catch (error) {
      console.error('Error saving destination:', error)
      toast({
        title: "Error",
        description: "Failed to save destination. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    if (!selectedDestination) return

    try {
      const response = await fetch(
        `http://localhost:8080/api/trip-destination/${selectedDestination.id}/delete`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) throw new Error('Failed to delete destination')

      toast({
        title: "Success",
        description: "Destination deleted successfully.",
      })

      setIsDeleteDialogOpen(false)
      fetchDestinations()
    } catch (error) {
      console.error('Error deleting destination:', error)
      toast({
        title: "Error",
        description: "Failed to delete destination. Please try again.",
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

  return (
    (<div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Trip Destinations</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedDestination(null)}>
              <Plus className="mr-2 h-4 w-4" /> Add Destination
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedDestination ? 'Edit' : 'Add'} Destination</DialogTitle>
              <DialogDescription>
                {selectedDestination ? 'Edit the details of the destination.' : 'Add a new destination to the trip.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={selectedDestination?.name}
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
                    defaultValue={selectedDestination?.description}
                    className="col-span-3"
                    required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="startDate" className="text-right">
                    Start Date
                  </Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    defaultValue={selectedDestination?.startDate.split('T')[0]}
                    className="col-span-3"
                    required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="endDate" className="text-right">
                    End Date
                  </Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    defaultValue={selectedDestination?.endDate.split('T')[0]}
                    className="col-span-3"
                    required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">{selectedDestination ? 'Update' : 'Add'} Destination</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {destinations.map((destination) => (
            <TableRow key={destination.id}>
              <TableCell>{destination.name}</TableCell>
              <TableCell>{destination.description}</TableCell>
              <TableCell>{format(new Date(destination.startDate), 'PP')}</TableCell>
              <TableCell>{format(new Date(destination.endDate), 'PP')}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setSelectedDestination(destination)
                      setIsDialogOpen(true)
                    }}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setSelectedDestination(destination)
                      setIsDeleteDialogOpen(true)
                    }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Destination</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this destination? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>)
  );
}