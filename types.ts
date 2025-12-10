export enum ViewState {
  ONBOARDING = 'ONBOARDING',
  CAMERA = 'CAMERA',
  FEED = 'FEED',
  WRAPPED = 'WRAPPED',
  CHALLENGES = 'CHALLENGES',
  PROFILE = 'PROFILE'
}

export interface UserProfile {
  id: string;
  name: string;
  goal: 'awareness' | 'health' | 'social' | 'other';
  joinedAt: number;
}

export interface AIAnalysisResult {
  foodName: string;
  tags: string[];
  insight: string;
  healthyScore: number; // 1-10 for internal logic
  isFried: boolean;
  isSweet: boolean;
  isVeg: boolean;
}

export type ReactionType = '🔥 Yum' | '🥺 Cute' | '💅 Iconic' | '🥗 Healthy';

export interface Reaction {
  id: string;
  userId: string;
  userName: string;
  type: ReactionType;
}

export interface Snap {
  id: string;
  userId: string; // 'me' or friend ID
  userName?: string;
  userAvatar?: string;
  timestamp: number;
  imageUrl: string;
  note: string;
  tags: string[];
  isPrivate: boolean;
  aiData?: AIAnalysisResult;
  reactions: Reaction[];
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  reward: string;
  joined: boolean;
  progress: number; // 0 to 100
  image: string;
  category: 'daily' | 'group' | 'sponsored' | 'personalized';
  color?: string; // For bubbly UI
}

export interface UserStats {
  totalSnaps: number;
  diversityScore: number;
  topTags: { name: string; count: number }[];
  streakDays: number;
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  isMutual: boolean;
}

// New Types for Advanced Wrapped
export type PersonaType = 'The Sweet Tooth' | 'The Rabbit King' | 'The Vampire' | 'The Foodie Explorer' | 'The Balanced Guru' | 'The Caffeine Addict';

export interface WrappedInsight {
  type: 'concern' | 'praise' | 'suggestion';
  message: string;
  icon: string;
}