import nodemailer from "nodemailer";
import config from "../config";
import Logger from "./logger";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

export interface IEmailData {
  api_name: string;
  status_code: number;
  response_time_ms: number;
  records_returned: number;
  description: string;
  severity: string;
}

export const sendHighSeverityAlertEmail = async (data: IEmailData) => {
  try {
    if (!config.email.user || !config.email.pass || !config.email.adminEmail) {
      Logger.warn("Email configuration missing. Skipping email notification.");
      return;
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #d32f2f;">🚨 High Severity Alert Detected</h2>
        <p>A high-severity anomaly has been detected in the API monitoring system.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr style="background-color: #f8f8f8;">
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Field</th>
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Details</th>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><b>API Name</b></td>
            <td style="padding: 10px; border: 1px solid #ddd;">${data.api_name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><b>Status Code</b></td>
            <td style="padding: 10px; border: 1px solid #ddd;">${data.status_code}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><b>Response Time</b></td>
            <td style="padding: 10px; border: 1px solid #ddd;">${data.response_time_ms}ms</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><b>Records Returned</b></td>
            <td style="padding: 10px; border: 1px solid #ddd;">${data.records_returned}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><b>Severity</b></td>
            <td style="padding: 10px; border: 1px solid #ddd;"><span style="color: #d32f2f; font-weight: bold;">${data.severity.toUpperCase()}</span></td>
          </tr>
        </table>
        
        <div style="margin-top: 20px; padding: 15px; background-color: #fff9c4; border-left: 5px solid #fbc02d;">
          <b>AI Analysis:</b><br/>
          ${data.description}
        </div>
        
        <p style="margin-top: 25px; font-size: 12px; color: #777;">
          This is an automated message from the Intelligent API Monitoring System.
        </p>
      </div>
    `;

    const mailOptions = {
      from: config.email.from,
      to: config.email.adminEmail,
      subject: `[${data.severity.toUpperCase()}] Alert for ${data.api_name}`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    Logger.info(`High-severity alert email sent: ${info.messageId}`);
  } catch (error) {
    Logger.error("Error sending high-severity alert email:", error);
  }
};
