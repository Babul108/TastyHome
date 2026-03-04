const chatbotResponses = {
  orderStatus: {
    keywords: ['order status', 'where is my order', 'order update', 'track order', 'order tracking'],
    response:
      'You can track your order in real-time by going to "My Orders" in your profile. Each order shows its current status: Pending → Confirmed → Preparing → Out for Delivery → Delivered.',
  },
  cancelOrder: {
    keywords: ['cancel order', 'cancel my order', 'stop order', 'order cancellation'],
    response:
      'You can cancel an order only if it is in "Pending" or "Confirmed" status. Go to My Orders → Select the order → Tap "Cancel Order". Once the restaurant starts preparing, cancellation is not possible.',
  },
  paymentIssue: {
    keywords: ['payment failed', 'payment issue', 'payment problem', 'money deducted', 'charged'],
    response:
      'If your payment failed but money was deducted, it will be automatically refunded within 5-7 business days. If the issue persists, please raise a support ticket and our team will assist you.',
  },
  refund: {
    keywords: ['refund', 'money back', 'refund status', 'when will i get refund'],
    response:
      'Refunds are processed within 5-7 business days to your original payment method. For COD orders, refunds are issued as wallet credits. You can check refund status in Payment History.',
  },
  deliveryTime: {
    keywords: ['delivery time', 'how long', 'estimated time', 'eta', 'when will arrive'],
    response:
      'Delivery time depends on restaurant preparation time and your distance. Typically it is 30-60 minutes. You can see the estimated time on the restaurant page and track your order live once it is picked up.',
  },
  accountIssue: {
    keywords: ['account', 'login', 'password', 'forgot password', 'cant login', 'account issue'],
    response:
      'For login issues, use "Forgot Password" on the login page. You will receive an OTP on your registered email. If you still face issues, contact support at support@tastyhome.com',
  },
  contactSupport: {
    keywords: ['contact', 'support', 'help', 'talk to agent', 'human', 'customer care'],
    response:
      'You can reach our support team via: Email: support@tastyhome.com | Phone: 1800-TASTY-HOME (Mon-Sun 8AM-10PM) | You can also raise a ticket from the Help section of the app.',
  },
  coupon: {
    keywords: ['coupon', 'promo code', 'discount', 'offer', 'deal'],
    response:
      'You can apply coupon codes at checkout. Active coupons include WELCOME20 (20% off first order), TASTY50 (50% off up to ₹100). Check the Offers section for more deals.',
  },
  default: {
    response:
      'I\'m not sure I understand your question. Could you rephrase it? For urgent issues, please contact our support team at support@tastyhome.com or raise a ticket.',
  },
};

module.exports = chatbotResponses;
