import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/apiService';

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    //Attention to detail / Confirmation step
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate('/login');
    }
  };

  return (
    <nav className="flex items-center justify-between bg-slate-800 px-8 py-4 text-white shadow-md">
      {/*Logged in user's name */}
      <div className="text-lg font-medium flex items-center gap-2">
        <span className="text-slate-400">Welcome,</span> 
        <span className="font-bold text-blue-400">
          {user?.name || 'User'}
        </span>
      </div>
      
      {/*Logout button  */}
      <div className="flex items-center">
        <button 
          onClick={handleLogout}
          className="rounded-md bg-red-600 px-5 py-2 text-sm font-semibold transition-all hover:bg-red-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-800"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;