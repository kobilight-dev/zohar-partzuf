import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { measureImages, loadNorms, saveToNorms, MEASURE_TO_OPTION, MEASURE_PROMPT } from "./yitroMeasure";

const PASSWORD = "K0bi#Z0h4r2026";
const DB_URL = "/zohar_rules_v2-7.json";
const LINES = ["חסד", "גבורה", "תפארת"];

// ─── כללי "רזא דרזין" שנוספו באפליקציה (אינם במאגר ה-JSON) ─────────────────
const T = "תיוג באפליקציה — לא נבדק מול מקור";
const LOCAL_RULES = [
  { id: "A401", organ: "שיער + גבות", condition: "שיער תלוי ושחור + גבות מחוברות חזק", interp: "בעל כעס שאינו מתפרץ מיד — מעכב את כעסו. מחזיק עצמו שהוא חכם ואינו כן. בעל מריבה בחוץ ובביתו שקט. אינו מחשיב את התורה.", source: "זוהר יתרו, רזא דרזין, אות קצ", line: "גבורה", valence: -1, domain: ["עסקי", "זוגי"] },
  { id: "A402", organ: "גבות — נפרדות", condition: "גבות נפרדות שאינן מגיעות זו לזו", interp: "כעס לפי שעה ומיד שוכך. בעל מריבה בביתו. פעם אחת בחייו משיב נמרצות. מצחו נקמט בשעת כעסו. עוסק בסחורה ועולה לעשירות.", source: "זוהר יתרו, רזא דרזין, אות קצב", line: "גבורה", valence: 0, domain: ["עסקי", "זוגי"] },
  { id: "A403", organ: "גבות — שערות ביניהן", condition: "שערות קטנות נכנסות בין הגבות", interp: "נוטר שנאה גדולה תמיד. טוב בביתו פנימה. קמצן. מסתיר כספו ומעשיו. אינו מתלבש כראוי. בעל לשון הרע.", source: "זוהר יתרו, רזא דרזין, אות קצג-קצד", line: "גבורה", valence: -1, domain: ["עסקי", "זוגי"] },
  { id: "A404", organ: "עיניים — צהובות", condition: "עיניים צהובות ופקוחות", interp: "נראה טוב וצדיק ואינו כן. משבח את עצמו. אם עוסק בתורה מתנהג כאדם גדול. מצליח בעשירות. רמאי בכל מעשיו. בעל לשון הרע.", source: "זוהר יתרו, רזא דרזין, אות ר", line: "ללא קו", valence: -1, domain: ["עסקי", "זוגי"] },
  { id: "A405", organ: "אוזניים גדולות תחת שיער", condition: "אוזניים גדולות עומדות תחת השיער", interp: "מעשיו לעיני בני אדם ורוצה שיראוהו. מי שמשתתף עימו אינו מצליח. הוא מצליח ברמאות ונראה כצדיק.", source: "זוהר יתרו, רזא דרזין, אות רא", line: "ללא קו", valence: -1, domain: ["עסקי"] },
  { id: "A406", organ: "מצח — קו גדול + קמטים", condition: "קו אחד גדול לרוחב + 4 קמטים קטנים בין הגבות", interp: "שמח, חכם, פיקח וותרן בכספו. כועס לפי שעה ומיד נרגע. אינו נוטר שנאה. כששב בתשובה עולה לכבוד גדול. כולם צריכים אליו.", source: "זוהר יתרו, רזא דרזין, אות קצז", line: "חסד", valence: 1, domain: ["עסקי", "זוגי"] },
  { id: "A407", organ: "גבות לבנות + שיער אדום", condition: "גבות לבנות עם שיער אדום", interp: "כל דבריו ברמאות. פיקח ונוטר שנאה. עיניו שקועות ומהיר במעשיו. צריכים להיזהר ממנו.", source: "זוהר יתרו, רזא דרזין, אות רז", line: "גבורה", valence: -1, domain: ["עסקי", "זוגי"], rare: true },
  { id: "A408", organ: "מצח — גדול ולא עגול", condition: "מצח גדול ולא עגול, 2 רשימות גדולות + 4 קטנות", interp: "קר מוח ולכן פיקח. אוזניים קטנות. שיער תלוי. בזרועותיו שיער רב. עלול להתהפך בין טוב לרע.", source: "זוהר יתרו, רזא דרזין, אות רח", line: "ללא קו", valence: 0, domain: ["כללי"] },
  { id: "A409", organ: "מצח — גדול ועגול ביופי", condition: "מצח גדול ועגול ביופי עם קווים עולים ויורדים", interp: "אדם גדול ומיוחד — דיוקן עליון. עיניו מלאות שמחה, חן וחסד. הרשעים פוחדים והצדיקים נמשכים אליו.", source: "זוהר יתרו, רזא דרזין, אות רי", line: "חסד", valence: 1, domain: ["זוגי"], rare: true },
  { id: "A410", organ: "מצח — 5 קווים", condition: "5 קווים במצח (3 עוברים, 2 לא עוברים)", interp: "בעל מחלוקת בביתו. כל מעשיו במהירות. נראה טוב ואינו כן. משבח עצמו.", source: "זוהר יתרו, רזא דרזין, אות קצט", line: "גבורה", valence: -1, domain: ["עסקי", "זוגי"] },
  { id: "A411", organ: "עיניים שקועות — אזהרה", condition: "עיניים שקועות מאוד", interp: "לפי הזוהר: מי שעיניו שקועות — צריכים להיזהר ממנו בכל המעשים.", source: "זוהר יתרו, רזא דרזין, אות רז", line: "גבורה", valence: -1, domain: ["עסקי", "זוגי"] },
  { id: "A412", organ: "שיער + עיניים", condition: "שיער מסולסל מעט + עין ימין כמעט סגורה", interp: "ללא תבונה, שיגעון בלבו, מבוהל במעשיו.", source: "זוהר יתרו, רזא דרזין, אות רג", line: "ללא קו", valence: -1, domain: ["כללי"] },
  { id: "A415", organ: "דיוקן — עיניים של רחמים", condition: "עיניים עם חוט ירוק שמתהפך לאדום במלחמה", interp: "דיוקן המלך דוד — עיניים של רחמים ושמחה. הרשעים פוחדים ממנו.", source: "זוהר יתרו, רזא דרזין, אות רט", line: "תפארת", valence: 1, domain: ["כללי"], rare: true },
].map((r) => ({ ...r, verification: { status: T } }));
const RARE = new Set(["Z5", "Z8", "Z12", "Z26", "Z88", "Z41", "Z92", "Z123", "Z81", "Z82"]);
const ruleIdOf = (n) => (n >= 400 ? `A${n}` : `Z${n}`);

