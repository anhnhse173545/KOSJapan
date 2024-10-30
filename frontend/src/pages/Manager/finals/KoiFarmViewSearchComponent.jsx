'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, Phone, MapPin } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

const api = axios.create({
  baseURL: 'http://localhost:8080/api/farm'
})

export function KoiFarmViewSearchComponent() {
  const [farms, setFarms] = useState([])
  const [filteredFarms, setFilteredFarms] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [selectedVarieties, setSelectedVarieties] = useState([])
  const [allVarieties, setAllVarieties] = useState([])

  useEffect(() => {
    fetchFarms()
  }, [])

  const fetchFarms = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await api.get('/list')
      setFarms(response.data)
      setFilteredFarms(response.data)
      const varieties = [...new Set(response.data.flatMap(farm => farm.varieties.map(v => v.name)))]
      setAllVarieties(varieties)
    } catch (err) {
      setError('An error occurred while loading the farm list.')
      console.error('Error fetching farms:', err)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    try {
      let result = [...farms];
  
      // Apply search filter
      if (searchTerm) {
        result = result.filter((farm) =>
          (farm.name && farm.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (farm.description && farm.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (farm.address && farm.address.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
  
      // Apply variety filter
      if (selectedVarieties.length > 0) {
        result = result.filter((farm) =>
          farm.varieties.some((variety) => selectedVarieties.includes(variety.name))
        );
      }
  
      // Apply sorting
      result.sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1;
        if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  
      setFilteredFarms(result);
    } catch (err) {
      setError("An error occurred while filtering the farms.");
      console.error("Error in applyFilters:", err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault()
    applyFilters()
  }

  const resetFilters = () => {
    setSearchTerm('')
    setSortBy('name')
    setSortOrder('asc')
    setSelectedVarieties([])
    setFilteredFarms(farms)
  }

  useEffect(() => {
    applyFilters()
  }, [searchTerm, sortBy, sortOrder, selectedVarieties])

  return (
    <div className="container mx-auto p-4 flex flex-col md:flex-row gap-6">
      {/* Left sidebar for filters */}
      <div className="w-full md:w-1/4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  type="search"
                  placeholder="Search farms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="space-y-2">
  <Label htmlFor="sort" className="text-black !important">Sort by</Label>
  <Select value={sortBy} onValueChange={setSortBy}>
    <SelectTrigger id="sort" className="text-black !important">
      <SelectValue placeholder="Sort by" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="name" className="text-black !important">Name</SelectItem>
      <SelectItem value="address" className="text-black !important">Address</SelectItem>
    </SelectContent>
  </Select>
</div>

<div className="space-y-2">
  <Label htmlFor="order" className="text-black !important">Sort order</Label>
  <Select value={sortOrder} onValueChange={setSortOrder}>
    <SelectTrigger id="order" className="text-black !important">
      <SelectValue placeholder="Sort order" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="asc" className="text-black !important">Ascending</SelectItem>
      <SelectItem value="desc" className="text-black !important">Descending</SelectItem>
    </SelectContent>
  </Select>
</div>
              <div className="space-y-2">
                <Label>Koi Varieties</Label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {allVarieties.map((variety) => (
                    <div key={variety} className="flex items-center">
                      <Checkbox
                        id={variety}
                        checked={selectedVarieties.includes(variety)}
                        onCheckedChange={(checked) => {
                          setSelectedVarieties(
                            checked
                              ? [...selectedVarieties, variety]
                              : selectedVarieties.filter((v) => v !== variety)
                          )
                        }}
                      />
                      <label htmlFor={variety} className="ml-2 text-sm font-medium leading-none">
                        {variety}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <Button type="submit" className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
              <Button type="button" variant="outline" onClick={resetFilters} className="w-full">
                Reset Filters
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Main content area */}
      <div className="w-full md:w-3/4 space-y-6">
        <h1 className="text-3xl font-bold">Koi Farms</h1>
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : filteredFarms.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredFarms.map((farm) => (
              <Card key={farm.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-lg">{farm.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground mb-2">{farm.description}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p>{farm.address}</p>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p>{farm.phoneNumber}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-semibold mb-2">Koi Varieties:</p>
                    <div className="flex flex-wrap gap-2">
                      {farm.varieties.slice(0, 3).map((variety) => (
                        <Badge key={variety.id} variant="secondary">
                          {variety.name}
                        </Badge>
                      ))}
                      {farm.varieties.length > 3 && (
                        <Badge variant="outline">+{farm.varieties.length - 3} more</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-muted-foreground">No farms found.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
