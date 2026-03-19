import React, { useState } from 'react';
import { Upload as UploadIcon, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isImproved, setIsImproved] = useState(false);
  const { setSavedPlans } = useAppContext();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) return;

    setAnalyzing(true);
    // Simulate AI extraction and analysis
    setTimeout(() => {
      setAnalyzing(false);
      setResult({
        summary: "Extracted: DAY 1 - PUSH WORKOUT PLAN. High focus on chest, shoulders, and triceps with structured warm-up/cool-down.",
        exercises: [
          { id: 1, name: 'Push-ups', sets: 3, reps: '10', completed: false },
          { id: 2, name: 'Bench Press', sets: 3, reps: '10', completed: false },
          { id: 3, name: 'Shoulder Press', sets: 3, reps: '10', completed: false },
          { id: 4, name: 'Lateral Raises', sets: 3, reps: '12', completed: false },
          { id: 5, name: 'Tricep Dips', sets: 3, reps: '10', completed: false }
        ],
        issues: [
          "Low volume for upper chest isolation.",
          "High tricep fatigue potential before finishing dips.",
          "Rest times could be optimized for muscle hypertrophy."
        ],
        improvement: {
          workout: [
            { id: 1, name: 'Push-ups', sets: 3, reps: '10', completed: false },
            { id: 2, name: 'Bench Press', sets: 3, reps: '12', completed: false },
            { id: 3, name: 'Incline Dumbbell Flies', sets: 3, reps: '12', completed: false },
            { id: 4, name: 'Shoulder Press', sets: 3, reps: '10', completed: false },
            { id: 5, name: 'Lateral Raises', sets: 3, reps: '15', completed: false },
            { id: 6, name: 'Tricep Dips', sets: 3, reps: '12', completed: false }
          ],
          text: "I've added Incline Dumbbell Flies to target your upper chest and increased the volume on isolation movements for better definition."
        }
      });
    }, 1500);
  };

  const savePlan = (type = 'raw') => {
    const planToSave = {
      id: 'upload-' + Date.now(),
      title: type === 'raw' ? 'PDF Extracted Plan' : 'AI Enhanced PDF Plan',
      time: '01:30 Minutes',
      category: 'All',
      planData: {
        workout: type === 'raw' ? result.exercises : result.improvement.workout,
        diet: { breakfast: {item: 'Oats', cost: 40}, lunch: {item: 'Rice', cost: 60}, dinner: {item: 'Chicken', cost: 100} },
        totalCost: 200,
        intensity: 'Medium'
      }
    };
    setSavedPlans(prev => [...prev, planToSave]);
    alert(type === 'raw' ? 'Original Plan Saved!' : 'Improved Plan Saved!');
    navigate('/progress');
  };

  return (
    <div style={{ paddingBottom: '40px' }}>
      <h1 className="mb-6 flex gap-2 items-center" style={{ fontWeight: '800' }}><UploadIcon size={24} /> Plan Analyzer</h1>
      
      {!result ? (
        <div style={{ backgroundColor: '#FFF', padding: '40px 20px', borderRadius: '20px', textAlign: 'center', border: '2px dashed #D9F0FF', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '60px', height: '60px', backgroundColor: '#FDF1EA', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
             <FileText size={30} color="#E89B77" />
          </div>
          <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>Upload Your PDF Plan</h2>
          <p style={{ color: '#9E9E9E', fontSize: '14px', marginBottom: '30px' }}>We'll extract your exercises and optimize them.</p>
          
          <input type="file" accept="application/pdf" onChange={handleFileChange} style={{ marginBottom: '20px', fontSize: '14px' }} />
          
          <button 
            disabled={!file || analyzing}
            onClick={handleUpload}
            style={{ width: '100%', padding: '15px', backgroundColor: '#1A1B20', color: 'white', border: 'none', borderRadius: '15px', fontWeight: 'bold', opacity: (!file || analyzing) ? 0.5 : 1 }}
          >
            {analyzing ? 'Analyzing...' : 'Analyze PDF'}
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Summary Box */}
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '20px', borderLeft: '5px solid #65B5F6', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={18} color="#65B5F6" /> Extracted Exercises</h3>
            <p style={{ fontSize: '14px', color: '#757575', lineHeight: '1.5' }}>{result.summary}</p>
          </div>

          {/* Phase 1 Actions */}
          {!showAnalysis && (
            <div style={{ display: 'flex', gap: '15px' }}>
               <button onClick={() => savePlan('raw')} style={{ flex: 1, padding: '15px', backgroundColor: '#F5F5F5', color: '#212121', border: 'none', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer' }}>Save to Plans</button>
               <button onClick={() => setShowAnalysis(true)} style={{ flex: 1, padding: '15px', backgroundColor: '#1A1B20', color: 'white', border: 'none', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer' }}>Enhance</button>
            </div>
          )}

          {/* Phase 2: Analysis (What's lacking) */}
          {showAnalysis && (
            <div style={{ backgroundColor: '#FFF5F2', padding: '20px', borderRadius: '20px', borderLeft: '5px solid #E89B77' }}>
               <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px' }}>AI Analysis: What's lacking?</h3>
               <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '14px', color: '#424242', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                 {result.issues.map((iss, i) => <li key={i}>{iss}</li>)}
               </ul>
               <hr style={{ border: 'none', borderTop: '1px solid #EADDD7', margin: '20px 0' }} />
               
               {!isImproved ? (
                 <div style={{ textAlign: 'center' }}>
                   <p style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '15px' }}>Should I improve it?</p>
                   <div style={{ display: 'flex', gap: '15px' }}>
                      <button onClick={() => savePlan('raw')} style={{ flex: 1, padding: '12px', border: '1px solid #E0E0E0', borderRadius: '12px', background: 'transparent', fontWeight: 'bold' }}>No, save original</button>
                      <button onClick={() => setIsImproved(true)} style={{ flex: 1, padding: '12px', backgroundColor: '#E89B77', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold' }}>Yes, Optimize!</button>
                   </div>
                 </div>
               ) : (
                 <div style={{ marginTop: '10px' }}>
                    <div style={{ backgroundColor: '#D9F0FF', padding: '15px', borderRadius: '12px', marginBottom: '20px' }}>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#212121' }}>Suggestion:</p>
                      <p style={{ margin: '5px 0 0', fontSize: '13px', color: '#455A64' }}>{result.improvement.text}</p>
                    </div>
                    <button onClick={() => savePlan('improved')} style={{ width: '100%', padding: '15px', backgroundColor: '#1A1B20', color: 'white', border: 'none', borderRadius: '15px', fontWeight: 'bold' }}>Save Improved Plan</button>
                 </div>
               )}
            </div>
          )}

          <button onClick={() => { setResult(null); setShowAnalysis(false); setIsImproved(false); setFile(null); }} style={{ color: '#9E9E9E', fontSize: '13px', background: 'none', border: 'none', textDecoration: 'underline', marginTop: '10px' }}>Upload another file</button>
        </div>
      )}
    </div>
  );
};

export default Upload;
