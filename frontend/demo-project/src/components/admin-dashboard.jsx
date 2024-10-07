import { useState, useMemo } from "react"
import { PlusCircle, Trash2, Users, Map, Link, CheckCircle2, XCircle, Menu, X, UserCircle, Briefcase, Truck } from "lucide-react"
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select"
import { Badge } from "@/ui/badge"
import { ScrollArea } from "@/ui/scroll-area"

export function AdminDashboardComponent() {
  const [staff, setStaff] = useState([
    { id: 1, name: "John Doe", role: "Sales Staff", email: "john@example.com" },
    { id: 2, name: "Jane Smith", role: "Consulting Staff", email: "jane@example.com" },
    { id: 3, name: "Mike Johnson", role: "Delivery Staff", email: "mike@example.com" },
  ])
  const [newStaff, setNewStaff] = useState({ name: "", role: "", email: "" })
  const [staffFilter, setStaffFilter] = useState("all")

  const [tours, setTours] = useState([
    { id: 1, name: "European Adventure", destination: "Paris, Rome, Berlin", startDate: "2024-06-01", endDate: "2024-06-15" },
    { id: 2, name: "Asian Explorer", destination: "Tokyo, Seoul, Bangkok", startDate: "2024-07-01", endDate: "2024-07-14" },
  ])
  const [newTour, setNewTour] = useState({ name: "", destination: "", startDate: "", endDate: "" })

  const [assignments, setAssignments] = useState([
    { id: 1, tourId: 1, staffId: 1 },
  ])
  const [newAssignment, setNewAssignment] = useState({ tourId: "", staffId: "" })

  const [filterAssigned, setFilterAssigned] = useState("all")
  const [activeTab, setActiveTab] = useState("staff")
  const [isNavExpanded, setIsNavExpanded] = useState(true)

  const addStaff = (e) => {
    e.preventDefault()
    setStaff([...staff, { id: staff.length + 1, ...newStaff }])
    setNewStaff({ name: "", role: "", email: "" })
  }

  const deleteStaff = (id) => {
    setStaff(staff.filter((s) => s.id !== id))
    setAssignments(assignments.filter((a) => a.staffId !== id))
  }

  const addTour = (e) => {
    e.preventDefault()
    setTours([...tours, { id: tours.length + 1, ...newTour }])
    setNewTour({ name: "", destination: "", startDate: "", endDate: "" })
  }

  const deleteTour = (id) => {
    setTours(tours.filter((t) => t.id !== id))
    setAssignments(assignments.filter((a) => a.tourId !== id))
  }

  const addAssignment = (e) => {
    e.preventDefault()
    if (newAssignment.tourId && newAssignment.staffId) {
      setAssignments([...assignments, { 
        id: assignments.length + 1, 
        tourId: parseInt(newAssignment.tourId), 
        staffId: parseInt(newAssignment.staffId) 
      }])
      setNewAssignment({ tourId: "", staffId: "" })
    }
  }

  const deleteAssignment = (id) => {
    setAssignments(assignments.filter((a) => a.id !== id))
  }

  const filteredStaff = useMemo(() => {
    if (staffFilter === "all") return staff
    return staff.filter(s => s.role === staffFilter);
  }, [staff, staffFilter])

  const filteredTours = useMemo(() => {
    if (filterAssigned === "all") return tours
    const isAssigned = filterAssigned === "assigned"
    return tours.filter(tour => 
      isAssigned ? assignments.some(a => a.tourId === tour.id) : !assignments.some(a => a.tourId === tour.id));
  }, [tours, assignments, filterAssigned])

  const getRoleIcon = (role) => {
    switch (role) {
      case "Sales Staff":
        return <UserCircle className="h-5 w-5 text-blue-500" />;
      case "Consulting Staff":
        return <Briefcase className="h-5 w-5 text-green-500" />;
      case "Delivery Staff":
        return <Truck className="h-5 w-5 text-yellow-500" />;
      default:
        return null
    }
  }

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "Sales Staff":
        return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
      case "Consulting Staff":
        return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
      case "Delivery Staff":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case "staff":
        return (
          (<div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="col-span-2 md:col-span-1 bg-white dark:bg-gray-800 shadow-md">
                <CardHeader className="bg-gray-100 dark:bg-gray-700 rounded-t-lg">
                  <CardTitle className="text-2xl text-gray-800 dark:text-gray-200">Staff List</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <Select value={staffFilter} onValueChange={setStaffFilter}>
                      <SelectTrigger
                        className="w-[200px] border-gray-300 focus:border-blue-500 transition-colors duration-200">
                        <SelectValue placeholder="Filter by role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="Sales Staff">Sales Staff</SelectItem>
                        <SelectItem value="Consulting Staff">Consulting Staff</SelectItem>
                        <SelectItem value="Delivery Staff">Delivery Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <ScrollArea className="h-[400px] w-full pr-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[200px]">Name</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredStaff.map((s) => (
                          <TableRow key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <TableCell className="font-medium">{s.name}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                {getRoleIcon(s.role)}
                                <Badge className={`ml-2 ${getRoleBadgeColor(s.role)}`}>
                                  {s.role}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>{s.email}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteStaff(s.id)}
                                className="hover:bg-red-600 transition-colors duration-200">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
              <Card className="col-span-2 md:col-span-1 bg-white dark:bg-gray-800 shadow-md">
                <CardHeader className="bg-gray-100 dark:bg-gray-700 rounded-t-lg">
                  <CardTitle className="text-2xl text-gray-800 dark:text-gray-200">Add New Staff</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={addStaff} className="space-y-4">
                    <Input
                      placeholder="Name"
                      value={newStaff.name}
                      onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                      required
                      className="border-gray-300 focus:border-blue-500 transition-colors duration-200" />
                    <Select
                      value={newStaff.role}
                      onValueChange={(value) => setNewStaff({ ...newStaff, role: value })}>
                      <SelectTrigger
                        className="w-full border-gray-300 focus:border-blue-500 transition-colors duration-200">
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sales Staff">Sales Staff</SelectItem>
                        <SelectItem value="Consulting Staff">Consulting Staff</SelectItem>
                        <SelectItem value="Delivery Staff">Delivery Staff</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="email"
                      placeholder="Email"
                      value={newStaff.email}
                      onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                      required
                      className="border-gray-300 focus:border-blue-500 transition-colors duration-200" />
                    <Button
                      type="submit"
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200">
                      <PlusCircle className="mr-2 h-5 w-5" /> Add Staff
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>)
        );
      case "tours":
        return (
          (<div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="col-span-2 md:col-span-1 bg-white dark:bg-gray-800 shadow-md">
                <CardHeader className="bg-gray-100 dark:bg-gray-700 rounded-t-lg">
                  <CardTitle className="text-2xl text-gray-800 dark:text-gray-200">Tour List</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <Select value={filterAssigned} onValueChange={setFilterAssigned}>
                      <SelectTrigger
                        className="w-[200px] border-gray-300 focus:border-blue-500 transition-colors duration-200">
                        <SelectValue placeholder="Filter by assignment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Tours</SelectItem>
                        <SelectItem value="assigned">Assigned Tours</SelectItem>
                        <SelectItem value="unassigned">Unassigned Tours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <ScrollArea className="h-[400px] w-full pr-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[200px]">Name</TableHead>
                          <TableHead>Destination</TableHead>
                          <TableHead>Dates</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTours.map((t) => (
                          <TableRow key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <TableCell className="font-medium">{t.name}</TableCell>
                            <TableCell>{t.destination}</TableCell>
                            <TableCell>{`${t.startDate} - ${t.endDate}`}</TableCell>
                            <TableCell>
                              {assignments.some(a => a.tourId === t.id) ? (
                                <Badge
                                  variant="default"
                                  className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                                  <CheckCircle2 className="mr-1 h-3 w-3" />
                                  Assigned
                                </Badge>
                              ) : (
                                <Badge
                                  variant="secondary"
                                  className="bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
                                  <XCircle className="mr-1 h-3 w-3" />
                                  Not Assigned
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteTour(t.id)}
                                className="hover:bg-red-600 transition-colors duration-200">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
              <Card className="col-span-2 md:col-span-1 bg-white dark:bg-gray-800 shadow-md">
                <CardHeader className="bg-gray-100 dark:bg-gray-700 rounded-t-lg">
                  <CardTitle className="text-2xl text-gray-800 dark:text-gray-200">Add New Tour</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={addTour} className="space-y-4">
                    <Input
                      placeholder="Tour Name"
                      value={newTour.name}
                      onChange={(e) => setNewTour({ ...newTour, name: e.target.value })}
                      required
                      className="border-gray-300 focus:border-blue-500 transition-colors duration-200" />
                    <Input
                      placeholder="Destination"
                      value={newTour.destination}
                      onChange={(e) => setNewTour({ ...newTour, destination: e.target.value })}
                      required
                      className="border-gray-300 focus:border-blue-500 transition-colors duration-200" />
                    <Input
                      type="date"
                      placeholder="Start Date"
                      value={newTour.startDate}
                      onChange={(e) => setNewTour({ ...newTour, startDate: e.target.value })}
                      required
                      className="border-gray-300 focus:border-blue-500 transition-colors duration-200" />
                    <Input
                      type="date"
                      placeholder="End Date"
                      value={newTour.endDate}
                      onChange={(e) => setNewTour({ ...newTour, endDate: e.target.value })}
                      required
                      className="border-gray-300 focus:border-blue-500 transition-colors duration-200" />
                    <Button
                      type="submit"
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200">
                      <PlusCircle className="mr-2 h-5 w-5" /> Add Tour
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>)
        );
      case "assignments":
        return (
          (<div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="col-span-2 md:col-span-1 bg-white dark:bg-gray-800 shadow-md">
                <CardHeader className="bg-gray-100 dark:bg-gray-700 rounded-t-lg">
                  <CardTitle className="text-2xl text-gray-800 dark:text-gray-200">Tour Assignments</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ScrollArea className="h-[400px] w-full pr-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[200px]">Tour</TableHead>
                          <TableHead>Staff</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {assignments.map((a) => (
                          <TableRow key={a.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <TableCell className="font-medium">{tours.find(t => t.id === a.tourId)?.name}</TableCell>
                            <TableCell>{staff.find(s => s.id === a.staffId)?.name}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteAssignment(a.id)}
                                className="hover:bg-red-600 transition-colors duration-200">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
              <Card className="col-span-2 md:col-span-1 bg-white dark:bg-gray-800 shadow-md">
                <CardHeader className="bg-gray-100 dark:bg-gray-700 rounded-t-lg">
                  <CardTitle className="text-2xl text-gray-800 dark:text-gray-200">Assign Staff to Tour</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={addAssignment} className="space-y-4">
                    <Select
                      value={newAssignment.tourId}
                      onValueChange={(value) => setNewAssignment({ ...newAssignment, tourId: value })}>
                      <SelectTrigger
                        className="w-full border-gray-300 focus:border-blue-500 transition-colors duration-200">
                        <SelectValue placeholder="Select Tour" />
                      </SelectTrigger>
                      <SelectContent>
                        {tours.map((tour) => (
                          <SelectItem key={tour.id} value={tour.id.toString()}>
                            {tour.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={newAssignment.staffId}
                      onValueChange={(value) => setNewAssignment({ ...newAssignment, staffId: value })}>
                      <SelectTrigger
                        className="w-full border-gray-300 focus:border-blue-500 transition-colors duration-200">
                        <SelectValue placeholder="Select Staff" />
                      </SelectTrigger>
                      <SelectContent>
                        {staff.map((s) => (
                          <SelectItem key={s.id} value={s.id.toString()}>
                            {s.name} - {s.role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="submit"
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200">
                      <PlusCircle className="mr-2 h-5 w-5" /> Assign Staff to Tour
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>)
        );
      default:
        return null
    }
  }

  return (
    (<div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Navigation Sidebar */}
      <div
        className={`bg-white dark:bg-gray-800 ${isNavExpanded ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out`}>
        <div
          className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          {isNavExpanded && <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Admin Panel</h2>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsNavExpanded(!isNavExpanded)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            {isNavExpanded ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
        <nav className="mt-6">
          <Button
            variant="ghost"
            className={`w-full justify-start mb-2 ${activeTab === 'staff' ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
            onClick={() => setActiveTab('staff')}>
            <Users className={`h-5 w-5 ${isNavExpanded ? 'mr-2' : 'mx-auto'}`} />
            {isNavExpanded && 'Staff Management'}
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start mb-2 ${activeTab === 'tours' ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
            onClick={() => setActiveTab('tours')}>
            <Map className={`h-5 w-5 ${isNavExpanded ? 'mr-2' : 'mx-auto'}`} />
            {isNavExpanded && 'Tour Management'}
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start mb-2 ${activeTab === 'assignments' ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
            onClick={() => setActiveTab('assignments')}>
            <Link className={`h-5 w-5 ${isNavExpanded ? 'mr-2' : 'mx-auto'}`} />
            {isNavExpanded && 'Tour Assignments'}
          </Button>
        </nav>
      </div>
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white dark:bg-gray-800 shadow-md p-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Admin Dashboard</h1>
        </header>
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>)
  );
}