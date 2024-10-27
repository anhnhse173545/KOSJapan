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

  const applyFilters = () => {
    let result = [...farms]

    // Apply search filter
    if (searchTerm) {
      result = result.filter((farm) =>
        farm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        farm.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        farm.address.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    // Apply variety filter
    if (selectedVarieties.length > 0) {
      result = result.filter((farm) =>
        farm.varieties.some((variety) => selectedVarieties.includes(variety.name)))
    }

    // Apply sorting
    result.sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1
      if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    setFilteredFarms(result)
  }

  useEffect(() => {
    applyFilters()
  }, [searchTerm, sortBy, sortOrder, selectedVarieties])

  return (
    (<div className="container mx-auto p-4 flex">
      {/* Left sidebar for filters */}
      <div className="w-1/4 pr-4">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              type="search"
              placeholder="Search farms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="sort">Sort by</Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger id="sort">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="address">Address</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="order">Sort order</Label>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger id="order">
                <SelectValue placeholder="Sort order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Koi Varieties</Label>
            <div className="space-y-2">
              {allVarieties.map((variety) => (
                <div key={variety} className="flex items-center">
                  <Checkbox
                    id={variety}
                    checked={selectedVarieties.includes(variety)}
                    onCheckedChange={(checked) => {
                      setSelectedVarieties(checked
                        ? [...selectedVarieties, variety]
                        : selectedVarieties.filter((v) => v !== variety))
                    }} />
                  <label
                    htmlFor={variety}
                    className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
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
      </div>
      {/* Main content area */}
      <div className="w-3/4">
        <h1 className="text-2xl font-bold mb-4">Koi Farms</h1>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : filteredFarms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFarms.map((farm) => (
              <Card key={farm.id}>
                <CardHeader>
                  <CardTitle>{farm.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-2">{farm.description}</p>
                  <div className="flex items-center mb-2">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    <p className="text-sm">{farm.address}</p>
                  </div>
                  <div className="flex items-center mb-4">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    <p className="text-sm">{farm.phoneNumber}</p>
                  </div>
                  <div>
                    <strong className="text-sm">Koi Varieties:</strong>
                    <div className="flex flex-wrap gap-2 mt-2">
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
          <p>No farms found.</p>
        )}
      </div>
    </div>)
  );
}