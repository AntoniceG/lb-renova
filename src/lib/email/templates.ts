export interface EmailBrand {
  name: string;
  /** Délai de rappel promis, ex. « sous 48 h » ; `null` tant qu'il n'est pas défini. */
  callbackDelay: string | null;
  /** Téléphone public ; `null` tant que la donnée client est manquante. */
  phone: { display: string; e164: string } | null;
}

export interface LeadEmailData {
  ref: string;
  fullName: string;
  phone: string;
  phoneDisplay: string;
  email: string;
  projectLabel: string;
  postalCode: string;
  propertyType?: string;
  occupancy?: string;
  timeline?: string;
  callSlot?: string;
  description?: string;
  utm: Record<string, string>;
  landingPath?: string;
  referrer?: string;
}

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

const NAVY = "#1a2a5e";
const RED = "#c8312a";
const INK = "#1c2340";
const MUTED = "#5b6385";

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

interface Row {
  label: string;
  value: string;
  href?: string;
}

function rowsOf(data: LeadEmailData): Row[] {
  const rows: Row[] = [
    { label: "Projet", value: data.projectLabel },
    { label: "Code postal", value: data.postalCode },
  ];
  if (data.propertyType) rows.push({ label: "Type de bien", value: data.propertyType });
  if (data.occupancy) rows.push({ label: "Situation", value: data.occupancy });
  if (data.timeline) rows.push({ label: "Délai souhaité", value: data.timeline });
  if (data.callSlot) rows.push({ label: "Moment pour être rappelé", value: data.callSlot });
  return rows;
}

function layout(brand: EmailBrand, title: string, bodyHtml: string): string {
  return `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;background:#f3f5fa;font-family:Arial,Helvetica,sans-serif;color:${INK};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f5fa;padding:24px 12px;"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;">
<tr><td style="background:${NAVY};padding:20px 28px;color:#ffffff;font-size:20px;font-weight:bold;">${escapeHtml(brand.name)}<div style="height:3px;width:56px;background:${RED};margin-top:10px;"></div></td></tr>
<tr><td style="padding:28px;font-size:16px;line-height:1.55;">${bodyHtml}</td></tr>
</table></td></tr></table></body></html>`;
}

function tableHtml(rows: Row[]): string {
  const cells = rows
    .map((row) => {
      const value = row.href
        ? `<a href="${escapeHtml(row.href)}" style="color:${NAVY};">${escapeHtml(row.value)}</a>`
        : escapeHtml(row.value);
      return `<tr><td style="padding:6px 12px 6px 0;color:${MUTED};white-space:nowrap;vertical-align:top;">${escapeHtml(row.label)}</td><td style="padding:6px 0;font-weight:bold;">${value}</td></tr>`;
    })
    .join("");
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:16px 0;">${cells}</table>`;
}

function tableText(rows: Row[]): string {
  return rows.map((row) => `${row.label} : ${row.value}`).join("\n");
}

/** Email de confirmation envoyé au prospect. */
export function renderConfirmationEmail(brand: EmailBrand, data: LeadEmailData): RenderedEmail {
  const subject = `Votre demande de devis ${brand.name} (réf. ${data.ref})`;
  const rows = rowsOf(data);

  const callback = brand.callbackDelay
    ? `Nous vous rappelons ${brand.callbackDelay} pour échanger sur votre projet.`
    : "Nous vous rappelons rapidement pour échanger sur votre projet.";
  const urgent = brand.phone ? `Un point urgent ? Appelez-nous au ${brand.phone.display}.` : "";
  const closing =
    "Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer ce message. " +
    "Vos informations sont utilisées uniquement pour répondre à votre demande.";

  const html = layout(
    brand,
    subject,
    `<p style="margin:0 0 12px;">Bonjour ${escapeHtml(data.fullName)},</p>
<p style="margin:0 0 12px;">Nous avons bien reçu votre demande de devis (référence <strong>${escapeHtml(data.ref)}</strong>).</p>
${tableHtml(rows)}
<p style="margin:0 0 12px;"><strong>${escapeHtml(callback)}</strong></p>
${urgent ? `<p style="margin:0 0 12px;">${escapeHtml(urgent)}</p>` : ""}
<p style="margin:16px 0 0;color:${MUTED};font-size:13px;">${escapeHtml(closing)}</p>
<p style="margin:16px 0 0;">À très bientôt,<br>L'équipe ${escapeHtml(brand.name)}</p>`,
  );

  const text = [
    `Bonjour ${data.fullName},`,
    "",
    `Nous avons bien reçu votre demande de devis (référence ${data.ref}).`,
    "",
    tableText(rows),
    "",
    callback,
    urgent,
    "",
    closing,
    "",
    `À très bientôt,\nL'équipe ${brand.name}`,
  ]
    .filter((line, index, all) => !(line === "" && all[index - 1] === ""))
    .join("\n");

  return { subject, html, text };
}

/** Email de notification interne : toutes les informations utiles pour rappeler le prospect. */
export function renderNotificationEmail(brand: EmailBrand, data: LeadEmailData): RenderedEmail {
  const subject = `Nouveau lead ${data.ref} : ${data.projectLabel}, ${data.postalCode}, ${data.fullName}`;
  const contactRows: Row[] = [
    { label: "Nom", value: data.fullName },
    { label: "Téléphone", value: data.phoneDisplay, href: `tel:${data.phone}` },
    { label: "Email", value: data.email, href: `mailto:${data.email}` },
  ];
  const projectRows = rowsOf(data);
  const origin: Row[] = [];
  for (const [key, value] of Object.entries(data.utm)) origin.push({ label: key, value });
  if (data.landingPath) origin.push({ label: "Page d'arrivée", value: data.landingPath });
  if (data.referrer) origin.push({ label: "Référent", value: data.referrer });

  const description = data.description?.trim();

  const html = layout(
    brand,
    subject,
    `<p style="margin:0 0 4px;color:${MUTED};">Référence ${escapeHtml(data.ref)}</p>
<h1 style="margin:0 0 8px;font-size:20px;color:${NAVY};">Nouveau lead : ${escapeHtml(data.projectLabel)}</h1>
${tableHtml(contactRows)}
${tableHtml(projectRows)}
${description ? `<p style="margin:0 0 4px;color:${MUTED};">Description</p><p style="margin:0 0 12px;white-space:pre-wrap;">${escapeHtml(description)}</p>` : ""}
${origin.length > 0 ? `<p style="margin:16px 0 0;color:${MUTED};font-size:13px;">Origine</p>${tableHtml(origin)}` : ""}`,
  );

  const text = [
    `Nouveau lead ${data.ref}`,
    "",
    tableText(contactRows),
    "",
    tableText(projectRows),
    description ? `\nDescription :\n${description}` : "",
    origin.length > 0 ? `\nOrigine :\n${tableText(origin)}` : "",
  ]
    .filter((line) => line !== "")
    .join("\n");

  return { subject, html, text };
}
