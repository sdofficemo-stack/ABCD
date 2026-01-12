export interface Meal {
  name: string;
  description: string;
  ingredients: string[];
  healthBenefit: string; // Why is this good for cholesterol?
}

export interface DayPlan {
  day: number;
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snack: Meal;
}

export interface ShoppingItem {
  item: string;
  quantity: string;
  category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Condiments';
}

export interface HealthPlanResponse {
  weeklyPlan: DayPlan[];
  shoppingList: ShoppingItem[];
  advice: string; // General advice based on the condition
}

export enum ViewState {
  PLAN = 'PLAN',
  SHOPPING = 'SHOPPING'
}