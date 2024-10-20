import {
  createBrowserRouter,
  RouterProvider,
  Link,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import Layout from "./components/layout";
import CombinedKoiRequestForm from "./pages/request-form";
import Register from "./pages/register";
import Login from "./pages/login";
import PaymentPage from "./pages/booking";
import PaymentDetailsPage from "./pages/tripDetail";
import QuotaDetailsPage from "./pages/tripQuota";
import OnGoingPage from "./pages/onGoing";
import { HomepageComponent } from "./pages/home/homepage";
import KoiPage from "./pages/mykoi";
import KoiDetailPage from "./pages/detailFish";
import KoiPayPage from "./pages/paykoi";
import ConsultingStaff from "./pages/ConsultingStaff/ConsultingStaff";
import SaleStaff from "./pages/SaleStaff/SaleStaff";
import CustomerRequest from "./pages/SaleStaff/CustomerRequest";
import AddKoi from "./pages/ConsultingStaff/AddKoi";
import ConsultingStaffHome from "./pages/ConsultingStaff/ConsultingStaffHome";
import KoiDetails from "./pages/ConsultingStaff/KoiDetails";
import OrderList from "./pages/ConsultingStaff/OrderList"; // Renamed to avoid conflict
import TourDetails from "./pages/ConsultingStaff/TourDetails";
import TourList from "./pages/ConsultingStaff/TourList";
import DeliveryStaffHome from "./pages/DeliveryStaff/DeliveryStaffHome";
import DeliveryOrderList from "./pages/DeliveryStaff/DeliveryOrderList";
import TrackingOrder from "./pages/DeliveryStaff/TrackingOrder";
import SaleStaffHome from "./pages/SaleStaff/SaleStaffHome";

import DeliveryStaff from "./pages/DeliveryStaff/DeliveryStaff";
import PaidBooking from "./pages/paidBooking";
import CreateTrip from "./pages/SaleStaff/ViewTripPlan";
import KoiFarmPage from "./pages/koifarmreview";

import ManagerDashboard from "./Manager/ManagerDashboard";
import DashboardOverview from "./Manager/finals/DashboardOverview";
import StaffManagerView from "./Manager/finals/StaffManagerView";
import BookingManagerComponent from "./Manager/finals/booking-manager";
import { SalesStaffManagementComponent } from "./Manager/finals/sales-staff-management";
import { ConsultingStaffAssignmentComponent } from "./Manager/finals/consulting-staff-assignment-component";
import { DeliveryStaffAssignment } from "./Manager/finals/delivery-staff-assignment";
import { ExtendedQuoteReviewComponent } from "./Manager/finals/extended-quote-review";
import { DeliveryOrderListComponent } from "./Manager/finals/delivery-order-list";
import UserDetailPage from "./pages/userDetail";


function App() {
  const router = createBrowserRouter([
    {
      path: "",
      element: <Layout />,
      children: [
        { path: "/", element: <HomepageComponent /> },
        { path: "/contact", element: <CombinedKoiRequestForm /> },
        { path: "/register", element: <Register /> },
        { path: "/login", element: <Login /> },
        { path: "/payment", element: <PaymentPage /> },
        { path: "/payment/:id", element: <PaymentDetailsPage /> },
        { path: "/quota/:id", element: <QuotaDetailsPage /> },
        { path: "/onGoing/:id", element: <OnGoingPage /> },
        { path: "/mykoi", element: <KoiPage /> },
        { path: "/mykoi/:id", element: <KoiDetailPage /> },
        { path: "/paykoi/:id", element: <KoiPayPage /> },
        { path: "/paidbooking/:id", element: <PaidBooking /> },
        { path: "/koifarmpage", element: <KoiFarmPage /> },
        { path: "/userDetail", element: <UserDetailPage /> },
      ],

    },

    {
      path: "/manager-dashboard",
      element: <ManagerDashboard />,
      children: [
        { path: "dashboard", element: <DashboardOverview /> },
        { path: "staff-manager", element: <StaffManagerView /> },
        { path: "booking-manager", element: <BookingManagerComponent /> },
         { path: "sales-staff-assignment", element: <SalesStaffManagementComponent /> },
        { path: "consulting-staff-assignment", element: <ConsultingStaffAssignmentComponent /> },
        { path: "delivery-staff-assignment", element: <DeliveryStaffAssignment /> },
        { path: "quotes-review", element: <ExtendedQuoteReviewComponent /> },
        { path: "delivery-order-list", element: <DeliveryOrderListComponent /> },
      ],
    },

    { path: "/consulting-staff", element: <ConsultingStaff /> },
    { path: "/sale-staff", element: <SaleStaff /> },
    { path: "/delivery-staff", element: <DeliveryStaff /> },
    { path: "/", element: <ConsultingStaffHome /> },
    { path: "/TourList", element: <TourList /> },
    { path: "/OrderList", element: <OrderList /> },
    { path: "/koi-details", element: <KoiDetails /> },
    { path: "/add-koi", element: <AddKoi /> },
    { path: "/tour-details/:bookingId", element: <TourDetails /> },
    { path: "/", element: <DeliveryStaffHome /> },
    { path: "/DeliveryOrderList", element: <DeliveryOrderList /> },
    { path: "/TrackingOrder/:orderId", element: <TrackingOrder /> },
    { path: "/SaleStaffHome", element: <SaleStaffHome /> },
    { path: "/CustomerRequest", element: <CustomerRequest /> },

    { path: "/createTrip/:id", element: <CreateTrip /> },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
