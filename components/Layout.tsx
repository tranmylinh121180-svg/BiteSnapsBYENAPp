import React from 'react';
import { Camera, Home, PieChart, Award, User } from 'lucide-react';
import { ViewState } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, onChangeView }) => {
  return (
    <div className="flex flex-col h-screen bg-[#FFF0F5] max-w-md mx-auto shadow-2xl overflow-hidden relative">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-28">
        {children}
      </main>

      {/* Floating Bottom Navigation */}
      <nav className="fixed bottom-6 left-6 right-6 bg-white/90 backdrop-blur-xl border border-white/50 px-4 py-3 flex justify-between items-center z-50 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.08)] max-w-[calc(28rem-3rem)] mx-auto">
        <button
          onClick={() => onChangeView(ViewState.FEED)}
          className={`p-3 rounded-full transition-all duration-300 ${currentView === ViewState.FEED ? 'bg-teal-100 text-teal-600' : 'text-gray-400 hover:bg-gray-50'}`}
        >
          <Home size={24} strokeWidth={2.5} />
        </button>

        <button
          onClick={() => onChangeView(ViewState.CHALLENGES)}
          className={`p-3 rounded-full transition-all duration-300 ${currentView === ViewState.CHALLENGES ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:bg-gray-50'}`}
        >
          <Award size={24} strokeWidth={2.5} />
        </button>

        {/* Primary Camera Action */}
        <div className="relative -top-8 mx-2">
            <button
            onClick={() => onChangeView(ViewState.CAMERA)}
            className="group flex items-center justify-center w-16 h-16 rounded-full shadow-[0_10px_20px_rgba(13,148,136,0.3)] transition-transform active:scale-95 bg-gradient-to-tr from-teal-400 to-teal-500 border-4 border-[#FFF0F5]"
            >
            <Camera size={28} className="text-white" />
            </button>
        </div>

        <button
          onClick={() => onChangeView(ViewState.WRAPPED)}
          className={`p-3 rounded-full transition-all duration-300 ${currentView === ViewState.WRAPPED ? 'bg-orange-100 text-orange-600' : 'text-gray-400 hover:bg-gray-50'}`}
        >
          <PieChart size={24} strokeWidth={2.5} />
        </button>

        <button
            onClick={() => onChangeView(ViewState.PROFILE)}
            className={`p-3 rounded-full transition-all duration-300 ${currentView === ViewState.PROFILE ? 'bg-pink-100 text-pink-600' : 'text-gray-400 hover:bg-gray-50'}`}
        >
           <User size={24} strokeWidth={2.5} />
        </button>
      </nav>
    </div>
  );
};

export default Layout;