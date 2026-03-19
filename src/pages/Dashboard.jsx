import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { CheckCircle, AlertTriangle, ArrowUpCircle, Flame, Dumbbell, ArrowLeft, Play, ChevronRight, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { userProfile, currentPlan, markWorkoutCompleted, updatePlanIntensity, logout } = useAppContext();
  const navigate = useNavigate();
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(null);
  const [workoutView, setWorkoutView] = useState('summary'); // summary | days | detail
  const [selectedDay, setSelectedDay] = useState(1);

  if (!userProfile) return null;

  if (!currentPlan) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '4px solid #FDF1EA', borderTopColor: '#65B5F6', animation: 'spin 1s linear infinite', marginBottom: '20px' }}></div>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#212121', marginBottom: '10px' }}>Analyzing Profile...</h2>
        <p style={{ color: '#9E9E9E', fontSize: '14px', textAlign: 'center', padding: '0 20px' }}>Our AI is creating your personalized 30-day adaptive fitness plan.</p>
        <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  const completedCount = currentPlan.workout.filter(w=>w.completed).length;
  const totalCount = currentPlan.workout.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100) || 0;

  // Immersive Exercise View
  if (activeExerciseIndex !== null) {
    const exercise = currentPlan.workout[activeExerciseIndex];
    
    const nextExercise = () => {
      if (activeExerciseIndex < currentPlan.workout.length - 1) setActiveExerciseIndex(activeExerciseIndex + 1);
    };
    const prevExercise = () => {
      if (activeExerciseIndex > 0) setActiveExerciseIndex(activeExerciseIndex - 1);
    };

    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#FAFAFA', zIndex: 9999, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button onClick={() => setActiveExerciseIndex(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
            <ArrowLeft size={24} color="#212121" />
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ width: '45px', height: '45px', borderRadius: '12px', backgroundImage: 'url(https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=150)', backgroundSize: 'cover' }}></div>
            <div>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#212121' }}>Exercise {activeExerciseIndex + 1}: {exercise.name}</h2>
              <span style={{ fontSize: '13px', color: '#9E9E9E' }}>02:30 Minutes</span>
            </div>
          </div>
        </div>

        {/* Video Area */}
        <div style={{ flex: 1, backgroundColor: '#EADACA', margin: '10px 20px', borderRadius: '20px', position: 'relative', backgroundImage: 'url(https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
          
          {/* Floating Reps Card */}
          <div style={{ position: 'absolute', bottom: '-30px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#FDF1EA', padding: '20px', borderRadius: '20px', width: '80%', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'baseline' }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#212121', marginRight: '5px' }}>{exercise.sets}</span>
                <span style={{ fontSize: '12px', color: '#757575', fontWeight: 'bold' }}>Sets</span>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#212121', marginRight: '5px' }}>{exercise.reps}</span>
                <span style={{ fontSize: '12px', color: '#757575', fontWeight: 'bold' }}>Reps</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <button 
                onClick={prevExercise}
                disabled={activeExerciseIndex === 0}
                style={{ flex: 1, padding: '12px', backgroundColor: '#65B5F6', color: 'white', border: 'none', borderRadius: '25px', fontWeight: 'bold', opacity: activeExerciseIndex === 0 ? 0.5 : 1, cursor: 'pointer' }}
              >
                Previous
              </button>
              <button 
                onClick={() => {
                   markWorkoutCompleted(exercise.id);
                   nextExercise();
                }}
                style={{ flex: 1, padding: '12px', backgroundColor: '#65B5F6', color: 'white', border: 'none', borderRadius: '25px', fontWeight: 'bold', opacity: activeExerciseIndex === currentPlan.workout.length - 1 ? 0.5 : 1, cursor: 'pointer' }}
              >
                {exercise.completed ? 'Next' : 'Complete'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: '30px' }}>
      
      {/* Top Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <span style={{ fontSize: '18px', fontWeight: '900', color: '#65B5F6' }}>PulseAI</span>

        <button 
          onClick={() => {
            if (window.confirm('Are you sure you want to log out?')) {
               logout();
            }
          }}
          style={{ background: 'none', border: 'none', padding: '0', cursor: 'pointer', color: '#E53935', display: 'flex', alignItems: 'center', gap: '5px' }}
        >
          <LogOut size={20} />
          <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Logout</span>
        </button>
      </div>

      {/* Main Title */}
      <div className="flex justify-between items-center mb-6">
        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '800', fontFamily: 'Merriweather', color: '#1A1A1A' }}>
          Find Your<br/>Workout Class
        </h1>
      </div>

      {/* Workout Progress Card */}
      <div style={{ backgroundColor: '#1A1B20', borderRadius: '20px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
        <div style={{ color: 'white' }}>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '600' }}>Workout Progress !</h3>
          <p style={{ margin: 0, color: '#9E9E9E', fontSize: '13px' }}>{totalCount - completedCount} Exercise left</p>
        </div>
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: `conic-gradient(#FFFFFF ${progressPercent}%, #333 ${progressPercent}%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '50px', height: '50px', backgroundColor: '#1A1B20', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px' }}>
            {progressPercent}%
          </div>
        </div>
      </div>


      {!currentPlan.is30Day && (
        <div style={{ backgroundColor: '#FDF1EA', borderRadius: '30px', padding: '30px', marginBottom: '30px', border: '1px solid #F7DFD4' }} className="metric-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
             <div style={{ backgroundColor: '#E8A382', width: '50px', height: '50px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Flame size={26} color="#FFF" />
             </div>
             <div>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '900' }}>30-Day Expert Plan</h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#757575', fontWeight: 'bold' }}>Scientific progression for results</p>
             </div>
          </div>
          
          <button 
            onClick={() => navigate('/full-plan')}
            style={{ 
               width: '100%', padding: '16px', borderRadius: '16px', border: 'none', 
               backgroundColor: '#1A1B20', color: 'white', fontSize: '14px', 
               fontWeight: '900', cursor: 'pointer', transition: '0.3s' 
            }}
          >
            Calibrate My 30-Day Plan
          </button>
        </div>
      )}

      {/* Workout Plan Section - Now Navigates to Full Plan */}
      <div style={{ marginBottom: '25px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#1A1B20', marginBottom: '15px' }}>
          Workout Plan
        </h2>
        
        <div 
          onClick={() => navigate('/full-plan')}
          style={{ padding: '24px', backgroundColor: '#E3F2FD', borderRadius: '30px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: '0.3s', border: '1px solid #BBDEFB' }}
          className="metric-card"
        >
           <div>
              <span style={{ fontSize: '11px', fontWeight: '800', color: '#65B5F6', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Active Strategy</span>
              <h3 style={{ margin: '8px 0 4px 0', fontSize: '20px', fontWeight: '900', color: '#1A1B20' }}>{currentPlan.title || '30-Day Evolution'}</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#757575', fontWeight: 'bold' }}>Progress: Day 1 of 30</p>
           </div>
           <div style={{ backgroundColor: '#FFFFFF', width: '50px', height: '50px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
              <ChevronRight size={24} color="#65B5F6" />
           </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
