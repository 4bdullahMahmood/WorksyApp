import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit } from 'firebase/firestore';

// GET /api/services - Get all services with optional filters
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const location = searchParams.get('location');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const rating = searchParams.get('rating');
    const providerId = searchParams.get('providerId');
    
    let servicesQuery = collection(db, 'services');
    let constraints = [];
    
    // Apply filters
    if (category) {
      constraints.push(where('category', '==', category));
    }
    if (providerId) {
      constraints.push(where('providerId', '==', providerId));
    }
    if (minPrice) {
      constraints.push(where('price', '>=', parseFloat(minPrice)));
    }
    if (maxPrice) {
      constraints.push(where('price', '<=', parseFloat(maxPrice)));
    }
    if (rating) {
      constraints.push(where('rating', '>=', parseFloat(rating)));
    }
    
    // Add ordering
    constraints.push(orderBy('createdAt', 'desc'));
    constraints.push(limit(50)); // Limit results
    
    const q = query(servicesQuery, ...constraints);
    const servicesSnapshot = await getDocs(q);
    const services = servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Filter by location if provided (client-side filtering for now)
    let filteredServices = services;
    if (location) {
      filteredServices = services.filter(service => 
        service.location?.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    return NextResponse.json(filteredServices);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

// POST /api/services - Create new service
export async function POST(request) {
  try {
    const serviceData = await request.json();
    const { 
      title, 
      description, 
      category, 
      price, 
      location, 
      providerId, 
      providerName,
      images = [],
      availability = 'available',
      rating = 0,
      reviewCount = 0
    } = serviceData;
    
    // Validate required fields
    if (!title || !description || !category || !price || !providerId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Create new service
    const newService = {
      title,
      description,
      category,
      price: parseFloat(price),
      location: location || '',
      providerId,
      providerName: providerName || '',
      images,
      availability,
      rating: parseFloat(rating),
      reviewCount: parseInt(reviewCount),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(collection(db, 'services'), newService);
    
    return NextResponse.json({ id: docRef.id, ...newService }, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}

// PUT /api/services - Update service
export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });
    }
    
    const serviceData = await request.json();
    const updatedData = {
      ...serviceData,
      updatedAt: new Date().toISOString()
    };
    
    await updateDoc(doc(db, 'services', id), updatedData);
    
    return NextResponse.json({ id, ...updatedData });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

// DELETE /api/services - Delete service
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });
    }
    
    await deleteDoc(doc(db, 'services', id));
    
    return NextResponse.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}
