import { NextRequest, NextResponse } from 'next/server';
import type { PagBankPixPayload, PagBankPixResponse } from '@/types/pagbank';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { valor, descricao, customer } = body;

    // Buscar configuração do PagBank
    const configResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/pagbank/config`);
    const { config } = await configResponse.json();

    if (!config || !config.api_key) {
      return NextResponse.json(
        { success: false, error: 'PagBank não configurado' },
        { status: 400 }
      );
    }

    const apiKey = config.api_key;
    const baseUrl = config.environment === 'PRODUCTION'
      ? 'https://api.pagseguro.com'
      : 'https://sandbox.api.pagseguro.com';

    // Calcular data de expiração (24 horas)
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 24);
    const expirationISO = expirationDate.toISOString();

    // Converter valor para centavos
    const valorCentavos = Math.round(parseFloat(valor) * 100);

    // Criar payload do PIX
    const payload: PagBankPixPayload = {
      reference_id: `PIX-${Date.now()}`,
      customer: {
        name: customer.name || 'Cliente',
        email: customer.email || 'cliente@example.com',
        tax_id: customer.tax_id || '12345678909'
      },
      items: [
        {
          name: descricao || 'Pagamento',
          quantity: 1,
          unit_amount: valorCentavos
        }
      ],
      qr_codes: [
        {
          amount: { value: valorCentavos },
          expiration_date: expirationISO
        }
      ]
    };

    if (config.webhook_url) {
      payload.notification_urls = [config.webhook_url];
    }

    // Fazer requisição para PagBank
    const response = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data: PagBankPixResponse = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: 'Erro ao criar PIX', details: data },
        { status: response.status }
      );
    }

    // Extrair informações do QR Code
    const qrCode = data.qr_codes[0];
    const qrCodeImage = qrCode.links.find(link => link.media === 'image/png')?.href;

    return NextResponse.json({
      success: true,
      order_id: data.id,
      reference_id: data.reference_id,
      qr_code_text: qrCode.text,
      qr_code_image: qrCodeImage,
      expiration_date: expirationISO
    });

  } catch (error: any) {
    console.error('Erro ao criar PIX:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
