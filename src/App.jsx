import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './components/HomePage';
import { BlogPage } from './components/BlogPage';
import { BlogAdmin } from './components/BlogAdmin';
import { BlogPost } from './components/BlogPost';
import { CreateAdmin } from './components/CreateAdmin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/blog/admin" element={<BlogAdmin />} />
        <Route path="/blog/admin/create" element={<CreateAdmin />} />
      </Routes>
    </Router>
  );
}

export default App;