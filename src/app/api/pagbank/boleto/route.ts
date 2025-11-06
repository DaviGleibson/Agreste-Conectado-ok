import { NextRequest, NextResponse } from 'next/server';
import type { PagBankBoletoPayload, PagBankBoletoResponse } from '@/types/pagbank';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { valor, descricao, customer, vencimento_dias = 3 } = body;

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

    // Calcular data de vencimento
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + vencimento_dias);
    const dueDateStr = dueDate.toISOString().split('T')[0];

    // Converter valor para centavos
    const valorCentavos = Math.round(parseFloat(valor) * 100);

    // Criar payload do Boleto
    const payload: PagBankBoletoPayload = {
      reference_id: `BOL-${Date.now()}`,
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
          amount: {
            value: valorCentavos,
            currency: 'BRL'
          },
          payment_method: {
            type: 'BOLETO',
            boleto: {
              due_date: dueDateStr,
              instruction_lines: {
                line_1: 'Pagamento referente a compra na plataforma',
                line_2: 'Não receber após o vencimento'
              },
              holder: {
                name: customer.name || 'Cliente',
                tax_id: customer.tax_id || '12345678909',
                email: customer.email || 'cliente@example.com',
                address: {
                  street: customer.address?.street || 'Rua Exemplo',
                  number: customer.address?.number || '123',
                  postal_code: customer.address?.postal_code || '55000000',
                  locality: customer.address?.locality || 'Centro',
                  city: customer.address?.city || 'Santa Cruz do Capibaribe',
                  region_code: customer.address?.region_code || 'PE',
                  country: 'Brasil'
                }
              }
            }
          }
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

    const data: PagBankBoletoResponse = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: 'Erro ao criar Boleto', details: data },
        { status: response.status }
      );
    }

    // Extrair informações do Boleto
    const charge = data.charges[0];
    const boletoLink = charge.links.find(link => link.media === 'application/pdf')?.href;

    return NextResponse.json({
      success: true,
      order_id: data.id,
      charge_id: charge.id,
      reference_id: data.reference_id,
      barcode: charge.payment_method.boleto.barcode,
      formatted_barcode: charge.payment_method.boleto.formatted_barcode,
      boleto_url: boletoLink,
      due_date: charge.payment_method.boleto.due_date,
      status: charge.status
    });

  } catch (error: any) {
    console.error('Erro ao criar Boleto:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
