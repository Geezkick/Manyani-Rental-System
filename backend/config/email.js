require('dotenv').config();
const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  // Send email
  async sendEmail(to, subject, html, attachments = []) {
    try {
      const mailOptions = {
        from: `"Manyani Rentals" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
        attachments
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  // Send welcome email
  async sendWelcomeEmail(user) {
    const subject = 'Karibu Manyani Rentals - Welcome to Our Community!';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #8B4513; color: white; padding: 20px; text-align: center;">
          <h1>🏠 Manyani Rentals</h1>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9;">
          <h2>Karibu ${user.firstName}!</h2>
          <p>Welcome to Manyani Rental Management System. We're excited to have you join our community!</p>
          
          <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #8B4513;">Your Account Details:</h3>
            <p><strong>Name:</strong> ${user.firstName} ${user.lastName}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Phone:</strong> ${user.phone}</p>
          </div>
          
          <p>With your Manyani account, you can:</p>
          <ul>
            <li>📅 Book and manage rentals</li>
            <li>💳 Make secure payments via M-Pesa</li>
            <li>🔔 Receive important alerts and reminders</li>
            <li>🏢 Communicate with neighbors</li>
            <li>🔧 Submit maintenance requests</li>
            <li>📱 Access your portal anytime, anywhere</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/dashboard" 
               style="background-color: #8B4513; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Go to Your Dashboard
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            Need help? Contact our support team at ${process.env.SUPPORT_EMAIL} or call ${process.env.SUPPORT_PHONE}
          </p>
        </div>
        <div style="background-color: #2E8B57; color: white; padding: 15px; text-align: center; margin-top: 20px;">
          <p>© ${new Date().getFullYear()} Manyani Rentals. All rights reserved.</p>
          <p style="font-size: 12px;">This is an automated message, please do not reply.</p>
        </div>
      </div>
    `;

    return this.sendEmail(user.email, subject, html);
  }

  // Send payment reminder
  async sendPaymentReminder(payment, user) {
    const subject = `🔔 Payment Reminder - ${payment.description}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #8B4513; color: white; padding: 20px; text-align: center;">
          <h1>💰 Payment Reminder</h1>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9;">
          <h2>Hello ${user.firstName},</h2>
          <p>This is a friendly reminder about your upcoming payment:</p>
          
          <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #8B4513;">
            <h3 style="color: #8B4513;">${payment.description}</h3>
            <p><strong>Amount Due:</strong> KES ${payment.amount.toLocaleString()}</p>
            <p><strong>Due Date:</strong> ${new Date(payment.dueDate).toLocaleDateString()}</p>
            <p><strong>Payment ID:</strong> ${payment.paymentId}</p>
            ${payment.lateFee > 0 ? `<p style="color: #dc3545;"><strong>Late Fee:</strong> KES ${payment.lateFee.toLocaleString()}</p>` : ''}
          </div>
          
          <p>To avoid late fees, please make your payment before the due date.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/payments/make-payment/${payment._id}" 
               style="background-color: #2E8B57; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Pay Now via M-Pesa
            </a>
          </div>
          
          <p>Payment Methods:</p>
          <ul>
            <li><strong>M-Pesa:</strong> Go to Lipa na M-Pesa > Pay Bill > Business No: ${process.env.MPESA_SHORTCODE}</li>
            <li><strong>Account:</strong> ${payment.paymentId}</li>
            <li><strong>Bank Transfer:</strong> Contact support for bank details</li>
          </ul>
          
          <p style="color: #666; font-size: 14px;">
            If you've already made this payment, please ignore this reminder.
            For assistance, contact ${process.env.SUPPORT_EMAIL}
          </p>
        </div>
        <div style="background-color: #8B0000; color: white; padding: 15px; text-align: center; margin-top: 20px;">
          <p>© ${new Date().getFullYear()} Manyani Rentals</p>
        </div>
      </div>
    `;

    return this.sendEmail(user.email, subject, html);
  }

  // Send alert notification
  async sendAlertNotification(alert, user, language = 'en') {
    const title = language === 'sw' ? alert.titleSw || alert.title : alert.title;
    const description = language === 'sw' ? alert.descriptionSw || alert.description : alert.description;
    
    const subject = `🚨 ${title}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #8B4513; color: white; padding: 20px; text-align: center;">
          <h1>🔔 Manyani Alert</h1>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9;">
          <h2>${title}</h2>
          <p>${description}</p>
          
          <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #dc3545;">
            <p><strong>Type:</strong> ${alert.type.toUpperCase()}</p>
            <p><strong>Priority:</strong> ${alert.priority.toUpperCase()}</p>
            ${alert.expiresAt ? `<p><strong>Expires:</strong> ${new Date(alert.expiresAt).toLocaleString()}</p>` : ''}
          </div>
          
          ${alert.actions && alert.actions.length > 0 ? `
            <p>Required Actions:</p>
            <div style="text-align: center; margin: 20px 0;">
              ${alert.actions.map(action => `
                <a href="${process.env.FRONTEND_URL}${action.url}" 
                   style="background-color: #2E8B57; color: white; padding: 10px 20px; 
                          text-decoration: none; border-radius: 5px; display: inline-block; margin: 5px;">
                  ${action.label}
                </a>
              `).join('')}
            </div>
          ` : ''}
          
          <p style="color: #666; font-size: 14px;">
            This is an important alert from Manyani Rentals. 
            Please take necessary action.
          </p>
        </div>
        <div style="background-color: #8B0000; color: white; padding: 15px; text-align: center; margin-top: 20px;">
          <p>© ${new Date().getFullYear()} Manyani Rentals Security System</p>
        </div>
      </div>
    `;

    return this.sendEmail(user.email, subject, html);
  }

  // Send vacate notice confirmation
  async sendVacateNotice(booking, user) {
    const subject = '🏠 Vacate Notice Submitted';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #8B4513; color: white; padding: 20px; text-align: center;">
          <h1>Vacate Notice</h1>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9;">
          <h2>Hello ${user.firstName},</h2>
          <p>Your vacate notice has been received and is under review.</p>
          
          <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #8B4513;">Notice Details:</h3>
            <p><strong>Booking Number:</strong> ${booking.bookingNumber}</p>
            <p><strong>Intended Vacate Date:</strong> ${new Date(booking.vacateNotice.intendedVacateDate).toLocaleDateString()}</p>
            <p><strong>Reason:</strong> ${booking.vacateNotice.reason}</p>
            <p><strong>Notice Submitted:</strong> ${new Date(booking.vacateNotice.noticeDate).toLocaleDateString()}</p>
          </div>
          
          <h3>Next Steps:</h3>
          <ol>
            <li>Our team will review your notice within 48 hours</li>
            <li>We will contact you to schedule a property inspection</li>
            <li>You'll receive a final statement for any outstanding balances</li>
            <li>Security deposit refund will be processed after inspection</li>
          </ol>
          
          <div style="background-color: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="color: #856404;">⚠️ Important Information:</h4>
            <ul>
              <li>Please ensure the property is clean and in good condition</li>
              <li>All keys and access cards must be returned</li>
              <li>All utility bills must be settled</li>
              <li>Remove all personal belongings by the vacate date</li>
            </ul>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            For questions about the vacating process, contact our support team.
          </p>
        </div>
        <div style="background-color: #2E8B57; color: white; padding: 15px; text-align: center; margin-top: 20px;">
          <p>© ${new Date().getFullYear()} Manyani Rentals</p>
        </div>
      </div>
    `;

    return this.sendEmail(user.email, subject, html);
  }
}

module.exports = new EmailService();
