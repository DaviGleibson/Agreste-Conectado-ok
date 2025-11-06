# Integração PagBank - Agreste Conectado

## 📋 Visão Geral

Integração completa com PagBank para processar pagamentos via:
- ✅ **PIX** - Pagamento instantâneo via QR Code
- ✅ **Boleto** - Boleto bancário com vencimento configurável
- ✅ **Cartão de Crédito** - Parcelamento em até 12x

## 🔑 Credenciais de Teste

### Usuário Davi (Lojista)
- **Email:** `davi@lojadodavi.com`
- **Senha:** `Davi@2024`

### Usuário Admin
- **Email:** `admin@agresteconectado.com`
- **Senha:** `Admin@2024`

## 🚀 Como Configurar

### 1. Obter Token do PagBank

1. Acesse: https://minhaconta.pagseguro.uol.com.br/preferencias/integracoes.jhtml
2. Gere um novo token de acesso
3. Copie o token gerado

### 2. Configurar no Painel do Lojista

1. Acesse: `/painel-lojista`
2. Clique na aba **"Pagamentos"**
3. Preencha os campos:
   - **Token de Acesso:** Cole o token obtido
   - **Ambiente:** Escolha `SANDBOX` para testes ou `PRODUCTION` para produção
   - **URL do Webhook:** (Opcional) URL para receber notificações
   - **Nome na Fatura:** Nome que aparecerá na fatura do cliente (máx. 13 caracteres)

4. Clique em **"Salvar Configuração"**

### 3. Testar a Integração

Acesse: `/teste-pagbank` para testar os métodos de pagamento

## 📁 Estrutura de Arquivos

```
src/
├── types/
│   └── pagbank.ts                    # Tipos TypeScript do PagBank
├── app/
│   ├── api/
│   │   └── pagbank/
│   │       ├── config/route.ts       # Configuração do PagBank
│   │       ├── pix/route.ts          # Criar pagamento PIX
│   │       ├── boleto/route.ts       # Criar boleto
│   │       ├── cartao/route.ts       # Processar cartão
│   │       └── webhook/route.ts      # Receber notificações
│   ├── painel-lojista/page.tsx       # Painel com aba de configuração
│   └── teste-pagbank/page.tsx        # Página de testes
```

## 🔌 API Endpoints

### 1. Configuração

**GET/POST** `/api/pagbank/config`

Salvar/Buscar configuração do PagBank

```json
{
  "api_key": "seu_token_aqui",
  "environment": "SANDBOX",
  "webhook_url": "https://seusite.com/api/pagbank/webhook",
  "soft_descriptor": "AGRESTE"
}
```

### 2. Criar PIX

**POST** `/api/pagbank/pix`

```json
{
  "valor": "100.00",
  "descricao": "Pagamento de produto",
  "customer": {
    "name": "João Silva",
    "email": "joao@example.com",
    "tax_id": "12345678909"
  }
}
```

**Resposta:**
```json
{
  "success": true,
  "order_id": "ORDE_XXX",
  "qr_code_text": "00020126...",
  "qr_code_image": "https://...",
  "expiration_date": "2024-01-01T23:59:59Z"
}
```

### 3. Criar Boleto

**POST** `/api/pagbank/boleto`

```json
{
  "valor": "100.00",
  "descricao": "Pagamento de produto",
  "vencimento_dias": 3,
  "customer": {
    "name": "João Silva",
    "email": "joao@example.com",
    "tax_id": "12345678909",
    "address": {
      "street": "Rua Exemplo",
      "number": "123",
      "postal_code": "55000000",
      "locality": "Centro",
      "city": "Santa Cruz do Capibaribe",
      "region_code": "PE"
    }
  }
}
```

**Resposta:**
```json
{
  "success": true,
  "order_id": "ORDE_XXX",
  "charge_id": "CHAR_XXX",
  "barcode": "03399...",
  "formatted_barcode": "03399.xxxxx...",
  "boleto_url": "https://...",
  "due_date": "2024-01-04",
  "status": "WAITING"
}
```

