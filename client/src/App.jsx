import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages/Components
import SignUp from "./components/UserUI/SignUp/page";
import SignIn from "./components/UserUI/SignIn/page";
import UpdateProfile from "./components/updateProfile/page";
import Interface from "./components/Interface/page";
import AddFriends from "./components/ManageFriends/page";
import { Toaster } from "sonner";

const App = () => {
  return (
    <Router>
      {/* Global Toaster */}
      <Toaster richColors={true} position="top-right" />

      {/* Route Definitions */}
      <Routes>
        <Route path="/" element={<Interface />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/update-profile" element={<UpdateProfile />} />
        <Route path="/manage-friends" element={<AddFriends />} />
      </Routes>
    </Router>
  );
};

export default App;
