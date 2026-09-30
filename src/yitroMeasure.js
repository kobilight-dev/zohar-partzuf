// yitroMeasure.js — שכבת מדידה אובייקטיבית לאפליקציית "יתרו"
// רץ כולו בדפדפן (אין שליחת תמונות לשרת לצורך המדידה). התקנה:
//   npm i @mediapipe/tasks-vision
// שימוש:  const m = await measureImages(images, loadNorms());  ואז MEASURE_PROMPT(m) נכנס לפרומפט הזיהוי.
// images = מערך {preview} מהאפליקציה; כל תמונה מנותבת אוטומטית לפנים/פרופיל/כף יד
// norms = { key:{mean,sd,n} }  — התפלגות שנצברה באפליקציה (אופציונלי; בלעדיו אין סיווג גבוה/נמוך)

import { FaceLandmarker, HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

const WASM = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm";
const FACE_MODEL = "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";
const HAND_MODEL = "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

let face, hand;
async function init() {
  if (face && hand) return;
  const vision = await FilesetResolver.forVisionTasks(WASM);
  face = await FaceLandmarker.createFromOptions(vision, {
    baseOptions: { modelAssetPath: FACE_MODEL, delegate: "GPU" },
    runningMode: "IMAGE", numFaces: 1, outputFaceBlendshapes: true,
  });
  hand = await HandLandmarker.createFromOptions(vision, {
    baseOptions: { modelAssetPath: HAND_MODEL, delegate: "GPU" },
    runningMode: "IMAGE", numHands: 2,
  });
}

// --- עזרים: המרה לפיקסלים (x,y מנורמלים בנפרד לרוחב ולגובה — חובה להמיר לפני מרחקים) ---
const px = (p, w, h) => ({ x: p.x * w, y: p.y * h });
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const mid = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
const median = (arr) => { const s = [...arr].sort((a, b) => a - b); const k = s.length >> 1; return s.length % 2 ? s[k] : (s[k - 1] + s[k]) / 2; };

// אינדקסים של Face Mesh (478 נקודות). חלקם קירוב — לאמת פעם אחת עם debugOverlay().
const F = {
  top: 10, chin: 152, cheekR: 234, cheekL: 454, foreR: 54, foreL: 284, jawR: 172, jawL: 397,
  eyeROut: 33, eyeRIn: 133, eyeLIn: 362, eyeLOut: 263, eyeRUp: 159, eyeRDn: 145, eyeLUp: 386, eyeLDn: 374,
  browR: 105, browL: 334, nasion: 168, noseTip: 1, subnasale: 2, alarR: 64, alarL: 294,
  lipTop: 0, lipUpIn: 13, lipLoIn: 14, lipBot: 17, mouthR: 61, mouthL: 291,
  browRIn: 107, browROut: 70, browLIn: 336, browLOut: 300,
};

function faceMetrics(lm, w, h, blend) {
  const P = (i) => px(lm[i], w, h);
  const faceW = dist(P(F.cheekR), P(F.cheekL));
  const faceH = dist(P(F.top), P(F.chin));
  const browMid = mid(P(F.browR), P(F.browL));
  const dR = dist(P(F.noseTip), P(F.cheekR)), dL = dist(P(F.noseTip), P(F.cheekL));
  const yaw = (dL - dR) / (dL + dR);                       // 0 = חזיתי; |yaw|>0.12 = לא חזיתי
  const bs = (name) => blend.find((c) => c.categoryName === name)?.score ?? 0;
  const smile = (bs("mouthSmileLeft") + bs("mouthSmileRight")) / 2;
  const mouthCenterY = mid(P(F.lipUpIn), P(F.lipLoIn)).y;
  const cornersY = (P(F.mouthR).y + P(F.mouthL).y) / 2;
  return {
    quality: { yaw, smile, neutral: smile < 0.3 && Math.abs(yaw) < 0.12 },
    m: {
      faceHeightToWidth: faceH / faceW,                                   // פנים מאורכות/עגולות
      fWHR: faceW / dist(browMid, P(F.lipTop)),                           // המדד מהמחקר
      foreheadWidthRatio: dist(P(F.foreR), P(F.foreL)) / faceW,          // מצח רחב/צר
      foreheadHeightRatio: dist(P(F.top), browMid) / faceH,               // מצח גבוה/נמוך (הגבול העליון של הרשת ≠ קו השיער!)
      jawToCheekRatio: dist(P(F.jawR), P(F.jawL)) / faceW,               // מרובעות/מחודד
      eyeSpacingRatio: dist(P(F.eyeRIn), P(F.eyeLIn)) / faceW,
      eyeOpenness: (dist(P(F.eyeRUp), P(F.eyeRDn)) / dist(P(F.eyeROut), P(F.eyeRIn)) +
                    dist(P(F.eyeLUp), P(F.eyeLDn)) / dist(P(F.eyeLOut), P(F.eyeLIn))) / 2,
      browToEyeRatio: (dist(P(F.browR), P(F.eyeRUp)) + dist(P(F.browL), P(F.eyeLUp))) / 2 / faceH,
      noseLengthRatio: dist(P(F.nasion), P(F.subnasale)) / faceH,
      noseWidthRatio: dist(P(F.alarR), P(F.alarL)) / faceW,
      lipThicknessRatio: (dist(P(F.lipTop), P(F.lipUpIn)) + dist(P(F.lipLoIn), P(F.lipBot))) / faceH,
      upperToLowerLip: dist(P(F.lipTop), P(F.lipUpIn)) / dist(P(F.lipLoIn), P(F.lipBot)),
      mouthCornerTilt: (mouthCenterY - cornersY) / faceH,                // חיובי = פינות למעלה (תקף רק אם אין חיוך)
      mouthWidthRatio: dist(P(F.mouthR), P(F.mouthL)) / faceW,           // פה רחב/קטן
      lipAsymmetry: Math.abs(dist(P(F.mouthR), P(F.lipTop)) - dist(P(F.mouthL), P(F.lipTop))) / faceW, // שפתיים לא שוות
      browGapRatio: dist(P(F.browRIn), P(F.browLIn)) / faceW,            // גבות רחוקות/קרובות
      browLengthRatio: (dist(P(F.browRIn), P(F.browROut)) + dist(P(F.browLIn), P(F.browLOut))) / 2 / faceW, // גבות ארוכות
    },
  };
}

// Hand Landmarker: 0 שורש כף, 1-4 אגודל, 5-8 מורה, 9-12 אמה, 13-16 קמיצה, 17-20 זרת
function handMetrics(lm, w, h, label) {
  const P = (i) => px(lm[i], w, h);
  const palmLen = dist(P(0), P(9)), palmW = dist(P(5), P(17));
  const fing = (a, b) => dist(P(a), P(b));
  return {
    handedness: label, // שים לב: MediaPipe מניח תמונה משוקפת (מצלמת סלפי) — לאמת מול המשתמש
    m: {
      palmWidthToLength: palmW / palmLen,                                  // כף רחבה / צרה וארוכה
      middleFingerToPalm: fing(9, 12) / palmLen,                          // אצבעות ארוכות/קצרות
      thumbToPalm: fing(2, 4) / palmLen,                                  // אגודל גדול
      indexToRing: fing(5, 8) / fing(13, 16),                             // מורה מול קמיצה — השוואה ישירה, לא צריך נורמות
    },
  };
}

function aggregate(list) {           // חציון על פני כמה תמונות + מדד עקביות (CV)
  const out = {};
  if (!list.length) return out;
  for (const k of Object.keys(list[0])) {
    const v = list.map((x) => x[k]).filter(Number.isFinite);
    const mean = v.reduce((a, b) => a + b, 0) / v.length;
    const sd = Math.sqrt(v.reduce((a, b) => a + (b - mean) ** 2, 0) / v.length);
    out[k] = { value: +median(v).toFixed(4), n: v.length, cv: +(sd / mean).toFixed(3) };
  }
  return out;
}

function classify(key, value, norms) {
  if (key === "indexToRing") return value > 1.02 ? "מורה ארוכה" : value < 0.98 ? "קמיצה ארוכה" : "שוות";
  const nm = norms?.[key];
  if (!nm || nm.n < 30) return "לא מכויל";                               // אין עדיין אוכלוסיית השוואה
  const z = (value - nm.mean) / nm.sd;
  return z > 0.75 ? "גבוה" : z < -0.75 ? "נמוך" : "ממוצע";
}

// טוען תמונה מ-URL (preview) לאלמנט שמדיה-פייפ יכול לקרוא
const loadImg = (src) => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });

