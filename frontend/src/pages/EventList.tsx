import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    availableTickets: number;
}

export const EventList = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            const { data } = await api.get('/events');
            setEvents(data);
        } catch (err) {
            toast.error('Failed to load events');
        }
    };

    const handleBuy = async (eventId: string) => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            await api.post('/tickets', { eventId });
            toast.success('Ticket purchased successfully!');
            loadEvents(); // Refresh capacity
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Purchase failed');
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-indigo-400">
                Upcoming Events
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                    <div key={event.id} className="bg-dark-card border border-gray-700/50 rounded-xl overflow-hidden hover:border-gray-500 transition-all shadow-lg group">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-xl font-bold text-gray-100 group-hover:text-primary transition-colors">{event.title}</h2>
                                <span className="bg-gray-700 text-xs px-2 py-1 rounded text-gray-300">
                                    {new Date(event.date).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-gray-400 text-sm mb-4 line-clamp-3">{event.description}</p>
                            <div className="flex items-center text-sm text-gray-500 mb-6">
                                <span className="mr-4">📍 {event.location}</span>
                                <span>🎟 {event.availableTickets} left</span>
                            </div>
                            <button
                                onClick={() => handleBuy(event.id)}
                                disabled={event.availableTickets === 0}
                                className={`w-full py-2 rounded-lg font-medium transition-all ${event.availableTickets === 0
                                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                        : 'bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/20'
                                    }`}
                            >
                                {event.availableTickets === 0 ? 'Sold Out' : 'Get Ticket'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {events.length === 0 && (
                <div className="text-center text-gray-500 py-10">
                    No events found. Stay tuned!
                </div>
            )}
        </div>
    );
};
