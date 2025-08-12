import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import axios, { AxiosError } from 'axios';
import fs from 'fs';
import path from 'path';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const sendEmail = async (to: string, subject: string, html: string) => {
  await transporter.sendMail({ from: process.env.GMAIL_USER, to, subject, html });
};



export const sendSMS = async (phone: string, message: string): Promise<void> => {
  try {
    const response = await axios.post('https://api.sparrowsms.com/v2/sms/', null, {
      params: {
        token: process.env.SPARROW_SMS_TOKEN,
        from: 'InfoAlert',
        to: phone,
        text: message,
      },
    });

    console.log('✅ SMS sent successfully:', response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('❌ SMS Error:', error.response?.data || error.message);
    } else {
      console.error('❌ Unknown error:', error);
    }
  }
};


const writeLog = async (content: string) => {
  const date = new Date().toISOString().split('T')[0];
  const logDir = path.resolve(process.cwd(), 'log');
  const logPath = path.join(logDir, `${date}-log.md`);
  const logEntry = `### 📬 ${new Date().toLocaleString()} Notification Log\n\n${content}\n\n---\n`;

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }

  fs.appendFileSync(logPath, logEntry, 'utf8');
};

function scoreMatch(request: any, listing: any): number {
  let score = 0;

  if (listing.propertyType === request.property_type) score += 2;
  if (listing.address?.toLowerCase().includes(request.location.toLowerCase())) score += 2;

  const budget = parseFloat(request.budget.replace(/[^\\d.]/g, ''));
  if (listing.price >= budget - 2000 && listing.price <= budget + 2000) score += 2;

  if (!request.number_of_rooms || listing.rooms >= request.number_of_rooms) score += 1;
  if (!request.parking || listing.parking) score += 1;
  if (!request.area || parseFloat(listing.area) >= parseFloat(request.area)) score += 1;

  return score;
}

