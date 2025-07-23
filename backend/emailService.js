const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
    return nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
};

// 📧 Send verification email
const sendVerificationEmail = async (email, verificationToken) => {
    const transporter = createTransporter();

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    const mailOptions = {
        from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
        to: email,
        subject: '🎓 Verify Your Cownect Account',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1e3a8a, #3b82f6); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">Welcome to Cownect! 🐄</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px;">UC Davis Student Club Discovery Platform</p>
        </div>
        
        <div style="padding: 40px 30px; background: #f8fafc;">
          <h2 style="color: #1e3a8a; margin-bottom: 20px;">Almost There!</h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 25px;">
            Thanks for joining Cownect! To start discovering amazing UC Davis clubs and connecting with your community, please verify your email address.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background: linear-gradient(135deg, #1e3a8a, #3b82f6); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      font-weight: bold; 
                      font-size: 16px;
                      display: inline-block;
                      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);">
              ✅ Verify My Email
            </a>
          </div>
          
          <p style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 25px;">
            This link will expire in 24 hours for security reasons.
          </p>
          
          <div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 20px;">
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 10px;">
              <strong>What's Next?</strong>
            </p>
            <ul style="font-size: 14px; color: #6b7280; padding-left: 20px;">
              <li>Discover 50+ UC Davis student clubs</li>
              <li>Take our niche quiz to find your perfect matches</li>
              <li>Bookmark clubs you're interested in</li>
              <li>Never miss an event or meeting</li>
            </ul>
          </div>
        </div>
        
        <div style="background: #1f2937; padding: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
          <p style="margin: 0;">
            If you didn't create a Cownect account, you can safely ignore this email.
          </p>
          <p style="margin: 5px 0 0 0;">
            © 2025 Cownect - UC Davis Student Club Platform
          </p>
        </div>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('📧 Verification email sent to:', email);
        return { success: true };
    } catch (error) {
        console.error('📧 Email sending error:', error);
        return { success: false, error: error.message };
    }
};

// 🔄 Send password reset email
const sendPasswordResetEmail = async (email, resetToken) => {
    const transporter = createTransporter();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
        from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
        to: email,
        subject: '🔒 Reset Your Cownect Password',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #dc2626, #ef4444); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">Password Reset Request 🔒</h1>
        </div>
        
        <div style="padding: 40px 30px; background: #f8fafc;">
          <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 25px;">
            We received a request to reset your Cownect account password. Click the button below to create a new password.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: linear-gradient(135deg, #dc2626, #ef4444); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      font-weight: bold; 
                      font-size: 16px;
                      display: inline-block;">
              🔄 Reset My Password
            </a>
          </div>
          
          <p style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 25px;">
            This link will expire in 1 hour for security reasons.
          </p>
        </div>
        
        <div style="background: #1f2937; padding: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
          <p style="margin: 0;">
            If you didn't request this password reset, you can safely ignore this email.
          </p>
        </div>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('🔄 Password reset email sent to:', email);
        return { success: true };
    } catch (error) {
        console.error('🔄 Password reset email error:', error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendVerificationEmail,
    sendPasswordResetEmail
};