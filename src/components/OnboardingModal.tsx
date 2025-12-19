import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

interface OnboardingModalProps {
  userId: string;
  onComplete: () => void;
  onClose: () => void;
}

const JAPAN_LOCATIONS = [
  'Tokyo',
  'Osaka',
  'Kyoto',
  'Yokohama',
  'Nagoya',
  'Sapporo',
  'Fukuoka',
  'Kobe',
  'Hiroshima',
  'Sendai',
  'Nara',
  'Okinawa',
];

const GOOD_TRAITS = [
  'Friendly',
  'Creative',
  'Reliable',
  'Adventurous',
  'Thoughtful',
  'Funny',
  'Caring',
  'Energetic',
];

const BAD_TRAITS = ['Stubborn', 'Impatient', 'Messy', 'Shy'];

export default function OnboardingModal({ userId, onComplete, onClose }: OnboardingModalProps) {
  const [currentCard, setCurrentCard] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    relationship_status: '',
    location: '',
    good_traits: [] as string[],
    bad_traits: [] as string[],
    social_weekend: '',
    social_recharge: '',
    vacation_type: '',
    vacation_activity: '',
    planning_style: '',
    planning_preference: '',
    hobby_interest: '',
    hobby_activity: '',
    outlook: '',
  });

  const toggleTrait = (trait: string, isGood: boolean) => {
    if (isGood) {
      setFormData((prev) => ({
        ...prev,
        good_traits: prev.good_traits.includes(trait)
          ? prev.good_traits.filter((t) => t !== trait)
          : [...prev.good_traits, trait],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        bad_traits: prev.bad_traits.includes(trait)
          ? prev.bad_traits.filter((t) => t !== trait)
          : [...prev.bad_traits, trait],
      }));
    }
  };

  const handleNext = () => {
    if (currentCard < 5) {
      setCurrentCard(currentCard + 1);
    }
  };

  const handleBack = () => {
    if (currentCard > 1) {
      setCurrentCard(currentCard - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    const { error: onboardingError } = await supabase
      .from('onboarding_responses')
      .insert({
        user_id: userId,
        ...formData,
        avatar_placeholder: 'kawaii-character',
      });

    if (onboardingError) {
      console.error('Error saving onboarding:', onboardingError);
      setLoading(false);
      return;
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .update({ onboarding_completed: true })
      .eq('id', userId);

    if (profileError) {
      console.error('Error updating profile:', profileError);
    }

    setLoading(false);
    onComplete();
  };

  const isCard1Valid = formData.relationship_status && formData.location && formData.good_traits.length > 0 && formData.bad_traits.length > 0;
  const isCard2Valid = formData.social_weekend && formData.social_recharge;
  const isCard3Valid = formData.vacation_type && formData.vacation_activity;
  const isCard4Valid = formData.planning_style && formData.planning_preference;
  const isCard5Valid = formData.hobby_interest && formData.hobby_activity && formData.outlook;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Complete Your Profile</h2>
            </div>
            <div className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full">
              {currentCard} of 5
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <div
                key={num}
                className={`h-2 flex-1 rounded-full transition-all ${
                  num <= currentCard ? 'bg-white' : 'bg-white bg-opacity-30'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="p-8">
          {currentCard === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Relationship Status
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['Single', 'In a Relationship', 'Married', 'Other'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setFormData({ ...formData, relationship_status: status })}
                      className={`px-4 py-3 rounded-lg border-2 transition-all ${
                        formData.relationship_status === status
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Where do you live?
                </label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Select a location</option>
                  {JAPAN_LOCATIONS.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select your good traits (what friends say about you)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {GOOD_TRAITS.map((trait) => (
                    <button
                      key={trait}
                      type="button"
                      onClick={() => toggleTrait(trait, true)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        formData.good_traits.includes(trait)
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {trait}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select your bad traits (what friends might say)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {BAD_TRAITS.map((trait) => (
                    <button
                      key={trait}
                      type="button"
                      onClick={() => toggleTrait(trait, false)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        formData.bad_traits.includes(trait)
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {trait}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentCard === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-4">
                  Social Preferences
                </label>
                <p className="text-gray-600 mb-4">
                  Would you rather spend your weekend at a lively party or reading a quiet book?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {['Lively Party', 'Quiet Book'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFormData({ ...formData, social_weekend: option })}
                      className={`px-4 py-4 rounded-lg border-2 transition-all ${
                        formData.social_weekend === option
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-gray-600 mb-4">
                  Do you recharge by being with many friends or by being alone?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {['Many Friends', 'Being Alone'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFormData({ ...formData, social_recharge: option })}
                      className={`px-4 py-4 rounded-lg border-2 transition-all ${
                        formData.social_recharge === option
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentCard === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-4">
                  Vacation Style
                </label>
                <p className="text-gray-600 mb-4">
                  Do you prefer a vacation at an adventurous mountain cabin or a relaxing beach resort?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {['Mountain Cabin', 'Beach Resort'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFormData({ ...formData, vacation_type: option })}
                      className={`px-4 py-4 rounded-lg border-2 transition-all ${
                        formData.vacation_type === option
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-gray-600 mb-4">
                  Would you choose a thrilling rollercoaster or a calm boat ride?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {['Thrilling Rollercoaster', 'Calm Boat Ride'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFormData({ ...formData, vacation_activity: option })}
                      className={`px-4 py-4 rounded-lg border-2 transition-all ${
                        formData.vacation_activity === option
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentCard === 4 && (
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-4">
                  Planning & Lifestyle
                </label>
                <p className="text-gray-600 mb-4">
                  When planning a trip, do you like a detailed itinerary or prefer to be spontaneous?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {['Detailed Itinerary', 'Spontaneous'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFormData({ ...formData, planning_style: option })}
                      className={`px-4 py-4 rounded-lg border-2 transition-all ${
                        formData.planning_style === option
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-gray-600 mb-4">
                  Do you like sudden surprises or prefer to just stay home?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {['Sudden Surprises', 'Stay Home'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFormData({ ...formData, planning_preference: option })}
                      className={`px-4 py-4 rounded-lg border-2 transition-all ${
                        formData.planning_preference === option
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentCard === 5 && (
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-4">
                  Interests & Outlook
                </label>
                <p className="text-gray-600 mb-4">
                  Are you more drawn to art and music, or to math and science?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {['Art & Music', 'Math & Science'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFormData({ ...formData, hobby_interest: option })}
                      className={`px-4 py-4 rounded-lg border-2 transition-all ${
                        formData.hobby_interest === option
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-gray-600 mb-4">
                  Would you prefer building a project or solving a logic puzzle?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {['Building a Project', 'Solving a Puzzle'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFormData({ ...formData, hobby_activity: option })}
                      className={`px-4 py-4 rounded-lg border-2 transition-all ${
                        formData.hobby_activity === option
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-gray-600 mb-4">Is your glass half-full or half-empty?</p>
                <div className="grid grid-cols-2 gap-3">
                  {['Half-Full', 'Half-Empty'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFormData({ ...formData, outlook: option })}
                      className={`px-4 py-4 rounded-lg border-2 transition-all ${
                        formData.outlook === option
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-br from-pink-50 to-blue-50 rounded-xl border-2 border-dashed border-pink-300">
                <div className="text-center">
                  <Sparkles className="w-12 h-12 mx-auto mb-3 text-pink-500" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Your Kawaii Character
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Character generator will appear here
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 p-6 flex justify-between items-center bg-gray-50">
          <button
            onClick={handleBack}
            disabled={currentCard === 1}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-0 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>

          {currentCard < 5 ? (
            <button
              onClick={handleNext}
              disabled={
                (currentCard === 1 && !isCard1Valid) ||
                (currentCard === 2 && !isCard2Valid) ||
                (currentCard === 3 && !isCard3Valid) ||
                (currentCard === 4 && !isCard4Valid)
              }
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg hover:from-sky-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!isCard5Valid || loading}
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Saving...' : 'Complete'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
