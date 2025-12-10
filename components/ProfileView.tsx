import React, { useState } from 'react';
import { UserProfile, Friend } from '../types';
import { QrCode, Search, UserPlus, Trash2, Share2, Copy, Check, RotateCcw } from 'lucide-react';

interface ProfileViewProps {
  user: UserProfile | null;
  friends: Friend[];
  onAddFriend: (name: string) => void;
  onRemoveFriend: (id: string) => void;
  onResetData: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, friends, onAddFriend, onRemoveFriend, onResetData }) => {
  const [activeTab, setActiveTab] = useState<'friends' | 'code'>('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleCopyCode = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAdd = () => {
    if (searchQuery.trim()) {
      onAddFriend(searchQuery);
      setSearchQuery('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#FFF0F5]">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-8 border-b border-gray-100 shadow-sm z-10 rounded-b-[2.5rem]">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-teal-400 to-teal-600 p-1 shadow-lg">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center border-4 border-[#FFF0F5]">
                 <span className="text-3xl font-black text-teal-600">{user?.name.charAt(0).toUpperCase()}</span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">{user?.name}</h1>
              <span className="px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded-full capitalize border border-teal-100">{user?.goal} Goal</span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-gray-100 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveTab('friends')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
              activeTab === 'friends' ? 'bg-white text-gray-900 shadow-md transform scale-100' : 'text-gray-400'
            }`}
          >
            Squad ({friends.length})
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
              activeTab === 'code' ? 'bg-white text-gray-900 shadow-md transform scale-100' : 'text-gray-400'
            }`}
          >
            My Code
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 pb-32">
        {activeTab === 'friends' ? (
          <div className="space-y-8">
            {/* Add Friend */}
            <div className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-white">
              <h3 className="text-xs font-black text-gray-300 uppercase tracking-widest mb-3 ml-2">Find Friends</h3>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Username..."
                    className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-3 pl-11 pr-4 text-sm font-bold focus:outline-none focus:bg-white focus:border-teal-100 transition-all text-gray-900 placeholder-gray-400"
                  />
                </div>
                <button 
                  onClick={handleAdd}
                  disabled={!searchQuery.trim()}
                  className="bg-gray-900 text-white px-4 rounded-2xl disabled:opacity-50 active:scale-95 transition-all shadow-lg"
                >
                  <UserPlus size={20} />
                </button>
              </div>
            </div>

            {/* Friend List */}
            <div>
              <h3 className="text-xs font-black text-gray-300 uppercase tracking-widest mb-3 ml-2">Your Squad</h3>
              <div className="space-y-3">
                {friends.map((friend) => (
                  <div key={friend.id} className="flex items-center justify-between bg-white p-3 pr-4 rounded-[2rem] border border-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <img src={friend.avatar} alt={friend.name} className="w-14 h-14 rounded-full object-cover border-4 border-gray-50" />
                      <div>
                        <p className="text-base font-bold text-gray-900">{friend.name}</p>
                        {friend.isMutual && <p className="text-[10px] text-teal-600 font-black bg-teal-50 px-2 py-0.5 rounded-full inline-block mt-0.5">MUTUAL</p>}
                      </div>
                    </div>
                    <button 
                        onClick={() => onRemoveFriend(friend.id)}
                        className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-3 rounded-full transition-all group"
                        title="Remove friend"
                    >
                      <Trash2 size={20} className="group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                ))}
                {friends.length === 0 && (
                   <div className="text-center py-12 bg-white/50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
                     <p className="text-gray-400 font-bold">No friends yet. Add someone!</p>
                   </div>
                )}
              </div>
            </div>

            {/* Data Zone */}
            <div className="pt-8 border-t border-gray-200/50">
                {!showResetConfirm ? (
                    <button 
                        onClick={() => setShowResetConfirm(true)}
                        className="w-full py-4 text-red-400 font-bold text-sm bg-red-50 rounded-[2rem] hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                    >
                        <RotateCcw size={16} /> Reset App Data
                    </button>
                ) : (
                    <div className="bg-red-50 p-6 rounded-[2.5rem] text-center animate-in fade-in zoom-in duration-200">
                        <p className="text-red-800 font-bold mb-4 text-sm">Are you sure? This deletes everything.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowResetConfirm(false)} className="flex-1 bg-white text-gray-600 py-3 rounded-2xl font-bold text-sm shadow-sm">Cancel</button>
                            <button onClick={onResetData} className="flex-1 bg-red-500 text-white py-3 rounded-2xl font-bold text-sm shadow-lg shadow-red-200">Yes, Reset</button>
                        </div>
                    </div>
                )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full pb-10">
            <div className="bg-white p-8 rounded-[3rem] shadow-xl border-4 border-white text-center w-full max-w-[320px] relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-teal-400 to-teal-600"></div>
               
               <div className="mb-8 mt-4">
                 <div className="w-28 h-28 rounded-full bg-gray-100 mx-auto mb-4 overflow-hidden border-8 border-[#FFF0F5] shadow-inner group-hover:scale-105 transition-transform duration-500">
                    <div className="w-full h-full bg-teal-500 flex items-center justify-center text-white text-5xl font-black">
                        {user?.name.charAt(0).toUpperCase()}
                    </div>
                 </div>
                 <h2 className="text-3xl font-black text-gray-900 tracking-tight">@{user?.name.toLowerCase().replace(/\s/g, '')}</h2>
                 <p className="text-sm text-gray-400 font-bold mt-1 uppercase tracking-wide">Scan to add me!</p>
               </div>

               <div className="bg-gray-900 p-6 rounded-[2rem] inline-block mb-8 shadow-2xl">
                  <QrCode size={150} className="text-white" />
               </div>

               <div className="flex gap-3">
                 <button 
                    onClick={handleCopyCode}
                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-gray-50 text-gray-700 rounded-2xl text-xs font-black uppercase tracking-wide hover:bg-gray-100 transition-colors"
                 >
                   {copied ? <Check size={16} className="text-green-600"/> : <Copy size={16} />}
                   {copied ? 'Copied' : 'Copy'}
                 </button>
                 <button className="flex-1 flex items-center justify-center gap-2 py-4 bg-teal-50 text-teal-700 rounded-2xl text-xs font-black uppercase tracking-wide hover:bg-teal-100 transition-colors">
                   <Share2 size={16} /> Share
                 </button>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileView;