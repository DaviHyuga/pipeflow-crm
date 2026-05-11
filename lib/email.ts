import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendInviteEmail({
  to,
  workspaceName,
  inviterEmail,
  inviteToken,
}: {
  to: string
  workspaceName: string
  inviterEmail: string
  inviteToken: string
}): Promise<{ error?: string }> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const inviteUrl = `${appUrl}/invite/${inviteToken}`
  const inviterName = inviterEmail.split('@')[0]

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM ?? 'PipeFlow CRM <noreply@pipeflow.app>',
    to,
    subject: `${inviterName} te convidou para ${workspaceName} no PipeFlow`,
    html: buildInviteHtml({ workspaceName, inviterEmail, inviteUrl }),
  })

  if (error) return { error: error.message ?? 'Erro ao enviar e-mail' }
  return {}
}

function buildInviteHtml({
  workspaceName,
  inviterEmail,
  inviteUrl,
}: {
  workspaceName: string
  inviterEmail: string
  inviteUrl: string
}): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e4e4e7">
        <tr>
          <td style="background:#0f1629;padding:24px 32px">
            <table cellpadding="0" cellspacing="0"><tr>
              <td style="background:#3b5bf5;width:32px;height:32px;border-radius:8px;text-align:center;line-height:32px">
                <span style="color:#fff;font-size:16px;font-weight:700">P</span>
              </td>
              <td style="padding-left:10px;color:#fff;font-size:17px;font-weight:600">PipeFlow</td>
            </tr></table>
          </td>
        </tr>
        <tr>
          <td style="padding:32px">
            <h1 style="margin:0 0 12px;font-size:22px;font-weight:600;color:#09090b">Você foi convidado!</h1>
            <p style="margin:0 0 20px;font-size:15px;color:#52525b;line-height:1.6">
              <strong style="color:#18181b">${inviterEmail}</strong> te convidou para colaborar no workspace
              <strong style="color:#18181b">${workspaceName}</strong> no PipeFlow CRM.
            </p>
            <table cellpadding="0" cellspacing="0" style="margin:24px 0">
              <tr><td style="background:#3b5bf5;border-radius:8px">
                <a href="${inviteUrl}" style="display:inline-block;padding:12px 28px;color:#fff;font-size:15px;font-weight:600;text-decoration:none">
                  Aceitar convite
                </a>
              </td></tr>
            </table>
            <p style="margin:0;font-size:13px;color:#a1a1aa">
              Este convite expira em 7 dias. Se você não esperava este e-mail, pode ignorá-lo.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 32px;background:#fafafa;border-top:1px solid #f4f4f5">
            <p style="margin:0;font-size:12px;color:#a1a1aa">
              PipeFlow CRM &middot; <a href="${inviteUrl}" style="color:#3b5bf5">${inviteUrl}</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}
