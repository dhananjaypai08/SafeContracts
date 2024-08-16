import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import axios from 'axios';

// import TermsAndConditionsModal from './TermsAndConditions';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { type: 'user', content: input }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:8000/query', { query: input });
      const plainTextResponse = JSON.stringify(response.data, null, 2);
      setMessages(prev => [...prev, { type: 'bot', content: plainTextResponse }]);
    } catch (error) {
      console.error('Error fetching response:', error);
      setMessages(prev => [...prev, { type: 'bot', content: 'Sorry, there was an error processing your request.' }]);
    } finally {
      setIsLoading(false);
    }
  };

//   const handleAcceptTerms = () => {
//     setShowTerms(false);
//   };

  return (
    <div className="flex flex-col h-screen bg-[#131314]">
      {/* <TermsAndConditionsModal isOpen={showTerms} onAccept={handleAcceptTerms} /> */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {messages.map((message, index) => (
            <div key={index} className={`mb-4 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block p-2 rounded-lg ${message.type === 'user' ? 'bg-blue-500 text-white' : 'bg-[#1E1F20] text-white'}`}>
                <pre className="whitespace-pre-wrap font-sans">
                  {message.content}
                </pre>
              </div>
            </div>
          ))}
          {isLoading && <div className="text-center text-white">Loading...</div>}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="p-4 bg-[#131314]">
          <div className="flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 text-white p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#1E1F20]"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              
            >
              <Send size={24} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;