import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
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

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/create-account" element={<CreateAccount />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/deposit" element={<Deposit />} />
              <Route path="/withdraw" element={<Withdraw />} />
              <Route path="/check-balance" element={<CheckBalance />} />
              <Route path="/statements" element={<Statements />} />
              <Route path="/fd" element={<FD />} />
              <Route path="/gold-loan" element={<GoldLoan />} />
              <Route path="/virtual-card" element={<VirtualCard />} />
              <Route path="/delete-account" element={<DeleteAccount />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
