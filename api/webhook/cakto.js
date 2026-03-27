import { processWebhook } from '../lib/processWebhook.js';

export default async function handler(req, res) {
  console.log('\n=== [WEBHOOK CACTO INICIADO] ===');
  console.log(`[REQUEST] Método: ${req.method} | Headers:`, JSON.stringify(req.headers));

  // 1. Validação do método
  if (req.method !== 'POST') {
    console.warn('[AVISO] Método não permitido:', req.method);
    return res.status(405).json({ error: 'Método não permitido. Use POST.' });
  }

  try {
    // Log the incoming payload for debugging
    console.log('[PAYLOAD COMPLETO RECEBIDO]:\n', JSON.stringify(req.body, null, 2));

    // 2. Extração dos dados do payload da Cakto
    const payload = req.body.data || req.body;
    
    // O status pode vir na raiz do payload ou dentro de um objeto "order"
    const status = payload.status || payload.order?.status;
    const customer = payload.customer;
    const product = payload.product;
    const created_at = payload.created_at || payload.order?.created_at;

    const email = customer?.email;
    const nome = customer?.name || 'Cliente';
    const produto = product?.name || 'Produto Principal';

    console.log(`[DADOS EXTRAÍDOS] Status: "${status}" | Email: "${email}" | Nome: "${nome}" | Produto: "${produto}"`);

    // 3. Verificação do status do pagamento
    if (status !== 'paid' && status !== 'approved') {
      console.log(`[IGNORADO] Status do pagamento não é de aprovação. Status atual: ${status}`);
      return res.status(200).json({ 
        success: true, 
        message: `Evento ignorado. Status atual: ${status}` 
      });
    }

    if (!email) {
      console.error('[ERRO FATAL] Email do cliente não encontrado no payload.');
      return res.status(400).json({ error: 'Email do cliente não encontrado no payload.' });
    }

    // 4. Executa a lógica principal extraída
    await processWebhook({ status, email, nome, produto, created_at });

    // 5. Resposta de sucesso para a Cakto
    console.log('=== [WEBHOOK CACTO FINALIZADO COM SUCESSO] ===\n');
    return res.status(200).json({ 
      success: true, 
      message: 'Usuário processado e acesso liberado com sucesso.' 
    });

  } catch (error) {
    console.error('\n=== [WEBHOOK CACTO FALHOU COM EXCEÇÃO] ===');
    console.error('[EXCEÇÃO CAPTURADA]:', error);
    return res.status(500).json({ 
      error: 'Erro interno no processamento do webhook.',
      details: error.message 
    });
  }
}
