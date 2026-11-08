import { describe, expect, it, vi } from "vitest";
import { signWebhookBody } from "@/lib/n8n/sign";
import { verifyTurnstile } from "@/lib/turnstile";
import {
  escapeHtml,
  renderConfirmationEmail,
  renderNotificationEmail,
  type EmailBrand,
  type LeadEmailData,
} from "./templates";

const brand: EmailBrand = {
  name: "LB Rénova",
  callbackDelay: "sous 48 h",
  phone: { display: "04 42 00 00 00", e164: "+33442000000" },
};

const data: LeadEmailData = {
  ref: "LB-26-0042",
  fullName: "Camille <b>Martin</b>",
  phone: "+33612345678",
  phoneDisplay: "06 12 34 56 78",
  email: "camille@example.com",
  projectLabel: "Gros œuvre",
  postalCode: "13100",
  propertyType: "Maison",
  occupancy: "Propriétaire",
  timeline: "Dans 1 à 3 mois",
  description: "Mur porteur <script>alert(1)</script>",
  utm: { utm_source: "google" },
  landingPath: "/gros-oeuvre",
};

describe("emails", () => {
  it("affiche le logo : image jointe en ligne, citée par son identifiant", () => {
    for (const email of [
      renderConfirmationEmail(brand, data),
      renderNotificationEmail(brand, data),
    ]) {
      const [logo] = email.inlineImages;
      expect(email.inlineImages).toHaveLength(1);
      expect(logo?.contentId).toBe("logo-lb-renova");
      expect(email.html).toContain(`src="cid:${logo?.contentId}"`);
      expect(email.html).toContain(`alt="${brand.name}"`);
      // un vrai PNG (signature des 8 premiers octets), pas un fichier vide
      expect(
        Buffer.from(logo?.base64 ?? "", "base64")
          .subarray(0, 4)
          .toString("hex"),
      ).toBe("89504e47");
    }
  });

  it("échappe tout le contenu saisi par le visiteur", () => {
    const confirmation = renderConfirmationEmail(brand, data).html;
    const notification = renderNotificationEmail(brand, data).html;
    for (const html of [confirmation, notification]) {
      expect(html).not.toContain("<script>");
      expect(html).not.toContain("<b>Martin</b>");
    }
    expect(notification).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
  });

  it("annonce le délai de rappel et la référence dans la confirmation", () => {
    const email = renderConfirmationEmail(brand, data);
    expect(email.subject).toContain("LB-26-0042");
    expect(email.text).toContain("sous 48 h");
    expect(email.text).toContain("04 42 00 00 00");
  });

  it("n'affiche aucune constante TODO_ quand les données client manquent", () => {
    const email = renderConfirmationEmail({ ...brand, callbackDelay: null, phone: null }, data);
    expect(`${email.html}${email.text}`).not.toMatch(/TODO_/);
    expect(email.text).not.toContain("Appelez-nous");
    expect(email.text).toContain("rapidement");
  });

  it("donne à l'équipe un lien d'appel et de réponse", () => {
    const email = renderNotificationEmail(brand, data);
    expect(email.html).toContain('href="tel:+33612345678"');
    expect(email.html).toContain('href="mailto:camille@example.com"');
    expect(email.text).toContain("utm_source : google");
  });

  it("échappe les caractères HTML spéciaux", () => {
    expect(escapeHtml(`<a href="x">&'`)).toBe("&lt;a href=&quot;x&quot;&gt;&amp;&#39;");
  });
});

describe("signature du webhook n8n", () => {
  it("produit la signature décrite dans docs/N8N_WEBHOOK.md", () => {
    const signature = signWebhookBody("secret", "1793780000", '{"a":1}');
    expect(signature).toMatch(/^sha256=[0-9a-f]{64}$/);
    expect(signature).toBe(signWebhookBody("secret", "1793780000", '{"a":1}'));
    expect(signature).not.toBe(signWebhookBody("secret", "1793780001", '{"a":1}'));
    expect(signature).not.toBe(signWebhookBody("autre", "1793780000", '{"a":1}'));
  });
});

describe("verifyTurnstile", () => {
  const respond = (body: unknown, ok = true) =>
    vi.fn<typeof fetch>(async () => ({ ok, json: async () => body }) as Response);

  it("accepte un jeton validé par Cloudflare", async () => {
    const fetchImpl = respond({ success: true });
    await expect(verifyTurnstile("t", "s", "203.0.113.7", fetchImpl)).resolves.toBe(true);
    const body = fetchImpl.mock.calls[0]?.[1]?.body as URLSearchParams;
    expect(body.get("remoteip")).toBe("203.0.113.7");
  });

  it("refuse un jeton invalide, une erreur HTTP ou une panne réseau", async () => {
    await expect(verifyTurnstile("t", "s", undefined, respond({ success: false }))).resolves.toBe(
      false,
    );
    await expect(verifyTurnstile("t", "s", undefined, respond({}, false))).resolves.toBe(false);
    const failing = vi.fn(async () => {
      throw new Error("réseau");
    });
    await expect(verifyTurnstile("t", "s", undefined, failing)).resolves.toBe(false);
  });
});
