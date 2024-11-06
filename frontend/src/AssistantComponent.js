import React, { useState, useEffect, useRef } from 'react';
import './AssistantComponent.css';
import axios from 'axios';
import curabot_logo from './curabot_logo.png'

const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

const AssistantComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          sender: 'assistant',
          text: "Hello! I'm CuraBot. Need help with a specific guide, material substitutes, or questions on improvised solutions? Just ask—I’m here to support you!"

        }
      ]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleQueryChange = (e) => setQuery(e.target.value);

  const sendQuery = async () => {
    if (!query.trim()) return;
    const userMessage = { sender: 'user', text: query };
    setMessages((prev) => [...prev, userMessage]);
    setQuery('');
    setIsTyping(true);

    try {
      const response = await axios.post(`${BACKEND_BASE_URL}assistant/query`, { query });
      const responseText = response.data.response;

      if (responseText) {
        const assistantMessage = { sender: 'assistant', text: responseText };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        setMessages((prev) => [...prev, { sender: 'assistant', text: 'Sorry, I could not process your request.' }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { sender: 'assistant', text: 'An error occurred. Please try again later.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendQuery();
  };

  return (
    <div className="assistant">
      <div className={`assistant-icon ${isOpen ? 'open' : ''}`} onClick={handleToggle}>
      <img className="curabot_logo" src={curabot_logo} alt="CuraBot Icon" />
      </div>
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>CuraBot</h3>
            <button onClick={handleToggle}>&times;</button>
          </div>
          <div className="chat-messages" ref={chatRef}>
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                <p>{msg.text}</p>
              </div>
            ))}
            {isTyping && <div className="message typing">CuraBot is typing...</div>}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={query}
              onChange={handleQueryChange}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question..."
            />
            <button onClick={sendQuery}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssistantComponent;
