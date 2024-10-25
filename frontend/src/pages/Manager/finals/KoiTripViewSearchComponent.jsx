import { useState, useEffect } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Loader2, Search, Calendar, Plane, DollarSign, X } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const api = axios.create({
  baseURL: 'http://localhost:8080/api/trip'
})

export function KoiTripViewSearchComponent() {
  const [trips, setTrips] = useState([])
  const [filteredTrips, setFilteredTrips] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('startDate')
  const [sortOrder, setSortOrder] = useState('asc')
  const [farmFilters, setFarmFilters] = useState([])
  const [varietyFilters, setVarietyFilters] = useState([])
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [availableFarms, setAvailableFarms] = useState([])
  const [availableVarieties, setAvailableVarieties] = useState([])
  const [openFarmSelect, setOpenFarmSelect] = useState(false)
  const [openVarietySelect, setOpenVarietySelect] = useState(false)

  useEffect(() => {
    fetchTrips()
  }, [])

  useEffect(() => {
    filterAndSortTrips()
  }, [trips, searchTerm, sortBy, sortOrder, farmFilters, varietyFilters, priceRange, dateRange])

  const fetchTrips = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await api.get('/list')
      setTrips(response.data)
      updateAvailableFilters(response.data)
    } catch (err) {
      setError('An error occurred while loading the trip list.')
      console.error('Error fetching trips:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateAvailableFilters = (trips) => {
    const farms = new Set()
    const varieties = new Set()
    trips.forEach(trip => {
      trip.tripDestinations.forEach(dest => {
        farms.add(dest.farm.name)
        dest.farm.varieties.forEach(variety => varieties.add(variety.name))
      })
    })
    setAvailableFarms(Array.from(farms))
    setAvailableVarieties(Array.from(varieties))
  }

  const filterAndSortTrips = () => {
    let filtered = [...trips]

    if (searchTerm) {
      filtered = filtered.filter((trip) =>
        trip.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.departureAirport.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.tripDestinations.some(dest => 
          dest.farm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dest.farm.address.toLowerCase().includes(searchTerm.toLowerCase())))
    }

    if (farmFilters.length > 0) {
      filtered = filtered.filter(trip =>
        trip.tripDestinations.some(dest => farmFilters.includes(dest.farm.name)))
    }

    if (varietyFilters.length > 0) {
      filtered = filtered.filter(trip =>
        trip.tripDestinations.some(dest => 
          dest.farm.varieties.some(variety => varietyFilters.includes(variety.name))))
    }

    filtered = filtered.filter(trip => trip.price >= priceRange[0] && trip.price <= priceRange[1])

    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(trip => 
        new Date(trip.startDate) >= new Date(dateRange.start) && 
        new Date(trip.endDate) <= new Date(dateRange.end))
    }

    filtered.sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1
      if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    setFilteredTrips(filtered)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    filterAndSortTrips()
  }

  const resetFilters = () => {
    setSearchTerm('')
    setSortBy('startDate')
    setSortOrder('asc')
    setFarmFilters([])
    setVarietyFilters([])
    setPriceRange([0, 10000])
    setDateRange({ start: '', end: '' })
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  return (
    (<div className="container mx-auto p-2 sm:p-4">
      <h1 className="text-2xl font-bold mb-4">Koi Buying Trips</h1>
      <form onSubmit={handleSearch} className="mb-6 space-y-4">
        <div className="flex gap-2">
          <div className="flex-grow">
            <Label htmlFor="search" className="sr-only">Search</Label>
            <Input
              id="search"
              type="search"
              placeholder="Search by description, airport, or farm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <Button type="submit">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="sortBy">Sort By</Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger id="sortBy">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="startDate">Start Date</SelectItem>
                <SelectItem value="price">Price</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="sortOrder">Sort Order</Label>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger id="sortOrder">
                <SelectValue placeholder="Sort order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Farm Filters</Label>
            <Popover open={openFarmSelect} onOpenChange={setOpenFarmSelect}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openFarmSelect}
                  className="w-full justify-between">
                  {farmFilters.length > 0
                    ? `${farmFilters.length} selected`
                    : "Select farms..."}
                  <X
                    className="ml-2 h-4 w-4 shrink-0 opacity-50"
                    onClick={(e) => {
                      e.stopPropagation()
                      setFarmFilters([])
                    }} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search farms..." />
                  <CommandEmpty>No farm found.</CommandEmpty>
                  <CommandGroup>
                    {availableFarms.map((farm) => (
                      <CommandItem
                        key={farm}
                        onSelect={() => {
                          setFarmFilters((prev) =>
                            prev.includes(farm)
                              ? prev.filter((f) => f !== farm)
                              : [...prev, farm])
                        }}>
                        <div
                          className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary ${
                            farmFilters.includes(farm)
                              ? "bg-primary text-primary-foreground"
                              : "opacity-50 [&_svg]:invisible"
                          }`}>
                          <X className="h-4 w-4" />
                        </div>
                        {farm}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label>Variety Filters</Label>
            <Popover open={openVarietySelect} onOpenChange={setOpenVarietySelect}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openVarietySelect}
                  className="w-full justify-between">
                  {varietyFilters.length > 0
                    ? `${varietyFilters.length} selected`
                    : "Select varieties..."}
                  <X
                    className="ml-2 h-4 w-4 shrink-0 opacity-50"
                    onClick={(e) => {
                      e.stopPropagation()
                      setVarietyFilters([])
                    }} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search varieties..." />
                  <CommandEmpty>No variety found.</CommandEmpty>
                  <CommandGroup>
                    {availableVarieties.map((variety) => (
                      <CommandItem
                        key={variety}
                        onSelect={() => {
                          setVarietyFilters((prev) =>
                            prev.includes(variety)
                              ? prev.filter((v) => v !== variety)
                              : [...prev, variety])
                        }}>
                        <div
                          className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary ${
                            varietyFilters.includes(variety)
                              ? "bg-primary text-primary-foreground"
                              : "opacity-50 [&_svg]:invisible"
                          }`}>
                          <X className="h-4 w-4" />
                        </div>
                        {variety}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div>
          <Label>Price Range</Label>
          <Slider
            min={0}
            max={10000}
            step={100}
            value={priceRange}
            onValueChange={setPriceRange} />
          <div className="flex justify-between text-sm text-gray-500">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} />
          </div>
        </div>
        <Button type="button" variant="outline" onClick={resetFilters}>
          Reset Filters
        </Button>
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
      ) : filteredTrips.length > 0 ? (
        <div className="space-y-4">
          {filteredTrips.map((trip) => (
            <Card key={trip.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{trip.description}</CardTitle>
                  <span className="text-sm text-gray-500">ID: {trip.id}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                    <p>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</p>
                  </div>
                  <div className="flex items-center">
                    <Plane className="h-4 w-4 mr-1 text-gray-500" />
                    <p>{trip.departureAirport}</p>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1 text-gray-500" />
                    <p>${trip.price.toLocaleString()}</p>
                  </div>
                  <Badge>{trip.status}</Badge>
                </div>
                <Accordion type="single" collapsible className="w-full mt-4">
                  <AccordionItem value="destinations">
                    <AccordionTrigger>Trip Destinations ({trip.tripDestinations.length})</AccordionTrigger>
                    <AccordionContent>
                      {trip.tripDestinations.map((destination) => (
                        <div key={destination.id} className="mb-4 p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-semibold mb-2">{destination.farm.name}</h4>
                          <p className="text-sm text-gray-600 mb-1">{formatDate(destination.visitDate)}</p>
                          <p className="text-sm mb-2">{destination.description}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {destination.farm.varieties.map((variety) => (
                              <Badge key={variety.id} variant="outline" className="text-xs">
                                {variety.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p>No trips found.</p>
      )}
    </div>)
  );
}