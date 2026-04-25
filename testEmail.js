import { sendEmail } from './utils/emailService.js';
import dotenv from 'dotenv';

dotenv.config();

async function test() {
  console.log('Testing SMTP connection...');
  console.log('Host:', process.env.SMTP_HOST);
  console.log('Port:', process.env.SMTP_PORT);
  console.log('User:', process.env.SMTP_USER);
  
  if (process.env.SMTP_USER === 'your_smtp_username') {
    console.log('⚠️ Please update the SMTP credentials in your .env file to actually send an email.');
    return;
  }

  try {
    const result = await sendEmail({
      to: 'anshuchavan4@gmail.com', // Sending to yourself to test
      subject: 'Test Email from ProBuild',
      text: 'This is a test email to verify SMTP configuration.',
      html: '<h1>Test Email</h1><p>This is a test email to verify SMTP configuration.</p>'
    });
    console.log('Result:', result);
  } catch (error) {
    console.error('Error during test:', error);
  }
}

test();
