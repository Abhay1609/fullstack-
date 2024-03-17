import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';

import PostForm from './components/PostForm';
import Home from './components/home';
import Update from './components/Update';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/create-post" element={<PostForm />} />
        <Route path="/" element={<Home />} />
        <Route path="/update" element={<Update />} />

      </Routes>
    </Router>
  );
}

export default App;
