import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { useAppContext } from '../context/AppContext';
import { Dumbbell, Flame, Trophy, Star, Activity } from 'lucide-react';

const Landing = () => {
  const { setAuthUser } = useAppContext();
  const navigate = useNavigate();

  const handleGetStarted = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setAuthUser(result.user);
      navigate('/onboarding');
    } catch (error) {
      console.error("Error signing in with Google: ", error);
      // Fallback for development if Firebase fails
      setAuthUser({ displayName: "Athlete" });
      navigate('/onboarding');
    }
  };

  return (
    <div style={{ 
      position: 'relative', height: '100vh', backgroundColor: '#0A0B0E', overflow: 'hidden', color: '#FFFFFF',
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '40px'
    }}>
      {/* Background Hero Image */}
      <div style={{ 
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1600)',
        backgroundSize: 'cover', backgroundPosition: 'center', transition: '1s'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0A0B0E 0%, rgba(10,11,14,0.4) 40%, transparent 100%)' }}></div>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at top right, rgba(101,181,246,0.1) 0%, transparent 60%)' }}></div>
      </div>

      {/* Content Layer */}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '600px', width: '100%', animation: 'fadeIn 1s ease-out' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
           <div style={{ width: '32px', height: '32px', backgroundColor: '#65B5F6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={18} color="#0A0B0E" />
           </div>
           <span style={{ fontWeight: '900', letterSpacing: '2px', fontSize: '14px', textTransform: 'uppercase' }}>Pulse<span style={{ color: '#65B5F6' }}>AI</span></span>
        </div>

        <h1 style={{ fontSize: '48px', fontWeight: '950', lineHeight: '1.1', marginBottom: '15px' }}>
          Evolution starts <br/>with a <span style={{ color: '#65B5F6' }}>Pulse.</span>
        </h1>
        
        <p style={{ fontSize: '16px', color: '#9E9EA4', lineHeight: '1.6', marginBottom: '40px', maxWidth: '400px' }}>
          Your elite adaptive fitness companion. Tailored plans, real-time AI guidance, and 30-day mastery for athletes of every level.
        </p>

        {/* Stats Row */}
        <div style={{ display: 'flex', gap: '30px', marginBottom: '40px' }}>
           <div>
              <h4 style={{ margin: 0, fontSize: '20px', fontWeight: '900' }}>50K+</h4>
              <p style={{ margin: 0, fontSize: '11px', color: '#65B5F6', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Global Athletes</p>
           </div>
           <div style={{ width: '1px', backgroundColor: '#2D2E35' }}></div>
           <div>
              <h4 style={{ margin: 0, fontSize: '20px', fontWeight: '900' }}>4.9/5</h4>
              <div style={{ display: 'flex', gap: '2px', marginTop: '4px' }}>
                 {[1,2,3,4,5].map(i => <Star key={i} size={10} fill="#65B5F6" color="#65B5F6" />)}
              </div>
           </div>
        </div>

        <button 
          onClick={handleGetStarted}
          style={{
            backgroundColor: '#65B5F6', color: '#0A0B0E', border: 'none', borderRadius: '20px',
            padding: '24px 40px', fontSize: '18px', fontWeight: '900', width: '100%',
            cursor: 'pointer', boxShadow: '0 20px 40px rgba(101,181,246,0.25)',
            transition: '0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 25px 50px rgba(101,181,246,0.4)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(101,181,246,0.25)';
          }}
        >
          Begin Transformation
          <Trophy size={20} />
        </button>

        <p style={{ textAlign: 'center', fontSize: '12px', color: '#52525B', marginTop: '20px', fontWeight: 'bold' }}>
           Free for first 30 days • Cancel anytime
        </p>
      </div>

      {/* Decorative Elements */}
      <div style={{ position: 'absolute', top: '10%', right: '-10%', width: '300px', height: '300px', backgroundColor: '#65B5F6', filter: 'blur(150px)', opacity: 0.1, pointerEvents: 'none' }}></div>
    </div>
  );
};

export default Landing;
