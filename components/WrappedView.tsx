import React, { useMemo } from 'react';
import { Snap, PersonaType, WrappedInsight } from '../types';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { Share2, AlertCircle, Frown, Sparkles, Lightbulb } from 'lucide-react';

interface WrappedViewProps {
  snaps: Snap[];
}

const WrappedView: React.FC<WrappedViewProps> = ({ snaps }) => {
  // Compute detailed analytics
  const stats = useMemo(() => {
    const totalSnaps = snaps.length;
    const tagCounts: Record<string, number> = {};
    const hourCounts: number[] = Array(24).fill(0);
    
    let sweetCount = 0;
    let friedCount = 0;
    let vegCount = 0;
    let lateNightCount = 0;
    let fruitCount = 0;

    snaps.forEach(snap => {
      // Tags
      snap.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        if (tag.toLowerCase().includes('fruit')) fruitCount++;
      });

      // Hour
      const hour = new Date(snap.timestamp).getHours();
      hourCounts[hour]++;
      if (hour >= 22 || hour <= 4) lateNightCount++;

      // Attributes
      if (snap.aiData?.isSweet) sweetCount++;
      if (snap.aiData?.isFried) friedCount++;
      if (snap.aiData?.isVeg) vegCount++;
    });

    // 1. Determine Persona
    let persona: PersonaType = 'The Balanced Guru';
    let personaIcon = "🧘‍♀️";
    let personaDesc = "You keep things perfectly aligned.";
    let personaGradient = "from-teal-400 to-emerald-500";

    if (sweetCount > totalSnaps * 0.4) {
        persona = 'The Sweet Tooth';
        personaIcon = "🍭";
        personaDesc = "Sugar is your love language.";
        personaGradient = "from-pink-400 to-rose-500";
    } else if (vegCount > totalSnaps * 0.6) {
        persona = 'The Rabbit King';
        personaIcon = "🥕";
        personaDesc = "Green is your favorite color.";
        personaGradient = "from-green-400 to-lime-500";
    } else if (lateNightCount > 2) {
        persona = 'The Vampire';
        personaIcon = "🧛";
        personaDesc = "You feast while the world sleeps.";
        personaGradient = "from-indigo-400 to-purple-600";
    } else if (friedCount > totalSnaps * 0.4) {
        persona = 'The Foodie Explorer';
        personaIcon = "🍔";
        personaDesc = "Flavor over everything.";
        personaGradient = "from-orange-400 to-amber-500";
    }

    // 2. Health Insights (Concerns, Praise, Suggestions)
    const insights: WrappedInsight[] = [];
    
    // Concerns
    if (sweetCount > 4) {
        insights.push({ type: 'concern', message: 'High sugar intake this week.', icon: '🍬' });
    }
    if (lateNightCount > 3) {
        insights.push({ type: 'concern', message: 'Frequent late-night snacking.', icon: '🌙' });
    }

    // Suggestions (New Feature)
    if (sweetCount > 3 && fruitCount < 2) {
        insights.push({ type: 'suggestion', message: 'Try swapping one sweet treat for fruit!', icon: '🍎' });
    }
    if (vegCount < 2 && totalSnaps > 3) {
        insights.push({ type: 'suggestion', message: 'Add a handful of greens to your next meal.', icon: '🥦' });
    }
    if (lateNightCount > 2) {
         insights.push({ type: 'suggestion', message: 'Try herbal tea instead of a snack at night.', icon: '🫖' });
    }

    // Praise
    if (vegCount > 5) {
        insights.push({ type: 'praise', message: 'Amazing fiber intake!', icon: '✨' });
    }
    if (totalSnaps > 10) {
        insights.push({ type: 'praise', message: 'You are a consistent tracking star!', icon: '⭐' });
    }
    
    // 3. Forgotten Foods (Simple check against common list)
    const commonFoods = ['Fruit', 'Rice', 'Fish', 'Salad', 'Soup'];
    const eatenTags = Object.keys(tagCounts);
    const forgotten = commonFoods.filter(f => !eatenTags.some(t => t.toLowerCase().includes(f.toLowerCase())));

    // 4. Mock Percentile
    const percentile = Math.min(99, Math.floor((vegCount / (totalSnaps || 1)) * 100) + 20);

    const sortedTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    // Diversity Radar
    const diversityData = [
      { subject: 'Veggie', A: vegCount, fullMark: totalSnaps },
      { subject: 'Sweet', A: sweetCount, fullMark: totalSnaps },
      { subject: 'Fried', A: friedCount, fullMark: totalSnaps },
      { subject: 'Protein', A: Math.round(totalSnaps * 0.6), fullMark: totalSnaps }, 
      { subject: 'Carbs', A: Math.round(totalSnaps * 0.8), fullMark: totalSnaps },
    ];

    return { totalSnaps, sortedTags, diversityData, persona, personaIcon, personaDesc, personaGradient, insights, forgotten, percentile };
  }, [snaps]);

  if (snaps.length < 3) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] p-8 text-center">
        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-6 shadow-[0_10px_30px_rgba(20,184,166,0.2)] animate-float">
            <Share2 className="text-teal-400" size={48} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Needs more bites!</h2>
        <p className="text-gray-500 max-w-[250px] font-bold text-lg leading-relaxed">Snap at least 3 meals to unlock your personalized Food Persona.</p>
      </div>
    );
  }

  return (
    <div className="p-5 space-y-6 pb-24">
      <header className="mb-2 px-2">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-1">Your Wrapped</h1>
        <p className="text-teal-600 font-bold text-sm uppercase tracking-widest">Weekly Vibe Check</p>
      </header>

      {/* PERSONA CARD */}
      <div className={`bg-gradient-to-br ${stats.personaGradient} rounded-[3rem] p-8 text-white shadow-2xl relative overflow-hidden text-center group`}>
        {/* Background bubbles */}
        <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-[-20%] left-[-20%] w-48 h-48 bg-black/10 rounded-full blur-2xl"></div>
        
        <div className="relative z-10">
            <p className="text-white/80 font-black text-xs uppercase tracking-widest mb-6 bg-black/20 inline-block px-4 py-1 rounded-full">You ate like...</p>
            <div className="text-9xl mb-6 animate-float filter drop-shadow-lg">{stats.personaIcon}</div>
            <h2 className="text-4xl font-black mb-3 leading-none tracking-tight">{stats.persona}</h2>
            <p className="text-white font-bold text-xl opacity-90 leading-relaxed max-w-[250px] mx-auto">{stats.personaDesc}</p>
        </div>
      </div>

      {/* Top Craving & Percentile */}
      <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-orange-50 flex flex-col items-center text-center justify-center">
              <span className="text-5xl mb-3 drop-shadow-sm">🏆</span>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Top Craving</p>
              <p className="text-xl font-black text-gray-900 leading-tight">{stats.sortedTags[0]?.name || 'Everything'}</p>
          </div>
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-teal-50 flex flex-col items-center text-center justify-center">
              <div className="w-14 h-14 rounded-full border-[5px] border-teal-100 flex items-center justify-center mb-3 bg-teal-50">
                  <span className="text-teal-600 font-black text-sm">{stats.percentile}%</span>
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Healthier Than</p>
              <p className="text-sm font-black text-gray-900">Most friends</p>
          </div>
      </div>

      {/* Health Insights */}
      {stats.insights.length > 0 && (
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
             <h3 className="font-black text-gray-900 mb-5 flex items-center gap-2 text-lg">
                 <Sparkles size={22} className="text-purple-400 fill-purple-400"/> Insights
             </h3>
             <div className="space-y-3">
                 {stats.insights.map((insight, idx) => (
                     <div key={idx} className={`p-5 rounded-[1.5rem] flex items-start gap-4 transition-transform hover:scale-[1.02] ${
                         insight.type === 'concern' ? 'bg-red-50 text-red-900' : 
                         insight.type === 'suggestion' ? 'bg-blue-50 text-blue-900' :
                         'bg-green-50 text-green-900'
                     }`}>
                         <span className="text-2xl mt-0.5">{insight.icon}</span>
                         <div>
                             <p className="text-[10px] font-black uppercase tracking-wider opacity-60 mb-0.5">{insight.type}</p>
                             <span className="font-bold text-sm leading-snug block">{insight.message}</span>
                         </div>
                     </div>
                 ))}
             </div>
          </div>
      )}

      {/* Forgotten Foods */}
      {stats.forgotten.length > 0 && (
          <div className="bg-[#E0F2FE] p-8 rounded-[3rem] relative overflow-hidden group">
              <Frown className="absolute -right-6 -top-6 text-[#BAE6FD] w-40 h-40 rotate-12 transition-transform group-hover:rotate-45 duration-700" />
              <div className="relative z-10">
                <h3 className="font-black text-blue-900 mb-2 text-xl">Long time no see...</h3>
                <p className="text-blue-700 font-bold text-sm mb-5">You haven't snapped these lately:</p>
                <div className="flex flex-wrap gap-2">
                    {stats.forgotten.map(f => (
                        <span key={f} className="px-4 py-2 bg-white text-blue-600 rounded-xl text-xs font-black shadow-sm transform hover:-translate-y-1 transition-transform cursor-default">{f}</span>
                    ))}
                </div>
              </div>
          </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {/* Diversity Radar */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4 justify-center">
                <div className="p-2 bg-orange-100 rounded-full">
                    <Lightbulb size={18} className="text-orange-500 fill-orange-500" />
                </div>
                <h3 className="font-black text-gray-900 text-lg">Flavor Profile</h3>
            </div>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="65%" data={stats.diversityData}>
                        <PolarGrid stroke="#F3F4F6" strokeWidth={2} />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 800, fontFamily: 'Quicksand' }} />
                        <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                        <Radar name="You" dataKey="A" stroke="#F97316" strokeWidth={4} fill="#F97316" fillOpacity={0.2} />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>

      {/* Share Button */}
      <button className="w-full bg-gray-900 text-white font-black py-5 rounded-[2rem] flex items-center justify-center gap-3 shadow-xl shadow-gray-300 active:scale-95 transition-all text-lg mb-8">
        <Share2 size={24} /> Share My Vibe
      </button>
    </div>
  );
};

export default WrappedView;