import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, getAssignedTasksPaged, updateTaskStatus } from '../services/apiService';
import Navbar from '../Components/Navbar';

function Selection() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            navigate('/login');
        } else {
            setUser(currentUser);
            fetchAssignedTasks(currentUser.email, 0);
        }
    }, [navigate]);

    const fetchAssignedTasks = async (email, pageNumber) => {
        setLoading(true);
        try {
            const response = await getAssignedTasksPaged(email, pageNumber, 10);
            if (response.code === "00") {
                setTasks(response.content.tasks);
                setTotalPages(response.content.totalPages);
                setTotalElements(response.content.totalElements);
                setCurrentPage(response.content.currentPage);
            }
        } catch (error) {
            console.error("Error fetching assigned tasks:", error);
        } finally {
            setLoading(false);
        }
    };

    // task status change handler for marking tasks as done
    const handleStatusChange = async (taskid, isChecked, taskTitle) => {
        if (isChecked) {
            const confirmDone = window.confirm(`Mark "${taskTitle}" as completed?`);
            if (confirmDone) {
                try {
                    const res = await updateTaskStatus(taskid, "DONE", user?.email);
                    if (res.code === "00") {
                        fetchAssignedTasks(user.email, currentPage);
                    }
                } catch (err) {
                    console.error("Failed to update status:", err);
                    alert("Could not mark task as completed.");
                }
            }
        }
    };

    //confirmation before removing task selection and unassigning it from the user
    const handleRemoveSelection = async (taskid, taskTitle) => {
        const confirmRemove = window.confirm(`Are you sure you want to remove "${taskTitle}" from your selections? This task will be available for others to pick up.`);
        
        if (confirmRemove) {
            try {
                const res = await updateTaskStatus(taskid, "TODO", "");
                if (res.code === "00") {
                    alert("Task unassigned successfully.");
                    fetchAssignedTasks(user.email, currentPage);
                }
            } catch (err) {
                console.error("Failed to remove task selection:", err);
                alert("Could not remove task selection.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar user={user} />
            
            <main className="container mx-auto mt-8 px-4 pb-10">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Assigned Selections</h1>
                        <p className="text-gray-500 mt-1">Tasks managed by: <span className="font-semibold text-indigo-600">{user?.email}</span></p>
                    </div>
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="bg-white border border-gray-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        &larr; Back to Dashboard
                    </button>
                </header>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800">Your Current Assignments ({totalElements})</h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-black tracking-widest">
                                <tr>
                                    <th className="px-6 py-4 border-b text-center w-20">Done</th>
                                    <th className="px-6 py-4 border-b">Task Details</th>
                                    <th className="px-6 py-4 border-b">Priority</th>
                                    <th className="px-6 py-4 border-b">Status</th>
                                    <th className="px-6 py-4 border-b text-center">Due Date</th>
                                    <th className="px-6 py-4 border-b text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {loading ? (
                                    <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-400 animate-pulse font-medium">Loading assigned tasks...</td></tr>
                                ) : tasks.length > 0 ? (
                                    tasks.map((task) => (
                                        <tr key={task.taskid} className={`hover:bg-indigo-50/20 transition-colors font-medium ${task.status === 'DONE' ? 'opacity-60 bg-gray-50/50' : ''}`}>
                                            <td className="px-6 py-4 text-center">
                                                <input 
                                                    type="checkbox" 
                                                    className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer disabled:cursor-default"
                                                    checked={task.status === 'DONE'}
                                                    disabled={task.status === 'DONE'}
                                                    onChange={(e) => handleStatusChange(task.taskid, e.target.checked, task.title)}
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`text-slate-900 font-bold ${task.status === 'DONE' ? 'line-through text-gray-400' : ''}`}>{task.title}</div>
                                                <div className="text-xs text-gray-400 line-clamp-1 mt-0.5">{task.description || 'No description'}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${
                                                    task.priority === 'HIGH' ? 'bg-red-50 text-red-600' :
                                                    task.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                                                }`}>
                                                    {task.priority}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                                                    task.status === 'DONE' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
                                                }`}>
                                                    {task.status === 'IN_PROGRESS' ? 'PENDING' : task.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center text-gray-500 italic">
                                                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => handleRemoveSelection(task.taskid, task.title)}
                                                    disabled={task.status === 'DONE'}
                                                    className="text-red-500 hover:text-red-700 text-xs font-bold uppercase tracking-tighter disabled:opacity-0 transition-all"
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-20 text-center text-gray-400 font-medium">
                                            No assigned tasks found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Page {currentPage + 1} of {totalPages || 1}
                        </span>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => fetchAssignedTasks(user.email, currentPage - 1)} 
                                disabled={currentPage === 0 || loading} 
                                className="px-4 py-1.5 text-xs font-bold border rounded-lg bg-white disabled:opacity-30 hover:bg-gray-50 shadow-sm"
                            >
                                Prev
                            </button>
                            <button 
                                onClick={() => fetchAssignedTasks(user.email, currentPage + 1)} 
                                disabled={currentPage >= totalPages - 1 || loading} 
                                className="px-4 py-1.5 text-xs font-bold border rounded-lg bg-white disabled:opacity-30 hover:bg-gray-50 shadow-sm"
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

export default Selection;