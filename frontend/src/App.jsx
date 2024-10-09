import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Layout from "./components/layout";
import CombinedKoiRequestForm from "./pages/request-form";




function App() {
  const router = createBrowserRouter([
    {
      path: "",
      element: <Layout/>,
      children: [
        {path: "/contact", element: <CombinedKoiRequestForm/>},
      ],
    },
  ]);
  return (
    <RouterProvider router={router} />
  )
}

export default App