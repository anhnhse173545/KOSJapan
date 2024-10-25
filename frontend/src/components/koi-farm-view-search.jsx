import { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, Phone, MapPin } from "lucide-react"

const api = axios.create({
  baseURL: 'http://localhost:8080/api/farm'
})

export function KoiFarmViewSearchComponent() {
  const [farms, setFarms] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchFarms()
  }, [])

  const fetchFarms = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await api.get('/list')
      setFarms(response.data)
    } catch (err) {
      setError('An error occurred while loading the farm list.')
      console.error('Error fetching farms:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const filteredFarms = farms.filter((farm) =>
      farm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farm.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farm.address.toLowerCase().includes(searchTerm.toLowerCase()))
    setFarms(filteredFarms)
  }

  const resetSearch = () => {
    setSearchTerm('')
    fetchFarms()
  }

  return (
    (<div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Koi Farms</h1>
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <div className="flex-grow">
            <Label htmlFor="search" className="sr-only">Search</Label>
            <Input
              id="search"
              type="search"
              placeholder="Search by name, description, or address"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <Button type="submit">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button type="button" variant="outline" onClick={resetSearch}>
            Reset
          </Button>
        </div>
      </form>
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
      ) : farms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {farms.map((farm) => (
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
    </div>)
  );
}