const TRAITS = [
  { id: "forehead", label: "מצח", icon: "◻", options: ["", "רחב וחלק מאוד", "צר ונמוך", "בולט קדימה", "גדול ועגול ביופי", "גדול ולא עגול", "עור מצח מבריק", "עור המצח מחוספס"] },
  { id: "forehead_lines", label: "קמטי מצח", icon: "≡", options: ["", "3 קמטים ישרים", "2 קמטים אנכיים בין הגבות", "3 קמטים אנכיים בין הגבות", "קמטים שבורים", "קמט אחד לרוחב", "קמט V", "קמט אלכסוני", "קמטים דמויי סולם", "קמטים בצורת ח", "קמטים עמוקים מאוד", "קמטים נחתכים אנכית", "נקודת חן במרכז המצח", "קו גדול + 4 קמטים בין הגבות", "5 קווים (3 עוברים 2 לא)"] },
  { id: "eye_color", label: "עיניים — צבע", icon: "◉", options: ["", "לבן דומיננטי וצלול", "אדמדמות — נימים בולטים", "אישון שחור גדול", "ירוק / צהבהב", "צהובות ופקוחות", "צבע משתנה", "עין אחת שונה מהשנייה", "נקודה שחורה בלובן", "חוט ירוק בין העיניים"] },
  { id: "eye_position", label: "עיניים — מיקום", icon: "⊙", options: ["", "שקועות עמוק", "שקועות מאוד — אזהרה", "בולטות", "בולטות עם לובן סביב", "עפעפיים מכסים חצי", "עין ימין כמעט סגורה", "עפעף תחתון בולט", "ריסים ארוכים וכהים"] },
  { id: "gaze", label: "מבט", icon: "→", options: ["", "ישיר שאינו זז", "מתרוצץ", "שפוף — למטה"] },
  { id: "eyebrows", label: "גבות", icon: "∧", options: ["", "עבות ומחוברות", "דקות ובהירות", "גבה אחת גבוהה", "קשתיות ויפות", "לבנות", "רחוקות זו מזו", "קרובות מאוד", "נפרדות — אינן מגיעות זו לזו", "שערות קטנות ביניהן", "שערות בולטות לכל עבר"] },
  { id: "nose", label: "חוטם", icon: "▽", options: ["", "ישר וממוצע", "כפוף — נשרי", "נחיריים רחבים", "נחיריים צרים", "קצר וסולד", "ארוך מאוד", "רחב בבסיסו", "דק בבסיסו"] },
  { id: "lips", label: "שפתיים ופה", icon: "◡", options: ["", "עבות ובשרניות", "דקות ומתוחות", "שפה עליונה בולטת", "שפה תחתונה בולטת", "שפה עליונה מחורצת", "פינות פה למעלה", "פינות פה למטה", "פה קטן מאוד", "פה גדול ופתוח"] },
  { id: "teeth", label: "שיניים", icon: "⌒", options: ["", "לבנות וישרות", "קטנות ורווחים", "בולטות קדימה", "צהובות"] },
  { id: "chin", label: "סנטר ולחיים", icon: "◟", options: ["", "סנטר מחודד וחזק", "סנטר כפול", "גומה בסנטר", "לחיים נפוחות ואדומות", "לחיים שקועות וחוורות", "גומות חן בלחיים"] },
  { id: "hair", label: "שיער", icon: "〜", options: ["", "שחור וקשה", "לבן בגיל צעיר", "אדמוני", "מקורזל מאוד", "רך וחלק", "מכסה האוזניים", "מלבין רק בצדדים", "שומני מאוד", "התקרחות קדמית", "התקרחות אחורית"] },
  { id: "ears", label: "אוזניים", icon: "◖", options: ["", "גדולות ובשרניות", "גדולות עומדות תחת השיער", "קטנות וצמודות", "תנוך ארוך", "תנוך מחובר ללחי", "תנוך חופשי", "שערות בתוך האוזן", "אדומות תמיד"] },
  { id: "beard", label: "זקן", icon: "Ω", options: ["", "ארוך ומלא", "קצר ומסודר", "חוסר שיער בלחיים"] },
  { id: "voice", label: "קול", icon: "♪", options: ["", "עמוק ונמוך", "דק וגבוה", "צרוד"] },
  { id: "neck", label: "צוואר וכתפיים", icon: "↕", options: ["", "צוואר ארוך ודק", "צוואר קצר ועבה", "כתפיים רחבות", "כתפיים שמוטות"] },
  { id: "skin", label: "עור", icon: "◈", options: ["", "יבש ונוקשה", "לח ומבריק", "נקודות חן כהות"] },
  { id: "face_shape", label: "צורת פנים", icon: "○", options: ["", "מאורכות — סגלגלות", "עגולות ומלאות", "מרובעות", "חוורות / ירוקות", "מאירות / זהובות"] },
  { id: "palm", label: "כף היד", icon: "✋", options: ["", "רחבה ובשרנית", "צרה וארוכה", "חמה ומזיעה", "קרה תמיד"] },
  { id: "palm_lines", label: "קווי יד", icon: "〳", options: ["", "קו חיים ארוך", "קו לב מגיע למורה", "קו ראש קצר", "קווי רשת מרובים", "שרטוט דמוי מ", "שרטוט דמוי ש"] },
  { id: "fingers", label: "אצבעות וציפורניים", icon: "|||", options: ["", "ארוכות ודקות", "קצרות ועבות", "אגודל גדול", "מורה ארוכה מקמיצה", "קמיצה ארוכה ממורה", "ציפורניים רחבות קצרות", "ציפורניים ארוכות מטופחות", "כתמים לבנים"] },
];

const OPTION_TO_RULE = {
  forehead: { "רחב וחלק מאוד": 1, "צר ונמוך": 2, "בולט קדימה": 7, "גדול ועגול ביופי": 409, "גדול ולא עגול": 408, "עור מצח מבריק": 8, "עור המצח מחוספס": 106 },
  forehead_lines: { "3 קמטים ישרים": 3, "2 קמטים אנכיים בין הגבות": 85, "3 קמטים אנכיים בין הגבות": 86, "קמטים שבורים": 87, "קמט אחד לרוחב": 10, "קמט V": 118, "קמט אלכסוני": 105, "קמטים דמויי סולם": 11, "קמטים בצורת ח": 5, "קמטים עמוקים מאוד": 6, "קמטים נחתכים אנכית": 4, "נקודת חן במרכז המצח": 12, "קו גדול + 4 קמטים בין הגבות": 406, "5 קווים (3 עוברים 2 לא)": 410 },
  eye_color: { "לבן דומיננטי וצלול": 13, "אדמדמות — נימים בולטים": 14, "אישון שחור גדול": 15, "ירוק / צהבהב": 16, "צהובות ופקוחות": 404, "צבע משתנה": 25, "עין אחת שונה מהשנייה": 88, "נקודה שחורה בלובן": 26, "חוט ירוק בין העיניים": 415 },
  eye_position: { "שקועות עמוק": 21, "שקועות מאוד — אזהרה": 411, "בולטות": 22, "בולטות עם לובן סביב": 89, "עפעפיים מכסים חצי": 20, "עין ימין כמעט סגורה": 412, "עפעף תחתון בולט": 107, "ריסים ארוכים וכהים": 23 },
  gaze: { "ישיר שאינו זז": 17, "מתרוצץ": 18, "שפוף — למטה": 108 },
  eyebrows: { "עבות ומחוברות": 27, "דקות ובהירות": 28, "גבה אחת גבוהה": 29, "קשתיות ויפות": 30, "לבנות": 407, "רחוקות זו מזו": 90, "קרובות מאוד": 91, "נפרדות — אינן מגיעות זו לזו": 402, "שערות קטנות ביניהן": 403, "שערות בולטות לכל עבר": 109 },
  nose: { "ישר וממוצע": 44, "כפוף — נשרי": 45, "נחיריים רחבים": 46, "נחיריים צרים": 47, "קצר וסולד": 48, "ארוך מאוד": 49, "רחב בבסיסו": 98, "דק בבסיסו": 99 },
  lips: { "עבות ובשרניות": 50, "דקות ומתוחות": 51, "שפה עליונה בולטת": 52, "שפה תחתונה בולטת": 53, "שפה עליונה מחורצת": 100, "פינות פה למעלה": 54, "פינות פה למטה": 55, "פה קטן מאוד": 101, "פה גדול ופתוח": 102 },
  teeth: { "לבנות וישרות": 56, "קטנות ורווחים": 57, "בולטות קדימה": 58, "צהובות": 103 },
  chin: { "סנטר מחודד וחזק": 59, "סנטר כפול": 60, "גומה בסנטר": 61, "לחיים נפוחות ואדומות": 62, "לחיים שקועות וחוורות": 63, "גומות חן בלחיים": 104 },
  hair: { "שחור וקשה": 31, "לבן בגיל צעיר": 32, "אדמוני": 33, "מקורזל מאוד": 34, "רך וחלק": 37, "מכסה האוזניים": 38, "מלבין רק בצדדים": 92, "שומני מאוד": 110, "התקרחות קדמית": 35, "התקרחות אחורית": 36 },
  ears: { "גדולות ובשרניות": 39, "גדולות עומדות תחת השיער": 405, "קטנות וצמודות": 40, "תנוך ארוך": 42, "תנוך מחובר ללחי": 96, "תנוך חופשי": 97, "שערות בתוך האוזן": 41, "אדומות תמיד": 43 },
  beard: { "ארוך ומלא": 93, "קצר ומסודר": 94, "חוסר שיער בלחיים": 95 },
  voice: { "עמוק ונמוך": 67, "דק וגבוה": 68, "צרוד": 69 },
  neck: { "צוואר ארוך ודק": 70, "צוואר קצר ועבה": 71, "כתפיים רחבות": 72, "כתפיים שמוטות": 73 },
  skin: { "יבש ונוקשה": 64, "לח ומבריק": 65, "נקודות חן כהות": 66 },
  face_shape: { "מאורכות — סגלגלות": 119, "עגולות ומלאות": 120, "מרובעות": 121, "חוורות / ירוקות": 122, "מאירות / זהובות": 123 },
  palm: { "רחבה ובשרנית": 74, "צרה וארוכה": 75, "חמה ומזיעה": 114, "קרה תמיד": 113 },
  palm_lines: { "קו חיים ארוך": 79, "קו לב מגיע למורה": 111, "קו ראש קצר": 112, "קווי רשת מרובים": 80, "שרטוט דמוי מ": 81, "שרטוט דמוי ש": 82 },
  fingers: { "ארוכות ודקות": 76, "קצרות ועבות": 77, "אגודל גדול": 78, "מורה ארוכה מקמיצה": 115, "קמיצה ארוכה ממורה": 116, "ציפורניים רחבות קצרות": 83, "ציפורניים ארוכות מטופחות": 84, "כתמים לבנים": 117 },
};

