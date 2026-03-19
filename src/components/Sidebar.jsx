import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileUp, Utensils, MessagesSquare, LineChart, Activity, LogOut } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Sidebar = () => {
  const { logout } = useAppContext();
  return (
    <div className="sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'space-between' }}>
      <div>
        <div className="logo">
        <Activity size={28} />
        PulseAI
      </div>
      <nav className="nav-links">
        <NavLink to="/dashboard" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>
        <NavLink to="/diet" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <Utensils size={20} />
          Diet Plan
        </NavLink>
        <NavLink to="/chat" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <MessagesSquare size={20} />
          Ask AI
        </NavLink>
        <NavLink to="/upload" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <FileUp size={20} />
          Upload Plan
        </NavLink>
        <NavLink to="/progress" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <LineChart size={20} />
          Progress
        </NavLink>
      </nav>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
        <button onClick={logout} className="nav-link" style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', color: 'var(--danger-color)' }}>
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
