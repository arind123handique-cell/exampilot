import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ActiveTab } from './components/layout/navConfig';
import { AnimatedBackground } from './components/AnimatedBackground';
import { StudentPortal } from './pages/StudentPortal';
import { MockTest } from './types';
import { useAppRouter } from './hooks/useRouter';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('creator');
  const [presetMock, setPresetMock] = useState<MockTest | null>(null);

  // Sync URL routes with activeTab (/pyq, /, /test, /records, /results)
  useAppRouter(activeTab, setActiveTab);

  return (
    <StudentPortal presetMock={presetMock} />
  );
};

export const App: React.FC = () => (
  <AuthProvider>
    <AnimatedBackground />
    <AppContent />
  </AuthProvider>
);

export default App;
