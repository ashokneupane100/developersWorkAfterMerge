// lib/propertyRequestMail.ts
import { transporter } from './mail';

// Email function for user confirmation of property request
export async function sendPropertyRequestConfirmationEmail({
  to,
  name,
  propertyType,
  location
}: {
  to: string;
  name: string;
  propertyType: string;
  location: string;
}) {
  console.log("Sending property request confirmation to:", to);
  
  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_SERVER_USER}>`,
    to,
    subject: 'Your Property Request Confirmation',
    text: `Hello ${name},\n\nThank you for submitting your property request for a ${propertyType} in ${location}.\n\nYour request has been received successfully. Our team will get back to you soon.\n\nThank you,\nYour Property Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #4a6ee0; padding: 20px; text-align: center; color: white;">
          <h2>Property Request Confirmation</h2>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9;">
          <p>Hello ${name},</p>
          
          <p>Thank you for submitting your property request. We have received your interest in a ${propertyType} in ${location}.</p>
          
          <p>Our team will review your request and get back to you soon with suitable options.</p>
          
          <p>If you have any questions or need to update your request, please don't hesitate to contact us.</p>
          
          <p>Best regards,<br>
          Your Property Team</p>
        </div>
        <div style="font-size: 12px; text-align: center; padding: 10px; color: #666;">
          <p>This is an automated message. Please do not reply directly to this email.</p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Confirmation email sent successfully:", info.messageId);
    return { success: true, info };
  } catch (error) {
    console.error('Error sending property request confirmation email:', error);
    return { success: false, error };
  }
}

// Email function for admin notification of new property request
export async function sendPropertyRequestNotificationEmail(
  requestDetails: {
    fullName: string;
    email: string;
    phone: string;
    propertyType: string;
    location: string;
    coordinates?: string;
    locationDetails?: {
      address: string;
      coordinates: string;
    };
    budget: string;
    financing: boolean;
    area?: string;
    areaUnit?: string;
    roadWidth?: string;
    roadWidthUnit?: string;
    numberOfRooms?: string;
    numberOfPeople?: string;
    additionalRequirements?: string;
  }
) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_SERVER_USER;
  console.log("Sending property request notification to admin:", adminEmail);
  
  // Format conditional fields
  const area = requestDetails.area && requestDetails.areaUnit 
    ? `${requestDetails.area} ${requestDetails.areaUnit}` 
    : "Not specified";
    
  const roadWidth = requestDetails.roadWidth && requestDetails.roadWidthUnit 
    ? `${requestDetails.roadWidth} ${requestDetails.roadWidthUnit}` 
    : "Not specified";
    
  const rooms = requestDetails.numberOfRooms
    ? `${requestDetails.numberOfRooms} rooms` 
    : "Not specified";

  // Location details
  const locationAddress = requestDetails.location || "Not specified";
  const locationCoordinates = requestDetails.locationDetails?.coordinates || "Not specified";
  
  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_SERVER_USER}>`,
    to: adminEmail,
    subject: 'New Property Request Received',
    text: `
      New Property Request
      
      Name: ${requestDetails.fullName}
      Email: ${requestDetails.email}
      Phone: ${requestDetails.phone}
      Property Type: ${requestDetails.propertyType}
      Location: ${locationAddress}
      Coordinates: ${locationCoordinates}
      Budget: ${requestDetails.budget}
      Financing: ${requestDetails.financing ? "Yes" : "No"}
      Area: ${area}
      Road Width: ${roadWidth}
      Rooms: ${rooms}
      Number of People: ${requestDetails.numberOfPeople || "Not specified"}
      Additional Requirements: ${requestDetails.additionalRequirements || "None provided"}
      
      Please log in to the dashboard to respond to this request.
    `,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #4a6ee0; padding: 20px; text-align: center; color: white;">
          <h2>New Property Request</h2>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9;">
          <p>A new property request has been submitted.</p>
          
          <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <div style="padding: 8px 0; border-bottom: 1px solid #eee;">
              <span style="font-weight: bold; display: inline-block; width: 140px;">Name:</span> ${requestDetails.fullName}
            </div>
            <div style="padding: 8px 0; border-bottom: 1px solid #eee;">
              <span style="font-weight: bold; display: inline-block; width: 140px;">Email:</span> ${requestDetails.email}
            </div>
            <div style="padding: 8px 0; border-bottom: 1px solid #eee;">
              <span style="font-weight: bold; display: inline-block; width: 140px;">Phone:</span> ${requestDetails.phone}
            </div>
            <div style="padding: 8px 0; border-bottom: 1px solid #eee;">
              <span style="font-weight: bold; display: inline-block; width: 140px;">Property Type:</span> ${requestDetails.propertyType}
            </div>
            <div style="padding: 8px 0; border-bottom: 1px solid #eee;">
              <span style="font-weight: bold; display: inline-block; width: 140px;">Location:</span> ${locationAddress}
            </div>
            <div style="padding: 8px 0; border-bottom: 1px solid #eee;">
              <span style="font-weight: bold; display: inline-block; width: 140px;">Coordinates:</span> ${locationCoordinates}
            </div>
            <div style="padding: 8px 0; border-bottom: 1px solid #eee;">
              <span style="font-weight: bold; display: inline-block; width: 140px;">Budget:</span> ${requestDetails.budget}
            </div>
            <div style="padding: 8px 0; border-bottom: 1px solid #eee;">
              <span style="font-weight: bold; display: inline-block; width: 140px;">Financing:</span> ${requestDetails.financing ? "Yes" : "No"}
            </div>
            <div style="padding: 8px 0; border-bottom: 1px solid #eee;">
              <span style="font-weight: bold; display: inline-block; width: 140px;">Area:</span> ${area}
            </div>
            <div style="padding: 8px 0; border-bottom: 1px solid #eee;">
              <span style="font-weight: bold; display: inline-block; width: 140px;">Road Width:</span> ${roadWidth}
            </div>
            <div style="padding: 8px 0; border-bottom: 1px solid #eee;">
              <span style="font-weight: bold; display: inline-block; width: 140px;">Rooms:</span> ${rooms}
            </div>
            <div style="padding: 8px 0;">
              <span style="font-weight: bold; display: inline-block; width: 140px;">Additional:</span> ${requestDetails.additionalRequirements || "None provided"}
            </div>
          </div>
          
          <p>Please log in to the dashboard to respond to this request.</p>
        </div>
        <div style="font-size: 12px; text-align: center; padding: 10px; color: #666;">
          <p>This is an automated message. Please do not reply directly to this email.</p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Admin notification email sent successfully:", info.messageId);
    return { success: true, info };
  } catch (error) {
    console.error('Error sending admin notification email:', error);
    return { success: false, error };
  }
}