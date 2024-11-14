'use client'

import { useState, useEffect } from 'react'
 import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ReloadIcon, Cross2Icon, EyeOpenIcon } from "@radix-ui/react-icons"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import api from '@/config/api'
 
// This component manages CRUD operations for farms, including listing, creating, updating, and deleting farms,
// as well as managing associated varieties and farm images.

// Main component for farm management
export default function FarmCrud() {
  const [farms, setFarms] = useState([])
  const [varieties, setVarieties] = useState([])
  const [currentFarm, setCurrentFarm] = useState({
    id: '',
    name: '',
    address: '',
    phoneNumber: '',
    isDeleted: false,
    varieties: [],
    mediaUrl: ''
  })
  const [selectedVarietyId, setSelectedVarietyId] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [selectedFarm, setSelectedFarm] = useState(null)

  // State variables for managing farms, varieties, form data, and UI state

  useEffect(() => {
    fetchFarms()
    fetchVarieties()
  }, [])

  // Fetch all farms from the API
  const fetchFarms = async () => {
    setIsLoading(true)
    try {
      const response = await api.get('/api/farm/list')
      setFarms(response.data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch farms",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch all varieties from the API
  const fetchVarieties = async () => {
    try {
      const response = await api.get('/api/variety/list')
      setVarieties(response.data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch varieties",
        variant: "destructive",
      })
    }
  }

  // Handle changes in form input fields
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCurrentFarm(prev => ({ ...prev, [name]: value }))
  }

  // Add a selected variety to the current farm
  const handleAddVariety = () => {
    if (selectedVarietyId && !currentFarm.varieties.some(v => v.id === selectedVarietyId)) {
      const varietyToAdd = varieties.find(v => v.id === selectedVarietyId)
      setCurrentFarm(prev => ({
        ...prev,
        varieties: [...prev.varieties, varietyToAdd]
      }))
      setSelectedVarietyId('')
    }
  }

  // Remove a variety from the current farm
  const handleRemoveVariety = (varietyId) => {
    setCurrentFarm(prev => ({
      ...prev,
      varieties: prev.varieties.filter(v => v.id !== varietyId)
    }))
  }

  // Handle file input change for farm image
  const handleImageChange = (e) => {
    if (e.target.files) {
      setImageFile(e.target.files[0])
    }
  }

  // Upload the selected image for a farm
  const uploadImage = async (farmId) => {
    if (!imageFile) return

    const formData = new FormData()
    formData.append('file', imageFile)

    try {
      await api.post(`/media/farm/${farmId}/upload/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      toast({
        title: "Success",
        description: "Farm image uploaded successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload farm image",
        variant: "destructive",
      })
    }
  }

  // Handle form submission for creating or updating a farm
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const farmData = {
        ...currentFarm,
        varietyIds: currentFarm.varieties.map(v => v.id)
      }
      let response
      if (isEditing) {
        response = await api.put(`/api/farm/update/${currentFarm.id}`, farmData)
      } else {
        response = await api.post('/api/farm/create', farmData)
      }
      
      const savedFarm = response.data
      
      if (imageFile) {
        await uploadImage(savedFarm.id)
      }
      
      await fetchFarms()
      setCurrentFarm(
        { id: '', name: '', address: '', phoneNumber: '', isDeleted: false, varieties: [], mediaUrl: '' }
      )
      setSelectedVarietyId('')
      setIsEditing(false)
      setImageFile(null)
      toast({
        title: "Success",
        description: `Farm ${isEditing ? 'updated' : 'created'} successfully`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'create'} farm`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Set up the form for editing an existing farm
  const handleEdit = (farm) => {
    setCurrentFarm(farm)
    setIsEditing(true)
    setImageFile(null)
  }

  // Delete a farm
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this farm?')) return
    setIsLoading(true)
    try {
      await api.delete(`/api/farm/delete/${id}`)
      await fetchFarms()
      toast({
        title: "Success",
        description: "Farm deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete farm",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Set the selected farm for viewing details
  const handleViewDetails = (farm) => {
    setSelectedFarm(farm)
  }

  // Render the farm management interface
  return (
    <div className="container mx-auto p-4">
      {/* Form for adding or editing a farm */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Farm' : 'Add New Farm'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="name"
              value={currentFarm.name}
              onChange={handleInputChange}
              placeholder="Farm Name"
              required />
            <Input
              name="address"
              value={currentFarm.address}
              onChange={handleInputChange}
              placeholder="Address"
              required />
            <Input
              name="phoneNumber"
              value={currentFarm.phoneNumber}
              onChange={handleInputChange}
              placeholder="Phone Number"
              required />
            <div className="flex space-x-2">
              <Select value={selectedVarietyId} onValueChange={setSelectedVarietyId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Variety" />
                </SelectTrigger>
                <SelectContent>
                  {varieties.map((variety) => (
                    <SelectItem key={variety.id} value={variety.id}>{variety.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="button" onClick={handleAddVariety} disabled={!selectedVarietyId}>
                Add Variety
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {currentFarm.varieties.map((variety) => (
                <Badge key={variety.id} variant="secondary" className="flex items-center gap-1">
                  {variety.name}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0"
                    onClick={() => handleRemoveVariety(variety.id)}>
                    <Cross2Icon className="h-3 w-3" />
                    <span className="sr-only">Remove {variety.name}</span>
                  </Button>
                </Badge>
              ))}
            </div>
            <Input type="file" onChange={handleImageChange} accept="image/*" />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditing ? 'Update Farm' : 'Create Farm'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      {/* Table displaying the list of farms */}
      <Card>
        <CardHeader>
          <CardTitle>Farm List</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <ReloadIcon className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Varieties</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {farms.map((farm) => (
                  <TableRow key={farm.id}>
                    <TableCell>{farm.name}</TableCell>
                    <TableCell>{farm.address}</TableCell>
                    <TableCell>{farm.phoneNumber}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {farm.varieties.map((variety) => (
                          <Badge key={variety.id} variant="secondary">
                            {variety.name}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="mr-2" onClick={() => handleViewDetails(farm)}>
                            <EyeOpenIcon className="mr-2 h-4 w-4" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>{selectedFarm?.name}</DialogTitle>
                            <DialogDescription>Farm Details</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            {selectedFarm?.mediaUrl && (
                              <div className="flex justify-center">
                                <img
                                  src={selectedFarm.mediaUrl}
                                  alt={`${selectedFarm.name} farm`}
                                  className="w-full max-w-[300px] h-auto object-cover rounded-md"
                                />
                              </div>
                            )}
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-bold">Address:</span>
                              <span className="col-span-3">{selectedFarm?.address}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-bold">Phone:</span>
                              <span className="col-span-3">{selectedFarm?.phoneNumber}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <span className="font-bold">Varieties:</span>
                              <div className="col-span-3 flex flex-wrap gap-1">
                                {selectedFarm?.varieties.map((variety) => (
                                  <Badge key={variety.id} variant="secondary">
                                    {variety.name}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" className="mr-2" onClick={() => handleEdit(farm)}>
                        Edit
                      </Button>
                      <Button variant="destructive" onClick={() => handleDelete(farm.id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}