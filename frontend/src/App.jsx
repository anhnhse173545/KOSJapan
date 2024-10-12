import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Layout from "./components/layout";
import CombinedKoiRequestForm from "./pages/request-form";
import Register from "./pages/register";
import Login from "./pages/login";
import PaymentPage from "./pages/booking";
import PaymentDetailsPage from "./pages/tripDetail";
import QuotaDetailsPage from "./pages/tripQuota";
import OnGoingPage from "./pages/onGoing";
import HomePage from "./pages/home";





function App() {
  const router = createBrowserRouter([
    {
      path: "",
      element: <Layout/>,
      children: [
        {path: "/", element: <HomePage/>},
        {path: "/contact", element: <CombinedKoiRequestForm/>},
        {path: "/register", element: <Register/>},
        {path: "/login", element: <Login/>},
        {path: "/payment", element: <PaymentPage/>},
        {path: "/payment/:id", element: <PaymentDetailsPage/>},
        {path: "/quota/:id", element: <QuotaDetailsPage/>},
        {path: "/onGoing/:id", element: <OnGoingPage/>},
        
        
      ],
    },
  ]);
  return (
    <RouterProvider router={router} />
  )
}

export default App