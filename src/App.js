import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import PrivateRoute from "./components/PrivateRoute";
import ForgotPassword from "./pages/ForgotPassword";

import CreateListingDoc from "./pages/doc/CreateListingDoc";
import ListingDoc from "./pages/doc/ListingDoc";
import ProfileDoc from "./pages/doc/ProfileDoc";
import EditListingDoc from "./pages/doc/EditListingDoc";

import ProfileTest from "./pages/tester/ProfileTest";
import ListingTest from "./pages/tester/ListingTest";
import EditListingTest from "./pages/tester/EditListingTest";
import CreateListingTest from "./pages/tester/CreateListingTest";

import ProfileDev from "./pages/dev/ProfileDev";
import CreateListingDev from "./pages/dev/CreateListingDev";
import EditListingDev from "./pages/dev/EditListingDev"
import ListingDev from "./pages/dev/ListingDev";

import ProfileAdmin from "./pages/admin/ProfileAdmin";
import CreateListing from "./pages/admin/CreateListing";
import EditListing from "./pages/admin/EditListing";
import Listing from "./pages/admin/Listing";


import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/view" element={<Home/>}/>
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
            <Route path="/profile-test" element={<ProfileTest />} />
          </Route> 
          <Route path="profile-doc" element={<PrivateRoute/>}>
            <Route path="/profile-doc" element={<ProfileDoc />} />
          </Route>


          <Route path="/admin/:listingId" element={<Listing/>} />
          <Route path="/dev/:listingId" element={<ListingDev/>}/>
          <Route path="/test/:listingId" element={<ListingTest/>}/>
          <Route path="/doc/:listingId" element={<ListingDoc/>}/>
    
          
          
      
          <Route path="edit-listing" element={<PrivateRoute/>}>
            <Route path="/edit-listing/:listingId" element={<EditListing />} />
          </Route>
          <Route path="edit-listing-doc" element={<PrivateRoute/>}>
            <Route path="/edit-listing-doc/:listingId" element={<EditListingDoc />} />
          </Route>
          <Route path="edit-listing-test" element={<PrivateRoute/>}>
            <Route path="/edit-listing-test/:listingId" element={<EditListingTest />} />
          </Route>
          <Route path="edit-listing-dev" element={<PrivateRoute/>}>
            <Route path="/edit-listing-dev/:listingId" element={<EditListingDev />} />
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