// כללי הספר (B) ותוספות N — נכנסים לתפריטים אוטומטית לפי האיבר
const ORGAN_TO_TRAIT = { "עיניים": "eye_color", "גבות": "eyebrows", "שיער": "hair", "אוזניים": "ears", "חוטם": "nose", "שפתיים": "lips", "פה": "lips", "שיניים": "teeth", "לחיים": "chin", "סנטר": "chin", "קול": "voice", "צוואר": "neck", "כתפיים": "neck", "ידיים": "palm", "אצבעות": "fingers", "קווים ביד": "palm_lines", "ציפורניים": "fingers", "זקן": "beard", "עור": "skin", "פנים": "face_shape" };
function traitForRule(r) {
  const c = r.condition;
  if (r.organ === "מצח") return c.includes("קו") ? "forehead_lines" : "forehead";
  if (r.organ === "עיניים") return /הנעות|מצמוץ/.test(c) ? "gaze" : /שקוע|פקוח|בולט|גדולה/.test(c) ? "eye_position" : "eye_color";
  if (c.includes("אצבע")) return "fingers";
  return ORGAN_TO_TRAIT[r.organ] || "other";
}

function flattenDb(json) {
  const out = [];
  for (const rs of Object.values(json.by_organ || {}))
    for (const r of rs) if (r.active !== false)
      out.push({ id: r.id, organ: r.organ, condition: r.condition, interp: r.meaning, source: r.page ? `${r.source}, עמ' ${r.page}` : r.source, line: r.line, valence: r.valence, domain: r.domain || [], verification: r.verification, rare: RARE.has(r.id), type: r.type });
  return out;
}

// ─── חישוב התאמה לפי עקרון הכללת ימין (חסד) ושמאל (גבורה) ───────────────
function lineProfile(rules, mode) {
  const dom = mode === "shidduch" ? "זוגי" : "עסקי";
  const v = { "חסד": 0, "גבורה": 0, "תפארת": 0 };
  let val = 0, w = 0;
  for (const r of rules) {
    const wt = r.domain?.includes(dom) ? 1 : r.domain?.includes("כללי") ? 0.5 : 0.25;
    if (LINES.includes(r.line)) v[r.line] += wt;
    val += (r.valence ?? 0) * wt; w += wt;
  }
  return { v, valence: w ? val / w : 0, n: rules.length };
}
function computeCompat(r1, r2, mode) {
  const a = lineProfile(r1, mode), b = lineProfile(r2, mode);
  const C = a.v["חסד"] + b.v["חסד"], G = a.v["גבורה"] + b.v["גבורה"], Tf = a.v["תפארת"] + b.v["תפארת"], S = C + G + Tf;
  if (a.n < 3 || b.n < 3 || S === 0) return { score: null, reason: "אין די כללים מתויגים (לפחות 3 לכל אדם) לחישוב" };
  const balance = C + G > 0 ? 1 - Math.abs(C - G) / (C + G) : 0.5;
  const tiferet = Tf / S;
  const dA = a.v["חסד"] - a.v["גבורה"], dB = b.v["חסד"] - b.v["גבורה"];
  const complement = dA * dB < 0 ? 1 : dA * dB === 0 ? 0.5 : 0;
  const valN = ((a.valence + b.valence) / 2 + 1) / 2;
  const W = mode === "shidduch" ? { balance: 0.35, tiferet: 0.2, complement: 0.2, valN: 0.25 } : { balance: 0.25, tiferet: 0.15, complement: 0.1, valN: 0.5 };
  const parts = { balance, tiferet, complement, valN };
  const score = Math.round(100 * Object.keys(W).reduce((s, k) => s + W[k] * parts[k], 0));
  return { score, parts, weights: W, a, b };
}

const VISION_SYSTEM = `אתה מומחה לחכמת הפרצוף הקבלית. בחן תמונות של פנים/ידיים וזהה מאפיינים פיזיים גלויים בלבד.
חוקים: תאר אך ורק מה שאתה רואה. אל תנחש — אם לא ברור השאר ריק. אל תזהה את האדם. ודא שכל התמונות הן של אותו אדם, ואם לא — כתוב זאת ב-visible_notes. פלט JSON בלבד.`;
const VISION_USER = (tl) =>
  `זהה מאפיינים גלויים. עבור כל שדה בחר ערך אחד בדיוק מהרשימה, או השאר ריק:\n${tl.map((t) => `${t.id}: [${t.options.filter(Boolean).join(" | ")}]`).join("\n")}\nהחזר JSON בלבד עם המפתחות: ${tl.map((t) => t.id).join(", ")}, visible_notes`;

const SOLO_SYSTEM = (n) => `אתה חוקר טקסטואלי מומחה בזוהר פרשת יתרו ופירוש הסולם — חכמת הפרצוף.
יש לך מסד של ${n} כללים. השתמש רק בכללים שנמסרו לך. כלל המסומן "סתירה למקור" — ציין זאת ואל תבסס עליו מסקנה. זכור: "אין הדברים מוכרחים" — הסימנים הם נטייה ולא גזירה. פלט בעברית.
החזר JSON בלבד:
{"diyukna":"","midot":[],"tikkun":"","archetype":""}`;

const MATCH_SYSTEM = (mode) => `אתה חוקר טקסטואלי מומחה בזוהר פרשת יתרו ופירוש הסולם — חכמת הפרצוף.
נתח התאמה בין שני אנשים לפי ${mode === "shidduch" ? "שידוך זוגי" : "שותפות עסקית"}.
הציון חושב מראש לפי קווי חסד/גבורה/תפארת של הכללים — אל תשנה אותו; הסבר אותו לפי עקרון הכללת ימין בשמאל.
החזר JSON בלבד:
{"title":"","score_label":"","summary":"","strong_points":[],"tension_points":[],"recommendation":"","zohar_principle":""}`;

const MEASURE_LABELS = { faceHeightToWidth: "אורך/רוחב פנים", fWHR: "fWHR", foreheadWidthRatio: "רוחב מצח", foreheadHeightRatio: "גובה מצח", jawToCheekRatio: "לסת/לחיים", eyeSpacingRatio: "מרחק עיניים", eyeOpenness: "פתיחות עיניים", browToEyeRatio: "גבה־עין", noseLengthRatio: "אורך חוטם", noseWidthRatio: "רוחב נחיריים", lipThicknessRatio: "עובי שפתיים", upperToLowerLip: "שפה עליונה/תחתונה", mouthCornerTilt: "נטיית פינות פה", mouthWidthRatio: "רוחב פה", lipAsymmetry: "אי־סימטריה בשפתיים", browGapRatio: "מרווח גבות", browLengthRatio: "אורך גבות", palmWidthToLength: "רוחב/אורך כף", middleFingerToPalm: "אמה/כף", thumbToPalm: "אגודל/כף", indexToRing: "מורה/קמיצה" };

