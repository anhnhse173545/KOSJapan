import { useState } from 'react'
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs"
import { Label } from "@/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/ui/card"
import { Badge } from "@/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";
import {
  ChevronLeft,
  LogOut,
  Bell,
  Search,
  UserPlus,
  Check,
  Users,
  ClipboardList,
  MapPin,
  CreditCard,
  Menu,
  Calendar,
  DollarSign,
  TrendingUp,
  BarChart,
  Star,
  Briefcase,
  Truck,
  UserCircle,
  PlusCircle,
  Edit,
  Trash2,
} from 'lucide-react';

export function ManagerDashboardComponent() {
  const [isNavExpanded, setIsNavExpanded] = useState(true)
  const [activeSection, setActiveSection] = useState('dashboard-overview')

  const toggleNav = () => setIsNavExpanded(!isNavExpanded)

  const navItems = [
    { name: 'Dashboard Overview', icon: <BarChart className="h-5 w-5" /> },
    { name: 'Customer Requests', icon: <ClipboardList className="h-5 w-5" /> },
    { name: 'Staff Manager', icon: <Users className="h-5 w-5" /> },
    { name: 'Tour Manager', icon: <MapPin className="h-5 w-5" /> },
    { name: 'Payment Status', icon: <CreditCard className="h-5 w-5" /> },
  ]

  return (
    (<div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Navigation Sidebar */}
      <nav
        className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out ${isNavExpanded ? 'w-64' : 'w-20'}`}>
        <div className="p-4 flex justify-between items-center">
          {isNavExpanded && <span className="font-semibold text-lg text-gray-700 dark:text-gray-200">TourMaster Pro</span>}
          <Button
            onClick={toggleNav}
            variant="ghost"
            size="icon"
            className="text-gray-500 dark:text-gray-400">
            {isNavExpanded ? <ChevronLeft className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        <ul className="space-y-2 mt-4">
          {navItems.map((item) => (
            <li key={item.name}>
              <Button
                variant="ghost"
                className={`w-full justify-start px-4 py-2 ${activeSection === item.name.toLowerCase().replace(' ', '-') ? 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100'}`}
                onClick={() => setActiveSection(item.name.toLowerCase().replace(' ', '-'))}>
                {item.icon}
                {isNavExpanded && <span className="ml-3">{item.name}</span>}
              </Button>
            </li>
          ))}
        </ul>
      </nav>
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header
          className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-10">
          <div
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Manager Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">{new Date().toLocaleDateString()}</span>
              <Button variant="ghost" size="icon" className="text-gray-500 dark:text-gray-400">
                <Bell className="h-5 w-5" />
              </Button>
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="icon" className="text-gray-500 dark:text-gray-400">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main
          className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {activeSection === 'dashboard-overview' && <DashboardOverview />}
            {activeSection === 'customer-requests' && <CustomerRequestsView />}
            {activeSection === 'staff-manager' && <StaffManagerView />}
            {activeSection === 'tour-manager' && <TourManagerView />}
            {activeSection === 'payment-status' && <PaymentStatusView />}
          </div>
        </main>
      </div>
    </div>)
  );
}

function DashboardOverview() {
  return (
    (<div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tours</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">-3 from last week</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>A summary of the latest events in your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            <li className="flex items-center space-x-3">
              <Badge variant="secondary"><Check className="h-4 w-4" /></Badge>
              <span className="text-sm">New tour package "European Delight" created</span>
            </li>
            <li className="flex items-center space-x-3">
              <Badge variant="secondary"><Users className="h-4 w-4" /></Badge>
              <span className="text-sm">5 new staff members added to the team</span>
            </li>
            <li className="flex items-center space-x-3">
              <Badge variant="secondary"><CreditCard className="h-4 w-4" /></Badge>
              <span className="text-sm">Payment of $12,450 received for "Asian Explorer" tour</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>)
  );
}

