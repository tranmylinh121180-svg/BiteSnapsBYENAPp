import React, { useState } from 'react';
import { Snap, ReactionType } from '../types';
import { Lock, Globe, Sparkles, SmilePlus, Camera as CameraIcon } from 'lucide-react';

interface FeedViewProps {
  snaps: Snap[];
  onReact: (snapId: string, reaction: ReactionType) => void;
  currentUserId: string;
}

const REACTION_OPTIONS: ReactionType[] = ['🔥 Yum', '🥺 Cute', '💅 Iconic', '🥗 Healthy'];

const FeedView: React.FC<FeedViewProps> = ({ snaps, onReact, currentUserId }) => {
  const [reactionPickerOpen, setReactionPickerOpen] = useState<string | null>(null);

  const sortedSnaps = [...snaps].sort((a, b) => b.timestamp - a.timestamp);

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const handleReactionClick = (snapId: string, type: ReactionType) => {
    onReact(snapId, type);
    setReactionPickerOpen(null);
  };

  return (
    <div className="p-5 space-y-6">
      <header className="flex items-center justify-between sticky top-0 bg-[#FFF0F5]/90 backdrop-blur-md z-20 py-3 -mx-5 px-5">
        <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">BiteFeed</h1>
        </div>
        <div className="bg-white border-2 border-teal-100 text-teal-600 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm">
            {snaps.length} Bites
        </div>
      </header>

      {sortedSnaps.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-md animate-float">
             <CameraIcon className="text-teal-300" size={40} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No bites yet!</h3>
          <p className="text-gray-500 text-sm max-w-[200px] leading-relaxed font-medium">Tap the big camera button to log your first tasty moment.</p>
        </div>
      ) : (
        <div className="space-y-8">
            {sortedSnaps.map((snap) => {
                const isMe = snap.userId === currentUserId;
                return (
                <div key={snap.id} className="bg-white rounded-[2.5rem] shadow-sm border border-white overflow-hidden relative group">
                    {/* Header */}
                    <div className="px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {isMe ? (
                                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-teal-400 to-teal-600 border-4 border-[#FFF0F5] shadow-sm"></div>
                            ) : (
                                <img src={snap.userAvatar || `https://ui-avatars.com/api/?name=${snap.userName}&background=random`} alt={snap.userName} className="w-12 h-12 rounded-full border-4 border-[#FFF0F5] shadow-sm object-cover" />
                            )}
                            <div>
                                <p className="text-base font-bold text-gray-900">{isMe ? 'You' : snap.userName}</p>
                                <p className="text-xs text-gray-400 font-bold">{formatTime(snap.timestamp)}</p>
                            </div>
                        </div>
                        {isMe && (snap.isPrivate ? <Lock size={18} className="text-orange-300"/> : <Globe size={18} className="text-teal-300"/>)}
                    </div>

                    {/* Image */}
                    <div className="relative aspect-[4/5] bg-gray-100 mx-3 rounded-[2rem] overflow-hidden">
                        <img src={snap.imageUrl} alt={snap.note} className="w-full h-full object-cover" loading="lazy" />
                        
                        {/* AI Insight Badge - Floating Bubble */}
                        {snap.aiData?.insight && (
                            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xl p-4 rounded-2xl border border-white/50 shadow-lg flex gap-3">
                                <Sparkles size={20} className="text-yellow-500 shrink-0 mt-0.5 fill-yellow-500" />
                                <p className="text-xs font-bold text-gray-800 leading-relaxed">"{snap.aiData.insight}"</p>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {snap.note && <p className="text-xl font-bold text-gray-900 mb-4 leading-snug">{snap.note}</p>}
                        
                        <div className="flex flex-wrap gap-2 mb-6">
                            {snap.tags.map(tag => (
                                <span key={tag} className="px-3 py-1.5 bg-gray-50 text-gray-500 text-[11px] uppercase font-extrabold tracking-wider rounded-lg border border-gray-100">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Reactions Section */}
                        <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-2">
                                {snap.reactions.map((reaction, idx) => (
                                    <div key={idx} className="bg-pink-50 text-pink-600 px-3 py-1.5 rounded-xl text-xs font-bold border border-pink-100 shadow-sm animate-in zoom-in duration-300">
                                        {reaction.type}
                                    </div>
                                ))}
                            </div>

                            {/* React Button & Popover */}
                            <div className="relative">
                                <button 
                                    onClick={() => setReactionPickerOpen(reactionPickerOpen === snap.id ? null : snap.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all border-2 ${reactionPickerOpen === snap.id ? 'bg-gray-900 text-white border-gray-900' : 'text-gray-400 hover:text-teal-600 bg-white border-gray-100'}`}
                                >
                                    <SmilePlus size={20} /> <span className="text-xs font-bold">React</span>
                                </button>

                                {reactionPickerOpen === snap.id && (
                                    <div className="absolute bottom-full right-0 mb-3 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 flex gap-1 animate-in slide-in-from-bottom-2 duration-200 z-20 min-w-[220px]">
                                        {REACTION_OPTIONS.map(emoji => (
                                            <button 
                                                key={emoji}
                                                onClick={() => handleReactionClick(snap.id, emoji)}
                                                className="px-3 py-2 hover:bg-gray-50 rounded-xl text-xs font-bold whitespace-nowrap transition-colors"
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )})}
        </div>
      )}
      
      {/* Spacer for bottom nav */}
      <div className="h-12"></div>
    </div>
  );
};

export default FeedView;