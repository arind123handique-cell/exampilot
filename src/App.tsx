import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ActiveTab } from './components/layout/navConfig';
import { AnimatedBackground } from './components/AnimatedBackground';
import { StudentPortal } from './pages/StudentPortal';
import { AdminPortalPage } from './pages/AdminPortalPage';
import { MockTest } from './types';
import { useAppRouter } from './hooks/useRouter';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('creator');
  const [presetMock, setPresetMock] = useState<MockTest | null>(null);

  // Sync URL routes with activeTab (/admin, /pyq, /, /test, /records)
  useAppRouter(activeTab, setActiveTab);

  // ───── 1. Dedicated Admin Website / Portal (Separate link: /admin) ─────
  if (activeTab === 'admin') {
    return (
      <AdminPortalPage
        onSwitchToStudentPortal={() => setActiveTab('creator')}
        onLaunchMockTest={(mock) => {
          setPresetMock(mock);
          setActiveTab('creator');
        }}
      />
    );
  }

  // ───── 2. Dedicated Student Website / Portal (Mock Tests & Review Only) ─────
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
