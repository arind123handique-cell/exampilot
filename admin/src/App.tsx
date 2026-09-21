import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { AdminPortalPage } from '@/pages/AdminPortalPage';
import { getStudentDomainUrl } from '@/config/domainConfig';
import { MockTest } from '@/types';

export const AdminApp: React.FC = () => {
  const handleSwitchToStudent = () => {
    window.location.href = getStudentDomainUrl();
  };

  const handleLaunchMockTest = (mock: MockTest) => {
    const studentUrl = getStudentDomainUrl();
    window.open(`${studentUrl}/test?preset=${encodeURIComponent(mock.id)}`, '_blank');
  };

  return (
    <AuthProvider>
      <AnimatedBackground />
      <AdminPortalPage
        onSwitchToStudentPortal={handleSwitchToStudent}
        onLaunchMockTest={handleLaunchMockTest}
      />
    </AuthProvider>
  );
};

export default AdminApp;
