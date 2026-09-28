type Env = {
  TURNSTILE_SECRET_KEY?: string;
  CONTACT_RECIPIENT?: string;
  CONTACT_SENDER?: string;
  RESEND_API_KEY?: string;
  CONTACT_DEV_MODE?: string;
};

type Context = { request: Request; env: Env };
type Submission = { name: string; email: string; phone: string; subject: string; message: string; locale: string };

const response = (status: number, body: { ok: boolean; error?: string }) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });

function text(form: FormData, key: string): string {
  const value = form.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

function valid(data: Submission): boolean {
  return data.name.length >= 2 && data.name.length <= 100
    && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(data.email) && data.email.length <= 200
    && data.phone.length <= 50 && data.subject.length <= 120
    && data.message.length >= 10 && data.message.length <= 5000;
}

async function validateTurnstile(token: string, secret: string, ip: string | null, hostname: string): Promise<boolean> {
  if (!token || token.length > 2048) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set('remoteip', ip);
  const reply = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST', body, signal: AbortSignal.timeout(10000),
  });
  if (!reply.ok) return false;
  const result = await reply.json() as { success?: boolean; hostname?: string };
  return result.success === true && result.hostname === hostname;
}

async function deliver(data: Submission, env: Env): Promise<boolean> {
  if (!env.CONTACT_RECIPIENT || !env.CONTACT_SENDER || !env.RESEND_API_KEY) return false;
  const body = [
    'New Mellow Management website enquiry', '',
    `Name: ${data.name}`, `Email: ${data.email}`,
    `Phone: ${data.phone || '—'}`, `Subject / artist: ${data.subject || '—'}`,
    `Language: ${data.locale}`, '', data.message,
  ].join('\n');
  const reply = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: env.CONTACT_RECIPIENT, from: env.CONTACT_SENDER,
      reply_to: data.email, subject: `Mellow enquiry${data.subject ? `: ${data.subject.replace(/\s+/g, ' ')}` : ''}`,
      text: body,
    }),
    signal: AbortSignal.timeout(15000),
  });
  if (!reply.ok) return false;
  const result = await reply.json() as { id?: string };
  return typeof result.id === 'string' && result.id.length > 0;
}

export async function onRequestPost({ request, env }: Context): Promise<Response> {
  const url = new URL(request.url);
  const local = ['localhost', '127.0.0.1'].includes(url.hostname) && env.CONTACT_DEV_MODE === '1';
  const origin = request.headers.get('Origin');
  if (origin && origin !== url.origin) return response(403, { ok: false, error: 'origin' });
  if (Number(request.headers.get('Content-Length') || 0) > 18000) return response(413, { ok: false, error: 'too_large' });
  if (!request.headers.get('Content-Type')?.startsWith('multipart/form-data')) return response(415, { ok: false, error: 'content_type' });

  let form: FormData;
  try { form = await request.formData(); }
  catch { return response(400, { ok: false, error: 'invalid_form' }); }
  if (text(form, 'website')) return response(200, { ok: true });

  const data: Submission = {
    name: text(form, 'name'), email: text(form, 'email'), phone: text(form, 'phone'),
    subject: text(form, 'subject'), message: text(form, 'message'), locale: text(form, 'locale'),
  };
  if (!valid(data)) return response(400, { ok: false, error: 'invalid_fields' });
  if (local) return response(200, { ok: true });
  if (!env.TURNSTILE_SECRET_KEY) return response(503, { ok: false, error: 'not_configured' });

  try {
    const verified = await validateTurnstile(text(form, 'cf-turnstile-response'), env.TURNSTILE_SECRET_KEY, request.headers.get('CF-Connecting-IP'), url.hostname);
    if (!verified) return response(403, { ok: false, error: 'verification_failed' });
    const sent = await deliver(data, env);
    return sent ? response(200, { ok: true }) : response(503, { ok: false, error: 'delivery_failed' });
  } catch {
    return response(503, { ok: false, error: 'temporarily_unavailable' });
  }
}
