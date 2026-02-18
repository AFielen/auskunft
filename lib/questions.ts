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
        text: "Keine arbeits-/dienstvertraglichen Änderungen ohne Vereinbarung mit dem Aufsichtsorgan erfolgt.",
        help: "Haben im Geschäftsjahr Änderungen an Ihrem Arbeits- oder Dienstvertrag stattgefunden, die nicht mit dem zuständigen Aufsichtsorgan abgestimmt waren?",
        type: "confirmation",
      },
      {
        id: "gf_keine_interessen",
        text: "Keine persönlichen Interessen verfolgt, die die Tätigkeit hätten beeinträchtigen können.",
        help: "Gab es Situationen, in denen private Interessen Ihre dienstliche Tätigkeit beeinflusst haben könnten?",
        type: "confirmation",
      },
      {
        id: "gf_konflikte_gemeldet",
        text: "Mögliche Interessenkonflikte dem Aufsichtsorgan gemeldet.",
        help: "Falls Interessenkonflikte aufgetreten sind: Wurden diese ordnungsgemäß an das zuständige Aufsichtsorgan gemeldet?",
        type: "confirmation",
      },
      {
        id: "gf_keine_verwandten",
        text: "Keine verwandten Personen haupt- oder ehrenamtlich in der Gliederung oder Beteiligungsgesellschaften tätig.",
        help: "Sind Personen, mit denen Sie verwandt oder verschwägert sind, in Ihrer DRK-Gliederung oder deren Beteiligungsgesellschaften beschäftigt?",
        type: "confirmation",
      },
      {
        id: "gf_keine_geschenke_angenommen",
        text: "Keine Geschenke, Vorteile oder Vergünstigungen von Dritten angenommen.",
        help: "Haben Sie im Geschäftsjahr Geschenke, Vergünstigungen oder sonstige Zuwendungen von Dritten (z.B. Geschäftspartnern, Lieferanten) angenommen?",
        type: "confirmation",
      },
      {
        id: "gf_keine_geschenke_gewaehrt",
        text: "Keine Geschenke, Vorteile oder Vergünstigungen an Dritte gewährt.",
        help: "Haben Sie im Geschäftsjahr Dritten Geschenke, Vergünstigungen oder Zuwendungen gewährt?",
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
        text: "Grundstücke: Kein Erwerb, keine Belastung oder Veräußerung ohne Zustimmung.",
        help: "Wurden Grundstücke oder grundstücksgleiche Rechte erworben, belastet oder veräußert — und war dafür die Zustimmung des Aufsichtsorgans eingeholt?",
        type: "confirmation",
      },
      {
        id: "rg_darlehen",
        text: "Darlehen & Kredite: Keine Aufnahme ohne Zustimmung.",
        help: "Wurden Darlehen oder Kredite aufgenommen? Falls ja, lag die Zustimmung des Aufsichtsorgans vor?",
        type: "confirmation",
      },
      {
        id: "rg_darlehen_dritte",
        text: "Darlehen an Dritte: Keine Gewährung ohne Zustimmung.",
        help: "Wurden Darlehen an Dritte (z.B. Beteiligungsgesellschaften, andere Organisationen) vergeben?",
        type: "confirmation",
      },
      {
        id: "rg_buergschaften",
        text: "Bürgschaften: Keine Übernahme ohne Zustimmung.",
        help: "Wurden Bürgschaften oder vergleichbare Garantien übernommen?",
        type: "confirmation",
      },
      {
        id: "rg_beteiligungen",
        text: "Beteiligungen: Keine Gründung oder Beteiligung an Gesellschaften ohne Zustimmung.",
        help: "Wurden privatrechtliche Gesellschaften gegründet oder Beteiligungen eingegangen?",
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
        text: "Mindestlohngesetz eingehalten.",
        help: "Wurden die Vorgaben des Mindestlohngesetzes (MiLoG) für alle Beschäftigten eingehalten?",
        type: "confirmation",
      },
      {
        id: "ag_mutterschutz",
        text: "Mutterschutz-Vorgaben eingehalten.",
        help: "Wurden die gesetzlichen Vorgaben zum Mutterschutz (MuSchG) korrekt umgesetzt?",
        type: "confirmation",
      },
      {
        id: "ag_jugendschutz",
        text: "Kinder- und Jugendarbeitsschutz eingehalten.",
        help: "Wurden die Vorgaben des Jugendarbeitsschutzgesetzes (JArbSchG) eingehalten?",
        type: "confirmation",
      },
      {
        id: "ag_schwerbehinderte",
        text: "Vorgaben zum Umgang mit Schwerbehinderten eingehalten.",
        help: "Wurden die Pflichten nach dem SGB IX (Schwerbehindertenrecht) erfüllt?",
        type: "confirmation",
      },
      {
        id: "ag_auslaender",
        text: "Vorgaben zur Beschäftigung von Ausländern eingehalten.",
        help: "Wurden die gesetzlichen Regelungen zur Beschäftigung ausländischer Arbeitnehmer beachtet?",
        type: "confirmation",
      },
      {
        id: "ag_betriebsrat_existiert",
        text: "Im Kreisverband existiert ein Betriebsrat.",
        help: "Gibt es in Ihrer Gliederung einen oder mehrere Betriebsräte?",
        type: "confirmation",
      },
      {
        id: "ag_br_wahlen",
        text: "Betriebsratswahlen unbeeinflusst ermöglicht.",
        help: "Sofern im Geschäftsjahr Betriebsratswahlen stattfanden: Wurden diese frei und unbeeinflusst durchgeführt?",
        type: "confirmation",
        conditionalOn: { id: "ag_betriebsrat_existiert", value: "ja" },
      },
      {
        id: "ag_br_monatsgespraeche",
        text: "Monatsgespräche nach § 74 BetrVG durchgeführt.",
        help: "Haben regelmäßige Monatsgespräche zwischen Arbeitgeber und Betriebsrat gemäß § 74 BetrVG stattgefunden?",
        type: "confirmation",
        conditionalOn: { id: "ag_betriebsrat_existiert", value: "ja" },
      },
      {
        id: "ag_br_stoerungsfrei",
        text: "Betriebsratstätigkeit behinderungsfrei gewährleistet.",
        help: "Konnte der Betriebsrat seine Aufgaben ohne Behinderung oder Störung wahrnehmen?",
        type: "confirmation",
        conditionalOn: { id: "ag_betriebsrat_existiert", value: "ja" },
      },
      {
        id: "ag_br_pflichten",
        text: "Alle Pflichten nach BetrVG (Auskunft, Anhörung, Unterrichtung) erfüllt.",
        help: "Wurden die gesetzlichen Informations-, Anhörungs- und Unterrichtungspflichten nach dem BetrVG eingehalten?",
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
        text: "Mittel satzungsgemäß und zweckgebunden verwendet.",
        help: "Wurden alle zur Verfügung stehenden Mittel entsprechend der Satzung und Zweckbindung eingesetzt?",
        type: "confirmation",
      },
      {
        id: "fin_haushaltsplan",
        text: "Keine unzulässigen Überschreitungen des Haushaltsplans.",
        help: "Gab es Überschreitungen des genehmigten Haushaltsplans, die nicht vorab genehmigt wurden?",
        type: "confirmation",
      },
      {
        id: "fin_buchfuehrung",
        text: "Buchführung ordnungsgemäß.",
        help: "War die Buchführung der Gliederung im Geschäftsjahr ordnungsgemäß (GoB)?",
        type: "confirmation",
      },
      {
        id: "fin_vier_augen",
        text: "Vier-Augen-Prinzip bei Verträgen über 10 TEUR eingehalten.",
        help: "Wurde bei allen Vertragsabschlüssen mit einem Volumen über 10.000 € das Vier-Augen-Prinzip beachtet?",
        type: "confirmation",
      },
      {
        id: "fin_berichtspflichten",
        text: "Berichtspflichten gegenüber dem Aufsichtsorgan eingehalten.",
        help: "Wurden alle vorgeschriebenen Berichte (z.B. Quartalsberichte, Finanzberichte) fristgerecht vorgelegt?",
        type: "confirmation",
      },
      {
        id: "fin_controlling",
        text: "Wirtschaftliches Frühwarnsystem durch Controlling vorhanden.",
        help: "Existiert ein fortlaufendes Controlling-System, das als wirtschaftliches Frühwarnsystem dient?",
        type: "confirmation",
      },
      {
        id: "fin_versicherung",
        text: "Ausreichender D&O-Versicherungsschutz vorhanden.",
        help: "Besteht eine Directors-and-Officers-Versicherung (D&O) mit angemessener Versicherungssumme?",
        type: "confirmation",
      },
      {
        id: "fin_jahresabschluss",
        text: "Geprüfter Jahresabschluss erstellt und rechtzeitig vorgelegt.",
        help: "Wurde der Jahresabschluss von einem Wirtschaftsprüfer geprüft und dem Aufsichtsorgan fristgerecht vorgelegt?",
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
        text: "Revisionsprüfung ordnungsgemäß durchgeführt.",
        help: "Wurde die Revisionsprüfung entsprechend der Revisionsordnung des DRK-Landesverbandes durchgeführt?",
        type: "confirmation",
      },
      {
        id: "rev_hinweisgebersystem",
        text: "Funktionierendes Hinweisgebersystem vorhanden.",
        help: "Existiert ein Hinweisgebersystem (gem. HinSchG), über das Verstöße gemeldet werden können? Ist dieses funktionsfähig und bekannt?",
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
