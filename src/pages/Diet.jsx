import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Camera, Check, Droplets } from 'lucide-react';

const Diet = () => {
  const { currentPlan, userProfile, generatePlan } = useAppContext();
  const navigate = useNavigate();

  // Generate last 5 days
  const today = new Date("2026-03-20");
  const days = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (4 - i));
    return {
      name: d.toLocaleDateString('en-US', { weekday: 'short' }),
      num: d.getDate(),
      full: d.toISOString().split('T')[0],
      active: i === 4
    };
  });

  const [selectedDate, setSelectedDate] = useState(days[4].full);
  const [history, setHistory] = useState({
    [days[4].full]: { meals: [], water: 0 },
    [days[3].full]: { meals: ['breakfast', 'lunch'], water: 4 } // Mock history for yesterday
  });

  const currentDayLog = history[selectedDate] || { meals: [], water: 0 };

  const isWeightLoss = userProfile?.goal?.toLowerCase().includes('loss') || userProfile?.goal?.toLowerCase().includes('lean');
  const targetCalories = isWeightLoss ? 1800 : 3200;
  
  // Dynamic calories for current selected day
  const consumedCalories = Object.entries(currentPlan?.diet || {}).reduce((total, [meal, details]) => {
     if (currentDayLog.meals.includes(meal)) {
        return total + (details.cals || 400);
     }
     return total;
  }, 0);

  const [dietConfig, setDietConfig] = useState(userProfile?.dietConfig || null);
  const [formData, setFormData] = useState({ goal: userProfile?.goal || '', budget: '', country: '', region: '' });
  const [isSyncing, setIsSyncing] = useState(false);

  const toggleMealLog = (mealKey) => {
    setHistory(prev => ({
      ...prev,
      [selectedDate]: {
        ...currentDayLog,
        meals: currentDayLog.meals.includes(mealKey) ? 
               currentDayLog.meals.filter(m => m !== mealKey) : 
               [...currentDayLog.meals, mealKey]
      }
    }));
  };

  const addWater = () => {
    setHistory(prev => ({
      ...prev,
      [selectedDate]: {
        ...currentDayLog,
        water: Math.min(currentDayLog.water + 1, 10)
      }
    }));
  };
  const handleDietSubmit = async () => {
    if (!formData.budget || !formData.country || !formData.region) {
      alert("Please specify your budget and location to personalize your staples.");
      return;
    }
    setIsSyncing(true);
    await generatePlan(formData);
    setDietConfig(formData);
    setIsSyncing(false);
  };

  if (!currentPlan || !userProfile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '4px solid #FDF1EA', borderTopColor: '#E89B77', animation: 'spin 1s linear infinite', marginBottom: '20px' }}></div>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#212121', marginBottom: '10px' }}>Analyzing Nutrition...</h2>
        <p style={{ color: '#9E9E9E', fontSize: '14px', textAlign: 'center', padding: '0 20px' }}>Syncing with your {userProfile?.goal || 'fitness'} plan to calculate optimal macros.</p>
        <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (isSyncing) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '4px solid #FDF1EA', borderTopColor: '#65B5F6', animation: 'spin 1s linear infinite', marginBottom: '20px' }}></div>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#212121', marginBottom: '10px' }}>Mapping Local Staples...</h2>
        <p style={{ color: '#9E9E9E', fontSize: '14px', textAlign: 'center', padding: '0 20px' }}>Calculating nutritional macros based on {formData.region}, {formData.country} markets.</p>
        <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: '30px' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', marginTop: '10px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', padding: '0', cursor: 'pointer' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#212121" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#65B5F6', textTransform: 'uppercase', letterSpacing: '1px' }}>Current Focus</span>
          <div style={{ fontSize: '16px', fontWeight: '900', color: '#212121' }}>{dietConfig?.goal || userProfile.goal}</div>
        </div>
        <button style={{ background: 'none', border: 'none', padding: '0', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '3px', alignItems: 'center' }}>
          <div style={{ width: '4px', height: '4px', backgroundColor: '#212121', borderRadius: '50%' }}></div>
          <div style={{ width: '4px', height: '4px', backgroundColor: '#212121', borderRadius: '50%' }}></div>
          <div style={{ width: '4px', height: '4px', backgroundColor: '#212121', borderRadius: '50%' }}></div>
        </button>
      </div>

      {/* Horizontal Calendar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        {days.map((d, i) => (
          <div 
            key={i} 
            onClick={() => setSelectedDate(d.full)}
            style={{ 
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              width: '55px', height: '70px', borderRadius: '15px', 
              backgroundColor: selectedDate === d.full ? '#65B5F6' : '#F5F5F5',
              color: selectedDate === d.full ? '#FFFFFF' : '#9E9E9E',
              boxShadow: selectedDate === d.full ? '0 4px 10px rgba(101,181,246,0.3)' : 'none',
              cursor: 'pointer'
            }}
          >
            <span style={{ fontSize: '13px', marginBottom: '5px' }}>{d.name}</span>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: selectedDate === d.full ? '#FFFFFF' : '#212121' }}>{d.num}</span>
          </div>
        ))}
      </div>

      {/* Food Summary Title */}
      <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '5px', color: '#212121' }}>Food Summary</h2>
      <p style={{ fontSize: '12px', color: '#9E9E9E', marginBottom: '15px' }}>Tailored for {isWeightLoss ? 'Caloric Deficit' : 'Anabolic Surplus'}</p>

      {/* Summary Card */}
      <div style={{ backgroundColor: '#1A1B20', borderRadius: '20px', padding: '20px', marginBottom: '20px', color: 'white', position: 'relative', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h3 style={{ margin: '0', fontSize: '22px', fontWeight: 'bold' }}>{consumedCalories} kCal</h3>
            <p style={{ margin: '5px 0 0 0', color: '#9E9E9E', fontSize: '12px' }}>Consumed</p>
          </div>
          
          <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: `conic-gradient(#FFFFFF ${Math.round((consumedCalories/targetCalories)*100)}%, #333 0%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '74px', height: '74px', backgroundColor: '#1A1B20', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold' }}>
              {Math.round((consumedCalories/targetCalories)*100)}%
            </div>
          </div>
          
          <div style={{ textAlign: 'right' }}>
            <h3 style={{ margin: '0', fontSize: '22px', fontWeight: 'bold' }}>{targetCalories - consumedCalories} kCal</h3>
            <p style={{ margin: '5px 0 0 0', color: '#9E9E9E', fontSize: '12px' }}>Remaining</p>
          </div>
        </div>

        {/* Macros */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #333', paddingTop: '15px', fontSize: '12px', color: '#9E9E9E' }}>
          <span>Protein: {isWeightLoss ? '110/140g' : '180/210g'}</span>
          <span>Carbs: {isWeightLoss ? '120/150g' : '350/400g'}</span>
          <span>Fats: {isWeightLoss ? '40/60g' : '70/90g'}</span>
        </div>
      </div>

      {/* Water Tracking Section */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
        <button 
          onClick={addWater}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#FFFFFF', border: '1px solid #E3F2FD', padding: '10px 15px', borderRadius: '15px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}
        >
          <Droplets size={16} color="#65B5F6" />
          <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#1A1B20' }}>Water (1L)</span>
        </button>

        <div style={{ backgroundColor: '#EADACA', borderRadius: '20px', padding: '15px 20px', display: 'flex', alignItems: 'center', gap: '20px', width: '200px' }}>
          <div>
            <span style={{ display: 'block', fontSize: '14px', color: '#795548', fontWeight: '600' }}>Daily Goal</span>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFFFFF' }}>{currentDayLog.water}/5</span>
            <span style={{ fontSize: '12px', color: '#795548', marginLeft: '5px' }}>liters</span>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '4px solid #FFFFFF', borderTopColor: 'transparent', transform: `rotate(${currentDayLog.water * 45}deg)`, transition: '0.5s', opacity: 0.8 }}></div>
        </div>
      </div>

      {/* Diet Onboarding or Daily Food Section */}
      <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '15px', color: '#212121' }}>Daily Food (Est: ₹{currentPlan.totalCost})</h2>
      
      {!dietConfig ? (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '25px', marginBottom: '20px', border: '1px solid #E0E0E0', boxShadow: '0 5px 15px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '15px', color: '#1A1B20' }}>Personalize Daily Meals</h3>
          <p style={{ fontSize: '12px', color: '#9E9E9E', marginBottom: '20px' }}>Tell us your region and budget so we can suggest your local staple foods.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
               <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#BDBDBD', display: 'block', marginBottom: '5px' }}>NUTRITIONAL GOAL</label>
               <select value={formData.goal} onChange={(e) => setFormData({...formData, goal: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', backgroundColor: '#F9F9FB', border: 'none', outline: 'none' }}>
                 <option>Muscle Gain</option>
                 <option>Fat Loss</option>
               </select>
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
               <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#BDBDBD', display: 'block', marginBottom: '5px' }}>COUNTRY</label>
                  <input placeholder="e.g. India" value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', backgroundColor: '#F9F9FB', border: 'none', outline: 'none' }} />
               </div>
               <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#BDBDBD', display: 'block', marginBottom: '5px' }}>REGION</label>
                  <input placeholder="e.g. Kerala" value={formData.region} onChange={(e) => setFormData({...formData, region: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', backgroundColor: '#F9F9FB', border: 'none', outline: 'none' }} />
               </div>
            </div>

            <div>
               <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#BDBDBD', display: 'block', marginBottom: '5px' }}>DAILY BUDGET (₹)</label>
               <input type="number" placeholder="e.g. 500" value={formData.budget} onChange={(e) => setFormData({...formData, budget: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', backgroundColor: '#F9F9FB', border: 'none', outline: 'none' }} />
            </div>

            <button onClick={handleDietSubmit} style={{ width: '100%', padding: '15px', backgroundColor: '#1A1B20', color: 'white', borderRadius: '12px', border: 'none', fontWeight: 'bold', marginTop: '10px', cursor: 'pointer' }}>Generate Local Plan</button>
          </div>
        </div>
      ) : (
        <div style={{ backgroundColor: '#E3F2FD', borderRadius: '20px', padding: '20px', marginBottom: '20px' }}>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'nowrap',
            gap: '15px', 
            overflowX: 'scroll', 
            width: '100%',
            WebkitOverflowScrolling: 'touch',
            paddingBottom: '20px',
            scrollSnapType: 'x mandatory'
          }}>
            {Object.entries(currentPlan.diet).map(([meal, details]) => (
              <div key={meal} style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '260px', scrollSnapAlign: 'start', backgroundColor: '#FFFFFF', padding: '15px', borderRadius: '25px', boxShadow: '0 8px 15px rgba(0,0,0,0.04)', border: '1px solid #F0F4F8' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ height: '110px', borderRadius: '15px', backgroundColor: '#F5F5F5', backgroundImage: `url(${details.img || 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=300'})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                  <div style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: 'rgba(255,255,255,0.9)', padding: '4px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: '800', color: '#1A1B20' }}>
                    {details.cals || '400'} kcal
                  </div>
                </div>
                
                <div>
                  <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#212121', textTransform: 'capitalize', display: 'flex', justifyContent: 'space-between' }}>
                    {meal} <span style={{ color: '#65B5F6', fontSize: '12px' }}>₹{details.cost}</span>
                  </h3>
                  <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#757575', lineHeight: '1.2' }}>{details.item}</p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px' }}>
                   <div style={{ fontSize: '11px', color: '#BDBDBD' }}>Prot: <strong>{details.protein || '15g'}</strong></div>
                   <button 
                     onClick={() => toggleMealLog(meal)}
                     style={{ 
                       backgroundColor: currentDayLog.meals.includes(meal) ? '#65B5F6' : '#F5F5F5', 
                       border: 'none', 
                       width: '32px', height: '32px', 
                       borderRadius: '10px', 
                       display: 'flex', alignItems: 'center', justifyContent: 'center',
                       cursor: 'pointer',
                       transition: '0.3s'
                     }}
                   >
                     <Check size={18} color={currentDayLog.meals.includes(meal) ? '#FFF' : '#BDBDBD'} />
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default Diet;
