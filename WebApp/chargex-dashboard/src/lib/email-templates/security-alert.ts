interface SecurityAlertData {
  firstName: string;
  alertType: 'suspicious_login' | 'password_changed' | 'mfa_disabled' | 'email_changed';
  deviceInfo?: {
    browser: string;
    os: string;
    location: string;
    time: string;
  };
  actionUrl: string;
}

export const securityAlertTemplate = ({
  firstName,
  alertType,
  deviceInfo,
  actionUrl,
}: SecurityAlertData) => {
  const getAlertMessage = () => {
    switch (alertType) {
      case 'suspicious_login':
        return {
          title: '🚨 Suspicious Login Attempt Detected',
          message: `We detected a login attempt to your ChargeX account from an unrecognized device:
            <br/><br/>
            📱 Device: ${deviceInfo?.browser} on ${deviceInfo?.os}<br/>
            📍 Location: ${deviceInfo?.location}<br/>
            🕒 Time: ${deviceInfo?.time}`,
          action: 'Secure Your Account',
        };
      case 'password_changed':
        return {
          title: '🔐 Password Changed Successfully',
          message: 'Your ChargeX account password was recently changed. If you did not make this change, please take immediate action.',
          action: 'Review Account Activity',
        };
      case 'mfa_disabled':
        return {
          title: '⚠️ Two-Factor Authentication Disabled',
          message: 'Two-factor authentication for your ChargeX account was recently disabled. This change reduces your account security.',
          action: 'Enable 2FA',
        };
      case 'email_changed':
        return {
          title: '📧 Email Address Change Requested',
          message: 'A request was made to change the email address associated with your ChargeX account. If this wasn\'t you, secure your account immediately.',
          action: 'Review Changes',
        };
    }
  };

  const alert = getAlertMessage();

  return `
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
    .alert-box {
      background: #fff3e0;
      border-left: 4px solid #f78a1d;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
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
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${process.env.NEXT_PUBLIC_APP_URL}/logo-light.svg" alt="ChargeX Logo" style="width: 200px;">
    </div>
    <div class="content">
      <h1>${alert?.title}</h1>
      <p>Hi ${firstName},</p>
      
      <div class="alert-box">
        ${alert?.message}
      </div>

      <p>If you did not perform this action, someone else might have access to your account. Please take immediate action to secure your account:</p>
      
      <div style="text-align: center;">
        <a href="${actionUrl}" class="button">${alert?.action}</a>
      </div>

      <p style="margin-top: 30px;">Security Tips:</p>
      <ul>
        <li>Use a strong, unique password</li>
        <li>Enable two-factor authentication</li>
        <li>Never share your login credentials</li>
        <li>Regularly review your account activity</li>
      </ul>

      <p><small>If you're unable to click the button above, copy and paste this link into your browser: ${actionUrl}</small></p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} ChargeX. All rights reserved.</p>
      <p>This is an automated security alert. Please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
  `;
};
