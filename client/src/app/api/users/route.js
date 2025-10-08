import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';

// GET /api/users - Get all users or specific user
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id) {
      // Get specific user
      const userDoc = await getDoc(doc(db, 'users', id));
      if (userDoc.exists()) {
        return NextResponse.json({ id: userDoc.id, ...userDoc.data() });
      } else {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
    } else {
      // Get all users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return NextResponse.json(users);
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST /api/users - Create new user
export async function POST(request) {
  try {
    const userData = await request.json();
    const { email, name, userType, phone, address } = userData;
    
    // Validate required fields
    if (!email || !name || !userType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Check if user already exists
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const existingUsers = await getDocs(q);
    
    if (!existingUsers.empty) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }
    
    // Create new user
    const newUser = {
      email,
      name,
      userType, // 'consumer' or 'provider'
      phone: phone || '',
      address: address || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(collection(db, 'users'), newUser);
    
    return NextResponse.json({ id: docRef.id, ...newUser }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

// PUT /api/users - Update user
export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    const userData = await request.json();
    const updatedData = {
      ...userData,
      updatedAt: new Date().toISOString()
    };
    
    await updateDoc(doc(db, 'users', id), updatedData);
    
    return NextResponse.json({ id, ...updatedData });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

// DELETE /api/users - Delete user
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    await deleteDoc(doc(db, 'users', id));
    
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}