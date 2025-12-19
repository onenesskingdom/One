import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';
import OnboardingModal from './OnboardingModal';

export default function Dashboard() {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (profile && !profile.onboarding_completed) {
      setShowOnboarding(true);
    }
  }, [profile]);

  const handleOnboardingComplete = async () => {
    setShowOnboarding(false);
    await refreshProfile();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      <nav className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
                ダッシュボード
              </h1>
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              ログアウト
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            おかえりなさい、{profile?.name}さん！
          </h2>
          <p className="text-gray-600 mb-6">
            {profile?.onboarding_completed
              ? 'プロフィールの設定が完了しました。ダッシュボードで詳細を確認しましょう。'
              : 'まずはオンボーディングを完了させてください。'}
          </p>

          {profile?.onboarding_completed && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-lg p-6 border border-blue-100">
                <h3 className="font-semibold text-gray-800 mb-2">プロフィールの状態</h3>
                <p className="text-sm text-gray-600">プロフィールは100%完了しています</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-100">
                <h3 className="font-semibold text-gray-800 mb-2">メールアドレス</h3>
                <p className="text-sm text-gray-600">{profile?.email}</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-6 border border-orange-100">
                <h3 className="font-semibold text-gray-800 mb-2">登録日</h3>
                <p className="text-sm text-gray-600">
                  {new Date(profile?.created_at || '').toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {showOnboarding && (
        <OnboardingModal
          userId={user?.id || ''}
          onComplete={handleOnboardingComplete}
          onClose={() => setShowOnboarding(false)}
        />
      )}
    </div>
  );
}
