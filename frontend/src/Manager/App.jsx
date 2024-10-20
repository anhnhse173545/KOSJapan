import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Layout from "../../components/layout";
import CombinedKoiRequestForm from "../request-form";
import Register from "../register";
import Login from "../login";
import PaymentPage from "../booking";
import PaymentDetailsPage from "../tripDetail";
import QuotaDetailsPage from "../tripQuota";




function App() {
  const router = createBrowserRouter([
    {
      path: "",
      element: <Layout/>,
      children: [
        {path: "/contact", element: <CombinedKoiRequestForm/>},
        {path: "/register", element: <Register/>},
        {path: "/login", element: <Login/>},
        {path: "/payment", element: <PaymentPage/>},
        {path: "/payment/:id", element: <PaymentDetailsPage/>},
        {path: "/quota/:id", element: <QuotaDetailsPage/>},
      ],
    },
  ]);
  return (
    <RouterProvider router={router} />
  )
}

export default App