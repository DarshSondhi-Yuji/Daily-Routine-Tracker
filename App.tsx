import React, { useState, useEffect, useRef } from 'react';
import { 
  UserStats, 
  PresetType, 
  RoutineItem, 
  PriorityItem, 
  MealItem, 
  TimeTrackSession,
  CalendarEvent
} from './types';
import TabCalendar from './components/TabCalendar';
import { PRESETS } from './presetData';
import Header from './components/Header';
import PresetSelector from './components/PresetSelector';
import TabRoutine from './components/TabRoutine';
import TabPriorities from './components/TabPriorities';
import TabMeals from './components/TabMeals';
import TabTimeTracker from './components/TabTimeTracker';
import TabShop from './components/TabShop';
import TabSettings from './components/TabSettings';
import LockScreen from './components/LockScreen';
import DailyReport from './components/DailyReport';
import { THEMES } from './themes';
import { 
  Clock, 
  Flame, 
  Sparkles, 
  Utensils, 
  Target, 
  Award, 
  TrendingUp,
  Droplet,
  Shuffle,
  ShoppingBag,
  Calendar,
  Cloud,
  RefreshCw,
  Copy,
  Check,
  Laptop,
  Key,
  Settings,
  Shield,
  Lock,
  Unlock,
  Download,
  Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const starrySkyBgImage = new URL('./assets/images/starry_sky_banner_1781842319659.jpg', import.meta.url).href;

// ==========================================================================
// JUJUTSU KAISEN (BLACK FLASH / KOKUSEN) PROCEDURAL SYNTHESIZERS
// ==========================================================================

const playBlackFlashSound = () => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    
    // Impact sweep
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(450, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.35);
    
    gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(700, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.35);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Crackle noise band represent lightning energy
    const bufferSize = ctx.sampleRate * 0.3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(2200, ctx.currentTime);
    
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.18, ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    osc.start();
    noise.start();
    
    osc.stop(ctx.currentTime + 0.45);
    noise.stop(ctx.currentTime + 0.45);
  } catch (e) {
    console.warn("Web Audio failed:", e);
  }
};

const playBigKokusenSound = () => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // 1. Rising charging frequency sweep
    const charge = ctx.createOscillator();
    const chargeGain = ctx.createGain();
    charge.type = 'triangle';
    charge.frequency.setValueAtTime(90, ctx.currentTime);
    charge.frequency.linearRampToValueAtTime(750, ctx.currentTime + 0.4);
    chargeGain.gain.setValueAtTime(0.01, ctx.currentTime);
    chargeGain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.35);
    
    charge.connect(chargeGain);
    chargeGain.connect(ctx.destination);
    charge.start();
    charge.stop(ctx.currentTime + 0.4);

    // 2. Shockwave detonation
    setTimeout(() => {
      const boom = ctx.createOscillator();
      const boomGain = ctx.createGain();
      boom.type = 'sawtooth';
      boom.frequency.setValueAtTime(150, ctx.currentTime);
      boom.frequency.exponentialRampToValueAtTime(25, ctx.currentTime + 1.3);
      
      boomGain.gain.setValueAtTime(0.85, ctx.currentTime);
      boomGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4);
      
      const boomFilter = ctx.createBiquadFilter();
      boomFilter.type = 'lowpass';
      boomFilter.frequency.setValueAtTime(130, ctx.currentTime);
      
      boom.connect(boomFilter);
      boomFilter.connect(boomGain);
      boomGain.connect(ctx.destination);
      boom.start();
      boom.stop(ctx.currentTime + 1.5);

      const shockGain = ctx.createGain();
      shockGain.gain.setValueAtTime(0.4, ctx.currentTime);
      shockGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.95);

      const bufferSize = ctx.sampleRate * 1.0;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(350, ctx.currentTime);
      bandpass.frequency.exponentialRampToValueAtTime(1300, ctx.currentTime + 0.55);

      noise.connect(bandpass);
      bandpass.connect(shockGain);
      shockGain.connect(ctx.destination);
      noise.start();
      noise.stop(ctx.currentTime + 1.1);
    }, 400);

  } catch (e) {
    console.warn("Kokusen voice failed to play:", e);
  }
};

const playThemedSmallSound = (themeId: string) => {
  if (themeId === 'jujutsu-yuji') {
    playBlackFlashSound();
    return;
  }
  
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    switch (themeId) {
      case 'classic-void':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.3);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.35, ctx.currentTime);
        break;
        
      case 'cyber-grid':
        osc.type = 'square';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.25);
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(1200, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
        break;
        
      case 'star-nebula':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(520, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(260, ctx.currentTime + 0.4);
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(600, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.35, ctx.currentTime);
        break;
        
      case 'retrowave-80':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + 0.35);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.28, ctx.currentTime);
        break;
        
      case 'solar-harvest':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(640, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.3);
        filter.type = 'peaking';
        filter.frequency.setValueAtTime(800, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.28, ctx.currentTime);
        break;
        
      case 'glacial-aurora':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.22);
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(1800, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.22, ctx.currentTime);
        break;
        
      case 'sovereign-ruby':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(392, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(196, ctx.currentTime + 0.4);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
        
        // High chime
        const subOsc = ctx.createOscillator();
        const subGain = ctx.createGain();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(980, ctx.currentTime);
        subOsc.frequency.exponentialRampToValueAtTime(490, ctx.currentTime + 0.3);
        subGain.gain.setValueAtTime(0.12, ctx.currentTime);
        subGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        subOsc.connect(subGain);
        subGain.connect(ctx.destination);
        subOsc.start();
        subOsc.stop(ctx.currentTime + 0.3);
        break;
        
      default:
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
    }
    
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
    
    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.45);
  } catch (e) {
    console.warn("Themed Web Audio failed:", e);
  }
};

const playThemedBigSound = (themeId: string) => {
  if (themeId === 'jujutsu-yuji') {
    playBigKokusenSound();
    return;
  }
  
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    
    const charger = ctx.createOscillator();
    const chargerGain = ctx.createGain();
    
    charger.frequency.setValueAtTime(120, ctx.currentTime);
    chargerGain.gain.setValueAtTime(0.01, ctx.currentTime);
    
    if (themeId === 'cyber-grid') {
      charger.type = 'square';
      charger.frequency.linearRampToValueAtTime(960, ctx.currentTime + 0.4);
      chargerGain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.38);
    } else if (themeId === 'glacial-aurora') {
      charger.type = 'sine';
      charger.frequency.linearRampToValueAtTime(1500, ctx.currentTime + 0.45);
      chargerGain.gain.exponentialRampToValueAtTime(0.22, ctx.currentTime + 0.42);
    } else if (themeId === 'sovereign-ruby' || themeId === 'solar-harvest') {
      charger.type = 'sawtooth';
      charger.frequency.linearRampToValueAtTime(580, ctx.currentTime + 0.5);
      chargerGain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.45);
    } else {
      charger.type = 'triangle';
      charger.frequency.linearRampToValueAtTime(650, ctx.currentTime + 0.45);
      chargerGain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.35);
    }
    
    charger.connect(chargerGain);
    chargerGain.connect(ctx.destination);
    charger.start();
    charger.stop(ctx.currentTime + 0.5);
    
    setTimeout(() => {
      const boom = ctx.createOscillator();
      const boomGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      
      switch (themeId) {
        case 'classic-void':
          boom.type = 'triangle';
          boom.frequency.setValueAtTime(180, ctx.currentTime);
          boom.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 1.25);
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(250, ctx.currentTime);
          boomGain.gain.setValueAtTime(0.65, ctx.currentTime);
          break;
          
        case 'cyber-grid':
          boom.type = 'sawtooth';
          boom.frequency.setValueAtTime(480, ctx.currentTime);
          boom.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 1.15);
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(600, ctx.currentTime);
          boomGain.gain.setValueAtTime(0.5, ctx.currentTime);

          // High frequency neon glitch sweep
          try {
            const glitchOsc = ctx.createOscillator();
            const glitchGain = ctx.createGain();
            glitchOsc.type = 'square';
            glitchOsc.frequency.setValueAtTime(1440, ctx.currentTime);
            glitchOsc.frequency.exponentialRampToValueAtTime(720, ctx.currentTime + 0.6);
            glitchGain.gain.setValueAtTime(0.12, ctx.currentTime);
            glitchGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
            glitchOsc.connect(glitchGain);
            glitchGain.connect(ctx.destination);
            glitchOsc.start();
            glitchOsc.stop(ctx.currentTime + 0.6);
          } catch (e) {
            // fail-silent
          }
          break;
          
        case 'star-nebula':
          boom.type = 'sine';
          boom.frequency.setValueAtTime(360, ctx.currentTime);
          boom.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 1.4);
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(400, ctx.currentTime);
          boomGain.gain.setValueAtTime(0.7, ctx.currentTime);
          
          const starOsc = ctx.createOscillator();
          const starGain = ctx.createGain();
          starOsc.type = 'sine';
          starOsc.frequency.setValueAtTime(1180, ctx.currentTime);
          starGain.gain.setValueAtTime(0.18, ctx.currentTime);
          starGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
          starOsc.connect(starGain);
          starGain.connect(ctx.destination);
          starOsc.start();
          starOsc.stop(ctx.currentTime + 1.25);
          break;
          
        case 'retrowave-80':
          boom.type = 'sawtooth';
          boom.frequency.setValueAtTime(294, ctx.currentTime);
          boom.frequency.exponentialRampToValueAtTime(73, ctx.currentTime + 1.5);
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(900, ctx.currentTime);
          filter.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 1.3);
          boomGain.gain.setValueAtTime(0.6, ctx.currentTime);
          break;
          
        case 'solar-harvest':
          boom.type = 'sawtooth';
          boom.frequency.setValueAtTime(523, ctx.currentTime);
          boom.frequency.exponentialRampToValueAtTime(130, ctx.currentTime + 1.2);
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(1800, ctx.currentTime);
          filter.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 1.0);
          boomGain.gain.setValueAtTime(0.65, ctx.currentTime);
          break;
          
        case 'glacial-aurora':
          boom.type = 'sine';
          boom.frequency.setValueAtTime(987, ctx.currentTime);
          boom.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 1.3);
          filter.type = 'highpass';
          filter.frequency.setValueAtTime(1500, ctx.currentTime);
          boomGain.gain.setValueAtTime(0.5, ctx.currentTime);
          
          const frostOsc = ctx.createOscillator();
          const frostGain = ctx.createGain();
          frostOsc.type = 'triangle';
          frostOsc.frequency.setValueAtTime(1500, ctx.currentTime);
          frostGain.gain.setValueAtTime(0.2, ctx.currentTime);
          frostGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
          frostOsc.connect(frostGain);
          frostGain.connect(ctx.destination);
          frostOsc.start();
          frostOsc.stop(ctx.currentTime + 0.85);
          break;
          
        case 'sovereign-ruby':
          boom.type = 'triangle';
          boom.frequency.setValueAtTime(329, ctx.currentTime);
          boom.frequency.exponentialRampToValueAtTime(82, ctx.currentTime + 1.6);
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(800, ctx.currentTime);
          boomGain.gain.setValueAtTime(0.8, ctx.currentTime);
          
          const third = ctx.createOscillator();
          const fifth = ctx.createOscillator();
          const chordGain = ctx.createGain();
          third.type = 'sine'; third.frequency.setValueAtTime(415, ctx.currentTime);
          fifth.type = 'sine'; fifth.frequency.setValueAtTime(494, ctx.currentTime);
          chordGain.gain.setValueAtTime(0.22, ctx.currentTime);
          chordGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4);
          third.connect(chordGain);
          fifth.connect(chordGain);
          chordGain.connect(ctx.destination);
          third.start(); fifth.start();
          third.stop(ctx.currentTime + 1.5); fifth.stop(ctx.currentTime + 1.5);
          break;
          
        default:
          boom.type = 'sine';
          boom.frequency.setValueAtTime(220, ctx.currentTime);
          boom.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + 1.1);
          boomGain.gain.setValueAtTime(0.45, ctx.currentTime);
      }
      
      boomGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.6);
      
      boom.connect(filter);
      filter.connect(boomGain);
      boomGain.connect(ctx.destination);
      
      boom.start();
      boom.stop(ctx.currentTime + 1.7);
    }, 450);
  } catch (e) {
    console.warn("Themed Web Audio grand failed:", e);
  }
};

