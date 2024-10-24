import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const API_BASE_URL = 'http://localhost:8080';

export default function FarmCrud() {
  const [farms, setFarms] = useState([])
  const [varieties, setVarieties] = useState([])
  const [currentFarm, setCurrentFarm] = useState({
    id: '',
    name: '',
    address: '',
    phoneNumber: '',
    isDeleted: false,
    varieties: []
  })
  const [selectedVarietyId, setSelectedVarietyId] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    fetchFarms()
    fetchVarieties()
  }, [])

  const fetchFarms = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/farm/list`)
      if (!response.ok) throw new Error('Failed to fetch farms')
      const data = await response.json()
      setFarms(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch farms",
        variant: "destructive",
      })
    }
  }

  const fetchVarieties = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/variety/list`)
      if (!response.ok) throw new Error('Failed to fetch varieties')
      const data = await response.json()
      setVarieties(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch varieties",
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCurrentFarm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = isEditing ? `${API_BASE_URL}/api/farm/update/${currentFarm.id}` : `${API_BASE_URL}/api/farm/create`
      const method = isEditing ? 'PUT' : 'POST'
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentFarm)
      })
      if (!response.ok) throw new Error('Failed to save farm')
      
      if (selectedVarietyId) {
        await handleAddVariety(isEditing ? currentFarm.id : response.json().id)
      }
      
      await fetchFarms()
      setCurrentFarm(
        { id: '', name: '', address: '', phoneNumber: '', isDeleted: false, varieties: [] }
      )
      setSelectedVarietyId('')
      setIsEditing(false)
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
    }
  }

  const handleEdit = (farm) => {
    setCurrentFarm(farm)
    setIsEditing(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this farm?')) return
    try {
      const response = await fetch(`${API_BASE_URL}/api/farm/delete/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete farm')
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
    }
  }

  const handleAddVariety = async (farmId) => {
    if (!farmId || !selectedVarietyId) return
    try {
      const response = await fetch(`${API_BASE_URL}/api/farm/${farmId}/add-variety/${selectedVarietyId}`, {
        method: 'POST',
      })
      if (!response.ok) throw new Error('Failed to add variety to farm')
      toast({
        title: "Success",
        description: "Variety added to farm successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add variety to farm",
        variant: "destructive",
      })
    }
  }

  return (
    (<div className="container mx-auto p-4">
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
            <Select value={selectedVarietyId} onValueChange={setSelectedVarietyId}>
              <SelectTrigger>
                <SelectValue placeholder="Select Variety" />
              </SelectTrigger>
              <SelectContent>
                {varieties.map((variety) => (
                  <SelectItem key={variety.id} value={variety.id}>{variety.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit">{isEditing ? 'Update' : 'Create'} Farm</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Farm List</CardTitle>
        </CardHeader>
        <CardContent>
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
                  <TableCell>{farm.varieties.map(v => v.name).join(', ')}</TableCell>
                  <TableCell>
                    <Button variant="outline" className="mr-2" onClick={() => handleEdit(farm)}>Edit</Button>
                    <Button variant="destructive" onClick={() => handleDelete(farm.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>)
  );
}