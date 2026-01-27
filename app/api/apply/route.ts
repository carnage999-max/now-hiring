import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY) 
  : null;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    // Extracting all fields
    const data: any = {};
    for (const [key, value] of formData.entries()) {
      if (key !== 'photo') {
        data[key] = value;
      }
    }

    const file = formData.get('photo') as File | null;

    if (!data.firstName || !data.lastName || !data.email || !data.position) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Process File
    let photoData: string | null = null;
    let attachments = [];
    
    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      photoData = `data:${file.type};base64,${buffer.toString('base64')}`;
      attachments.push({
        filename: file.name,
        content: buffer,
      });
    }

    // 1. Save to Database
    try {
      await query(`
        CREATE TABLE IF NOT EXISTS applications_extended (
          id SERIAL PRIMARY KEY,
          payload JSONB NOT NULL,
          photo_data TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      await query(
        `INSERT INTO applications_extended (payload, photo_data) VALUES ($1, $2)`,
        [JSON.stringify(data), photoData]
      );
    } catch (dbError: any) {
      console.error('Database Error:', dbError);
    }

    // 2. Send Email
    try {
        if (resend) {
            const availability = data.availability ? JSON.parse(data.availability) : {};
            const education = data.education ? JSON.parse(data.education) : {};
            const employmentHistory = data.employmentHistory ? JSON.parse(data.employmentHistory) : [];
            const references = data.references ? JSON.parse(data.references) : [];

            const { data: resendData, error } = await resend.emails.send({
              from: 'info@nathanreardon.com',
              to: ['nathan@membershipauto.com', 'jamesezekiel039@gmail.com'],
              subject: `New Job Application: ${data.position} - ${data.firstName} ${data.lastName}`,
              html: `
                <div style="font-family: sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; border: 1px solid #eee; background: #fff; color: #333;">
                  <h2 style="color: #007AFF; border-bottom: 2px solid #007AFF; padding-bottom: 10px;">New Job Application Received</h2>
                  
                  <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <p><strong>Position Applying For:</strong> <span style="font-size: 1.2em; color: #007AFF;">${data.position}</span></p>
                    <p><strong>Source Website:</strong> ${data.source || 'Direct'}</p>
                  </div>

                  <h3 style="color: #444; background: #eee; padding: 5px 10px;">1. Personal Information</h3>
                  <p><strong>Full Name:</strong> ${data.firstName} ${data.middleName ? data.middleName + ' ' : ''}${data.lastName}${data.maidenName ? ' (Maiden: ' + data.maidenName + ')' : ''}</p>
                  <p><strong>Date of Birth:</strong> ${data.dob || 'N/A'}</p>
                  <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
                  <p><strong>Phone (Home):</strong> ${data.phone}</p>
                  <p><strong>Phone (Cell):</strong> ${data.cellPhone || 'N/A'}</p>
                  <p><strong>SSN:</strong> ${data.ssn || 'N/A'}</p>
                  <p><strong>Referred By:</strong> ${data.referredBy || 'N/A'}</p>
                  <p><strong>Age (if < 18):</strong> ${data.ageIfUnder18 || 'N/A'}</p>

                  <h3 style="color: #444; background: #eee; padding: 5px 10px;">2. Address</h3>
                  <p><strong>Current Address:</strong> ${data.address}${data.aptSuite ? ', ' + data.aptSuite : ''}, ${data.city}, ${data.state} ${data.zip}</p>
                  <p><strong>Permanent Address:</strong> ${data.permanentAddress || 'Same as current'}</p>
                  <p><strong>Length of Residency:</strong> ${data.addressHowLong || 'N/A'}</p>

                  <h3 style="color: #444; background: #eee; padding: 5px 10px;">3. Employment Eligibility</h3>
                  <p><strong>U.S. Citizen?</strong> ${data.isUSCitizen}</p>
                  <p><strong>Work Authorized?</strong> ${data.isWorkAuthorized}</p>
                  <p><strong>Convicted of Felony?</strong> ${data.hasFelony} ${data.felonyExplanation ? '(' + data.felonyExplanation + ')' : ''}</p>
                  <p><strong>Worked Here Before?</strong> ${data.previouslyWorkedHere} ${data.previousWorkDates ? '(' + data.previousWorkDates + ')' : ''}</p>
                  <p><strong>Drug Screening Consent?</strong> ${data.drugScreenConsent}</p>

                  <h3 style="color: #444; background: #eee; padding: 5px 10px;">4. Job & Availability</h3>
                  <p><strong>Desired Pay:</strong> ${data.salaryDesired} / ${data.payType}</p>
                  <p><strong>Employment Type:</strong> ${data.employmentDesired}</p>
                  <p><strong>When Available:</strong> ${data.whenAvailable || 'N/A'}</p>
                  <p><strong>Desired Hours/Week:</strong> ${data.hoursWeekly || 'N/A'}</p>
                  <p><strong>Nights OK?</strong> ${data.canWorkNights}</p>
                  <p><strong>Currently Employed?</strong> ${data.currentlyEmployed}</p>
                  <p><strong>May contact current employer?</strong> ${data.mayInquirePresentEmployer}</p>
                  <p><strong>Applied here before?</strong> ${data.previouslyApplied} ${data.previouslyAppliedDate ? '(' + data.previouslyAppliedDate + ')' : ''}</p>

                  <h3 style="color: #444; background: #eee; padding: 5px 10px;">5. Weekly Availability</h3>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr style="background: #f2f2f2;">
                      <th style="border: 1px solid #ddd; padding: 8px;">MON</th>
                      <th style="border: 1px solid #ddd; padding: 8px;">TUE</th>
                      <th style="border: 1px solid #ddd; padding: 8px;">WED</th>
                      <th style="border: 1px solid #ddd; padding: 8px;">THU</th>
                      <th style="border: 1px solid #ddd; padding: 8px;">FRI</th>
                      <th style="border: 1px solid #ddd; padding: 8px;">SAT</th>
                      <th style="border: 1px solid #ddd; padding: 8px;">SUN</th>
                    </tr>
                    <tr>
                      <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${availability.mon || '-'}</td>
                      <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${availability.tue || '-'}</td>
                      <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${availability.wed || '-'}</td>
                      <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${availability.thu || '-'}</td>
                      <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${availability.fri || '-'}</td>
                      <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${availability.sat || '-'}</td>
                      <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${availability.sun || '-'}</td>
                    </tr>
                  </table>

                  <h3 style="color: #444; background: #eee; padding: 5px 10px;">6. Education</h3>
                  ${Object.entries(education).map(([level, edu]: any) => `
                    <div style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px dashed #ccc;">
                      <p><strong>${level.toUpperCase()}:</strong> ${edu.name || 'N/A'}</p>
                      <p>Location: ${edu.location || 'N/A'} | Dates: ${edu.from || '?'} - ${edu.to || '?'} | Graduated: ${edu.graduated} | Degree: ${edu.degree || 'N/A'}</p>
                    </div>
                  `).join('')}

                  <h3 style="color: #444; background: #eee; padding: 5px 10px;">7. Employment History</h3>
                  ${employmentHistory.map((job: any, i: number) => `
                    <div style="margin-bottom: 15px; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                      <p><strong>Employer #${i + 1}:</strong> ${job.employer || 'N/A'}</p>
                      <p>Position: ${job.position || 'N/A'} | Dates: ${job.dates || 'N/A'} | Pay: ${job.payRate || 'N/A'}</p>
                      <p>Address: ${job.address || 'N/A'} | Phone: ${job.phone || 'N/A'}</p>
                      <p>Supervisor: ${job.supervisor || 'N/A'} | May Contact: ${job.canContact}</p>
                      <p>Reason for Leaving: ${job.reason || 'N/A'}</p>
                      <p>Duties: ${job.duties || 'N/A'}</p>
                    </div>
                  `).join('')}

                  <h3 style="color: #444; background: #eee; padding: 5px 10px;">8. References</h3>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr style="background: #f2f2f2;">
                      <th style="border: 1px solid #ddd; padding: 8px;">Name</th>
                      <th style="border: 1px solid #ddd; padding: 8px;">Title</th>
                      <th style="border: 1px solid #ddd; padding: 8px;">Company</th>
                      <th style="border: 1px solid #ddd; padding: 8px;">Phone</th>
                    </tr>
                    ${references.map((ref: any) => `
                      <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">${ref.name || 'N/A'}</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${ref.title || 'N/A'}</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${ref.company || 'N/A'}</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${ref.phone || 'N/A'}</td>
                      </tr>
                    `).join('')}
                  </table>

                  <h3 style="color: #444; background: #eee; padding: 5px 10px;">9. Additional Info</h3>
                  <p>${data.message ? data.message.replace(/\n/g, '<br>') : 'None'}</p>
                  
                  <div style="margin-top: 30px; font-size: 0.9em; padding: 15px; background: #f0f0f0; border-left: 4px solid #007AFF;">
                    <p><strong>Applicant Acknowledgement:</strong></p>
                    <p>[X] Certifies info is true: ${data.certifyTrue}</p>
                    <p>[X] Authorizes investigation: ${data.authorizeInvestigation}</p>
                    <p>[X] Understands discharge for false info: ${data.understandFalseInfo}</p>
                  </div>
                </div>
              `,
              attachments: attachments
            });

            if (error) console.error('Resend Error:', error);
        }
    } catch (emailError) {
      console.error('Email Exception:', emailError);
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Server Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
