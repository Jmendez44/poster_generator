// pages/api/subscribe.js

import { NextResponse } from 'next/server';
import mailchimp from '@mailchimp/mailchimp_marketing';

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY!,
  server: process.env.MAILCHIMP_SERVER_PREFIX!, // e.g., 'us1'
});

export async function POST(req: Request) {
  console.log('Received request to /api/subscribe');
  try {
    const { email_address } = await req.json();
    console.log('Email address:', email_address);

    if (!email_address) {
      console.log('Email address is missing');
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    console.log('Attempting to add member to Mailchimp');
    const response = await mailchimp.lists.addListMember(process.env.MAILCHIMP_AUDIENCE_ID!, {
      email_address,
      status: 'subscribed',
    });
    console.log('Mailchimp response:', response);

    return NextResponse.json({ message: 'Success', data: response });
  } catch (error: any) {
    console.error('Error in subscribe API:', error);
    if (error.response && error.response.body.title === 'Member Exists') {
      return NextResponse.json({ error: 'Email is already subscribed' }, { status: 400 });
    }

    return NextResponse.json({ 
      error: 'An error occurred', 
      details: error.response ? error.response.body : error.message 
    }, { status: 500 });
  }
}