const fileToBase64 = (f) => new Promise((r, j) => { const x = new FileReader(); x.onload = () => r(x.result.split(",")[1]); x.onerror = j; x.readAsDataURL(f); });
const blobToBase64 = (b) => new Promise((r, j) => { const x = new FileReader(); x.onload = () => r(x.result.split(",")[1]); x.onerror = j; x.readAsDataURL(b); });

const callClaude = async (messages, system, max_tokens = 1000) => {
  const resp = await fetch("/.netlify/functions/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json", "zzz": "uqvI7T-d8uLHiB5Y1QGbD2yeLlrI6RrEoivouBa1NEFoBRkUkOG_qya2VkfBbMqEIzDL67o8IZrxELhdNQ1tGw-z2KYhQAAapi03-j2YRaWutafWbFI3zSKyEtBMvOa1jme-0C2SgVZBdLUIGCJ2fpRZL2H3ZP8weWTMFquO-4k8nqe5nC34o259qfg-jFp_3AAA", "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens, system, messages }),
  });
  const data = await resp.json();
  if (data.error) throw new Error(data.error.message);
  const text = data.content?.find((b) => b.type === "text")?.text || "";
  return text.replace(/```json|```/g, "").trim();
};

function PasswordGate({ onOk }) {
  const [pw, setPw] = useState(""), [bad, setBad] = useState(false);
  const tryIt = () => { if (pw === PASSWORD) { try { sessionStorage.setItem("yitro_auth", "1"); } catch {} onOk(); } else setBad(true); };
  return (<div style={{ position: "fixed", inset: 0, background: "#1A1208", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", direction: "rtl", fontFamily: "sans-serif" }}>
    <h2 style={{ color: "#C9A84C", marginBottom: 20, fontWeight: 400, fontFamily: "Georgia, serif" }}>ואתה תחזה מכל העם</h2>
    <input type="password" value={pw} autoFocus onChange={(e) => { setPw(e.target.value); setBad(false); }} onKeyDown={(e) => e.key === "Enter" && tryIt()} placeholder="סיסמה"
      style={{ padding: 10, fontSize: 18, textAlign: "center", borderRadius: 8, border: "2px solid #C9A84C", background: "#2C1F0A", color: "white", marginBottom: 12 }} />
    {bad && <div style={{ color: "#F5B8C0", fontSize: 13, marginBottom: 10 }}>הסיסמה שגויה. נסה שוב.</div>}
    <button onClick={tryIt} style={{ padding: "10px 30px", background: "#C9A84C", color: "#1A1208", fontWeight: "bold", fontSize: 16, borderRadius: 8, border: "none", cursor: "pointer" }}>כניסה</button>
  </div>);
}

function CameraModal({ onCapture, onClose }) {
  const vr = useRef(null), cr = useRef(null), sr = useRef(null);
  const [ready, setReady] = useState(false), [facing, setFacing] = useState("user"), [flash, setFlash] = useState(false), [err, setErr] = useState(null);
  const start = useCallback(async (fm) => {
    sr.current?.getTracks().forEach((t) => t.stop()); setErr(null); setReady(false);
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: fm, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false });
      sr.current = s; if (vr.current) { vr.current.srcObject = s; vr.current.onloadedmetadata = () => { vr.current.play(); setReady(true); }; }
    } catch (e) { setErr("לא ניתן לגשת למצלמה — אשר גישה בהגדרות הדפדפן"); }
  }, []);
  useEffect(() => { start("user"); return () => sr.current?.getTracks().forEach((t) => t.stop()); }, [start]);
  const flip = () => { const n = facing === "user" ? "environment" : "user"; setFacing(n); start(n); };
  const capture = () => {
    if (!vr.current || !cr.current) return; const v = vr.current, c = cr.current; c.width = v.videoWidth; c.height = v.videoHeight;
    const ctx = c.getContext("2d"); if (facing === "user") { ctx.translate(c.width, 0); ctx.scale(-1, 1); } ctx.drawImage(v, 0, 0);
    setFlash(true); setTimeout(() => setFlash(false), 180);
    c.toBlob(async (b) => { onCapture({ base64: await blobToBase64(b), preview: URL.createObjectURL(b), mediaType: "image/jpeg" }); }, "image/jpeg", 0.92);
  };
  const round = { width: 44, height: 44, borderRadius: "50%", background: "#33251566", border: "1px solid #EDE4CC44", color: "#F5EDD8", fontSize: 17, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" };
  return (<div style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(0,0,0,0.93)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
    {flash && <div style={{ position: "absolute", inset: 0, background: "white", opacity: 0.55, zIndex: 10, pointerEvents: "none" }} />}
    <div style={{ position: "relative", width: "100%", maxWidth: 460 }}>
      <div style={{ position: "relative", background: "#000", borderRadius: 12, overflow: "hidden" }}>
        <video ref={vr} style={{ width: "100%", display: "block", transform: facing === "user" ? "scaleX(-1)" : "none", maxHeight: "58vh", objectFit: "cover" }} playsInline muted />
        {ready && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}><div style={{ width: "55%", height: "75%", border: "2px solid #C9A84C88", borderRadius: "50%" }} /></div>}
        {err && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#1A120899", color: "#F5EDD8", fontFamily: "sans-serif", fontSize: 13, textAlign: "center", padding: "1rem" }}>{err}</div>}
        {!ready && !err && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#1A1208", color: "#C9A84C", fontFamily: "sans-serif", fontSize: 12 }}>טוען מצלמה...</div>}
      </div><canvas ref={cr} style={{ display: "none" }} />
    </div>
    <div style={{ color: "#C4B490", fontFamily: "sans-serif", fontSize: 11, marginTop: 8 }}>פנים: מבט ישר, הבעה ניטרלית, אור אחיד. כף יד: פרושה, על רקע חלק.</div>
    <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 16 }}>
      <button onClick={onClose} style={round}>✕</button>
      <button onClick={capture} disabled={!ready} style={{ width: 66, height: 66, borderRadius: "50%", background: ready ? "#C9A84C" : "#555", border: "4px solid rgba(255,255,255,0.25)", cursor: ready ? "pointer" : "not-allowed" }} />
      <button onClick={flip} style={round}>⟳</button>
    </div>
  </div>);
}

const LINE_COLOR = { "חסד": "#2d6a1f", "גבורה": "#8B1A1A", "תפארת": "#1a3a72", "ללא קו": "#7A6040" };
function RuleCard({ rule }) {
  const st = rule.verification?.status;
  return (<div style={{ background: "#FDF8EE", border: `1px solid ${rule.rare ? "#C9A84C" : "#EDE4CC"}`, borderRadius: 8, padding: "0.65rem 0.8rem", borderRight: rule.rare ? "4px solid #C9A84C" : undefined }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, gap: 6, flexWrap: "wrap" }}>
      <span style={{ fontFamily: "sans-serif", fontWeight: 600, fontSize: 12, color: "#2C1F0A" }}>{rule.organ}{rule.rare && <span style={{ marginRight: 5, fontSize: 9, color: "#C9A84C", border: "1px solid #C9A84C", borderRadius: 4, padding: "1px 5px" }}>נדיר</span>}</span>
      {rule.line && <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 10, background: "#fff", border: `1px solid ${LINE_COLOR[rule.line] || "#999"}`, color: LINE_COLOR[rule.line] || "#555", fontFamily: "sans-serif" }}>{rule.line}</span>}
    </div>
    <div style={{ fontSize: 11, color: "#7A6040", fontFamily: "sans-serif", marginBottom: 3 }}>תנאי: {rule.condition}</div>
    <div style={{ fontSize: 12.5, lineHeight: 1.65, color: "#2C1F0A", fontFamily: "sans-serif" }}>{rule.interp}</div>
    {st === "סתירה למקור" && <div style={{ marginTop: 5, background: "#FEF0F0", border: "1px solid #FCCACA", borderRadius: 5, padding: "4px 7px", fontSize: 10.5, color: "#8B1A1A", fontFamily: "sans-serif", lineHeight: 1.5 }}>⚠ סתירה למקור: {rule.verification.note}</div>}
    <div style={{ marginTop: 5, paddingTop: 5, borderTop: "1px solid #EDE4CC", fontSize: 10, color: "#9A8060", fontFamily: "sans-serif" }}>
      {rule.id} • {rule.source}{st && st !== "סתירה למקור" ? ` • ${st}` : ""}
    </div>
  </div>);
}