// מקבל את תמונות האדם (עד 4) ומנתב כל אחת לבד: פנים חזיתיות / פרופיל / כף יד
export async function measureImages(images, norms = {}) {
  await init();
  const warnings = [], faceRuns = [], handRuns = [];
  let profileCount = 0;
  for (const im of images) {
    const img = await loadImg(im.preview);
    const w = img.naturalWidth, h = img.naturalHeight;
    const rf = face.detect(img);
    if (rf.faceLandmarks?.length) {
      const fm = faceMetrics(rf.faceLandmarks[0], w, h, rf.faceBlendshapes?.[0]?.categories || []);
      if (Math.abs(fm.quality.yaw) >= 0.12) { profileCount++; }
      else {
        if (fm.quality.smile >= 0.3) warnings.push("באחת התמונות האדם מחייך — מדדי הפה פחות אמינים");
        faceRuns.push({ ...fm.m, _neutral: fm.quality.neutral ? 1 : 0 });
      }
    }
    const rh = hand.detect(img);
    rh.landmarks?.forEach((lm, i) => handRuns.push(handMetrics(lm, w, h, rh.handedness?.[i]?.[0]?.categoryName).m));
  }
  const neutral = faceRuns.some((r) => r._neutral === 1);
  faceRuns.forEach((r) => delete r._neutral);
  const faceAgg = aggregate(faceRuns), handAgg = aggregate(handRuns);
  for (const agg of [faceAgg, handAgg])
    for (const k in agg) {
      agg[k].label = classify(k, agg[k].value, norms);
      if (agg[k].cv > 0.08) warnings.push(`מדד ${k} לא עקבי בין התמונות (CV=${agg[k].cv})`);
    }
  if (!faceRuns.length && !handRuns.length) warnings.push("לא זוהו פנים או כף יד באף תמונה");
  return { face: faceAgg, hand: handAgg, neutral, warnings, profileCount, faceImages: faceRuns.length, handImages: handRuns.length };
}

