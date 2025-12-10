import React, { useState } from 'react';
import { UserProfile } from '../types';
import { ChevronRight, Camera, Sparkles, Users } from 'lucide-react';

interface OnboardingViewProps {
  onComplete: (profile: UserProfile) => void;
}

const OnboardingView: React.FC<OnboardingViewProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [goal, setGoal] = useState<UserProfile['goal']>('awareness');

  const handleNext = () => {
    if (step === 3) {
      onComplete({
        id: crypto.randomUUID(),
        name: name || 'Friend',
        goal,
        joinedAt: Date.now()
      });
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white relative overflow-hidden">
      {/* Background Decor - Solid Bubbly Shapes */}
      <div className="absolute top-0 right-[-10%] w-[90%] h-[45%] bg-teal-50 rounded-bl-[8rem] rounded-br-[4rem] z-0" />
      <div className="absolute bottom-0 left-[-10%] w-[90%] h-[35%] bg-orange-50 rounded-tr-[8rem] rounded-tl-[4rem] z-0" />

      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center z-10 relative">
        
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="w-24 h-24 bg-teal-400 rounded-[2rem] shadow-lg flex items-center justify-center mb-6 mx-auto">
              <Camera size={40} className="text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">BiteSnap</h1>
            <p className="text-gray-500 text-lg font-medium leading-relaxed max-w-xs mx-auto">
              Track your habits with a snap. <br/>
              <span className="text-teal-600 font-bold">No calories. No judgment.</span>
            </p>
            <p className="text-blue-400 font-bold text-lg mt-2 lowercase">eat your way</p>
          </div>
        )}

        {step === 2 && (
          <div className="w-full max-w-xs animate-in fade-in slide-in-from-right-8 duration-500">
            <h2 className="text-2xl font-black text-gray-900 mb-2">What should we call you?</h2>
            <p className="text-gray-500 mb-8 text-sm font-bold">This is how you'll appear to friends.</p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full text-center text-2xl font-black border-b-2 border-gray-200 py-2 focus:border-teal-500 focus:outline-none bg-transparent placeholder-gray-300 text-gray-900"
              autoFocus
            />
          </div>
        )}

        {step === 3 && (
          <div className="w-full animate-in fade-in slide-in-from-right-8 duration-500">
            <h2 className="text-2xl font-black text-gray-900 mb-6">What's your main goal?</h2>
            <div className="space-y-3">
              {[
                { id: 'awareness', label: 'Just Awareness', icon: <Camera size={20}/> },
                { id: 'health', label: 'Eat Healthier', icon: <Sparkles size={20}/> },
                { id: 'social', label: 'Share with Friends', icon: <Users size={20}/> },
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => setGoal(option.id as any)}
                  className={`w-full p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${
                    goal === option.id 
                      ? 'border-teal-500 bg-teal-50 text-teal-900 shadow-md transform scale-[1.02]' 
                      : 'border-white bg-white/80 text-gray-600 hover:bg-white shadow-sm'
                  }`}
                >
                  <div className={`p-2 rounded-full ${goal === option.id ? 'bg-teal-200 text-teal-800' : 'bg-gray-100 text-gray-500'}`}>
                    {option.icon}
                  </div>
                  <span className="font-bold text-lg">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-8 z-10 relative">
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              className={`h-2 rounded-full transition-all duration-300 ${s === step ? 'w-8 bg-teal-600' : 'w-2 bg-gray-300'}`}
            />
          ))}
        </div>
        <button
          onClick={handleNext}
          disabled={step === 2 && !name.trim()}
          className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl text-lg shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all"
        >
          {step === 3 ? "Let's Start" : "Next"} <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default OnboardingView;