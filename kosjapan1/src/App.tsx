import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Layout from "./components/layout";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import KoiTourForm from "./pages/contact-us";
import PaymentPage from "./pages/payment";
import KoiPage from "./pages/mykoi";
import KoiPayPage from "./pages/paykoi";
import PaymentDetailsPage from "./pages/detailTrip";
import KoiDetailPage from "./pages/detailFish";
import QuotaDetailsPage from "./pages/payquota";
import RequestPage from "./pages/request-page";
import OnGoingDetails from "./pages/onGoing";



function App() {
  const router = createBrowserRouter([
    {
      path: "",
      element: <Layout/>,
      children: [
        {path: "/", element: <Home/>},
        {path: "/login", element: <Login/>},
        {path: "/register", element: <Register/>},
        {path: "/contact", element: <KoiTourForm/>},
        {path: "/payment", element: <PaymentPage/>},
        {path: "/mykoi", element: <KoiPage/>},
        {path: "/paykoi", element: <KoiPayPage/>},
        {path: "/payment/:id", element: <PaymentDetailsPage/>},
        {path: "/mykoi/:id", element: <KoiDetailPage/>},
        {path: "/quota/:id", element: <QuotaDetailsPage/>},
        {path: "/request/:id", element: <RequestPage/>},
        {path: "/ongoing/:id", element: <OnGoingDetails/>},
      ],
    },
  ]);
  return (
    <RouterProvider router={router} />
  )
}

export default App