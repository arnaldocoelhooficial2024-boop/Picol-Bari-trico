import { processWebhook } from '../lib/processWebhook.js';

export default async function handler(req, res) {
  console.log('\n=== [TESTE WEBHOOK INICIADO] ===');
  console.log(`[REQUEST] Método: ${req.method}`);

  // Aceita GET ou POST
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido. Use GET ou POST.' });
  }

  try {
    // Dados fixos de teste solicitados
    const mockPayload = {
      status: "approved",
      email: "teste@teste.com",
      nome: "Teste Automático",
      produto: "Produto Teste",
      created_at: new Date().toISOString()
    };

    console.log('[PAYLOAD SIMULADO]:\n', JSON.stringify(mockPayload, null, 2));

    // Executa a mesma função do webhook real
    const result = await processWebhook({
      status: mockPayload.status,
      email: mockPayload.email,
      nome: mockPayload.nome,
      produto: mockPayload.produto,
      created_at: mockPayload.created_at,
      isTest: true
    });

    console.log('=== [TESTE WEBHOOK FINALIZADO COM SUCESSO] ===\n');
    return res.status(200).json({ 
      success: true, 
      message: 'Usuário de teste criado com sucesso',
      userId: result.userId
    });

  } catch (error) {
    console.error('\n=== [TESTE WEBHOOK FALHOU COM EXCEÇÃO] ===');
    console.error('[ERRO DETALHADO]:', error);
    return res.status(500).json({ 
      error: 'Erro interno no processamento do webhook de teste.',
      details: error.message 
    });
  }
}
