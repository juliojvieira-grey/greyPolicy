import axios from 'axios'

export default class MsGraphService {
  private token: string | null = null

  private async authenticate() {
    if (this.token) return this.token

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
    return this.token
  }

  public async listSecurityGroups(): Promise<{ id: string; displayName: string }[]> {
    const token = await this.authenticate()
  
    const res = await axios.get('https://graph.microsoft.com/v1.0/groups?$filter=securityEnabled eq true&$select=id,displayName', {
      headers: { Authorization: `Bearer ${token}` },
    })
  
    return res.data.value
  }
  
  public async listGroupUsers(groupId: string): Promise<{ displayName: string; userPrincipalName: string }[]> {
    const token = await this.authenticate()
  
    const res = await axios.get(`https://graph.microsoft.com/v1.0/groups/${groupId}/members`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  
    return res.data.value.filter((member: any) => member.userPrincipalName) // filtra apenas usuários
  }

  public async getGroupById(groupId: string): Promise<{ id: string; displayName: string }> {
    const token = await this.authenticate()
  
    const res = await axios.get(`https://graph.microsoft.com/v1.0/groups/${groupId}?$select=id,displayName`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  
    return res.data
  }


  public async sendEmail(to: string, subject: string, html: string) {
    const token = await this.authenticate()

    const sender = process.env.MICROSOFT_SENDER

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
  }
}