function MeasurementPanel({ m }) {
  if (!m) return null;
  if (m.error) return <div style={{ fontFamily: "sans-serif", fontSize: 11, color: "#7A6040", marginBottom: "0.6rem" }}>{m.error}</div>;
  const rows = [...Object.entries(m.face || {}), ...Object.entries(m.hand || {})];
  return (<details style={{ background: "#FDF8EE", border: "1px solid #EDE4CC", borderRadius: 6, padding: "0.4rem 0.7rem", marginBottom: "0.6rem", fontFamily: "sans-serif" }}>
    <summary style={{ fontSize: 11, color: "#5C4A2A", cursor: "pointer" }}>מדידות אובייקטיביות ({m.faceImages} תמונות פנים, {m.handImages} כפות יד, {m.profileCount} פרופיל)</summary>
    <div style={{ display: "grid", gap: 2, marginTop: 6 }}>
      {rows.map(([k, v]) => (<div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#2C1F0A" }}>
        <span>{MEASURE_LABELS[k] || k}</span><span style={{ color: v.label === "לא מכויל" ? "#9A8060" : "#1a3a72" }}>{v.value} • {v.label}</span>
      </div>))}
    </div>
    {m.warnings?.length > 0 && <div style={{ marginTop: 6, fontSize: 10.5, color: "#854F0B", lineHeight: 1.5 }}>{m.warnings.map((w, i) => <div key={i}>△ {w}</div>)}</div>}
    <div style={{ marginTop: 6, fontSize: 10, color: "#9A8060" }}>"לא מכויל" = עדיין אין מספיק מדידות קודמות להשוואה (נשמרים רק מספרים, במכשיר זה).</div>
  </details>);
}

