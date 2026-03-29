import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import { getCurrentUser, saveTask } from '../services/apiService';

function AddNewTask() {

    // Hooks for navigation and session management
    const navigate = useNavigate();
    const user = getCurrentUser();

    // state management for form inputs, loading state, and error messages    
    const [task, setTask] = useState({
        title: "",
        description: "",
        priority: "MEDIUM", 
        dueDate: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); 
        setError("");

        // added userid to idetify the creator of the task
        const taskPayload = {
            title: task.title,
            description: task.description,
            priority: task.priority,
            userId: user?.id, 
            dueDate: task.dueDate ? `${task.dueDate}T00:00:00` : null
        };

        try {
            // Check if user session exists before sending
            if (!user?.id) {
                throw new Error("User session not found. Please log in again.");
            }

            const response = await saveTask(taskPayload);
            
            if (response.code === "00") {
                alert("Task Created Successfully!");
                navigate('/dashboard');
            } else {
                setError(response.message || "Failed to create task.");
            }
        } catch (err) {
            console.error("Submission Error:", err);
            setError(err.message || "An error occurred while saving the task.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar user={user} />
            <main className="container mx-auto mt-10 px-4 max-w-2xl">
                <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Task</h2>
                    
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Task Title *</label>
                            <input 
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="Enter task title"
                                value={task.title}
                                onChange={(e) => setTask({...task, title: e.target.value})}
                                required 
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                            <textarea 
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                                rows="3"
                                placeholder="Add some details..."
                                value={task.description}
                                onChange={(e) => setTask({...task, description: e.target.value})}
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Priority</label>
                                <select 
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={task.priority}
                                    onChange={(e) => setTask({...task, priority: e.target.value})}
                                >
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Due Date</label>
                                <input 
                                    type="date"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={task.dueDate}
                                    onChange={(e) => setTask({...task, dueDate: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors disabled:bg-indigo-400"
                            >
                                {loading ? "Saving..." : "Create Task"}
                            </button>
                            <button 
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}

export default AddNewTask;