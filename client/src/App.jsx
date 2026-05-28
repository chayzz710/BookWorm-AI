//App.jsx
import React, { useState } from 'react';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Chatbot from './pages/Chatbot.jsx';
import SignUp from './pages/SignUp.jsx';
import Login from './mainpages/Login.jsx';
import Home from './mainpages/Home.jsx';
import ToRead from './pages/ToRead.jsx';
import ReadingHistory from './pages/ReadingHistory.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import MainLayout from './components/MainLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute';
import CurrentlyReading from './pages/CurrentlyReading.jsx';
import SearchResults from './components/SearchResults.jsx';
import Statistics from './pages/Statistics.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Login />} />

        {/* Protected/Main App Layout */}

        <Route element={<MainLayout />}>
          <Route path="/home" element={
            <ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/search" element={
            <ProtectedRoute><SearchResults /></ProtectedRoute>} />
          <Route path="/statistics" element={
            <ProtectedRoute><Statistics /></ProtectedRoute>} />
          <Route path="/toread" element={
            <ProtectedRoute><ToRead /></ProtectedRoute>} />
          <Route path="/current" element={
            <ProtectedRoute><CurrentlyReading /></ProtectedRoute>} />
          <Route path="/history" element={
            <ProtectedRoute><ReadingHistory /></ProtectedRoute>} />
          <Route path="/profilepage" element={
            <ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/chatbot" element={
            <ProtectedRoute><Chatbot /></ProtectedRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