function CustomerRequestsView() {
  return (
    (<div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Customer Requests</h2>
      <Card>
        <CardHeader className="flex justify-between items-center">
          <div>
            <CardTitle>Incoming Tour Requests</CardTitle>
            <CardDescription>Manage and process customer inquiries</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Input type="text" placeholder="Search requests..." className="w-64" />
            <Button variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {['John Doe', 'Jane Smith', 'Bob Johnson'].map((customer) => (
              <li key={customer} className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={customer} />
                      <AvatarFallback>{customer.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{customer}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Requested Tour: City Explorer</p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="ml-2 bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700">
                    Pending
                  </Badge>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="h-4 w-4 mr-1" />
                      Request Date: {new Date().toLocaleDateString()}
                    </p>
                  </div>
                  <div
                    className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Potential Value: $2,500
                  </div>
                </div>
                <div className="mt-2">
                  <Button size="sm" variant="outline">Assign Staff</Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>)
  );
}

function StaffManagerView() {
  const [staffList, setStaffList] = useState([
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Sales Staff', performance: 4.5 },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Consulting Staff', performance: 4.2 },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', role: 'Delivery Staff', performance: 4.8 },
  ])
  const [isAdding, setIsAdding] = useState(false)
  const [editingStaff, setEditingStaff] = useState(null)

  const addStaff = (newStaff) => {
    setStaffList([...staffList, { id: staffList.length + 1, ...newStaff }])
    setIsAdding(false)
  }

  const updateStaff = (id, updatedStaff) => {
    setStaffList(
      staffList.map(staff => staff.id === id ? { ...staff, ...updatedStaff } : staff)
    )
    setEditingStaff(null)
  }

  const deleteStaff = (id) => {
    setStaffList(staffList.filter(staff => staff.id !== id))
  }

  return (
    (<div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Staff Manager</h2>
      <Card>
        <CardHeader className="flex justify-between items-center">
          <div>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>Manage your staff and their roles</CardDescription>
          </div>
          <Button
            variant="outline"
            onClick={() =>
  setIsAdding(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Staff
          </Button>
        </CardHeader>
        <CardContent>
          {isAdding ? (
            <AddStaffForm onAddStaff={addStaff} onCancel={() => setIsAdding(false)} />
          ) : editingStaff ? (
            <EditStaffForm
              staff={editingStaff}
              onUpdateStaff={updateStaff}
              onCancel={() => setEditingStaff(null)} />
          ) : (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All Staff</TabsTrigger>
                <TabsTrigger value="sales">Sales</TabsTrigger>
                <TabsTrigger value="consulting">Consulting</TabsTrigger>
                <TabsTrigger value="delivery">Delivery</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <StaffList staffList={staffList} onEdit={setEditingStaff} onDelete={deleteStaff} />
              </TabsContent>
              <TabsContent value="sales">
                <StaffList
                  staffList={staffList.filter(staff => staff.role === 'Sales Staff')}
                  onEdit={setEditingStaff}
                  onDelete={deleteStaff} />
              </TabsContent>
              <TabsContent value="consulting">
                <StaffList
                  staffList={staffList.filter(staff => staff.role === 'Consulting Staff')}
                  onEdit={setEditingStaff}
                  onDelete={deleteStaff} />
              </TabsContent>
              <TabsContent value="delivery">
                <StaffList
                  staffList={staffList.filter(staff => staff.role === 'Delivery Staff')}
                  onEdit={setEditingStaff}
                  onDelete={deleteStaff} />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>)
  );
}

function StaffList({ staffList, onEdit, onDelete }) {
  return (
    (<ul className="divide-y divide-gray-200 dark:divide-gray-700">
      {staffList.map((staff) => (
        <li key={staff.id} className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={staff.name} />
                <AvatarFallback>{staff.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{staff.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{staff.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge
                variant="outline"
                className={
                  staff.role === 'Sales Staff' ? 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700' :
                  staff.role === 'Consulting Staff' ? 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700' :
                  'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700'
                }>
                {staff.role === 'Sales Staff' && <UserCircle className="h-4 w-4 mr-1" />}
                {staff.role === 'Consulting Staff' && <Briefcase className="h-4 w-4 mr-1" />}
                {staff.role === 'Delivery Staff' && <Truck className="h-4 w-4 mr-1" />}
                {staff.role}
              </Badge>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                <span className="text-sm text-gray-600 dark:text-gray-300">{staff.performance}</span>
              </div>
            </div>
          </div>
          <div className="mt-2 flex justify-end space-x-2">
            <Button size="sm" variant="outline" onClick={() => onEdit(staff)}>Edit</Button>
            <Button size="sm" variant="destructive" onClick={() => onDelete(staff.id)}>Delete</Button>
          </div>
        </li>
      ))}
    </ul>)
  );
}

function AddStaffForm({ onAddStaff, onCancel }) {
  const [newStaff, setNewStaff] = useState({ name: '', email: '', role: '', performance: 0 })

  const handleSubmit = (e) => {
    e.preventDefault()
    onAddStaff(newStaff)
  }

  return (
    (<form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={newStaff.name}
          onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
          required />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={newStaff.email}
          onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
          required />
      </div>
      <div>
        <Label htmlFor="role">Role</Label>
        <Select
          value={newStaff.role}
          onValueChange={(value) => setNewStaff({ ...newStaff, role: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Sales Staff">Sales Staff</SelectItem>
            <SelectItem value="Consulting Staff">Consulting Staff</SelectItem>
            <SelectItem value="Delivery Staff">Delivery Staff</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="performance">Initial Performance Rating</Label>
        <Input
          id="performance"
          type="number"
          min="0"
          max="5"
          step="0.1"
          value={newStaff.performance}
          onChange={(e) => setNewStaff({ ...newStaff, performance: parseFloat(e.target.value) })}
          required />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Add Staff</Button>
      </div>
    </form>)
  );
}

function EditStaffForm({ staff, onUpdateStaff, onCancel }) {
  const [editedStaff, setEditedStaff] = useState(staff)

  const handleSubmit = (e) => {
    e.preventDefault()
    onUpdateStaff(staff.id, editedStaff)
  }

  return (
    (<form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={editedStaff.name}
          onChange={(e) => setEditedStaff({ ...editedStaff, name: e.target.value })}
          required />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={editedStaff.email}
          onChange={(e) => setEditedStaff({ ...editedStaff, email: e.target.value })}
          required />
      </div>
      <div>
        <Label htmlFor="role">Role</Label>
        <Select
          value={editedStaff.role}
          onValueChange={(value) => setEditedStaff({ ...editedStaff, role: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Sales Staff">Sales Staff</SelectItem>
            <SelectItem value="Consulting Staff">Consulting Staff</SelectItem>
            <SelectItem value="Delivery Staff">Delivery Staff</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="performance">Performance Rating</Label>
        <Input
          id="performance"
          type="number"
          min="0"
          max="5"
          step="0.1"
          value={editedStaff.performance}
          onChange={(e) => setEditedStaff({ ...editedStaff, performance: parseFloat(e.target.value) })}
          required />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Update Staff</Button>
      </div>
    </form>)
  );
}

function TourManagerView() {
  const [tours, setTours] = useState([
    { id: 1, name: "European Adventure", destination: "Paris, Rome, Berlin", startDate: "2024-06-01", endDate: "2024-06-15", price: 2500, capacity: 20, bookedSpots: 15 },
    { id: 2, name: "Asian Explorer", destination: "Tokyo, Seoul, Bangkok", startDate: "2024-07-01", endDate: "2024-07-14", price: 3000, capacity: 18, bookedSpots: 10 },
    { id: 3, name: "African Safari", destination: "Nairobi, Maasai Mara, Serengeti", startDate: "2024-08-15", endDate: "2024-08-28", price: 4000, capacity: 12, bookedSpots: 8 },
  ])

  const [newTour, setNewTour] = useState({
    name: "",
    destination: "",
    startDate: "",
    endDate: "",
    price: "",
    capacity: "",
  })

  const [editingTour, setEditingTour] = useState(null)
  const [isAddingTour, setIsAddingTour] = useState(false)

  const handleAddTour = (e) => {
    e.preventDefault()
    const tourToAdd = {
      ...newTour,
      id: tours.length + 1,
      price: parseFloat(newTour.price),
      capacity: parseInt(newTour.capacity),
      bookedSpots: 0,
    }
    setTours([...tours, tourToAdd])
    setNewTour(
      { name: "", destination: "", startDate: "", endDate: "", price: "", capacity: "" }
    )
    setIsAddingTour(false)
  }

  const handleEditTour = (tour) => {
    setEditingTour({ ...tour })
  }

  const handleUpdateTour = () => {
    setTours(tours.map(t => t.id === editingTour.id ? editingTour : t))
    setEditingTour(null)
  }

  const handleDeleteTour = (id) => {
    setTours(tours.filter(t => t.id !== id))
  }

  return (
    (<div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Tour Manager</h2>
        <Button onClick={() => setIsAddingTour(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Tour
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Tour List</CardTitle>
          <CardDescription>Manage and organize your tour packages</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Booked</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tours.map((tour) => (
                <TableRow key={tour.id}>
                  <TableCell className="font-medium">{tour.name}</TableCell>
                  <TableCell>{tour.destination}</TableCell>
                  <TableCell>{`${tour.startDate} - ${tour.endDate}`}</TableCell>
                  <TableCell>${tour.price}</TableCell>
                  <TableCell>{tour.capacity}</TableCell>
                  <TableCell>{tour.bookedSpots}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditTour(tour)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteTour(tour.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* Add Tour Dialog */}
      <Dialog open={isAddingTour} onOpenChange={setIsAddingTour}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Tour</DialogTitle>
            <DialogDescription>Enter the details for the new tour package.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddTour}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  value={newTour.name}
                  onChange={(e) => setNewTour({ ...newTour, name: e.target.value })}
                  className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="destination" className="text-right">Destination</Label>
                <Input
                  id="destination"
                  value={newTour.destination}
                  onChange={(e) => setNewTour({ ...newTour, destination: e.target.value })}
                  className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startDate" className="text-right">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={newTour.startDate}
                  onChange={(e) => setNewTour({ ...newTour, startDate: e.target.value })}
                  className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endDate" className="text-right">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={newTour.endDate}
                  onChange={(e) => setNewTour({ ...newTour, endDate: e.target.value })}
                  className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={newTour.price}
                  onChange={(e) => setNewTour({ ...newTour, price: e.target.value })}
                  className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="capacity" className="text-right">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={newTour.capacity}
                  onChange={(e) => setNewTour({ ...newTour, capacity: e.target.value })}
                  className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add Tour</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* Edit Tour Dialog */}
      <Dialog open={!!editingTour} onOpenChange={() => setEditingTour(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Tour</DialogTitle>
            <DialogDescription>Update the details for this tour package.</DialogDescription>
          </DialogHeader>
          {editingTour && (
            <form onSubmit={(e) => { e.preventDefault(); handleUpdateTour(); }}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">Name</Label>
                  <Input
                    id="edit-name"
                    value={editingTour.name}
                    onChange={(e) => setEditingTour({...editingTour, name: e.target.value})}
                    className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-destination" className="text-right">Destination</Label>
                  <Input
                    id="edit-destination"
                    value={editingTour.destination}
                    onChange={(e) => setEditingTour({...editingTour, destination: e.target.value})}
                    className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-startDate" className="text-right">Start Date</Label>
                  <Input
                    id="edit-startDate"
                    type="date"
                    value={editingTour.startDate}
                    onChange={(e) => setEditingTour({...editingTour, startDate: e.target.value})}
                    className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-endDate" className="text-right">End Date</Label>
                  <Input
                    id="edit-endDate"
                    type="date"
                    value={editingTour.endDate}
                    onChange={(e) => setEditingTour({...editingTour, endDate: e.target.value})}
                    className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-price" className="text-right">Price</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={editingTour.price}
                    onChange={(e) => setEditingTour({...editingTour, price: parseFloat(e.target.value)})}
                    className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-capacity" className="text-right">Capacity</Label>
                  <Input
                    id="edit-capacity"
                    type="number"
                    value={editingTour.capacity}
                    onChange={(e) => setEditingTour({...editingTour, capacity: parseInt(e.target.value)})}
                    className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Update Tour</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>)
  );
}

function PaymentStatusView() {
  const [payments, setPayments] = useState([
    { id: 1, customerName: "Alice Johnson", tourName: "European Adventure", amount: 2500, status: "Paid", date: "2024-05-15" },
    { id: 2, customerName: "Bob Smith", tourName: "Asian Explorer", amount: 3000, status: "Pending", date: "2024-06-01" },
    { id: 3, customerName: "Charlie Brown", tourName: "African Safari", amount: 4000, status: "Refunded", date: "2024-07-10" },
    { id: 4, customerName: "Diana Ross", tourName: "European Adventure", amount: 2500, status: "Paid", date: "2024-05-20" },
    { id: 5, customerName: "Edward Norton", tourName: "Asian Explorer", amount: 3000, status: "Overdue", date: "2024-06-05" },
  ])

  const [filterStatus, setFilterStatus] = useState("all")

  const filteredPayments = payments.filter(payment => 
    filterStatus === "all" ? true : payment.status.toLowerCase() === filterStatus)

  const totalRevenue = payments.reduce(
    (sum, payment) => sum + (payment.status === "Paid" ? payment.amount : 0),
    0
  )
  const pendingRevenue = payments.reduce(
    (sum, payment) => sum + (payment.status === "Pending" ? payment.amount : 0),
    0
  )

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
      case 'refunded':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
    }
  }

  return (
    (<div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Payment Status</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pendingRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Transaction</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(totalRevenue / payments.length).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Payment Overview</CardTitle>
          <CardDescription>Track and manage payment statuses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Tour</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.customerName}</TableCell>
                  <TableCell>{payment.tourName}</TableCell>
                  <TableCell>${payment.amount}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(payment.status)}>
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{payment.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>)
  );
}