'use client';

import { Bot, User, Check, CheckCheck } from 'lucide-react';

export default function MessageBubble({ message, isCurrentUser }) {
  const { content, senderName, timestamp, isAI, read } = message;

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-xs lg:max-w-md ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 ${isCurrentUser ? 'ml-2' : 'mr-2'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isAI 
              ? 'bg-blue-100' 
              : isCurrentUser 
                ? 'bg-blue-600' 
                : 'bg-gray-100'
          }`}>
            {isAI ? (
              <Bot className="h-4 w-4 text-blue-600" />
            ) : (
              <User className={`h-4 w-4 ${isCurrentUser ? 'text-white' : 'text-gray-600'}`} />
            )}
          </div>
        </div>

        {/* Message Content */}
        <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
          {/* Sender Name (for group chats) */}
          {!isCurrentUser && (
            <span className="text-xs text-gray-500 mb-1">{senderName}</span>
          )}

          {/* Message Bubble */}
          <div className={`px-4 py-2 rounded-lg ${
            isCurrentUser
              ? 'bg-blue-600 text-white'
              : isAI
                ? 'bg-blue-50 text-gray-800 border border-blue-200'
                : 'bg-gray-100 text-gray-800'
          }`}>
            <p className="text-sm whitespace-pre-wrap">{content}</p>
          </div>

          {/* Message Status */}
          <div className={`flex items-center mt-1 text-xs ${
            isCurrentUser ? 'text-gray-500' : 'text-gray-400'
          }`}>
            <span>{formatTime(timestamp)}</span>
            {isCurrentUser && (
              <div className="ml-1">
                {read ? (
                  <CheckCheck className="h-3 w-3 text-blue-500" />
                ) : (
                  <Check className="h-3 w-3" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
