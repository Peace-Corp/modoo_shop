const MAILJET_API_KEY = process.env.MAILJET_API_KEY;
const MAILJET_SECRET_KEY = process.env.MAILJET_SECRET_KEY;
const MAILJET_FROM_EMAIL = process.env.MAILJET_FROM_EMAIL || 'noreply@example.com';
const MAILJET_FROM_NAME = process.env.MAILJET_FROM_NAME || 'Modoo Shop';

const MAILJET_API_URL = 'https://api.mailjet.com/v3.1/send';

interface EmailRecipient {
  email: string;
  name?: string;
}

interface SendEmailParams {
  to: EmailRecipient[];
  subject: string;
  htmlContent: string;
  textContent?: string;
}

interface MailjetResponse {
  Messages: Array<{
    Status: string;
    To: Array<{
      Email: string;
      MessageUUID: string;
      MessageID: number;
      MessageHref: string;
    }>;
  }>;
}

export async function sendEmail({
  to,
  subject,
  htmlContent,
  textContent,
}: SendEmailParams): Promise<{ success: boolean; error?: string }> {
  if (!MAILJET_API_KEY || !MAILJET_SECRET_KEY) {
    console.error('Mailjet credentials not configured');
    return { success: false, error: 'Email service not configured' };
  }

  const auth = Buffer.from(`${MAILJET_API_KEY}:${MAILJET_SECRET_KEY}`).toString('base64');

  const payload = {
    Messages: [
      {
        From: {
          Email: MAILJET_FROM_EMAIL,
          Name: MAILJET_FROM_NAME,
        },
        To: to.map((recipient) => ({
          Email: recipient.email,
          Name: recipient.name || recipient.email,
        })),
        Subject: subject,
        TextPart: textContent || '',
        HTMLPart: htmlContent,
      },
    ],
  };

  try {
    const response = await fetch(MAILJET_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(payload),
    });

    const data: MailjetResponse = await response.json();

    if (!response.ok) {
      console.error('Mailjet API error:', data);
      return { success: false, error: 'Failed to send email' };
    }

    const messageStatus = data.Messages?.[0]?.Status;
    if (messageStatus !== 'success') {
      console.error('Mailjet message status:', messageStatus);
      return { success: false, error: `Email status: ${messageStatus}` };
    }

    return { success: true };
  } catch (error) {
    console.error('Mailjet send error:', error);
    return { success: false, error: 'Email sending failed' };
  }
}

interface OrderItem {
  name: string;
  size?: string;
  quantity: number;
  price: number;
}

interface OrderConfirmationParams {
  orderId: string;
  orderName: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  shippingAddress: string;
  orderDate: string;
}

