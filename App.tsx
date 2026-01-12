import React, { useState, useEffect } from 'react';
import { generateHealthPlan } from './services/geminiService';
import { HealthPlanResponse, ViewState } from './types';
import HealthContext from './components/HealthContext';
import MealPlanView from './components/MealPlanView';
import ShoppingListView from './components/ShoppingListView';
import { RefreshCw, Utensils, ShoppingCart } from './components/Icons';

// Helper to get current week in YYYY-Www format
const getCurrentWeek = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
  var week1 = new Date(d.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  var millis = d.getTime() - week1.getTime();
  const weekNo = 1 + Math.round(((millis / 86400000) - 3 + (week1.getDay() + 6) % 7) / 7);
  return `${d.getFullYear()}-W${weekNo.toString().padStart(2, '0')}`;
};

const App: React.FC = () => {
  const [week, setWeek] = useState<string>(getCurrentWeek());
  const [plan, setPlan] = useState<HealthPlanResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<ViewState>(ViewState.PLAN);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await generateHealthPlan(week);
      setPlan(data);
    } catch (err) {
      setError("無法生成食譜，請稍後再試或檢查 API Key。");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Generate initial plan on load
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              H
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight hidden sm:block">守護膽固醇</h1>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight sm:hidden">守護膽固醇</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <input 
                type="week" 
                value={week}
                onChange={(e) => setWeek(e.target.value)}
                className="pl-3 pr-2 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50 text-slate-700 outline-none"
              />
            </div>
            <button 
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-full transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{loading ? '生成中...' : '生成食譜'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-100">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
            <p className="animate-pulse text-center">
              正在分析 {week} 的當季食材...<br/>
              並為您規劃高效重複利用的菜單
            </p>
          </div>
        )}

        {/* Content */}
        {!loading && plan && (
          <>
            <HealthContext advice={plan.advice} />

            {/* View Toggle (Mobile Sticky) */}
            <div className="sticky top-20 z-20 bg-slate-50/95 backdrop-blur py-2 mb-6 flex sm:hidden justify-center gap-2">
               <button 
                onClick={() => setView(ViewState.PLAN)}
                className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold shadow-sm transition-all ${view === ViewState.PLAN ? 'bg-emerald-600 text-white ring-2 ring-emerald-600 ring-offset-2 ring-offset-slate-50' : 'bg-white text-slate-600'}`}
               >
                 <Utensils className="w-4 h-4" /> 食譜
               </button>
               <button 
                onClick={() => setView(ViewState.SHOPPING)}
                className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold shadow-sm transition-all ${view === ViewState.SHOPPING ? 'bg-emerald-600 text-white ring-2 ring-emerald-600 ring-offset-2 ring-offset-slate-50' : 'bg-white text-slate-600'}`}
               >
                 <ShoppingCart className="w-4 h-4" /> 採買
               </button>
            </div>

            {/* Desktop Tabs */}
            <div className="hidden sm:flex mb-8 border-b border-slate-200 justify-between items-center">
              <div className="flex">
                <button
                  onClick={() => setView(ViewState.PLAN)}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${view === ViewState.PLAN ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                  <Utensils className="w-4 h-4" /> 
                  一週食譜
                </button>
                <button
                  onClick={() => setView(ViewState.SHOPPING)}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${view === ViewState.SHOPPING ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                  <ShoppingCart className="w-4 h-4" /> 
                  採買清單
                  <span className="bg-slate-100 text-slate-600 text-xs py-0.5 px-2 rounded-full ml-2">
                    {plan.shoppingList.length}
                  </span>
                </button>
              </div>
              <div className="text-xs text-slate-400 italic px-4">
                 * 本週計畫使用約 20 種核心食材重複變化
              </div>
            </div>

            {/* Views */}
            <div className="transition-opacity duration-300">
              {view === ViewState.PLAN ? (
                <MealPlanView days={plan.weeklyPlan} />
              ) : (
                <ShoppingListView items={plan.shoppingList} />
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default App;