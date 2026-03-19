import { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { generatePlanAction, getAdaptedPlan } from '../ai';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem('pulse_auth')) || null);
  const [userProfile, setUserProfile] = useState(JSON.parse(localStorage.getItem('pulse_profile')) || null);
  const [currentPlan, setCurrentPlan] = useState(JSON.parse(localStorage.getItem('pulse_plan')) || null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [workoutProgress, setWorkoutProgress] = useState(JSON.parse(localStorage.getItem('pulse_progress')) || {
    currentDay: 1,
    lastCompletedTime: null
  });
  const [savedPlans, setSavedPlans] = useState([
    {
      id: 'default-1',
      title: 'Full Body Starter',
      intensity: 'Low',
      workout: [
        { id: 1, name: 'Pushups', sets: 3, reps: '10', completed: false },
        { id: 2, name: 'Bodyweight Squats', sets: 3, reps: '15', completed: false },
        { id: 3, name: 'Plank', sets: 3, reps: '30s', completed: false }
      ],
      diet: {
         breakfast: { item: 'Oats with Peanuts', cost: 30 },
         lunch: { item: 'Dal Rice with Curd', cost: 50 },
         dinner: { item: 'Paneer Bhurji', cost: 70 }
      }
    }
  ]);
  const [progress, setProgress] = useState({ streak: 1, calories: 1200, water: 2.5, sleep: 7.5 });
  
  // Persistence Sync
  useEffect(() => {
    localStorage.setItem('pulse_auth', JSON.stringify(authUser));
    localStorage.setItem('pulse_profile', JSON.stringify(userProfile));
    localStorage.setItem('pulse_plan', JSON.stringify(currentPlan));
    localStorage.setItem('pulse_progress', JSON.stringify(workoutProgress));
  }, [authUser, userProfile, currentPlan, workoutProgress]);

  // AI Genkit Functions
  const generatePlan = async (prefs) => {
    const staples = {
       'india': {
          'kerala': { breakfast: 'Appam & Veg Stew', lunch: 'Brown Rice & Fish Curry', dinner: 'Putti & Kadala Curry' },
          'keral': { breakfast: 'Appam & Veg Stew', lunch: 'Brown Rice & Fish Curry', dinner: 'Putti & Kadala Curry' },
          'punjab': { breakfast: 'Paneer Paratha & Curd', lunch: 'Rajma Chawal', dinner: 'Sarson Ka Saag & Roti' },
          'andhra pradesh': { breakfast: 'Pesarattu Upma', lunch: 'Rice with Tomato Pappu', dinner: 'Gongura Pickle & Rice' },
          'andhra': { breakfast: 'Pesarattu Upma', lunch: 'Rice with Tomato Pappu', dinner: 'Gongura Pickle & Rice' },
          'uttar pradesh': { breakfast: 'Bedmi Poori & Sabzi', lunch: 'Chole Rice & Raita', dinner: 'Tehri & Curd' },
          'up': { breakfast: 'Bedmi Poori & Sabzi', lunch: 'Chole Rice & Raita', dinner: 'Tehri & Curd' },
          'delhi': { breakfast: 'Aloo Paratha & Pickles', lunch: 'Butter Chicken & Naan', dinner: 'Tandoori Platters' },
          'default': { breakfast: 'Poha with Sprouts', lunch: 'Dal Tadka & Rice', dinner: 'Grilled Paneer Salad' }
       },
       'usa': {
          'default': { breakfast: 'Oatmeal & Berries', lunch: 'Turkey Sandwich', dinner: 'Grilled Salmon & Veg' }
       }
    };

    // Combine keys for highly flexible lookup
    const searchStr = `${prefs.country || ''} ${prefs.region || ''}`.toLowerCase();
    
    let bundle = staples['usa']['default']; // Final fallback
    
    // Check for India specifically or any Indian region keyword
    const indiaRegions = Object.keys(staples['india']);
    const foundIndiaRegion = indiaRegions.find(r => searchStr.includes(r));
    
    if (foundIndiaRegion) {
       bundle = staples['india'][foundIndiaRegion];
    } else if (searchStr.includes('india')) {
       bundle = staples['india']['default'];
    }

    try {
      setIsAiLoading(true);
      setAiError(null);
      const profile = userProfile || {};
      const fullProfile = { ...profile, ...prefs };
      setUserProfile(fullProfile);

      let newPlan;
      try {
        // Force variety in the seed
        const newSeed = Date.now();
        newPlan = await generatePlanAction({ ...fullProfile, seed: newSeed });
      } catch (aiErr) {
        console.warn("AI generation error, using fallback logic", aiErr);
        const isBodyweight = prefs.location === 'Home' && prefs.hasEquipment === 'No Equipment';
        newPlan = { 
           workout: isBodyweight ? [
             { id: 1, name: 'Burpees', sets: 4, reps: '15', completed: false },
             { id: 2, name: 'Diamond Pushups', sets: 3, reps: '12', completed: false },
             { id: 3, name: 'Mountain Climbers', sets: 3, reps: '20', completed: false }
           ] : [
             { id: 1, name: 'Lat Pulldowns', sets: 4, reps: '10', completed: false },
             { id: 2, name: 'Leg Press', sets: 3, reps: '12', completed: false },
             { id: 3, name: 'Shoulder Press', sets: 3, reps: '12', completed: false }
           ],
           intensity: 'Offline Base' 
        };
      }

      // Injectized localized diet
      newPlan.diet = {
         breakfast: { item: bundle.breakfast, cost: Math.floor(prefs.budget * 0.2), cals: 400, protein: '15g' },
         lunch: { item: bundle.lunch, cost: Math.floor(prefs.budget * 0.4), cals: 700, protein: '25g' },
         dinner: { item: bundle.dinner, cost: Math.floor(prefs.budget * 0.4), cals: 500, protein: '20g' }
      };
      newPlan.totalCost = prefs.budget;
      newPlan.is30Day = true; 
      newPlan.isCalibrated = prefs.markCalibrated || false; 

      setCurrentPlan(newPlan);
      setProgress(p => ({ ...p, streak: p.streak + 1 }));
    } catch (criticalErr) {
       console.error("Critical error in generatePlan:", criticalErr);
       setAiError(criticalErr.message);
       // Last resort fallback to ensure app doesn't hang
       setCurrentPlan({
         workout: [{ id: 1, name: 'Basic Workout', sets: 3, reps: '10', completed: false }],
         diet: { breakfast: {item: 'Oats', cost: 50}, lunch: {item: 'Rice', cost: 50}, dinner: {item: 'Salad', cost: 50} },
         totalCost: 150,
         intensity: 'Basic Failure: ' + (criticalErr.message || 'Unknown')
       });
    } finally {
       setIsAiLoading(false);
    }
  };
  
  const updatePlanIntensity = async (feedback) => {
    try {
      const newPlan = await getAdaptedPlan({ currentPlan, feedback });
      setCurrentPlan(newPlan);
    } catch (e) {
      console.error("AI Adaptation failed", e);
    }
  };
  
  const markWorkoutCompleted = (id) => {
    setCurrentPlan(prev => {
      const newPlan = { ...prev };
      newPlan.workout = newPlan.workout.map(w => w.id === id ? { ...w, completed: true } : w);
      
      const completion = newPlan.workout.filter(w => w.completed).length / newPlan.workout.length;
      setProgress(p => ({ ...p, workoutCompletion: Math.round(completion * 100) }));
      return newPlan;
    });
  };

  const logout = () => {
    signOut(auth).then(() => {
      setAuthUser(null);
      setUserProfile(null);
      setCurrentPlan(null);
    });
  };

  return (
    <AppContext.Provider value={{
      authUser, setAuthUser,
      userProfile, setUserProfile,
      currentPlan, setCurrentPlan,
      workoutProgress, setWorkoutProgress,
      savedPlans, setSavedPlans,
      progress, setProgress,
      generatePlan, updatePlanIntensity, markWorkoutCompleted, logout
    }}>
      {children}
    </AppContext.Provider>
  );
};