function PersonPanel({ label, color, person, traits, rulesFor, onAddFiles, onCamera, onRemoveImage, onDetect, onAnalyze, onTraitChange, onBack }) {
  const { images, result, phase, detectedNotes, measurements, autoFilled = [] } = person;
  const selectedCount = Object.values(person.traits).filter(Boolean).length;
  const localRules = rulesFor(person.traits);
  const full = images.length >= 4;
  return (<div>
    <div style={{ background: color, borderRadius: 8, padding: "0.55rem 0.9rem", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ color: "white", fontFamily: "sans-serif", fontSize: 13, fontWeight: 600 }}>{label}</span>
      {result && <span style={{ marginRight: "auto", background: "rgba(255,255,255,0.2)", color: "white", fontSize: 10, padding: "2px 8px", borderRadius: 12, fontFamily: "sans-serif" }}>✓ נותח</span>}
    </div>
    {phase === "upload" && (<>
      <div style={{ fontFamily: "sans-serif", fontSize: 11, color: "#5C4A2A", marginBottom: 6, lineHeight: 1.5 }}>עד 4 תמונות: פנים מלפנים, פנים מהצד, כף יד פרושה, ותמונה נוספת לדיוק.</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, marginBottom: "0.7rem" }}>
        <button onClick={onCamera} disabled={full} style={{ padding: "0.8rem 0.4rem", background: full ? "#EDE4CC" : "#1A1208", color: full ? "#9A8060" : "#C9A84C", border: `2px solid ${full ? "#EDE4CC" : "#C9A84C"}`, borderRadius: 9, cursor: full ? "not-allowed" : "pointer", fontFamily: "sans-serif", fontSize: 12, fontWeight: 600, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
          <span style={{ fontSize: 22 }}>📷</span>מצלמה
        </button>
        {/* שדה הקובץ עצמו מכסה את כל האריח — פותר את תפריט ההעתק/הדבק באנדרואיד */}
        <label style={{ position: "relative", padding: "0.8rem 0.4rem", border: "2px dashed #EDE4CC", borderRadius: 9, background: "#FDF8EE", cursor: full ? "not-allowed" : "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, fontFamily: "sans-serif", fontSize: 12, fontWeight: 600, color: "#5C4A2A", overflow: "hidden" }}>
          <span style={{ fontSize: 22 }}>🖼</span>גלריה
          <input type="file" accept="image/*" multiple disabled={full} onChange={(e) => { onAddFiles(e.target.files); e.target.value = ""; }}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, cursor: full ? "not-allowed" : "pointer" }} />
        </label>
      </div>
      {images.length > 0 && (<>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 5, marginBottom: "0.65rem" }}>
          {images.map((img, i) => (<div key={i} style={{ position: "relative", borderRadius: 5, overflow: "hidden", aspectRatio: "1", border: `2px solid ${color}` }}>
            <img src={img.preview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <button onClick={() => onRemoveImage(i)} aria-label="הסר תמונה" style={{ position: "absolute", top: 2, left: 2, background: "rgba(26,18,8,0.8)", color: "#F5EDD8", border: "none", borderRadius: "50%", width: 18, height: 18, fontSize: 12, cursor: "pointer", padding: 0 }}>×</button>
          </div>))}
        </div>
        <button onClick={onDetect} style={{ width: "100%", padding: "0.65rem", background: color, color: "white", border: "none", borderRadius: 7, fontFamily: "sans-serif", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>מדוד וזהה מאפיינים מ־{images.length} תמונות</button>
      </>)}
      <div style={{ textAlign: "center", marginTop: "0.55rem" }}>
        <button onClick={() => onTraitChange("__goto_review")} style={{ background: "transparent", border: "none", color: "#9A8060", fontFamily: "sans-serif", fontSize: 11, cursor: "pointer", textDecoration: "underline" }}>הזנה ידנית</button>
      </div>
    </>)}
    {(phase === "detecting" || phase === "analyzing") && (<div style={{ textAlign: "center", padding: "2rem 1rem" }}>
      <div style={{ width: 40, height: 40, border: "3px solid #EDE4CC", borderTop: `3px solid ${color}`, borderRadius: "50%", margin: "0 auto 0.75rem", animation: "spin 1s linear infinite" }} />
      <div style={{ fontFamily: "sans-serif", fontSize: 12, color: "#2C1F0A" }}>{phase === "detecting" ? "מודד ובוחן תמונות..." : "מנתח לפי הזוהר..."}</div>
    </div>)}
    {phase === "review" && (<>
      {detectedNotes && <div style={{ background: "#F0EAD6", borderRight: "3px solid #C9A84C", borderRadius: "0 6px 6px 0", padding: "0.5rem 0.7rem", marginBottom: "0.6rem", fontFamily: "sans-serif", fontSize: 11, color: "#2C1F0A" }}>{detectedNotes}</div>}
      <MeasurementPanel m={measurements} />
      {localRules.length > 0 && (<div style={{ marginBottom: "0.65rem" }}>
        <div style={{ fontSize: 10, fontFamily: "sans-serif", color: "#8B4513", marginBottom: 5, fontWeight: 600 }}>{localRules.length} כללים מהמאגר</div>
        <div style={{ display: "grid", gap: "0.35rem", maxHeight: 220, overflowY: "auto" }}>{localRules.map((r) => <RuleCard key={r.id} rule={r} />)}</div>
      </div>)}
      <div style={{ display: "grid", gap: "0.4rem", marginBottom: "0.8rem", maxHeight: 300, overflowY: "auto" }}>
        {traits.map((trait) => (<div key={trait.id} style={{ background: "#FDF8EE", border: `1px solid ${person.traits[trait.id] ? color : "#EDE4CC"}`, borderRadius: 6, padding: "0.4rem 0.65rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontFamily: "sans-serif", color: "#5C4A2A", marginBottom: 3, fontWeight: 500 }}>
            <span style={{ color, minWidth: 13 }}>{trait.icon}</span>{trait.label}
            {person.traits[trait.id] && <span style={{ marginRight: "auto", fontSize: 8, background: "#F0E8CC", color: "#8B4513", padding: "1px 5px", borderRadius: 7 }}>{autoFilled.includes(trait.id) ? "נמדד" : "זוהה"}</span>}
          </label>
          <select value={person.traits[trait.id] || ""} onChange={(e) => onTraitChange(trait.id, e.target.value)} style={{ width: "100%", padding: "4px 6px", border: "1px solid #EDE4CC", borderRadius: 4, background: "white", color: "#2C1F0A", fontFamily: "sans-serif", fontSize: 11, direction: "rtl" }}>
            <option value="">— לא זוהה —</option>
            {trait.options.filter(Boolean).map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 6 }}>
        <button onClick={onBack} style={{ padding: "0.6rem 0.8rem", background: "transparent", border: "1px solid #EDE4CC", borderRadius: 6, fontFamily: "sans-serif", fontSize: 11, color: "#7A6A50", cursor: "pointer" }}>← חזור</button>
        <button onClick={onAnalyze} disabled={selectedCount === 0} style={{ padding: "0.6rem", background: selectedCount > 0 ? color : "#C5BAA0", color: selectedCount > 0 ? "white" : "#9A8F7A", border: "none", borderRadius: 6, fontFamily: "sans-serif", fontSize: 12, fontWeight: 600, cursor: selectedCount > 0 ? "pointer" : "not-allowed" }}>
          {selectedCount === 0 ? "בחר מאפיין" : `נתח ${selectedCount} מאפיינים לפי הזוהר`}
        </button>
      </div>
    </>)}
    {phase === "result" && result && (<>
      <div style={{ background: "#1A1208", border: `2px solid ${color}`, borderRadius: 8, padding: "0.85rem 1rem", marginBottom: "0.6rem", textAlign: "center" }}>
        <div style={{ fontSize: 10, color, fontFamily: "sans-serif", marginBottom: 3 }}>דיוקן הנשמה</div>
        <div style={{ fontSize: 16, color: "#F5EDD8", marginBottom: 4 }}>{result.archetype}</div>
        <div style={{ fontSize: 12, color: "#C4B490", lineHeight: 1.6, fontFamily: "sans-serif" }}>{result.diyukna}</div>
      </div>
      {result.midot?.length > 0 && <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: "0.6rem" }}>{result.midot.map((m, i) => <span key={i} style={{ background: "#F0E8CC", border: `1px solid ${color}`, borderRadius: 14, padding: "2px 9px", fontSize: 11, fontFamily: "sans-serif", color: "#2C1F0A" }}>{m}</span>)}</div>}
      {result.tikkun && <div style={{ background: "#F0EAD6", borderRight: "3px solid #C9A84C", borderRadius: "0 7px 7px 0", padding: "0.55rem 0.75rem", marginBottom: "0.6rem" }}>
        <div style={{ fontSize: 10, fontFamily: "sans-serif", color: "#8B4513", marginBottom: 3, fontWeight: 600 }}>המלצת תיקון</div>
        <div style={{ fontSize: 12, fontFamily: "sans-serif", color: "#2C1F0A", lineHeight: 1.6 }}>{result.tikkun}</div>
      </div>}
      <details><summary style={{ fontFamily: "sans-serif", fontSize: 11, color: "#5C4A2A", cursor: "pointer", marginBottom: 6 }}>{localRules.length} הכללים שעליהם מבוסס הניתוח</summary>
        <div style={{ display: "grid", gap: "0.4rem" }}>{localRules.map((r) => <RuleCard key={r.id} rule={r} />)}</div>
      </details>
      <button onClick={onBack} style={{ marginTop: 8, width: "100%", padding: "0.5rem", background: "transparent", border: "1px solid #EDE4CC", borderRadius: 6, fontFamily: "sans-serif", fontSize: 11, color: "#7A6A50", cursor: "pointer" }}>← חזור לתמונות</button>
    </>)}
  </div>);
}

function MatchResult({ match, mode }) {
  const accent = mode === "shidduch" ? "#6B1A2A" : "#1A3A6B";
  const title = mode === "shidduch" ? "התאמה זוגית — שידוך" : "התאמה עסקית — שותפות";
  const c = match._calc, s = match.score;
  const col = s == null ? "#9A8060" : s >= 75 ? "#C9A84C" : s >= 50 ? "#C4B490" : "#A06050";
  const pct = (x) => `${Math.round(x * 100)}%`;
  const box = (bg, bd) => ({ background: bg, border: `1px solid ${bd}`, borderRadius: 8, padding: "0.7rem 0.9rem", marginBottom: "0.6rem", fontFamily: "sans-serif" });
  return (<div>
    <div style={{ background: "#1A1208", border: `2px solid ${accent}`, borderRadius: 10, padding: "1rem 1.1rem", marginBottom: "0.8rem", textAlign: "center" }}>
      <div style={{ fontSize: 10, color: "#C4B490", fontFamily: "sans-serif", marginBottom: 3 }}>{title}</div>
      <div style={{ fontSize: 40, fontWeight: 700, color: col }}>{s ?? "—"}</div>
      <div style={{ fontSize: 13, color: "#F5EDD8", fontFamily: "sans-serif" }}>{s == null ? c?.reason : match.score_label}</div>
      {s != null && <div style={{ height: 5, background: "#3A2D18", borderRadius: 3, margin: "8px 0.75rem 0" }}><div style={{ height: "100%", width: `${s}%`, background: col, borderRadius: 3 }} /></div>}
    </div>
    {c?.parts && <details style={box("#FDF8EE", "#EDE4CC")}>
      <summary style={{ fontSize: 11, color: "#5C4A2A", cursor: "pointer" }}>איך חושב הציון</summary>
      <div style={{ fontSize: 11.5, color: "#2C1F0A", lineHeight: 1.8, marginTop: 6 }}>
        <div>איזון חסד–גבורה בזוג: {pct(c.parts.balance)} (משקל {pct(c.weights.balance)})</div>
        <div>חלק התפארת (קו האמצע): {pct(c.parts.tiferet)} (משקל {pct(c.weights.tiferet)})</div>
        <div>השלמה — אחד נוטה לימין והשני לשמאל: {pct(c.parts.complement)} (משקל {pct(c.weights.complement)})</div>
        <div>מעלות מול חסרונות בכללים: {pct(c.parts.valN)} (משקל {pct(c.weights.valN)})</div>
        <div style={{ marginTop: 4 }}>אדם א: חסד {c.a.v["חסד"]} • גבורה {c.a.v["גבורה"]} • תפארת {c.a.v["תפארת"]}</div>
        <div>אדם ב: חסד {c.b.v["חסד"]} • גבורה {c.b.v["גבורה"]} • תפארת {c.b.v["תפארת"]}</div>
        <div style={{ marginTop: 4, color: "#9A8060", fontSize: 10.5 }}>חישוב לימודי לפי עקרון הכללת ימין בשמאל. אינו מדד מדעי ואינו מחליף היכרות.</div>
      </div>
    </details>}
    {match.summary && <div style={box("#FDF8EE", "#EDE4CC")}><div style={{ fontSize: 13, color: "#2C1F0A", lineHeight: 1.7 }}>{match.summary}</div></div>}
    {match.strong_points?.length > 0 && <div style={box("#EFF8E8", "#A8D88A")}>
      <div style={{ fontSize: 10, color: "#2d6a1f", marginBottom: 5, fontWeight: 600 }}>נקודות חוזק</div>
      {match.strong_points.map((p, i) => <div key={i} style={{ fontSize: 12, color: "#1A3A10", marginBottom: 3 }}>✓ {p}</div>)}
    </div>}
    {match.tension_points?.length > 0 && <div style={box("#FEF5E8", "#F0C070")}>
      <div style={{ fontSize: 10, color: "#854F0B", marginBottom: 5, fontWeight: 600 }}>נקודות מתח ואיזון</div>
      {match.tension_points.map((p, i) => <div key={i} style={{ fontSize: 12, color: "#5C3A0A", marginBottom: 3 }}>△ {p}</div>)}
    </div>}
    {match.recommendation && <div style={{ ...box("#F0EAD6", "#F0EAD6"), borderRight: `4px solid ${accent}` }}>
      <div style={{ fontSize: 10, color: "#8B4513", marginBottom: 3, fontWeight: 600 }}>המלצה לפי הסולם</div>
      <div style={{ fontSize: 12, color: "#2C1F0A", lineHeight: 1.7 }}>{match.recommendation}</div>
    </div>}
    {match.zohar_principle && <div style={{ background: "#1A1208", borderRadius: 8, padding: "0.7rem 0.9rem", textAlign: "center", fontSize: 13, color: "#C4B490", fontFamily: "Georgia, serif", lineHeight: 1.6, fontStyle: "italic" }}>{match.zohar_principle}</div>}
  </div>);
}

const INIT = () => ({ images: [], traits: {}, result: null, phase: "upload", detectedNotes: "", measurements: null, autoFilled: [] });
const page = { minHeight: "100vh", background: "#F5EDD8", fontFamily: "'Georgia','David',serif", direction: "rtl", color: "#2C1F0A" };

export default function ZoharApp() {
  const [isAuth, setIsAuth] = useState(() => { try { return sessionStorage.getItem("yitro_auth") === "1"; } catch { return false; } });
  const [db, setDb] = useState(LOCAL_RULES);
  const [dbInfo, setDbInfo] = useState("טוען מאגר...");
  const [appMode, setAppMode] = useState("home");
  const [matchMode, setMatchMode] = useState(null);
  const [persons, setPersons] = useState([INIT(), INIT()]);
  const [showCamera, setShowCamera] = useState(null);
  const [matchResult, setMatchResult] = useState(null);
  const [matchLoading, setMatchLoading] = useState(false);
  const [globalError, setGlobalError] = useState(null);

  useEffect(() => {
    fetch(DB_URL).then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then((j) => { const rules = [...flattenDb(j), ...LOCAL_RULES]; setDb(rules); setDbInfo(`מאגר ${j.meta?.version || ""}: ${rules.length} כללים`); })
      .catch(() => setDbInfo(`לא נטען ${DB_URL} — פועלים עם ${LOCAL_RULES.length} כללים מקומיים בלבד`));
  }, []);

  // תפריטים דינמיים: הבסיס + כללי הספר (B) ו-N שאינם כפולים
  const { traits, optionMap } = useMemo(() => {
    const extra = {};
    for (const r of db) if ((/^B\d/.test(r.id) || /^N[1-5]$/.test(r.id)) && r.type !== "combo") (extra[traitForRule(r)] = extra[traitForRule(r)] || []).push(r);
    const map = {};
    for (const [tid, m] of Object.entries(OPTION_TO_RULE)) { map[tid] = {}; for (const [o, n] of Object.entries(m)) map[tid][o] = ruleIdOf(n); }
    const tl = TRAITS.map((t) => ({ ...t, options: [...t.options] }));
    if (extra.other) tl.push({ id: "other", label: "סימנים נוספים (מהספר)", icon: "✦", options: [""] });
    for (const t of tl) { map[t.id] = map[t.id] || {}; for (const r of extra[t.id] || []) if (!t.options.includes(r.condition)) { t.options.push(r.condition); map[t.id][r.condition] = r.id; } }
    return { traits: tl, optionMap: map };
  }, [db]);

  const byId = useMemo(() => Object.fromEntries(db.map((r) => [r.id, r])), [db]);
  const rulesFor = useCallback((tr) => Object.entries(tr).filter(([, v]) => v).map(([tid, v]) => byId[optionMap[tid]?.[v]]).filter(Boolean), [byId, optionMap]);

  const upd = (idx, patch) => setPersons((p) => p.map((x, i) => (i === idx ? { ...x, ...patch } : x)));

  const addFiles = async (idx, files) => {
    const p = persons[idx];
    const valid = Array.from(files).filter((f) => f.type.startsWith("image/")).slice(0, 4 - p.images.length);
    if (!valid.length) return;
    const proc = await Promise.all(valid.map(async (f) => ({ base64: await fileToBase64(f), preview: URL.createObjectURL(f), mediaType: f.type })));
    upd(idx, { images: [...p.images, ...proc].slice(0, 4) });
  };
  const handleCapture = (idx, img) => { const p = persons[idx]; if (p.images.length >= 4) return; upd(idx, { images: [...p.images, img] }); setShowCamera(null); };

  const detect = async (idx) => {
    const p = persons[idx]; if (!p.images.length) return;
    upd(idx, { phase: "detecting" });
    let meas;
    try { meas = await measureImages(p.images, loadNorms()); saveToNorms(meas); }
    catch (e) { meas = { error: "המדידה האוטומטית לא זמינה במכשיר זה — ממשיכים בזיהוי חזותי בלבד." }; }
    try {
      const content = [...p.images.map((img) => ({ type: "image", source: { type: "base64", media_type: img.mediaType, data: img.base64 } })),
        { type: "text", text: VISION_USER(traits) + (meas.error ? "" : "\n\n" + MEASURE_PROMPT(meas)) }];
      const det = JSON.parse(await callClaude([{ role: "user", content }], VISION_SYSTEM, 1200));
      const notes = det.visible_notes || "";
      const filled = {}, auto = [];
      for (const t of traits) { const v = det[t.id] || ""; filled[t.id] = t.options.includes(v) ? v : ""; }
      if (!meas.error) for (const mo of MEASURE_TO_OPTION) {
        const got = meas.face?.[mo.key] || meas.hand?.[mo.key];
        if (!filled[mo.trait] && got?.label === mo.label && (!mo.needsNeutral || meas.neutral)) { filled[mo.trait] = mo.option; auto.push(mo.trait); }
      }
      upd(idx, { traits: filled, detectedNotes: notes, measurements: meas, autoFilled: auto, phase: "review" });
    } catch (e) { setGlobalError("שגיאה בזיהוי: " + e.message); upd(idx, { phase: "upload", measurements: meas }); }
  };

  const analyze = async (idx) => {
    const p = persons[idx];
    const rules = rulesFor(p.traits);
    if (!rules.length) return;
    upd(idx, { phase: "analyzing" });
    try {
      const ctx = rules.map((r) => `- [${r.id}] ${r.organ}: ${r.condition} → ${r.interp} (קו: ${r.line || "—"}; מקור: ${r.source})${r.verification?.status === "סתירה למקור" ? ` ⚠ סתירה למקור: ${r.verification.note}` : ""}`).join("\n");
      const raw = await callClaude([{ role: "user", content: `נתח לפי חכמת הפרצוף בזוהר פרשת יתרו עם פירוש הסולם. הכללים שזוהו:\n${ctx}` }], SOLO_SYSTEM(db.length), 1000);
      upd(idx, { result: JSON.parse(raw), phase: "result" });
    } catch (e) { setGlobalError("שגיאה בניתוח: " + e.message); upd(idx, { phase: "review" }); }
  };

  const doMatch = async () => {
    const [p1, p2] = persons; if (!p1.result || !p2.result) { setGlobalError("יש לנתח את שני האנשים לפני ההשוואה"); return; }
    setMatchLoading(true); setMatchResult(null); setGlobalError(null);
    const calc = computeCompat(rulesFor(p1.traits), rulesFor(p2.traits), matchMode);
    try {
      const fmt = (x) => `חסד ${x.v["חסד"]}, גבורה ${x.v["גבורה"]}, תפארת ${x.v["תפארת"]}, ממוצע מעלות/חסרונות ${x.valence.toFixed(2)}`;
      const prompt = `אדם א: ${p1.result.archetype}. מידות: ${p1.result.midot?.join(", ")}. ${p1.result.diyukna}\nאדם ב: ${p2.result.archetype}. מידות: ${p2.result.midot?.join(", ")}. ${p2.result.diyukna}\n\n` +
        (calc.score == null ? `לא ניתן לחשב ציון: ${calc.reason}. הסבר מה חסר.` : `ציון מחושב: ${calc.score}/100.\nאדם א: ${fmt(calc.a)}\nאדם ב: ${fmt(calc.b)}`);
      const m = JSON.parse(await callClaude([{ role: "user", content: prompt }], MATCH_SYSTEM(matchMode), 1000));
      setMatchResult({ ...m, score: calc.score, _calc: calc });
    } catch (e) { setGlobalError("שגיאה: " + e.message); setMatchResult({ score: calc.score, _calc: calc }); }
    finally { setMatchLoading(false); }
  };

  const resetAll = () => { setAppMode("home"); setMatchMode(null); setPersons([INIT(), INIT()]); setMatchResult(null); setMatchLoading(false); setGlobalError(null); };

  if (!isAuth) return <PasswordGate onOk={() => setIsAuth(true)} />;

  const panelProps = (idx) => ({
    person: persons[idx], traits, rulesFor,
    onAddFiles: (f) => addFiles(idx, f), onCamera: () => setShowCamera(idx),
    onRemoveImage: (i) => upd(idx, { images: persons[idx].images.filter((_, j) => j !== i) }),
    onDetect: () => detect(idx), onAnalyze: () => analyze(idx),
    onTraitChange: (id, val) => { if (id === "__goto_review") { upd(idx, { phase: "review" }); return; } upd(idx, { traits: { ...persons[idx].traits, [id]: val }, autoFilled: persons[idx].autoFilled.filter((t) => t !== id) }); },
    onBack: () => upd(idx, { phase: persons[idx].phase === "result" ? "review" : "upload" }),
  });
  const header = (sub) => (<div style={{ background: "#1A1208", borderBottom: "3px solid #C9A84C", padding: "0.9rem 1.5rem", textAlign: "center" }}>
    <div style={{ fontSize: 10, color: "#C9A84C", marginBottom: 2, fontFamily: "sans-serif" }}>חכמת הפרצוף • ספר הזוהר • פירוש הסולם</div>
    {sub}
    <h1 style={{ fontSize: 20, color: "#F5EDD8", margin: 0, fontWeight: 400 }}>ואתה תחזה מכל העם</h1>
    {appMode !== "home" && <button onClick={resetAll} style={{ marginTop: 4, background: "transparent", border: "none", color: "#9A8060", fontFamily: "sans-serif", fontSize: 11, cursor: "pointer" }}>← תפריט ראשי</button>}
  </div>);
  const errBox = globalError && <div style={{ background: "#FEF0F0", border: "1px solid #FCCACA", borderRadius: 7, padding: "0.6rem 0.8rem", marginBottom: "0.8rem", fontFamily: "sans-serif", fontSize: 12, color: "#8B1A1A" }}>{globalError}<button onClick={() => setGlobalError(null)} style={{ marginRight: 6, background: "transparent", border: "none", cursor: "pointer", color: "#8B1A1A", fontWeight: 700 }}>✕</button></div>;
  const camera = showCamera !== null && <CameraModal onCapture={(img) => handleCapture(showCamera, img)} onClose={() => setShowCamera(null)} />;
  const spin = <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>;

  if (appMode === "home") {
    const btn = (bd, fg) => ({ padding: "1.1rem", background: "#1A1208", color: fg, border: `2px solid ${bd}`, borderRadius: 10, cursor: "pointer", fontFamily: "sans-serif", fontSize: 14, fontWeight: 600, textAlign: "right", display: "flex", alignItems: "center", gap: 10 });
    return (<div style={page}>{header(null)}
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "1.5rem 1rem", display: "grid", gap: "0.8rem" }}>
        <button onClick={() => setAppMode("solo")} style={btn("#C9A84C", "#C9A84C")}><span style={{ fontSize: 26 }}>👤</span><div><div>ניתוח אדם אחד</div><div style={{ fontSize: 11, fontWeight: 400, color: "#C4B490", marginTop: 2 }}>מדידה + זיהוי מתמונות + ניתוח לפי הכללים</div></div></button>
        <button onClick={() => { setMatchMode("shidduch"); setAppMode("duo"); }} style={btn("#6B1A2A", "#F5B8C0")}><span style={{ fontSize: 26 }}>💍</span><div><div>התאמה זוגית — שידוך</div><div style={{ fontSize: 11, fontWeight: 400, color: "#C4B490", marginTop: 2 }}>שני אנשים + ציון לפי קווי חסד, גבורה ותפארת</div></div></button>
        <button onClick={() => { setMatchMode("business"); setAppMode("duo"); }} style={btn("#1A3A6B", "#B8C8F5")}><span style={{ fontSize: 26 }}>🤝</span><div><div>התאמה עסקית — שותפות</div><div style={{ fontSize: 11, fontWeight: 400, color: "#C4B490", marginTop: 2 }}>שני אנשים + ציון לפי כללי העסק והשותפות</div></div></button>
        <div style={{ marginTop: "0.5rem", background: "#FDF3D8", border: "1px solid #C9A84C44", borderRadius: 8, padding: "0.75rem 1rem", fontFamily: "sans-serif", fontSize: 11, color: "#5C4A2A", textAlign: "center", lineHeight: 1.6 }}>{dbInfo}<br />אין הדברים מוכרחים — הסימנים מעידים על נטייה, ומשתנים לפי מעשי האדם.</div>
      </div>
    </div>);
  }

  if (appMode === "solo") return (<div style={page}>{spin}{camera}{header(null)}
    <div style={{ maxWidth: 540, margin: "0 auto", padding: "1rem 0.8rem" }}>{errBox}<PersonPanel label="ניתוח אישי" color="#8B6914" {...panelProps(0)} /></div>
  </div>);

  const mA = matchMode === "shidduch" ? "#6B1A2A" : "#1A3A6B";
  const mT = matchMode === "shidduch" ? "התאמה זוגית — שידוך" : "התאמה עסקית — שותפות";
  const mI = matchMode === "shidduch" ? "💍" : "🤝";
  const bothDone = persons[0].result && persons[1].result;
  return (<div style={page}>{spin}{camera}
    {header(<div style={{ display: "inline-flex", alignItems: "center", gap: 7, border: `1px solid ${mA}`, borderRadius: 18, padding: "2px 10px", marginBottom: 3, color: "#F5EDD8", fontFamily: "sans-serif", fontSize: 11 }}>{mI} {mT}</div>)}
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "0.9rem 0.8rem" }}>{errBox}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "0.8rem", marginBottom: "0.9rem" }}>
        <PersonPanel label="אדם א" color="#1A3A6B" {...panelProps(0)} />
        <PersonPanel label="אדם ב" color="#6B1A2A" {...panelProps(1)} />
      </div>
      {!matchResult && <button onClick={doMatch} disabled={!bothDone || matchLoading} style={{ width: "100%", padding: "0.85rem", background: bothDone && !matchLoading ? mA : "#C5BAA0", color: bothDone && !matchLoading ? "white" : "#9A8F7A", border: "none", borderRadius: 8, fontFamily: "sans-serif", fontSize: 14, fontWeight: 600, cursor: bothDone && !matchLoading ? "pointer" : "not-allowed", marginBottom: "0.9rem" }}>
        {matchLoading ? "מחשב התאמה..." : !bothDone ? `${mI} נתח את שני האנשים תחילה` : `${mI} חשב ${mT}`}
      </button>}
      {matchResult && (<>
        <MatchResult match={matchResult} mode={matchMode} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, marginTop: "0.9rem" }}>
          <button onClick={() => setMatchResult(null)} style={{ padding: "0.7rem", background: "transparent", border: "1px solid #EDE4CC", borderRadius: 7, fontFamily: "sans-serif", fontSize: 11, color: "#7A6A50", cursor: "pointer" }}>חשב מחדש</button>
          <button onClick={resetAll} style={{ padding: "0.7rem", background: "#1A1208", color: "#C9A84C", border: "1px solid #C9A84C", borderRadius: 7, fontFamily: "sans-serif", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>ניתוח חדש</button>
        </div>
      </>)}
    </div>
  </div>);
}
