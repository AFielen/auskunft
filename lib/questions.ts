export interface Question {
  id: string;
  text: string;
  type: "checkbox" | "number" | "text";
  required?: boolean;
  conditionalOn?: string; // show only if this question id is checked
  deviationRequired?: boolean; // if NOT checked, require explanation
}

export interface Section {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export const sections: Section[] = [
  {
    id: "geschaeftsfuehrung",
    title: "Geschäftsführung & Interessenkonflikte",
    description: "Erklärungen zur Ausgestaltung der Kreisgeschäftsführung und möglichen Interessenkonflikten.",
    questions: [
      {
        id: "gf_keine_aenderungen",
        text: "Keine arbeits-/dienstvertraglichen Änderungen erfolgt, die nicht mit dem Präsidenten/Vorsitzenden des Kreisverbandes vereinbart wurden.",
        type: "checkbox",
        deviationRequired: true,
      },
      {
        id: "gf_keine_interessen",
        text: "Keine persönlichen Interessen verfolgt, die meine Tätigkeit hätten beeinträchtigen können.",
        type: "checkbox",
        deviationRequired: true,
      },
      {
        id: "gf_konflikte_gemeldet",
        text: "Mögliche Interessenkonflikte dem Präsidium/Vorstand gemeldet.",
        type: "checkbox",
        deviationRequired: true,
      },
      {
        id: "gf_keine_verwandten",
        text: "Keine Personen im Kreisverband oder Beteiligungsgesellschaften tätig, die mit mir verwandt sind.",
        type: "checkbox",
        deviationRequired: true,
      },
      {
        id: "gf_keine_geschenke_angenommen",
        text: "Keine Geschenke, Vorteile, Vergünstigungen oder sonstige persönliche Zuwendungen von Dritten angenommen.",
        type: "checkbox",
        deviationRequired: true,
      },
      {
        id: "gf_keine_geschenke_gewaehrt",
        text: "Keine Geschenke, Vorteile, Vergünstigungen oder sonstige persönliche Zuwendungen Dritten gegenüber gewährt.",
        type: "checkbox",
        deviationRequired: true,
      },
    ],
  },
  {
    id: "sitzungen",
    title: "Sitzungen & Beschlussfassungen",
    description: "Angaben zu Sitzungen des Vorstandes/Präsidiums und Ihrer Teilnahme.",
    questions: [
      {
        id: "sitzungen_gesamt",
        text: "Anzahl Sitzungen des Vorstandes/Präsidiums insgesamt",
        type: "number",
        required: true,
      },
      {
        id: "sitzungen_teilnahme",
        text: "Davon an wie vielen Sitzungen haben Sie teilgenommen?",
        type: "number",
        required: true,
      },
      {
        id: "sitzungen_weitere",
        text: "Weitere Sitzungen (z.B. VG-Land, Aufsichtsrat Beteiligungsgesellschaft)",
        type: "text",
      },
    ],
  },
  {
    id: "rechtsgeschaefte",
    title: "Zustimmungspflichtige Rechtsgeschäfte",
    description: "Bestätigung, dass keine Rechtsgeschäfte ohne vorherige Zustimmung des Präsidiums/Vorstandes vorgenommen wurden.",
    questions: [
      {
        id: "rg_grundstuecke",
        text: "Erwerb, Belastung und Veräußerung von Grundstücken und grundstücksgleichen Rechten — keine ohne Zustimmung.",
        type: "checkbox",
        deviationRequired: true,
      },
      {
        id: "rg_darlehen",
        text: "Aufnahme von Darlehen und Krediten — keine ohne Zustimmung.",
        type: "checkbox",
        deviationRequired: true,
      },
      {
        id: "rg_darlehen_dritte",
        text: "Gewährung von Darlehen an Dritte — keine ohne Zustimmung.",
        type: "checkbox",
        deviationRequired: true,
      },
      {
        id: "rg_buergschaften",
        text: "Übernahme von Bürgschaften — keine ohne Zustimmung.",
        type: "checkbox",
        deviationRequired: true,
      },
      {
        id: "rg_beteiligungen",
        text: "Gründung von und Beteiligung an privatrechtlichen Gesellschaften — keine ohne Zustimmung.",
        type: "checkbox",
        deviationRequired: true,
      },
    ],
  },
  {
    id: "arbeitgeber",
    title: "Ordnungsgemäße Geschäftsführung — Arbeitgeberstellung",
    description: "Einhaltung arbeitsrechtlicher Vorgaben und Betriebsratsangelegenheiten.",
    questions: [
      {
        id: "ag_mindestlohn",
        text: "Vorgaben des Mindestlohngesetzes eingehalten.",
        type: "checkbox",
        deviationRequired: true,
      },
      {
        id: "ag_mutterschutz",
        text: "Vorgaben des Mutterschutzes eingehalten.",
        type: "checkbox",
        deviationRequired: true,
      },
      {
        id: "ag_jugendschutz",
        text: "Vorgaben des Kinder- und Jugendarbeitsschutzes eingehalten.",
        type: "checkbox",
        deviationRequired: true,
      },
      {
        id: "ag_schwerbehinderte",
        text: "Vorgaben zum Umgang mit Schwerbehinderten eingehalten.",
        type: "checkbox",
        deviationRequired: true,
      },
      {
        id: "ag_auslaender",
        text: "Vorgaben zur Beschäftigung von Ausländern eingehalten.",
        type: "checkbox",
        deviationRequired: true,
      },
      {
        id: "ag_betriebsrat_existiert",
        text: "Im Kreisverband existiert ein Betriebsrat.",
        type: "checkbox",
      },
      {
        id: "ag_br_wahlen",
        text: "Wahlen des Betriebsrates unbeeinflusst ermöglicht.",
        type: "checkbox",
        conditionalOn: "ag_betriebsrat_existiert",
        deviationRequired: true,
      },
      {
        id: "ag_br_monatsgespraeche",
        text: "Monatsgespräche nach § 74 BetrVG stattgefunden.",
        type: "checkbox",
        conditionalOn: "ag_betriebsrat_existiert",
        deviationRequired: true,
      },
      {
        id: "ag_br_stoerungsfrei",
        text: "Tätigkeit des Betriebsrates behinderungs- und störungsfrei gewährleistet.",
        type: "checkbox",
        conditionalOn: "ag_betriebsrat_existiert",
        deviationRequired: true,
      },
      {
        id: "ag_br_pflichten",
        text: "Verpflichtungen zur Auskunft, Anhörung und Unterrichtung nach BetrVG nachgekommen.",
        type: "checkbox",
        conditionalOn: "ag_betriebsrat_existiert",
        deviationRequired: true,
      },
      {
        id: "ag_beschlussverfahren",
        text: "Anzahl Beschlussverfahren vor dem Arbeitsgericht (0 = keine)",
        type: "number",
      },
    ],
  },
  {
    id: "finanzwesen",
    title: "Ordnungsgemäße Geschäftsführung — Finanzwesen",
    description: "Einhaltung der Finanzvorschriften und Berichtspflichten.",
    questions: [
      {
        id: "fin_satzungsgemaess",
        text: "Zur Verfügung stehende Mittel satzungsgemäß und zweckgebunden verwendet.",
        type: "checkbox",
        deviationRequired: true,
      },
      {
        id: "fin_haushaltsplan",
        text: "Keine unzulässigen Überschreitungen des Haushaltsplans.",
        type: "checkbox",
        deviationRequired: true,
      },
      {
        id: "fin_buchfuehrung",
        text: "Buchführung des Kreisverbandes ordnungsgemäß.",
        type: "checkbox",
        deviationRequired: true,
      },
      {
        id: "fin_vier_augen",
        text: "Vier-Augen-Prinzip bei Verträgen über 10 TEUR eingehalten.",
        type: "checkbox",
        deviationRequired: true,
      },
      {
        id: "fin_berichtspflichten",
        text: "Berichtspflichten gegenüber dem Präsidium/Vorstand eingehalten.",
        type: "checkbox",
        deviationRequired: true,
      },
      {
        id: "fin_controlling",
        text: "Wirtschaftliches Frühwarnsystem durch fortlaufendes Controlling existiert.",
        type: "checkbox",
        deviationRequired: true,
      },
      {
        id: "fin_versicherung",
        text: "Ausreichender Versicherungsschutz (D&O) mit angemessener Versicherungssumme besteht.",
        type: "checkbox",
        deviationRequired: true,
      },
      {
        id: "fin_jahresabschluss",
        text: "Geprüfter Jahresabschluss erstellt und rechtzeitig vorgelegt.",
        type: "checkbox",
        deviationRequired: true,
      },
    ],
  },
  {
    id: "revision",
    title: "Revision & Compliance",
    description: "Einhaltung der Revisionsordnung und Hinweisgebersystem.",
    questions: [
      {
        id: "rev_pruefung",
        text: "Revisionsprüfung entsprechend der Revisionsordnung des DRK-Landesverband Nordrhein e.V. ordnungsgemäß durchgeführt.",
        type: "checkbox",
        deviationRequired: true,
      },
      {
        id: "rev_hinweisgebersystem",
        text: "Abgabe von Hinweisen durch funktionierendes Hinweisgebersystem ermöglicht.",
        type: "checkbox",
        deviationRequired: true,
      },
      {
        id: "rev_hinweise_anzahl",
        text: "Anzahl Hinweise auf den Kreisverband (0 = keine)",
        type: "number",
      },
    ],
  },
];
