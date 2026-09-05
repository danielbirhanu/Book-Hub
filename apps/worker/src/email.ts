type EmailInput = { to: string; subject: string; html: string };

export async function sendEmail(env: Env, input: EmailInput) {
  if (!env.BREVO_API_KEY || !env.EMAIL_FROM)
    return { delivered: false, skipped: true };
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": env.BREVO_API_KEY,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: parseSender(env.EMAIL_FROM),
      to: [{ email: input.to }],
      subject: input.subject,
      htmlContent: input.html,
    }),
  });
  if (!response.ok)
    throw new Error(`Brevo email failed with status ${response.status}`);
  return { delivered: true, skipped: false };
}

function parseSender(value: string) {
  const match = value.match(/^(.+?)\s*<([^>]+)>$/);
  return match
    ? { name: match[1]!.trim(), email: match[2]! }
    : { email: value.trim() };
}
