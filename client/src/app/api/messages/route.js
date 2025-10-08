import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, doc, getDocs, addDoc, query, where, orderBy, limit } from 'firebase/firestore';

// GET /api/messages - Get messages for a chat
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get('chatId');
    const limitCount = parseInt(searchParams.get('limit')) || 50;
    
    if (!chatId) {
      return NextResponse.json({ error: 'chatId is required' }, { status: 400 });
    }
    
    const messagesQuery = query(
      collection(db, 'messages'),
      where('chatId', '==', chatId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    
    const messagesSnapshot = await getDocs(messagesQuery);
    const messages = messagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Sort by timestamp ascending for display
    messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

// POST /api/messages - Send a new message
export async function POST(request) {
  try {
    const messageData = await request.json();
    const { 
      chatId, 
      senderId, 
      senderName,
      receiverId,
      receiverName,
      content, 
      type = 'text',
      isAI = false
    } = messageData;
    
    // Validate required fields
    if (!chatId || !senderId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Create new message
    const newMessage = {
      chatId,
      senderId,
      senderName: senderName || '',
      receiverId: receiverId || '',
      receiverName: receiverName || '',
      content,
      type,
      isAI,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    const docRef = await addDoc(collection(db, 'messages'), newMessage);
    
    return NextResponse.json({ id: docRef.id, ...newMessage }, { status: 201 });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
