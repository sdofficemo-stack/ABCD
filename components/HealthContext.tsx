import React from 'react';
import { HeartPulse } from './Icons';

interface Props {
  advice?: string;
}

const HealthContext: React.FC<Props> = ({ advice }) => {
  return (
    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-6 shadow-sm mb-8">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full shrink-0">
          <HeartPulse className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-emerald-900 mb-2">專屬健康目標：改善血脂</h2>
          <ul className="text-sm text-emerald-800 space-y-1 mb-3 list-disc list-inside opacity-80">
            <li>針對總膽固醇偏高與 LDL 控制</li>
            <li>優化 LDL/HDL 比值</li>
            <li>低飽和脂肪，高纖維，富含 Omega-3</li>
          </ul>
          {advice && (
            <div className="mt-4 p-4 bg-white/60 rounded-lg text-sm text-emerald-900 border border-emerald-100/50">
              <span className="font-bold block mb-1">專家建議：</span>
              {advice}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthContext;