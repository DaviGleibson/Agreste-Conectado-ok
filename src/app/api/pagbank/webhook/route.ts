import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Webhook PagBank recebido:', JSON.stringify(body, null, 2));

    // Extrair informações da notificação
    const { id, reference_id, charges } = body;

    if (charges && charges.length > 0) {
      const charge = charges[0];
      const status = charge.status;
      const chargeId = charge.id;

      console.log(`Pagamento ${chargeId} - Status: ${status}`);

      // Aqui você pode atualizar o status no banco de dados
      // Exemplo:
      // - PAID: Pagamento confirmado
      // - DECLINED: Pagamento recusado
      // - CANCELED: Pagamento cancelado
      // - AUTHORIZED: Pagamento autorizado (cartão)
      
      // TODO: Implementar lógica de atualização no banco de dados
      // await updatePaymentStatus(chargeId, status);
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook processado com sucesso'
    });

  } catch (error: any) {
    console.error('Erro ao processar webhook:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Webhook PagBank ativo',
    timestamp: new Date().toISOString()
  });
}
