'use client'

import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Search, Calendar, TrendingUp, UserPlus } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

// PropTypes
const CustomerPropTypes = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  requestedTour: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  requestDate: PropTypes.string.isRequired,
  potentialValue: PropTypes.number.isRequired,
})

const StaffMemberPropTypes = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
})

// API functions
const API_BASE_URL = '/api'; // Replace with your actual API base URL

async function fetchCustomerRequests() {
  const response = await fetch(`${API_BASE_URL}/customer-requests`);
  if (!response.ok) {
    throw new Error('Failed to fetch customer requests');
  }
  return response.json();
}

async function fetchStaffMembers() {
  const response = await fetch(`${API_BASE_URL}/staff-members`);
  if (!response.ok) {
    throw new Error('Failed to fetch staff members');
  }
  return response.json();
}

async function assignStaffToCustomer(customerId, staffId) {
  const response = await fetch(`${API_BASE_URL}/assign-staff`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ customerId, staffId }),
  });
  if (!response.ok) {
    throw new Error('Failed to assign staff');
  }
}

export default function CustomerRequestView() {
  const [customerRequests, setCustomerRequests] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    async function loadData() {
      try {
        const [customers, staff] = await Promise.all([
          fetchCustomerRequests(),
          fetchStaffMembers(),
        ]);
        setCustomerRequests(customers);
        setStaffMembers(staff);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const openAssignStaffDialog = (customer) => {
    setSelectedCustomer(customer);
    setIsDialogOpen(true);
  };

  const handleAssignStaff = async (staffMember) => {
    if (!selectedCustomer) return;
    try {
      await assignStaffToCustomer(selectedCustomer.id, staffMember.id);
      setCustomerRequests(prevRequests =>
        prevRequests.map(req =>
          req.id === selectedCustomer.id ? { ...req, status: 'Assigned' } : req));
      toast({
        title: "Staff Assigned",
        description: `${staffMember.name} has been assigned to ${selectedCustomer.name}'s request.`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to assign staff. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDialogOpen(false);
    }
  };

  const filteredRequests = customerRequests.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()));

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

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
            <Input
              type="text"
              placeholder="Search requests..."
              className="w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} />
            <Button variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredRequests.map((customer) => (
              <li key={customer.id} className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={customer.name} />
                      <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{customer.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Requested Tour: {customer.requestedTour}</p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`ml-2 ${
                      customer.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700' :
                      'bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700'
                    }`}>
                    {customer.status}
                  </Badge>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="h-4 w-4 mr-1" />
                      Request Date: {customer.requestDate}
                    </p>
                  </div>
                  <div
                    className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Potential Value: ${customer.potentialValue.toLocaleString()}
                  </div>
                </div>
                <div className="mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openAssignStaffDialog(customer)}
                    disabled={customer.status !== 'Pending'}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    {customer.status === 'Pending' ? 'Assign Staff' : 'Assigned'}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Staff to {selectedCustomer?.name}</DialogTitle>
            <DialogDescription>
              Select a staff member to assign to this customer's request.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {staffMembers.map((staff) => (
              <Button
                key={staff.id}
                variant="outline"
                className="justify-start"
                onClick={() => handleAssignStaff(staff)}>
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={staff.name} />
                  <AvatarFallback>{staff.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="font-medium">{staff.name}</p>
                  <p className="text-sm text-gray-500">{staff.role}</p>
                </div>
              </Button>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>)
  );
}

CustomerRequestView.propTypes = {
  customerRequests: PropTypes.arrayOf(CustomerPropTypes),
  staffMembers: PropTypes.arrayOf(StaffMemberPropTypes),
}