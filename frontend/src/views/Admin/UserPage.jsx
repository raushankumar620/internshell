import React from 'react';
import AdminLayout from './AdminLayout';
import UserManagement from './user';

const UserPage = () => {
  return (
    <AdminLayout title="User Management">
      <UserManagement />
    </AdminLayout>
  );
};

export default UserPage;