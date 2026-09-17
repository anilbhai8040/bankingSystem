import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import About from './pages/About';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Login from './pages/Login';
import CreateAccount from './pages/CreateAccount';

import Dashboard from './pages/Dashboard';
import Deposit from './pages/Deposit';
import Withdraw from './pages/Withdraw';
import CheckBalance from './pages/CheckBalance';
import Statements from './pages/Statements';
import FD from './pages/FD';
import GoldLoan from './pages/GoldLoan';
import VirtualCard from './pages/VirtualCard';
import DeleteAccount from './pages/DeleteAccount';
import EmployeeDashboard from './components/EmployeeDashboard';

import './App.css';

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="app-container">
      <Navbar toggleSidebar={toggleSidebar} />
      
      <div className="app-body">
        <Sidebar 
          isOpen={sidebarOpen} 
          toggleSidebar={toggleSidebar} 
          closeSidebar={closeSidebar} 
        />
        
        <main className="main-content">
          <Routes>
            {/* Public Routes (Accessible without login) */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/create-account" element={<CreateAccount />} />

            {/* Protected Routes (Requires successful login) */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/deposit" 
              element={
                <ProtectedRoute>
                  <Deposit />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/withdraw" 
              element={
                <ProtectedRoute>
                  <Withdraw />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/check-balance" 
              element={
                <ProtectedRoute>
                  <CheckBalance />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/statements" 
              element={
                <ProtectedRoute>
                  <Statements />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/fd" 
              element={
                <ProtectedRoute>
                  <FD />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/gold-loan" 
              element={
                <ProtectedRoute>
                  <GoldLoan />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/virtual-card" 
              element={
                <ProtectedRoute>
                  <VirtualCard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/delete-account" 
              element={
                <ProtectedRoute>
                  <DeleteAccount />
                </ProtectedRoute>
              } 
            />

            {/* Employee Portal (Requires Bank Employee or Admin Role) */}
            <Route 
              path="/employee-dashboard" 
              element={
                <ProtectedRoute allowedRoles={['Bank_Employee', 'admin', 'Employee']}>
                  <EmployeeDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
