import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowRight, Edit3, FileText, PenTool } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Progress = () => {
  const navigate = useNavigate();
  const { savedPlans, setSavedPlans, setCurrentPlan } = useAppContext();
  const [activeTab, setActiveTab] = useState('All');
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [previewPlan, setPreviewPlan] = useState(null);

  const filteredPlans = savedPlans.filter(plan => activeTab === 'All' || plan.category === activeTab);

  const handleSelectPlan = (plan) => {
    setCurrentPlan(plan.planData);
    setPreviewPlan(null);
    alert(`Active Workout Updated to: ${plan.title}`);
    navigate('/dashboard');
  };

  const handleRename = (e, id, oldTitle) => {
    e.stopPropagation();
    const newTitle = prompt('Rename Workout Plan:', oldTitle);
    if (newTitle && newTitle.trim()) {
      setSavedPlans(prev => prev.map(p => p.id === id ? { ...p, title: newTitle } : p));
    }
  };

  return (
    <div style={{ paddingBottom: '30px', position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px', color: '#212121' }}>Workout Plans</h1>
      
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        {['All', 'Upper Body', 'Lower Body'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{ 
              padding: '8px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '13px', 
              backgroundColor: activeTab === tab ? (tab === 'Upper Body' ? '#F6E0D9' : '#D9F0FF') : '#F5F5F5', 
              color: activeTab === tab ? (tab === 'Upper Body' ? '#E89B77' : '#65B5F6') : '#9E9E9E', 
              cursor: 'pointer' 
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Plan List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, overflowY: 'auto', paddingBottom: '100px' }} className="hide-scroll">
        {filteredPlans.map((plan) => (
          <div key={plan.id} onClick={() => setPreviewPlan(plan)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '15px', backgroundColor: '#FFF', borderRadius: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', border: '1px solid #F5F5F5' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ width: '50px', height: '50px', backgroundColor: '#F6E0D9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Edit3 size={18} color="#E89B77" onClick={(e) => handleRename(e, plan.id, plan.title)} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: '#212121' }}>{plan.title}</h3>
                <span style={{ fontSize: '12px', color: '#BDBDBD' }}>{plan.category} • {plan.time}</span>
              </div>
            </div>
            <ArrowRight size={20} color="#BDBDBD" />
          </div>
        ))}

        {filteredPlans.length === 0 && (
          <p style={{ textAlign: 'center', color: '#9E9E9E', marginTop: '40px' }}>No plans found in this category.</p>
        )}
      </div>

      {/* Plan Details Preview Modal */}
      {previewPlan && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 10000, display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ backgroundColor: 'white', width: '100%', borderTopLeftRadius: '30px', borderTopRightRadius: '30px', padding: '30px', maxHeight: '80%', display: 'flex', flexDirection: 'column', animation: 'slideUp 0.3s ease-out' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800' }}>{previewPlan.title}</h2>
              <button onClick={() => setPreviewPlan(null)} style={{ background: '#F5F5F5', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&times;</button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px' }} className="hide-scroll">
               <h4 style={{ color: '#9E9E9E', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px' }}>Exercises ({previewPlan.planData.workout.length})</h4>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                 {previewPlan.planData.workout.map((ex, i) => (
                   <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                     <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#65B5F6' }}></div>
                     <div style={{ flex: 1 }}>
                       <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#212121' }}>{ex.name}</div>
                       <div style={{ fontSize: '12px', color: '#9E9E9E' }}>{ex.sets} sets x {ex.reps} reps</div>
                     </div>
                   </div>
                 ))}
               </div>

               <h4 style={{ color: '#9E9E9E', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '25px', marginBottom: '15px' }}>Diet Preview</h4>
               <div style={{ backgroundColor: '#FDF1EA', padding: '15px', borderRadius: '15px' }}>
                 <p style={{ margin: 0, fontSize: '14px', color: '#212121' }}><strong>Breakfast:</strong> {previewPlan.planData.diet.breakfast.item}</p>
                 <p style={{ margin: '5px 0 0', fontSize: '14px', color: '#212121' }}><strong>Lunch:</strong> {previewPlan.planData.diet.lunch.item}</p>
                 <p style={{ margin: '5px 0 0', fontSize: '14px', color: '#212121' }}><strong>Dinner:</strong> {previewPlan.planData.diet.dinner.item}</p>
               </div>
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <button 
                onClick={() => setPreviewPlan(null)}
                style={{ flex: 1, padding: '15px', backgroundColor: '#F5F5F5', color: '#212121', border: 'none', borderRadius: '15px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}
              >
                Back
              </button>
              <button 
                onClick={() => handleSelectPlan(previewPlan)}
                style={{ flex: 2, padding: '15px', backgroundColor: '#1A1B20', color: 'white', border: 'none', borderRadius: '15px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
              >
                Assign as Main
              </button>
            </div>
          </div>
          <style>{`
            @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
          `}</style>
        </div>
      )}

      {/* FAB Overlay Menu */}
      {showAddMenu && (
        <div style={{ position: 'fixed', bottom: '160px', right: '25px', display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'flex-end', zIndex: 101 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ backgroundColor: 'white', padding: '5px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>Create Manually</span>
            <button onClick={() => { setShowAddMenu(false); navigate('/create-manual'); }} style={{ width: '45px', height: '45px', backgroundColor: '#65B5F6', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.2)', cursor: 'pointer' }}>
              <PenTool size={20} />
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ backgroundColor: 'white', padding: '5px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>Upload PDF (AI)</span>
            <button onClick={() => { setShowAddMenu(false); navigate('/upload'); }} style={{ width: '45px', height: '45px', backgroundColor: '#E89B77', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.2)', cursor: 'pointer' }}>
              <FileText size={20} />
            </button>
          </div>
        </div>
      )}

      {/* FAB */}
      <button onClick={() => setShowAddMenu(!showAddMenu)} style={{ position: 'fixed', bottom: '95px', right: '25px', width: '50px', height: '50px', backgroundColor: '#1A1B20', color: 'white', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', boxShadow: '0 8px 15px rgba(0,0,0,0.2)', cursor: 'pointer', zIndex: 102, transition: 'transform 0.3s', transform: showAddMenu ? 'rotate(45deg)' : 'rotate(0deg)' }}>
        <Plus size={24} />
      </button>

    </div>
  );
};

export default Progress;
