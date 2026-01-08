require('dotenv').config();
const axios = require('axios');
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

  // Generate access token
  async generateAccessToken() {
    try {
      const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');
      
      const response = await axios.get(
        'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
        {
          headers: {
            Authorization: `Basic ${auth}`
          }
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);
      
      return this.accessToken;
    } catch (error) {
      console.error('Error generating access token:', error.response?.data || error.message);
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

  // Initiate STK Push (Lipana na M-Pesa)
  async initiateSTKPush(phoneNumber, amount, accountReference, description) {
    try {
      const token = await this.getValidToken();
      const { password, timestamp } = this.generatePassword();

      const payload = {
        BusinessShortCode: this.shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: phoneNumber,
        PartyB: this.shortCode,
        PhoneNumber: phoneNumber,
        CallBackURL: this.callbackURL,
        AccountReference: accountReference || 'MANYANI-RENT',
        TransactionDesc: description || 'Rental Payment'
      };

      const response = await axios.post(
        'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error initiating STK Push:', error.response?.data || error.message);
      throw error;
    }
  }

  // Query STK Push status
  async querySTKPushStatus(checkoutRequestID) {
    try {
      const token = await this.getValidToken();
      const { password, timestamp } = this.generatePassword();

      const payload = {
        BusinessShortCode: this.shortCode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestID
      };

      const response = await axios.post(
        'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error querying STK Push status:', error.response?.data || error.message);
      throw error;
    }
  }

  // C2B (Customer to Business) registration
  async registerC2BUrls() {
    try {
      const token = await this.getValidToken();

      const payload = {
        ShortCode: this.shortCode,
        ResponseType: 'Completed',
        ConfirmationURL: `${process.env.BACKEND_URL}/api/payments/mpesa/confirmation`,
        ValidationURL: `${process.env.BACKEND_URL}/api/payments/mpesa/validation`
      };

      const response = await axios.post(
        'https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error registering C2B URLs:', error.response?.data || error.message);
      throw error;
    }
  }

  // Process callback data
  processCallbackData(callbackData) {
    try {
      const result = {
        transactionId: callbackData.TransID,
        receiptNumber: callbackData.TransID,
        phoneNumber: callbackData.MSISDN,
        amount: callbackData.TransAmount,
        transactionDate: callbackData.TransTime,
        accountReference: callbackData.BillRefNumber,
        merchantRequestId: callbackData.MerchantRequestID,
        checkoutRequestId: callbackData.CheckoutRequestID,
        resultCode: callbackData.ResultCode,
        resultDesc: callbackData.ResultDesc,
        rawData: callbackData
      };

      return result;
    } catch (error) {
      console.error('Error processing callback data:', error);
      throw error;
    }
  }

  // Validate payment (for production use)
  validatePayment(amount, phoneNumber, accountReference) {
    // Add validation logic here
    const errors = [];

    if (!phoneNumber || !phoneNumber.startsWith('254')) {
      errors.push('Invalid phone number format. Use 254XXXXXXXXX');
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
