import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

interface ShootingNotificationPayload {
  name: string
  company: string
  email: string
  phone: string
  message: string
}

function formatText(payload: ShootingNotificationPayload): string {
  return [
    'Новая заявка на съемку',
    `Имя: ${payload.name}`,
    `Компания: ${payload.company || '-'}`,
    `Email: ${payload.email || '-'}`,
    `Телефон: ${payload.phone || '-'}`,
    `Сообщение: ${payload.message || '-'}`,
  ].join('\n')
}

export async function notifyAdminAboutShootingRequest(payload: ShootingNotificationPayload): Promise<void> {
  const config = useRuntimeConfig()
  const text = formatText(payload)
  const tasks: Promise<unknown>[] = []

  if (config.smtpHost && config.adminEmail && config.fromEmail) {
    const nodemailer = require('nodemailer') as {
      createTransport: (options: Record<string, unknown>) => {
        sendMail: (options: Record<string, unknown>) => Promise<unknown>
      }
    }
    const transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      secure: config.smtpPort === 465,
      auth: config.smtpUser && config.smtpPass
        ? { user: config.smtpUser, pass: config.smtpPass }
        : undefined,
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 5000,
    })

    tasks.push(transporter.sendMail({
      from: config.fromEmail,
      to: config.adminEmail,
      subject: 'Новая заявка на съемку',
      text,
    }))
  }

  if (config.telegramBotToken && config.telegramChatId) {
    tasks.push(fetch(`https://api.telegram.org/bot${config.telegramBotToken}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        chat_id: config.telegramChatId,
        text,
      }),
      signal: AbortSignal.timeout(5000),
    }).then(async (response) => {
      if (!response.ok) {
        throw new Error(`Telegram notification failed with status ${response.status}`)
      }
    }))
  }

  if (tasks.length === 0) return

  const results = await Promise.allSettled(tasks)
  for (const result of results) {
    if (result.status === 'rejected') {
      console.error('[notify] Failed to send shooting request notification', result.reason)
    }
  }
}
