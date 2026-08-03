'use client';

import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Legend,
  LabelList
} from 'recharts';

interface ChartData {
  name: string;
  value: number;
}

interface AIChartProps {
  type: 'bar' | 'line' | 'area' | 'pie';
  title: string;
  data: ChartData[];
  isDarkMode: boolean;
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#06b6d4', '#84cc16'];

export const AIChart = ({ type, title, data, isDarkMode }: AIChartProps) => {
  const textColor = isDarkMode ? '#e5e7eb' : '#374151';
  const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

  const renderChart = () => {
    switch (type) {
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff', 
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                color: textColor
              }} 
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        );
      case 'line':
        return (
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" stroke={textColor} fontSize={12} />
            <YAxis stroke={textColor} fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff', 
                borderColor: isDarkMode ? '#374151' : '#e5e7eb',
                color: textColor
              }} 
            />
            <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }}>
              <LabelList dataKey="value" position="top" offset={10} style={{ fill: textColor, fontSize: '12px', fontWeight: 'bold' }} />
            </Line>
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="name" stroke={textColor} fontSize={12} />
            <YAxis stroke={textColor} fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff', 
                borderColor: isDarkMode ? '#374151' : '#e5e7eb',
                color: textColor
              }} 
            />
            <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2}>
              <LabelList dataKey="value" position="top" offset={10} style={{ fill: textColor, fontSize: '12px', fontWeight: 'bold' }} />
            </Area>
          </AreaChart>
        );
      case 'bar':
      default:
        return (
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="name" stroke={textColor} fontSize={12} />
            <YAxis stroke={textColor} fontSize={12} />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ 
                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff', 
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                color: textColor
              }} 
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
              <LabelList dataKey="value" position="top" style={{ fill: textColor, fontSize: '12px', fontWeight: 'bold' }} />
            </Bar>
          </BarChart>
        );
    }
  };

  return (
    <div className={`my-6 p-6 rounded-3xl border ${isDarkMode ? 'bg-[rgba(0,0,0,0.2)] border-[rgba(255,255,255,0.1)]' : 'bg-[#ffffff] border-[#e5e7eb]'} shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]`}>
      <h4 className={`text-base font-bold mb-6 flex items-center gap-2 ${isDarkMode ? 'text-[#ffffff]' : 'text-[#111827]'}`}>
        <div className="w-1 h-4 bg-[#3b82f6] rounded-full" />
        {title}
      </h4>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

