import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NavBar from './components/NavBar';
import Footer from "./components/Footer"
import AuthPage from './pages/AuthPage';
function App() {

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />}/>
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
