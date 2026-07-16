'use client';

import { useEffect, useState } from 'react';

type Campaign = {
  id: string;
  name: string;
  platform: string;
  spend: number;
  revenue: number;
  impressions: number;
  clicks: number;
  status: string;
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    platform: '',
    spend: '',
    revenue: '',
    impressions: '',
    clicks: '',
    status: 'Active',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchCampaigns = async () => {
    const res = await fetch('/api/campaigns');
    const data = await res.json();
    setCampaigns(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      name: form.name,
      platform: form.platform,
      spend: Number(form.spend) || 0,
      revenue: Number(form.revenue) || 0,
      impressions: Number(form.impressions) || 0,
      clicks: Number(form.clicks) || 0,
      status: form.status,
      userId: 'temp-user-id',
    };

    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/campaigns/${editingId}` : '/api/campaigns';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setForm({ name: '', platform: '', spend: '', revenue: '', impressions: '', clicks: '', status: 'Active' });
      setEditingId(null);
      fetchCampaigns();
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!id) {
      alert('This campaign has no ID. Please delete it from Prisma Studio.');
      return;
    }
    if (!confirm('Delete this campaign?')) return;
    const res = await fetch(`/api/campaigns/${id}`, { method: 'DELETE' });
    if (res.ok) fetchCampaigns();
  };

  const startEdit = (c: Campaign) => {
    if (!c.id) {
      alert('This campaign has no ID and cannot be edited. Please delete it from Prisma Studio.');
      return;
    }
    setEditingId(c.id);
    setForm({
      name: c.name,
      platform: c.platform,
      spend: c.spend.toString(),
      revenue: c.revenue.toString(),
      impressions: c.impressions.toString(),
      clicks: c.clicks.toString(),
      status: c.status,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: '', platform: '', spend: '', revenue: '', impressions: '', clicks: '', status: 'Active' });
  };

  if (loading) return <p className="text-gray-500">Loading...</p>;

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

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">📊 Campaigns</h1>

      {/* Add/Edit Campaign Form */}
      <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded-xl shadow-md border border-gray-200 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          {editingId ? '✏️ Edit Campaign' : '➕ Add New Campaign'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Campaign Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-800 bg-white"
            required
          />
          <select
            value={form.platform}
            onChange={(e) => setForm({ ...form, platform: e.target.value })}
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-800 bg-white"
            required
          >
            <option value="">Select Platform</option>
            <option value="Meta">Meta</option>
            <option value="TikTok">TikTok</option>
            <option value="Google">Google</option>
            <option value="Taboola">Taboola</option>
            <option value="Outbrain">Outbrain</option>
          </select>
          <input
            type="number"
            placeholder="Spend ($)"
            value={form.spend}
            onChange={(e) => setForm({ ...form, spend: e.target.value })}
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-800 bg-white"
          />
          <input
            type="number"
            placeholder="Revenue ($)"
            value={form.revenue}
            onChange={(e) => setForm({ ...form, revenue: e.target.value })}
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-800 bg-white"
          />
          <input
            type="number"
            placeholder="Impressions"
            value={form.impressions}
            onChange={(e) => setForm({ ...form, impressions: e.target.value })}
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-800 bg-white"
          />
          <input
            type="number"
            placeholder="Clicks"
            value={form.clicks}
            onChange={(e) => setForm({ ...form, clicks: e.target.value })}
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-800 bg-white"
          />
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-800 bg-white"
          >
            <option value="Active">Active</option>
            <option value="Paused">Paused</option>
            <option value="Ended">Ended</option>
          </select>
        </div>
        <div className="mt-4 flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition disabled:opacity-50 shadow-sm"
          >
            {submitting ? 'Saving...' : editingId ? '💾 Update Campaign' : '➕ Add Campaign'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-6 py-3 rounded-lg transition shadow-sm"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Campaign Table */}
      {campaigns.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No campaigns yet. Add your first one above!</p>
      ) : (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left p-4 font-semibold text-gray-600">Campaign</th>
                  <th className="text-left p-4 font-semibold text-gray-600">Platform</th>
                  <th className="text-right p-4 font-semibold text-gray-600">Spend</th>
                  <th className="text-right p-4 font-semibold text-gray-600">Revenue</th>
                  <th className="text-right p-4 font-semibold text-gray-600">Profit</th>
                  <th className="text-right p-4 font-semibold text-gray-600">Impressions</th>
                  <th className="text-right p-4 font-semibold text-gray-600">Clicks</th>
                  <th className="text-center p-4 font-semibold text-gray-600">ROAS</th>
                  <th className="text-center p-4 font-semibold text-gray-600">Status</th>
                  <th className="text-center p-4 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c, index) => {
                  const profit = c.revenue - c.spend;
                  const roas = c.spend > 0 ? (c.revenue / c.spend) : 0;
                  const isEven = index % 2 === 0;
                  return (
                    <tr key={c.id || index} className={`border-b border-gray-100 hover:bg-gray-50 transition ${isEven ? 'bg-white' : 'bg-gray-50/50'}`}>
                      <td className="p-4 font-medium text-gray-800">{c.name || 'Untitled'}</td>
                      <td className="p-4 text-gray-600">{c.platform || 'N/A'}</td>
                      <td className="p-4 text-right font-medium text-gray-800">${(c.spend || 0).toLocaleString()}</td>
                      <td className="p-4 text-right font-medium text-green-600">${(c.revenue || 0).toLocaleString()}</td>
                      <td className={`p-4 text-right font-bold ${getProfitColor(profit)}`}>
                        ${profit.toLocaleString()}
                      </td>
                      <td className="p-4 text-right text-gray-600">{(c.impressions || 0).toLocaleString()}</td>
                      <td className="p-4 text-right text-gray-600">{(c.clicks || 0).toLocaleString()}</td>
                      <td className={`p-4 text-center font-bold ${getRoasColor(roas)}`}>
                        {roas.toFixed(2)}x
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          c.status === 'Active' 
                            ? 'bg-green-100 text-green-700' 
                            : c.status === 'Paused'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {c.status || 'Unknown'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => startEdit(c)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm mr-3"
                          disabled={!c.id}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="text-red-600 hover:text-red-800 font-medium text-sm"
                          disabled={!c.id}
                        >
                          🗑️ Delete
                        </button>
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