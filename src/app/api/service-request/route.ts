import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { serviceName, location, details, name, phone, email } = body;

    // Validate required fields
    if (!serviceName || !location || !name || !phone) {
      return NextResponse.json(
        { error: 'Please fill in all required fields' },
        { status: 400 }
      );
    }

    // Store in Firebase
    const serviceRequestsRef = collection(db, 'serviceRequests');
    const docRef = await addDoc(serviceRequestsRef, {
      serviceName,
      location,
      details: details || '',
      name,
      phone,
      email: email || '',
      status: 'pending',
      createdAt: serverTimestamp(),
      notificationSent: false,
    });

    // TODO: Send email notification to sandeshsb0219@gmail.com
    // You can integrate Resend, SendGrid, or Nodemailer here
    // For now, we're just storing in Firebase
    
    // Example email content that would be sent:
    const emailContent = `
      New Service Request Received!
      
      Service Needed: ${serviceName}
      Location: ${location}
      Details: ${details || 'Not provided'}
      
      Customer Information:
      Name: ${name}
      Phone: ${phone}
      Email: ${email || 'Not provided'}
      
      Request ID: ${docRef.id}
      Time: ${new Date().toLocaleString()}
    `;

    console.log('Service Request Stored:', docRef.id);
    console.log('Email to send:', emailContent);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Service request submitted successfully',
        requestId: docRef.id 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing service request:', error);
    return NextResponse.json(
      { error: 'Failed to process request. Please try again.' },
      { status: 500 }
    );
  }
}

