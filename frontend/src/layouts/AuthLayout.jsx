import React from 'react';
import { Outlet } from 'react-router-dom';
import ToastContainer from '../components/common/Toast';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl">
        <Outlet />
      </div>
      <ToastContainer />
    </div>
  );
};

export default AuthLayout;
