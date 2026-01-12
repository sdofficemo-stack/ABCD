import React, { useState } from 'react';
import { ShoppingItem } from '../types';
import { CheckCircle } from './Icons';

interface Props {
  items: ShoppingItem[];
}

const ShoppingListView: React.FC<Props> = ({ items }) => {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleItem = (itemName: string) => {
    const newSet = new Set(checkedItems);
    if (newSet.has(itemName)) {
      newSet.delete(itemName);
    } else {
      newSet.add(itemName);
    }
    setCheckedItems(newSet);
  };

  // Group by category
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ShoppingItem[]>);

  // Define category order for consistency based on Meal Type
  const categoryOrder = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Condiments'];
  
  const translateCategory = (cat: string) => {
    const map: Record<string, string> = {
      'Breakfast': '早餐食材',
      'Lunch': '午餐食材',
      'Dinner': '晚餐食材',
      'Snack': '點心與補充品',
      'Condiments': '通用調料與其他',
    };
    return map[cat] || cat;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-slate-800">本週採買清單 (依餐別)</h3>
        <span className="text-sm text-slate-500">共 {items.length} 項食材</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categoryOrder.map((cat) => {
          if (!groupedItems[cat]) return null;
          return (
            <div key={cat} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="bg-emerald-50 px-4 py-3 border-b border-emerald-100 font-bold text-emerald-800 flex items-center gap-2">
                <span>{translateCategory(cat)}</span>
              </div>
              <ul className="divide-y divide-slate-50">
                {groupedItems[cat].map((item, idx) => {
                  const isChecked = checkedItems.has(item.item);
                  return (
                    <li 
                      key={`${item.item}-${idx}`} 
                      className={`flex items-center p-4 hover:bg-slate-50 transition-colors cursor-pointer select-none ${isChecked ? 'bg-slate-50' : ''}`}
                      onClick={() => toggleItem(item.item)}
                    >
                      <div className={`w-5 h-5 rounded border mr-3 flex items-center justify-center transition-all ${isChecked ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 bg-white'}`}>
                        {isChecked && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <div className="flex-1">
                        <span className={`block font-medium ${isChecked ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                          {item.item}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {item.quantity}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShoppingListView;