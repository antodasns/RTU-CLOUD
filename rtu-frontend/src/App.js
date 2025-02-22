// App.js

import React from 'react';
import "./aws-config"; 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './page/Layout';
import CompletedListing from './page/CompletedListing';
import FileStatusListingPage from './page/FileStatusListingPage';
import FlowListing from './pagecomponents/FlowListing';
import ForwardedListing from './page/ForwardedListing';
import { UserProvider, useUser } from './page/UserContext';
import LoginPage from './page/LoginPage';


import { AuthProvider, useAuth } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
        <AppRoutes />
    </AuthProvider>
  );
}


function AppRoutes() {
  const Auth = useAuth();
  
  const isLoggedIn = Auth && Auth.userIsAuthenticated();

  console.log(isLoggedIn);

  return (
    <Router>
    {isLoggedIn ? (
      <Layout>
        <Routes>
          <Route path="/home" element={<FileStatusListingPage />} />
          <Route path="/formwarded" element={<ForwardedListing />} />
          <Route path="/completed" element={<CompletedListing />} />
          <Route path="/flow" element={<FlowListing />} />
        </Routes>
      </Layout>
    ) : (
      <Routes>
      <Route path="/" element={<LoginPage />} />
      </Routes>
    )}
  </Router>
  );
}





export default App;
