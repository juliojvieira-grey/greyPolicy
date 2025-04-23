import axios from 'axios'

interface GraphGroup {
  id: string
  displayName: string
}

interface GraphUser {
  displayName: string
  userPrincipalName: string
}

export default class MsGraphService {
  private token: string | null = null
  private tokenExpiresAt: number | null = null

  private async authenticate(): Promise<string> {
    const now = Math.floor(Date.now() / 1000)

    if (this.token && this.tokenExpiresAt && now < this.tokenExpiresAt - 60) {
      return this.token
    }

    try {
      const res = await axios.post(
        `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID}/oauth2/v2.0/token`,
        new URLSearchParams({
          client_id: process.env.MICROSOFT_CLIENT_ID!,
          client_secret: process.env.MICROSOFT_CLIENT_SECRET!,
          scope: 'https://graph.microsoft.com/.default',
          grant_type: 'client_credentials',
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      )

      const { access_token, expires_in } = res.data
      if (!access_token) {
        throw new Error('Token inválido após autenticação')
      }

      this.token = access_token
      this.tokenExpiresAt = now + expires_in
      return access_token

    } catch (error: any) {
      const detail = error.response?.data || error.message
      console.error('❌ Erro ao autenticar com Graph API:', detail)
      throw new Error('Falha na autenticação com a Microsoft Graph API')
    }
  }

  private async get<T = any>(url: string): Promise<T> {
    const token = await this.authenticate()
    try {
      const res = await axios.get<T>(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return res.data
    } catch (error: any) {
      console.error(`❌ Erro em requisição GET ${url}:`, error.response?.data || error.message)
      throw new Error('Erro ao consultar Microsoft Graph API')
    }
  }

  public async listSecurityGroups(): Promise<GraphGroup[]> {
    const data = await this.get<{ value: GraphGroup[] }>(
      'https://graph.microsoft.com/v1.0/groups?$filter=securityEnabled eq true&$select=id,displayName'
    )
    return data.value
  }

  public async getGroupById(groupId: string): Promise<GraphGroup> {
    return this.get<GraphGroup>(
      `https://graph.microsoft.com/v1.0/groups/${groupId}?$select=id,displayName`
    )
  }

  public async listGroupUsers(groupId: string): Promise<GraphUser[]> {
    const data = await this.get<{ value: any[] }>(
      `https://graph.microsoft.com/v1.0/groups/${groupId}/members`
    )

    return data.value
      .filter((member) => member.userPrincipalName)
      .map((member) => ({
        displayName: member.displayName,
        userPrincipalName: member.userPrincipalName,
      }))
  }

  public async sendEmail(to: string, subject: string, html: string): Promise<void> {
    const token = await this.authenticate()
    const sender = process.env.MICROSOFT_SENDER

    if (!sender) {
      throw new Error('MICROSOFT_SENDER não configurado no .env')
    }

    try {
      await axios.post(
        `https://graph.microsoft.com/v1.0/users/${sender}/sendMail`,
        {
          message: {
            subject,
            body: {
              contentType: 'HTML',
              content: html,
            },
            toRecipients: [{ emailAddress: { address: to } }],
          },
          saveToSentItems: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
    } catch (error: any) {
      console.error('❌ Erro ao enviar e-mail com Graph API:', error.response?.data || error.message)
      throw new Error('Erro ao enviar e-mail com Microsoft Graph API')
    }
  }
}
