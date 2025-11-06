import { NextRequest, NextResponse } from 'next/server';

// Simulação de armazenamento (em produção, usar banco de dados)
let pagbankConfig: any = null;

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      config: pagbankConfig
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar configuração' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar campos obrigatórios
    if (!body.api_key || !body.environment) {
      return NextResponse.json(
        { success: false, error: 'API Key e Ambiente são obrigatórios' },
        { status: 400 }
      );
    }

    pagbankConfig = {
      api_key: body.api_key,
      environment: body.environment,
      webhook_url: body.webhook_url || '',
      soft_descriptor: body.soft_descriptor || 'AGRESTE',
      is_facilitador: body.is_facilitador || false,
      sub_merchant_tax_id: body.sub_merchant_tax_id || '',
      sub_merchant_name: body.sub_merchant_name || '',
      sub_merchant_reference_id: body.sub_merchant_reference_id || '',
      sub_merchant_mcc: body.sub_merchant_mcc || '5691'
    };

    return NextResponse.json({
      success: true,
      message: 'Configuração salva com sucesso',
      config: pagbankConfig
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erro ao salvar configuração' },
      { status: 500 }
    );
  }
}
