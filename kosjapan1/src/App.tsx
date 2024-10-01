import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Layout from "./components/layout";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import KoiTourForm from "./pages/contact-us";
import PaymentPage from "./pages/payment";
import TaskManagerment from "./pages/TaskManagerment/TaskManagerment";


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
      ],
    },
  ]);
  return (
    <RouterProvider router={router} />
  )
}

export default App