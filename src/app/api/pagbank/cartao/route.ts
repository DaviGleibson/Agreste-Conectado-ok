import { NextRequest, NextResponse } from 'next/server';
import type { PagBankCardPayload, PagBankCardResponse } from '@/types/pagbank';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { valor, descricao, customer, card_data } = body;

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

    // Converter valor para centavos
    const valorCentavos = Math.round(parseFloat(valor) * 100);

    // Criar payload do Cartão
    const payload: PagBankCardPayload = {
      reference_id: `CARD-${Date.now()}`,
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
      charges: [
        {
          reference_id: `CHARGE-${Date.now()}`,
          description: descricao || 'Pagamento',
          amount: {
            value: valorCentavos,
            currency: 'BRL'
          },
          payment_method: {
            type: 'CREDIT_CARD',
            card: {
              encrypted: card_data.encrypted_card,
              security_code: card_data.security_code,
              holder: {
                name: card_data.holder_name || customer.name || 'Cliente',
                tax_id: customer.tax_id || '12345678909'
              }
            },
            installments: card_data.installments || 1,
            capture: true,
            soft_descriptor: config.soft_descriptor || 'AGRESTE'
          }
        }
      ]
    };

    if (config.webhook_url) {
      payload.notification_urls = [config.webhook_url];
    }

    // Se configurado como facilitador de pagamento
    if (config.is_facilitador && config.sub_merchant_tax_id) {
      payload.charges[0] = {
        ...payload.charges[0],
        sub_merchant: {
          tax_id: config.sub_merchant_tax_id,
          name: config.sub_merchant_name,
          reference_id: config.sub_merchant_reference_id,
          mcc: config.sub_merchant_mcc || '5691'
        }
      } as any;
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

    const data: PagBankCardResponse = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: 'Erro ao processar pagamento', details: data },
        { status: response.status }
      );
    }

    const charge = data.charges[0];

    return NextResponse.json({
      success: true,
      order_id: data.id,
      charge_id: charge.id,
      reference_id: data.reference_id,
      status: charge.status,
      amount: charge.amount,
      payment_response: charge.payment_response
    });

  } catch (error: any) {
    console.error('Erro ao processar cartão:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