export default function App() {
  // Stats and user profile
  const [stats, setStats] = useState<UserStats | null>(() => {
    try {
      const stored = localStorage.getItem('drt_stats');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  
  // Lists and collections
  const [routines, setRoutines] = useState<RoutineItem[]>(() => {
    try {
      const stored = localStorage.getItem('drt_routines');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [priorities, setPriorities] = useState<PriorityItem[]>(() => {
    try {
      const stored = localStorage.getItem('drt_priorities');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [meals, setMeals] = useState<MealItem[]>(() => {
    try {
      const stored = localStorage.getItem('drt_meals');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [sessions, setSessions] = useState<TimeTrackSession[]>(() => {
    try {
      const stored = localStorage.getItem('drt_sessions');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    try {
      const stored = localStorage.getItem('drt_events');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Animation states for Black Flash
  const [blackFlashActive, setBlackFlashActive] = useState(false);
  const [bigBlackFlashActive, setBigBlackFlashActive] = useState(false);
  const [lightningCracks, setLightningCracks] = useState<{ x1: number; y1: number; x2: number; y2: number; color: string }[]>([]);
  const [latestCompletionPercent, setLatestCompletionPercent] = useState<number>(0);

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'routine' | 'calendar' | 'priorities' | 'meals' | 'focus' | 'shop' | 'settings'>('routine');

  // Gamification floating toasts
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'xp' | 'level' | 'info' }>({
    show: false,
    message: '',
    type: 'xp'
  });

  const [cloudUserId, setCloudUserId] = useState<string>('');
  const [loadingSession, setLoadingSession] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'pending' | 'error'>('synced');
  const [showSyncPanel, setShowSyncPanel] = useState<boolean>(false);
  const [backupKeyInput, setBackupKeyInput] = useState<string>('');
  const [keyCopied, setKeyCopied] = useState<boolean>(false);

  // Security Lock & PIN State
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [pinError, setPinError] = useState<boolean>(false);

  // Buffer structures for high-performance non-blocking synchronization
  const syncTimeoutRef = useRef<any>(null);
  const pendingChangesRef = useRef<Record<string, any>>({});
  const lastActiveRef = useRef<number>(Date.now());

  // Push local stats to cloud database
  const pushLocalToCloud = async (userId: string) => {
    try {
      const payload = {
        userId,
        stats: JSON.parse(localStorage.getItem('drt_stats') || 'null'),
        routines: JSON.parse(localStorage.getItem('drt_routines') || '[]'),
        priorities: JSON.parse(localStorage.getItem('drt_priorities') || '[]'),
        meals: JSON.parse(localStorage.getItem('drt_meals') || '[]'),
        sessions: JSON.parse(localStorage.getItem('drt_sessions') || '[]'),
        events: JSON.parse(localStorage.getItem('drt_events') || '[]'),
      };

      await fetch('/api/sync/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      setSyncStatus('synced');
    } catch {
      setSyncStatus('error');
    }
  };

  // Immediate flushing of pending saves (Guaranteed delivery engine)
  const flushPendingSaves = async () => {
    const currentUserId = localStorage.getItem('drt_userId') || cloudUserId;
    if (!currentUserId) return;

    // Do nothing if there are no pending changes to save, avoiding redundant firestore writes
    if (Object.keys(pendingChangesRef.current).length === 0) {
      setSyncStatus('synced');
      return;
    }

    setSyncStatus('pending');
    try {
      const payload = {
        userId: currentUserId,
        stats: pendingChangesRef.current['drt_stats'] !== undefined ? pendingChangesRef.current['drt_stats'] : JSON.parse(localStorage.getItem('drt_stats') || 'null'),
        routines: pendingChangesRef.current['drt_routines'] !== undefined ? pendingChangesRef.current['drt_routines'] : JSON.parse(localStorage.getItem('drt_routines') || '[]'),
        priorities: pendingChangesRef.current['drt_priorities'] !== undefined ? pendingChangesRef.current['drt_priorities'] : JSON.parse(localStorage.getItem('drt_priorities') || '[]'),
        meals: pendingChangesRef.current['drt_meals'] !== undefined ? pendingChangesRef.current['drt_meals'] : JSON.parse(localStorage.getItem('drt_meals') || '[]'),
        sessions: pendingChangesRef.current['drt_sessions'] !== undefined ? pendingChangesRef.current['drt_sessions'] : JSON.parse(localStorage.getItem('drt_sessions') || '[]'),
        events: pendingChangesRef.current['drt_events'] !== undefined ? pendingChangesRef.current['drt_events'] : JSON.parse(localStorage.getItem('drt_events') || '[]'),
      };

      const res = await fetch('/api/sync/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        pendingChangesRef.current = {};
        setSyncStatus('synced');
      } else {
        setSyncStatus('error');
      }
    } catch (err) {
      console.error("Cloud syncing queue flush error:", err);
      setSyncStatus('error');
    }
  };

  // Safe background cloud sync with smart queueing
  const syncToCloud = async (overrideData?: { key: string; data: any }) => {
    if (overrideData) {
      pendingChangesRef.current[overrideData.key] = overrideData.data;
    }
    setSyncStatus('pending');
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    syncTimeoutRef.current = setTimeout(() => {
      flushPendingSaves();
    }, 1500);
  };

  // Restore state from another device ID
  const handleRestoreFromKey = async (targetKey: string): Promise<boolean> => {
    if (!targetKey || targetKey.trim() === '') return false;
    const cleanKey = targetKey.trim();
    setIsSyncing(true);
    setSyncStatus('pending');
    try {
      const response = await fetch(`/api/sync/load?userId=${cleanKey}`);
      const result = await response.json();
      if (result.status === "success" && result.data) {
        const cloudData = result.data;
        
        // 1. Save new Key in local storage
        localStorage.setItem('drt_userId', cleanKey);
        setCloudUserId(cleanKey);

        // 2. Overwrite state and local storage
        if (cloudData.stats) {
          setStats(cloudData.stats);
          localStorage.setItem('drt_stats', JSON.stringify(cloudData.stats));
        }
        if (cloudData.routines) {
          setRoutines(cloudData.routines);
          localStorage.setItem('drt_routines', JSON.stringify(cloudData.routines));
        }
        if (cloudData.priorities) {
          setPriorities(cloudData.priorities);
          localStorage.setItem('drt_priorities', JSON.stringify(cloudData.priorities));
        }
        if (cloudData.meals) {
          setMeals(cloudData.meals);
          localStorage.setItem('drt_meals', JSON.stringify(cloudData.meals));
        }
        if (cloudData.sessions) {
          setSessions(cloudData.sessions);
          localStorage.setItem('drt_sessions', JSON.stringify(cloudData.sessions));
        }
        if (cloudData.events) {
          setEvents(cloudData.events);
          localStorage.setItem('drt_events', JSON.stringify(cloudData.events));
        }
        setSyncStatus('synced');
        triggerToast("Sync Restoration Successful!", "info");
        return true;
      } else {
        triggerToast("No backup found under that key.", "info");
        return false;
      }
    } catch {
      setSyncStatus('error');
      triggerToast("Network link failed. Try again.", "info");
      return false;
    } finally {
      setIsSyncing(false);
    }
  };

  // Load state on mount (restores Firestore cloud state dominant setup)
  useEffect(() => {
    const initializeAndLoad = async () => {
      // 1. Resolve active User ID for cloud syncing checking robust multi-channels
      let userId = localStorage.getItem('drt_userId') || sessionStorage.getItem('drt_userId');
      if (!userId) {
        const cookies = document.cookie.split(';');
        for (let c of cookies) {
          const [name, val] = c.trim().split('=');
          if (name === 'drt_userId' && val) {
            userId = decodeURIComponent(val);
            break;
          }
        }
      }

      if (!userId) {
        userId = 'user_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
      }

      localStorage.setItem('drt_userId', userId);
      sessionStorage.setItem('drt_userId', userId);
      document.cookie = `drt_userId=${encodeURIComponent(userId)}; path=/; max-age=31536000; SameSite=Lax`;

      setCloudUserId(userId);
      setIsSyncing(true);
      try {
        const response = await fetch(`/api/sync/load?userId=${userId}`);
        const result = await response.json();

        if (result.status === "success" && result.data) {
          // Cloud data exists! Dominant setup
          const cloudData = result.data;
          
          if (cloudData.stats) {
            setStats(cloudData.stats);
            localStorage.setItem('drt_stats', JSON.stringify(cloudData.stats));
            checkStreakAndUpdate(cloudData.stats);
            if (cloudData.stats.profilePinEnabled && cloudData.stats.profilePin) {
              setIsLocked(true);
            }
          }
          if (cloudData.routines) {
            setRoutines(cloudData.routines);
            localStorage.setItem('drt_routines', JSON.stringify(cloudData.routines));
          }
          if (cloudData.priorities) {
            setPriorities(cloudData.priorities);
            localStorage.setItem('drt_priorities', JSON.stringify(cloudData.priorities));
          }
          if (cloudData.meals) {
            setMeals(cloudData.meals);
            localStorage.setItem('drt_meals', JSON.stringify(cloudData.meals));
          }
          if (cloudData.sessions) {
            setSessions(cloudData.sessions);
            localStorage.setItem('drt_sessions', JSON.stringify(cloudData.sessions));
          }
          if (cloudData.events) {
            setEvents(cloudData.events);
            localStorage.setItem('drt_events', JSON.stringify(cloudData.events));
          }
          setSyncStatus('synced');
        } else {
          // No cloud data yet (new user). Check if local storage exists and push to cloud.
          const storedStats = localStorage.getItem('drt_stats');
          const storedRoutines = localStorage.getItem('drt_routines');
          const storedPriorities = localStorage.getItem('drt_priorities');
          const storedMeals = localStorage.getItem('drt_meals');
          const storedSessions = localStorage.getItem('drt_sessions');
          const storedEvents = localStorage.getItem('drt_events');

          if (storedStats) {
            const parsedStats = JSON.parse(storedStats) as UserStats;
            if (parsedStats.goldCubes === undefined) parsedStats.goldCubes = 15;
            if (parsedStats.totalGoldCubes === undefined) parsedStats.totalGoldCubes = 15;
            if (!parsedStats.unlockedThemes) {
              parsedStats.unlockedThemes = ['classic-void', 'jujutsu-yuji'];
            }
            if (!parsedStats.unlockedThemes.includes('jujutsu-yuji')) {
              parsedStats.unlockedThemes.push('jujutsu-yuji');
            }
            if (!parsedStats.activeTheme || parsedStats.activeTheme === 'classic-void') {
              parsedStats.activeTheme = 'jujutsu-yuji';
            }

            setStats(parsedStats);
            setRoutines(storedRoutines ? JSON.parse(storedRoutines) : []);
            setPriorities(storedPriorities ? JSON.parse(storedPriorities) : []);
            setMeals(storedMeals ? JSON.parse(storedMeals) : []);
            setSessions(storedSessions ? JSON.parse(storedSessions) : []);
            setEvents(storedEvents ? JSON.parse(storedEvents) : []);
            checkStreakAndUpdate(parsedStats);
            if (parsedStats.profilePinEnabled && parsedStats.profilePin) {
              setIsLocked(true);
            }
            await pushLocalToCloud(userId);
          }
        }
      } catch (err) {
        console.error("Failed to perform initial cloud synchronization:", err);
        setSyncStatus('error');
        
        // Fallback local storage parse on error
        const storedStats = localStorage.getItem('drt_stats');
        const storedRoutines = localStorage.getItem('drt_routines');
        const storedPriorities = localStorage.getItem('drt_priorities');
        const storedMeals = localStorage.getItem('drt_meals');
        const storedSessions = localStorage.getItem('drt_sessions');
        const storedEvents = localStorage.getItem('drt_events');

        if (storedStats) {
          const parsedStats = JSON.parse(storedStats) as UserStats;
          setStats(parsedStats);
          setRoutines(storedRoutines ? JSON.parse(storedRoutines) : []);
          setPriorities(storedPriorities ? JSON.parse(storedPriorities) : []);
          setMeals(storedMeals ? JSON.parse(storedMeals) : []);
          setSessions(storedSessions ? JSON.parse(storedSessions) : []);
          setEvents(storedEvents ? JSON.parse(storedEvents) : []);
          checkStreakAndUpdate(parsedStats);
          if (parsedStats.profilePinEnabled && parsedStats.profilePin) {
            setIsLocked(true);
          }
        }
      } finally {
        setIsSyncing(false);
        setLoadingSession(false);
      }
    };

    initializeAndLoad();
  }, []);

  // Sync state & PIN timeout recovery document event listeners
  useEffect(() => {
    const handleVisibilityAndLock = () => {
      if (document.visibilityState === 'hidden') {
        lastActiveRef.current = Date.now();
      } else {
        // App resumed! If PIN is enabled and they were away for > 45 seconds, trigger lock screen
        const storedStatsStr = localStorage.getItem('drt_stats');
        if (storedStatsStr) {
          try {
            const parsed = JSON.parse(storedStatsStr);
            if (parsed.profilePinEnabled && parsed.profilePin) {
              const secondsAway = (Date.now() - lastActiveRef.current) / 1000;
              if (secondsAway > 45) {
                setIsLocked(true);
                setEnteredPin('');
                triggerToast("Session locked for safety", "info");
              }
            }
          } catch (e) {
            console.error("PIN auto-lock validation failed:", e);
          }
        }
      }
    };

    const handleBeforeUnload = () => {
      const currentUserId = localStorage.getItem('drt_userId') || cloudUserId;
      if (!currentUserId || Object.keys(pendingChangesRef.current).length === 0) return;
      
      const payload = {
        userId: currentUserId,
        stats: pendingChangesRef.current['drt_stats'] !== undefined ? pendingChangesRef.current['drt_stats'] : JSON.parse(localStorage.getItem('drt_stats') || 'null'),
        routines: pendingChangesRef.current['drt_routines'] !== undefined ? pendingChangesRef.current['drt_routines'] : JSON.parse(localStorage.getItem('drt_routines') || '[]'),
        priorities: pendingChangesRef.current['drt_priorities'] !== undefined ? pendingChangesRef.current['drt_priorities'] : JSON.parse(localStorage.getItem('drt_priorities') || '[]'),
        meals: pendingChangesRef.current['drt_meals'] !== undefined ? pendingChangesRef.current['drt_meals'] : JSON.parse(localStorage.getItem('drt_meals') || '[]'),
        sessions: pendingChangesRef.current['drt_sessions'] !== undefined ? pendingChangesRef.current['drt_sessions'] : JSON.parse(localStorage.getItem('drt_sessions') || '[]'),
        events: pendingChangesRef.current['drt_events'] !== undefined ? pendingChangesRef.current['drt_events'] : JSON.parse(localStorage.getItem('drt_events') || '[]'),
        updatedAt: Date.now()
      };

      fetch('/api/sync/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      });
    };

    document.addEventListener('visibilitychange', handleVisibilityAndLock);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Periodic retry background thread
    const retryInterval = setInterval(() => {
      if (Object.keys(pendingChangesRef.current).length > 0) {
        flushPendingSaves();
      }
    }, 15000);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityAndLock);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearInterval(retryInterval);
    };
  }, [cloudUserId]);

  // Robust master stats cookies and multi-channel persistence
  const persistRobustStatsData = (statsVal: any) => {
    if (!statsVal) return;
    const statsStr = JSON.stringify(statsVal);
    localStorage.setItem('drt_stats', statsStr);
    sessionStorage.setItem('drt_stats', statsStr);
    
    // Set fine-grained interactive cookies so DevTools -> Application -> Cookies is never empty
    document.cookie = `drt_stats_level=${encodeURIComponent(statsVal.level || 1)}; path=/; max-age=31536000; SameSite=Lax`;
    document.cookie = `drt_stats_xp=${encodeURIComponent(statsVal.xp || 0)}; path=/; max-age=31536000; SameSite=Lax`;
    document.cookie = `drt_stats_name=${encodeURIComponent(statsVal.name || '')}; path=/; max-age=31536000; SameSite=Lax`;
    document.cookie = `drt_stats_goldCubes=${encodeURIComponent(statsVal.goldCubes || 0)}; path=/; max-age=31536000; SameSite=Lax`;
  };

  // Save collections helper with robust multi-channel replication and cookie mirrors
  const saveToLocalStorage = (key: string, data: any) => {
    const dataStr = JSON.stringify(data);
    localStorage.setItem(key, dataStr);
    sessionStorage.setItem(key, dataStr);

    if (key === 'drt_stats') {
      persistRobustStatsData(data);
    } else {
      // Set indicator counts as cookies to satisfy DevTools Application fields
      const itemsCount = data ? (Array.isArray(data) ? data.length : 1) : 0;
      document.cookie = `${key}_count=${itemsCount}; path=/; max-age=31536000; SameSite=Lax`;
    }

    syncToCloud({ key, data });
  };

  // ----------------------------------------------------------------------
  // Bulletproof Inspect Page Storage Guard & Repair Loop
  // This hook guarantees that if elements of Local Storage, Session Storage,
  // or Cookies are manually cleared, deleted, or gone empty in Inspect DevTools,
  // the applet immediately auto-repairs and non-destructively restores them.
  // ----------------------------------------------------------------------
  useEffect(() => {
    // If we're performing a cloud sync transition, booting the session, or hard resetting, halt auto-repair to prevent collision
    if (loadingSession || isSyncing) return;

    const restoreAndSanitiseGuard = () => {
      // 1. Repair user id
      const activeId = cloudUserId || localStorage.getItem('drt_userId') || sessionStorage.getItem('drt_userId');
      if (activeId) {
        if (!localStorage.getItem('drt_userId')) {
          localStorage.setItem('drt_userId', activeId);
        }
        if (!sessionStorage.getItem('drt_userId')) {
          sessionStorage.setItem('drt_userId', activeId);
        }
        const hasUserIdCookie = document.cookie.split(';').some(item => item.trim().startsWith('drt_userId='));
        if (!hasUserIdCookie) {
          document.cookie = `drt_userId=${encodeURIComponent(activeId)}; path=/; max-age=31536000; SameSite=Lax`;
        }
      }

      // 2. Repair stats
      if (stats) {
        const statsStr = JSON.stringify(stats);
        if (localStorage.getItem('drt_stats') !== statsStr) {
          localStorage.setItem('drt_stats', statsStr);
        }
        if (sessionStorage.getItem('drt_stats') !== statsStr) {
          sessionStorage.setItem('drt_stats', statsStr);
        }
        const hasLevelCookie = document.cookie.split(';').some(item => item.trim().startsWith('drt_stats_level='));
        if (!hasLevelCookie) {
          persistRobustStatsData(stats);
        }
      }

      // 3. Repair routines
      if (routines !== undefined) {
        const routinesStr = JSON.stringify(routines);
        if (localStorage.getItem('drt_routines') !== routinesStr) {
          localStorage.setItem('drt_routines', routinesStr);
        }
        if (sessionStorage.getItem('drt_routines') !== routinesStr) {
          sessionStorage.setItem('drt_routines', routinesStr);
        }
        const hasCookie = document.cookie.split(';').some(item => item.trim().startsWith('drt_routines_count='));
        if (!hasCookie) {
          document.cookie = `drt_routines_count=${routines.length}; path=/; max-age=31536000; SameSite=Lax`;
        }
      }

      // 4. Repair priorities
      if (priorities !== undefined) {
        const prioritiesStr = JSON.stringify(priorities);
        if (localStorage.getItem('drt_priorities') !== prioritiesStr) {
          localStorage.setItem('drt_priorities', prioritiesStr);
        }
        if (sessionStorage.getItem('drt_priorities') !== prioritiesStr) {
          sessionStorage.setItem('drt_priorities', prioritiesStr);
        }
        const hasCookie = document.cookie.split(';').some(item => item.trim().startsWith('drt_priorities_count='));
        if (!hasCookie) {
          document.cookie = `drt_priorities_count=${priorities.length}; path=/; max-age=31536000; SameSite=Lax`;
        }
      }

      // 5. Repair meals
      if (meals !== undefined) {
        const mealsStr = JSON.stringify(meals);
        if (localStorage.getItem('drt_meals') !== mealsStr) {
          localStorage.setItem('drt_meals', mealsStr);
        }
        if (sessionStorage.getItem('drt_meals') !== mealsStr) {
          sessionStorage.setItem('drt_meals', mealsStr);
        }
        const hasCookie = document.cookie.split(';').some(item => item.trim().startsWith('drt_meals_count='));
        if (!hasCookie) {
          document.cookie = `drt_meals_count=${meals.length}; path=/; max-age=31536000; SameSite=Lax`;
        }
      }

      // 6. Repair sessions
      if (sessions !== undefined) {
        const sessionsStr = JSON.stringify(sessions);
        if (localStorage.getItem('drt_sessions') !== sessionsStr) {
          localStorage.setItem('drt_sessions', sessionsStr);
        }
        if (sessionStorage.getItem('drt_sessions') !== sessionsStr) {
          sessionStorage.setItem('drt_sessions', sessionsStr);
        }
        const hasCookie = document.cookie.split(';').some(item => item.trim().startsWith('drt_sessions_count='));
        if (!hasCookie) {
          document.cookie = `drt_sessions_count=${sessions.length}; path=/; max-age=31536000; SameSite=Lax`;
        }
      }

      // 7. Repair events
      if (events !== undefined) {
        const eventsStr = JSON.stringify(events);
        if (localStorage.getItem('drt_events') !== eventsStr) {
          localStorage.setItem('drt_events', eventsStr);
        }
        if (sessionStorage.getItem('drt_events') !== eventsStr) {
          sessionStorage.setItem('drt_events', eventsStr);
        }
        const hasCookie = document.cookie.split(';').some(item => item.trim().startsWith('drt_events_count='));
        if (!hasCookie) {
          document.cookie = `drt_events_count=${events.length}; path=/; max-age=31536000; SameSite=Lax`;
        }
      }
    };

    // Run immediately on active changes
    restoreAndSanitiseGuard();

    // High frequency self-repair clock to dynamically replace deleted items while inspector is viewed
    const repairIntervalId = setInterval(restoreAndSanitiseGuard, 500);

    // Coordinate other browser tabs
    window.addEventListener('storage', restoreAndSanitiseGuard);

    return () => {
      clearInterval(repairIntervalId);
      window.removeEventListener('storage', restoreAndSanitiseGuard);
    };
  }, [cloudUserId, stats, routines, priorities, meals, sessions, events, isSyncing]);

  // Toast helper
  const triggerToast = (message: string, type: 'xp' | 'level' | 'info' = 'xp') => {
    setToast({ show: true, message, type });
  };

  // General Toast timeout dismisser
  useEffect(() => {
    if (toast.show) {
      const t = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [toast.show]);

  // Streak verification logic
  // Streaks increment if completing chores on consecutive days.
  const checkStreakAndUpdate = (currentStats: UserStats) => {
    const todayStr = new Date().toDateString();
    
    if (currentStats.lastCompletedDate) {
      const lastDate = new Date(currentStats.lastCompletedDate);
      const today = new Date(todayStr);
      
      const diffTime = Math.abs(today.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      let updatedStats = { ...currentStats };
      
      if (diffDays === 1) {
        // Active streak preserved and ready for today's locks
        // Note: Streak will actually increment when they complete their first task today!
      } else if (diffDays > 1) {
        // Streak lost since the user missed at least 1 whole day
        updatedStats.streak = 1; // reset back to 1
        setStats(updatedStats);
        saveToLocalStorage('drt_stats', updatedStats);
        triggerToast('Streak reset. Let\'s build consistency again! 🎯', 'info');
      }
    }
  };

  // Initialization when user selects a preset profile
  const handleProfileSelect = async (name: string, preset: PresetType) => {
    const template = PRESETS[preset];
    
    // Set active user ID to name-based ID so it persists deterministically!
    const cleanName = name.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
    const nameBasedUserId = `user_by_name_${cleanName}`;
    
    setIsSyncing(true);
    setSyncStatus('pending');
    try {
      // Check if user already exists in Firestore database
      const response = await fetch(`/api/sync/load?userId=${nameBasedUserId}`);
      const result = await response.json();
      if (result.status === "success" && result.data) {
        // Active profile already exists, load and restore it seamlessly
        const success = await handleRestoreFromKey(nameBasedUserId);
        if (success) {
          triggerToast(`Logged in successfully! Welcome back, ${name}! ✨`, 'info');
          return;
        }
      }
    } catch (e) {
      console.error("Failed to lookup existing user during select:", e);
    } finally {
      setIsSyncing(false);
    }

    localStorage.setItem('drt_userId', nameBasedUserId);
    sessionStorage.setItem('drt_userId', nameBasedUserId);
    document.cookie = `drt_userId=${encodeURIComponent(nameBasedUserId)}; path=/; max-age=31536000; SameSite=Lax`;
    setCloudUserId(nameBasedUserId);

    const initialStats: UserStats = {
      name,
      preset,
      level: 1,
      xp: 0,
      streak: 1,
      lastCompletedDate: new Date().toDateString(),
      totalXpEarned: 0,
      totalTasksCompleted: 0,
      waterIntake: 0,
      goldCubes: 20,       // 20 starter Golden Cubes!
      totalGoldCubes: 20,
      unlockedThemes: ['classic-void', 'jujutsu-yuji'],
      activeTheme: 'jujutsu-yuji'
    };

    // Prepare arrays with unique IDs
    const initialRoutines: RoutineItem[] = template.routines.map((r, i) => ({
      ...r,
      id: `rt-${Date.now()}-${i}`,
      completed: false
    }));

    const initialPriorities: PriorityItem[] = template.priorities.map((p, i) => ({
      ...p,
      id: `pr-${Date.now()}-${i}`,
      completed: false
    }));

    const initialMeals: MealItem[] = template.meals.map((m, i) => ({
      ...m,
      id: `ml-${Date.now()}-${i}`,
      completed: false
    }));

    setStats(initialStats);
    setRoutines(initialRoutines);
    setPriorities(initialPriorities);
    setMeals(initialMeals);
    setSessions([]);
    setEvents([]);

    // Commit definitions to local persistence
    saveToLocalStorage('drt_stats', initialStats);
    saveToLocalStorage('drt_routines', initialRoutines);
    saveToLocalStorage('drt_priorities', initialPriorities);
    saveToLocalStorage('drt_meals', initialMeals);
    saveToLocalStorage('drt_sessions', []);
    saveToLocalStorage('drt_events', []);

    triggerToast(`Welcome ${name}! Starting profile calibration. ✨`, 'info');
  };

  // Secure account sign off and data wipe
  const handleResetProfile = () => {
    localStorage.clear();
    sessionStorage.clear();
    
    // Wipe all tracking cookies
    const cookies = document.cookie.split(';');
    for (let c of cookies) {
      const eqPos = c.indexOf('=');
      const name = eqPos > -1 ? c.substring(0, eqPos).trim() : c.trim();
      document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
    }

    setStats(null);
    setRoutines([]);
    setPriorities([]);
    setMeals([]);
    setSessions([]);
    setEvents([]);
    setCloudUserId('');
    
    triggerToast("Profile reset. Calibrate a new starter lifestyle.", "info");
  };

  // Safe Stats Updater that automatically replicates changes to local cache & cloud
  const handleUpdateStats = (newStats: UserStats | ((prev: UserStats | null) => UserStats)) => {
    setStats((prev) => {
      const resolved = typeof newStats === 'function' ? newStats(prev) : newStats;
      if (resolved) {
        saveToLocalStorage('drt_stats', resolved);
      }
      return resolved;
    });
  };

  // Master Synchronisation Force Driver
  const handleManualSyncNow = async () => {
    triggerToast("Pushing sync updates manually...", "info");
    // Place current state into the sync buffer to guarantee write replication
    pendingChangesRef.current['drt_stats'] = stats;
    pendingChangesRef.current['drt_routines'] = routines;
    pendingChangesRef.current['drt_priorities'] = priorities;
    pendingChangesRef.current['drt_meals'] = meals;
    pendingChangesRef.current['drt_sessions'] = sessions;
    pendingChangesRef.current['drt_events'] = events;

    await flushPendingSaves();
    triggerToast("Ecosystem mirrors synchronised!", "info");
  };

  // JSON Import loader and database sync
  const handleImportProfileData = (imported: {
    stats: UserStats;
    routines: RoutineItem[];
    priorities: PriorityItem[];
    meals: MealItem[];
    sessions: TimeTrackSession[];
    events: CalendarEvent[];
  }) => {
    setStats(imported.stats);
    setRoutines(imported.routines);
    setPriorities(imported.priorities);
    setMeals(imported.meals);
    setSessions(imported.sessions);
    setEvents(imported.events);

    saveToLocalStorage('drt_stats', imported.stats);
    saveToLocalStorage('drt_routines', imported.routines);
    saveToLocalStorage('drt_priorities', imported.priorities);
    saveToLocalStorage('drt_meals', imported.meals);
    saveToLocalStorage('drt_sessions', imported.sessions);
    saveToLocalStorage('drt_events', imported.events);

    triggerToast("JSON backup successfully unpacked & linked!", "info");
  };

  // Settings Hard Reset Master Driver (local and Firestore wipe)
  const handleSettingsHardReset = async () => {
    setIsSyncing(true);
    try {
      const masterKey = 'user_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
      localStorage.clear();
      
      // Seed a fresh Master ID
      localStorage.setItem('drt_userId', masterKey);
      setCloudUserId(masterKey);

      const freshStats: UserStats = {
        name: 'Scholar',
        preset: 'general',
        level: 1,
        xp: 0,
        streak: 0,
        lastCompletedDate: null,
        totalXpEarned: 0,
        totalTasksCompleted: 0,
        waterIntake: 0,
        goldCubes: 15,
        totalGoldCubes: 15,
        unlockedThemes: ['classic-void', 'jujutsu-yuji'],
        activeTheme: 'jujutsu-yuji'
      };

      setStats(freshStats);
      setRoutines([]);
      setPriorities([]);
      setMeals([]);
      setSessions([]);
      setEvents([]);

      saveToLocalStorage('drt_stats', freshStats);
      saveToLocalStorage('drt_routines', []);
      saveToLocalStorage('drt_priorities', []);
      saveToLocalStorage('drt_meals', []);
      saveToLocalStorage('drt_sessions', []);
      saveToLocalStorage('drt_events', []);

      await pushLocalToCloud(masterKey);
      setActiveTab('routine');
    } catch (err) {
      console.error("Purging master profile data failed:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Reset the entire system
  const handleResetAllData = () => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset your level, routines, and progress? This will delete all logged data."
    );
    if (confirmReset) {
      localStorage.clear();
      setStats(null);
      setRoutines([]);
      setPriorities([]);
      setMeals([]);
      setSessions([]);
      setEvents([]);
      setActiveTab('routine');
    }
  };

  // Reward Manager: Centralized XP gain & Level progression
  const awardExperience = (amount: number) => {
    if (!stats) return;

    setStats((prev) => {
      if (!prev) return null;

      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      let netXpEarned = prev.totalXpEarned + amount;
      let totalCompleted = prev.totalTasksCompleted + 1;
      
      const xpNeeded = newLevel * 100;
      let levelIncremented = false;

      if (newXp >= xpNeeded) {
        newXp -= xpNeeded;
        newLevel += 1;
        levelIncremented = true;
      }

      const todayStr = new Date().toDateString();
      let newStreak = prev.streak;

      // Calculate streak boost if completing first action on a consecutive day
      if (prev.lastCompletedDate && prev.lastCompletedDate !== todayStr) {
        const lastDate = new Date(prev.lastCompletedDate);
        const today = new Date(todayStr);
        const diffDays = Math.ceil(Math.abs(today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          newStreak += 1;
          setTimeout(() => triggerToast(`Consistency streak active! Day ${newStreak} 🔥`, 'info'), 500);
        }
      }

      // Calculation of Golden Cubes: Higher level gives more cubes per completed task!
      // Formula: Base 2 cubes + 1 extra cube for every 2 levels achieved
      const cubesEarned = 2 + Math.floor(prev.level / 2);
      const newGoldCubes = (prev.goldCubes ?? 0) + cubesEarned;
      const newTotalGoldCubes = (prev.totalGoldCubes ?? 0) + cubesEarned;

      const updated = {
        ...prev,
        level: newLevel,
        xp: newXp,
        totalXpEarned: netXpEarned,
        totalTasksCompleted: totalCompleted,
        lastCompletedDate: todayStr,
        streak: newStreak,
        goldCubes: newGoldCubes,
        totalGoldCubes: newTotalGoldCubes
      };

      saveToLocalStorage('drt_stats', updated);
      
      if (levelIncremented) {
        triggerToast(`🎉 LEVEL UP! Level ${newLevel}! +${cubesEarned} 🟨 Golden Cubes! ✨`, 'level');
      } else {
        triggerToast(`+${amount} XP & +${cubesEarned} 🟨 Golden Cubes!`, 'xp');
      }

      return updated;
    });
  };

  // deduct experience of unchecking items (for integrity!)
  const penalizeExperience = (amount: number) => {
    if (!stats) return;

    setStats((prev) => {
      if (!prev) return null;

      let newXp = prev.xp - amount;
      let newLevel = prev.level;

      if (newXp < 0) {
        if (newLevel > 1) {
          newLevel -= 1;
          newXp = (newLevel * 100) + newXp; // fall back to remainder of prior level
        } else {
          newXp = 0;
        }
      }

      // Determine proportional penalty for high integrity
      const cubesPenalized = 2 + Math.floor(prev.level / 2);
      const newGoldCubes = Math.max(0, (prev.goldCubes ?? 0) - cubesPenalized);
      const newTotalGoldCubes = Math.max(0, (prev.totalGoldCubes ?? 0) - cubesPenalized);

      const updated = {
        ...prev,
        level: newLevel,
        xp: newXp,
        totalXpEarned: Math.max(0, prev.totalXpEarned - amount),
        totalTasksCompleted: Math.max(0, prev.totalTasksCompleted - 1),
        goldCubes: newGoldCubes,
        totalGoldCubes: newTotalGoldCubes
      };

      saveToLocalStorage('drt_stats', updated);
      triggerToast(`Removed: -${amount} XP & -${cubesPenalized} 🟨 Cubes`, 'xp');
      return updated;
    });
  };

  // --- Universal Themed Flash & Impact Effects Trigger ---
  const triggerBlackFlashEffect = (isBig: boolean, forcedPercent?: number) => {
    const activeThemeId = stats?.activeTheme ?? 'classic-void';
    
    if (forcedPercent !== undefined) {
      setLatestCompletionPercent(forcedPercent);
    } else {
      const tot = routines.length + priorities.length + meals.length;
      const done = routines.filter(r => r.completed).length + priorities.filter(p => p.completed).length + meals.filter(m => m.completed).length;
      const calculatedPart = tot > 0 ? Math.round((done / tot) * 100) : 0;
      setLatestCompletionPercent(calculatedPart);
    }

    // Choose crack dimensions and palettes based on activeThemeId and prices
    let colorChoices = ['#a5b4fc', '#818cf8', '#6366f1', '#4f46e5']; // Void Default
    let baseCount = isBig ? 12 : 4;
    
    switch (activeThemeId) {
      case 'jujutsu-yuji':
        colorChoices = ['#f43f5e', '#df1b3d', '#ffed0a', '#000000', '#df1b3d', '#f59e0b', '#dc2626'];
        baseCount = isBig ? 24 : 8;
        break;
      case 'cyber-grid':
        colorChoices = ['#06b6d4', '#ec4899', '#34d399', '#0891b2', '#ffffff'];
        baseCount = isBig ? 18 : 6;
        break;
      case 'star-nebula':
        // Sapphire blue, cyan sky colors to match image
        colorChoices = ['#0ea5e9', '#38bdf8', '#0284c7', '#22d3ee', '#ffffff', '#67e8f9'];
        baseCount = isBig ? 24 : 10;
        break;
      case 'retrowave-80':
        colorChoices = ['#ec4899', '#f97316', '#ff007f', '#f43f5e', '#fbbf24'];
        baseCount = isBig ? 28 : 10;
        break;
      case 'solar-harvest':
        colorChoices = ['#fbbf24', '#f59e0b', '#d97706', '#ea580c', '#ffffff'];
        baseCount = isBig ? 34 : 12;
        break;
      case 'glacial-aurora':
        colorChoices = ['#22d3ee', '#14b8a6', '#06b6d4', '#0891b2', '#e0f2fe'];
        baseCount = isBig ? 42 : 14;
        break;
      case 'sovereign-ruby':
        colorChoices = ['#f43f5e', '#e11d48', '#be123c', '#fbbf24', '#f59e0b', '#ffffff', '#991b1b'];
        baseCount = isBig ? 50 : 18;
        break;
      default:
        // Void/Fallbacks
        colorChoices = ['#a5b4fc', '#818cf8', '#6366f1', '#4f46e5'];
        baseCount = isBig ? 12 : 4;
    }

    const cracks = [];
    for (let i = 0; i < baseCount; i++) {
      cracks.push({
        x1: Math.random() * 100,
        y1: Math.random() * 100,
        x2: Math.random() * 100,
        y2: Math.random() * 100,
        color: colorChoices[Math.floor(Math.random() * colorChoices.length)]
      });
    }
    setLightningCracks(cracks);

    if (isBig) {
      setBigBlackFlashActive(true);
      playThemedBigSound(activeThemeId);
      setTimeout(() => {
        setBigBlackFlashActive(false);
      }, 3000);
    } else {
      setBlackFlashActive(true);
      playThemedSmallSound(activeThemeId);
      const delay = ['star-nebula', 'cyber-grid', 'retrowave-80', 'solar-harvest', 'glacial-aurora', 'sovereign-ruby'].includes(activeThemeId) ? 2200 : 420;
      setTimeout(() => {
        setBlackFlashActive(false);
      }, delay);
    }
  };

  // --- Routine management handlers ---
  const handleToggleRoutine = (id: string) => {
    let completedTrue = false;
    const updated = routines.map((r) => {
      if (r.id === id) {
        const nextCompleted = !r.completed;
        if (nextCompleted) {
          awardExperience(r.xpValue);
          completedTrue = true;
        } else {
          penalizeExperience(r.xpValue);
        }
        return { ...r, completed: nextCompleted };
      }
      return r;
    });

    setRoutines(updated);
    saveToLocalStorage('drt_routines', updated);

    if (completedTrue) {
      const allDone = updated.length > 0 && updated.every((r) => r.completed);
      const tot = updated.length + priorities.length + meals.length;
      const done = updated.filter(r => r.completed).length + priorities.filter(p => p.completed).length + meals.filter(m => m.completed).length;
      const pct = tot > 0 ? Math.round((done / tot) * 100) : 0;
      triggerBlackFlashEffect(allDone, pct);
    }
  };

  const handleAddRoutine = (title: string, category: 'morning' | 'afternoon' | 'evening', timeSlot: string) => {
    const newRoutine: RoutineItem = {
      id: `rt-${Date.now()}`,
      title,
      category,
      timeSlot,
      completed: false,
      xpValue: 15 // Standard custom habit XP
    };

    const updated = [...routines, newRoutine];
    setRoutines(updated);
    saveToLocalStorage('drt_routines', updated);
    triggerToast('Added Custom Daily Habit 📅', 'info');
  };

  const handleDeleteRoutine = (id: string) => {
    const updated = routines.filter((r) => r.id !== id);
    setRoutines(updated);
    saveToLocalStorage('drt_routines', updated);
    triggerToast('Habit Deleted 🗑️', 'info');
  };

  const handleResetRoutinesValue = () => {
    const confirmReset = window.confirm("Reset all routines back to uncompleted for a new day?");
    if (confirmReset) {
      const updated = routines.map((r) => ({ ...r, completed: false }));
      setRoutines(updated);
      saveToLocalStorage('drt_routines', updated);
      triggerToast('All routines reset. Make today count! 🌅', 'info');
    }
  };

  // --- Priority management handlers ---
  const handleTogglePriority = (id: string) => {
    let completedTrue = false;
    const updated = priorities.map((p) => {
      if (p.id === id) {
        const nextCompleted = !p.completed;
        if (nextCompleted) {
          awardExperience(p.xpValue);
          completedTrue = true;
        } else {
          penalizeExperience(p.xpValue);
        }
        return { ...p, completed: nextCompleted };
      }
      return p;
    });

    setPriorities(updated);
    saveToLocalStorage('drt_priorities', updated);

    if (completedTrue) {
      const allDone = updated.length > 0 && updated.every((p) => p.completed);
      const tot = routines.length + updated.length + meals.length;
      const done = routines.filter(r => r.completed).length + updated.filter(p => p.completed).length + meals.filter(m => m.completed).length;
      const pct = tot > 0 ? Math.round((done / tot) * 100) : 0;
      triggerBlackFlashEffect(allDone, pct);
    }
  };

  const handleAddPriority = (title: string, difficulty: 'high' | 'medium' | 'low') => {
    let xpValue = 15;
    if (difficulty === 'high') xpValue = 45;
    else if (difficulty === 'medium') xpValue = 25;

    const newPriority: PriorityItem = {
      id: `pr-${Date.now()}`,
      title,
      difficulty,
      completed: false,
      xpValue
    };

    const updated = [...priorities, newPriority];
    setPriorities(updated);
    saveToLocalStorage('drt_priorities', updated);
    triggerToast('New Master Priority set 🎯', 'info');
  };

  const handleDeletePriority = (id: string) => {
    const updated = priorities.filter((p) => p.id !== id);
    setPriorities(updated);
    saveToLocalStorage('drt_priorities', updated);
  };

  // --- Meal management handlers ---
  const handleToggleMeal = (id: string) => {
    let completedTrue = false;
    const updated = meals.map((m) => {
      if (m.id === id) {
        const nextCompleted = !m.completed;
        if (nextCompleted) {
          awardExperience(m.xpValue);
          completedTrue = true;
        } else {
          penalizeExperience(m.xpValue);
        }
        return { ...m, completed: nextCompleted };
      }
      return m;
    });

    setMeals(updated);
    saveToLocalStorage('drt_meals', updated);

    if (completedTrue) {
      const allDone = updated.length > 0 && updated.every((m) => m.completed);
      const tot = routines.length + priorities.length + updated.length;
      const done = routines.filter(r => r.completed).length + priorities.filter(p => p.completed).length + updated.filter(m => m.completed).length;
      const pct = tot > 0 ? Math.round((done / tot) * 100) : 0;
      triggerBlackFlashEffect(allDone, pct);
    }
  };

  const handleAddMeal = (name: string, type: 'breakfast' | 'lunch' | 'dinner' | 'snack', calories: string, protein: string) => {
    const newMeal: MealItem = {
      id: `ml-${Date.now()}`,
      mealType: type,
      name,
      calories,
      protein,
      xpValue: type === 'snack' ? 10 : 15,
      completed: false
    };

    const updated = [...meals, newMeal];
    setMeals(updated);
    saveToLocalStorage('drt_meals', updated);
    triggerToast('New intake logged 🍳', 'info');
  };

  const handleDeleteMeal = (id: string) => {
    const updated = meals.filter((m) => m.id !== id);
    setMeals(updated);
    saveToLocalStorage('drt_meals', updated);
    triggerToast('Intake record deleted', 'info');
  };

  // --- Water intake update tracker ---
  const handleUpdateWater = (glasses: number) => {
    if (!stats) return;

    const previousGlasses = stats.waterIntake;
    const diff = glasses - previousGlasses;

    const updatedStats = {
      ...stats,
      waterIntake: Math.min(12, Math.max(0, glasses))
    };

    // Calculate XP reward/penalty. 1 glass water yields +10 XP.
    if (diff > 0) {
      awardExperience(diff * 10);
    } else if (diff < 0) {
      penalizeExperience(Math.abs(diff) * 10);
    }

    setStats(updatedStats);
    saveToLocalStorage('drt_stats', updatedStats);
  };

  // --- Time focus timers sessions handlers ---
  const handleSessionComplete = (title: string, durationSeconds: number, xpEarned: number) => {
    const newSession: TimeTrackSession = {
      id: `sess-${Date.now()}`,
      title,
      durationSeconds,
      xpEarned,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedSessions = [newSession, ...sessions];
    setSessions(updatedSessions);
    saveToLocalStorage('drt_sessions', updatedSessions);

    // Apply XP reward from session
    awardExperience(xpEarned);
  };

  const handleClearHistory = () => {
    setSessions([]);
    saveToLocalStorage('drt_sessions', []);
    triggerToast('Completed focus counts wiped 🗑️', 'info');
  };

  const handleDeleteSession = (id: string) => {
    const updated = sessions.filter(s => s.id !== id);
    setSessions(updated);
    saveToLocalStorage('drt_sessions', updated);
  };

  const handleAddCalendarEvent = (title: string, dateStr: string, category: 'academic' | 'fitness' | 'personal' | 'social' | 'deadline' | 'other') => {
    const newEvent: CalendarEvent = {
      id: `ev-${Date.now()}`,
      title,
      dateStr,
      category
    };
    const updated = [...events, newEvent];
    setEvents(updated);
    saveToLocalStorage('drt_events', updated);
    awardExperience(20);
  };

  const handleDeleteCalendarEvent = (id: string) => {
    const updated = events.filter(e => e.id !== id);
    setEvents(updated);
    saveToLocalStorage('drt_events', updated);
    triggerToast('Special event removed', 'info');
  };

  // --- Boutique Shop Purchase / Apply handlers ---
  const handlePurchaseTheme = (themeId: string, cost: number) => {
    if (!stats) return;

    if ((stats.goldCubes ?? 0) < cost) {
      triggerToast('Insufficient Golden Cubes! Keep completing actions to earn more. 🟨', 'info');
      return;
    }

    const alreadyUnlocked = stats.unlockedThemes ?? ['classic-void'];
    if (alreadyUnlocked.includes(themeId)) {
      triggerToast('Theme already acquired! Applying layout.', 'info');
      handleApplyTheme(themeId);
      return;
    }

    setStats((prev) => {
      if (!prev) return null;
      const updated = {
        ...prev,
        goldCubes: (prev.goldCubes ?? 0) - cost,
        unlockedThemes: [...(prev.unlockedThemes ?? ['classic-void']), themeId],
        activeTheme: themeId
      };
      saveToLocalStorage('drt_stats', updated);
      return updated;
    });

    const themeObj = THEMES.find(t => t.id === themeId);
    triggerToast(`Unlocked & Applied: ${themeObj?.name ?? 'Theme'}! 🎨`, 'level');
  };

  const handleApplyTheme = (themeId: string) => {
    if (!stats) return;
    
    setStats((prev) => {
      if (!prev) return null;
      const updated = {
        ...prev,
        activeTheme: themeId
      };
      saveToLocalStorage('drt_stats', updated);
      return updated;
    });

    const themeObj = THEMES.find(t => t.id === themeId);
    triggerToast(`Applied theme: ${themeObj?.name ?? 'Theme'} ✨`, 'info');
  };

  // Dynamic witty encouragement subtitle based on preset & stats
  const getMotivationalQuote = () => {
    if (!stats) return '';
    const nameStr = stats.name;
    switch (stats.preset) {
      case 'student':
        return `“The beautiful thing about learning is that no one can take it away from you, ${nameStr}. Keep revising!”`;
      case 'gym':
        return `“Take care of your body, ${nameStr}. It’s the only place you have to live. Push for gold today!”`;
      case 'work':
        return `“Efficiency is doing things right; effectiveness is doing the right things, ${nameStr}. Stand out!”`;
      default:
        return `“Consistency, ${nameStr}, is the secret recipe of spectacular personal growth. Keep checking boxes!”`;
    }
  };

  // Dynamic loading state check
  if (loadingSession) {
    return (
      <div className="bg-slate-950 text-slate-100 min-h-screen font-sans flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <h2 className="text-xs font-bold tracking-widest text-slate-500 uppercase animate-pulse">Synchronizing Profile Matrix...</h2>
        </div>
      </div>
    );
  }

  // If no stats registered yet, render user onboarding preset selector
  if (!stats) {
    return (
      <div className="bg-slate-950 text-slate-100 min-h-screen font-sans flex items-center justify-center p-4">
        <PresetSelector 
          onSelect={handleProfileSelect} 
          onRestoreKey={handleRestoreFromKey}
        />
      </div>
    );
  }

  const activeThemeId = stats.activeTheme ?? 'classic-void';
  const currentTheme = THEMES.find(t => t.id === activeThemeId) || THEMES[0];

  return (
    <div 
      data-theme={activeThemeId}
      className={`min-h-screen font-sans selection:bg-rose-500 selection:text-slate-950 transition-colors duration-500 pb-10 ${currentTheme.bgClass} relative overflow-hidden`} 
      id="main-application"
    >
      <AnimatePresence>
        {isLocked && (
          <LockScreen 
            stats={stats} 
            onUnlock={() => setIsLocked(false)} 
            currentTheme={currentTheme} 
            userId={cloudUserId} 
          />
        )}
      </AnimatePresence>
      {/* Absolute floating background accents for Jujutsu Yuji theme */}
      {activeThemeId === 'jujutsu-yuji' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
          {/* Subtle kanji overlays */}
          <div className="absolute top-[8%] left-[4%] opacity-[0.06] text-[18vh] font-extrabold font-sans leading-none tracking-tighter text-rose-500 uppercase select-none">
            呪術
          </div>
          <div className="absolute bottom-[12%] right-[4%] opacity-[0.06] text-[18vh] font-extrabold font-sans leading-none tracking-tighter text-amber-500 uppercase select-none">
            虎杖
          </div>
          
          {/* Geometric halos / Cursed circles */}
          <div className="absolute top-[35%] right-[-150px] opacity-[0.03] w-[450px] h-[450px] border-[30px] border-rose-500 rounded-full select-none" />
          <div className="absolute bottom-[20%] left-[-200px] opacity-[0.03] w-[500px] h-[500px] border-[40px] border-amber-500 rounded-full select-none" />

          {/* Glowing cursed energy entities */}
          <div className="absolute top-[18%] left-[15%] w-10 h-10 bg-rose-500 rounded-full blur-[8px] opacity-20 animate-pulse" />
          <div className="absolute top-[55%] left-[8%] w-16 h-16 bg-red-600 rounded-full blur-[14px] opacity-15 animate-pulse" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-[75%] left-[38%] w-8 h-8 bg-amber-400 rounded-full blur-[6px] opacity-25 animate-pulse" style={{ animationDelay: '2.8s' }} />
          <div className="absolute top-[28%] right-[12%] w-12 h-12 bg-rose-400 rounded-full blur-[10px] opacity-20 animate-pulse" style={{ animationDelay: '0.9s' }} />
          <div className="absolute top-[68%] right-[18%] w-24 h-24 bg-red-600 rounded-full blur-[20px] opacity-10 animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-[42%] left-[45%] w-14 h-14 bg-amber-500 rounded-full blur-[12px] opacity-20 animate-pulse" style={{ animationDelay: '3.4s' }} />

          {/* Sukuna eye slits / Ambient radial shadow glows to anchor focus on center */}
          <div className="absolute top-[10%] left-[35%] w-[450px] h-[450px] bg-rose-950/20 rounded-full blur-[130px] mix-blend-color-dodge pointer-events-none" />
          <div className="absolute bottom-[15%] right-[25%] w-[550px] h-[550px] bg-amber-950/15 rounded-full blur-[150px] mix-blend-color-dodge pointer-events-none" />
        </div>
      )}

      {activeThemeId === 'classic-void' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
          {/* Subtle slow drifting interstellar dust */}
          <div className="absolute top-[15%] left-[10%] w-1.5 h-1.5 bg-indigo-400/20 rounded-full animate-pulse" />
          <div className="absolute top-[45%] left-[3%] w-2.5 h-2.5 bg-slate-400/10 rounded-full animate-pulse" style={{ animationDelay: '1.2s' }} />
          <div className="absolute top-[68%] right-[8%] w-22 h-22 bg-indigo-950/40 rounded-full blur-[35px] animate-pulse" style={{ animationDelay: '2.5s' }} />
          <div className="absolute top-[10%] right-[28%] w-[400px] h-[400px] bg-indigo-950/10 rounded-full blur-[100px]" />
        </div>
      )}

      {activeThemeId === 'cyber-grid' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
          {/* Cyan and hot pink glowing neon lights */}
          <div className="absolute -top-[10%] left-[15%] w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '6s' }} />
          <div className="absolute -bottom-[15%] right-[10%] w-[550px] h-[550px] bg-fuchsia-600/15 rounded-full blur-[150px] mix-blend-color-dodge animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }} />
          <div className="absolute top-[35%] right-[20%] w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-[100px]" />
          
          {/* Retro wireframe city skyline grid element */}
          <svg className="absolute bottom-0 inset-x-0 w-full h-[32vh] text-cyan-500/10" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <line x1="0" y1="319" x2="1440" y2="319" stroke="currentColor" strokeWidth="1.5" />
            <line x1="0" y1="280" x2="1440" y2="280" stroke="currentColor" strokeWidth="0.8" strokeDasharray="10 5" />
            <line x1="0" y1="220" x2="1440" y2="220" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5 5" />
            {Array.from({ length: 24 }).map((_, i) => (
              <line
                key={i}
                x1={i * 64}
                y1="320"
                x2={(i * 64) - 200 + Math.sin(i) * 50}
                y2="150"
                stroke="currentColor"
                strokeWidth="0.55"
              />
            ))}
          </svg>

          {/* Falling glowing cyber specs */}
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-2 bg-gradient-to-b from-cyan-400 to-transparent rounded"
              style={{
                left: `${10 + i * 8}%`,
                top: `${10 + Math.random() * 40}%`
              }}
              animate={{
                y: [0, 500],
                opacity: [0, 0.7, 0]
              }}
              transition={{
                duration: 5 + Math.random() * 4,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "linear"
              }}
            />
          ))}
        </div>
      )}

      {activeThemeId === 'star-nebula' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
          {/* Rich swirling nebula clouds and starlight */}
          <motion.div 
            animate={{ scale: [1, 1.15, 1], rotate: [0, 30, 0] }}
            transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
            className="absolute -top-[10%] -left-[10%] w-[550px] h-[550px] bg-indigo-950/20 rounded-full blur-[120px]"
          />
          <motion.div 
            animate={{ scale: [1.1, 0.95, 1.1], rotate: [30, 0, 30] }}
            transition={{ repeat: Infinity, duration: 25, ease: "easeInOut" }}
            className="absolute -bottom-[15%] -right-[15%] w-[650px] h-[650px] bg-purple-950/20 rounded-full blur-[140px]"
          />
          <div className="absolute top-[35%] right-[12%] w-14 h-14 rounded-full bg-fuchsia-500/15 blur-[20px] animate-pulse" />
          <div className="absolute bottom-[40%] left-[14%] w-20 h-20 rounded-full bg-indigo-500/10 blur-[30px] animate-pulse" style={{ animationDelay: '1.5s' }} />
          
          {/* Shooting Star vectors */}
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-[80px] h-[1px] bg-gradient-to-r from-transparent via-fuchsia-300 to-transparent rotate-[-35deg]"
              style={{
                left: `${15 + i * 20}%`,
                top: `${10 + i * 18}%`,
              }}
              animate={{
                x: [-100, 300],
                y: [-70, 210],
                opacity: [0, 0.7, 0]
              }}
              transition={{
                duration: 2.2 + i * 0.4,
                repeat: Infinity,
                repeatDelay: 5 + i * 4,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}

      {activeThemeId === 'retrowave-80' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
          {/* Retro sun glowing grid wireframe style */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-950/10 via-stone-950 to-stone-950" />
          
          <div className="absolute left-[8%] bottom-[20%] opacity-[0.03] text-[15vh] font-extrabold tracking-widest text-pink-500 select-none">
            80s
          </div>
          
          {/* Giant sun sunset in the middle bottom */}
          <div className="absolute bottom-[-150px] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-t from-pink-600/10 via-orange-500/10 to-transparent rounded-full blur-[90px]" />
          
          {/* Glowing neon stars floating */}
          <div className="absolute top-[15%] left-[25%] w-2.5 h-2.5 bg-pink-500 rounded-full blur-[1px] animate-pulse" />
          <div className="absolute top-[48%] left-[78%] w-3 h-3 bg-orange-400 rounded-full blur-[1.5px] animate-pulse" style={{ animationDelay: '1.2s' }} />
          <div className="absolute top-[72%] left-[42%] w-2 h-2 bg-amber-400 rounded-full blur-[1px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
      )}

      {activeThemeId === 'solar-harvest' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
          {/* Concentric rotating solar orbits and ascending gold alchemical sparkles */}
          <div className="absolute top-[10%] left-[-150px] opacity-[0.03] w-[400px] h-[400px] border-[5px] border-amber-600 rounded-full animate-[spin_50s_linear_infinite]" />
          <div className="absolute top-[10%] left-[-150px] opacity-[0.02] w-[350px] h-[350px] border border-dashed border-amber-500 rounded-full" />
          
          <div className="absolute bottom-[10%] right-[-100px] opacity-[0.04] w-[450px] h-[450px] border-[8px] border-double border-yellow-500 rounded-full animate-[spin_60s_linear_infinite]" />

          {/* Warm energetic gold flares */}
          <div className="absolute top-[25%] left-[20%] w-24 h-24 bg-amber-500/8 rounded-full blur-[33px] animate-pulse" />
          <div className="absolute top-[65%] right-[15%] w-32 h-32 bg-yellow-500/6 rounded-full blur-[45px] animate-pulse" style={{ animationDelay: '2s' }} />
          
          {/* Upward rising gold alchemical embers */}
          {Array.from({ length: 9 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-amber-400"
              style={{
                left: `${10 + i * 10}%`,
                bottom: `${5 + Math.random() * 20}%`
              }}
              animate={{
                y: [0, -400 - Math.random() * 200],
                x: [0, Math.sin(i) * 60],
                opacity: [0, 0.75, 0],
                scale: [0.2, 1.4, 0]
              }}
              transition={{
                duration: 4.5 + Math.random() * 3,
                repeat: Infinity,
                delay: i * 0.4
              }}
            />
          ))}
        </div>
      )}

      {activeThemeId === 'glacial-aurora' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
          {/* Giant undulating slow northern lights waves with bezier gradient pathing */}
          <svg className="absolute inset-0 w-full h-full opacity-35" preserveAspectRatio="none">
            <defs>
              <linearGradient id="mainAurora" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.3" />
                <stop offset="35%" stopColor="#14b8a6" stopOpacity="0.25" />
                <stop offset="70%" stopColor="#0891b2" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path
              d="M 0 120 Q 300 280, 600 110 T 1200 240 L 1200 0 L 0 0 Z"
              fill="url(#mainAurora)"
              animate={{
                d: [
                  "M 0 140 Q 300 250, 650 130 T 1200 220 L 1200 0 L 0 0 Z",
                  "M 0 100 Q 330 310, 580 90 T 1200 260 L 1200 0 L 0 0 Z",
                  "M 0 140 Q 300 250, 650 130 T 1200 220 L 1200 0 L 0 0 Z"
                ]
              }}
              transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
            />
          </svg>

          {/* Glowing ice crystal elements */}
          <div className="absolute top-[28%] left-[8%] w-14 h-14 bg-cyan-400/5 rounded-full blur-[18px] animate-pulse" />
          <div className="absolute top-[75%] right-[20%] w-20 h-20 bg-teal-500/5 rounded-full blur-[25px] animate-pulse" style={{ animationDelay: '1.5s' }} />

          {/* Falling small frosty particles */}
          {Array.from({ length: 11 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-cyan-300"
              style={{
                left: `${8 + i * 8}%`,
                top: `${5 + Math.random() * 25}%`
              }}
              animate={{
                y: [0, 500],
                x: [0, Math.sin(i) * 40],
                opacity: [0.1, 0.8, 0.1],
                scale: [0.8, 1.25, 0.8]
              }}
              transition={{
                duration: 6 + Math.random() * 4,
                repeat: Infinity,
                delay: i * 0.35,
                ease: "linear"
              }}
            />
          ))}
        </div>
      )}

      {activeThemeId === 'sovereign-ruby' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
          {/* Royal luxury geometric patterns + giant rotating sacred mandala arrays */}
          <div className="absolute top-[4%] left-[-180px] opacity-[0.03] w-[500px] h-[500px] border-[10px] border-rose-500 rounded-full animate-[spin_70s_linear_infinite]" />
          <div className="absolute top-[4%] left-[-180px] opacity-[0.02] w-[460px] h-[460px] border-[5px] border-double border-amber-500 rounded-full flex items-center justify-center">
            <div className="w-[300px] h-[300px] border border-dashed border-rose-500 rounded-full" />
          </div>

          <div className="absolute bottom-[-150px] right-[-155px] opacity-[0.03] w-[550px] h-[550px] border-[12px] border-double border-rose-600 rounded-full animate-[spin_85s_linear_infinite]" />

          {/* Liquid premium ruby light pools */}
          <div className="absolute top-[18%] left-[12%] w-[400px] h-[400px] bg-red-950/15 rounded-full blur-[120px] mix-blend-color-dodge" />
          <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-rose-955/15 rounded-full blur-[140px] mix-blend-color-dodge" />

          {/* Spinning elegant gemstone shapes and amber floaters */}
          {Array.from({ length: 14 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2"
              style={{
                left: `${5 + i * 7}%`,
                bottom: `${5 + Math.random() * 20}%`,
                backgroundColor: i % 2 === 0 ? '#f43f5e' : '#fbbf24',
                clipPath: 'polygon(50% 0%, 100% 38%, 81% 100%, 19% 100%, 0% 38%)'
              }}
              animate={{
                y: [0, -350 - Math.random() * 150],
                x: [0, Math.sin(i) * 50],
                rotate: [0, 360],
                opacity: [0, 0.85, 0],
                scale: [0.3, 1.25, 0.3]
              }}
              transition={{
                duration: i * 0.35 + 4.5,
                repeat: Infinity,
                delay: i * 0.3
              }}
            />
          ))}
        </div>
      )}
      
      {/* Dynamic Interactive Toasts */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 right-6 z-50 pointer-events-none"
          >
            <div className={`px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border text-sm font-bold tracking-wide ${
              toast.type === 'level' 
                ? 'bg-amber-500 text-slate-950 border-amber-400 stroke-amber-400 shadow-amber-500/20' 
                : toast.type === 'xp'
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-indigo-600/20'
                : 'bg-slate-900 text-slate-200 border-slate-800 shadow-slate-950/40'
            }`}>
              {toast.type === 'level' ? (
                <Sparkles className="w-5 h-5 animate-bounce text-slate-950 fill-white" />
              ) : toast.type === 'xp' ? (
                <TrendingUp className="w-5 h-5" />
              ) : (
                <Clock className="w-5 h-5" />
              )}
              <span>{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6 relative z-10">
        
        {/* Header Block Section */}
        <Header stats={stats} onReset={handleResetAllData} activeThemeId={activeThemeId} />

        {/* Backend Database Link State Indicator */}
        <div className={`p-4 rounded-3xl border transition-all ${currentTheme.panelClass} ${currentTheme.borderClass}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-950 flex items-center justify-center">
                {syncStatus === 'pending' ? (
                  <RefreshCw className="w-5 h-5 text-amber-400 animate-spin" />
                ) : syncStatus === 'error' ? (
                  <div className="w-5 h-5 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center font-bold text-xs shadow-inner">!</div>
                ) : (
                  <Cloud className="w-5 h-5 text-emerald-400" />
                )}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Cloud Persistent Database link</span>
                  <span className={`inline-block w-2 h-2 rounded-full ${
                    syncStatus === 'synced' ? 'bg-emerald-400' : syncStatus === 'pending' ? 'bg-yellow-400 animate-pulse' : 'bg-red-400'
                  }`} />
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {syncStatus === 'synced' && 'All routines, stats, schedules and levels synced to Firestore.'}
                  {syncStatus === 'pending' && 'Syncing updates live to Google Cloud Storage...'}
                  {syncStatus === 'error' && 'Offline. Working locally with automatic retry.'}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setShowSyncPanel(!showSyncPanel)}
              className="px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider bg-slate-950 border border-slate-850 hover:bg-slate-900 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-2"
            >
              <Key className="w-4 h-4" />
              <span>{showSyncPanel ? 'Hide Credentials' : 'Cross-Device Access'}</span>
            </button>
          </div>

          <AnimatePresence>
            {showSyncPanel && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mt-4 pt-4 border-t border-slate-850"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Account key visualization block */}
                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block">YOUR LIFETIME ACCESS SYNC KEY</label>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Use this unique credential key to synchronize your profile seamlessly onto <b>iPhones, Safari, tablets</b>, or other devices.
                    </p>
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        readOnly
                        value={cloudUserId}
                        className="flex-1 px-3 py-2 bg-slate-950 text-slate-200 border border-slate-850 rounded-xl text-xs font-mono"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(cloudUserId);
                          setKeyCopied(true);
                          setTimeout(() => setKeyCopied(false), 2000);
                        }}
                        className="p-2.5 rounded-xl bg-slate-950 border border-slate-850 hover:bg-slate-900 text-slate-400 hover:text-indigo-400 relative flex items-center justify-center cursor-pointer transition-all"
                        title="Copy Sync Key"
                      >
                        {keyCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Restore / device link block */}
                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block">RESTORE PROFILE FROM SECRET KEY</label>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Enter a secret key generated on another device or browser to immediately retrieve and overwrite your profile.
                    </p>
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Paste your sync key here..."
                        value={backupKeyInput}
                        onChange={(e) => setBackupKeyInput(e.target.value)}
                        className="flex-1 px-3 py-2 bg-slate-950 text-slate-200 border border-slate-850 placeholder-slate-600 rounded-xl text-xs font-mono"
                      />
                      <button
                        disabled={isSyncing}
                        onClick={async () => {
                          const success = await handleRestoreFromKey(backupKeyInput);
                          if (success) {
                            setBackupKeyInput('');
                            setShowSyncPanel(false);
                          }
                        }}
                        className={`px-4.5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r ${currentTheme.btnGradient} cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 flex items-center gap-1.5`}
                      >
                        {isSyncing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Laptop className="w-3.5 h-3.5" />}
                        <span>Link</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Daily Progress Report Widget */}
        <DailyReport 
          routines={routines} 
          priorities={priorities} 
          meals={meals} 
          sessions={sessions} 
          stats={stats} 
          activeThemeId={activeThemeId}
          onToast={(msg) => triggerToast(msg, 'info')}
        />

        {/* Tab switch bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 mb-4" id="tabs-navigation">
          {[
            { id: 'routine', label: 'Routine', icon: Clock, count: routines.length },
            { id: 'calendar', label: 'Events', icon: Calendar, count: events.length },
            { id: 'priorities', label: 'Priorities', icon: Target, count: priorities.filter(p => !p.completed).length },
            { id: 'meals', label: 'Meals', icon: Utensils, count: meals.length },
            { id: 'focus', label: 'Focus', icon: Award, count: sessions.length },
            { id: 'shop', label: 'Shop', icon: ShoppingBag, count: 0 },
            { id: 'settings', label: 'Settings', icon: Settings, count: 0 }
          ].map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-1.5 group select-none ${
                  isActive
                    ? 'bg-slate-900 border-yellow-500/50 text-white ring-1 ring-yellow-500/10 shadow-lg'
                    : currentTheme.tabInactiveClass
                }`}
                title={`Open ${tab.label}`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`p-1.5 rounded-lg transition-colors shrink-0 ${
                    isActive 
                      ? 'bg-slate-950 text-yellow-400' 
                      : 'bg-slate-950/40 text-slate-400 group-hover:text-slate-200'
                  }`}>
                    <TabIcon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider truncate">{tab.label}</span>
                </div>
                
                {tab.count > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md font-mono shrink-0 ${
                    isActive
                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                      : 'bg-slate-950 text-slate-500 border border-slate-850'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Dynamic Inner Tab container */}
        <div className={`border rounded-3xl p-4 sm:p-6 shadow-2xl relative min-h-[450px] transition-all duration-300 ${currentTheme.panelClass} ${currentTheme.borderClass}`}>
          {activeTab === 'routine' && (
            <TabRoutine 
              routines={routines}
              onToggle={handleToggleRoutine}
              onAdd={handleAddRoutine}
              onDelete={handleDeleteRoutine}
              onResetAll={handleResetRoutinesValue}
            />
          )}

          {activeTab === 'calendar' && (
            <TabCalendar 
              events={events}
              onAddEvent={handleAddCalendarEvent}
              onDeleteEvent={handleDeleteCalendarEvent}
            />
          )}

          {activeTab === 'priorities' && (
            <TabPriorities 
              priorities={priorities}
              routines={routines}
              onToggle={handleTogglePriority}
              onAdd={handleAddPriority}
              onDelete={handleDeletePriority}
            />
          )}

          {activeTab === 'meals' && (
            <TabMeals 
              meals={meals}
              stats={stats}
              onToggleMeal={handleToggleMeal}
              onAddMeal={handleAddMeal}
              onDeleteMeal={handleDeleteMeal}
              onUpdateWater={handleUpdateWater}
            />
          )}

          {activeTab === 'focus' && (
            <TabTimeTracker 
              sessions={sessions}
              onSessionComplete={handleSessionComplete}
              onClearHistory={handleClearHistory}
              onDeleteSession={handleDeleteSession}
            />
          )}

          {activeTab === 'shop' && (
            <TabShop 
              stats={stats}
              onPurchaseTheme={handlePurchaseTheme}
              onApplyTheme={handleApplyTheme}
            />
          )}

          {activeTab === 'settings' && (
            <TabSettings
              stats={stats}
              onUpdateStats={handleUpdateStats}
              cloudUserId={cloudUserId}
              syncStatus={syncStatus}
              onManualSync={handleManualSyncNow}
              onLinkDevice={handleRestoreFromKey}
              onHardReset={handleSettingsHardReset}
              currentTheme={currentTheme}
              routines={routines}
              priorities={priorities}
              meals={meals}
              sessions={sessions}
              events={events}
              onImportProfileData={handleImportProfileData}
              onTriggerToast={triggerToast}
              onLogout={handleResetProfile}
            />
          )}
        </div>

        {/* Premium footer */}
        <div className="text-center py-6 border-t border-slate-900/80" id="motivational-footer">
          <p className="text-xs text-indigo-400 font-semibold tracking-wider uppercase mb-1 flex items-center justify-center gap-1.5">
            <Flame className="w-4 h-4" />
            <span>DAILY REWARD ENGINE READY</span>
          </p>
          <p className="text-xs italic text-slate-505 max-w-lg mx-auto font-medium">
            {getMotivationalQuote()}
          </p>
          <p className="text-[10px] text-slate-600 mt-4 leading-normal font-mono uppercase">
            COMPLETED ACTIONS PERSIST IN BROWSER STORAGE • RE-ENTER AT SUNRISE TO LOCK STREAKS
          </p>
        </div>

      </div>

      {/* ==========================================================================
         THEMATIC ANIMATION OVERLAYS (SINGLE & ALL CHORES COMPLETED)
         ========================================================================== */}
      <AnimatePresence>
        {blackFlashActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: ['star-nebula', 'cyber-grid', 'retrowave-80', 'solar-harvest', 'glacial-aurora', 'sovereign-ruby'].includes(activeThemeId) ? 2.2 : 0.5, 
              times: [0, 0.15, 0.85, 1] 
            }}
            className="fixed inset-0 bg-black/95 z-[999] pointer-events-none flex items-center justify-center overflow-hidden"
          >
            {(() => {
              // Calculate custom messages based on the theme and percentage
              let title = "BLACK FLASH!";
              let subtitle = "Cursed energy sparked";
              let titleClass = "text-rose-500 drop-shadow-[0_0_20px_rgba(244,63,94,0.7)] font-sans italic font-black";
              let subtitleClass = "text-amber-500 font-mono tracking-widest text-xs uppercase";

              if (activeThemeId === 'star-nebula') {
                title = "Stardust Awakened!";
                subtitle = "COSMIC HABIT SYNCED";
                titleClass = "text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-blue-400 to-white drop-shadow-[0_0_30px_rgba(56,189,248,0.9)] font-sans font-black uppercase";
                subtitleClass = "text-sky-300 font-mono tracking-widest text-xs uppercase shadow-sky-500/20";
              } else if (activeThemeId === 'cyber-grid') {
                title = "NODE SYNCED!";
                subtitle = "<< SYS_ENTRY_SUCCESS_200 >>";
                titleClass = "text-transparent bg-clip-text bg-gradient-to-r from-cyan-450 via-blue-500 to-fuchsia-500 drop-shadow-[0_0_25px_rgba(6,182,212,0.8)] font-sans uppercase font-black";
                subtitleClass = "text-cyan-400 font-mono font-bold tracking-widest text-xs uppercase shadow-cyan-500/30";
              } else if (activeThemeId === 'retrowave-80') {
                title = "RETROWAVE SYNCED!";
                subtitle = "<< SYNTH_TRACK_SUCCESS_80S_ONLINE >>";
                titleClass = "text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-orange-450 to-yellow-400 drop-shadow-[0_0_25px_rgba(236,72,153,0.8)] font-sans italic tracking-wide font-black uppercase";
                subtitleClass = "text-orange-400 font-mono font-bold tracking-widest text-xs uppercase shadow-orange-500/30";
              } else if (activeThemeId === 'solar-harvest') {
                title = "SOLAR MUTATION!";
                subtitle = "* GOLDEN ALCHEMICAL TRANSFORMATION *";
                titleClass = "text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-500 to-rose-500 drop-shadow-[0_0_25px_rgba(245,158,11,0.8)] font-sans tracking-tight font-black uppercase";
                subtitleClass = "text-amber-300 font-mono font-bold tracking-widest text-[11px] uppercase";
              } else if (activeThemeId === 'glacial-aurora') {
                title = "GLACIAL RECRYSTALLIZATION!";
                subtitle = "<< NORTHERN LIGHTS PEAK STATE >>";
                titleClass = "text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-400 to-blue-400 drop-shadow-[0_0_25px_rgba(34,211,238,0.8)] font-sans tracking-normal font-bold uppercase";
                subtitleClass = "text-cyan-400 font-mono font-bold tracking-widest text-xs uppercase";
              } else if (activeThemeId === 'sovereign-ruby') {
                title = "SOVEREIGN TRIUMPH!";
                subtitle = "|| ROYAL STATUS SECURED ||";
                titleClass = "text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-red-500 to-amber-500 drop-shadow-[0_0_30px_rgba(225,29,72,0.8)] font-sans italic font-black uppercase";
                subtitleClass = "text-amber-400 font-mono font-bold tracking-widest text-[11px] uppercase";
              }

              // Let's render the theme-specific overlay layout
              if (activeThemeId === 'star-nebula') {
                return (
                  <>
                    {/* Immersive Starry Nebula Complete Background Overlay */}
                    <div className="absolute inset-0 bg-slate-950 overflow-hidden z-0">
                      {/* Deep sapphire blue/cyan sky background */}
                      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 opacity-90" />
                      <div className="absolute w-[600px] h-[600px] rounded-full bg-sky-500/10 blur-[130px] -top-32 -left-32" />
                      <div className="absolute w-[500px] h-[500px] rounded-full bg-blue-600/15 blur-[120px] bottom-12 right-12 animate-pulse" />

                      {/* Twinkling stars */}
                      <svg className="absolute inset-0 w-full h-full">
                        {Array.from({ length: 18 }).map((_, i) => (
                          <motion.circle
                            key={i}
                            cx={`${(i * 17) % 100}%`}
                            cy={`${(i * 23) % 100}%`}
                            r={Math.random() * 1.5 + 1}
                            fill="#ffffff"
                            animate={{ opacity: [0.15, 0.95, 0.15] }}
                            transition={{ repeat: Infinity, duration: 1.5 + Math.random() * 2, delay: i * 0.1 }}
                          />
                        ))}
                        {/* Shooting stars if active */}
                        {latestCompletionPercent >= 100 && (
                          Array.from({ length: 4 }).map((_, i) => (
                            <motion.line
                              key={i}
                              x1={200 + i * 250}
                              y1={-100}
                              x2={100 + i * 250}
                              y2={150}
                              stroke="rgba(255, 255, 255, 0.95)"
                              strokeWidth="2"
                              strokeLinecap="round"
                              initial={{ pathLength: 0, opacity: 1 }}
                              animate={{ pathLength: 1, x: [-100, 300], y: [-100, 300], opacity: [0, 1, 0.8, 0] }}
                              transition={{ duration: 1.5 + i * 0.3, repeat: Infinity, delay: i * 0.4 }}
                            />
                          ))
                        )}
                      </svg>
                    </div>

                    <div className="absolute w-[450px] h-[450px] rounded-full bg-sky-500/25 blur-[120px] mix-blend-screen scale-150 animate-pulse" />

                    {/* Glowing starry space particles paths */}
                    <svg className="absolute inset-0 w-full h-full">
                      {lightningCracks.map((crack, idx) => (
                        <motion.line
                          key={idx}
                          x1={`${crack.x1}%`}
                          y1={`${crack.y1}%`}
                          x2={`${crack.x2}%`}
                          y2={`${crack.y2}%`}
                          stroke={crack.color}
                          strokeWidth={Math.random() * 5 + 3}
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: [0, 1, 0.8, 0] }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                      ))}
                    </svg>

                    <motion.div
                      initial={{ scale: 0.6, rotate: -2 }}
                      animate={{ scale: [0.6, 1.25, 1], rotate: 0 }}
                      className="text-center z-10 p-5"
                    >
                      <div className={`text-4xl sm:text-6xl tracking-tight mb-2 ${titleClass}`}>
                        {title}
                      </div>
                      <div className={subtitleClass}>
                        {subtitle}
                      </div>

                      {/* Sparkler badge with matching design of the image */}
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-950/50 border border-sky-500/25 mt-4">
                        <span className="animate-bounce text-xs">✨</span>
                        <span className="text-[10px] uppercase font-mono tracking-widest text-[#67e8f9] font-bold">
                          STARRY ROUTINE METEOR: {latestCompletionPercent}%
                        </span>
                      </div>
                    </motion.div>
                  </>
                );
              }

              if (activeThemeId === 'cyber-grid') {
                return (
                  <>
                    <div className="absolute w-[500px] h-[500px] rounded-full bg-cyan-500/35 blur-[120px] mix-blend-screen scale-150 animate-pulse" />
                    <div className="absolute w-[300px] h-[300px] rounded-full bg-fuchsia-500/20 blur-[90px] mix-blend-screen scale-125 select-none" />

                    <svg className="absolute inset-0 w-full h-full">
                      {lightningCracks.map((crack, idx) => (
                        <motion.line
                          key={idx}
                          x1={`${crack.x1}%`}
                          y1={`${crack.y1}%`}
                          x2={`${crack.x2}%`}
                          y2={`${crack.y2}%`}
                          stroke={idx % 2 === 0 ? "#06b6d4" : "#ec4899"}
                          strokeWidth={Math.random() * 6 + 4}
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: [0, 1, 0.8, 0] }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                        />
                      ))}
                    </svg>

                    <motion.div
                      initial={{ scale: 0.6, rotate: 3 }}
                      animate={{ scale: [0.6, 1.3, 1], rotate: 0 }}
                      className="text-center z-10"
                    >
                      <div className={`text-4xl sm:text-6xl font-black ${titleClass}`}>
                        {title}
                      </div>
                      <div className={subtitleClass}>
                        {subtitle}
                      </div>

                      {/* Cyber completed badge */}
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/20 mt-4 font-mono">
                        <span className="animate-pulse text-xs text-cyan-400">⚡</span>
                        <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 font-semibold">
                          SYS_CAPACITY_METEOR: {latestCompletionPercent}%
                        </span>
                      </div>
                    </motion.div>
                  </>
                );
              }

              if (activeThemeId === 'retrowave-80') {
                return (
                  <>
                    <div className="absolute inset-0 bg-stone-950 overflow-hidden z-0">
                      {/* Rich glowing neon dawn */}
                      <div className="absolute inset-0 bg-gradient-to-t from-pink-600/20 via-orange-500/10 to-transparent opacity-90" />
                      <div className="absolute w-[600px] h-[400px] rounded-full bg-pink-500/15 blur-[120px] bottom-0 left-1/2 -translate-x-1/2 animate-pulse" />
                      <div className="absolute w-[300px] h-[300px] rounded-full bg-amber-550/10 blur-[100px] top-12 left-12" />
                    </div>

                    {/* Retro Grid Wireframe Lines */}
                    <svg className="absolute bottom-0 inset-x-0 w-full h-[25vh] text-pink-500/20" viewBox="0 0 1440 320" preserveAspectRatio="none">
                      <line x1="0" y1="319" x2="1440" y2="319" stroke="currentColor" strokeWidth="1.5" />
                      {Array.from({ length: 15 }).map((_, i) => (
                        <line
                          key={i}
                          x1={i * 100}
                          y1="320"
                          x2={(i * 100) - 100 + Math.sin(i) * 30}
                          y2="180"
                          stroke="currentColor"
                          strokeWidth="0.8"
                        />
                      ))}
                    </svg>

                    <motion.div
                      initial={{ scale: 0.6, rotate: -2 }}
                      animate={{ scale: [0.6, 1.25, 1], rotate: 0 }}
                      className="text-center z-10 p-5"
                    >
                      <div className={`text-4xl sm:text-6xl tracking-tight mb-2 ${titleClass}`}>
                        {title}
                      </div>
                      <div className={subtitleClass}>
                        {subtitle}
                      </div>

                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-950/50 border border-pink-500/30 mt-4">
                        <span className="animate-bounce text-xs">🌅</span>
                        <span className="text-[10px] uppercase font-mono tracking-widest text-[#f472b6] font-bold">
                          SYNTH SUNSET SYNC: {latestCompletionPercent}%
                        </span>
                      </div>
                    </motion.div>
                  </>
                );
              }

              if (activeThemeId === 'solar-harvest') {
                return (
                  <>
                    <div className="absolute inset-0 bg-slate-950 overflow-hidden z-0">
                      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-amber-950/10 to-transparent opacity-90" />
                      <div className="absolute w-[500px] h-[500px] rounded-full bg-amber-600/15 blur-[130px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>

                    {/* Concentric rotating alchemical rings */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-25 w-[450px] h-[450px] border-4 border-amber-500 border-dashed rounded-full animate-[spin_20s_linear_infinite]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-15 w-[380px] h-[380px] border-2 border-yellow-400 rounded-full animate-[spin_10s_linear_infinite_reverse]" />

                    {/* Ascending alchemical embers */}
                    <div className="absolute inset-x-0 bottom-0 top-1/4 pointer-events-none overflow-hidden">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 rounded-full bg-gradient-to-t from-amber-400 to-yellow-300"
                          style={{ left: `${8 + i * 8}%`, bottom: "0%" }}
                          animate={{
                            y: [0, -500],
                            opacity: [0, 0.9, 0],
                            scale: [0.3, 1.3, 0.2]
                          }}
                          transition={{
                            duration: 2 + Math.random() * 1.5,
                            repeat: Infinity,
                            delay: i * 0.15
                          }}
                        />
                      ))}
                    </div>

                    <motion.div
                      initial={{ scale: 0.6, rotate: 2 }}
                      animate={{ scale: [0.6, 1.25, 1], rotate: 0 }}
                      className="text-center z-10 p-5"
                    >
                      <div className={`text-4xl sm:text-6xl tracking-tight mb-2 ${titleClass}`}>
                        {title}
                      </div>
                      <div className={subtitleClass}>
                        {subtitle}
                      </div>

                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/50 border border-amber-500/30 mt-4">
                        <span className="animate-bounce text-xs">🔆</span>
                        <span className="text-[10px] uppercase font-mono tracking-widest text-[#fbbf24] font-bold">
                          GOLDEN HARVEST CODE: {latestCompletionPercent}%
                        </span>
                      </div>
                    </motion.div>
                  </>
                );
              }

              if (activeThemeId === 'glacial-aurora') {
                return (
                  <>
                    <div className="absolute inset-0 bg-slate-950 overflow-hidden z-0">
                      {/* Undulating liquid northern lights waves */}
                      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-teal-950/10 to-transparent opacity-90" />
                      <div className="absolute w-[600px] h-[500px] rounded-full bg-cyan-500/15 blur-[125px] top-12 left-1/3 animate-pulse" />
                      <div className="absolute w-[400px] h-[400px] rounded-full bg-teal-500/10 blur-[100px] bottom-12 right-12" />
                    </div>

                    {/* Flowing particles */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      {Array.from({ length: 14 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1.5 h-1.5 rounded-full bg-cyan-300/80"
                          style={{ left: `${5 + i * 7}%`, top: `${10 + Math.random() * 30}%` }}
                          animate={{
                            y: [0, 450],
                            x: [0, Math.sin(i) * 35],
                            opacity: [0, 0.8, 0]
                          }}
                          transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: i * 0.12
                          }}
                        />
                      ))}
                    </div>

                    <motion.div
                      initial={{ scale: 0.6, rotate: -1 }}
                      animate={{ scale: [0.6, 1.25, 1], rotate: 0 }}
                      className="text-center z-10 p-5"
                    >
                      <div className={`text-4xl sm:text-6xl tracking-tight mb-2 ${titleClass}`}>
                        {title}
                      </div>
                      <div className={subtitleClass}>
                        {subtitle}
                      </div>

                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-950/50 border border-teal-500/30 mt-4">
                        <span className="animate-bounce text-xs">❄️</span>
                        <span className="text-[10px] uppercase font-mono tracking-widest text-[#22d3ee] font-bold">
                          AURORA GLACIER REACHED: {latestCompletionPercent}%
                        </span>
                      </div>
                    </motion.div>
                  </>
                );
              }

              if (activeThemeId === 'sovereign-ruby') {
                return (
                  <>
                    <div className="absolute inset-0 bg-slate-950 overflow-hidden z-0">
                      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-rose-950/20 to-transparent opacity-90" />
                      <div className="absolute w-[600px] h-[500px] rounded-full bg-rose-700/20 blur-[130px] bottom-12 left-12 animate-pulse" />
                      <div className="absolute w-[450px] h-[450px] rounded-full bg-amber-600/15 blur-[110px] top-12 right-12" />
                    </div>

                    {/* Majestic diamond bursts floating in background */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      {Array.from({ length: 15 }).map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2.5 h-2.5 bg-rose-500"
                          style={{
                            left: `${10 + i * 6}%`,
                            bottom: "5%",
                            clipPath: 'polygon(50% 0%, 100% 38%, 81% 100%, 19% 100%, 0% 38%)'
                          }}
                          animate={{
                            y: [0, -450],
                            rotate: [0, 360],
                            opacity: [0, 0.9, 0],
                            scale: [0.4, 1.2, 0.4]
                          }}
                          transition={{
                            duration: 2.5 + Math.random() * 2,
                            repeat: Infinity,
                            delay: i * 0.14
                          }}
                        />
                      ))}
                    </div>

                    <motion.div
                      initial={{ scale: 0.6, rotate: 3 }}
                      animate={{ scale: [0.6, 1.25, 1], rotate: 0 }}
                      className="text-center z-10 p-5"
                    >
                      <div className={`text-4xl sm:text-6xl tracking-tight mb-2 ${titleClass}`}>
                        {title}
                      </div>
                      <div className={subtitleClass}>
                        {subtitle}
                      </div>

                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/50 border border-rose-550/30 mt-4">
                        <span className="animate-bounce text-xs">👑</span>
                        <span className="text-[10px] uppercase font-mono tracking-widest text-[#f43f5e] font-bold">
                          SOVEREIGN CROWN PROGRESS: {latestCompletionPercent}%
                        </span>
                      </div>
                    </motion.div>
                  </>
                );
              }

              // Default standard red-lightning void/yuji fallback
              return (
                <>
                  <div className="absolute w-[450px] h-[450px] rounded-full bg-rose-700/35 blur-[120px] mix-blend-screen scale-150 animate-ping" />
                  
                  <svg className="absolute inset-0 w-full h-full">
                    {lightningCracks.map((crack, idx) => (
                      <motion.line
                        key={idx}
                        x1={`${crack.x1}%`}
                        y1={`${crack.y1}%`}
                        x2={`${crack.x2}%`}
                        y2={`${crack.y2}%`}
                        stroke={crack.color}
                        strokeWidth={Math.random() * 8 + 4}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: [0, 1, 0.7, 0] }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                      />
                    ))}
                  </svg>

                  <motion.div
                    initial={{ scale: 0.5, rotate: -5 }}
                    animate={{ scale: [0.5, 1.4, 1], rotate: 0 }}
                    className="text-center z-10"
                  >
                    <div className={`text-5xl sm:text-7xl font-sans tracking-wide italic font-black ${titleClass}`}>
                      {title}
                    </div>
                    <div className={`text-xs font-bold font-mono tracking-widest mt-1 uppercase ${subtitleClass}`}>
                      {subtitle}
                    </div>
                  </motion.div>
                </>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {bigBlackFlashActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 bg-black z-[999] pointer-events-none flex flex-col items-center justify-center overflow-hidden"
          >
            {activeThemeId === 'star-nebula' ? (
              <>
                {/* Immersive Starry Nebula "Shooting Star" Fullscreen Overlay */}
                <div 
                  className="absolute inset-0 bg-cover bg-bottom opacity-85 z-0"
                  style={{ backgroundImage: `url(${starrySkyBgImage})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/80 z-0" />
                <div className="absolute w-[800px] h-[800px] rounded-full bg-sky-500/10 blur-[150px] animate-pulse z-0" style={{ animationDuration: '8s' }} />
                <div className="absolute w-[600px] h-[600px] rounded-full bg-indigo-600/15 blur-[120px] animate-pulse z-0" style={{ animationDuration: '6s', animationDelay: '2s' }} />

                {/* Shooting Stars animation tracks slider overlay */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-10 select-none">
                  <svg className="absolute inset-0 w-full h-full">
                    {/* Sliding shooting star line vectors */}
                    {Array.from({ length: 6 }).map((_, i) => (
                      <motion.g key={i}>
                        <motion.line
                          x1="0"
                          y1="0"
                          x2="-150"
                          y2="-150"
                          stroke="rgba(255, 255, 255, 0.95)"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          initial={{ x: 100 + i * 300, y: -50, opacity: 0 }}
                          animate={{ 
                            x: [100 + i * 300, -200 + i * 300], 
                            y: [-50, 250], 
                            opacity: [0, 1, 1, 0] 
                          }}
                          transition={{ 
                            duration: 1.8 + i * 0.4, 
                            repeat: Infinity, 
                            delay: i * 0.5,
                            ease: "easeInOut"
                          }}
                        />
                        <motion.circle
                          r="4"
                          fill="rgba(56, 189, 248, 0.9)"
                          initial={{ x: 100 + i * 300, y: -50, opacity: 0 }}
                          animate={{ 
                            x: [100 + i * 300, -200 + i * 300], 
                            y: [-50, 250], 
                            opacity: [0, 1, 1, 0] 
                          }}
                          transition={{ 
                            duration: 1.8 + i * 0.4, 
                            repeat: Infinity, 
                            delay: i * 0.5,
                            ease: "easeInOut"
                          }}
                          className="filter blur-[1px]"
                        />
                      </motion.g>
                    ))}

                    {/* Constant cosmic stardust sparkles */}
                    {Array.from({ length: 25 }).map((_, i) => (
                      <motion.circle
                        key={i}
                        cx={`${(i * 13) % 100}%`}
                        cy={`${(i * 19) % 100}%`}
                        r={Math.random() * 2 + 1}
                        fill="#ffffff"
                        animate={{ opacity: [0.1, 0.9, 0.1], scale: [0.8, 1.4, 0.8] }}
                        transition={{ repeat: Infinity, duration: 2 + (i % 3) * 0.7, delay: i * 0.1 }}
                      />
                    ))}
                  </svg>
                </div>

                {/* Sparkling Cross-Flare Stars over typography */}
                <div className="relative text-center select-none flex flex-col items-center gap-6 z-20 p-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-sky-300 font-mono tracking-[0.3em] uppercase text-xs font-semibold px-4 py-1.5 border border-sky-450/30 rounded-full bg-slate-950/80 shadow-lg shadow-sky-500/10"
                  >
                    COSMIC HARMONY FULLY ALIGNED
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0.2, rotate: -10, opacity: 0 }}
                    animate={{ scale: [0.2, 1.35, 1], rotate: 0, opacity: 1 }}
                    transition={{ duration: 0.75, type: "spring", stiffness: 95 }}
                    className="relative px-8 py-4 flex items-center justify-center font-sans mt-2"
                  >
                    <span className="absolute text-[8rem] sm:text-[13rem] font-sans font-black tracking-widest text-sky-450/10 blur-xl pointer-events-none uppercase">
                      SHOOTING STARS
                    </span>
                    <span className="text-[6.5rem] sm:text-[11rem] font-black tracking-normal text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-blue-400 to-white drop-shadow-[0_0_60px_rgba(56,189,248,0.955)] select-none uppercase font-sans">
                      Shooting Star!
                    </span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                    className="flex flex-col items-center gap-3.5"
                  >
                    <div className="text-xl sm:text-3xl font-mono tracking-wider font-extrabold text-sky-100 uppercase">
                      CELESTIAL ROTATION COMPLETE!
                    </div>
                    <p className="text-xs sm:text-sm text-sky-300 tracking-widest max-w-[480px] leading-relaxed text-center opacity-90 uppercase font-sans font-medium">
                      "All stellar paths are synced. The cosmos twinkles in absolute wonder. Keep reaching for the stars."
                    </p>
                    <div className="text-[10px] uppercase font-mono tracking-[0.25em] px-3 py-1.5 rounded-full bg-sky-950/50 text-sky-300 border border-sky-400/25 mt-3 shadow-[0_0_15px_rgba(56,189,248,0.35)]">
                      STELLAR CHORES NOMINAL (100%)
                    </div>
                  </motion.div>
                </div>
              </>
            ) : activeThemeId === 'cyber-grid' ? (
              <>
                {/* Immersive Cyberpunk "Wowza!" City Night Complete Overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-950 via-blue-950/40 to-slate-950 opacity-95" />
                <div className="absolute w-[700px] h-[700px] rounded-full bg-cyan-600/10 blur-[150px] animate-pulse" style={{ animationDuration: '6s' }} />
                <div className="absolute w-[500px] h-[500px] rounded-full bg-fuchsia-600/15 blur-[120px] animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }} />

                {/* Cyberpunk vector wireframe city sunset grids inside overlay */}
                <svg className="absolute bottom-0 inset-x-0 w-full h-[40vh] text-cyan-500/15" viewBox="0 0 1440 320" preserveAspectRatio="none">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <line
                      key={i}
                      x1={i * 96}
                      y1="320"
                      x2={(i * 96) - 100}
                      y2="0"
                      stroke="currentColor"
                      strokeWidth="0.8"
                    />
                  ))}
                  <line x1="0" y1="319" x2="1440" y2="319" stroke="currentColor" strokeWidth="2" />
                  <line x1="0" y1="260" x2="1440" y2="260" stroke="currentColor" strokeWidth="1" strokeDasharray="5 5" />
                  <line x1="0" y1="180" x2="1440" y2="180" stroke="currentColor" strokeWidth="0.5" strokeDasharray="10 10" />
                </svg>

                {/* Cyan & Magenta lightning glitch line-sparks */}
                <svg className="absolute inset-0 w-full h-full">
                  {lightningCracks.map((crack, idx) => (
                    <motion.line
                      key={idx}
                      x1={`${crack.x1}%`}
                      y1={`${crack.y1}%`}
                      x2={`${crack.x2}%`}
                      y2={`${crack.y2}%`}
                      stroke={idx % 2 === 0 ? "#06b6d4" : "#ec4899"}
                      strokeWidth={Math.random() * 12 + 6}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ 
                        pathLength: 1, 
                        opacity: [0, 1, 0.4, 1, 0],
                        x1: [`${crack.x1}%`, `${crack.x1 + (Math.random() * 2 - 1)}%`, `${crack.x1}%`],
                        y1: [`${crack.y1}%`, `${crack.y1 + (Math.random() * 2 - 1)}%`, `${crack.y1}%`],
                      }}
                      transition={{ duration: 1.5, repeat: 1, repeatType: "reverse" }}
                    />
                  ))}
                </svg>

                {/* Glowing Matrix code drops */}
                <div className="absolute inset-0">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute text-cyan-400 font-mono text-[10px] whitespace-nowrap opacity-25"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 40}%`,
                      }}
                      animate={{
                        y: [0, 400 + Math.random() * 300],
                        opacity: [0, 0.6, 0]
                      }}
                      transition={{
                        duration: 2 + Math.random() * 2.5,
                        repeat: Infinity,
                        delay: Math.random() * 1.5
                      }}
                    >
                      CRYPT_SUCCESS_SYNC_COMPLETE
                    </motion.div>
                  ))}
                </div>

                {/* Dynamic Wowza! Titles */}
                <div className="relative text-center select-none flex flex-col items-center gap-6 z-10 p-4 font-sans">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="text-cyan-400 font-mono tracking-[0.3em] uppercase text-xs font-semibold px-4 py-1.5 border border-cyan-500/30 rounded-full bg-slate-950/80 shadow-lg shadow-cyan-500/10"
                  >
                    CYBERNETIC COGNITIVE HARMONY
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0.1, rotate: -15, opacity: 0 }}
                    animate={{ scale: [0.1, 1.4, 1], rotate: 0, opacity: 1 }}
                    transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
                    className="relative px-8 py-4 flex items-center justify-center font-sans"
                  >
                    <span className="absolute text-[11rem] sm:text-[16rem] font-sans font-black tracking-widest text-cyan-600/10 blur-xl pointer-events-none uppercase">
                      WOWZA!
                    </span>
                    <span className="text-[8rem] sm:text-[13rem] font-black tracking-normal text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 drop-shadow-[0_0_60px_rgba(6,182,212,0.85)] select-none italic font-sans">
                      Wowza!
                    </span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                    className="flex flex-col items-center gap-3.5"
                  >
                    <div className="text-2xl sm:text-4xl font-mono tracking-wider font-extrabold text-cyan-100 uppercase">
                      SYSTEM COMPILATION PERFECT!
                    </div>
                    <p className="text-xs sm:text-sm text-fuchsia-400 tracking-widest max-w-[460px] leading-relaxed text-center opacity-90 uppercase font-sans font-medium">
                      "All priority directives offline. All systems synced and operational. Welcome to city night, Runner."
                    </p>
                    <div className="text-[10px] uppercase font-mono tracking-[0.25em] px-3 py-1.5 rounded bg-cyan-950/40 text-cyan-300 border border-cyan-500/25 mt-3 shadow-[0_0_12px_rgba(6,182,212,0.2)]">
                      DDR DIRECTIVES NOMINAL (100%)
                    </div>
                  </motion.div>
                </div>
              </>
            ) : (
              <>
                {/* Radial background cosmic space distortions */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-950 via-rose-950/50 to-slate-950 opacity-95" />
                <div className="absolute w-[600px] h-[600px] rounded-full bg-rose-950/20 blur-[130px]" />
                <div className="absolute w-[400px] h-[400px] rounded-full bg-amber-950/15 blur-[110px]" style={{ animationDelay: '1s' }} />

                {/* Lightning SVG Storm */}
                <svg className="absolute inset-0 w-full h-full">
                  {lightningCracks.map((crack, idx) => (
                    <motion.line
                      key={idx}
                      x1={`${crack.x1}%`}
                      y1={`${crack.y1}%`}
                      x2={`${crack.x2}%`}
                      y2={`${crack.y2}%`}
                      stroke={crack.color}
                      strokeWidth={Math.random() * 14 + 7}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ 
                        pathLength: 1, 
                        opacity: [0, 1, 0.4, 1, 0],
                        x1: [`${crack.x1}%`, `${crack.x1 + (Math.random() * 4 - 2)}%`, `${crack.x1}%`],
                        y1: [`${crack.y1}%`, `${crack.y1 + (Math.random() * 4 - 2)}%`, `${crack.y1}%`],
                      }}
                      transition={{ duration: 1.5, repeat: 1, repeatType: "reverse" }}
                    />
                  ))}
                </svg>

                {/* Expansive Energy Burst rings */}
                <motion.div 
                  animate={{ scale: [0.3, 3, 12], opacity: [0.8, 1, 0] }}
                  transition={{ duration: 1.4, ease: "easeOut" }}
                  className="absolute w-48 h-48 rounded-full bg-red-600 blur-[40px]"
                />
                <motion.div 
                  animate={{ scale: [0.1, 1.8, 9], opacity: [1, 1, 0] }}
                  transition={{ duration: 1.9, delay: 0.35, ease: "easeOut" }}
                  className="absolute w-36 h-36 rounded-full bg-amber-500 blur-[28px]"
                />

                {/* Randomized rising cursed energy embers */}
                <div className="absolute inset-0">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        backgroundColor: Math.random() > 0.5 ? '#f43f5e' : '#fbbf24',
                      }}
                      animate={{
                        y: [0, -180 - Math.random() * 120],
                        x: [0, Math.random() * 80 - 40],
                        scale: [0, 1.8, 0],
                        opacity: [0, 0.9, 0],
                      }}
                      transition={{
                        duration: 1.4 + Math.random() * 1.4,
                        repeat: Infinity,
                        delay: Math.random() * 1.2,
                      }}
                    />
                  ))}
                </div>

                {/* Typography and titles */}
                <div className="relative text-center select-none flex flex-col items-center gap-6 z-10 p-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="text-amber-400 font-mono tracking-[0.4em] uppercase text-xs font-semibold px-4 py-1.5 border border-amber-500/25 rounded-full bg-amber-950/20 shadow-lg shadow-amber-500/5"
                  >
                    VESSEL OF SUKUNA: ITADORI YUJI
                  </motion.div>

                  {/* Japanese Kanji logo with giant gold halo */}
                  <motion.div
                    initial={{ scale: 0.1, rotate: -20, opacity: 0 }}
                    animate={{ scale: [0.1, 1.5, 1], rotate: 0, opacity: 1 }}
                    transition={{ duration: 0.65, type: "spring", stiffness: 110 }}
                    className="relative px-8 py-4 flex items-center justify-center"
                  >
                    <span className="absolute text-[9rem] sm:text-[14rem] font-serif font-black text-rose-800/15 blur-lg pointer-events-none">
                      黒閃
                    </span>
                    <span className="text-[7.5rem] sm:text-[12rem] font-serif font-black tracking-[0.1em] text-transparent bg-clip-text bg-gradient-to-b from-rose-500 via-rose-600 to-amber-500 drop-shadow-[0_5px_50px_rgba(244,63,94,0.75)] select-none">
                      黒閃
                    </span>
                  </motion.div>

                  {/* English subtitles */}
                  <motion.div
                    initial={{ opacity: 0, y: 35 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.55 }}
                    className="flex flex-col items-center gap-3.5"
                  >
                    <div className="text-3xl sm:text-5xl font-serif tracking-[0.3em] font-black uppercase text-rose-100 italic">
                      K O K U S E N !
                    </div>
                    <p className="text-xs sm:text-sm font-sans font-medium text-amber-400 tracking-widest max-w-[420px] leading-relaxed text-center opacity-90 italic">
                      "Unleashing consecutive blows of cursed energy to the 2.5th power."
                    </p>
                    <div className="text-[10px] uppercase font-mono tracking-[0.2em] px-2.5 py-1 rounded bg-rose-950/30 text-rose-400 border border-rose-900/30 mt-2">
                      ALL DAILY CHORES ACCOMPLISHED!
                    </div>
                  </motion.div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
