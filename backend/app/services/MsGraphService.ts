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
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      )

      this.token = res.data.access_token
      this.tokenExpiresAt = now + res.data.expires_in
      if (!this.token) {
        throw new Error('Token inválido após autenticação')
      }
      return this.token
      
    } catch (error: any) {
      console.error('Erro ao autenticar com Graph API:', error.response?.data || error.message)
      throw new Error('Falha na autenticação com a Microsoft Graph API')
    }
  }

  private async get<T = any>(url: string): Promise<T> {
    const token = await this.authenticate()
    const res = await axios.get<T>(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.data
  }

  public async listSecurityGroups(): Promise<GraphGroup[]> {
    const data = await this.get<{ value: GraphGroup[] }>(
      'https://graph.microsoft.com/v1.0/groups?$filter=securityEnabled eq true&$select=id,displayName'
    )
    return data.value
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

  public async getGroupById(groupId: string): Promise<GraphGroup> {
    return this.get<GraphGroup>(
      `https://graph.microsoft.com/v1.0/groups/${groupId}?$select=id,displayName`
    )
  }

  public async sendEmail(to: string, subject: string, html: string): Promise<void> {
    const token = await this.authenticate()
    const sender = process.env.MICROSOFT_SENDER!

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
            toRecipients: [
              {
                emailAddress: {
                  address: to,
                },
              },
            ],
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
      console.error('Erro ao enviar email pelo Graph API:', error.response?.data || error.message)
      throw new Error('Erro ao enviar email com Microsoft Graph API')
    }
  }
}
