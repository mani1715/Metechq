import React, { useState, useEffect } from 'react';
import pricingService from '../services/pricingService';
import { trackCalculatorOpened, trackCalculatorEstimate } from '../services/analytics';

const PricingCalculator = ({ onEstimateChange }) => {
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedWebsiteType, setSelectedWebsiteType] = useState(null);
  const [selectedTechnologies, setSelectedTechnologies] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [selectedTimeline, setSelectedTimeline] = useState(null);
  const [estimatedPrice, setEstimatedPrice] = useState({ min: 0, max: 0 });
  const [hasTrackedOpen, setHasTrackedOpen] = useState(false);

  useEffect(() => {
    fetchPricing();
    // Track calculator opened (only once)
    if (!hasTrackedOpen) {
      trackCalculatorOpened();
      setHasTrackedOpen(true);
    }
  }, []);

  useEffect(() => {
    calculatePrice();
  }, [selectedWebsiteType, selectedTechnologies, selectedFeatures, selectedTimeline, pricing]);

  const fetchPricing = async () => {
    try {
      const data = await pricingService.getPricing();
      setPricing(data);
    } catch (error) {
      console.error('Error fetching pricing:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = () => {
    if (!pricing) return;

    let basePrice = 0;

    // Add website type base price
    if (selectedWebsiteType) {
      const websiteType = pricing.website_types.find(
        (type) => type.name === selectedWebsiteType
      );
      if (websiteType) basePrice += websiteType.price;
    }

    // Add technologies prices
    selectedTechnologies.forEach((techName) => {
      const tech = pricing.technologies.find((t) => t.name === techName);
      if (tech) basePrice += tech.price;
    });

    // Add features prices
    selectedFeatures.forEach((featureName) => {
      const feature = pricing.features.find((f) => f.name === featureName);
      if (feature) basePrice += feature.price;
    });

    // Apply timeline multiplier
    let multiplier = 1.0;
    if (selectedTimeline) {
      const timeline = pricing.timeline_multipliers.find(
        (t) => t.range === selectedTimeline
      );
      if (timeline) multiplier = timeline.multiplier;
    }

    const finalPrice = basePrice * multiplier;
    const minPrice = finalPrice * 0.9; // 10% range
    const maxPrice = finalPrice * 1.1;

    setEstimatedPrice({ min: Math.round(minPrice), max: Math.round(maxPrice) });

    // Track estimate generation (only if all selections made)
    if (selectedWebsiteType && selectedTechnologies.length > 0 && selectedFeatures.length > 0 && selectedTimeline) {
      trackCalculatorEstimate();
    }

    // Pass estimate to parent component
    if (onEstimateChange) {
      onEstimateChange({
        websiteType: selectedWebsiteType,
        technologies: selectedTechnologies,
        features: selectedFeatures,
        timeline: selectedTimeline,
        estimatedCost: `₹${Math.round(minPrice).toLocaleString('en-IN')} - ₹${Math.round(maxPrice).toLocaleString('en-IN')}`
      });
    }
  };

  const toggleTechnology = (techName) => {
    setSelectedTechnologies((prev) =>
      prev.includes(techName)
        ? prev.filter((t) => t !== techName)
        : [...prev, techName]
    );
  };

  const toggleFeature = (featureName) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureName)
        ? prev.filter((f) => f !== featureName)
        : [...prev, featureName]
    );
  };

  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  if (loading) {
    return (
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-3xl p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
        </div>
      </div>
    );
  }

  if (!pricing) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-3xl p-8 shadow-2xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-brand-500 to-pink-500 rounded-2xl mb-4">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-brand-400 to-pink-400 bg-clip-text text-transparent">
          Estimate Your Project Cost
        </h2>
        <p className="text-gray-400">Configure your project requirements to get an instant estimate</p>
      </div>

      {/* Website Type Selection */}
      <div className="mb-8">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-4">
          <svg className="w-5 h-5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
          Website Type
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {pricing.website_types.map((type) => (
            <button
              key={type.name}
              onClick={() => setSelectedWebsiteType(type.name)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                selectedWebsiteType === type.name
                  ? 'bg-brand-500/20 border-brand-500 shadow-lg shadow-brand-500/20'
                  : 'bg-gray-800/50 border-gray-700 hover:border-brand-500/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">{type.name}</span>
                <span className="text-brand-400 font-semibold">{formatPrice(type.price)}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Technologies Selection */}
      <div className="mb-8">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-4">
          <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          Technologies (Multiple selection)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {pricing.technologies.map((tech) => (
            <button
              key={tech.name}
              onClick={() => toggleTechnology(tech.name)}
              className={`p-3 rounded-xl border-2 transition-all ${
                selectedTechnologies.includes(tech.name)
                  ? 'bg-green-500/20 border-green-500 shadow-lg shadow-green-500/20'
                  : 'bg-gray-800/50 border-gray-700 hover:border-green-500/50'
              }`}
            >
              <div className="text-center">
                <div className="text-white font-medium text-sm mb-1">{tech.name}</div>
                <div className="text-green-400 font-semibold text-xs">{formatPrice(tech.price)}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Features Selection */}
      <div className="mb-8">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-4">
          <svg className="w-5 h-5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          Features (Multiple selection)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {pricing.features.map((feature) => (
            <button
              key={feature.name}
              onClick={() => toggleFeature(feature.name)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                selectedFeatures.includes(feature.name)
                  ? 'bg-brand-500/20 border-brand-500 shadow-lg shadow-brand-500/20'
                  : 'bg-gray-800/50 border-gray-700 hover:border-brand-500/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">{feature.name}</span>
                <span className="text-brand-400 font-semibold">{formatPrice(feature.price)}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Selection */}
      <div className="mb-8">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-4">
          <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Project Timeline
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {pricing.timeline_multipliers.map((timeline) => (
            <button
              key={timeline.range}
              onClick={() => setSelectedTimeline(timeline.range)}
              className={`p-4 rounded-xl border-2 transition-all text-center ${
                selectedTimeline === timeline.range
                  ? 'bg-orange-500/20 border-orange-500 shadow-lg shadow-orange-500/20'
                  : 'bg-gray-800/50 border-gray-700 hover:border-orange-500/50'
              }`}
            >
              <div className="text-white font-medium mb-1">{timeline.range}</div>
              <div className="text-orange-400 font-semibold text-sm">×{timeline.multiplier}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Estimated Price Display */}
      <div className="bg-gradient-to-r from-brand-500/20 via-pink-500/20 to-orange-500/20 border-2 border-brand-500/50 rounded-2xl p-6 text-center">
        <div className="text-gray-400 text-sm mb-2">Estimated Project Cost</div>
        <div className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-brand-400 via-pink-400 to-orange-400 bg-clip-text mb-3">
          {estimatedPrice.min > 0 ? (
            <>
              {formatPrice(estimatedPrice.min)} - {formatPrice(estimatedPrice.max)}
            </>
          ) : (
            'Select options above'
          )}
        </div>
        <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          This is an estimated cost. Final price depends on requirements.
        </p>
      </div>
    </div>
  );
};

export default PricingCalculator;
