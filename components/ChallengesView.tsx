import React, { useState, useMemo, useEffect } from 'react';
import { Challenge, Snap } from '../types';
import { Trophy, Flame, Sparkles, ChevronRight, CheckCircle2, Lock } from 'lucide-react';

interface ChallengesViewProps {
  snaps: Snap[];
}

const ChallengesView: React.FC<ChallengesViewProps> = ({ snaps }) => {
  // Store joined state in local storage to persist across sessions
  const [joinedIds, setJoinedIds] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('bitesnap_joined_challenges');
    return saved ? new Set(JSON.parse(saved)) : new Set(['1']); // Default join '1'
  });

  // Persist joined state
  useEffect(() => {
    localStorage.setItem('bitesnap_joined_challenges', JSON.stringify([...joinedIds]));
  }, [joinedIds]);

  // Calculate Challenges Dynamically
  const challenges: Challenge[] = useMemo(() => {
    const now = Date.now();
    const oneDay = 1000 * 60 * 60 * 24;
    const sevenDaysAgo = now - (oneDay * 7);
    
    // Stats Calculation
    const recentSnaps = snaps.filter(s => s.timestamp > sevenDaysAgo);
    
    // 1. Veggie Count (Green Rabbit)
    const veggieCount = recentSnaps.filter(s => s.aiData?.isVeg || s.tags.some(t => t.toLowerCase().includes('veg'))).length;
    
    // 2. Sweet Count (Sugar Streak)
    const sweetCount = recentSnaps.filter(s => s.aiData?.isSweet).length;
    const sweetFreeStreak = 0; // Simplified for demo (logic would require daily bucketing)
    
    // 3. Morning Snaps
    const morningCount = recentSnaps.filter(s => {
      const h = new Date(s.timestamp).getHours();
      return h < 10 && h > 4;
    }).length;

    // 4. Late Night
    const lateNightCount = recentSnaps.filter(s => {
      const h = new Date(s.timestamp).getHours();
      return h >= 22 || h <= 4;
    }).length;

    // 5. Unique Foods
    const uniqueFoods = new Set(recentSnaps.map(s => s.aiData?.foodName || 'Food')).size;


    // --- BASE CHALLENGES ---
    const baseChallenges: Challenge[] = [
      {
        id: '1',
        title: 'Eat Like a Rabbit',
        description: 'Log a green vegetable in 3 snaps this week.',
        reward: '20% Off Campus Cafe',
        joined: joinedIds.has('1'),
        progress: Math.min(100, Math.round((veggieCount / 3) * 100)),
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80',
        category: 'daily',
        color: 'bg-green-100 text-green-700'
      },
      {
        id: '2',
        title: 'Morning Glory',
        description: 'Snap breakfast before 10 AM, 3 times.',
        reward: 'Free Coffee Voucher',
        joined: joinedIds.has('2'),
        progress: Math.min(100, Math.round((morningCount / 3) * 100)),
        image: 'https://images.unsplash.com/photo-1533089862017-5614fa957f52?w=400&q=80',
        category: 'daily',
        color: 'bg-orange-100 text-orange-700'
      },
      {
        id: '3',
        title: 'Foodie Explorer',
        description: 'Log 5 different types of meals.',
        reward: 'Explorer Badge',
        joined: joinedIds.has('3'),
        progress: Math.min(100, Math.round((uniqueFoods / 5) * 100)),
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80',
        category: 'group',
        color: 'bg-purple-100 text-purple-700'
      }
    ];

    // --- DYNAMIC / PERSONALIZED CHALLENGES ---
    
    // Trigger: Too much sugar?
    if (sweetCount > 2) {
      baseChallenges.push({
        id: 'p1',
        title: 'Sugar Detox',
        description: 'You’ve had a few sweets lately. Try 2 days without "Sweet" tags.',
        reward: 'Wellness Badge',
        joined: joinedIds.has('p1'),
        progress: 0, // Simplified: Needs complex streak logic
        image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&q=80',
        category: 'personalized',
        color: 'bg-blue-100 text-blue-700'
      });
    }

    // Trigger: Late night eating?
    if (lateNightCount > 1) {
       baseChallenges.push({
        id: 'p2',
        title: 'Sleep Tight',
        description: 'Avoid snacking after 10 PM tonight.',
        reward: 'Sleepy Cat Sticker',
        joined: joinedIds.has('p2'),
        progress: 0,
        image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400&q=80',
        category: 'personalized',
        color: 'bg-indigo-100 text-indigo-700'
      });
    }

    return baseChallenges;

  }, [snaps, joinedIds]);


  const toggleJoin = (id: string) => {
    const newSet = new Set(joinedIds);
    if (newSet.has(id)) {
      // Don't allow leaving if progress > 0 for now (gamification stickiness)
      // newSet.delete(id); 
    } else {
      newSet.add(id);
    }
    setJoinedIds(newSet);
  };

  const activeChallenges = challenges.filter(c => c.joined);
  const availableChallenges = challenges.filter(c => !c.joined);

  return (
    <div className="p-5 space-y-8 pb-24">
      <header className="px-2">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-1">Challenges</h1>
        <p className="text-gray-500 font-bold text-sm">Quests update automatically based on your bites.</p>
      </header>

      {/* Active Section */}
      <section>
        <h2 className="text-xs font-black text-gray-300 uppercase tracking-widest mb-4 ml-2 flex items-center gap-2">
            <Flame size={16} className="text-orange-500 fill-orange-500" /> Active Quests
        </h2>
        <div className="space-y-4">
            {activeChallenges.map(challenge => (
                <div key={challenge.id} className="bg-white rounded-[2.5rem] p-5 shadow-sm border border-white flex items-center gap-5 relative overflow-hidden transition-transform active:scale-[0.98]">
                    <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shrink-0 ${challenge.color} shadow-inner`}>
                        {challenge.progress >= 100 ? <CheckCircle2 size={28} /> : <Trophy size={28} />}
                    </div>
                    <div className="flex-1 relative z-10">
                        <div className="flex justify-between items-start">
                             <h3 className="font-bold text-gray-900 text-lg leading-tight">{challenge.title}</h3>
                             {challenge.progress >= 100 && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-black">DONE</span>}
                        </div>
                        
                        <div className="w-full bg-gray-100 h-4 rounded-full mt-3 overflow-hidden border border-gray-100">
                            <div 
                                className={`h-full rounded-full transition-all duration-1000 relative ${challenge.progress >= 100 ? 'bg-green-500' : 'bg-gradient-to-r from-teal-400 to-teal-500'}`} 
                                style={{ width: `${challenge.progress}%` }}
                            >
                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                            </div>
                        </div>
                        <div className="flex justify-between mt-1">
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-wide">{challenge.progress}% Complete</p>
                            {challenge.progress < 100 && (
                                <p className="text-[10px] text-teal-600 font-black uppercase tracking-wide">
                                    {challenge.category === 'personalized' ? 'Just for you' : 'Keep going!'}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            ))}
             {activeChallenges.length === 0 && (
                <div className="bg-white/50 border-2 border-dashed border-gray-200 rounded-[2.5rem] p-8 text-center">
                    <p className="text-gray-400 font-bold">No active quests. Join one below!</p>
                </div>
            )}
        </div>
      </section>

      {/* Explore Section */}
      <section>
        <h2 className="text-xs font-black text-gray-300 uppercase tracking-widest mb-4 ml-2 flex items-center gap-2">
            <Sparkles size={16} className="text-purple-500 fill-purple-500" /> For You
        </h2>
        <div className="space-y-6">
            {availableChallenges.map(challenge => (
                <div key={challenge.id} className="bg-white rounded-[3rem] overflow-hidden shadow-sm border-4 border-white group relative">
                    <div className="h-40 w-full relative overflow-hidden">
                        <img src={challenge.image} alt={challenge.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute top-4 right-4 bg-white/95 text-gray-900 text-[10px] font-black px-4 py-2 rounded-full backdrop-blur-md shadow-lg uppercase tracking-wider">
                            {challenge.reward}
                        </div>
                        {challenge.category === 'personalized' && (
                            <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[10px] font-black px-4 py-2 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
                                <Sparkles size={12} fill="currentColor"/> Picked for you
                            </div>
                        )}
                         {/* Gradient Overlay */}
                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                    </div>
                    
                    <div className="p-6 relative">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 leading-none mb-2">{challenge.title}</h3>
                                <p className="text-sm text-gray-500 font-medium leading-relaxed">{challenge.description}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-6">
                            <div className="flex -space-x-3">
                                {[1,2,3].map(i => (
                                    <div key={i} className={`w-9 h-9 rounded-full border-[3px] border-white bg-gray-${i*100} shadow-sm`}></div>
                                ))}
                                <div className="w-9 h-9 rounded-full bg-gray-900 border-[3px] border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm">+99</div>
                            </div>
                            <button 
                                onClick={() => toggleJoin(challenge.id)}
                                className="bg-gray-900 text-white text-sm font-bold px-8 py-4 rounded-[1.5rem] active:scale-95 transition-transform shadow-xl shadow-gray-200 flex items-center gap-2 group-hover:bg-teal-500"
                            >
                                Join Quest <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
            {availableChallenges.length === 0 && (
                 <div className="bg-white/50 border-2 border-dashed border-gray-200 rounded-[2.5rem] p-8 text-center">
                    <p className="text-gray-400 font-bold">You've joined all available quests!</p>
                </div>
            )}
        </div>
      </section>
    </div>
  );
};

export default ChallengesView;