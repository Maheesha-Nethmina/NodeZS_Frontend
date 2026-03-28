import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, getAllTasksPaged, updateTaskStatus } from '../services/apiService';
import Navbar from '../Components/Navbar';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  // State for Tasks and Pagination
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);

  // Corrected State for Filtering and Sorting
  const [filterStatus, setFilterStatus] = useState(''); // Default: All
  const [sortBy, setSortBy] = useState('dueDate');      // Default: Due Date

  useEffect(() => {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
    }
  }, [navigate]);

  /**
   * Fetch tasks with specific sorting: 
   * Due Date = Ascending (Soonest first)
   * Priority = High -> Medium -> Low
   */
  const fetchTasks = async (pageNumber) => {
    setLoading(true);
    try {
      // We pass the sortBy to the API. 
      // The backend Controller logic we wrote handles the internal ASC/DESC direction.
      const response = await getAllTasksPaged(pageNumber, 10, filterStatus, sortBy);
      if (response.code === "00") {
        setTasks(response.content.tasks);
        setTotalPages(response.content.totalPages);
        setTotalElements(response.content.totalElements);
        setCurrentPage(response.content.currentPage);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch when any filter or sort option changes
  useEffect(() => {
    if (user) {
      fetchTasks(0);
    }
  }, [filterStatus, sortBy]);

  const handleAssignChange = async (taskid, isChecked, taskTitle) => {
    if (isChecked) {
      const confirmAssign = window.confirm(`Are you sure you want to assign the task: "${taskTitle}" to yourself?`);
      
      if (confirmAssign) {
        try {
          const res = await updateTaskStatus(taskid, "IN_PROGRESS", user?.email);
          if (res.code === "00") {
            fetchTasks(currentPage);
          }
        } catch (err) {
          console.error("Failed to assign task:", err);
          alert("Could not update task status.");
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <Navbar user={user} />
      
      <main className="container mx-auto mt-8 px-4">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-slate-900">Task Management Dashboard</h1>
        </header>

        {/* Info & Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Welcome back, {user?.name}!</h2>
            <p className="text-gray-500">You are logged in with <strong>{user?.email}</strong>.</p>
            <div className="mt-8 flex gap-4">
              {/* move to add task page */}
              <button onClick={() => navigate('/add-task')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">+ Create New Task</button>
              
              {/* move to my task page */}
              <button onClick={() => navigate('/my-tasks')}
                className="border border-gray-200 hover:bg-gray-50 text-gray-600 px-6 py-2 rounded-lg font-medium transition-colors"
              >
                My Tasks
              </button>

              {/* NEW: move to selection page */}
              <button onClick={() => navigate('/selection')}
                className="border border-gray-200 hover:bg-gray-50 text-gray-600 px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Selection
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
             <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Quick Summary</h3>
             <div className="mt-4 space-y-4 font-semibold">
                <div className="flex justify-between"><span className="text-gray-600">Total Tasks</span><span className="text-indigo-600">{totalElements}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Completed</span><span className="text-green-600">{tasks.filter(t => t.status === 'DONE').length}</span></div>
             </div>
          </div>
        </div>

        {/* --- REFINED FILTER & SORT BAR --- */}
        <div className="bg-white p-5 mb-6 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-8 items-center">
            <div className="flex gap-3 items-center">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Status Filter</label>
                <select 
                    className="border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="">All Statuses</option>
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                </select>
            </div>

            <div className="flex gap-3 items-center">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Sort By</label>
                <select 
                    className="border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="dueDate">Due Date (Soonest first)</option>
                    <option value="priority">Priority (High to Low)</option>
                    <option value="createdAt">Newest Created</option>
                </select>
            </div>
        </div>

        {/* --- TASK LIST TABLE --- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                <h3 className="text-xl font-bold text-slate-800">Your Task List</h3>
                <span className="text-xs font-bold px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full">
                    Page {currentPage + 1}
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                        <tr>
                            <th className="px-6 py-4 border-b text-center w-20">Assign</th>
                            <th className="px-6 py-4 border-b">Task Details</th>
                            <th className="px-6 py-4 border-b">Priority</th>
                            <th className="px-6 py-4 border-b">Status</th>
                            <th className="px-6 py-4 border-b text-center">Due Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {loading ? (
                            <tr><td colSpan="5" className="px-6 py-20 text-center text-gray-400 animate-pulse font-medium">Updating list...</td></tr>
                        ) : tasks.length > 0 ? (
                            tasks.map((task) => (
                                <tr key={task.taskid} className="hover:bg-indigo-50/30 transition-colors">
                                    <td className="px-6 py-4 text-center">
                                        <input 
                                            type="checkbox" 
                                            className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer transition-transform active:scale-90"
                                            checked={task.status !== 'TODO'}
                                            disabled={task.status !== 'TODO'} 
                                            onChange={(e) => handleAssignChange(task.taskid, e.target.checked, task.title)}
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-900">{task.title}</div>
                                        {task.description && <div className="text-xs text-gray-400 mt-1 line-clamp-1 max-w-xs">{task.description}</div>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wider ${
                                            task.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                                            task.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                                        }`}>{task.priority}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                                            task.status === 'DONE' ? 'bg-blue-100 text-blue-700' :
                                            task.status === 'IN_PROGRESS' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'
                                        }`}>{task.status === 'IN_PROGRESS' ? 'PENDING' : task.status?.replace('_', ' ')}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center text-gray-600 font-medium">
                                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" className="px-6 py-20 text-center text-gray-400 font-medium">No tasks match your current selection.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Showing {tasks.length} of {totalElements} Tasks
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => fetchTasks(currentPage - 1)} 
                        disabled={currentPage === 0 || loading} 
                        className="px-5 py-2 text-xs font-bold uppercase tracking-widest border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-30 transition-all active:scale-95 shadow-sm"
                    >
                        Prev
                    </button>
                    <button 
                        onClick={() => fetchTasks(currentPage + 1)} 
                        disabled={currentPage >= totalPages - 1 || loading} 
                        className="px-5 py-2 text-xs font-bold uppercase tracking-widest border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-30 transition-all active:scale-95 shadow-sm"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;