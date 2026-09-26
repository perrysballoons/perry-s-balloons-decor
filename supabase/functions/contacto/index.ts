// Contact form → Gmail SMTP (port 465, implicit TLS).
// Secrets required: supabase secrets set SMTP_PASS=<app password>
const SMTP_HOST = "smtp.gmail.com";
const SMTP_PORT = 465;
const SMTP_USER = "perrysballoonsweb@gmail.com";
const MAIL_TO = "perrysballoonsweb@gmail.com";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function b64utf8(s: string): string {
  return btoa(String.fromCharCode(...encoder.encode(s)));
}

function reply(code: number, message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status: code,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

async function smtpSend(pass: string, subject: string, body: string) {
  const conn = await Deno.connectTls({ hostname: SMTP_HOST, port: SMTP_PORT });
  try {
    const reader = conn.readable.getReader();
    const writer = conn.writable.getWriter();
    let buf = "";

    async function readLine(): Promise<string> {
      while (!buf.includes("\r\n")) {
        const { value, done } = await reader.read();
        if (done) throw new Error("SMTP connection closed");
        buf += decoder.decode(value);
      }
      const i = buf.indexOf("\r\n");
      const line = buf.slice(0, i);
      buf = buf.slice(i + 2);
      return line;
    }

    async function readReply(): Promise<number> {
      let line = await readLine();
      const code = Number(line.slice(0, 3));
      while (line[3] === "-") line = await readLine();
      if (!Number.isInteger(code)) throw new Error(`Bad SMTP reply: ${line}`);
      return code;
    }

    async function cmd(c: string, want: number): Promise<void> {
      await writer.write(encoder.encode(c + "\r\n"));
      const got = await readReply();
      if (got !== want) throw new Error(`SMTP expected ${want}, got ${got} (${c.slice(0, 4)})`);
    }

    if ((await readReply()) !== 220) throw new Error("SMTP banner");
    await cmd("EHLO localhost", 250);
    await cmd("AUTH LOGIN", 334);
    await cmd(b64utf8(SMTP_USER), 334);
    await cmd(b64utf8(pass), 235);
    await cmd(`MAIL FROM:<${SMTP_USER}>`, 250);
    await cmd(`RCPT TO:<${MAIL_TO}>`, 250);
    await cmd("DATA", 354);
    const message = [
      `From: Perry's Balloons <${SMTP_USER}>`,
      `To: <${MAIL_TO}>`,
      `Subject: =?UTF-8?B?${b64utf8(subject)}?=`,
      "MIME-Version: 1.0",
      "Content-Type: text/plain; charset=UTF-8",
      "Content-Transfer-Encoding: base64",
      "",
      b64utf8(body).replace(/(.{76})/g, "$1\r\n"),
      "",
      ".",
    ].join("\r\n");
    await cmd(message, 250);
    await cmd("QUIT", 221);
    await writer.close();
  } finally {
    conn.close();
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });
  if (req.method !== "POST") return reply(405, "Method not allowed");

  const pass = Deno.env.get("SMTP_PASS");
  if (!pass) return reply(500, "SMTP_PASS not configured");

  let nombre = "",
    fecha = "",
    mensaje = "";
  try {
    const body = await req.json();
    nombre = String(body.nombre ?? "").slice(0, 80);
    fecha = String(body.fecha ?? "").slice(0, 20);
    mensaje = String(body.mensaje ?? "").slice(0, 800);
  } catch {
    return reply(400, "Invalid JSON");
  }
  if (!mensaje.trim()) return reply(400, "mensaje required");

  const lines = [
    nombre && `Nombre: ${nombre}`,
    fecha && `Fecha del evento: ${fecha}`,
    "",
    mensaje,
  ].filter((l) => l !== false) as string[];

  try {
    await smtpSend(pass, `Contacto web${nombre ? ` — ${nombre}` : ""}`, lines.join("\n"));
  } catch (e) {
    console.error("SMTP error", e);
    return reply(502, "SMTP failed");
  }
  return new Response(JSON.stringify({ ok: true }), {
    headers: { ...CORS, "Content-Type": "application/json" },
  });
});
