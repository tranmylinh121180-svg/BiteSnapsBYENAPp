import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import CameraView from './components/CameraView';
import FeedView from './components/FeedView';
import WrappedView from './components/WrappedView';
import ChallengesView from './components/ChallengesView';
import OnboardingView from './components/OnboardingView';
import ProfileView from './components/ProfileView';
import { ViewState, Snap, UserProfile, Friend, ReactionType } from './types';

// Mock Data Generators
const MOCK_FRIENDS: Friend[] = [
  { id: 'f1', name: 'Alex', avatar: 'https://i.pravatar.cc/150?u=a', isMutual: true },
  { id: 'f2', name: 'Jordan', avatar: 'https://i.pravatar.cc/150?u=j', isMutual: true },
  { id: 'f3', name: 'Casey', avatar: 'https://i.pravatar.cc/150?u=c', isMutual: false },
];

const MOCK_SNAPS: Snap[] = [
  {
    id: 'mock-1',
    userId: 'me',
    timestamp: Date.now() - 1000 * 60 * 60 * 4,
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80', // Veggie salad
    note: 'Quick lunch between classes',
    tags: ['Noodles', 'Veggie', 'Healthy'],
    isPrivate: false,
    reactions: [],
    aiData: {
      foodName: 'Vegetable Stir Fry',
      tags: ['Noodles', 'Veggie', 'Healthy'],
      insight: 'Great balance of greens today!',
      healthyScore: 8,
      isFried: true,
      isSweet: false,
      isVeg: true
    }
  },
  {
    id: 'mock-2',
    userId: 'me',
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
    imageUrl: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&q=80', // Cake
    note: 'Cheat day treat 🍓',
    tags: ['Sweet', 'Fruit', 'Dessert'],
    isPrivate: true,
    reactions: [],
    aiData: {
      foodName: 'Cheesecake',
      tags: ['Sweet', 'Fruit', 'Dessert'],
      insight: 'Remember to hydrate after sweets.',
      healthyScore: 4,
      isFried: false,
      isSweet: true,
      isVeg: true
    }
  },
  {
    id: 'mock-3',
    userId: 'me',
    timestamp: Date.now() - 1000 * 60 * 60 * 48,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80', // Burger
    note: 'Late night cravings',
    tags: ['Burger', 'Fast Food', 'Late Night'],
    isPrivate: false,
    reactions: [],
    aiData: {
      foodName: 'Cheeseburger',
      tags: ['Burger', 'Meat', 'Fried'],
      insight: 'A hearty meal!',
      healthyScore: 3,
      isFried: true,
      isSweet: false,
      isVeg: false
    }
  },
  {
    id: 'mock-f1',
    userId: 'f1',
    userName: 'Alex',
    userAvatar: 'https://i.pravatar.cc/150?u=a',
    timestamp: Date.now() - 1000 * 60 * 30, // 30 mins ago
    imageUrl: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=800&q=80',
    note: 'Homemade strawberry smoothie',
    tags: ['Fruit', 'Healthy', 'Drink'],
    isPrivate: false,
    reactions: [{ id: 'r1', userId: 'f2', userName: 'Jordan', type: '🔥 Yum' }],
    aiData: {
      foodName: 'Strawberry Smoothie',
      tags: ['Fruit', 'Healthy', 'Drink'],
      insight: 'Perfect start to the day.',
      healthyScore: 9,
      isFried: false,
      isSweet: true,
      isVeg: true
    }
  }
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.ONBOARDING);
  const [snaps, setSnaps] = useState<Snap[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    // Check for existing user
    const savedUser = localStorage.getItem('bitesnap_user');
    const savedSnaps = localStorage.getItem('bitesnap_snaps');
    const savedFriends = localStorage.getItem('bitesnap_friends');

    if (savedSnaps) {
      setSnaps(JSON.parse(savedSnaps));
    } else {
      setSnaps(MOCK_SNAPS);
    }

    if (savedFriends) {
      setFriends(JSON.parse(savedFriends));
    } else {
      setFriends(MOCK_FRIENDS);
    }

    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentView(ViewState.FEED);
    } else {
      setCurrentView(ViewState.ONBOARDING);
    }
  }, []);

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUser(profile);
    localStorage.setItem('bitesnap_user', JSON.stringify(profile));
    localStorage.setItem('bitesnap_friends', JSON.stringify(MOCK_FRIENDS)); // Init mock friends
    setFriends(MOCK_FRIENDS);
    setCurrentView(ViewState.CAMERA); // Direct to camera after onboarding
  };

  const handleSaveSnap = (newSnap: Snap) => {
    // Ensure new snap has userId
    const snapWithUser = { ...newSnap, userId: 'me' };
    const updatedSnaps = [snapWithUser, ...snaps];
    setSnaps(updatedSnaps);
    localStorage.setItem('bitesnap_snaps', JSON.stringify(updatedSnaps));
    setCurrentView(ViewState.FEED);
  };

  const handleAddFriend = (name: string) => {
    const newFriend: Friend = {
      id: crypto.randomUUID(),
      name,
      avatar: `https://ui-avatars.com/api/?name=${name}&background=random`,
      isMutual: false
    };
    const updatedFriends = [...friends, newFriend];
    setFriends(updatedFriends);
    localStorage.setItem('bitesnap_friends', JSON.stringify(updatedFriends));
  };

  const handleRemoveFriend = (friendId: string) => {
    const updatedFriends = friends.filter(f => f.id !== friendId);
    setFriends(updatedFriends);
    localStorage.setItem('bitesnap_friends', JSON.stringify(updatedFriends));
  };

  const handleResetData = () => {
    localStorage.removeItem('bitesnap_user');
    localStorage.removeItem('bitesnap_snaps');
    localStorage.removeItem('bitesnap_friends');
    window.location.reload();
  };

  const handleReaction = (snapId: string, reactionType: ReactionType) => {
    if (!user) return;
    
    setSnaps(prevSnaps => prevSnaps.map(snap => {
      if (snap.id === snapId) {
        // Simple logic: add if not exists
        const newReaction = {
            id: crypto.randomUUID(),
            userId: user.id,
            userName: user.name,
            type: reactionType
        };
        return { ...snap, reactions: [...snap.reactions, newReaction] };
      }
      return snap;
    }));
  };

  if (currentView === ViewState.ONBOARDING) {
    return <OnboardingView onComplete={handleOnboardingComplete} />;
  }

  if (currentView === ViewState.CAMERA) {
    return (
        <div className="h-screen bg-black max-w-md mx-auto shadow-2xl overflow-hidden">
            <CameraView onSave={handleSaveSnap} onCancel={() => setCurrentView(ViewState.FEED)} />
        </div>
    );
  }

  // Filter snaps based on privacy and friends
  const visibleSnaps = snaps.filter(snap => {
    if (snap.userId === 'me') return true;
    const isFriend = friends.some(f => f.id === snap.userId);
    return isFriend && !snap.isPrivate;
  });

  return (
    <Layout currentView={currentView} onChangeView={setCurrentView}>
      {currentView === ViewState.FEED && (
        <FeedView 
          snaps={visibleSnaps} 
          onReact={handleReaction} 
          currentUserId="me"
        />
      )}
      
      {currentView === ViewState.WRAPPED && (
        <WrappedView snaps={snaps.filter(s => s.userId === 'me')} />
      )}
      
      {currentView === ViewState.CHALLENGES && (
        <ChallengesView snaps={snaps.filter(s => s.userId === 'me')} />
      )}
      
      {currentView === ViewState.PROFILE && (
        <ProfileView 
          user={user} 
          friends={friends} 
          onAddFriend={handleAddFriend}
          onRemoveFriend={handleRemoveFriend}
          onResetData={handleResetData}
        />
      )}
    </Layout>
  );
};

export default App;