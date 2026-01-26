import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY) 
  : null;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const position = formData.get('position') as string;
    const message = formData.get('message') as string;
    const source = formData.get('source') as string;
    const file = formData.get('photo') as File | null;

    if (!firstName || !lastName || !email || !position) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Process File (Convert to Base64 for simple DB storage)
    let photoData: string | null = null;
    let attachments = [];
    
    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // For DB storage
      photoData = `data:${file.type};base64,${buffer.toString('base64')}`;
      
      // For Email attachment (Resend expects Buffer)
      attachments.push({
        filename: file.name,
        content: buffer,
      });
    }

    // 1. Save to Database
    try {
      // Auto-migration for simplicity (Ensure table exists)
      await query(`
        CREATE TABLE IF NOT EXISTS applications (
          id SERIAL PRIMARY KEY,
          first_name VARCHAR(100) NOT NULL,
          last_name VARCHAR(100) NOT NULL,
          email VARCHAR(150) NOT NULL,
          phone VARCHAR(50),
          position VARCHAR(100) NOT NULL,
          message TEXT,
          photo_data TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await query(
        `INSERT INTO applications (first_name, last_name, email, phone, position, message, photo_data)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [firstName, lastName, email, phone, position, message, photoData]
      );
    } catch (dbError: any) {
      console.error('Database Error:', dbError);
      return NextResponse.json({ error: 'Database save failed: ' + dbError.message }, { status: 500 });
    }

    // 2. Send Email via Resend
    try {
        if (resend) {
            const { data, error } = await resend.emails.send({
              from: 'info@nathanreardon.com',
              to: ['nathan@membershipauto.com', 'jamesezekiel039@gmail.com'],
              subject: `New Job Application: ${position} - ${firstName} ${lastName}`,
              html: `
                <h2>New Job Application Received</h2>
                <p><strong>Position:</strong> ${position}</p>
                <p><strong>Source Website:</strong> ${source || 'Direct Application'}</p>
                <p><strong>Applicant:</strong> ${firstName} ${lastName}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p><strong>Phone:</strong> ${phone}</p>
                <hr />
                <h3>Message</h3>
                <p>${message ? message.replace(/\n/g, '<br>') : 'No message provided.'}</p>
              `,
              attachments: attachments
            });

            if (error) {
              console.error('Resend Error:', error);
            } else {
                console.log('Email sent successfully:', data);
            }
        } else {
             console.log('Resend API Key missing, skipping email.');
        }

    } catch (emailError) {
      console.error('Email Exception:', emailError);
    }

    return NextResponse.json({ success: true, message: 'Application submitted successfully' });

  } catch (error: any) {
    console.error('Server Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
