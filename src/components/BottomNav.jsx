import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, Users, Video, User, Utensils } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const BottomNav = () => {
  return (
    <div style={{
      position: 'absolute',
      bottom: '15px',
      left: '15px',
      right: '15px',
      backgroundColor: '#7FC3F8',
      borderRadius: '30px',
      height: '65px',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      boxShadow: '0 10px 25px rgba(101,181,246,0.3)',
      zIndex: 1000
    }}>
      <NavLink to="/dashboard" className={({isActive}) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
        <Activity size={24} />
      </NavLink>
      <NavLink to="/chat" className={({isActive}) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
        <Users size={24} />
      </NavLink>
      <NavLink to="/diet" className={({isActive}) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
        <Utensils size={24} />
      </NavLink>
      <NavLink to="/progress" className={({isActive}) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
        <User size={24} />
      </NavLink>
    </div>
  );
};

export default BottomNav;
