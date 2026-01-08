require('dotenv').config();

class EmailService {
  constructor() {
    // Mock email service for development
    this.transporter = {
      sendMail: async (mailOptions) => {
        console.log('[Email Mock] Sending email:', {
          to: mailOptions.to,
          subject: mailOptions.subject
        });
        return { messageId: 'mock-' + Date.now() };
      }
    };
  }

  // Send email
  async sendEmail(to, subject, html, attachments = []) {
    try {
      console.log(`[Email Mock] Email to ${to}: ${subject}`);
      console.log(`[Email Mock] Content preview: ${html.substring(0, 100)}...`);
      
      return { messageId: 'mock-' + Date.now() };
    } catch (error) {
      console.error('[Email Mock] Error sending email:', error.message);
      throw error;
    }
  }

  // Send welcome email
  async sendWelcomeEmail(user) {
    const subject = 'Karibu Manyani Rentals - Welcome to Our Community!';
    console.log(`[Email Mock] Welcome email sent to ${user.email}: ${subject}`);
    return { messageId: 'mock-welcome-' + Date.now() };
  }

  // Send payment reminder
  async sendPaymentReminder(payment, user) {
    const subject = `🔔 Payment Reminder - ${payment.description}`;
    console.log(`[Email Mock] Payment reminder sent to ${user.email}: ${subject}, Amount: ${payment.amount}`);
    return { messageId: 'mock-reminder-' + Date.now() };
  }

  // Send alert notification
  async sendAlertNotification(alert, user, language = 'en') {
    const title = language === 'sw' ? alert.titleSw || alert.title : alert.title;
    const subject = `🚨 ${title}`;
    console.log(`[Email Mock] Alert sent to ${user.email}: ${subject}, Type: ${alert.type}`);
    return { messageId: 'mock-alert-' + Date.now() };
  }

  // Send vacate notice confirmation
  async sendVacateNotice(booking, user) {
    const subject = '🏠 Vacate Notice Submitted';
    console.log(`[Email Mock] Vacate notice sent to ${user.email}: ${subject}, Booking: ${booking.bookingNumber}`);
    return { messageId: 'mock-vacate-' + Date.now() };
  }
}

module.exports = new EmailService();
