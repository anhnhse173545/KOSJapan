'use client'

import { useState, useEffect } from 'react'
 import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { ReloadIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons"
import api from '@/config/api'

export default function VarietyCrud() {
  const [varieties, setVarieties] = useState([])
  const [currentVariety, setCurrentVariety] = useState({
    id: '',
    name: '',
    description: '',
    deleted: false
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchVarieties()
  }, [])

  const fetchVarieties = async () => {
    setIsLoading(true)
    try {
      const response = await api.get('/api/variety/list')
      setVarieties(response.data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch varieties",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCurrentVariety(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (isEditing) {
        await api.put(`/api/variety/update/${currentVariety.id}`, currentVariety)
      } else {
        await api.post('/api/variety/create', currentVariety)
      }
      await fetchVarieties()
      setCurrentVariety({ id: '', name: '', description: '', deleted: false })
      setIsEditing(false)
      toast({
        title: "Success",
        description: `Variety ${isEditing ? 'updated' : 'created'} successfully`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'create'} variety`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (variety) => {
    setCurrentVariety(variety)
    setIsEditing(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this variety?')) return
    setIsLoading(true)
    try {
      await api.delete(`/api/variety/delete/${id}`)
      await fetchVarieties()
      toast({
        title: "Success",
        description: "Variety deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete variety",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center">Variety Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Variety' : 'Add New Variety'}</CardTitle>
          <CardDescription>
            {isEditing ? 'Update the details of an existing variety' : 'Create a new variety for your farms'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="text-sm font-medium">Variety Name</label>
              <Input
                id="name"
                name="name"
                value={currentVariety.name}
                onChange={handleInputChange}
                placeholder="Enter variety name"
                required 
              />
            </div>
            <div>
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Textarea
                id="description"
                name="description"
                value={currentVariety.description}
                onChange={handleInputChange}
                placeholder="Enter variety description"
                required 
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditing ? 'Update Variety' : 'Create Variety'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Variety List</CardTitle>
          <CardDescription>Manage your variety catalog</CardDescription>
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
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {varieties.map((variety) => (
                  <TableRow key={variety.id}>
                    <TableCell className="font-medium">{variety.name}</TableCell>
                    <TableCell>{variety.description}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(variety)}>
                          <Pencil1Icon className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(variety.id)}>
                          <TrashIcon className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
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