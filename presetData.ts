import { PresetType, PresetData } from './types';

export const PRESETS: Record<PresetType, PresetData> = {
  student: {
    title: 'Academic Scholar',
    description: 'Tailored for students aiming to balance lectures, intensive study blocks, physical activity, and healthy meal preps.',
    icon: 'GraduationCap',
    routines: [],
    priorities: [
      { title: 'Work on upcoming major assignment / essay', difficulty: 'high', xpValue: 45 },
      { title: 'Review lecture notes taken this week', difficulty: 'medium', xpValue: 25 },
      { title: 'Organize study desk and digital files', difficulty: 'low', xpValue: 15 }
    ],
    meals: [
      { mealType: 'breakfast', name: 'Brain Booster Oatmeal with berries & walnuts', calories: '380', protein: '12', xpValue: 15 },
      { mealType: 'lunch', name: 'Turkey Breast Sandwich with whole grain bread', calories: '520', protein: '35', xpValue: 15 },
      { mealType: 'dinner', name: 'Salmon Salad with mixed greens and avocado', calories: '610', protein: '42', xpValue: 20 },
      { mealType: 'snack', name: 'Handful of almonds and an apple', calories: '180', protein: '4', xpValue: 10 }
    ]
  },
  gym: {
    title: 'Fitness & Gym Warrior',
    description: 'Designed for athletes, weightlifters, and fitness enthusiasts optimizing training phases, protein intake, and recovery.',
    icon: 'Dumbbell',
    routines: [],
    priorities: [
      { title: 'Hit target workout split / key target lift', difficulty: 'high', xpValue: 45 },
      { title: 'Pack meals and portion daily snacks', difficulty: 'medium', xpValue: 25 },
      { title: 'Log physical recovery, soreness levels & gym metrics', difficulty: 'low', xpValue: 15 }
    ],
    meals: [
      { mealType: 'breakfast', name: 'Egg White Omelet with spinach & avocado toasting', calories: '450', protein: '40', xpValue: 15 },
      { mealType: 'lunch', name: 'Grilled Chicken, Brown Rice, and Broccoli', calories: '650', protein: '55', xpValue: 15 },
      { mealType: 'dinner', name: 'Lean Beef Sirloin, Sweet Potato, and Asparagus', calories: '720', protein: '50', xpValue: 20 },
      { mealType: 'snack', name: 'Greek Yogurt with whey scoop & chia seeds', calories: '290', protein: '30', xpValue: 10 }
    ]
  },
  work: {
    title: 'High-Performance Executive',
    description: 'Optimized for professionals, remote workers, or creators managing time blocks, deep meetings, and mental decompression.',
    icon: 'Briefcase',
    routines: [],
    priorities: [
      { title: 'Deliver primary project milestone today', difficulty: 'high', xpValue: 45 },
      { title: 'Prepare deck/notes for critical alignment meetings', difficulty: 'medium', xpValue: 25 },
      { title: 'Organize email folders & action items list', difficulty: 'low', xpValue: 15 }
    ],
    meals: [
      { mealType: 'breakfast', name: 'Avocado Toast with soft-boiled eggs & Espresso', calories: '410', protein: '18', xpValue: 15 },
      { mealType: 'lunch', name: 'Mediterranean Quinoa Salad with Feta & Hummus', calories: '580', protein: '16', xpValue: 15 },
      { mealType: 'dinner', name: 'Stir-fried Tofu & Peppers with buckwheat noodles', calories: '530', protein: '22', xpValue: 20 },
      { mealType: 'snack', name: 'Dark chocolate piece and green tea cup', calories: '120', protein: '2', xpValue: 10 }
    ]
  },
  general: {
    title: 'Balanced Life Harmonizer',
    description: 'Perfect for anyone seeking healthy daily rhythms, solid sleep, hydration, home care, and personal wellness.',
    icon: 'Activity',
    routines: [],
    priorities: [
      { title: 'Complete outstanding domestic / admin chore', difficulty: 'high', xpValue: 45 },
      { title: 'Dedicate 30 mins to active home physical care', difficulty: 'medium', xpValue: 25 },
      { title: 'Organize clutter in closet or bedroom drawer', difficulty: 'low', xpValue: 15 }
    ],
    meals: [
      { mealType: 'breakfast', name: 'Natural Yogurt Bowl with banana slices & honey', calories: '320', protein: '14', xpValue: 15 },
      { mealType: 'lunch', name: 'Warm Lentil soup and butter sourdough slice', calories: '490', protein: '18', xpValue: 15 },
      { mealType: 'dinner', name: 'Herb roasted chicken with mixed sheet pan vegetables', calories: '620', protein: '45', xpValue: 20 },
      { mealType: 'snack', name: 'Mixed fresh fruit bowl', calories: '150', protein: '2', xpValue: 10 }
    ]
  }
};
