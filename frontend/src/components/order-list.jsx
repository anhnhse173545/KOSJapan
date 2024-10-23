import React, { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Loader2, Plus, Trash, RefreshCcw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function OrderList() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [farms, setFarms] = useState([])
  const [bookings, setBookings] = useState([])
  const [bookingId, setBookingId] = useState("")
  const [farmId, setFarmId] = useState("")
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [error, setError] = useState("")

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await axios.get("http://localhost:8080/fish-order/consulting-staff/AC0004")
      setData(response.data)
      setError("")
    } catch (error) {
      console.error("Error fetching orders:", error)
      setError("Failed to load order data.")
    } finally {
      setLoading(false)
    }
  }

  const fetchFarms = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/farm/list")
      setFarms(response.data)
    } catch (error) {
      console.error("Error fetching farm list:", error)
      setError("Failed to load farm data.")
    }
  }

  const fetchBookings = async () => {
    try {
      // Replace with your actual API endpoint for fetching bookings
      const response = await axios.get("http://localhost:8080/api/bookings")
      setBookings(response.data)
    } catch (error) {
      console.error("Error fetching booking list:", error)
      setError("Failed to load booking data.")
    }
  }

  useEffect(() => {
    fetchOrders()
    fetchFarms()
    fetchBookings()
  }, [])

  const calculateTotalPrice = (record) => {
    const fishTotal = record.fishOrderDetails?.reduce((total, item) => total + item.price, 0) || 0
    const fishPackTotal = record.fishPackOrderDetails?.reduce((total, item) => total + item.price, 0) || 0
    return fishTotal + fishPackTotal
  }

  const handleAddKoi = (orderId, farmId) => {
    // Use the correct path for the Add Koi page
    window.location.href = `/order-list/add-koi?orderId=${orderId}&farmId=${farmId}`
  }

  const handleDeleteOrder = async (record) => {
    try {
      const url = `http://localhost:8080/fish-order/${record.bookingId}/${record.farmId}/delete`
      await axios.delete(url)
      setError(`Order with ID ${record.id} has been deleted.`)
      fetchOrders()
    } catch (error) {
      console.error("Error deleting order:", error)
      setError(error.response?.data?.message || "Failed to delete order. Please check your network and server.")
    }
  }

  const handleCreateOrder = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/fish-order/${bookingId}/${farmId}/create`, {
        deliveryAddress
      })
      setError(`Order created with ID: ${response.data.id}`)
      fetchOrders()
      // Reset form fields
      setBookingId("")
      setFarmId("")
      setDeliveryAddress("")
    } catch (error) {
      console.error("Error creating order:", error)
      setError(error.response?.data?.message || "Failed to create order. Please check your network and server.")
    }
  }

  const handleUpdatePaymentStatus = async (record) => {
    try {
      const url = `http://localhost:8080/fish-order/${record.bookingId}/${record.farmId}/update`
      const payload = { paymentStatus: "Deposited" }
      await axios.put(url, payload)
      setError(`Payment status updated for Order ID: ${record.id}`)
      fetchOrders()
    } catch (error) {
      console.error("Error updating payment status:", error)
      setError(error.response?.data?.message || "Failed to update payment status. Please check your network and server.")
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Fish Order List</h1>
        <Button onClick={fetchOrders} variant="outline">
          <RefreshCcw className="mr-2 h-4 w-4" /> Refresh
        </Button>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Create New Order</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="bookingId">Booking ID</Label>
              <Select value={bookingId} onValueChange={setBookingId}>
                <SelectTrigger id="bookingId">
                  <SelectValue placeholder="Select Booking ID" />
                </SelectTrigger>
                <SelectContent>
                  {bookings.map((booking) => (
                    <SelectItem key={booking.id} value={booking.id}>
                      {booking.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="farmId">Farm</Label>
              <Select value={farmId} onValueChange={setFarmId}>
                <SelectTrigger id="farmId">
                  <SelectValue placeholder="Select Farm" />
                </SelectTrigger>
                <SelectContent>
                  {farms.map((farm) => (
                    <SelectItem key={farm.id} value={farm.id}>
                      {farm.name} ({farm.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="deliveryAddress">Delivery Address</Label>
              <Textarea
                id="deliveryAddress"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Enter delivery address"
                rows={3}
              />
            </div>
            <div className="md:col-span-2">
              <Button onClick={handleCreateOrder} className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Create Order
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant={error.includes("created") || error.includes("updated") ? "default" : "destructive"} className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{error.includes("created") || error.includes("updated") ? "Success" : "Error"}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Farm ID</TableHead>
                <TableHead>Booking ID</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Total Price</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : (
                data.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.id}</TableCell>
                    <TableCell>{record.farmId}</TableCell>
                    <TableCell>{record.bookingId}</TableCell>
                    <TableCell>
                      <Badge variant={record.paymentStatus === "Deposited" ? "success" : "warning"}>
                        {record.paymentStatus || "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>{calculateTotalPrice(record)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleAddKoi(record.id, record.farmId)} disabled={record.paymentStatus === "Deposited"}>
                          Add Koi
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleUpdatePaymentStatus(record)} disabled={record.paymentStatus === "Deposited"}>
                          Update Payment
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Are you sure you want to delete this order?</DialogTitle>
                              <DialogDescription>
                                This action cannot be undone. This will permanently delete the order and remove its data from our servers.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => handleDeleteOrder(record)}>
                                Confirm Delete
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}