import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
// import App from './App'

import ManagerDashboard from './ManagerDashboard'
import TripApiTesterComponent from './tests/trip-api-tester'
import { HomepageComponent } from './tests/homepage'
import { TripListComponent } from './tests/trip-list'
import AccountApiTester from './tests/account-api-tester'
import { AccountManagerComponent } from './manage/account-manager'
import { BookingManagementJsx } from './manage/booking-management'
import { SalesStaffAssignmentViewComponent } from './pages/SalesStaff-Assign'
import { BookingApiTesterComponent } from './temp/booking-api-tester'
  

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <BookingApiTesterComponent /> */}
    {/* <App/> */}
    <ManagerDashboard />
    {/* <TripApiTesterComponent />
    <TripListComponent />
    <HomepageComponent /> */}
    {/* <AccountApiTester /> */}

    {/* /* <AccountManagerComponent /> */}
    
    <AccountManagerComponent />
    <BookingManagementJsx />
    <SalesStaffAssignmentViewComponent /> */

  </StrictMode>
      
)
