import { describe, expect, it, vi } from "vitest";
import { formatLeadRef } from "./options";
import { formatFrenchPhone, normalizeFrenchPhone } from "./phone";
import { createLeadSchemas, CONSENT_VERSION, toFieldErrors } from "./schema";
import { submitLead, type NewLeadRow, type SubmitDeps } from "./submit";

const projectTypes = ["renovation-globale", "gros-oeuvre", "autre"];
const schemas = createLeadSchemas(projectTypes);

const validInput = {
  projectType: "gros-oeuvre",
  postalCode: "13100",
  propertyType: "maison",
  occupancy: "proprietaire",
  timeline: "1-3-mois",
  description: "Ouverture d'un mur porteur entre cuisine et salon.",
  fullName: "  Camille Martin ",
  phone: "06 12 34 56 78",
  email: "  Camille.Martin@Example.COM ",
  callSlot: "",
  consent: true,
  website: "",
  turnstileToken: "token",
  utm: { utm_source: "google" },
  landingPath: "/gros-oeuvre",
};

describe("normalizeFrenchPhone", () => {
  it.each([
    ["06 12 34 56 78", "+33612345678"],
    ["06.12.34.56.78", "+33612345678"],
    ["+33 6 12 34 56 78", "+33612345678"],
    ["+33 (0)6 12 34 56 78", "+33612345678"],
    ["0033612345678", "+33612345678"],
    ["04 42 00 00 00", "+33442000000"],
  ])("accepte %s", (input, expected) => {
    expect(normalizeFrenchPhone(input)).toBe(expected);
  });

  it.each(["", "12345", "00 12 34 56 78", "+1 202 555 0100", "06 12 34 56", "abcdefghij"])(
    "refuse %s",
    (input) => {
      expect(normalizeFrenchPhone(input)).toBeNull();
    },
  );

  it("formate un numéro E.164 pour l'affichage", () => {
    expect(formatFrenchPhone("+33612345678")).toBe("06 12 34 56 78");
    expect(formatFrenchPhone("+14155550100")).toBe("+14155550100");
  });
});

describe("formatLeadRef", () => {
  it("construit une référence lisible à partir de la marque, de l'année et du numéro", () => {
    expect(formatLeadRef(1, "2026-11-04T10:00:00.000Z")).toBe("LB-26-0001");
    expect(formatLeadRef(42, new Date("2027-01-02T00:00:00.000Z"))).toBe("LB-27-0042");
  });
});

describe("schémas du devis", () => {
  it("normalise nom, email et téléphone", () => {
    const parsed = schemas.submission.parse(validInput);
    expect(parsed.fullName).toBe("Camille Martin");
    expect(parsed.email).toBe("camille.martin@example.com");
    expect(parsed.phone).toBe("+33612345678");
    expect(parsed.callSlot).toBeUndefined();
  });

  it("refuse un type de projet inconnu et un code postal invalide", () => {
    const result = schemas.project.safeParse({ projectType: "piscine", postalCode: "1310" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(Object.keys(toFieldErrors(result.error)).sort()).toEqual([
        "postalCode",
        "projectType",
      ]);
    }
  });

  it("exige le consentement", () => {
    const result = schemas.submission.safeParse({ ...validInput, consent: false });
    expect(result.success).toBe(false);
    if (!result.success) expect(toFieldErrors(result.error)).toHaveProperty("consent");
  });

  it("ne contient aucun champ de budget ni de pièce jointe", () => {
    expect(Object.keys(schemas.submission.shape).join(" ")).not.toMatch(/budget|photo|file|aide/i);
  });
});

function makeDeps(overrides: Partial<SubmitDeps> = {}) {
  const inserted: NewLeadRow[] = [];
  const deliver = vi.fn(async () => undefined);
  const deps: SubmitDeps = {
    verifyCaptcha: vi.fn(async () => true),
    hasRecentDuplicate: vi.fn(async () => false),
    insertLead: vi.fn(async (row) => {
      inserted.push(row);
      return { id: "lead-1", refNumber: 42, createdAt: "2026-11-04T10:00:00.000Z" };
    }),
    afterResponse: (task) => void task(),
    deliver,
    now: () => new Date("2026-11-04T10:00:00.000Z"),
    ...overrides,
  };
  return { deps, inserted, deliver };
}

describe("submitLead", () => {
  it("enregistre le lead puis déclenche les envois", async () => {
    const { deps, inserted, deliver } = makeDeps();
    const result = await submitLead(validInput, { ip: "203.0.113.7", schemas }, deps);

    expect(result).toEqual({ ok: true });
    expect(inserted).toHaveLength(1);
    expect(inserted[0]).toMatchObject({
      status: "new",
      project_type: "gros-oeuvre",
      phone: "+33612345678",
      email: "camille.martin@example.com",
      consent_version: CONSENT_VERSION,
      consent_at: "2026-11-04T10:00:00.000Z",
      call_slot: null,
    });
    expect(deps.verifyCaptcha).toHaveBeenCalledWith("token", "203.0.113.7");
    expect(deliver).toHaveBeenCalledTimes(1);
  });

  it("renvoie les erreurs de champ sans rien enregistrer", async () => {
    const { deps, inserted } = makeDeps();
    const result = await submitLead({ ...validInput, email: "pas-un-email" }, { schemas }, deps);
    expect(result).toMatchObject({ ok: false, error: "invalid" });
    expect(result.ok === false && result.error === "invalid" && result.fieldErrors).toHaveProperty(
      "email",
    );
    expect(inserted).toHaveLength(0);
    expect(deps.verifyCaptcha).not.toHaveBeenCalled();
  });

  it("répond comme un succès au robot qui remplit le champ piège, sans rien enregistrer", async () => {
    const { deps, inserted } = makeDeps();
    const result = await submitLead(
      { ...validInput, website: "https://spam.test" },
      { schemas },
      deps,
    );
    expect(result).toEqual({ ok: true });
    expect(inserted).toHaveLength(0);
    expect(deps.verifyCaptcha).not.toHaveBeenCalled();
  });

  it("refuse quand Turnstile échoue", async () => {
    const { deps, inserted } = makeDeps({ verifyCaptcha: vi.fn(async () => false) });
    const result = await submitLead(validInput, { schemas }, deps);
    expect(result).toEqual({ ok: false, error: "captcha" });
    expect(inserted).toHaveLength(0);
  });

  it("ignore un double envoi récent", async () => {
    const { deps, inserted, deliver } = makeDeps({ hasRecentDuplicate: vi.fn(async () => true) });
    const result = await submitLead(validInput, { schemas }, deps);
    expect(result).toEqual({ ok: true });
    expect(inserted).toHaveLength(0);
    expect(deliver).not.toHaveBeenCalled();
  });
});
