'use client';

interface TabSelectorProps {
  activeTab: 'profiles' | 'clients';
  onTabChange: (tab: 'profiles' | 'clients') => void;
  profilesCount: number;
  clientsCount: number;
}

export default function TabSelector({ 
  activeTab, 
  onTabChange, 
  profilesCount, 
  clientsCount 
}: TabSelectorProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg mb-4">
      <div className="flex gap-2 p-3">
        <button
          onClick={() => onTabChange('profiles')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all active:scale-95 ${
            activeTab === 'profiles'
              ? 'bg-emerald-500 text-white' 
              : 'bg-gray-100 text-gray-700 active:bg-gray-200'
          }`}
        >
          Profiles ({profilesCount})
        </button>
        <button
          onClick={() => onTabChange('clients')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all active:scale-95 ${
            activeTab === 'clients'
              ? 'bg-purple-500 text-white' 
              : 'bg-gray-100 text-gray-700 active:bg-gray-200'
          }`}
        >
          Client Access ({clientsCount})
        </button>
      </div>
    </div>
  );
}