export function generateOrderConfirmationEmail(params: OrderConfirmationParams): {
  subject: string;
  htmlContent: string;
  textContent: string;
} {
  const {
    orderId,
    orderName,
    customerName,
    customerEmail,
    items,
    subtotal,
    shipping,
    total,
    paymentMethod,
    shippingAddress,
    orderDate,
  } = params;

  const subject = `[모두의 굿즈] 주문이 완료되었습니다 - ${orderId}`;

  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
          <div style="font-weight: 500;">${item.name}</div>
          ${item.size ? `<div style="font-size: 12px; color: #6b7280;">사이즈: ${item.size}</div>` : ''}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${item.price.toLocaleString()}원</td>
      </tr>
    `
    )
    .join('');

  const itemsText = items
    .map((item) => `- ${item.name}${item.size ? ` (${item.size})` : ''} x ${item.quantity} - ${item.price.toLocaleString()}원`)
    .join('\n');

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); border-radius: 16px 16px 0 0; padding: 32px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">모두의 굿즈</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">주문 확인</p>
    </div>

    <!-- Main Content -->
    <div style="background: white; padding: 32px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
      <!-- Success Icon -->
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="width: 64px; height: 64px; background-color: #d1fae5; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
      </div>

      <!-- Greeting -->
      <h2 style="color: #111827; font-size: 20px; font-weight: 600; text-align: center; margin: 0 0 8px 0;">
        주문이 완료되었습니다!
      </h2>
      <p style="color: #6b7280; text-align: center; margin: 0 0 32px 0;">
        ${customerName}님, 주문해 주셔서 감사합니다.
      </p>

      <!-- Order Info -->
      <div style="background-color: #f9fafb; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">주문번호</td>
            <td style="padding: 8px 0; color: #111827; font-weight: 600; text-align: right;">${orderId}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">주문일시</td>
            <td style="padding: 8px 0; color: #111827; text-align: right;">${orderDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">결제수단</td>
            <td style="padding: 8px 0; color: #111827; text-align: right;">${paymentMethod}</td>
          </tr>
        </table>
      </div>

      <!-- Order Items -->
      <h3 style="color: #111827; font-size: 16px; font-weight: 600; margin: 0 0 16px 0;">주문 상품</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <thead>
          <tr style="background-color: #f9fafb;">
            <th style="padding: 12px; text-align: left; font-size: 12px; color: #6b7280; font-weight: 500;">상품명</th>
            <th style="padding: 12px; text-align: center; font-size: 12px; color: #6b7280; font-weight: 500;">수량</th>
            <th style="padding: 12px; text-align: right; font-size: 12px; color: #6b7280; font-weight: 500;">금액</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <!-- Price Summary -->
      <div style="border-top: 2px solid #e5e7eb; padding-top: 16px; margin-bottom: 24px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">상품금액</td>
            <td style="padding: 8px 0; text-align: right;">${subtotal.toLocaleString()}원</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;">배송비</td>
            <td style="padding: 8px 0; text-align: right;">${shipping === 0 ? '무료' : `${shipping.toLocaleString()}원`}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #111827; font-size: 18px; font-weight: 700;">총 결제금액</td>
            <td style="padding: 12px 0; text-align: right; color: #4f46e5; font-size: 18px; font-weight: 700;">${total.toLocaleString()}원</td>
          </tr>
        </table>
      </div>

      <!-- Shipping Address -->
      <h3 style="color: #111827; font-size: 16px; font-weight: 600; margin: 0 0 12px 0;">배송지 정보</h3>
      <div style="background-color: #f9fafb; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
        <p style="margin: 0; color: #374151; line-height: 1.6;">${shippingAddress}</p>
      </div>

      <!-- CTA Button -->
      <div style="text-align: center;">
        <a href="https://modooshop.com/orders" style="display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 14px;">
          주문 상세보기
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding: 24px;">
      <p style="color: #9ca3af; font-size: 12px; margin: 0 0 8px 0;">
        본 메일은 발신 전용입니다. 문의사항은 고객센터를 이용해 주세요.
      </p>
      <p style="color: #9ca3af; font-size: 12px; margin: 0;">
        © ${new Date().getFullYear()} 모두의 굿즈. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `;

  const textContent = `
모두의 굿즈 - 주문 확인

${customerName}님, 주문해 주셔서 감사합니다.

주문번호: ${orderId}
주문일시: ${orderDate}
결제수단: ${paymentMethod}

== 주문 상품 ==
${itemsText}

== 결제 내역 ==
상품금액: ${subtotal.toLocaleString()}원
배송비: ${shipping === 0 ? '무료' : `${shipping.toLocaleString()}원`}
총 결제금액: ${total.toLocaleString()}원

== 배송지 정보 ==
${shippingAddress}

© ${new Date().getFullYear()} 모두의 굿즈
  `;

  return { subject, htmlContent, textContent };
}

export async function sendOrderConfirmationEmail(params: OrderConfirmationParams): Promise<{ success: boolean; error?: string }> {
  const { subject, htmlContent, textContent } = generateOrderConfirmationEmail(params);

  return sendEmail({
    to: [{ email: params.customerEmail, name: params.customerName }],
    subject,
    htmlContent,
    textContent,
  });
}
