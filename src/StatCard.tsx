import React from "react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle }) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 px-3 py-3">
      <p className="text-[11px] text-slate-400">{title}</p>
      <p className="text-lg font-semibold mt-1">{value}</p>
      {subtitle && <p className="text-[11px] text-slate-400 mt-1">{subtitle}</p>}
    </div>
  );
};
