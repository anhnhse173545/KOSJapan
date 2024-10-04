import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ChevronLeft,
  LogOut,
  Bell,
  BarChart,
  ClipboardList,
  Users,
  MapPin,
  CreditCard,
  Menu,
  Home,
  Fish
} from 'lucide-react'
import DashboardOverview from './dashboard-overview'
import CustomerRequestsView from './customer-requests-view'
import StaffManagerView from './staff-manager-view'
import TourManagerView from './tour-manager-view'
import KoiFarmManagerView from './koi-farm-manager-view'
import KoiFishManagerView from './koi-fish-manager-view'
import PaymentStatusView from './payment-status-view'

export function Dashboard() {
  const [isNavExpanded, setIsNavExpanded] = useState(true)
  const [activeSection, setActiveSection] = useState('dashboard-overview')

  const toggleNav = () => setIsNavExpanded(!isNavExpanded)

  const navItems = [
    { name: 'Dashboard Overview', icon: <BarChart className="h-5 w-5" /> },
    { name: 'Customer Requests', icon: <ClipboardList className="h-5 w-5" /> },
    { name: 'Staff Manager', icon: <Users className="h-5 w-5" /> },
    { name: 'Tour Manager', icon: <MapPin className="h-5 w-5" /> },
    { name: 'Koi Farm Manager', icon: <Home className="h-5 w-5" /> },
    { name: 'Koi Fish Manager', icon: <Fish className="h-5 w-5" /> },
    { name: 'Payment Status', icon: <CreditCard className="h-5 w-5" /> },
  ]

  return (
    (<div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Navigation Sidebar */}
      <nav
        className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out ${isNavExpanded ? 'w-64' : 'w-20'}`}>
        <div className="p-4 flex justify-between items-center">
          {isNavExpanded && <span className="font-semibold text-lg text-gray-700 dark:text-gray-200">KOI Tour Pro</span>}
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
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">KOI Tour Manager Dashboard</h1>
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
            {activeSection === 'koi-farm-manager' && <KoiFarmManagerView />}
            {activeSection === 'koi-fish-manager' && <KoiFishManagerView />}
            {activeSection === 'payment-status' && <PaymentStatusView />}
          </div>
        </main>
      </div>
    </div>)
  );
}