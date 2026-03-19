import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Send, Mic, Plus, Cpu, User as UserIcon } from 'lucide-react';
import { generateChatResponse } from '../ai';
import { useNavigate } from 'react-router-dom';

const Chat = () => {
  const { userProfile, currentPlan, setCurrentPlan } = useAppContext();
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: `Hello! Let's hit that ${userProfile.goal} goal. How can I adapt your plan or assist your routine today?`, sender: 'ai', hasPlan: false, plan: null },
  ]);

  const handleSend = async () => {
    if (!input.trim() || isThinking) return;

    const userMessage = { id: Date.now(), text: input, sender: 'user' };
    const conversationHistory = [...messages, userMessage];
    setMessages(conversationHistory);
    
    const currentInput = input;
    setInput('');
    setIsThinking(true);
    
    try {
      const aiResponseJSON = await generateChatResponse({ 
        message: currentInput, 
        profile: userProfile, 
        currentPlan, 
        history: conversationHistory 
      });

      const aiResponse = { 
        id: Date.now() + 1, 
        text: aiResponseJSON.text, 
        sender: 'ai', 
        hasPlan: aiResponseJSON.hasPlan, 
        plan: aiResponseJSON.plan 
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (e) {
      setMessages(prev => [...prev, { id: Date.now() + 1, text: `Connection Error: ${e.message}. Please verify your AI API key in ai.js or try again later!`, sender: 'ai', hasPlan: false }]);
    } finally {
      setIsThinking(false);
    }
  };

  const handeAddPlan = (newPlan) => {
    setCurrentPlan(newPlan);
    navigate('/dashboard');
  };

  const handeOpenPlan = (newPlan) => {
    // Elegant native preview
    alert(`💡 Plan Preview:\n\nExercises:\n${newPlan.workout.map(w => '- ' + w.name).join('\n')}\n\nCalories/Cost:\n₹${newPlan.totalCost}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', paddingBottom: '20px' }}>
      <h1 className="mb-4" style={{ fontSize: '24px', fontWeight: '800', color: '#E0E0E0', fontFamily: 'Merriweather' }}>Ai Trainer</h1>
      
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '20px' }} className="hide-scroll">
        {messages.map(msg => (
          <div key={msg.id} style={{ display: 'flex', flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row', gap: '10px', alignItems: 'flex-start' }}>
            
            {/* Avatar */}
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: msg.sender === 'ai' ? '#333' : '#FFB74D', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {msg.sender === 'ai' ? <Cpu size={16} color="white" /> : <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="User" />}
            </div>

            {/* Bubble */}
            <div style={{ maxWidth: '75%', backgroundColor: msg.sender === 'ai' ? '#D9F0FF' : '#F6E0D9', borderRadius: msg.sender === 'ai' ? '0 15px 15px 15px' : '15px 0 15px 15px', padding: '15px', position: 'relative' }}>
              <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#212121', marginBottom: '5px', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                {msg.sender === 'ai' ? 'AI Trainer' : 'You'}
              </div>
              <div style={{ fontSize: '14px', color: '#212121', whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>
                {msg.text}
              </div>
              
              {/* Optional embedded extra actions for AI generated Plans */}
              {msg.sender === 'ai' && msg.hasPlan && msg.plan && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                  <button onClick={() => handeOpenPlan(msg.plan)} style={{ flex: 1, padding: '8px', cursor: 'pointer', backgroundColor: '#65B5F6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px' }}>Open</button>
                  <button onClick={() => handeAddPlan(msg.plan)} style={{ flex: 1, cursor: 'pointer', padding: '8px', backgroundColor: '#65B5F6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px' }}>Add</button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Thinking Indicator */}
        {isThinking && (
          <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'flex-start' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#333', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <Cpu size={16} color="white" />
            </div>
            <div style={{ maxWidth: '75%', backgroundColor: '#D9F0FF', borderRadius: '0 15px 15px 15px', padding: '15px 20px', position: 'relative', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '6px', height: '6px', backgroundColor: '#65B5F6', borderRadius: '50%', animation: 'bounceDots 1.4s infinite ease-in-out both' }}></div>
              <div style={{ width: '6px', height: '6px', backgroundColor: '#65B5F6', borderRadius: '50%', animation: 'bounceDots 1.4s infinite ease-in-out both', animationDelay: '0.2s' }}></div>
              <div style={{ width: '6px', height: '6px', backgroundColor: '#65B5F6', borderRadius: '50%', animation: 'bounceDots 1.4s infinite ease-in-out both', animationDelay: '0.4s' }}></div>
            </div>
            <style>{`
              @keyframes bounceDots { 0%, 80%, 100% { transform: scale(0); opacity: 0.3; } 40% { transform: scale(1); opacity: 1; } }
            `}</style>
          </div>
        )}
      </div>
      
      {/* Interaction Input Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#FFFFFF', paddingTop: '10px' }}>
        <button style={{ width: '35px', height: '35px', border: '1px solid #E0E0E0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', flexShrink: 0 }}>
          <Plus size={20} color="#757575" />
        </button>
        
        <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Message" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            style={{ width: '100%', padding: '12px 40px 12px 15px', border: '1px solid #E0E0E0', borderRadius: '25px', outline: 'none', fontSize: '14px' }}
          />
          <Mic size={18} color="#9E9E9E" style={{ position: 'absolute', right: '15px' }} />
        </div>

        <button onClick={handleSend} style={{ background: 'transparent', border: 'none', padding: '5px', cursor: 'pointer', flexShrink: 0, opacity: input ? 1 : 0.5 }}>
          <Send size={24} color="#BDBDBD" />
        </button>
      </div>
    </div>
  );
};

export default Chat;
