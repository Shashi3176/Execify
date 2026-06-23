'use client';

import { useState, useEffect } from 'react';

interface ControlPanelProps {
  currentMax: number;
  currentMode: 'fifo' | 'priority';
  onConcurrencyApplied: () => void;
  onModeChanged: () => void;
}

export default function ControlPanel({
  currentMax,
  currentMode,
  onConcurrencyApplied,
  onModeChanged,
}: ControlPanelProps) {
  const [sliderValue, setSliderValue] = useState(currentMax);
  const [isApplyingConcurrency, setIsApplyingConcurrency] = useState(false);
  const [isChangingMode, setIsChangingMode] = useState(false);
  const [concurrencySuccess, setConcurrencySuccess] = useState(false);
  const [modeSuccess, setModeSuccess] = useState(false);
  const [concurrencyError, setConcurrencyError] = useState<string | null>(null);
  const [modeError, setModeError] = useState<string | null>(null);

  useEffect(() => {
    setSliderValue(currentMax);
  }, [currentMax]);

  const handleApplyConcurrency = async () => {
    if (sliderValue === currentMax) return;

    setIsApplyingConcurrency(true);
    setConcurrencyError(null);
    setConcurrencySuccess(false);

    try {
      const response = await fetch('/api/pool/concurrency', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maxConcurrent: sliderValue }),
      });

      if (!response.ok) {
        throw new Error('Failed to update concurrency');
      }

      setConcurrencySuccess(true);
      setTimeout(() => setConcurrencySuccess(false), 3000);
      onConcurrencyApplied();
    } catch (err) {
      setConcurrencyError(err instanceof Error ? err.message : 'Failed to update concurrency');
    } finally {
      setIsApplyingConcurrency(false);
    }
  };

  const handleModeChange = async (mode: 'fifo' | 'priority') => {
    if (mode === currentMode) return;

    setIsChangingMode(true);
    setModeError(null);
    setModeSuccess(false);

    try {
      const response = await fetch('/api/pool/mode', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode }),
      });

      if (!response.ok) {
        throw new Error('Failed to update mode');
      }

      setModeSuccess(true);
      setTimeout(() => setModeSuccess(false), 3000);
      onModeChanged();
    } catch (err) {
      setModeError(err instanceof Error ? err.message : 'Failed to update mode');
    } finally {
      setIsChangingMode(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Concurrency Control */}
      <div className="bg-gray-900 border border-gray-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-2">Concurrency Control</h3>
        <p className="text-gray-400 mb-4">Set maximum parallel workers</p>

        <div className="text-center mb-4">
          <span className="text-5xl font-bold text-white">{sliderValue}</span>
        </div>

        <input
          type="range"
          min="1"
          max="10"
          step="1"
          value={sliderValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSliderValue(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />

        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <span>1</span>
          <span>10</span>
        </div>

        {sliderValue !== currentMax && (
          <div className="mt-3 text-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-400">
              Changing from {currentMax} → {sliderValue}
            </span>
          </div>
        )}

        <button
          onClick={handleApplyConcurrency}
          disabled={sliderValue === currentMax || isApplyingConcurrency}
          className="mt-4 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
        >
          {isApplyingConcurrency ? 'Applying...' : 'Apply Changes'}
        </button>

        {concurrencySuccess && (
          <p className="mt-2 text-sm text-green-400 text-center">Concurrency updated successfully</p>
        )}

        {concurrencyError && (
          <p className="mt-2 text-sm text-red-400 text-center">{concurrencyError}</p>
        )}

        <p className="mt-4 text-xs text-gray-500 text-center">
          Reducing concurrency won't kill running jobs, it just prevents new ones from starting until running count drops below the new limit
        </p>
      </div>

      {/* Queue Mode */}
      <div className="bg-gray-900 border border-gray-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-2">Queue Mode</h3>
        <p className="text-gray-400 mb-4">Job execution ordering strategy</p>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleModeChange('fifo')}
            disabled={isChangingMode}
            className={`p-4 rounded-lg border transition-all ${
              currentMode === 'fifo'
                ? 'border-blue-500 bg-blue-500/20'
                : 'border-gray-700 bg-gray-800 hover:bg-gray-700'
            }`}
          >
            <div className="font-medium text-white mb-1">FIFO</div>
            <div className="text-xs text-gray-400">Jobs execute in submission order</div>
          </button>

          <button
            onClick={() => handleModeChange('priority')}
            disabled={isChangingMode}
            className={`p-4 rounded-lg border transition-all ${
              currentMode === 'priority'
                ? 'border-blue-500 bg-blue-500/20'
                : 'border-gray-700 bg-gray-800 hover:bg-gray-700'
            }`}
          >
            <div className="font-medium text-white mb-1">Priority</div>
            <div className="text-xs text-gray-400">Higher priority jobs execute first</div>
          </button>
        </div>

        {isChangingMode && (
          <div className="mt-4 flex justify-center">
            <svg className="animate-spin h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
          </div>
        )}

        {modeSuccess && !isChangingMode && (
          <p className="mt-3 text-sm text-green-400 text-center">Mode updated successfully</p>
        )}

        {modeError && (
          <p className="mt-3 text-sm text-red-400 text-center">{modeError}</p>
        )}
      </div>
    </div>
  );
}