import React from 'react';
import AdminLayout from './AdminLayout';
import JobManagement from './jobs';

const JobPage = () => {
  return (
    <AdminLayout title="Job Management">
      <JobManagement />
    </AdminLayout>
  );
};

export default JobPage;