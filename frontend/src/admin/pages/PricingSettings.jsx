import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import pricingService from '../../services/pricingService';

const PricingSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pricing, setPricing] = useState({
    website_types: [],
    technologies: [],
    features: [],
    timeline_multipliers: [],
    currency: 'INR',
    currency_symbol: '₹'
  });

  useEffect(() => {
    fetchPricing();
  }, []);

  const fetchPricing = async () => {
    try {
      setLoading(true);
      const data = await pricingService.getPricing();
      setPricing(data);
    } catch (error) {
      console.error('Error fetching pricing:', error);
      toast.error('Failed to load pricing settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await pricingService.updatePricing(pricing);
      toast.success('Pricing settings saved successfully! 🎉');
    } catch (error) {
      console.error('Error saving pricing:', error);
      toast.error('Failed to save pricing settings');
    } finally {
      setSaving(false);
    }
  };

  const updateWebsiteType = (index, field, value) => {
    const updated = [...pricing.website_types];
    updated[index] = { ...updated[index], [field]: value };
    setPricing({ ...pricing, website_types: updated });
  };

  const updateTechnology = (index, field, value) => {
    const updated = [...pricing.technologies];
    updated[index] = { ...updated[index], [field]: value };
    setPricing({ ...pricing, technologies: updated });
  };

  const updateFeature = (index, field, value) => {
    const updated = [...pricing.features];
    updated[index] = { ...updated[index], [field]: value };
    setPricing({ ...pricing, features: updated });
  };

  const updateTimelineMultiplier = (index, field, value) => {
    const updated = [...pricing.timeline_multipliers];
    updated[index] = { ...updated[index], [field]: value };
    setPricing({ ...pricing, timeline_multipliers: updated });
  };

  const addWebsiteType = () => {
    setPricing({
      ...pricing,
      website_types: [...pricing.website_types, { name: '', price: 0 }]
    });
  };

  const removeWebsiteType = (index) => {
    const updated = pricing.website_types.filter((_, i) => i !== index);
    setPricing({ ...pricing, website_types: updated });
  };

  const addTechnology = () => {
    setPricing({
      ...pricing,
      technologies: [...pricing.technologies, { name: '', price: 0 }]
    });
  };

  const removeTechnology = (index) => {
    const updated = pricing.technologies.filter((_, i) => i !== index);
    setPricing({ ...pricing, technologies: updated });
  };

  const addFeature = () => {
    setPricing({
      ...pricing,
      features: [...pricing.features, { name: '', price: 0 }]
    });
  };

  const removeFeature = (index) => {
    const updated = pricing.features.filter((_, i) => i !== index);
    setPricing({ ...pricing, features: updated });
  };

  const addTimelineMultiplier = () => {
    setPricing({
      ...pricing,
      timeline_multipliers: [...pricing.timeline_multipliers, { range: '', multiplier: 1.0 }]
    });
  };

  const removeTimelineMultiplier = (index) => {
    const updated = pricing.timeline_multipliers.filter((_, i) => i !== index);
    setPricing({ ...pricing, timeline_multipliers: updated });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-brand-500 to-pink-500 rounded-xl">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Pricing Calculator Settings</h1>
            <p className="text-gray-400 mt-1">Configure pricing for your contact page calculator</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Website Types Section */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-500/20 rounded-lg">
                <svg className="w-5 h-5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white">Website Types (Base Price)</h2>
            </div>
            <button
              onClick={addWebsiteType}
              className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Type
            </button>
          </div>
          <div className="space-y-3">
            {pricing.website_types.map((type, index) => (
              <div key={index} className="flex gap-3 items-center bg-gray-900/50 p-4 rounded-xl border border-gray-700 hover:border-brand-500/50 transition-all">
                <input
                  type="text"
                  value={type.name}
                  onChange={(e) => updateWebsiteType(index, 'name', e.target.value)}
                  placeholder="Website Type Name"
                  className="flex-1 bg-gray-700 text-white px-4 py-2.5 rounded-lg border border-gray-600 focus:border-brand-500 focus:outline-none"
                />
                <div className="flex items-center gap-2 bg-gray-700 px-4 py-2.5 rounded-lg border border-gray-600">
                  <span className="text-brand-400 font-semibold">₹</span>
                  <input
                    type="number"
                    value={type.price}
                    onChange={(e) => updateWebsiteType(index, 'price', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="w-32 bg-transparent text-white focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => removeWebsiteType(index)}
                  className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Technologies Section */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white">Technologies / Languages</h2>
            </div>
            <button
              onClick={addTechnology}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Technology
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {pricing.technologies.map((tech, index) => (
              <div key={index} className="flex gap-3 items-center bg-gray-900/50 p-4 rounded-xl border border-gray-700 hover:border-green-500/50 transition-all">
                <input
                  type="text"
                  value={tech.name}
                  onChange={(e) => updateTechnology(index, 'name', e.target.value)}
                  placeholder="Technology Name"
                  className="flex-1 bg-gray-700 text-white px-4 py-2.5 rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none"
                />
                <div className="flex items-center gap-2 bg-gray-700 px-4 py-2.5 rounded-lg border border-gray-600">
                  <span className="text-green-400 font-semibold">₹</span>
                  <input
                    type="number"
                    value={tech.price}
                    onChange={(e) => updateTechnology(index, 'price', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="w-24 bg-transparent text-white focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => removeTechnology(index)}
                  className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-500/20 rounded-lg">
                <svg className="w-5 h-5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white">Features</h2>
            </div>
            <button
              onClick={addFeature}
              className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Feature
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {pricing.features.map((feature, index) => (
              <div key={index} className="flex gap-3 items-center bg-gray-900/50 p-4 rounded-xl border border-gray-700 hover:border-brand-500/50 transition-all">
                <input
                  type="text"
                  value={feature.name}
                  onChange={(e) => updateFeature(index, 'name', e.target.value)}
                  placeholder="Feature Name"
                  className="flex-1 bg-gray-700 text-white px-4 py-2.5 rounded-lg border border-gray-600 focus:border-brand-500 focus:outline-none"
                />
                <div className="flex items-center gap-2 bg-gray-700 px-4 py-2.5 rounded-lg border border-gray-600">
                  <span className="text-brand-400 font-semibold">₹</span>
                  <input
                    type="number"
                    value={feature.price}
                    onChange={(e) => updateFeature(index, 'price', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="w-24 bg-transparent text-white focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => removeFeature(index)}
                  className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Multipliers Section */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white">Timeline Multipliers</h2>
            </div>
            <button
              onClick={addTimelineMultiplier}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Range
            </button>
          </div>
          <div className="space-y-3">
            {pricing.timeline_multipliers.map((multiplier, index) => (
              <div key={index} className="flex gap-3 items-center bg-gray-900/50 p-4 rounded-xl border border-gray-700 hover:border-orange-500/50 transition-all">
                <input
                  type="text"
                  value={multiplier.range}
                  onChange={(e) => updateTimelineMultiplier(index, 'range', e.target.value)}
                  placeholder="e.g., 7-15 days"
                  className="flex-1 bg-gray-700 text-white px-4 py-2.5 rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none"
                />
                <div className="flex items-center gap-2 bg-gray-700 px-4 py-2.5 rounded-lg border border-gray-600">
                  <span className="text-orange-400 font-semibold">×</span>
                  <input
                    type="number"
                    step="0.1"
                    value={multiplier.multiplier}
                    onChange={(e) => updateTimelineMultiplier(index, 'multiplier', parseFloat(e.target.value) || 1.0)}
                    placeholder="1.0"
                    className="w-24 bg-transparent text-white focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => removeTimelineMultiplier(index)}
                  className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Currency Section */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white">Currency Settings</h2>
          </div>
          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-4">
            <p className="text-yellow-400 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Currency is fixed to Indian Rupees (₹ INR) for all pricing calculations.
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-4 sticky bottom-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-4 bg-gradient-to-r from-brand-500 to-pink-500 hover:from-brand-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Pricing Settings
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingSettings;
