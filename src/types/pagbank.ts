export interface PagBankConfig {
  api_key: string;
  environment: 'SANDBOX' | 'PRODUCTION';
  webhook_url?: string;
  soft_descriptor?: string;
  is_facilitador?: boolean;
  sub_merchant_tax_id?: string;
  sub_merchant_name?: string;
  sub_merchant_reference_id?: string;
  sub_merchant_mcc?: string;
}

export interface PagBankCustomer {
  name: string;
  email: string;
  tax_id: string;
}

export interface PagBankItem {
  name: string;
  quantity: number;
  unit_amount: number;
}

export interface PagBankPixPayload {
  reference_id: string;
  customer: PagBankCustomer;
  items: PagBankItem[];
  qr_codes: Array<{
    amount: { value: number };
    expiration_date: string;
  }>;
  notification_urls?: string[];
}

export interface PagBankBoletoPayload {
  reference_id: string;
  customer: PagBankCustomer;
  items: PagBankItem[];
  charges: Array<{
    amount: {
      value: number;
      currency: string;
    };
    payment_method: {
      type: 'BOLETO';
      boleto: {
        due_date: string;
        instruction_lines: {
          line_1: string;
          line_2: string;
        };
        holder: {
          name: string;
          tax_id: string;
          email: string;
          address: {
            street: string;
            number: string;
            postal_code: string;
            locality: string;
            city: string;
            region_code: string;
            country: string;
          };
        };
      };
    };
  }>;
  notification_urls?: string[];
}

export interface PagBankCardPayload {
  reference_id: string;
  customer: PagBankCustomer;
  items: PagBankItem[];
  charges: Array<{
    reference_id: string;
    description: string;
    amount: {
      value: number;
      currency: string;
    };
    payment_method: {
      type: 'CREDIT_CARD';
      card: {
        encrypted: string;
        security_code: string;
        holder: {
          name: string;
          tax_id: string;
        };
      };
      installments: number;
      capture: boolean;
      soft_descriptor?: string;
    };
  }>;
  notification_urls?: string[];
}

export interface PagBankPixResponse {
  id: string;
  reference_id: string;
  qr_codes: Array<{
    id: string;
    text: string;
    links: Array<{
      rel: string;
      href: string;
      media: string;
      type: string;
    }>;
  }>;
}

export interface PagBankBoletoResponse {
  id: string;
  reference_id: string;
  charges: Array<{
    id: string;
    reference_id: string;
    status: string;
    payment_method: {
      type: string;
      boleto: {
        barcode: string;
        formatted_barcode: string;
        due_date: string;
      };
    };
    links: Array<{
      rel: string;
      href: string;
      media: string;
      type: string;
    }>;
  }>;
}

export interface PagBankCardResponse {
  id: string;
  reference_id: string;
  charges: Array<{
    id: string;
    reference_id: string;
    status: string;
    amount: {
      value: number;
      currency: string;
    };
    payment_response: {
      code: string;
      message: string;
    };
  }>;
}
