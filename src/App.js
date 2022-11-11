import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import PrivateRoute from "./components/PrivateRoute";
import ForgotPassword from "./pages/ForgotPassword";
import CreateListingDoc from "./pages/CreateListingDoc";

import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateListing from "./pages/CreateListing";
import EditListing from "./pages/EditListing";
import Listing from "./pages/Listing";

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/category/:categoryName/:listingId" element={<Listing />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />

          <Route path="create-listing" element={<PrivateRoute/>}>
            <Route path="/create-listing" element={<CreateListing />} />
          </Route>

          <Route path="create-listing-doc" element={<PrivateRoute/>}>
            <Route path="/create-listing-doc" element={<CreateListingDoc />} />
          </Route>

          <Route path="edit-listing" element={<PrivateRoute/>}>
            <Route path="/edit-listing/:listingId" element={<EditListing />} />
          </Route>
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
        </Routes>
      </Router>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default App;