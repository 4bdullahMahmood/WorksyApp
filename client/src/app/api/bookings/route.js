import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';

// GET /api/bookings - Get bookings for a user or provider
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const providerId = searchParams.get('providerId');
    const status = searchParams.get('status');
    
    if (!userId && !providerId) {
      return NextResponse.json({ error: 'userId or providerId is required' }, { status: 400 });
    }
    
    let bookingsQuery = collection(db, 'bookings');
    let constraints = [];
    
    // Apply filters
    if (userId) {
      constraints.push(where('customerId', '==', userId));
    }
    if (providerId) {
      constraints.push(where('providerId', '==', providerId));
    }
    if (status) {
      constraints.push(where('status', '==', status));
    }
    
    // Add ordering
    constraints.push(orderBy('createdAt', 'desc'));
    
    const q = query(bookingsQuery, ...constraints);
    const bookingsSnapshot = await getDocs(q);
    const bookings = bookingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

// POST /api/bookings - Create new booking
export async function POST(request) {
  try {
    const bookingData = await request.json();
    const { 
      serviceId, 
      customerId, 
      providerId, 
      customerName,
      providerName,
      serviceTitle,
      price,
      scheduledDate,
      scheduledTime,
      address,
      phone,
      notes = '',
      status = 'pending'
    } = bookingData;
    
    // Validate required fields
    if (!serviceId || !customerId || !providerId || !scheduledDate || !scheduledTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Create new booking
    const newBooking = {
      serviceId,
      customerId,
      providerId,
      customerName: customerName || '',
      providerName: providerName || '',
      serviceTitle: serviceTitle || '',
      price: parseFloat(price) || 0,
      scheduledDate,
      scheduledTime,
      address: address || '',
      phone: phone || '',
      notes,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(collection(db, 'bookings'), newBooking);
    
    return NextResponse.json({ id: docRef.id, ...newBooking }, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

// PUT /api/bookings - Update booking
export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
    }
    
    const bookingData = await request.json();
    const updatedData = {
      ...bookingData,
      updatedAt: new Date().toISOString()
    };
    
    await updateDoc(doc(db, 'bookings', id), updatedData);
    
    return NextResponse.json({ id, ...updatedData });
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}

// DELETE /api/bookings - Delete booking
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
    }
    
    await deleteDoc(doc(db, 'bookings', id));
    
    return NextResponse.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 });
  }
}
