import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Guides from './Guides';
import GuideDetail from './GuideDetail';
import Community from './Community';
import Login from './Login';
import AssistantWrapper from './AssistantWrapper';
import HeaderWrapper from './HeaderWrapper';
import { auth } from './firebaseConfig';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <HeaderWrapper user={user} />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/guide/:id" element={<GuideDetail />} />
          <Route path="/community" element={<Community />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        <AssistantWrapper />
      </div>
    </Router>
  );
};

export default App;
