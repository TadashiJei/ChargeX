export const getRegistrationEmailTemplate = (firstName: string, verificationUrl: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { 
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(45deg, #f78a1d, #f7621d);
      padding: 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .content {
      background: #fff;
      padding: 30px;
      border-radius: 0 0 8px 8px;
      border: 1px solid #eee;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background: #f78a1d;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      margin: 20px 0;
      font-weight: bold;
      text-align: center;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      color: #666;
      font-size: 14px;
    }
    .highlight {
      color: #f78a1d;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${process.env.NEXT_PUBLIC_APP_URL}/logo-light.svg" alt="ChargeX Logo" style="width: 200px;">
    </div>
    <div class="content">
      <h1>Welcome to ChargeX, ${firstName}! 🎉</h1>
      <p>Thank you for joining our revolutionary platform for decentralized battery leasing and energy trading!</p>
      <p>To start using ChargeX and explore our features, please verify your email address:</p>
      <div style="text-align: center;">
        <a href="${verificationUrl}" class="button">Verify Email Address</a>
      </div>
      <p>With ChargeX, you'll have access to:</p>
      <ul>
        <li>Smart contract-secured battery leasing</li>
        <li>Peer-to-peer energy trading</li>
        <li>Real-time analytics and insights</li>
        <li>Blockchain-powered security</li>
      </ul>
      <p><small>This verification link will expire in 24 hours for security purposes.</small></p>
      <p><small>If you didn't create an account with ChargeX, please ignore this email.</small></p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} ChargeX. All rights reserved.</p>
      <p>Powering the future of energy distribution</p>
    </div>
  </div>
</body>
</html>
`;

export const getLoginNotificationTemplate = (firstName: string, location: string, device: string, time: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { 
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(45deg, #f78a1d, #f7621d);
      padding: 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .content {
      background: #fff;
      padding: 30px;
      border-radius: 0 0 8px 8px;
      border: 1px solid #eee;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .info-box {
      background: #f8f9fa;
      border: 1px solid #eee;
      border-radius: 6px;
      padding: 15px;
      margin: 20px 0;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background: #f78a1d;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      margin: 20px 0;
      font-weight: bold;
      text-align: center;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      color: #666;
      font-size: 14px;
    }
    .alert {
      color: #721c24;
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      padding: 10px;
      border-radius: 4px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${process.env.NEXT_PUBLIC_APP_URL}/logo-light.svg" alt="ChargeX Logo" style="width: 200px;">
    </div>
    <div class="content">
      <h1>New Login to Your Account</h1>
      <p>Hi ${firstName},</p>
      <p>We detected a new login to your ChargeX account. Here are the details:</p>
      
      <div class="info-box">
        <p><strong>📍 Location:</strong> ${location}</p>
        <p><strong>📱 Device:</strong> ${device}</p>
        <p><strong>🕒 Time:</strong> ${time}</p>
      </div>

      <p>If this was you, you can safely ignore this email.</p>
      
      <div class="alert">
        <strong>⚠️ Wasn't you?</strong> Take immediate action to secure your account:
      </div>

      <div style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/account/security" class="button">Secure Your Account</a>
      </div>

      <p><small>For additional security, you can enable two-factor authentication in your account settings.</small></p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} ChargeX. All rights reserved.</p>
      <p>This is an automated message, please do not reply.</p>
    </div>
  </div>
</body>
</html>
`;
