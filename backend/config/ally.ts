// config/ally.ts

import { defineConfig } from '@adonisjs/ally'
import env from '#start/env'
import { AzureEntraIdService } from 'ally-azure-entraid'

export default defineConfig({
  entra_id: AzureEntraIdService({
    clientId: env.get('MICROSOFT_CLIENT_ID') || '',
    clientSecret: env.get('MICROSOFT_CLIENT_SECRET') || '',
    callbackUrl: env.get('MICROSOFT_CALLBACK_URL') || 'http://localhost:3333/auth/entra_id/callback',
    tenantDomain: env.get('MICROSOFT_TENANT_ID') || '',
    scopes: ['openid', 'profile', 'email', 'User.Read'],
  }),
})
