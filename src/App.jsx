import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppContext } from './context/AppContext';
import BottomNav from './components/BottomNav';

import Onboarding from './pages/Onboarding';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Diet from './pages/Diet';
import Chat from './pages/Chat';
import Upload from './pages/Upload';
import Progress from './pages/Progress';
import CreateManual from './pages/CreateManual';
import FullPlan from './pages/FullWorkoutPlan';

function App() {
  const { authUser, userProfile } = useAppContext();

  return (
    <div className="app-container">
      <div className="main-content" style={{ paddingBottom: authUser && userProfile ? '100px' : '0' }}>
        <Routes>
          <Route path="/" element={!authUser ? <Landing /> : (userProfile ? <Navigate to="/dashboard" /> : <Navigate to="/onboarding" />)} />
          <Route path="/onboarding" element={authUser && !userProfile ? <Onboarding /> : <Navigate to="/" />} />
          <Route path="/dashboard" element={authUser && userProfile ? <Dashboard /> : <Navigate to="/" />} />
          <Route path="/diet" element={authUser && userProfile ? <Diet /> : <Navigate to="/" />} />
          <Route path="/chat" element={authUser && userProfile ? <Chat /> : <Navigate to="/" />} />
          <Route path="/upload" element={authUser && userProfile ? <Upload /> : <Navigate to="/" />} />
          <Route path="/progress" element={authUser && userProfile ? <Progress /> : <Navigate to="/" />} />
          <Route path="/full-plan" element={authUser && userProfile ? <FullPlan /> : <Navigate to="/" />} />
          <Route path="/create-manual" element={authUser && userProfile ? <CreateManual /> : <Navigate to="/" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      {authUser && userProfile && <BottomNav />}
    </div>
  );
}

export default App;
