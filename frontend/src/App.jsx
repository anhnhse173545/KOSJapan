import {
  createBrowserRouter,
  RouterProvider,
  Routes,
  Route,
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
// import CustomerRequest from "./pages/SaleStaff/CustomerRequest";
import AddKoi from "./pages/ConsultingStaff/AddKoi";
import ConsultingStaffHome from "./pages/ConsultingStaff/ConsultingStaffHome";
import KoiDetails from "./pages/ConsultingStaff/KoiDetails";
import OrderList from "./pages/ConsultingStaff/OrderList"; // Renamed to avoid conflict
import TourDetails from "./pages/ConsultingStaff/TourDetails";
import TourList from "./pages/ConsultingStaff/TourList";

import PaidBooking from "./pages/paidBooking";

import ManagerDashboard from "./pages/Manager/ManagerDashboard";
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
// import ViewTripPlanComponent from "./pages/SaleStaff/pages/ViewTripPlanComponent";
import ConsultingStaffDashboard from "./pages/ConsultingStaff/ConsultingStaffDashboard";
import TripPaymentPage from "./pages/paytrip";
import PaymentTripPage from "./pages/paykoi";
import PaymentTripPageFull from "./pages/paykoifinished";
import FarmCrud from "./pages/Manager/finals/FarmCrud";
import VarietyCrud from "./pages/Manager/finals/VarietyCrud";
import { OrderDetailsComponent } from "./pages/DeliveryStaff/OrderDetails";
import { FarmImageUpload } from "./components/farm-image-upload";
import { KoiFarmViewSearchComponent } from "./pages/Manager/finals/KoiFarmViewSearchComponent";
import { KoiTripViewSearchComponent } from "./pages/Manager/finals/KoiTripViewSearchComponent";
import { HomepageGuest } from "./pages/homeguest";
import BookingHistoryPage from "./pages/history";
import AboutUs from "./pages/aboutUs";
// import { CreateTripForm } from "./pages/SaleStaff/pages/CreateTripForm";
import DeliveryStaffHome from "./pages/DeliveryStaff/DeliveryStaffHome.jsx";
// Global and Library Styles
import "./styles/App.css"; // Main or global CSS file
import AllBookingsPage from "./pages/Manager/finals/AllBookingPage";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="/" element={<HomepageComponent />} />
        <Route path="guest" element={<HomepageGuest />} />
        <Route path="contact" element={<CombinedKoiRequestForm />} />
        <Route path="aboutus" element={<AboutUs />} />

        {/* Customer routes */}
        {/* <Route element={<RequireAuth allowedRoles={[ROLES.Customer]} />}> */}
        <Route path="payment" element={<PaymentPage />} />
        <Route path="request/:id" element={<PaymentDetailsPage />} />
        <Route path="quota/:id" element={<QuotaDetailsPage />} />
        <Route path="onGoing/:id" element={<OnGoingPage />} />
        <Route path="mykoi" element={<KoiPage />} />
        <Route path="mykoi/:id" element={<KoiDetailPage />} />
        <Route path="paidbooking/:id" element={<PaidBooking />} />
        <Route path="koifarmpage" element={<KoiFarmViewSearchComponent />} />
        <Route path="koi-trip" element={<KoiTripViewSearchComponent />} />
        <Route path="userDetail" element={<UserDetailPage />} />
        <Route path="paytrip" element={<TripPaymentPage />} />
        <Route path="paykoi50/:id" element={<PaymentTripPage />} />
        <Route path="paykoi100/:id" element={<PaymentTripPageFull />} />
        <Route path="history" element={<BookingHistoryPage />} />
        {/* </Route> */}
      </Route>
      {/* Manager routes */}
      {/* <Route element={<RequireAuth allowedRoles={[ROLES.Manager]} />}> */}
      <Route path="manager-dashboard" element={<ManagerDashboard />}>
        <Route path="all-booking" element={<AllBookingsPage />} />
        <Route path="dashboard" element={<FarmImageUpload />} />
        <Route path="staff-manager" element={<StaffManagerView />} />
        <Route path="booking-manager" element={<BookingManagerComponent />} />
        <Route
          path="sales-staff-assignment"
          element={<SalesStaffManagementComponent />}
        />
        <Route
          path="consulting-staff-assignment"
          element={<ConsultingStaffAssignmentComponent />}
        />
        <Route
          path="delivery-staff-assignment"
          element={<DeliveryStaffAssignment />}
        />
        <Route
          path="quotes-review"
          element={<ExtendedQuoteReviewComponent />}
        />
        <Route path="farm-control" element={<FarmCrud />} />
        <Route path="variety-control" element={<VarietyCrud />} />
        <Route path="farm-view" element={<KoiFarmViewSearchComponent />} />
        <Route path="trip-view" element={<KoiTripViewSearchComponent />} />
      </Route>
      {/* </Route> */}

      {/* Delivery Staff routes */}
      {/* <Route element={<RequireAuth allowedRoles={[ROLES.DeliveryStaff]} />}> */}
      <Route path="ds-dashboard" element={<DeliveryStaffDashboard />}>
        <Route index element={<DeliveryStaffHome />} />
        <Route path="my-deliveries" element={<DeliveryOrderListComponent />} />
        <Route
          path="my-deliveries/order-details/:orderId"
          element={<OrderDetailsComponent />}
        />
      </Route>
      {/* </Route> */}

      {/* Sales Staff routes */}
      {/* <Route element={<RequireAuth allowedRoles={[ROLES.SalesStaff]} />}> */}
      <Route path="ss-dashboard" element={<SalesStaffDashboard />}>
        <Route path="customer-request" element={<CustomerRequest />} />
      </Route>
      {/* </Route> */}

      {/* Consulting Staff routes */}
      {/* <Route element={<RequireAuth allowedRoles={[ROLES.ConsultingStaff]} />}> */}
      <Route path="cs-dashboard" element={<ConsultingStaffDashboard />}>
        <Route index element={<ConsultingStaffHome />} />
        <Route path="tour-list" element={<TourList />} />
        <Route
          path="tour-list/tour-details/:bookingId"
          element={<TourDetails />}
        />
        <Route path="order-list" element={<OrderList />} />
        <Route path="order-list/add-koi" element={<AddKoi />} />
        <Route path="koi-details" element={<KoiDetails />} />
      </Route>
      {/* </Route> */}

      {/* Catch all */}
      {/* <Route path="*" element={<Missing />} /> */}
    </Routes>
  );
}

export default App;
