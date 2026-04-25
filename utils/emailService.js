import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send an email
 * @param {Object} options - Email options (to, subject, text, html)
 */
export const sendEmail = async (options) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"Pathan Hardware" <${process.env.SMTP_USER}>`, // sender address
      to: options.to, // list of receivers
      subject: options.subject, // Subject line
      text: options.text, // plain text body
      html: options.html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email: ', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send a professional invoice email
 * @param {Object} bill - The bill object
 * @param {Object} customer - The customer object
 */
export const sendInvoiceEmail = async (bill, customer) => {
  if (!customer.email) {
    throw new Error('Customer does not have an email address provided.');
  }

  const invoiceUrl = `${process.env.FRONTEND_URL}/print/${bill._id}`; // URL to the invoice, if needed

  const subject = `Invoice #${bill.billNumber} from Pathan Hardware`;

  let itemsHtml = '';
  bill.items.forEach(item => {
    itemsHtml += `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product?.name || 'Item'}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">₹${item.unitPrice.toLocaleString('en-IN')}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.totalPrice.toLocaleString('en-IN')}</td>
      </tr>
    `;
  });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="background-color: #1e3a8a; padding: 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0;">Pathan Hardware</h1>
      </div>
      
      <div style="padding: 20px; border: 1px solid #e2e8f0; border-top: none;">
        <h2>Hello ${customer.name},</h2>
        <p>Thank you for your business! Here are the details of your recent invoice.</p>
        
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Invoice Number:</strong> ${bill.billNumber}</p>
          <p><strong>Date:</strong> ${new Date(bill.createdAt).toLocaleDateString('en-IN')}</p>
          <p><strong>Amount Due:</strong> ₹${bill.dueAmount.toLocaleString('en-IN')}</p>
          <p><strong>Status:</strong> ${bill.paymentStatus}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="background-color: #f1f5f9;">
              <th style="padding: 10px; text-align: left; border-bottom: 2px solid #cbd5e1;">Item</th>
              <th style="padding: 10px; text-align: left; border-bottom: 2px solid #cbd5e1;">Qty</th>
              <th style="padding: 10px; text-align: left; border-bottom: 2px solid #cbd5e1;">Price</th>
              <th style="padding: 10px; text-align: right; border-bottom: 2px solid #cbd5e1;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">Subtotal:</td>
              <td style="padding: 10px; text-align: right;">₹${bill.subtotal?.toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">Discount:</td>
              <td style="padding: 10px; text-align: right; color: red;">-₹${bill.discount?.toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">Tax:</td>
              <td style="padding: 10px; text-align: right;">₹${bill.tax?.toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold; color: #1e3a8a; font-size: 1.2em;">Total Amount:</td>
              <td style="padding: 10px; text-align: right; font-weight: bold; color: #1e3a8a; font-size: 1.2em;">₹${bill.totalAmount.toLocaleString('en-IN')}</td>
            </tr>
          </tfoot>
        </table>

        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p>If you have any questions about this invoice, please contact us at support@pathanhardware.com or +91 9156342893.</p>
        </div>
      </div>
      
      <div style="text-align: center; font-size: 12px; color: #64748b; margin-top: 20px;">
        <p>&copy; ${new Date().getFullYear()} Pathan Hardware. All rights reserved.</p>
      </div>
    </div>
  `;

  const text = `Hello ${customer.name},\n\nYour invoice #${bill.billNumber} for ₹${bill.totalAmount.toLocaleString('en-IN')} is ${bill.paymentStatus}.\n\nThank you for your business!\n\nPathan Hardware`;

  return sendEmail({
    to: customer.email,
    subject,
    text,
    html,
  });
};
