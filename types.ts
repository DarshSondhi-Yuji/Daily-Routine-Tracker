export type PresetType = 'student' | 'gym' | 'work' | 'general';

export interface UserStats {
  name: string;
  preset: PresetType;
  level: number;
  xp: number;
  streak: number;
  lastCompletedDate: string | null; // For streak tracking
  totalXpEarned: number;
  totalTasksCompleted: number;
  waterIntake: number; // glasses of water today
  goldCubes: number;       // Inbuilt shop currency
  totalGoldCubes: number;  // Career gold cubes earned
  unlockedThemes: string[]; // Theme IDs unlocked
  activeTheme: string;     // Theme ID applied
  profilePin?: string;       // 4-digit passcode e.g. "1234"
  profilePinEnabled?: boolean; // Whether PIN lock is active on suspension/reload
}

export interface RoutineItem {
  id: string;
  title: string;
  timeSlot: string; // e.g. "07:30"
  category: 'morning' | 'afternoon' | 'evening';
  completed: boolean;
  xpValue: number;
}

export interface PriorityItem {
  id: string;
  title: string;
  difficulty: 'high' | 'medium' | 'low';
  completed: boolean;
  xpValue: number;
}

export interface MealItem {
  id: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  calories: string; // optional input
  protein: string; // optional input
  xpValue: number;
  completed: boolean;
}

export interface TimeTrackSession {
  id: string;
  title: string;
  durationSeconds: number;
  xpEarned: number;
  timestamp: string;
}

export interface PresetData {
  title: string;
  description: string;
  icon: string;
  routines: Omit<RoutineItem, 'id' | 'completed'>[];
  priorities: Omit<PriorityItem, 'id' | 'completed'>[];
  meals: Omit<MealItem, 'id' | 'completed'>[];
}

export interface CalendarEvent {
  id: string;
  dateStr: string; // e.g. "2026-06-18" or Date.toDateString()
  title: string;
  category: 'academic' | 'fitness' | 'personal' | 'social' | 'deadline' | 'other';
}
