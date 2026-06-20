export interface AppTheme {
  id: string;
  name: string;
  description: string;
  cost: number;
  bgClass: string;
  textClass: string;
  panelClass: string; // Background of containers/panels
  borderClass: string; // Border accent
  tabInactiveClass: string;
  accentText: string;
  btnGradient: string;
  glowClass: string;
  colorName: string; // e.g., 'indigo', 'emerald'
  onboardingGlow: string;
}

export const THEMES: AppTheme[] = [
  {
    id: 'jujutsu-yuji',
    name: 'Divergent Fist: Yuji',
    description: "Unleash ryomen sukuna's vessel! Deep Tokyo Jujutsu High navy-sorcerer uniforms, flaming pink-red cursed energy flow, and crackling high-contrast gold Black Flash lightning.",
    cost: 50,
    bgClass: 'bg-slate-950 text-rose-50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-950/30 via-slate-950 to-slate-950',
    textClass: 'text-rose-50',
    panelClass: 'bg-indigo-950/20 border-rose-900/25',
    borderClass: 'border-rose-900/30',
    tabInactiveClass: 'bg-rose-950/5 border-slate-800 text-slate-400 hover:text-rose-300 hover:bg-rose-950/10',
    accentText: 'text-rose-400',
    btnGradient: 'from-rose-500 via-red-500 to-amber-500 hover:from-rose-600 hover:to-amber-600',
    glowClass: 'shadow-rose-950/35 border-rose-500/10',
    colorName: 'rose',
    onboardingGlow: 'from-rose-500/15 to-amber-500/0'
  },
  {
    id: 'classic-void',
    name: 'Midnight Void',
    description: 'The standard premium deep space void layout. Sleek, classic, and extremely easy on the eyes.',
    cost: 0,
    bgClass: 'bg-slate-950 text-slate-100',
    textClass: 'text-slate-100',
    panelClass: 'bg-slate-900 border-slate-800/85',
    borderClass: 'border-slate-800',
    tabInactiveClass: 'bg-slate-900/30 border-slate-850 text-slate-400 hover:text-slate-200 hover:bg-slate-900/50',
    accentText: 'text-indigo-400',
    btnGradient: 'from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600',
    glowClass: 'shadow-indigo-950/20',
    colorName: 'indigo',
    onboardingGlow: 'from-indigo-500/10 to-purple-500/0'
  },
  {
    id: 'cyber-grid',
    name: 'Matrix Cyberpunk',
    description: 'A glowing cyberpunk city skyline theme with blueish, cyanish, and neon pink night lights.',
    cost: 150,
    bgClass: 'bg-slate-950 text-cyan-50',
    textClass: 'text-cyan-50',
    panelClass: 'bg-slate-950/40 backdrop-blur-md border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]',
    borderClass: 'border-cyan-500/30',
    tabInactiveClass: 'bg-slate-950/60 border-cyan-950/40 text-cyan-700 hover:text-cyan-400 hover:border-cyan-500/20',
    accentText: 'text-cyan-400',
    btnGradient: 'from-cyan-500 via-blue-600 to-fuchsia-500 hover:from-cyan-400 hover:to-fuchsia-400',
    glowClass: 'shadow-[0_0_20px_rgba(6,182,212,0.25)]',
    colorName: 'cyan',
    onboardingGlow: 'from-cyan-500/15 via-pink-500/5 to-transparent'
  },
  {
    id: 'star-nebula',
    name: 'Starry Nebula',
    description: 'Immersive deep sapphire blue night sky filled with countless twinkling stars & cyan stardust.',
    cost: 250,
    bgClass: 'bg-slate-950 text-sky-50',
    textClass: 'text-sky-50',
    panelClass: 'bg-slate-950/40 backdrop-blur-md border-sky-500/20 shadow-[0_0_15px_rgba(14,165,233,0.12)]',
    borderClass: 'border-sky-500/25',
    tabInactiveClass: 'bg-slate-950/60 border-sky-950/40 text-sky-700 hover:text-sky-300 hover:border-sky-500/20',
    accentText: 'text-sky-450',
    btnGradient: 'from-sky-400 via-blue-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500',
    glowClass: 'shadow-[0_0_20px_rgba(14,165,233,0.25)]',
    colorName: 'sky',
    onboardingGlow: 'from-sky-500/15 via-blue-500/5 to-transparent'
  },
  {
    id: 'retrowave-80',
    name: '80s Retrowave',
    description: 'Synthwave neon sunsets under active retro neon codes. Radiates warmth and dynamic pixel nostalgia.',
    cost: 350,
    bgClass: 'bg-stone-950 text-orange-50',
    textClass: 'text-orange-100',
    panelClass: 'bg-stone-900/90 border-orange-900/35',
    borderClass: 'border-orange-900/30',
    tabInactiveClass: 'bg-stone-900/50 border-stone-850 text-stone-400 hover:text-orange-300 hover:bg-stone-900/80',
    accentText: 'text-orange-400',
    btnGradient: 'from-pink-500 via-orange-500 to-amber-500 hover:from-pink-650 hover:to-amber-550',
    glowClass: 'shadow-orange-950/30',
    colorName: 'orange',
    onboardingGlow: 'from-orange-500/10 to-pink-500/0'
  },
  {
    id: 'solar-harvest',
    name: 'Solar Alchemy',
    description: 'Pure solar power with glowing warm bronzes, golds, and highly productive amber tones.',
    cost: 450,
    bgClass: 'bg-yellow-950/5 text-amber-50',
    textClass: 'text-amber-100',
    panelClass: 'bg-slate-900/90 border-amber-900/30',
    borderClass: 'border-amber-900/25',
    tabInactiveClass: 'bg-amber-950/10 border-slate-800 text-slate-400 hover:text-amber-300 hover:bg-amber-950/20',
    accentText: 'text-amber-400',
    btnGradient: 'from-amber-500 via-yellow-500 to-rose-500 hover:from-amber-600 hover:to-rose-600',
    glowClass: 'shadow-amber-950/20',
    colorName: 'amber',
    onboardingGlow: 'from-amber-500/10 to-yellow-500/0'
  },
  {
    id: 'glacial-aurora',
    name: 'Arctic Glacier',
    description: 'Refreshing ice cold breeze highlighted by beautiful mint and deep frozen high-fidelity auroras.',
    cost: 550,
    bgClass: 'bg-slate-950 text-cyan-50',
    textClass: 'text-cyan-50',
    panelClass: 'bg-slate-900/95 border-sky-900/30',
    borderClass: 'border-sky-900/25',
    tabInactiveClass: 'bg-sky-950/10 border-slate-850 text-slate-400 hover:text-cyan-300 hover:bg-sky-950/20',
    accentText: 'text-cyan-400',
    btnGradient: 'from-cyan-400 via-teal-500 to-blue-500 hover:from-cyan-500 hover:to-blue-600',
    glowClass: 'shadow-cyan-950/20',
    colorName: 'cyan',
    onboardingGlow: 'from-cyan-500/10 to-blue-500/0'
  },
  {
    id: 'sovereign-ruby',
    name: 'Sovereign Ruby',
    description: 'Extravagant royal ruby reds matched with golden gradients of supreme high-tier rulers.',
    cost: 750,
    bgClass: 'bg-red-950/5 text-rose-50',
    textClass: 'text-rose-100',
    panelClass: 'bg-slate-900/90 border-rose-900/30',
    borderClass: 'border-rose-900/25',
    tabInactiveClass: 'bg-rose-950/10 border-slate-800 text-slate-400 hover:text-rose-300 hover:bg-rose-950/20',
    accentText: 'text-rose-400',
    btnGradient: 'from-rose-600 via-red-505 to-amber-500 hover:from-rose-700 hover:to-amber-600',
    glowClass: 'shadow-rose-950/35',
    colorName: 'rose',
    onboardingGlow: 'from-rose-500/10 to-red-500/0'
  }
];