### 4. Processar Cartão

**POST** `/api/pagbank/cartao`

```json
{
  "valor": "100.00",
  "descricao": "Pagamento de produto",
  "customer": {
    "name": "João Silva",
    "email": "joao@example.com",
    "tax_id": "12345678909"
  },
  "card_data": {
    "encrypted_card": "ENCRYPTED_CARD_DATA",
    "security_code": "123",
    "holder_name": "JOAO SILVA",
    "installments": 1
  }
}
```

**Resposta:**
```json
{
  "success": true,
  "order_id": "ORDE_XXX",
  "charge_id": "CHAR_XXX",
  "status": "PAID",
  "amount": {
    "value": 10000,
    "currency": "BRL"
  }
}
```

### 5. Webhook

**POST** `/api/pagbank/webhook`

Recebe notificações automáticas do PagBank quando o status do pagamento muda.

Status possíveis:
- `PAID` - Pagamento confirmado
- `DECLINED` - Pagamento recusado
- `CANCELED` - Pagamento cancelado
- `AUTHORIZED` - Pagamento autorizado (cartão)
- `WAITING` - Aguardando pagamento

## 🔐 Segurança

### Criptografia de Cartão

Para processar cartões, você **DEVE** usar o SDK do PagBank no frontend para criptografar os dados do cartão:

```html
<script src="https://assets.pagseguro.com.br/checkout-sdk-js/rc/dist/browser/pagseguro.min.js"></script>
```

```javascript
const card = PagSeguro.encryptCard({
  publicKey: 'SUA_PUBLIC_KEY',
  holder: 'JOAO SILVA',
  number: '4111111111111111',
  expMonth: '12',
  expYear: '2030',
  securityCode: '123'
});

// Enviar card.encryptedCard para o backend
```

### Webhook Security

Configure a URL do webhook no painel do PagBank e valide as requisições usando o IP de origem.

## 🧪 Ambiente de Testes (Sandbox)

### Cartões de Teste

| Bandeira | Número | CVV | Validade | Status |
|----------|--------|-----|----------|--------|
| Visa | 4111 1111 1111 1111 | 123 | 12/2030 | Aprovado |
| Mastercard | 5555 5555 5555 4444 | 123 | 12/2030 | Aprovado |
| Elo | 6362 9700 0000 0005 | 123 | 12/2030 | Aprovado |

### CPF de Teste
- `05047971406` - Aprovado
- `12345678909` - Aprovado

## 📚 Documentação Oficial

- [Primeiros Passos](https://developer.pagbank.com.br/docs/primeiros-passos-pagbank)
- [API Reference](https://developer.pagbank.com.br/reference/criar-pedido)
- [Webhooks](https://developer.pagbank.com.br/docs/webhooks)
- [SDK JavaScript](https://developer.pagbank.com.br/docs/sdk-javascript)

## 🎯 Modo Facilitador

Se você é um marketplace que processa pagamentos para terceiros, ative o **Modo Facilitador** nas configurações e preencha:

- CPF/CNPJ do Sub-Merchant
- Nome do Sub-Merchant
- ID de Referência
- MCC (Código de Categoria)

## 🐛 Troubleshooting

### Erro: "PagBank não configurado"
- Verifique se salvou a configuração no painel
- Confirme que o token está correto

### Erro: "Invalid API Key"
- Token inválido ou expirado
- Verifique se está usando o ambiente correto (SANDBOX/PRODUCTION)

### Webhook não está recebendo notificações
- Verifique se a URL está acessível publicamente
- Configure a URL no painel do PagBank
- Teste com ferramentas como ngrok para desenvolvimento local

## 📞 Suporte

Para dúvidas sobre a API do PagBank:
- Email: atendimento@pagseguro.com
- Telefone: 0800 728 0101
- Chat: https://pagseguro.uol.com.br/atendimento

---

**Desenvolvido para Agreste Conectado** 🌾
