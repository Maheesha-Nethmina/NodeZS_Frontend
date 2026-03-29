import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, getMyTasksPaged, updateTask, deleteTask } from '../services/apiService';
import Navbar from '../Components/Navbar';

function MyTask() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);

    // State for Editing
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        const currentUser = getCurrentUser();
        
        // Console log user data as requested
        console.log("Current session user:", currentUser);

        if (!currentUser) {
            navigate('/login');
        } else {
            setUser(currentUser);
            // Passing currentUser.id to fetch tasks created by this specific ID
            fetchMyTasks(currentUser.id, 0);
        }
    }, [navigate]);

    const fetchMyTasks = async (userId, pageNumber) => {
        setLoading(true);
        try {
            const response = await getMyTasksPaged(userId, pageNumber, 10);
            if (response.code === "00") {
                setTasks(response.content.tasks);
                setTotalPages(response.content.totalPages);
                setCurrentPage(response.content.currentPage);
            }
        } catch (error) {
            console.error("Error fetching my tasks:", error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handles the update submission
     */
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedData = {
                ...editingTask,
                dueDate: editingTask.dueDate?.includes('T') 
                    ? editingTask.dueDate 
                    : `${editingTask.dueDate}T00:00:00`
            };

            const res = await updateTask(updatedData);
            if (res.code === "00") {
                alert("Task updated successfully!");
                setEditingTask(null);
                fetchMyTasks(user.id, currentPage); 
            }
        } catch (err) {
            alert("Failed to update task: " + (err.message || "Unknown error"));
        }
    };

    /**
     * Handles task deletion with confirmation
     */
    const handleDeleteTask = async (taskid, title) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete the task: "${title}"?`);
        
        if (confirmDelete) {
            try {
                const res = await deleteTask(taskid);
                if (res.code === "00") {
                    alert("Task deleted successfully!");
                    fetchMyTasks(user.id, currentPage); 
                }
            } catch (err) {
                alert("Failed to delete task: " + (err.message || "Unknown error"));
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar user={user} />
            
            <main className="container mx-auto mt-8 px-4">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">My Personal Tasks</h1>
                        {/* Removed ID from UI, kept only name */}
                        <p className="text-gray-500 mt-1">Viewing tasks created by: <span className="font-semibold text-indigo-600">{user?.name}</span></p>
                    </div>
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                        &larr; Back to Dashboard
                    </button>
                </header>

                {/* --- EDIT MODAL --- */}
                {editingTask && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl border border-gray-100">
                            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">Update Task</h2>
                            <form onSubmit={handleUpdateSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Title</label>
                                    <input 
                                        className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" 
                                        value={editingTask.title} 
                                        onChange={(e) => setEditingTask({...editingTask, title: e.target.value})} 
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Description</label>
                                    <textarea 
                                        className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" 
                                        rows="3"
                                        value={editingTask.description} 
                                        onChange={(e) => setEditingTask({...editingTask, description: e.target.value})} 
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Priority</label>
                                        <select 
                                            className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" 
                                            value={editingTask.priority}
                                            onChange={(e) => setEditingTask({...editingTask, priority: e.target.value})}
                                        >
                                            <option value="HIGH">High</option>
                                            <option value="MEDIUM">Medium</option>
                                            <option value="LOW">Low</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Due Date</label>
                                        <input 
                                            type="date" 
                                            className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" 
                                            value={editingTask.dueDate?.split('T')[0] || ""} 
                                            onChange={(e) => setEditingTask({...editingTask, dueDate: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-bold transition-colors">Update</button>
                                    <button type="button" onClick={() => setEditingTask(null)} className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* --- DATA TABLE --- */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                                <tr>
                                    <th className="px-6 py-4 border-b">Task Details</th>
                                    <th className="px-6 py-4 border-b">Priority</th>
                                    <th className="px-6 py-4 border-b">Status</th>
                                    <th className="px-6 py-4 border-b text-center">Due Date</th>
                                    <th className="px-6 py-4 border-b text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {loading ? (
                                    <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-400 animate-pulse">Loading your tasks...</td></tr>
                                ) : tasks.length > 0 ? (
                                    tasks.map((task) => (
                                        <tr key={task.taskid} className="hover:bg-indigo-50/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-900">{task.title}</div>
                                                <div className="text-xs text-gray-400 mt-1 line-clamp-1">{task.description || "No description"}</div>
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
                                                }`}>{task.status === 'IN_PROGRESS' ? 'PENDING' : task.status}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center text-gray-600">
                                                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <button 
                                                        onClick={() => setEditingTask(task)}
                                                        className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded font-bold hover:bg-indigo-100 transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteTask(task.taskid, task.title)}
                                                        className="bg-red-50 text-red-600 px-3 py-1 rounded font-bold hover:bg-red-100 transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-20 text-center text-gray-400 font-medium">
                                            You haven't created any tasks yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Page {currentPage + 1} of {totalPages || 1}
                        </div>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => fetchMyTasks(user.id, currentPage - 1)} 
                                disabled={currentPage === 0 || loading} 
                                className="px-4 py-2 text-xs font-bold border border-gray-200 rounded-lg bg-white disabled:opacity-30"
                            >
                                Prev
                            </button>
                            <button 
                                onClick={() => fetchMyTasks(user.id, currentPage + 1)} 
                                disabled={currentPage >= totalPages - 1 || loading} 
                                className="px-4 py-2 text-xs font-bold border border-gray-200 rounded-lg bg-white disabled:opacity-30"
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

export default MyTask;