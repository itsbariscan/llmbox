import React from 'react';
import useConversationStore from '../../store/conversationStore';
import { MODELS, TEMPERATURE_PRESETS } from '../../config/constants';
import { Zap, Brain, Clock, DollarSign, X } from 'lucide-react';

const Settings = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useConversationStore();

  if (!isOpen) return null;

  const handleTemperaturePreset = (preset) => {
    updateSettings({ temperature: TEMPERATURE_PRESETS[preset].value });
  };

  const renderModelDetails = (model) => (
    <div className="space-y-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
      <div className="flex items-center gap-2">
        <Brain size={14} className="text-primary-500" />
        <span>{model.description}</span>
      </div>
      <div className="flex items-center gap-2">
        <Clock size={14} className="text-primary-500" />
        <span>Latency: {model.latency}</span>
      </div>
      <div className="flex items-center gap-2">
        <Zap size={14} className="text-primary-500" />
        <span>Max tokens: {model.maxTokens.toLocaleString()}</span>
      </div>
      <div className="flex items-center gap-2">
        <DollarSign size={14} className="text-primary-500" />
        <span>Cost: {model.cost}</span>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl 
                     shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Settings
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 
                     transition-colors text-gray-500 hover:text-gray-700 
                     dark:text-gray-400 dark:hover:text-gray-300"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-8">
            {/* Model Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 
                             dark:text-gray-300 mb-2">
                Model
              </label>
              <select
                value={settings.model}
                onChange={(e) => updateSettings({ model: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 
                        dark:border-gray-600 bg-white dark:bg-gray-700 
                        text-gray-900 dark:text-white mb-2 focus:ring-2 
                        focus:ring-primary-500 focus:border-transparent"
              >
                {Object.values(MODELS).map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
              {renderModelDetails(Object.values(MODELS).find(m => m.id === settings.model))}
            </div>

            {/* Temperature Control */}
            <div>
              <label className="block text-sm font-medium text-gray-700 
                             dark:text-gray-300 mb-2">
                Response Style
              </label>
              <div className="space-y-4">
                <div className="flex justify-between gap-2">
                  {Object.entries(TEMPERATURE_PRESETS).map(([name, preset]) => (
                    <button
                      key={name}
                      onClick={() => handleTemperaturePreset(name)}
                      className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium 
                              transition-colors ${
                                settings.temperature === preset.value
                                  ? 'bg-primary-600 text-white'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                              }`}
                    >
                      {name.toLowerCase()}
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.temperature}
                    onChange={(e) => updateSettings({ 
                      temperature: parseFloat(e.target.value) 
                    })}
                    className="w-full accent-primary-600"
                  />
                  <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Temperature: {settings.temperature}
                  </div>
                </div>
              </div>
            </div>

            {/* API Key Section */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Using API key from environment variables. Contact administrator 
                to change.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;