import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendWelcomeEmail(clientEmail, clientName, planType, ownerName) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: clientEmail,
    subject: `🎉 Welcome to the Gym!`,
    html: `
      <h2>Welcome, ${clientName}! 💪</h2>
      <p>We're thrilled to have you join our gym community!</p>
      <p><strong>Your Plan:</strong> ${planType}</p>
      <p>Here's what you can look forward to:</p>
      <ul>
        <li>State-of-the-art equipment and facilities</li>
        <li>Professional trainers and coaching</li>
        <li>A supportive community of fitness enthusiasts</li>
        <li>Flexible scheduling to fit your lifestyle</li>
      </ul>
      <p>If you have any questions or need assistance, don't hesitate to reach out to us!</p>
      <br/>
      <p>Best regards,<br/><strong>${ownerName}</strong><br/>Gym Owner</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to: ${clientEmail}`);
    return true;
  } catch (error) {
    console.error('❌ Welcome email error:', error.message);
    return false;
  }
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('en-GB', options).replace(/ /g, ' ');
}

export async function sendExpirationEmail(clientEmail, clientName, daysLeft, ownerEmail, ownerName, subscriptionStart, subscriptionEnd) {
  const clientMailOptions = {
    from: process.env.EMAIL_USER,
    to: clientEmail,
    subject: `⏰ Your Gym Membership Expires Tomorrow!`,
    html: `
      <h2>Hello ${clientName},</h2>
      <p>Your gym membership will expire <strong>${daysLeft > 0 ? 'in ' + daysLeft + ' day(s)' : 'tomorrow'}</strong>.</p>
      <p><strong>Membership Period:</strong> ${formatDate(subscriptionStart)} to ${formatDate(subscriptionEnd)}</p>
      <p>Please renew your subscription to continue enjoying our facilities.</p>
      <br/>
      <p>Best regards,<br/>${ownerName}</p>
    `,
  };

  const ownerMailOptions = {
    from: process.env.EMAIL_USER,
    to: ownerEmail,
    subject: `📢 Member Alert: ${clientName}'s Membership Expires Tomorrow`,
    html: `
      <h2>Member Expiration Alert</h2>
      <p><strong>${clientName}</strong> (${clientEmail}) has a gym membership expiring <strong>${daysLeft > 0 ? 'in ' + daysLeft + ' day(s)' : 'tomorrow'}</strong>.</p>
      <p><strong>Membership Period:</strong> ${formatDate(subscriptionStart)} to ${formatDate(subscriptionEnd)}</p>
      <p>Consider reaching out to remind them to renew.</p>
      <br/>
      <p>FitDesk</p>
    `,
  };

  try {
    await transporter.sendMail(clientMailOptions);
    console.log(`Email sent to client: ${clientEmail}`);

    await transporter.sendMail(ownerMailOptions);
    console.log(`Alert email sent to owner: ${ownerEmail}`);

    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}

export async function sendUpdateEmail(client, ownerEmail, ownerName) {
  const clientMailOptions = {
    from: process.env.EMAIL_USER,
    to: client.email,
    subject: `Your Gym Membership Details Have Been Updated`,
    html: `
      <h2>Dear ${client.name},</h2>
      <p>Your gym membership has been updated. Here are your current details:</p>
      <p>
        <strong>Plan:</strong> ${client.subscription_type}<br/>
        <strong>Start Date:</strong> ${formatDate(client.subscription_start)}<br/>
        <strong>End Date:</strong> ${formatDate(client.subscription_end)}
      </p>
      <p>If you have any questions, contact us at ${ownerEmail}.</p>
      <br/>
      <p>Best regards,<br/><strong>${ownerName}</strong></p>
    `,
  };

  const ownerMailOptions = {
    from: process.env.EMAIL_USER,
    to: ownerEmail,
    subject: `Member Details Updated - ${client.name}`,
    html: `
      <h2>Member Details Updated</h2>
      <p>A member's subscription has been updated.</p>
      <p>
        <strong>Member:</strong> ${client.name}<br/>
        <strong>Email:</strong> ${client.email}<br/>
        <strong>Phone:</strong> ${client.phone}<br/>
        <strong>Plan:</strong> ${client.subscription_type}<br/>
        <strong>Start Date:</strong> ${formatDate(client.subscription_start)}<br/>
        <strong>End Date:</strong> ${formatDate(client.subscription_end)}
      </p>
      <p>Please review if needed.</p>
    `,
  };

  try {
    await transporter.sendMail(clientMailOptions);
    console.log(`✅ Update email sent to client: ${client.email}`);

    await transporter.sendMail(ownerMailOptions);
    console.log(`✅ Update alert email sent to owner: ${ownerEmail}`);

    return true;
  } catch (error) {
    console.error('❌ Update email error:', error);
    return false;
  }
}

export async function sendRenewalEmail(client, newEndDate, ownerEmail, ownerName) {
  const today = new Date();
  const todayFormatted = formatDate(today.toISOString().split('T')[0]);
  const newEndDateFormatted = formatDate(newEndDate);

  const clientMailOptions = {
    from: process.env.EMAIL_USER,
    to: client.email,
    subject: `Your Gym Membership Has Been Renewed Successfully`,
    html: `
      <h2>Dear ${client.name},</h2>
      <p>Great news! Your gym membership has been renewed successfully.</p>
      <p>
        <strong>Plan:</strong> ${client.subscription_type}<br/>
        <strong>New Start Date:</strong> ${todayFormatted}<br/>
        <strong>New End Date:</strong> ${newEndDateFormatted}
      </p>
      <p>Keep up the great work and stay fit!</p>
      <br/>
      <p>Best regards,<br/><strong>${ownerName}</strong></p>
    `,
  };

  const ownerMailOptions = {
    from: process.env.EMAIL_USER,
    to: ownerEmail,
    subject: `Membership Renewed - ${client.name}`,
    html: `
      <h2>Membership Renewed</h2>
      <p>A membership has been successfully renewed.</p>
      <p>
        <strong>Member:</strong> ${client.name}<br/>
        <strong>Email:</strong> ${client.email}<br/>
        <strong>Phone:</strong> ${client.phone}<br/>
        <strong>Plan:</strong> ${client.subscription_type}<br/>
        <strong>New Start Date:</strong> ${todayFormatted}<br/>
        <strong>New End Date:</strong> ${newEndDateFormatted}
      </p>
    `,
  };

  try {
    await transporter.sendMail(clientMailOptions);
    console.log(`✅ Renewal email sent to client: ${client.email}`);

    await transporter.sendMail(ownerMailOptions);
    console.log(`✅ Renewal alert email sent to owner: ${ownerEmail}`);

    return true;
  } catch (error) {
    console.error('❌ Renewal email error:', error);
    return false;
  }
}
