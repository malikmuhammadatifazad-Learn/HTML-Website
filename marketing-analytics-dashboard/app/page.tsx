'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

type Campaign = {
  id: string;
  name: string;
  platform: string;
  spend: number;
  revenue: number;
  impressions: number;
  clicks: number;
  status: string;
  createdAt: string;
};

const COLORS = ['#2563eb', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function Home() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState('All');

  useEffect(() => {
    fetch('/api/campaigns')
      .then((res) => res.json())
      .then((data) => {
        setCampaigns(data);
        setLoading(false);
      });
  }, []);

  const filteredCampaigns = selectedPlatform === 'All'
    ? campaigns
    : campaigns.filter((c) => c.platform === selectedPlatform);

  const platforms = ['All', ...new Set(campaigns.map((c) => c.platform))];

  const totalSpend = filteredCampaigns.reduce((sum, c) => sum + c.spend, 0);
  const totalRevenue = filteredCampaigns.reduce((sum, c) => sum + c.revenue, 0);
  const totalProfit = totalRevenue - totalSpend;
  const totalRoas = totalSpend > 0 ? (totalRevenue / totalSpend) : 0;
  const activeCampaigns = filteredCampaigns.filter((c) => c.status === 'Active').length;
  const totalImpressions = filteredCampaigns.reduce((sum, c) => sum + c.impressions, 0);
  const totalClicks = filteredCampaigns.reduce((sum, c) => sum + c.clicks, 0);
  const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

  const platformData = Object.values(
    campaigns.reduce((acc: Record<string, { name: string; value: number }>, c) => {
      if (!acc[c.platform]) {
        acc[c.platform] = { name: c.platform, value: 0 };
      }
      acc[c.platform].value += c.spend;
      return acc;
    }, {})
  );

  const barData = filteredCampaigns.map((c) => ({
    name: c.name,
    Spend: c.spend,
    Revenue: c.revenue,
    Profit: c.revenue - c.spend,
  }));

  const lineData = filteredCampaigns.map((c) => ({
    name: c.name,
    ROAS: c.spend > 0 ? Number((c.revenue / c.spend).toFixed(2)) : 0,
  }));

  const getRoasColor = (roas: number) => {
    if (roas >= 3) return 'text-green-700';
    if (roas >= 1.5) return 'text-orange-500';
    return 'text-red-600';
  };

  const getProfitColor = (profit: number) => {
    if (profit > 0) return 'text-green-700';
    if (profit === 0) return 'text-gray-500';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-gray-500">Loading dashboard...</div>
    </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">📊 Marketing Dashboard</h1>
          <p className="text-sm text-gray-500">Real-time campaign performance analytics</p>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          >
            {platforms.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Total Spend</p>
          <p className="text-xl font-bold text-gray-800">${totalSpend.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Revenue</p>
          <p className="text-xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Profit</p>
          <p className={`text-xl font-bold ${getProfitColor(totalProfit)}`}>
            ${totalProfit.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wider">ROAS</p>
          <p className={`text-xl font-bold ${getRoasColor(totalRoas)}`}>
            {totalRoas.toFixed(2)}x
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Impressions</p>
          <p className="text-xl font-bold text-gray-800">{totalImpressions.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wider">CTR</p>
          <p className="text-xl font-bold text-blue-600">{ctr.toFixed(2)}%</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Campaign Performance</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Spend" fill="#2563eb" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Revenue" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Profit" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Spend by Platform</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
  data={platformData}
  cx="50%"
  cy="50%"
  innerRadius={60}
  outerRadius={100}
  paddingAngle={2}
  dataKey="value"
  label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
  labelLine={false}
>
  {platformData.map((_, index) => (
    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
  ))}
</Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ROAS Trend Line Chart */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">ROAS Trend by Campaign</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 'auto']} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="ROAS"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Campaign Table */}
      {filteredCampaigns.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
          <p className="text-gray-500">No campaigns yet. Add your first campaign in the <a href="/campaigns" className="text-blue-600 hover:underline">Campaigns</a> page.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left p-3 font-semibold text-gray-600">Campaign</th>
                  <th className="text-left p-3 font-semibold text-gray-600">Platform</th>
                  <th className="text-right p-3 font-semibold text-gray-600">Spend</th>
                  <th className="text-right p-3 font-semibold text-gray-600">Revenue</th>
                  <th className="text-right p-3 font-semibold text-gray-600">Profit</th>
                  <th className="text-right p-3 font-semibold text-gray-600">Impressions</th>
                  <th className="text-right p-3 font-semibold text-gray-600">Clicks</th>
                  <th className="text-center p-3 font-semibold text-gray-600">ROAS</th>
                  <th className="text-center p-3 font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.map((c, index) => {
                  const profit = c.revenue - c.spend;
                  const roas = c.spend > 0 ? (c.revenue / c.spend) : 0;
                  const isEven = index % 2 === 0;
                  return (
                    <tr key={c.id} className={`border-b border-gray-100 hover:bg-gray-50 transition ${isEven ? 'bg-white' : 'bg-gray-50/50'}`}>
                      <td className="p-3 font-medium text-gray-800">{c.name}</td>
                      <td className="p-3 text-gray-600">{c.platform}</td>
                      <td className="p-3 text-right font-medium text-gray-800">${c.spend.toLocaleString()}</td>
                      <td className="p-3 text-right font-medium text-green-600">${c.revenue.toLocaleString()}</td>
                      <td className={`p-3 text-right font-bold ${getProfitColor(profit)}`}>
                        ${profit.toLocaleString()}
                      </td>
                      <td className="p-3 text-right text-gray-600">{c.impressions.toLocaleString()}</td>
                      <td className="p-3 text-right text-gray-600">{c.clicks.toLocaleString()}</td>
                      <td className={`p-3 text-center font-bold ${getRoasColor(roas)}`}>
                        {roas.toFixed(2)}x
                      </td>
                      <td className="p-3 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          c.status === 'Active' ? 'bg-green-100 text-green-700' :
                          c.status === 'Paused' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}