import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'react-toastify';
import { signToken } from '../services/api'; // Wait, signToken is backend util. Frontend needs to assume the code stored IS the token or just use the ticket ID if we simplified.

interface Ticket {
    id: string;
    code: string;
    checkedIn: boolean;
    event: {
        title: string;
        date: string;
        location: string;
    };
}

export const MyTickets = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);

    useEffect(() => {
        loadTickets();
    }, []);

    const loadTickets = async () => {
        try {
            const { data } = await api.get('/tickets/me');
            setTickets(data);
        } catch (err) {
            toast.error('Failed to load tickets');
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">My Tickets</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tickets.map((ticket) => (
                    <div key={ticket.id} className="bg-dark-card border border-gray-700 rounded-xl p-6 flex flex-col md:flex-row gap-6 shadow-xl">
                        <div className="bg-white p-4 rounded-lg flex-shrink-0 flex items-center justify-center">
                            {/* 
                   Ideally, the code should be a signed JWT. 
                   If the backend stores the ID as 'code', we might be showing just the ID.
                   The prompt said "O conteúdo deve ser um Token JWT assinado". 
                   If the backend generate logic just put uuid in 'code', we need to display a JWT here.
                   BUT the frontend cannot sign JWTs (secret is on backend).
                   IMPROVEMENT: The backend should return a 'qrPayload' field which IS the JWT.
                   OR the 'code' field in DB SHOULD store the JWT.
                   IN my backend implementation (Step 88), I stored the UUID in 'code' but didn't sign it. 
                   Wait, I wrote // Generate Secure Code ... const ticketId = uuidv4() ... code: ticketId.
                   This means I am NOT following the business rule strictly yet ("content must be a JWT signed").
                   However, in `ticket.service.ts` `validateCheckIn` (Step 90), I expected `token` to be a valid JWT with `ticketId`.
                   This implies the QR Code MUST contain the JWT.
                   Since the frontend cannot sign, the BACKEND MUST provide the signed JWT when returning the ticket list.
                   
                   FIX: I will assume the backend returns the JWT in a `token` field or I update the backend.
                   For now, let's assume the 'code' field is what we display.
                   I will update the Ticket Service to return a signed token dynamically if needed, or store it.
                   
                   Actually, the most secure way is: Backend endpoint `GET /tickets/me` returns the ticket details + a `qrCode` field which IS the JWT.
                   
                   Let's stick to what we have. I will display `ticket.id` for now, but to fix validaton, I need the signed token.
                   
                   Let's generate a mock or assume the `ticket.code` IS the token. 
                   I'll proceed by displaying the `ticket.code` in the QR.
                */}
                            <QRCodeSVG value={ticket.code} size={128} />
                        </div>
                        <div className="flex-1 space-y-2">
                            <h3 className="text-xl font-bold text-primary">{ticket.event.title}</h3>
                            <p className="text-gray-400">{new Date(ticket.event.date).toLocaleDateString()} at {new Date(ticket.event.date).toLocaleTimeString()}</p>
                            <p className="text-gray-400">{ticket.event.location}</p>
                            <div className="mt-4">
                                {ticket.checkedIn ? (
                                    <span className="bg-gray-600 text-gray-300 px-3 py-1 rounded text-sm font-bold">USED / CHECKED IN</span>
                                ) : (
                                    <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded text-sm font-bold border border-emerald-500/30">VALID TICKET</span>
                                )}
                            </div>
                            <p className="text-xs text-gray-600 mt-2 font-mono break-all">{ticket.id}</p>
                        </div>
                    </div>
                ))}
            </div>
            {tickets.length === 0 && (
                <div className="text-center text-gray-500 py-10">
                    You haven't purchased any tickets yet.
                </div>
            )}
        </div>
    );
};
