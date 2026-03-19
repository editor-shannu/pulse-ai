import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';

const CreateManual = () => {
  const navigate = useNavigate();
  const { setSavedPlans } = useAppContext();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('All');
  const [exercises, setExercises] = useState([
    { id: 1, name: '', sets: '', reps: '' }
  ]);

  const addExercise = () => {
    setExercises([...exercises, { id: Date.now(), name: '', sets: '', reps: '' }]);
  };

  const removeExercise = (id) => {
    setExercises(exercises.filter(e => e.id !== id));
  };

  const updateExercise = (id, field, value) => {
    setExercises(exercises.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const handleSave = () => {
    if (!title.trim() || exercises.some(e => !e.name.trim())) {
      alert('Please provide a title and names for all exercises.');
      return;
    }

    const newPlan = {
      id: 'manual-' + Date.now(),
      title,
      time: 'Custom',
      category,
      planData: {
        workout: exercises.map((e, idx) => ({
          id: idx + 1,
          name: e.name,
          sets: parseInt(e.sets) || 3,
          reps: e.reps || "10",
          completed: false
        })),
        diet: { breakfast: {item: 'Oats', cost: 40}, lunch: {item: 'Rice', cost: 60}, dinner: {item: 'Chicken', cost: 100} },
        totalCost: 200,
        intensity: 'Medium'
      }
    };

    setSavedPlans(prev => [...prev, newPlan]);
    navigate('/progress');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', paddingBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
          <ArrowLeft size={24} color="#212121" />
        </button>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#212121' }}>Manual Workout</h1>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }} className="hide-scroll">
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#9E9E9E', marginBottom: '8px' }}>Plan Name</label>
          <input 
            type="text" 
            placeholder="e.g. My Morning Routine" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: '12px 15px', borderRadius: '12px', border: '1px solid #E0E0E0', fontSize: '15px', outline: 'none' }}
          />
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#9E9E9E', marginBottom: '8px' }}>Category</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            {['All', 'Upper Body', 'Lower Body'].map(cat => (
              <button 
                key={cat}
                onClick={() => setCategory(cat)}
                style={{ flex: 1, padding: '10px', borderRadius: '10px', border: category === cat ? 'none' : '1px solid #E0E0E0', backgroundColor: category === cat ? '#65B5F6' : 'white', color: category === cat ? 'white' : '#9E9E9E', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Exercises</h3>
          <button onClick={addExercise} style={{ background: 'transparent', border: 'none', color: '#65B5F6', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
            <Plus size={18} /> Add
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {exercises.map((ex, index) => (
            <div key={ex.id} style={{ padding: '15px', border: '1px solid #E0E0E0', borderRadius: '15px', position: 'relative' }}>
              <div style={{ marginBottom: '10px' }}>
                <input 
                  type="text" 
                  placeholder="Exercise Name" 
                  value={ex.name}
                  onChange={(e) => updateExercise(ex.id, 'name', e.target.value)}
                  style={{ width: '90%', border: 'none', borderBottom: '1px solid #F5F5F5', padding: '5px 0', fontSize: '15px', fontWeight: 'bold', outline: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#9E9E9E' }}>Sets:</span>
                  <input 
                    type="number" 
                    value={ex.sets}
                    onChange={(e) => updateExercise(ex.id, 'sets', e.target.value)}
                    style={{ width: '40px', border: 'none', borderBottom: '1px solid #F5F5F5', padding: '2px 0', fontSize: '14px', textAlign: 'center' }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#9E9E9E' }}>Reps:</span>
                  <input 
                    type="text" 
                    value={ex.reps}
                    onChange={(e) => updateExercise(ex.id, 'reps', e.target.value)}
                    style={{ width: '60px', border: 'none', borderBottom: '1px solid #F5F5F5', padding: '2px 0', fontSize: '14px', textAlign: 'center' }}
                  />
                </div>
              </div>
              {exercises.length > 1 && (
                <button 
                  onClick={() => removeExercise(ex.id)}
                  style={{ position: 'absolute', top: '15px', right: '10px', background: 'transparent', border: 'none', color: '#FF7043', cursor: 'pointer' }}
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={handleSave}
        style={{ width: '100%', padding: '15px', backgroundColor: '#1A1B20', color: 'white', border: 'none', borderRadius: '15px', fontWeight: 'bold', fontSize: '16px', marginTop: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
      >
        <Save size={20} /> Save Plan
      </button>
    </div>
  );
};

export default CreateManual;
