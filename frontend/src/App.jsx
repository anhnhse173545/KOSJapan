import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Layout from "./components/layout";
import CombinedKoiRequestForm from "./pages/request-form";
import Register from "./pages/register";
import Login from "./pages/login";




function App() {
  const router = createBrowserRouter([
    {
      path: "",
      element: <Layout/>,
      children: [
        {path: "/contact", element: <CombinedKoiRequestForm/>},
        {path: "/register", element: <Register/>},
        {path: "/login", element: <Login/>},
      ],
    },
  ]);
  return (
    <RouterProvider router={router} />
  )
}

export default App