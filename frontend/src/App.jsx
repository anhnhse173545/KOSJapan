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
import SaleStaff from "./pages/SaleStaff/temp/SaleStaff";
// import CustomerRequest from "./pages/SaleStaff/CustomerRequest";
import AddKoi from "./pages/ConsultingStaff/AddKoi";
import ConsultingStaffHome from "./pages/ConsultingStaff/ConsultingStaffHome";
import KoiDetails from "./pages/ConsultingStaff/KoiDetails";
import OrderList from "./pages/ConsultingStaff/OrderList"; // Renamed to avoid conflict
import TourDetails from "./pages/ConsultingStaff/TourDetails";
import TourList from "./pages/ConsultingStaff/TourList";
import SaleStaffHome from "./pages/SaleStaff/temp/SaleStaffHome";

import PaidBooking from "./pages/paidBooking";
import CreateTrip from "./pages/SaleStaff/temp/ViewTripPlan";
import KoiFarmPage from "./pages/koifarmreview";

import ManagerDashboard from "./pages/Manager/ManagerDashboard";
import DashboardOverview from "./pages/Manager/finals/DashboardOverview";
import StaffManagerView from "./pages/Manager/finals/StaffManagerView";
import BookingManagerComponent from "./pages/Manager/finals/booking-manager";
import { SalesStaffManagementComponent } from "./pages/Manager/finals/SalesStaffAssign";
import { ConsultingStaffAssignmentComponent } from "./pages/Manager/finals/ConsultingStaffAssgn";
import { ExtendedQuoteReviewComponent } from "./pages/Manager/finals/QuoteReview";
import UserDetailPage from "./pages/userDetail";
import { DeliveryStaffDashboard } from "./pages/DeliveryStaff/DeliveryStaffDashboard";
import DeliveryOrderListComponent from "./pages/DeliveryStaff/DeliveryOrderList";
import { DeliveryStaffAssignment } from "./pages/Manager/finals/DeliveryStaffAssign";
import SalesStaffDashboard from "./pages/SaleStaff/SalesStaffDashboard";
import CustomerRequest from "./pages/SaleStaff/pages/CustomerRequest";
import ViewTripPlanComponent from "./pages/SaleStaff/pages/ViewTripPlanComponent";
import ConsultingStaffDashboard from "./pages/ConsultingStaff/ConsultingStaffDashboard";
import TripPaymentPage from "./pages/paytrip";
import PaymentTripPage from "./pages/paykoi";

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
        { path: "/paidbooking/:id", element: <PaidBooking /> },
        { path: "/koifarmpage", element: <KoiFarmPage /> },
        { path: "/userDetail", element: <UserDetailPage /> },
        { path: "/paytrip", element: <TripPaymentPage /> },
        { path: "/paykoi50/:id", element: <PaymentTripPage /> },
      ],
    },

    {
      path: "/manager-dashboard",
      element: <ManagerDashboard />,
      children: [
        { path: "dashboard", element: <DashboardOverview /> },
        { path: "staff-manager", element: <StaffManagerView /> },
        { path: "booking-manager", element: <BookingManagerComponent /> },
        {
          path: "sales-staff-assignment",
          element: <SalesStaffManagementComponent />,
        },
        {
          path: "consulting-staff-assignment",
          element: <ConsultingStaffAssignmentComponent />,
        },
        {
          path: "delivery-staff-assignment",
          element: <DeliveryStaffAssignment />,
        },
        { path: "quotes-review", element: <ExtendedQuoteReviewComponent /> },
      ],
    },

    {
      path: "/manager-dashboard",
      element: <ManagerDashboard />,
      children: [
        { path: "dashboard", element: <DashboardOverview /> },
        { path: "staff-manager", element: <StaffManagerView /> },
        { path: "booking-manager", element: <BookingManagerComponent /> },
        {
          path: "sales-staff-assignment",
          element: <SalesStaffManagementComponent />,
        },
        {
          path: "consulting-staff-assignment",
          element: <ConsultingStaffAssignmentComponent />,
        },
        {
          path: "delivery-staff-assignment",
          element: <DeliveryStaffAssignment />,
        },
        { path: "quotes-review", element: <ExtendedQuoteReviewComponent /> },
      ],
    },
    {
      path: "/ds-dashboard",
      element: <DeliveryStaffDashboard />,
      children: [
        { path: "my-deliveries", element: <DeliveryOrderListComponent /> },
      ],
    },
    {
      path: "/ss-dashboard",
      element: <SalesStaffDashboard />,
      children: [
        { path: "my-tripplans", element: <CustomerRequest /> },
        {
          path: "view-tripplans/:bookingId",
          element: <ViewTripPlanComponent />,
        },
      ],
    },
    {
      path: "/cs-dashboard",
      element: <ConsultingStaffDashboard />,
      children: [
        { path: "", element: <ConsultingStaffHome /> }, // Default home page
        { path: "tour-list", element: <TourList /> },

        { path: "tour-list/tour-details/:bookingId", element: <TourDetails /> }, // Dynamic route

        { path: "order-list", element: <OrderList /> },
        { path: "order-list/add-koi", element: <AddKoi /> },

        { path: "koi-details", element: <KoiDetails /> },
      ],
    },

    // { path: "/consulting-staff", element: <ConsultingStaff /> },
    // { path: "/sale-staff", element: <SaleStaff /> },
    // { path: "/delivery-staff", element: <DeliveryStaff /> },
    // { path: "/", element: <ConsultingStaffHome /> },
    // { path: "/TourList", element: <TourList /> },
    // { path: "/OrderList", element: <OrderList /> },
    // { path: "/koi-details", element: <KoiDetails /> },
    // { path: "/add-koi", element: <AddKoi /> },
    // { path: "/tour-details/:bookingId", element: <TourDetails /> },
    // { path: "/", element: <DeliveryStaffHome /> },
    // { path: "/DeliveryOrderList", element: <DeliveryOrderList /> },
    // { path: "/TrackingOrder/:orderId", element: <TrackingOrder /> },
    // { path: "/SaleStaffHome", element: <SaleStaffHome /> },
    // { path: "/CustomerRequest", element: <CustomerRequest /> },

    // { path: "/createTrip/:id", element: <CreateTrip /> },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