// נורמות מקומיות: נשמרים רק מספרים (לא תמונות) בדפדפן של המשתמש
const NORM_KEY = "yitro_norms_v1";
export function loadNorms() {
  try {
    const raw = JSON.parse(localStorage.getItem(NORM_KEY) || "{}"), out = {};
    for (const k in raw) {
      const v = raw[k], n = v.length; if (n < 2) { out[k] = { mean: v[0], sd: 0, n }; continue; }
      const mean = v.reduce((a, b) => a + b, 0) / n;
      out[k] = { mean, sd: Math.sqrt(v.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1)), n };
    }
    return out;
  } catch { return {}; }
}
export function saveToNorms(m) {
  try {
    const raw = JSON.parse(localStorage.getItem(NORM_KEY) || "{}");
    for (const agg of [m.face, m.hand]) for (const k in agg) { (raw[k] = raw[k] || []).push(agg[k].value); raw[k] = raw[k].slice(-500); }
    localStorage.setItem(NORM_KEY, JSON.stringify(raw));
  } catch { /* אחסון לא זמין — ממשיכים בלי */ }
}

// מדד + תווית → אפשרות בתפריט של האפליקציה (רק כללים שהמדידה מכסה במלואם)
export const MEASURE_TO_OPTION = [
  { key: "faceHeightToWidth", label: "גבוה", trait: "face_shape", option: "מאורכות — סגלגלות" },
  { key: "noseWidthRatio", label: "גבוה", trait: "nose", option: "נחיריים רחבים" },
  { key: "noseWidthRatio", label: "נמוך", trait: "nose", option: "נחיריים צרים" },
  { key: "noseLengthRatio", label: "גבוה", trait: "nose", option: "ארוך מאוד" },
  { key: "lipThicknessRatio", label: "גבוה", trait: "lips", option: "עבות ובשרניות" },
  { key: "lipThicknessRatio", label: "נמוך", trait: "lips", option: "דקות ומתוחות" },
  { key: "mouthCornerTilt", label: "גבוה", trait: "lips", option: "פינות פה למעלה", needsNeutral: true },
  { key: "mouthCornerTilt", label: "נמוך", trait: "lips", option: "פינות פה למטה", needsNeutral: true },
  { key: "browGapRatio", label: "גבוה", trait: "eyebrows", option: "רחוקות זו מזו" },
  { key: "browGapRatio", label: "נמוך", trait: "eyebrows", option: "קרובות מאוד" },
  { key: "palmWidthToLength", label: "נמוך", trait: "palm", option: "צרה וארוכה" },
  { key: "indexToRing", label: "מורה ארוכה", trait: "fingers", option: "מורה ארוכה מקמיצה" },
  { key: "indexToRing", label: "קמיצה ארוכה", trait: "fingers", option: "קמיצה ארוכה ממורה" },
];

