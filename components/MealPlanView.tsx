import React from 'react';
import { DayPlan, Meal } from '../types';

interface Props {
  days: DayPlan[];
}

const MealRow: React.FC<{ label: string; meal: Meal; icon: string }> = ({ label, meal, icon }) => (
  <div className="relative pl-3 border-l-2 border-slate-100 hover:border-emerald-300 transition-colors py-1 group">
    <div className="flex items-baseline justify-between mb-1">
      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
        {icon} {label}
      </span>
    </div>
    <h4 className="font-semibold text-slate-800 text-sm mb-1 leading-tight group-hover:text-emerald-700 transition-colors">{meal.name}</h4>
    <p className="text-xs text-slate-500 mb-1.5 line-clamp-2 leading-relaxed">{meal.description}</p>
    <div>
      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
        益處：{meal.healthBenefit}
      </span>
    </div>
  </div>
);

const DayColumn: React.FC<{ dayPlan: DayPlan }> = ({ dayPlan }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow duration-300">
      <div className="bg-slate-50 px-5 py-3 border-b border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            {dayPlan.day}
          </div>
          <h3 className="font-bold text-slate-700">第 {dayPlan.day} 天</h3>
        </div>
      </div>
      
      <div className="p-5 flex-1 space-y-6">
        <MealRow label="早餐" meal={dayPlan.breakfast} icon="☀️" />
        <MealRow label="午餐" meal={dayPlan.lunch} icon="🥗" />
        <MealRow label="晚餐" meal={dayPlan.dinner} icon="🍽️" />
        <MealRow label="點心" meal={dayPlan.snack} icon="🍎" />
      </div>
    </div>
  );
};

const MealPlanView: React.FC<Props> = ({ days }) => {
  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
         <h3 className="text-2xl font-bold text-slate-800">本週七天食譜計畫</h3>
         <p className="text-sm text-slate-500">已為您規劃每日四餐，以核心食材變化組合</p>
      </div>
     
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {days.map((day) => (
          <DayColumn key={day.day} dayPlan={day} />
        ))}
      </div>
    </div>
  );
};

export default MealPlanView;