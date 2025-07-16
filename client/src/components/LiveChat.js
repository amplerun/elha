import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';
import axios from 'axios';

let socket;

function LiveChat({ chatId }) {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const { user } = useSelector((state) => state.auth);
    const messagesEndRef = useRef(null);
    const ENDPOINT = 'http://localhost:3000'; // Change to window.location.origin in production

    useEffect(() => {
        const fetchPastMessages = async () => {
            if (chatId) {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(`/api/chat/${chatId}/messages`, config);
                setMessages(data);
            }
        };
        fetchPastMessages();

        socket = io(ENDPOINT);
        socket.emit('join_chat', chatId);

        socket.on('receive_message', (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        return () => {
            socket.disconnect();
            socket.off();
        };
    }, [chatId, user.token, ENDPOINT]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (message && chatId) {
            const messageData = { chatId, sender: user._id, text: message };
            socket.emit('send_message', messageData);
            setMessage('');
        }
    };

    return (
        <div style={{ border: '1px solid #ccc', height: '400px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
                {messages.map((msg) => (
                    <div key={msg._id} style={{ textAlign: msg.sender._id === user._id ? 'right' : 'left' }}>
                        <p style={{ background: msg.sender._id === user._id ? '#dcf8c6' : '#fff', display: 'inline-block', padding: '5px 10px', borderRadius: '10px' }}>
                           <strong>{msg.sender.name}:</strong> {msg.text}
                        </p>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={sendMessage} style={{ display: 'flex' }}>
                <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} style={{ flex: 1, padding: '10px' }} placeholder="Type a message..." />
                <button type="submit" className="btn" style={{ borderRadius: '0' }}>Send</button>
            </form>
        </div>
    );
}

export default LiveChat;