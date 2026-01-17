const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

interface OrderItem {
  name: string;
  size?: string;
  quantity: number;
  price: number;
}

interface OrderNotificationParams {
  orderId: string;
  orderName: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  paymentMethod: string;
  shippingAddress: string;
}

interface DiscordEmbed {
  title: string;
  description?: string;
  color: number;
  fields: Array<{
    name: string;
    value: string;
    inline?: boolean;
  }>;
  timestamp: string;
  footer?: {
    text: string;
  };
}

interface DiscordWebhookPayload {
  content?: string;
  embeds: DiscordEmbed[];
}

export async function sendOrderNotification(
  params: OrderNotificationParams
): Promise<{ success: boolean; error?: string }> {
  if (!DISCORD_WEBHOOK_URL) {
    console.warn('Discord webhook URL not configured');
    return { success: false, error: 'Discord webhook not configured' };
  }

  const { orderId, orderName, customerName, customerEmail, items, total, paymentMethod, shippingAddress } = params;

  const itemsList = items
    .map((item) => `• ${item.name}${item.size ? ` (${item.size})` : ''} x${item.quantity} - ₩${item.price.toLocaleString()}`)
    .join('\n');

  const embed: DiscordEmbed = {
    title: '🎉 새로운 주문이 들어왔습니다!',
    color: 0x4f46e5, // Indigo color
    fields: [
      {
        name: '📦 주문번호',
        value: orderId,
        inline: true,
      },
      {
        name: '💳 결제수단',
        value: paymentMethod,
        inline: true,
      },
      {
        name: '💰 총 결제금액',
        value: `₩${total.toLocaleString()}`,
        inline: true,
      },
      {
        name: '👤 고객 정보',
        value: `${customerName}\n${customerEmail}`,
        inline: false,
      },
      {
        name: '🛍️ 주문 상품',
        value: itemsList || '상품 정보 없음',
        inline: false,
      },
      {
        name: '📍 배송지',
        value: shippingAddress || '배송지 정보 없음',
        inline: false,
      },
    ],
    timestamp: new Date().toISOString(),
    footer: {
      text: '모두의 굿즈',
    },
  };

  const payload: DiscordWebhookPayload = {
    embeds: [embed],
  };

  try {
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Discord webhook error:', errorText);
      return { success: false, error: 'Failed to send Discord notification' };
    }

    return { success: true };
  } catch (error) {
    console.error('Discord webhook error:', error);
    return { success: false, error: 'Discord notification failed' };
  }
}
