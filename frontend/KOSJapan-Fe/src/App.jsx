import Footer from "./component/Footer/Footer";
import Header from "./component/Header/Header";
import SaleStaff from "./component/SaleStaff/SaleStaff";
import ConsultingStaff from "./component/ConsultingStaff/ConsultingStaff";
import TourList from "./component/ConsultingStaff/TourList";
import { Routes, Route, Link } from "react-router-dom"; // Import Link

function App() {
  return (
    <>
      <Header />

      <nav>
        {/* Navigation Links */}
        <Link to="/">Home</Link>
        {" | "}
        <Link to="/ConsultingStaff">Consulting Staff</Link>
        {" | "}
        <Link to="/TourList">Tour List</Link>
      </nav>

      {/* Define Routes to Render Different Components */}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <h1>Welcome</h1>
              <SaleStaff />
            </>
          }
        />
        <Route path="/ConsultingStaff" element={<ConsultingStaff />} />
        <Route path="/TourList" element={<TourList />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
