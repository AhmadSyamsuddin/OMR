const midtransClient = require('midtrans-client');
const { User } = require('../models');

class PaymentController {
  static async generateToken(req, res, next) {
    try {
      const userId = req.user.id;
      const user = await User.findByPk(userId);

      if (!user) {
        throw { name: 'NotFound', message: 'User not found' };
      }

      // Create Snap API instance
      let snap = new midtransClient.Snap({
        isProduction: false, // set to true for production
        serverKey: process.env.MIDTRANS_SERVER_KEY,
        clientKey: process.env.MIDTRANS_CLIENT_KEY
      });

      // Generate unique order ID
      const orderId = `MEMBERSHIP-${userId}-${Date.now()}`;

      let parameter = {
        transaction_details: {
          order_id: orderId,
          gross_amount: 1000 
        },
        credit_card: {
          secure: true
        },
        customer_details: {
          email: user.email,
          first_name: user.fullName
        },
        callbacks: {
          finish: `${process.env.CLIENT_URL || 'http://localhost:5173'}/payment/success`
        }
      };

      const transaction = await snap.createTransaction(parameter);

      res.status(200).json({
        token: transaction.token,
        redirect_url: transaction.redirect_url
      });
    } catch (error) {
      next(error);
    }
  }

  static async handleNotification(req, res, next) {
    try {
      let apiClient = new midtransClient.Snap({
        isProduction: false,
        serverKey: process.env.MIDTRANS_SERVER_KEY,
        clientKey: process.env.MIDTRANS_CLIENT_KEY
      });

      const statusResponse = await apiClient.transaction.notification(req.body);

      const orderId = statusResponse.order_id;
      const transactionStatus = statusResponse.transaction_status;
      const fraudStatus = statusResponse.fraud_status;

      // Extract userId from orderId (format: MEMBERSHIP-{userId}-{timestamp})
      const userId = orderId.split('-')[1];

      console.log(`Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`);

      // Update membership status based on transaction status
      if (transactionStatus === 'capture') {
        if (fraudStatus === 'accept') {
          await User.update(
            { isMembership: true },
            { where: { id: userId } }
          );
        }
      } else if (transactionStatus === 'settlement') {
        await User.update(
          { isMembership: true },
          { where: { id: userId } }
        );
      } else if (transactionStatus === 'cancel' ||
                 transactionStatus === 'deny' ||
                 transactionStatus === 'expire') {
        // Payment failed/cancelled
        console.log(`Payment ${transactionStatus} for order ${orderId}`);
      } else if (transactionStatus === 'pending') {
        console.log(`Waiting for payment for order ${orderId}`);
      }

      res.status(200).json({ message: 'Notification processed' });
    } catch (error) {
      next(error);
    }
  }

  static async checkPaymentStatus(req, res, next) {
    try {
      const { orderId } = req.params;

      let apiClient = new midtransClient.Snap({
        isProduction: false,
        serverKey: process.env.MIDTRANS_SERVER_KEY,
        clientKey: process.env.MIDTRANS_CLIENT_KEY
      });

      const statusResponse = await apiClient.transaction.status(orderId);

      res.status(200).json(statusResponse);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PaymentController;