export async function POST() {
  const { data: requests, error: reqError } = await supabase
    .from('property_requests')
    .select('*')
    .eq('hasPaid', 'yes');

  if (reqError) return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 });

  let notifiedCount = 0;

  for (const request of requests) {
    if (request.messageCount >= 3 && request.emailCount >= 10) continue;

    const { data: listings } = await supabase
      .from('listing')
      .select('*')
      .ilike('address', `%${request.location}%`)
      .eq('propertyType', request.property_type);

    if (!listings || listings.length === 0) continue;

    const scored = listings
      .map(listing => ({ listing, score: scoreMatch(request, listing) }))
      .filter(item => item.score >= 6)
      .sort((a, b) => b.score - a.score);

    const bestMatch = scored.find(item => item.listing.id !== request.lastlistingsent);
    if (!bestMatch) continue;

    const newListing = bestMatch.listing;

    const { data: images } = await supabase
      .from('listingImages')
      .select('url')
      .eq('listing_id', newListing.id)
      .order('id', { ascending: true });

    const propertyImages = images?.map(img => img.url).filter(Boolean) || [];

   
    const propertyLink = `https://onlinehomenepal.com/view-listing/${newListing.id}`;
    const whatsappLink = `https://wa.me/977${request.phone}?text=${encodeURIComponent(
  `नमस्कार,\n\nम यो घरको बारेमा जानकारी लिन चाहन्छु:\n${propertyLink}\n\nकृपया थप जानकारी दिनुहोस् वा भेटको समय मिलाइदिनुहोस्।`
)}`

    const imageHTML = propertyImages
  .map(
    (url) => `
    <tr>
      <td style="padding: 8px;">
        <img src="${url}" width="280" style="border-radius: 6px; display: block;" alt="Listing Image" />
      </td>
    </tr>
  `
  )
  .join('');


    const emailHTML = `
      <div style="font-family: Arial, sans-serif; padding: 24px; background-color: #f5f5f5; color: #333;">
        <h2 style="color: #2c3e50;">🏡 New Property Match for You</h2>
        ${imageHTML || '⚠️ Please Visit the Link to View images'}
        <p><strong>📍 Location:</strong> ${newListing.address}</p>
        <p><strong>💰 Price:</strong> NPR ${newListing.price.toLocaleString()}</p>
        <p><strong>🏠 Type:</strong> ${newListing.propertyType}</p>
        ${newListing.rooms ? `<p><strong>🛏️ Rooms:</strong> ${newListing.rooms}</p>` : ''}
        ${newListing.bathrooms ? `<p><strong>🛁 Bathrooms:</strong> ${newListing.bathrooms}</p>` : ''}
        ${newListing.parking ? `<p><strong>🚗 Parking:</strong> ${newListing.parking}</p>` : ''}
        ${newListing.khali_hune_date ? `<p><strong>📅 Available From:</strong> ${newListing.khali_hune_date}</p>` : ''}

        <div style="margin-top:16px; padding:12px; background:#fff; border-radius:6px; border:1px solid #ddd;">
          <p><strong>Description:</strong></p>
          <p>${newListing.description || 'No detailed description provided.'}</p>
        </div>

        <a href="${propertyLink}" style="display:inline-block; margin:16px 0; padding:12px 24px; background:#007BFF; color:white; text-decoration:none; border-radius:6px;">🔍 View This Property</a>

        <div style="margin-top:24px;">
          <p><strong>If you're interested in this property, contact us:</strong></p>
          <a href="${whatsappLink}" style="margin-right:12px; padding:10px 18px; background:#25D366; color:#fff; border-radius:6px; text-decoration:none;">💬 Chat on WhatsApp</a>
          <a href="https://www.facebook.com/roomfinder100" style="padding:10px 18px; background:#3b5998; color:#fff; border-radius:6px; text-decoration:none;">👍 Facebook Page</a>
        </div>

        <div style="margin-top:32px; text-align:center;">
          <a href="https://onlinehomenepal.com" style="padding:14px 28px; background:#FF5722; color:white; font-weight:bold; text-decoration:none; border-radius:8px;">🌐 Visit Our Website</a>
        </div>

        <div style="margin-top:32px; text-align:center;">
          <p><strong>Follow Us On</strong></p>
          <a href="https://www.facebook.com/roomfinder100" style="margin: 0 8px; color:#3b5998;">Facebook</a>
          <a href="https://www.instagram.com/onlinehomenepal" style="margin: 0 8px; color:#E1306C;">Instagram</a>
          <a href="https://www.youtube.com/@onlinehomenepal" style="margin: 0 8px; color:#FF0000;">YouTube</a>
        </div>

        <hr style="margin-top:40px;" />
        <p style="font-size:12px; color:gray; text-align:center;">You’re receiving this because you requested property matches. Max 10 emails and 3 SMS will be sent.</p>
      </div>
    `;

    // SMS
    if (request.messageCount < 3) {
      try {
        await sendSMS(request.phone, `🏠 ${newListing.address} for NPR ${newListing.price}\n${propertyLink}`);
        await supabase.from('property_requests').update({ messageCount: request.messageCount + 1 }).eq('id', request.id);
      } catch (err) {
        console.error("SMS Error:", err);
      }
    }

    // Email
    if (request.emailCount < 10) {
      try {
        await sendEmail(request.email, '🏡 Property Match Found!', emailHTML);
        await supabase.from('property_requests').update({ emailCount: request.emailCount + 1 }).eq('id', request.id);
      } catch (err) {
        console.error("Email Error:", err);
      }
    }

    // Log with image
    await writeLog(`
**User:** ${request.full_name}  
**Email:** ${request.email}  
**Phone:** ${request.phone}  
**Requested:** ${request.property_type} in ${request.location}  
**Matched:** ${newListing.address} — NPR ${newListing.price}  
**Link:** ${propertyLink}  
**Images:**  
${propertyImages.map((url, i) => `  ${i + 1}. ${url}`).join('\n')}
`);

    await supabase.from('property_requests').update({ lastlistingsent: newListing.id }).eq('id', request.id);
    notifiedCount++;
  }

  return NextResponse.json({ success: true, notifiedCount });
}
