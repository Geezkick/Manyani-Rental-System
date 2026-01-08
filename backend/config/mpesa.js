require('dotenv').config();
const crypto = require('crypto');

class MpesaService {
  constructor() {
    this.consumerKey = process.env.MPESA_CONSUMER_KEY;
    this.consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    this.shortCode = process.env.MPESA_SHORTCODE;
    this.passkey = process.env.MPESA_PASSKEY;
    this.callbackURL = `${process.env.FRONTEND_URL}/api/payments/mpesa/callback`;
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  // Generate access token (mock for development)
  async generateAccessToken() {
    try {
      // Mock token generation for development
      this.accessToken = 'mock_access_token_' + Date.now();
      this.tokenExpiry = Date.now() + (3600 * 1000); // 1 hour
      
      return this.accessToken;
    } catch (error) {
      console.error('Error generating access token:', error.message);
      throw error;
    }
  }

  // Get valid access token
  async getValidToken() {
    if (!this.accessToken || Date.now() >= this.tokenExpiry) {
      await this.generateAccessToken();
    }
    return this.accessToken;
  }

  // Generate password for STK Push
  generatePassword() {
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const password = Buffer.from(`${this.shortCode}${this.passkey}${timestamp}`).toString('base64');
    return { password, timestamp };
  }

  // Initiate STK Push (Lipana na M-Pesa) - Mock for development
  async initiateSTKPush(phoneNumber, amount, accountReference, description) {
    try {
      const token = await this.getValidToken();
      const { password, timestamp } = this.generatePassword();

      // Mock response for development
      const mockResponse = {
        MerchantRequestID: 'mock-' + Date.now(),
        CheckoutRequestID: 'mock-checkout-' + Date.now(),
        ResponseCode: '0',
        ResponseDescription: 'Success. Request accepted for processing',
        CustomerMessage: 'Success. Request accepted for processing'
      };

      console.log(`[M-Pesa Mock] STK Push initiated for ${phoneNumber}, Amount: ${amount}, Reference: ${accountReference}`);

      return mockResponse;
    } catch (error) {
      console.error('[M-Pesa Mock] Error initiating STK Push:', error.message);
      throw new Error('Failed to initiate M-Pesa payment (mock mode)');
    }
  }

  // Query STK Push status - Mock for development
  async querySTKPushStatus(checkoutRequestID) {
    try {
      // Mock response
      const mockResponse = {
        ResponseCode: '0',
        ResponseDescription: 'The service request has been accepted successfully',
        MerchantRequestID: 'mock-' + Date.now(),
        CheckoutRequestID: checkoutRequestID,
        ResultCode: '0',
        ResultDesc: 'The service request is processed successfully.'
      };

      console.log(`[M-Pesa Mock] Querying status for: ${checkoutRequestID}`);

      return mockResponse;
    } catch (error) {
      console.error('[M-Pesa Mock] Error querying STK Push status:', error.message);
      throw error;
    }
  }

  // C2B (Customer to Business) registration - Mock
  async registerC2BUrls() {
    try {
      // Mock response
      const mockResponse = {
        ResponseCode: '0',
        ResponseDescription: 'success'
      };

      console.log('[M-Pesa Mock] C2B URLs registered');

      return mockResponse;
    } catch (error) {
      console.error('[M-Pesa Mock] Error registering C2B URLs:', error.message);
      throw error;
    }
  }

  // Process callback data
  processCallbackData(callbackData) {
    try {
      const result = {
        transactionId: callbackData.TransID || 'mock-trans-' + Date.now(),
        receiptNumber: callbackData.TransID || 'mock-receipt-' + Date.now(),
        phoneNumber: callbackData.MSISDN || '254700000000',
        amount: callbackData.TransAmount || 0,
        transactionDate: callbackData.TransTime || new Date().toISOString(),
        accountReference: callbackData.BillRefNumber || 'MANYANI-RENT',
        merchantRequestId: callbackData.MerchantRequestID || 'mock-merchant-' + Date.now(),
        checkoutRequestId: callbackData.CheckoutRequestID || 'mock-checkout-' + Date.now(),
        resultCode: callbackData.ResultCode || '0',
        resultDesc: callbackData.ResultDesc || 'Success',
        rawData: callbackData
      };

      return result;
    } catch (error) {
      console.error('[M-Pesa Mock] Error processing callback data:', error);
      throw error;
    }
  }

  // Validate payment
  validatePayment(amount, phoneNumber, accountReference) {
    const errors = [];

    if (!phoneNumber || !phoneNumber.toString().match(/^(254|0)[0-9]{9}$/)) {
      errors.push('Invalid phone number format. Use 254XXXXXXXXX or 0XXXXXXXXX');
    }

    if (amount < 1 || amount > 150000) {
      errors.push('Amount must be between 1 and 150,000');
    }

    if (!accountReference) {
      errors.push('Account reference is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = new MpesaService();
