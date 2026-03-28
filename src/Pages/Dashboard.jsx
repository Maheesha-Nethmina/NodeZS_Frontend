import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/authService'; // Ensure this matches your file name
import Navbar from '../Components/Navbar'; 

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    
    // Debugging: Logging the User Data (including ID) to the console as requested
    console.log("Logged in User Data:", currentUser);
    if (currentUser) {
        console.log("Logged User ID:", currentUser.id);
    }

    if (!currentUser) {
      // Security check: Redirect to login if session is empty
      navigate('/login');
    } else {
      setUser(currentUser);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      
      <main className="container mx-auto mt-8 px-4">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-slate-900">Task Management Dashboard</h1>
          {/* User ID badge removed from here */}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Welcome Card */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Welcome back, {user?.name}!
            </h2>
            <p className="text-gray-500">
              You are logged in with <strong>{user?.email}</strong>. 
              Use this dashboard to track your progress and manage your daily tasks effectively.
            </p>
            
            <div className="mt-8 flex gap-4">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                + Create New Task
              </button>
              <button className="border border-gray-200 hover:bg-gray-50 text-gray-600 px-6 py-2 rounded-lg font-medium transition-colors">
                View Reports
              </button>
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
             <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Quick Summary</h3>
             <div className="mt-4 space-y-4">
                <div className="flex justify-between">
                    <span className="text-gray-600">Pending Tasks</span>
                    <span className="font-bold text-indigo-600">0</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Completed</span>
                    <span className="font-bold text-green-600">0</span>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;