import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Layout from "./components/layout";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import KoiTourForm from "./pages/contact-us";
import PaymentPage from "./pages/payment";
import TaskManagerment from "./pages/TaskManagerment/TaskManagerment";
import KoiPage from "./pages/mykoi";
import KoiPayPage from "./pages/paykoi";
import PaymentDetailsPage from "./pages/detailTrip";
import KoiDetailPage from "./pages/detailFish";



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
        {path: "/taskmanager", element: <TaskManagerment/>},
        {path: "/mykoi", element: <KoiPage/>},
        {path: "/paykoi", element: <KoiPayPage/>},
        {path: "/payment/:id", element: <PaymentDetailsPage/>},
        {path: "/mykoi/:id", element: <KoiDetailPage/>},
      ],
    },
  ]);
  return (
    <RouterProvider router={router} />
  )
}

export default App