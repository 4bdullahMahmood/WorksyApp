'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader } from 'lucide-react';
import MessageBubble from './MessageBubble';
import { api } from '@/utils/api';

export default function ChatBox({ chatId, currentUser, onNewMessage }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Load messages when chatId changes
  useEffect(() => {
    if (chatId) {
      loadMessages();
    }
  }, [chatId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const response = await api.messages.getChat(chatId);
      setMessages(response);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId) return;

    const messageText = newMessage.trim();
    setNewMessage('');
    setIsTyping(true);

    // Add user message immediately
    const userMessage = {
      id: Date.now(),
      senderId: currentUser.uid,
      senderName: currentUser.displayName || currentUser.email,
      content: messageText,
      type: 'text',
      isAI: false,
      timestamp: new Date().toISOString(),
      read: true
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      // Send message to API
      await api.messages.send({
        chatId,
        senderId: currentUser.uid,
        senderName: currentUser.displayName || currentUser.email,
        content: messageText,
        type: 'text',
        isAI: false
      });

      // Get AI response if it's a general chat
      if (chatId === 'ai-assistant') {
        const aiResponse = await api.ai.chat(messageText);
        
        const aiMessage = {
          id: Date.now() + 1,
          senderId: 'ai-assistant',
          senderName: 'AI Assistant',
          content: aiResponse.response,
          type: 'text',
          isAI: true,
          timestamp: new Date().toISOString(),
          read: true
        };

        setMessages(prev => [...prev, aiMessage]);
      }

      // Notify parent component
      if (onNewMessage) {
        onNewMessage(userMessage);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  if (!chatId) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <div className="text-center">
          <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Select a chat to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            {chatId === 'ai-assistant' ? (
              <Bot className="h-5 w-5 text-blue-600" />
            ) : (
              <User className="h-5 w-5 text-blue-600" />
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">
              {chatId === 'ai-assistant' ? 'AI Assistant' : 'Chat'}
            </h3>
            <p className="text-sm text-gray-500">
              {chatId === 'ai-assistant' ? 'Ask me anything about services' : 'Online'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{ maxHeight: '400px' }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader className="h-6 w-6 animate-spin text-blue-600" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500">
            <Bot className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p>Start a conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isCurrentUser={message.senderId === currentUser.uid}
            />
          ))
        )}
        
        {isTyping && (
          <div className="flex items-center space-x-2 text-gray-500">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-sm">AI is typing...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={sendMessage} className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isTyping}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
