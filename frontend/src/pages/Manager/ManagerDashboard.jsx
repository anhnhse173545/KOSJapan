import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ChevronLeft,
  LogOut,
  Bell,
  FlaskConical,
  BarChart,
  ClipboardList,
  Users,
  MapPin,
  CreditCard,
  Menu,
} from 'lucide-react'

///////////////
// import { TripListComponent } from './tests/trip-list'
import { TripListComponent } from './pages/trip-list-component'
 
///////////////

import DashboardOverview from './DashboardOverview'
import CustomerRequestView from './CustomerRequestView'
import StaffManagerView from './StaffManagerView'
import TourManagerView from './TourManagerView'
import PaymentStatusView from './PaymentStatusView'

export default function ManagerDashboard() {
  const [isNavExpanded, setIsNavExpanded] = useState(true)

  const toggleNav = () => setIsNavExpanded(!isNavExpanded)

  const navItems = [
    ///////////////
    { name: 'Test', icon: <FlaskConical className="h-5 w-5" />, path: '/test1' },
    { name: 'Test', icon: <FlaskConical className="h-5 w-5" />, path: '/test2' },
    { name: 'Test', icon: <FlaskConical className="h-5 w-5" />, path: '/test3' },
    { name: 'Test', icon: <FlaskConical className="h-5 w-5" />, path: '/test4' },
    { name: 'Test', icon: <FlaskConical className="h-5 w-5" />, path: '/test5' },
    ///////////////
    { name: 'Dashboard Overview', icon: <BarChart className="h-5 w-5" />, path: '/dashboard' },
    { name: 'Customer Requests', icon: <ClipboardList className="h-5 w-5" />, path: '/customer-requests' },
    { name: 'Staff Manager', icon: <Users className="h-5 w-5" />, path: '/staff-manager' },
    { name: 'Tour Manager', icon: <MapPin className="h-5 w-5" />, path: '/tour-manager' },
    { name: 'Payment Status', icon: <CreditCard className="h-5 w-5" />, path: '/payment-status' },
  ]

  return (
    <Router>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        {/* Navigation Sidebar */}
        <nav
          className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out ${
            isNavExpanded ? 'w-64' : 'w-20'
          }`}
        >
          <div className="p-4 flex justify-between items-center">
            {isNavExpanded && <span className="font-semibold text-lg text-gray-700 dark:text-gray-200">KOSJapan</span>}
            <Button
              onClick={toggleNav}
              variant="ghost"
              size="icon"
              className="text-gray-500 dark:text-gray-400"
            >
              {isNavExpanded ? <ChevronLeft className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
          <ul className="space-y-2 mt-4">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link to={item.path}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                  >
                    {item.icon}
                    {isNavExpanded && <span className="ml-3">{item.name}</span>}
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
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
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              <Routes>
                {/* /////////////////// */}
                <Route path='/test1' element={<TripListComponent />} />
                <Route path='/test2' element={<TripListComponent />} />
                <Route path='/test3' element={<TripListComponent />} />
                <Route path='/test4' element={<TripListComponent />} />
                <Route path='/test5' element={<TripListComponent />} />
                {/* ///////////////////// */}

                <Route path="/dashboard" element={<DashboardOverview />} />
                <Route path="/customer-requests" element={<CustomerRequestView />} />
                <Route path="/staff-manager" element={<StaffManagerView />} />
                <Route path="/tour-manager" element={<TourManagerView />} />
                <Route path="/payment-status" element={<PaymentStatusView />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  )
}