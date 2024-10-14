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
import KoiPage from "./pages/mykoi";
import KoiDetailPage from "./pages/detailFish";
import KoiPayPage from "./pages/paykoi";





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
        {path: "/mykoi", element: <KoiPage/>},
        {path: "/mykoi/:id", element: <KoiDetailPage/>},
        {path: "/paykoi", element: <KoiPayPage/>},
        
        
      ],
    },
  ]);
  return (
    <RouterProvider router={router} />
  )
}

export default App