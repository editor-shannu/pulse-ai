import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ArrowLeft, Dumbbell, Play, CheckCircle, Lock, Check, Settings, Activity } from 'lucide-react';

const FullWorkoutPlan = () => {
  const { currentPlan, markWorkoutCompleted, workoutProgress, setWorkoutProgress, generatePlan, setCurrentPlan, isAiLoading, aiError } = useAppContext();
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState(1);
  const [view, setView] = useState(currentPlan?.isCalibrated ? 'grid' : 'calibration'); // grid | detail | play | calibration | tuning
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [surveyData, setSurveyData] = useState({
    pain: currentPlan?.pain || '',
    location: currentPlan?.location || 'Gym', 
    hasEquipment: currentPlan?.hasEquipment || 'Yes'
  });

  if (!currentPlan) return null;
  
  const canAccessDay = (day) => {
    if (day !== workoutProgress.currentDay) return false;
    
    // 24 Hour Check (Skip for Day 1)
    if (day > 1 && workoutProgress.lastCompletedTime) {
      const waitTime = Date.now() - workoutProgress.lastCompletedTime;
      const hoursPassed = waitTime / (1000 * 60 * 60);
      return hoursPassed >= 24;
    }
    return true; 
  };

  const getDayStatus = (day) => {
     if (day < workoutProgress.currentDay) return 'completed';
     if (day === workoutProgress.currentDay) {
        return canAccessDay(day) ? 'active' : 'waiting';
     }
     return 'locked';
  };

  const getTimeRemaining = () => {
     if (!workoutProgress.lastCompletedTime) return "0h 0m";
     const remaining = (24 * 60 * 60 * 1000) - (Date.now() - workoutProgress.lastCompletedTime);
     if (remaining <= 0) return "Unlocked";
     const h = Math.floor(remaining / (1000 * 60 * 60));
     const m = Math.floor((remaining / (1000 * 60)) % 60);
     return `${h}h ${m}m left`;
  };

  const handleFinishSession = () => {
    setWorkoutProgress(prev => ({
      currentDay: prev.currentDay + 1,
      lastCompletedTime: Date.now()
    }));
    setView('grid');
    alert("Incredible work! Next day unlocks in 24 hours.");
  };

  if (!currentPlan) return null;

  return (
    <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      
      {/* Calibration Survey View */}
      {view === 'calibration' && (
        <div style={{ maxWidth: '550px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
           <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ backgroundColor: '#1A1B20', width: '54px', height: '54px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                 <Dumbbell size={28} color="#65B5F6" />
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#1A1B20' }}>Pre-Workout Calibration</h2>
              <p style={{ color: '#9E9E9E', fontSize: '14px' }}>Let's ensure your journey is safe and effective.</p>
           </div>

           <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
              <div>
                 <label style={{ fontSize: '11px', fontWeight: '800', color: '#BDBDBD', textTransform: 'uppercase', marginBottom: '10px', display: 'block' }}>Any Current Pain or Injuries?</label>
                 <input 
                   type="text" 
                   placeholder="e.g. Wrist pain, Knee stiffness, None" 
                   value={surveyData.pain}
                   onChange={(e) => setSurveyData({ ...surveyData, pain: e.target.value })}
                   style={{ width: '100%', padding: '16px', borderRadius: '16px', backgroundColor: '#F8F9FB', border: '1px solid #EDEDF2', outline: 'none', color: '#1A1B20' }}
                 />
              </div>

              <div>
                 <label style={{ fontSize: '11px', fontWeight: '800', color: '#BDBDBD', textTransform: 'uppercase', marginBottom: '10px', display: 'block' }}>Primary Training Location</label>
                 <div style={{ display: 'flex', gap: '10px' }}>
                    {['Gym', 'Home'].map(loc => (
                       <button 
                         key={loc}
                         onClick={() => setSurveyData({ ...surveyData, location: loc })}
                         style={{ 
                            flex: 1, padding: '14px', borderRadius: '14px', 
                            backgroundColor: surveyData.location === loc ? '#1A1B20' : '#FFFFFF', 
                            color: surveyData.location === loc ? '#FFFFFF' : '#1A1B20', 
                            border: `1px solid ${surveyData.location === loc ? '#1A1B20' : '#EDEDF2'}`,
                            fontWeight: 'bold', cursor: 'pointer', transition: '0.3s'
                         }}
                       >
                         {loc}
                       </button>
                    ))}
                 </div>
              </div>

              {surveyData.location === 'Home' && (
                 <div>
                    <label style={{ fontSize: '11px', fontWeight: '800', color: '#BDBDBD', textTransform: 'uppercase', marginBottom: '10px', display: 'block' }}>Home Availability</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                       {['With Equipment', 'No Equipment'].map(eq => (
                          <button 
                            key={eq}
                            onClick={() => setSurveyData({ ...surveyData, hasEquipment: eq })}
                            style={{ 
                               flex: 1, padding: '14px', borderRadius: '14px', 
                               backgroundColor: surveyData.hasEquipment === eq ? '#1A1B20' : '#FFFFFF', 
                               color: surveyData.hasEquipment === eq ? '#FFFFFF' : '#1A1B20', 
                               border: `1px solid ${surveyData.hasEquipment === eq ? '#1A1B20' : '#EDEDF2'}`,
                               fontWeight: 'bold', cursor: 'pointer', transition: '0.3s'
                            }}
                          >
                            {eq}
                          </button>
                       ))}
                    </div>
                 </div>
              )}
           </div>

           <button 
             onClick={async () => {
               setIsSyncing(true);
               await generatePlan({ ...surveyData, markCalibrated: true, country: 'India', region: 'Default', budget: 500 });
               setIsSyncing(false);
               setView('grid');
             }}
             disabled={isSyncing}
             style={{ 
                width: '100%', padding: '18px', borderRadius: '18px', border: 'none', 
                backgroundColor: '#1A1B20', color: 'white', fontWeight: '900', fontSize: '16px', 
                cursor: 'pointer', opacity: isSyncing ? 0.6 : 1, transition: '0.3s', marginTop: '10px' 
             }}
           >
             {isSyncing ? 'Calibrating Plan...' : 'Finalize Strategy'}
           </button>
        </div>
      )}

      {/* Immersive Play View */}
      {view === 'play' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#FFFFFF', zIndex: 1000, padding: '20px', display: 'flex', flexDirection: 'column' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
              <button 
                onClick={() => setView('detail')}
                style={{ background: 'none', border: 'none', padding: 0 }}
              >
                <ArrowLeft size={24} color="#1A1B20" />
              </button>
              <div>
                 <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#BDBDBD', textTransform: 'uppercase' }}>Day {selectedDay} Sequence</span>
                 <h2 style={{ fontSize: '20px', fontWeight: '900', margin: 0 }}>{currentPlan.workout[activeExerciseIndex].name}</h2>
              </div>
           </div>

           <div style={{ flex: 1, backgroundColor: '#F8F9FB', borderRadius: '30px', backgroundImage: 'url(https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.7)' }}></div>
              <div style={{ position: 'absolute', bottom: '40px', left: '20px', right: '20px', backgroundColor: '#FFFFFF', padding: '30px', borderRadius: '30px', boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '25px', textAlign: 'center' }}>
                    <div>
                       <span style={{ fontSize: '36px', fontWeight: '900', color: '#1A1B20' }}>{currentPlan.workout[activeExerciseIndex].sets}</span><br/>
                       <span style={{ fontSize: '12px', color: '#9E9E9E', fontWeight: 'bold' }}>SETS</span>
                    </div>
                    <div style={{ width: '1px', backgroundColor: '#F0F0F0' }}></div>
                    <div>
                       <span style={{ fontSize: '36px', fontWeight: '900', color: '#1A1B20' }}>{currentPlan.workout[activeExerciseIndex].reps}</span><br/>
                       <span style={{ fontSize: '12px', color: '#9E9E9E', fontWeight: 'bold' }}>REPS</span>
                    </div>
                 </div>

                 <div style={{ display: 'flex', gap: '15px' }}>
                    <button 
                      disabled={activeExerciseIndex === 0}
                      onClick={() => setActiveExerciseIndex(i => i - 1)}
                      style={{ flex: 1, padding: '16px', borderRadius: '18px', border: '2px solid #F0F0F0', backgroundColor: 'transparent', color: '#1A1B20', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', opacity: activeExerciseIndex === 0 ? 0.3 : 1 }}
                    >
                      Previous
                    </button>
                    <button 
                      onClick={() => {
                        markWorkoutCompleted(currentPlan.workout[activeExerciseIndex].id);
                        if (activeExerciseIndex < currentPlan.workout.length - 1) {
                          setActiveExerciseIndex(i => i + 1);
                        } else {
                          handleFinishSession();
                        }
                      }}
                      style={{ flex: 1, padding: '16px', borderRadius: '18px', border: 'none', backgroundColor: '#1A1B20', color: 'white', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      {activeExerciseIndex < currentPlan.workout.length - 1 ? 'Next Set' : 'Finish Session'}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Header (Hidden during play/calibration for focus) */}
      {(view === 'grid' || view === 'detail') && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
          <button 
            onClick={() => view === 'detail' ? setView('grid') : navigate('/dashboard')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <ArrowLeft size={24} color="#1A1B20" />
          </button>
          <h1 style={{ fontSize: '24px', fontWeight: '900', margin: 0 }}>
            {view === 'grid' ? '30-Day Evolution' : `Day ${selectedDay} Plan`}
          </h1>
        </div>
      )}

      {/* Grid View */}
      {view === 'grid' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
          {Array.from({ length: 30 }).map((_, i) => {
            const dayNum = i + 1;
            const status = getDayStatus(dayNum);
            
            return (
              <div 
                key={i}
                onClick={() => status === 'active' && (setSelectedDay(dayNum), setView('detail'))}
                style={{ 
                  aspectRatio: '1', 
                  backgroundColor: status === 'active' ? '#1A1B20' : '#F5F5F5', 
                  borderRadius: '16px', 
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  fontSize: '15px', fontWeight: '800',
                  color: status === 'active' ? '#FFFFFF' : '#BDBDBD',
                  cursor: status === 'active' ? 'pointer' : 'not-allowed',
                  transition: '0.3s',
                  position: 'relative',
                  opacity: (status === 'locked' || status === 'waiting') ? 0.6 : 1
                }}
              >
                {status === 'completed' && <Check size={16} style={{ position: 'absolute', top: 5, right: 5 }} color="#65B5F6" />}
                {status === 'waiting' && <span style={{ fontSize: '8px', color: '#65B5F6' }}>{getTimeRemaining()}</span>}
                {status === 'locked' || status === 'waiting' ? <Lock size={12} color="#BDBDBD" /> : dayNum}
              </div>
            );
          })}
        </div>
      )}

      {/* Tuning Survey View (On-the-fly setting change) */}
      {view === 'tuning' && (
        <div style={{ maxWidth: '550px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
           <div style={{ textAlign: 'center' }}>
              <div style={{ backgroundColor: '#E3F2FD', width: '54px', height: '54px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                 <Settings size={28} color="#65B5F6" />
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#1A1B20' }}>Reprogram Session</h2>
              <p style={{ color: '#9E9E9E', fontSize: '14px' }}>Adapting today's plan to your new environment.</p>
           </div>

           <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
              <div>
                 <label style={{ fontSize: '11px', fontWeight: '800', color: '#BDBDBD', textTransform: 'uppercase', marginBottom: '10px', display: 'block' }}>Pivot Location</label>
                 <div style={{ display: 'flex', gap: '10px' }}>
                    {['Gym', 'Home'].map(loc => (
                       <button 
                         key={loc}
                         onClick={() => setSurveyData({ ...surveyData, location: loc })}
                         style={{ 
                            flex: 1, padding: '14px', borderRadius: '14px', 
                            backgroundColor: surveyData.location === loc ? '#1A1B20' : '#FFFFFF', 
                            color: surveyData.location === loc ? '#FFFFFF' : '#1A1B20', 
                            border: `1px solid ${surveyData.location === loc ? '#1A1B20' : '#EDEDF2'}`,
                            fontWeight: 'bold', cursor: 'pointer'
                         }}
                       >
                         {loc}
                       </button>
                    ))}
                 </div>
              </div>

              {surveyData.location === 'Home' && (
                 <div>
                    <label style={{ fontSize: '11px', fontWeight: '800', color: '#BDBDBD', textTransform: 'uppercase', marginBottom: '10px', display: 'block' }}>Pivot Availability</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                       {['With Equipment', 'No Equipment'].map(eq => (
                          <button 
                            key={eq}
                            onClick={() => setSurveyData({ ...surveyData, hasEquipment: eq })}
                            style={{ 
                               flex: 1, padding: '14px', borderRadius: '14px', 
                               backgroundColor: surveyData.hasEquipment === eq ? '#1A1B20' : '#FFFFFF', 
                               color: surveyData.hasEquipment === eq ? '#FFFFFF' : '#1A1B20', 
                               border: `1px solid ${surveyData.hasEquipment === eq ? '#1A1B20' : '#EDEDF2'}`,
                               fontWeight: 'bold', cursor: 'pointer'
                            }}
                          >
                            {eq}
                          </button>
                       ))}
                    </div>
                 </div>
              )}
           </div>

           <div style={{ display: 'flex', gap: '15px' }}>
              <button 
                onClick={() => setView('detail')}
                style={{ flex: 1, padding: '18px', borderRadius: '18px', border: '1px solid #EDEDF2', backgroundColor: 'transparent', fontWeight: 'bold' }}
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                   setIsSyncing(true);
                   await generatePlan({ ...surveyData, markCalibrated: true, country: 'India', region: 'Default', budget: 500 });
                   setIsSyncing(false);
                   setView('detail');
                }}
                disabled={isSyncing}
                style={{ flex: 2, padding: '18px', borderRadius: '18px', border: 'none', backgroundColor: '#65B5F6', color: 'white', fontWeight: '900' }}
              >
                {isSyncing ? 'Adapting...' : 'Reprogram Day'}
              </button>
           </div>
        </div>
      )}

      {/* Detail View */}
      {view === 'detail' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', position: 'relative' }}>
          {isSyncing || isAiLoading && (
             <div style={{ position: 'absolute', inset: -10, backgroundColor: 'rgba(255,255,255,0.7)', zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '30px', backdropFilter: 'blur(4px)' }}>
                <Activity className="spin" size={32} color="#65B5F6" />
                {aiError && (
                   <p style={{ marginTop: '10px', color: '#FF5252', fontSize: '12px', fontWeight: 'bold' }}>
                      Error: {aiError}
                   </p>
                )}
             </div>
          )}
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 5px' }}>
             <span style={{ fontSize: '11px', fontWeight: '900', color: '#65B5F6', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {currentPlan.location || 'Standard'} Mode
             </span>
             <span style={{ fontSize: '11px', fontWeight: '900', color: '#BDBDBD' }}>{currentPlan.workout.length} Movements</span>
          </div>

          {currentPlan.workout.map((exercise, index) => (
            <div key={`${exercise.name}-${index}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: '#FFFFFF', borderRadius: '22px', border: '1px solid #F0F4F8', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ width: '54px', height: '54px', backgroundColor: currentPlan.location === 'Home' ? '#E3F2FD' : '#FDF1EA', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {currentPlan.location === 'Home' ? <Activity size={24} color="#65B5F6" /> : <Dumbbell size={24} color="#E8A382" />}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#1A1B20' }}>
                      {exercise.name}
                    </h4>
                  </div>
                  <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#9E9E9E' }}>Set: {exercise.sets} • Rep: {exercise.reps}</p>
                </div>
              </div>
              {exercise.completed && <CheckCircle size={24} color="#65B5F6" />}
            </div>
          ))}

          {/* Controls Bar */}
          <div style={{ position: 'fixed', bottom: '110px', right: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
             {/* Settings Button */}
             <button 
               onClick={() => setView('tuning')}
               style={{ 
                  width: '54px', height: '54px', borderRadius: '15px', 
                  backgroundColor: '#FFFFFF', color: '#1A1B20', 
                  border: '2px solid #F0F0F0', boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer'
               }}
             >
               <Settings size={22} />
             </button>
             
             {/* Main Start Button */}
             <button 
               onClick={() => { setActiveExerciseIndex(0); setView('play'); }}
               style={{ 
                  width: '64px', height: '64px', borderRadius: '20px', 
                  backgroundColor: '#1A1B20', color: 'white', 
                  border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer'
               }}
             >
               <Play size={28} color="#65B5F6" fill="#65B5F6" />
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FullWorkoutPlan;
