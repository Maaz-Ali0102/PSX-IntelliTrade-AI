import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Stocks from './pages/Stocks';
import Portfolio from './pages/Portfolio';
import Analytics from './pages/Analytics';

function ProtectedRoute({ children }) {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const username = localStorage.getItem('username');
    if (!isLoggedIn || !username) {
        return <Navigate to="/" replace />;
    }
    return children;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={
                    <ProtectedRoute><Dashboard /></ProtectedRoute>
                } />
                <Route path="/stocks" element={
                    <ProtectedRoute><Stocks /></ProtectedRoute>
                } />
                <Route path="/portfolio" element={
                    <ProtectedRoute><Portfolio /></ProtectedRoute>
                } />
                <Route path="/analytics" element={
                    <ProtectedRoute><Analytics /></ProtectedRoute>
                } />
            </Routes>
        </BrowserRouter>
    );
}

export default App;