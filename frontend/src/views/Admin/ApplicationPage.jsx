import React from 'react';
import AdminLayout from './AdminLayout';
import ApplicationManagement from './applications';

const ApplicationPage = () => {
  return (
    <AdminLayout title="Application Management">
      <ApplicationManagement />
    </AdminLayout>
  );
};

export default ApplicationPage;