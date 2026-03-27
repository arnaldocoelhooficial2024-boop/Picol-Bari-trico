import { supabaseAdmin } from './supabaseAdmin.js';
import crypto from 'crypto';

export async function processWebhook({ status, email, nome, produto, created_at, isTest = false }) {
  try {
    console.log(`[PROCESS WEBHOOK] Iniciando processamento para: ${email}`);
    
    // 1. Verifica se o usuário já existe no Supabase Auth
    console.log(`[SUPABASE AUTH] Verificando se o usuário ${email} já existe...`);
    let userId;
    const { data: existingUsers, error: searchError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (searchError) {
      console.error('[SUPABASE AUTH ERRO] Falha ao listar usuários:', JSON.stringify(searchError));
      throw searchError;
    }

    const existingUser = existingUsers.users.find(u => u.email === email);

    if (existingUser) {
      userId = existingUser.id;
      console.log(`[SUPABASE AUTH] Usuário já existente encontrado. ID: ${userId}`);
    } else {
      // 2. Criação automática do usuário no Supabase Auth
      console.log(`[SUPABASE AUTH] Usuário não encontrado. Criando novo usuário para ${email}...`);
      const randomPassword = crypto.randomBytes(16).toString('hex');

      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: randomPassword,
        email_confirm: true,
        user_metadata: { name: nome }
      });

      if (createError) {
        console.error('[SUPABASE AUTH ERRO CRÍTICO] Falha ao criar usuário:', JSON.stringify(createError));
        throw createError;
      }
      
      userId = newUser.user.id;
      console.log(`[SUPABASE AUTH SUCESSO] Novo usuário criado. ID: ${userId}`);
    }

    // 3. Gravação/Atualização dos dados na tabela users_access
    console.log(`[SUPABASE DB] Atualizando tabela users_access para o ID: ${userId}...`);
    const { error: dbError } = await supabaseAdmin
      .from('users_access')
      .upsert({
        id: userId,
        email: email,
        nome: nome,
        status_pagamento: status,
        produto: produto,
        data_pagamento: created_at ? new Date(created_at).toISOString() : new Date().toISOString(),
        liberado: true
      }, { 
        onConflict: 'id'
      });

    if (dbError) {
      console.error('[SUPABASE DB ERRO CRÍTICO] Falha ao inserir/atualizar na tabela users_access:', JSON.stringify(dbError));
      throw dbError;
    }

    console.log('[SUPABASE DB SUCESSO] Dados gravados na tabela users_access com sucesso.');
    
    return { success: true, userId };
  } catch (error) {
    console.error('[PROCESS WEBHOOK EXCEÇÃO]:', error);
    throw error;
  }
}
