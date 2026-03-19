import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Activity, ChevronRight } from 'lucide-react';

const Onboarding = () => {
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    goal: 'Fat Loss',
    activityLevel: 'Moderate',
    budget: 'Medium'
  });
  
  const { setUserProfile, generatePlan } = useAppContext();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUserProfile(formData);
    generatePlan(formData);
    navigate('/dashboard');
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 18px',
    borderRadius: '16px',
    backgroundColor: '#F9F9FB',
    border: '1px solid #EDEDF2',
    fontSize: '15px',
    color: '#1A1B20',
    outline: 'none',
    transition: '0.3s'
  };

  const labelStyle = {
    fontSize: '11px',
    fontWeight: '800',
    color: '#BDBDBD',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    display: 'block',
    marginBottom: '8px',
    marginLeft: '4px'
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8F9FB', padding: '20px' }}>
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '35px', padding: '40px', width: '100%', maxWidth: '550px', boxShadow: '0 20px 40px rgba(0,0,0,0.04)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ backgroundColor: '#1A1B20', width: '64px', height: '64px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Activity size={32} color="#65B5F6" />
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#1A1B20', marginBottom: '10px' }}>Your Pulse Profile</h1>
          <p style={{ color: '#9E9E9E', fontSize: '15px' }}>Help our AI calibrate your 30-day transformation plan.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={labelStyle}>Age</label>
              <input type="number" name="age" placeholder="24" style={inputStyle} required onChange={handleChange} />
            </div>
            <div>
              <label style={labelStyle}>Weight (kg)</label>
              <input type="number" name="weight" placeholder="70" style={inputStyle} required onChange={handleChange} />
            </div>
          </div>
          
          <div>
            <label style={labelStyle}>Height (cm)</label>
            <input type="number" name="height" placeholder="175" style={inputStyle} required onChange={handleChange} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={labelStyle}>Fitness Goal</label>
              <select name="goal" style={inputStyle} onChange={handleChange}>
                <option value="Fat Loss">Fat Loss</option>
                <option value="Muscle Gain">Muscle Gain</option>
                <option value="Lean Bulk">Lean Bulk</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Activity</label>
              <select name="activityLevel" style={inputStyle} onChange={handleChange}>
                <option value="Sedentary">Sedentary</option>
                <option value="Moderate">Moderate</option>
                <option value="Active">Active</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            style={{ 
              width: '100%', 
              padding: '18px', 
              backgroundColor: '#1A1B20', 
              color: 'white', 
              borderRadius: '18px', 
              border: 'none', 
              fontSize: '16px', 
              fontWeight: 'bold', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              marginTop: '10px',
              transition: '0.3s'
            }}
          >
            Generate My Plan <ChevronRight size={20} color="#65B5F6" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
