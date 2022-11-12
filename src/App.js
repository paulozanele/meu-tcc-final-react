import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import PrivateRoute from "./components/PrivateRoute";
import ForgotPassword from "./pages/ForgotPassword";

import CreateListingDoc from "./pages/CreateListingDoc";
import ListingDoc from "./pages/ListingDoc";
import ProfileDoc from "./pages/ProfileDoc";
import EditListingDoc from "./pages/EditListingDoc";
import ListingDev from "./pages/ListingDev";


import ProfileTestador from "./pages/ProfileTestador";
import ListingTest from "./pages/ListingTest";
import EditListingTest from "./pages/EditListingTest";
import CreateListingTest from "./pages/CreateListingTest";

import ProfileDev from "./pages/ProfileDev";
import CreateListingDev from "./pages/CreateListingDev";



import ProfileAdmin from "./pages/ProfileAdmin";
import CreateListing from "./pages/CreateListing";
import EditListing from "./pages/EditListing";
import Listing from "./pages/Listing";

import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />    
          <Route path="/forgot-password" element={<ForgotPassword />} /> 


          <Route path="create-listing" element={<PrivateRoute/>}>
            <Route path="/create-listing" element={<CreateListing />} />
          </Route>
          <Route path="create-listing-test" element={<PrivateRoute/>}>
            <Route path="/create-listing-test" element={<CreateListingTest />} />
          </Route>
          <Route path="create-listing-dev" element={<PrivateRoute/>}>
            <Route path="/create-listing-dev" element={<CreateListingDev />} />
          </Route>
          <Route path="create-listing-doc" element={<PrivateRoute/>}>
            <Route path="/create-listing-doc" element={<CreateListingDoc />} />
          </Route>
          


          <Route path="profile-dev" element={<PrivateRoute/>}>
            <Route path="/profile-dev" element={<ProfileDev/>} />
          </Route>
          <Route path="profile-admin" element={<PrivateRoute/>}>
            <Route path="/profile-admin" element={<ProfileAdmin />} />
          </Route>
          <Route path="profile-test" element={<PrivateRoute/>}>
            <Route path="/profile-test" element={<ProfileTestador />} />
          </Route> 
          <Route path="profile-doc" element={<PrivateRoute/>}>
            <Route path="/profile-doc" element={<ProfileDoc />} />
          </Route>

          <Route path="/category/:categoryName/:listingId" element={<ListingTest />} />
          <Route path="/category/:categoryName/:listingId" element={<ListingDoc />} />
          <Route path="/category/:categoryName/:listingId" element={<Listing />} />
          


          
          <Route path="edit-listing-test" element={<PrivateRoute/>}>
            <Route path="/edit-listing-test/:listingId" element={<EditListingTest />} />
          </Route>  
        
          <Route path="edit-listing" element={<PrivateRoute/>}>
            <Route path="/edit-listing/:listingId" element={<EditListing />} />
          </Route>
          <Route path="edit-listing-doc" element={<PrivateRoute/>}>
            <Route path="/edit-listing-doc/:listingId" element={<EditListingDoc />} />
          </Route>  
  
          
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