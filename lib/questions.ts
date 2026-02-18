export type AnswerType = "confirmation" | "number" | "text";

export interface Question {
  id: string;
  text: string;
  help?: string; // Explanation shown on ? click
  type: AnswerType;
  required?: boolean;
  conditionalOn?: { id: string; value: string }; // show only if condition met
}

export interface Section {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export const roles = [
  "Geschäftsführer/in",
  "Vorstand",
  "Prokurist/in",
  "Kreisgeschäftsführer/in",
  "Sonstiges",
];

export const reportTargets = [
  "Präsident/in",
  "Aufsichtsratsvorsitzende/r",
  "Vorstand",
  "Justiziar/in",
  "Geschäftsführer/in",
  "Sonstiges",
];

export const sections: Section[] = [
  {
    id: "geschaeftsfuehrung",
    title: "Geschäftsführung & Interessenkonflikte",
    description: "Erklärungen zur Ausgestaltung der Geschäftsführung und möglichen Interessenkonflikten.",
    questions: [
      {
        id: "gf_keine_aenderungen",
        text: "Alle Änderungen an meinem Arbeits-/Dienstvertrag wurden mit dem Aufsichtsorgan abgestimmt.",
        help: "Antworten Sie mit „Ja", wenn es entweder keine Vertragsänderungen gab oder alle Änderungen ordnungsgemäß mit dem Aufsichtsorgan vereinbart wurden.",
        type: "confirmation",
      },
      {
        id: "gf_keine_interessen",
        text: "Ich habe keine persönlichen Interessen verfolgt, die meine Tätigkeit beeinträchtigen könnten.",
        help: "„Ja" bedeutet: Es gab keine Situationen, in denen private Interessen Ihre dienstliche Tätigkeit beeinflusst haben.",
        type: "confirmation",
      },
      {
        id: "gf_konflikte_gemeldet",
        text: "Mögliche Interessenkonflikte habe ich dem Aufsichtsorgan gemeldet.",
        help: "„Ja" bedeutet: Es gab entweder keine Konflikte, oder sie wurden ordnungsgemäß gemeldet. „Nicht zutreffend" bei keinen Konflikten ist auch „Ja".",
        type: "confirmation",
      },
      {
        id: "gf_keine_verwandten",
        text: "Es sind keine verwandten Personen in der Gliederung oder Beteiligungsgesellschaften tätig.",
        help: "„Ja" bedeutet: Keine Personen, mit denen Sie verwandt oder verschwägert sind, sind haupt- oder ehrenamtlich beschäftigt.",
        type: "confirmation",
      },
      {
        id: "gf_keine_geschenke_angenommen",
        text: "Ich habe keine Geschenke, Vorteile oder Vergünstigungen von Dritten angenommen.",
        help: "„Ja" bedeutet: Sie haben im Geschäftsjahr keine Zuwendungen von Dritten (z.B. Geschäftspartnern, Lieferanten) erhalten.",
        type: "confirmation",
      },
      {
        id: "gf_keine_geschenke_gewaehrt",
        text: "Ich habe keine Geschenke, Vorteile oder Vergünstigungen an Dritte gewährt.",
        help: "„Ja" bedeutet: Sie haben im Geschäftsjahr Dritten keine Zuwendungen gewährt.",
        type: "confirmation",
      },
    ],
  },
  {
    id: "sitzungen",
    title: "Sitzungen & Beschlussfassungen",
    description: "Angaben zu Sitzungen und Ihrer Teilnahme.",
    questions: [
      {
        id: "sitzungen_gesamt",
        text: "Anzahl Sitzungen des Aufsichtsorgans insgesamt",
        help: "Wie viele reguläre Sitzungen des Vorstandes/Präsidiums haben im Geschäftsjahr stattgefunden?",
        type: "number",
        required: true,
      },
      {
        id: "sitzungen_teilnahme",
        text: "Davon: An wie vielen haben Sie teilgenommen?",
        help: "An wie vielen der oben genannten Sitzungen haben Sie persönlich teilgenommen?",
        type: "number",
        required: true,
      },
      {
        id: "sitzungen_weitere",
        text: "Weitere Sitzungen (z.B. VG-Land, Aufsichtsrat einer Beteiligungsgesellschaft)",
        help: "Listen Sie weitere Gremien auf, an deren Sitzungen Sie in Ihrer Funktion teilgenommen haben.",
        type: "text",
      },
    ],
  },
  {
    id: "rechtsgeschaefte",
    title: "Zustimmungspflichtige Rechtsgeschäfte",
    description: "Bestätigung, dass keine zustimmungspflichtigen Rechtsgeschäfte ohne vorherige Genehmigung vorgenommen wurden.",
    questions: [
      {
        id: "rg_grundstuecke",
        text: "Grundstücke wurden nur mit Zustimmung des Aufsichtsorgans erworben, belastet oder veräußert.",
        help: "„Ja" bedeutet: Es gab entweder keine Grundstücksgeschäfte, oder alle hatten die erforderliche Zustimmung.",
        type: "confirmation",
      },
      {
        id: "rg_darlehen",
        text: "Darlehen und Kredite wurden nur mit Zustimmung aufgenommen.",
        help: "„Ja" bedeutet: Es wurden keine Darlehen/Kredite ohne Genehmigung des Aufsichtsorgans aufgenommen.",
        type: "confirmation",
      },
      {
        id: "rg_darlehen_dritte",
        text: "Darlehen an Dritte wurden nur mit Zustimmung gewährt.",
        help: "„Ja" bedeutet: Es wurden keine Darlehen an Dritte ohne Genehmigung vergeben.",
        type: "confirmation",
      },
      {
        id: "rg_buergschaften",
        text: "Bürgschaften wurden nur mit Zustimmung übernommen.",
        help: "„Ja" bedeutet: Es wurden keine Bürgschaften ohne Zustimmung des Aufsichtsorgans übernommen.",
        type: "confirmation",
      },
      {
        id: "rg_beteiligungen",
        text: "Beteiligungen an Gesellschaften wurden nur mit Zustimmung eingegangen.",
        help: "„Ja" bedeutet: Es wurden keine Gesellschaften gegründet und keine Beteiligungen ohne Zustimmung eingegangen.",
        type: "confirmation",
      },
    ],
  },
  {
    id: "arbeitgeber",
    title: "Arbeitgeberstellung",
    description: "Einhaltung arbeitsrechtlicher Vorgaben und Betriebsratsangelegenheiten.",
    questions: [
      {
        id: "ag_mindestlohn",
        text: "Das Mindestlohngesetz wurde eingehalten.",
        help: "„Ja" = Alle Beschäftigten erhielten mindestens den gesetzlichen Mindestlohn (MiLoG).",
        type: "confirmation",
      },
      {
        id: "ag_mutterschutz",
        text: "Die Mutterschutz-Vorgaben wurden eingehalten.",
        help: "„Ja" = Die gesetzlichen Vorgaben zum Mutterschutz (MuSchG) wurden korrekt umgesetzt.",
        type: "confirmation",
      },
      {
        id: "ag_jugendschutz",
        text: "Der Kinder- und Jugendarbeitsschutz wurde eingehalten.",
        help: "„Ja" = Die Vorgaben des Jugendarbeitsschutzgesetzes (JArbSchG) wurden beachtet.",
        type: "confirmation",
      },
      {
        id: "ag_schwerbehinderte",
        text: "Die Vorgaben zum Umgang mit Schwerbehinderten wurden eingehalten.",
        help: "„Ja" = Die Pflichten nach dem SGB IX (Schwerbehindertenrecht) wurden erfüllt.",
        type: "confirmation",
      },
      {
        id: "ag_auslaender",
        text: "Die Vorgaben zur Beschäftigung ausländischer Arbeitnehmer wurden eingehalten.",
        help: "„Ja" = Die gesetzlichen Regelungen wurden beachtet.",
        type: "confirmation",
      },
      {
        id: "ag_betriebsrat_existiert",
        text: "In der Gliederung existiert ein Betriebsrat.",
        help: "Gibt es in Ihrer Gliederung einen oder mehrere Betriebsräte? Bei „Nein" werden die Folgefragen übersprungen.",
        type: "confirmation",
      },
      {
        id: "ag_br_wahlen",
        text: "Betriebsratswahlen wurden frei und unbeeinflusst ermöglicht.",
        help: "„Ja" = Sofern Wahlen stattfanden, wurden diese ohne Beeinflussung durchgeführt. Falls keine Wahlen stattfanden, ebenfalls „Ja".",
        type: "confirmation",
        conditionalOn: { id: "ag_betriebsrat_existiert", value: "ja" },
      },
      {
        id: "ag_br_monatsgespraeche",
        text: "Monatsgespräche nach § 74 BetrVG wurden durchgeführt.",
        help: "„Ja" = Regelmäßige Monatsgespräche zwischen Arbeitgeber und Betriebsrat haben stattgefunden.",
        type: "confirmation",
        conditionalOn: { id: "ag_betriebsrat_existiert", value: "ja" },
      },
      {
        id: "ag_br_stoerungsfrei",
        text: "Die Betriebsratstätigkeit wurde behinderungsfrei gewährleistet.",
        help: "„Ja" = Der Betriebsrat konnte seine Aufgaben ohne Behinderung oder Störung wahrnehmen.",
        type: "confirmation",
        conditionalOn: { id: "ag_betriebsrat_existiert", value: "ja" },
      },
      {
        id: "ag_br_pflichten",
        text: "Alle Pflichten nach BetrVG (Auskunft, Anhörung, Unterrichtung) wurden erfüllt.",
        help: "„Ja" = Die gesetzlichen Informations- und Anhörungspflichten wurden eingehalten.",
        type: "confirmation",
        conditionalOn: { id: "ag_betriebsrat_existiert", value: "ja" },
      },
      {
        id: "ag_beschlussverfahren",
        text: "Anzahl Beschlussverfahren vor dem Arbeitsgericht (0 = keine)",
        help: "Wie viele arbeitsgerichtliche Beschlussverfahren gab es im Geschäftsjahr?",
        type: "number",
      },
    ],
  },
  {
    id: "finanzwesen",
    title: "Finanzwesen",
    description: "Einhaltung der Finanzvorschriften und Berichtspflichten.",
    questions: [
      {
        id: "fin_satzungsgemaess",
        text: "Alle Mittel wurden satzungsgemäß und zweckgebunden verwendet.",
        help: "„Ja" = Alle Mittel wurden entsprechend der Satzung und Zweckbindung eingesetzt.",
        type: "confirmation",
      },
      {
        id: "fin_haushaltsplan",
        text: "Der Haushaltsplan wurde eingehalten (keine unzulässigen Überschreitungen).",
        help: "„Ja" = Es gab keine ungenehmigten Überschreitungen des Haushaltsplans.",
        type: "confirmation",
      },
      {
        id: "fin_buchfuehrung",
        text: "Die Buchführung war ordnungsgemäß.",
        help: "„Ja" = Die Buchführung entsprach den Grundsätzen ordnungsgemäßer Buchführung (GoB).",
        type: "confirmation",
      },
      {
        id: "fin_vier_augen",
        text: "Das Vier-Augen-Prinzip bei Verträgen über 10.000 € wurde eingehalten.",
        help: "„Ja" = Bei allen Vertragsabschlüssen über 10 TEUR war eine zweite Person beteiligt.",
        type: "confirmation",
      },
      {
        id: "fin_berichtspflichten",
        text: "Alle Berichtspflichten gegenüber dem Aufsichtsorgan wurden eingehalten.",
        help: "„Ja" = Quartalsberichte, Finanzberichte etc. wurden fristgerecht vorgelegt.",
        type: "confirmation",
      },
      {
        id: "fin_controlling",
        text: "Ein wirtschaftliches Frühwarnsystem (Controlling) ist vorhanden.",
        help: "„Ja" = Es existiert ein fortlaufendes Controlling-System.",
        type: "confirmation",
      },
      {
        id: "fin_versicherung",
        text: "Ein ausreichender D&O-Versicherungsschutz ist vorhanden.",
        help: "„Ja" = Es besteht eine Directors-and-Officers-Versicherung mit angemessener Deckung.",
        type: "confirmation",
      },
      {
        id: "fin_jahresabschluss",
        text: "Der geprüfte Jahresabschluss wurde rechtzeitig vorgelegt.",
        help: "„Ja" = Der Jahresabschluss wurde geprüft und fristgerecht dem Aufsichtsorgan vorgelegt.",
        type: "confirmation",
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
        text: "Die Revisionsprüfung wurde ordnungsgemäß durchgeführt.",
        help: "„Ja" = Die Prüfung erfolgte entsprechend der Revisionsordnung des DRK-Landesverbandes.",
        type: "confirmation",
      },
      {
        id: "rev_hinweisgebersystem",
        text: "Ein funktionierendes Hinweisgebersystem ist vorhanden.",
        help: "„Ja" = Es existiert ein Hinweisgebersystem (gem. HinSchG), das funktionsfähig und bekannt ist.",
        type: "confirmation",
      },
      {
        id: "rev_hinweise_anzahl",
        text: "Anzahl eingegangener Hinweise auf die Gliederung (0 = keine)",
        help: "Wie viele Hinweise auf mögliche Verstöße sind im Geschäftsjahr über das Hinweisgebersystem eingegangen?",
        type: "number",
      },
    ],
  },
];