// מיפוי כללים מדידים — לפי zohar_rules_v2-5 (מזהים Z/B/N כפי שבמסד; נבדקו מול הקובץ).
// part:true = המדידה מכסה רק חלק מהתנאי; השאר נקבע בראייה (Claude).
export const RULE_MEASURES = [
  // מצח
  { id: "Z1", key: "foreheadWidthRatio", when: "גבוה", part: true },           // רחב וחלק מאוד
  { id: "Z2", key: "foreheadWidthRatio", when: "נמוך", also: { foreheadHeightRatio: "נמוך" } },
  // עיניים
  { id: "B45", key: "eyeOpenness", when: "גבוה" },                             // עיניים גדולות ופקוחות
  { id: "Z20", key: "eyeOpenness", when: "נמוך", part: true },                 // עפעפיים מכסים חצי
  // גבות
  { id: "Z90", key: "browGapRatio", when: "גבוה" }, { id: "Z91", key: "browGapRatio", when: "נמוך" },
  { id: "B43", key: "browLengthRatio", when: "גבוה" },
  // חוטם
  { id: "Z46", key: "noseWidthRatio", when: "גבוה" }, { id: "Z47", key: "noseWidthRatio", when: "נמוך" },
  { id: "Z48", key: "noseLengthRatio", when: "נמוך", part: true }, { id: "Z49", key: "noseLengthRatio", when: "גבוה" },
  { id: "B53", key: "noseLengthRatio", when: "נמוך", part: true },
  { id: "B55", key: "noseWidthRatio", when: "גבוה", also: { noseLengthRatio: "גבוה" } },
  // שפתיים ופה
  { id: "Z50", key: "lipThicknessRatio", when: "גבוה" }, { id: "Z51", key: "lipThicknessRatio", when: "נמוך" },
  { id: "B60", key: "lipThicknessRatio", when: "גבוה" },
  { id: "Z52", key: "upperToLowerLip", when: "גבוה", part: true }, { id: "Z53", key: "upperToLowerLip", when: "נמוך", part: true },
  { id: "Z54", key: "mouthCornerTilt", when: "גבוה", needsNeutral: true }, { id: "Z55", key: "mouthCornerTilt", when: "נמוך", needsNeutral: true },
  { id: "B59", key: "lipAsymmetry", when: "גבוה" },
  { id: "B57", key: "mouthWidthRatio", when: "גבוה" },
  { id: "Z101", key: "mouthWidthRatio", when: "נמוך" }, { id: "N9", key: "mouthWidthRatio", when: "נמוך" }, { id: "B56", key: "mouthWidthRatio", when: "נמוך" },
  // סנטר ופנים
  { id: "Z59", key: "jawToCheekRatio", when: "נמוך", part: true },
  { id: "Z119", key: "faceHeightToWidth", when: "גבוה" }, { id: "Z120", key: "faceHeightToWidth", when: "נמוך", part: true },
  { id: "Z121", key: "jawToCheekRatio", when: "גבוה", part: true },
  // כף יד ואצבעות
  { id: "Z74", key: "palmWidthToLength", when: "גבוה", part: true }, { id: "Z75", key: "palmWidthToLength", when: "נמוך" },
  { id: "Z76", key: "middleFingerToPalm", when: "גבוה", part: true }, { id: "Z77", key: "middleFingerToPalm", when: "נמוך", part: true },
  { id: "Z78", key: "thumbToPalm", when: "גבוה", part: true },
  { id: "Z115", key: "indexToRing", when: "מורה ארוכה" }, { id: "Z116", key: "indexToRing", when: "קמיצה ארוכה" },
];

// להוסיף לפרומפט של analyze.js (אחרי רשימת הכללים):
export const MEASURE_PROMPT = (m) => `
מדידות אובייקטיביות (MediaPipe, חציון על פני התמונות):
${JSON.stringify(m)}
הוראות: בכללים שמופיעים ברשימת RULE_MEASURES — הסתמך על המדידה ולא על התרשמות. אם המדידה "לא מכויל", השתמש בה כהקשר ושפוט חזותית.
סמן לכל התאמה source: "measured" | "visual" | "both". רמת ביטחון 3 רק כשמדידה וראייה מסכימות.
אם יש warnings — הורד ביטחון בכללים הקשורים. אל תסיק על אוזניים, חוטם כפוף או בליטת סנטר מתמונה חזיתית בלבד.`;
