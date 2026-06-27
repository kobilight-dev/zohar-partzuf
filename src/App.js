import { useState, useRef, useCallback } from "react";
const PASSWORD = "K0bi#Z0h4r2026";

const GOLD = "#C9A84C";
const DEEP = "#1A1208";
const PARCH = "#F5EDD8";
const INK = "#2C1F0A";
const MIST = "#EDE4CC";
const RUST = "#8B4513";
const BLUE = "#1A3A6B";
const ROSE = "#6B1A2A";

// ─── מסד נתונים מלא — 123 כללים בסיסיים + שילובים ─────────────────────────
const RULES_DB = [
  // מצח
  {id:1,organ:"מצח",condition:"רחב וחלק מאוד",interp:"רצון פתוח, נטייה לחסד, חסר דינים מעכבים",source:"זוהר יתרו / סולם",rare:false},
  {id:2,organ:"מצח",condition:"צר ונמוך",interp:"דעת מצומצמת, נטייה לקטנות מוחין וחומריות",source:"זוהר יתרו / סולם",rare:false},
  {id:3,organ:"מצח — קמטים",condition:"שלושה קמטים רוחביים ברורים",interp:"השלמת מוחין של חכמה, בינה ודעת. אדם מיושב בדעתו",source:"זוהר יתרו / סולם",rare:false},
  {id:4,organ:"מצח — קמטים",condition:"קמטים הנחתכים ע\"י קמט אנכי",interp:"קונפליקט בין רצון לביצוע, נטייה לעצבנות",source:"פירוש הסולם",rare:false},
  {id:5,organ:"מצח — קמטים",condition:"קמטים בצורת האות ח",interp:"אדם שעבר תיקון של מידת החסידות",source:"פירוש הסולם",rare:true},
  {id:6,organ:"מצח — קמטים",condition:"קמטים עמוקים מאוד גם במנוחה",interp:"ייסורים שעברו על האדם וחקקו בו דינים קבועים",source:"פירוש הסולם",rare:false},
  {id:7,organ:"מצח",condition:"בולט קדימה",interp:"אופי עקשן, מצח נחושה, קושי בהתבטלות",source:"פירוש הסולם",rare:false},
  {id:8,organ:"מצח",condition:"עור מצח מבריק תמיד",interp:"אדם שזוכה להארת חכמה — חכמת אדם תאיר פניו",source:"זוהר יתרו / סולם",rare:true},
  {id:9,organ:"מצח — קמטים",condition:"קמטים מטושטשים ולא קבועים",interp:"חוסר יציבות ברצון, אדם שמשנה דעתו בתכיפות",source:"פירוש הסולם",rare:false},
  {id:10,organ:"מצח — קמטים",condition:"קמט אחד בודד לרוחב",interp:"אדם בעל מטרה אחת גדולה בחייו, ריכוז מאמץ",source:"פירוש הסולם",rare:false},
  {id:11,organ:"מצח — קמטים",condition:"קמטים דמויי סולם",interp:"התפתחות רוחנית הדרגתית, יכולת למידה מטעויות",source:"פירוש הסולם",rare:false},
  {id:12,organ:"מצח — סימן",condition:"נקודת חן במרכז המצח",interp:"סימן למזל טוב מולד, הגנה משמים",source:"פירוש הסולם — רשימו",rare:true},
  {id:85,organ:"מצח — קמטים",condition:"2 קמטים אנכיים בין הגבות",interp:"ריכוז פנימי עמוק, נטייה לדין",source:"פירוש הסולם",rare:false},
  {id:86,organ:"מצח — קמטים",condition:"3 קמטים אנכיים בין הגבות",interp:"גבורה הממותקת בחסדים, אדם רציני והוגן",source:"פירוש הסולם",rare:false},
  {id:87,organ:"מצח — קמטים",condition:"קמטים רוחביים שבורים",interp:"חוסר עקביות בביצוע תוכניות",source:"פירוש הסולם",rare:false},
  {id:105,organ:"מצח — קמטים",condition:"קמט אלכסוני אחד",interp:"אופי לא שגרתי, נטייה לחידושים",source:"פירוש הסולם",rare:false},
  {id:106,organ:"מצח",condition:"עור המצח מחוספס",interp:"קשיי למידה או קשיים בתיקון המחשבה",source:"פירוש הסולם",rare:false},
  {id:118,organ:"מצח — קמטים",condition:"קמט בצורת V",interp:"מוח חריף, יכולת ניתוח והפרדה",source:"פירוש הסולם",rare:false},
  // עיניים
  {id:13,organ:"עיניים",condition:"לבן דומיננטי וצלול",interp:"צד החסד (אריה), נדיבות, עין טובה",source:"זוהר יתרו / סולם",rare:false},
  {id:14,organ:"עיניים",condition:"אדמדמות — נימים בולטים",interp:"צד הגבורה (שור), נטייה לכעס, כוח מלחמה",source:"זוהר יתרו / סולם",rare:false},
  {id:15,organ:"עיניים",condition:"אישון שחור גדול מאוד",interp:"כלי קיבול גדול לאור, סקרנות עמוקה, מלכות",source:"פירוש הסולם",rare:false},
  {id:16,organ:"עיניים",condition:"גוון ירוק / צהבהב בגלגל העין",interp:"צד התפארת (נשר), פיקחות, איזון מעשי",source:"זוהר יתרו / סולם",rare:false},
  {id:17,organ:"עיניים — מבט",condition:"מבט ישיר שאינו זז",interp:"אמת פנימית, יושר לבב, אורח מישרים",source:"זוהר יתרו / סולם",rare:false},
  {id:18,organ:"עיניים — מבט",condition:"מבט מתרוצץ",interp:"חוסר אמינות, פחד פנימי, נטייה לרמייה",source:"פירוש הסולם",rare:false},
  {id:19,organ:"עיניים",condition:"עין אחת גדולה מחברתה",interp:"חוסר איזון בין קו ימין לקו שמאל בנפש",source:"פירוש הסולם",rare:false},
  {id:20,organ:"עיניים",condition:"עפעפיים מכסים חצי מהאישון",interp:"ביישנות, צניעות, או הסתרת סודות",source:"פירוש הסולם",rare:false},
  {id:21,organ:"עיניים",condition:"שקועות עמוק",interp:"התבודדות, פרישות, עומק מחשבתי",source:"פירוש הסולם",rare:false},
  {id:22,organ:"עיניים",condition:"בולטות",interp:"החצנה, רצון להיראות, הארה חיצונית ללא כלי",source:"פירוש הסולם",rare:false},
  {id:23,organ:"עיניים",condition:"ריסים ארוכים וכהים",interp:"הגנה על החכמה, סינון גירויים חיצוניים",source:"פירוש הסולם",rare:false},
  {id:24,organ:"עיניים",condition:"דמעות תמידיות",interp:"נפש רגישה, קרבה לעולם התשובה והרחמים",source:"פירוש הסולם",rare:false},
  {id:25,organ:"עיניים",condition:"צבע עין משתנה",interp:"השפעה חזקה של המזל, חוסר יציבות",source:"פירוש הסולם",rare:false},
  {id:26,organ:"עיניים — סימן",condition:"נקודה שחורה בתוך הלובן",interp:"פגם קטן במידת החסד, נטייה לדין נסתר",source:"פירוש הסולם — רשימו",rare:true},
  {id:88,organ:"עיניים",condition:"צבע עין ימין שונה משמאל",interp:"קונפליקט פנימי עמוק בין השפעות שונות",source:"פירוש הסולם",rare:true},
  {id:89,organ:"עיניים",condition:"בולטות עם לובן סביב האישון",interp:"פחד מתמיד, מתח רוחני גבוה",source:"פירוש הסולם",rare:false},
  {id:107,organ:"עיניים",condition:"עפעף תחתון בולט — שקיות",interp:"עייפות הנשמה, עומס רגשי רב",source:"פירוש הסולם",rare:false},
  {id:108,organ:"עיניים — מבט",condition:"מבט שפוף — למטה",interp:"ענווה אמיתית, או תחושת אשמה",source:"פירוש הסולם",rare:false},
  // גבות
  {id:27,organ:"גבות",condition:"עבות ומחוברות",interp:"דינים חזקים, כוח חיים פראי, קושי בריסון",source:"זוהר יתרו / סולם",rare:false},
  {id:28,organ:"גבות",condition:"דקות ובהירות",interp:"חולשת הגבורות, אופי נוח מדי, חוסר עמוד שדרה",source:"פירוש הסולם",rare:false},
  {id:29,organ:"גבות",condition:"גבה אחת גבוהה מהשנייה",interp:"ספקות מתמידים, חוסר הכרעה בין טוב לרע",source:"פירוש הסולם",rare:false},
  {id:30,organ:"גבות",condition:"קשתיות ויפות",interp:"הרמוניה רגשית, חן וחסד המוקרן לסביבה",source:"פירוש הסולם",rare:false},
  {id:90,organ:"גבות",condition:"רחוקות זו מזו",interp:"פתיחות מחשבתית, חוסר דאגה",source:"פירוש הסולם",rare:false},
  {id:91,organ:"גבות",condition:"קרובות מאוד — כמעט נוגעות",interp:"דאגנות, נטייה להתכנסות, קפדנות",source:"פירוש הסולם",rare:false},
  {id:109,organ:"גבות",condition:"שערות בולטות לכל עבר",interp:"חוסר סדר פנימי, בלבול מחשבתי",source:"פירוש הסולם",rare:false},
  // שיער
  {id:31,organ:"שיער",condition:"שחור וקשה",interp:"דינים קשים — סערא דחמירא, אופי נוקשה",source:"זוהר יתרו / סולם",rare:false},
  {id:32,organ:"שיער",condition:"לבן בגיל צעיר",interp:"נשמה מעולם הרחמים, ניסיון חיים מגלגול קודם",source:"פירוש הסולם",rare:false},
  {id:33,organ:"שיער",condition:"אדמוני — ג'ינג'י",interp:"נטייה לדין אקטיבי, כעס, אך גם גבורה דקדושה",source:"פירוש הסולם",rare:false},
  {id:34,organ:"שיער",condition:"מקורזל מאוד",interp:"אופי מסובך, קשיים בתיקון המידות",source:"פירוש הסולם",rare:false},
  {id:35,organ:"שיער",condition:"התקרחות בקדמת הראש",interp:"גילוי אורות החכמה, אדם משכיל ופתוח",source:"פירוש הסולם",rare:false},
  {id:36,organ:"שיער",condition:"התקרחות באחורי הראש",interp:"אובדן האחוריים, חולשה בהתמודדות עם היצר",source:"פירוש הסולם",rare:false},
  {id:37,organ:"שיער",condition:"רך וחלק",interp:"אופי נוח, גמישות, נטייה לחסד",source:"פירוש הסולם",rare:false},
  {id:38,organ:"שיער",condition:"מכסה את האוזניים",interp:"חוסר רצון לשמוע תוכחה, הסתגרות",source:"פירוש הסולם",rare:false},
  {id:92,organ:"שיער",condition:"מלבין רק בצדדים — פאות",interp:"תחילת כניסת מוחין דזקנה, בינה",source:"פירוש הסולם",rare:true},
  {id:110,organ:"שיער",condition:"שומני מאוד",interp:"עודף לחות — נטייה לעצבות או חומריות",source:"פירוש הסולם",rare:false},
  // אוזניים
  {id:39,organ:"אוזניים",condition:"גדולות ובשרניות",interp:"בינה רחבה, יכולת הכלה והבנה עמוקה",source:"פירוש הסולם",rare:false},
  {id:40,organ:"אוזניים",condition:"קטנות וצמודות",interp:"אדם סגור, קושי בקבלת דעות שונות",source:"פירוש הסולם",rare:false},
  {id:41,organ:"אוזניים",condition:"שערות בתוך נקב האוזן",interp:"שמירה מפני קולות חיצוניים, צניעות בשמיעה",source:"פירוש הסולם",rare:true},
  {id:42,organ:"אוזניים",condition:"תנוך האוזן ארוך",interp:"אריכות ימים, יכולת לספוג ולהמתין",source:"פירוש הסולם",rare:false},
  {id:43,organ:"אוזניים",condition:"אדומות תמיד",interp:"בושה פנימית או כעס אצור",source:"פירוש הסולם",rare:false},
  {id:96,organ:"אוזניים",condition:"תנוך מחובר ללחי",interp:"חוסר עצמאות, צורך באישור חברתי",source:"פירוש הסולם",rare:false},
  {id:97,organ:"אוזניים",condition:"תנוך חופשי",interp:"אינדיבידואליזם, יכולת חשיבה עצמאית",source:"פירוש הסולם",rare:false},
  // חוטם
  {id:44,organ:"חוטם",condition:"ישר וממוצע",interp:"מידת האמת, איזון בין ימין לשמאל",source:"פירוש הסולם",rare:false},
  {id:45,organ:"חוטם",condition:"כפוף — נשרי",interp:"פיקחות, ראייה למרחוק, לעיתים ערמומיות",source:"פירוש הסולם",rare:false},
  {id:46,organ:"חוטם",condition:"נחיריים רחבים",interp:"ארך אפיים — סבלנות רבה, או כעס גדול",source:"פירוש הסולם",rare:false},
  {id:47,organ:"חוטם",condition:"נחיריים צרים",interp:"קוצר רוח, קפדנות, חוסר סבלנות לפרטים",source:"פירוש הסולם",rare:false},
  {id:48,organ:"חוטם",condition:"קצר וסולד",interp:"עליזות, חוסר עומק, אופי קליל",source:"פירוש הסולם",rare:false},
  {id:49,organ:"חוטם",condition:"ארוך מאוד",interp:"התמשכות הדינים, אופי כבד ומלנכולי",source:"פירוש הסולם",rare:false},
  {id:98,organ:"חוטם",condition:"רחב מאוד בבסיסו",interp:"יציבות כלכלית, חיבור טוב למציאות",source:"פירוש הסולם",rare:false},
  {id:99,organ:"חוטם",condition:"דק מאוד בבסיסו",interp:"רגישות קיצונית, אנינות טעם, חולשה פיזית",source:"פירוש הסולם",rare:false},
  // שפתיים ופה
  {id:50,organ:"שפתיים",condition:"עבות ובשרניות",interp:"נטייה לתאוות חומריות, אך גם נדיבות בדיבור",source:"פירוש הסולם",rare:false},
  {id:51,organ:"שפתיים",condition:"דקות ומתוחות",interp:"קפדנות, ביקורתיות, שליטה עצמית גבוהה",source:"פירוש הסולם",rare:false},
  {id:52,organ:"שפתיים",condition:"שפה עליונה בולטת",interp:"שלטון המחשבה על המעשה, אדם תיאורטי",source:"פירוש הסולם",rare:false},
  {id:53,organ:"שפתיים",condition:"שפה תחתונה בולטת",interp:"שלטון המעשה והחומר, אדם פרקטי",source:"פירוש הסולם",rare:false},
  {id:54,organ:"שפתיים",condition:"פינות פה נוטות למעלה",interp:"אופטימיות נשמתית, הכרת הטוב",source:"פירוש הסולם",rare:false},
  {id:55,organ:"שפתיים",condition:"פינות פה נוטות למטה",interp:"מרירות, נטייה לתלונות, דינים בפה",source:"פירוש הסולם",rare:false},
  {id:100,organ:"שפתיים",condition:"שפה עליונה מחורצת",interp:"פיקחות בדיבור, יכולת שכנוע",source:"פירוש הסולם",rare:false},
  {id:101,organ:"פה",condition:"קטן מאוד",interp:"שתיקה יפה לחכמים, שמירת סוד",source:"פירוש הסולם",rare:false},
  {id:102,organ:"פה",condition:"גדול ופתוח במנוחה",interp:"פטפטנות, חוסר סינון של מחשבות",source:"פירוש הסולם",rare:false},
  // שיניים
  {id:56,organ:"שיניים",condition:"לבנות וישרות",interp:"טהרת הדיבור, אדם שדבריו נשמעים באהבה",source:"פירוש הסולם",rare:false},
  {id:57,organ:"שיניים",condition:"קטנות ורווחים ביניהן",interp:"בזבזנות, קושי בשמירת סוד",source:"פירוש הסולם",rare:false},
  {id:58,organ:"שיניים",condition:"בולטות קדימה",interp:"תוקפנות מילולית, רצון להשפיע בכוח",source:"פירוש הסולם",rare:false},
  {id:103,organ:"שיניים",condition:"צהובות — טבעי",interp:"דינים בביטוי, אופי קשה",source:"פירוש הסולם",rare:false},
  // סנטר ולחיים
  {id:59,organ:"סנטר",condition:"מחודד וחזק",interp:"כוח רצון, עקשנות חיובית, חתירה למטרה",source:"פירוש הסולם",rare:false},
  {id:60,organ:"סנטר",condition:"כפול — בשרני",interp:"יציבות, נטייה לנוחות וחומריות",source:"פירוש הסולם",rare:false},
  {id:61,organ:"סנטר — סימן",condition:"גומה בסנטר",interp:"חן טבעי, רצון למצוא חן בעיני הבריות",source:"פירוש הסולם",rare:false},
  {id:62,organ:"לחיים",condition:"נפוחות ואדומות",interp:"שובע, סיפוק, לעיתים גאווה",source:"פירוש הסולם",rare:false},
  {id:63,organ:"לחיים",condition:"שקועות וחוורות",interp:"צער, סיגוף, פרישות מהעולם",source:"פירוש הסולם",rare:false},
  {id:104,organ:"לחיים — סימן",condition:"גומות חן",interp:"חן דקדושה, יכולת למשוך אנשים",source:"פירוש הסולם",rare:false},
  // עור
  {id:64,organ:"עור",condition:"יבש ונוקשה",interp:"שליטת הדינים, קושי בשינוי הרגלים",source:"פירוש הסולם",rare:false},
  {id:65,organ:"עור",condition:"לח ומבריק",interp:"שפע חסדים, בריאות הנפש והגוף",source:"פירוש הסולם",rare:false},
  {id:66,organ:"עור",condition:"נקודות חן כהות מרובות",interp:"ניצוצות קדושה הדורשים בירור ותיקון",source:"פירוש הסולם",rare:false},
  // קול
  {id:67,organ:"קול",condition:"עמוק ונמוך",interp:"סמכותיות, בינה עילאית, ביטחון",source:"פירוש הסולם",rare:false},
  {id:68,organ:"קול",condition:"דק וגבוה",interp:"רגישות, פחד, צורך בהגנה",source:"פירוש הסולם",rare:false},
  {id:69,organ:"קול",condition:"צרוד",interp:"פגם בצינורות התקשורת הרוחניים",source:"פירוש הסולם",rare:false},
  // צוואר וכתפיים
  {id:70,organ:"צוואר",condition:"ארוך ודק",interp:"שאיפה לרוחניות, אך קושי בחיבור למציאות",source:"פירוש הסולם",rare:false},
  {id:71,organ:"צוואר",condition:"קצר ועבה",interp:"חיבור חזק לחומר, כוח ביצוע, עקשנות",source:"פירוש הסולם",rare:false},
  {id:72,organ:"כתפיים",condition:"רחבות",interp:"יכולת נשיאה באחריות ציבורית, חוסן",source:"פירוש הסולם",rare:false},
  {id:73,organ:"כתפיים",condition:"שמוטות",interp:"תחושת ייאוש, חוסר אמונה בכוח העצמי",source:"פירוש הסולם",rare:false},
  // ידיים
  {id:74,organ:"כף יד",condition:"רחבה ובשרנית",interp:"נדיבות, רצון להעניק, כלי קיבול לשפע",source:"פירוש הסולם",rare:false},
  {id:75,organ:"כף יד",condition:"צרה וארוכה",interp:"אצילות, עדינות, נטייה לאמנות ורוח",source:"פירוש הסולם",rare:false},
  {id:113,organ:"כף יד",condition:"קרה תמיד",interp:"חוסר חיוניות, פחד, שליטת הדינים",source:"פירוש הסולם",rare:false},
  {id:114,organ:"כף יד",condition:"חמה ומזיעה",interp:"עודף מרץ, נטייה לכעס או התלהבות יתרה",source:"פירוש הסולם",rare:false},
  {id:111,organ:"קווי יד — לב",condition:"קו הלב מגיע לאצבע המורה",interp:"יכולת אהבה והקרבה גדולה",source:"פירוש הסולם",rare:false},
  {id:112,organ:"קווי יד — ראש",condition:"קו הראש קצר",interp:"מעשיות ללא מחשבה עמוקה, אימפולסיביות",source:"פירוש הסולם",rare:false},
  {id:79,organ:"קווי יד — חיים",condition:"קו החיים ארוך וברור",interp:"חיוניות רבה, תיקון נשמתי שלם",source:"פירוש הסולם",rare:false},
  {id:80,organ:"קווי יד",condition:"קווי רשת מרובים ומסובכים",interp:"נשמה מורכבת עם גלגולים, דאגנות יתרה",source:"פירוש הסולם",rare:false},
  {id:81,organ:"קווי יד — סימן",condition:"שרטוט דמוי מ",interp:"חיבור לספירת המלכות, כוח הנהגה",source:"פירוש הסולם — רשימו",rare:true},
  {id:82,organ:"קווי יד — סימן",condition:"שרטוט דמוי ש",interp:"חיבור לשלושת האבות — חג\"ת, איזון",source:"פירוש הסולם — רשימו",rare:true},
  // אצבעות
  {id:76,organ:"אצבעות",condition:"ארוכות ודקות",interp:"פיקחות, יכולת ניתוח פרטים, רוחניות",source:"פירוש הסולם",rare:false},
  {id:77,organ:"אצבעות",condition:"קצרות ועבות",interp:"מעשיות, עבודה פיזית, חוסר סבלנות",source:"פירוש הסולם",rare:false},
  {id:78,organ:"אצבעות",condition:"אגודל גדול וחזק",interp:"שליטה עצמית גבוהה, מנהיגות",source:"פירוש הסולם",rare:false},
  {id:115,organ:"אצבעות",condition:"אצבע מורה ארוכה מהקמיצה",interp:"שאיפה לשלטון וסמכות",source:"פירוש הסולם",rare:false},
  {id:116,organ:"אצבעות",condition:"קמיצה ארוכה מהמורה",interp:"נטייה לאמנות, חן, רגישות",source:"פירוש הסולם",rare:false},
  // ציפורניים
  {id:83,organ:"ציפורניים",condition:"רחבות וקצרות",interp:"אופי לוחמני, נטייה להתווכח",source:"פירוש הסולם",rare:false},
  {id:84,organ:"ציפורניים",condition:"ארוכות ומטופחות",interp:"אסתטיקה, סדר פנימי, עדינות",source:"פירוש הסולם",rare:false},
  {id:117,organ:"ציפורניים — סימן",condition:"כתמים לבנים על הציפורניים",interp:"סימנים למתח רוחני או חוסר באורות",source:"פירוש הסולם",rare:false},
  // זקן
  {id:93,organ:"זקן",condition:"ארוך ומלא",interp:"הנהגת חסד, השפעה רוחנית רחבה",source:"פירוש הסולם",rare:false},
  {id:94,organ:"זקן",condition:"קצר ומסודר",interp:"הנהגת דין ומלכות, סדר ומשמעת",source:"פירוש הסולם",rare:false},
  {id:95,organ:"זקן",condition:"חוסר שיער בלחיים — זקן תיש",interp:"חולשת החסדים, נטייה לבידוד",source:"פירוש הסולם",rare:false},
  // פנים כללי
  {id:119,organ:"צורת פנים",condition:"מאורכות — סגלגלות",interp:"אינטלקטואליות, פרישות, עומק",source:"פירוש הסולם",rare:false},
  {id:120,organ:"צורת פנים",condition:"עגולות ומלאות",interp:"חברתיות, שמחה, זרימה",source:"פירוש הסולם",rare:false},
  {id:121,organ:"צורת פנים",condition:"מרובעות",interp:"יציבות, עקשנות, אמינות",source:"פירוש הסולם",rare:false},
  {id:122,organ:"צורת פנים",condition:"ירוקות / חוורות מאוד",interp:"חולשה רוחנית, השפעת כוחות חיצוניים",source:"פירוש הסולם",rare:false},
  {id:123,organ:"צורת פנים",condition:"מאירות — זהובות",interp:"חיבור לאור החכמה, שלווה פנימית",source:"פירוש הסולם",rare:true},
  // ─── כללים חדשים מסריקת הזוהר — ואתה תחזה רזא דרזין (אותיות קפט–ריג) ───
  // שיער + גבות (קפט-קצ)
  {id:401,organ:"שיער + גבות",condition:"שיער תלוי ושחור + גבות מחוברות חזק",interp:"בעל כעס שאינו מתפרץ מיד — מעכב את כעסו. מחזיק עצמו שהוא חכם ואינו כן. בעל מריבה בחוץ ובביתו שקט. אינו מחשיב את התורה.",source:"זוהר יתרו, ואתה תחזה רזא דרזין, אות קצ",rare:false},
  // גבות נפרדות (קצא-קצב)
  {id:402,organ:"גבות — נפרדות",condition:"גבות נפרדות שאינן מגיעות זו לזו",interp:"כעס לפי שעה ומיד שוכך. בעל מריבה בביתו. פעם אחת בחייו משיב נמרצות. מצחו נקמט בשעת כעסו. עוסק בסחורה ועולה לעשירות.",source:"זוהר יתרו, ואתה תחזה רזא דרזין, אות קצב",rare:false},
  // גבות עם שערות ביניהן (קצג-קצד)
  {id:403,organ:"גבות — שערות ביניהן",condition:"שערות קטנות נכנסות בין הגבות",interp:"נוטר שנאה גדולה תמיד. טוב בביתו פנימה. קמצן. מסתיר כספו ומעשיו. אינו מתלבש כראוי. בעל לשון הרע.",source:"זוהר יתרו, ואתה תחזה רזא דרזין, אות קצג-קצד",rare:false},
  // עיניים צהובות (ר)
  {id:404,organ:"עיניים — צהובות",condition:"עיניים צהובות ופקוחות",interp:"נראה טוב וצדיק ואינו כן. משבח את עצמו. אם עוסק בתורה מתנהג כאדם גדול. מצליח בעשירות. רמאי בכל מעשיו. בעל לשון הרע.",source:"זוהר יתרו, ואתה תחזה רזא דרזין, אות ר",rare:false},
  // אוזניים גדולות + שיער (רא)
  {id:405,organ:"אוזניים גדולות תחת שיער",condition:"אוזניים גדולות עומדות תחת השיער",interp:"מעשיו לעיני בני אדם ורוצה שיראוהו. מי שמשתתף עימו אינו מצליח. הוא מצליח ברמאות ונראה כצדיק.",source:"זוהר יתרו, ואתה תחזה רזא דרזין, אות רא",rare:false},
  // מצח + קמטים בין גבות (קצו-קצז)
  {id:406,organ:"מצח — קו גדול + קמטים",condition:"קו אחד גדול לרוחב + 4 קמטים קטנים בין הגבות",interp:"שמח, חכם, פיקח וותרן בכספו. כועס לפי שעה ומיד נרגע. אינו נוטר שנאה. כששב בתשובה עולה לכבוד גדול. כולם צריכים אליו.",source:"זוהר יתרו, ואתה תחזה רזא דרזין, אות קצז",rare:false},
  // גבות לבנות + שיער אדום (רז)
  {id:407,organ:"גבות לבנות + שיער אדום",condition:"גבות לבנות עם שיער אדום",interp:"כל דבריו ברמאות. פיקח ונוטר שנאה. עיניו שקועות ומהיר במעשיו. צריכים להיזהר ממנו. ברמאות נותן טעם לדבריו.",source:"זוהר יתרו, ואתה תחזה רזא דרזין, אות רז",rare:true},
  // מצח גדול ועגול (רח)
  {id:408,organ:"מצח — גדול ולא עגול",condition:"מצח גדול ולא עגול, 2 רשימות גדולות + 4 קטנות",interp:"קר מוח ולכן פיקח. אוזניים קטנות. שיער תלוי. בזרועותיו שיער רב. עלול להתהפך בין טוב לרע.",source:"זוהר יתרו, ואתה תחזה רזא דרזין, אות רח",rare:false},
  // מצח גדול ועגול ביופי (רי)
  {id:409,organ:"מצח — גדול ועגול ביופי",condition:"מצח גדול ועגול ביופי עם קווים עולים ויורדים",interp:"אדם גדול ומיוחד — דיוקן עליון. גבות בין שחור לאדום. עיניו מלאות שמחה, חן וחסד. הרשעים שמסתכלים בו פוחדים והצדיקים נמשכים אליו.",source:"זוהר יתרו, ואתה תחזה רזא דרזין, אות רי",rare:true},
  // מצח 5 קווים (קצט)
  {id:410,organ:"מצח — 5 קווים",condition:"5 קווים במצח (3 עוברים, 2 לא עוברים)",interp:"בעל מחלוקת בביתו. כל מעשיו במהירות. נראה טוב ואינו כן. משבח עצמו. מכניס עצמו למה שאינו ראוי לו.",source:"זוהר יתרו, ואתה תחזה רזא דרזין, אות קצט",rare:false},
  // עיניים שקועות — אזהרה (רז)
  {id:411,organ:"עיניים שקועות — אזהרה",condition:"עיניים שקועות מאוד",interp:"לפי הזוהר: כל מי שעיניו שקועות — צריכים להיזהר ממנו בכל המעשים. רמאי ובדרכי הרמאות מנמק את דבריו.",source:"זוהר יתרו, ואתה תחזה רזא דרזין, אות רז",rare:false},
  // שיער מסולסל + עין ימין סגורה (רג)
  {id:412,organ:"שיער + עיניים",condition:"שיער מסולסל מעט + עין ימין כמעט סגורה",interp:"ללא תבונה, שיגעון בלבו, מבוהל במעשיו.",source:"זוהר יתרו, ואתה תחזה רזא דרזין, אות רג",rare:false},
  // עיקרון הבסיס — הרשימות משתנות (קפג-קפה)
  {id:413,organ:"עיקרון יסוד",condition:"רשימות וקמטים — כללי",interp:"הרשימות והקמטים בפנים הם כמו כוכבים ברקיע — משתנים לפי מעשי האדם. כשרוח הקודש שורה, רשימות של קדושה. כשרוח טומאה — רשימות אחרות. הכל ניתן לשינוי על ידי תשובה ומעשים.",source:"זוהר יתרו, ואתה תחזה רזא דרזין, אות קפג-קפה",rare:false},
  // שש הבחינות הבסיסיות (קפ-קפא)
  {id:414,organ:"6 בחינות — יסוד",condition:"שיער + מצח + גבות + עיניים + פנים + ידיים",interp:"אלו הן 6 הבחינות שנמסרו למשה מפי השכינה: בשיער ובקמטי המצח ובגבות — מכל העם; בעיניים ובקרומים — אנשי חיל; בפנים ובזקן — יראי אלוקים; בידיים ובקווים — שונאי בצע.",source:"זוהר יתרו, ואתה תחזה רזא דרזין, אות קפ-קפא",rare:false},
  // דוד המלך — דיוקן עיניים (רט)
  {id:415,organ:"דיוקן — עיניים של רחמים",condition:"עיניים עם חוט ירוק שמתהפך לאדום במלחמה",interp:"דיוקן המלך דוד — עיניים של רחמים ושמחה. חוט ירוק ביניהן שבשעת מלחמה הופך לאדום. ניסים בעיניו. הרשעים פוחדים ממנו.",source:"זוהר יתרו, ואתה תחזה רזא דרזין, אות רט",rare:true},
  // שילובים מיוחדים מהטבלה
  {id:281,organ:"שילוב — תיקון נשמה",condition:"שיער לבן בצעירות + 3 קמטים ישרים + עיניים שקועות + קול נמוך",interp:"נשמה שבאה לתקן עוונות מגלגול קודם; בעל בינה עילאית שזכה לזקנה רוחנית בטרם עת",source:"פירוש הסולם — שילוב",rare:true},
  {id:361,organ:"שילוב — חסיד עמל",condition:"עור מבריק + שיער לבן צולל + 3 קמטים + זקן מלא + שרטוט דמוי מ + פנים מאירות",interp:"דיוקן החסיד העמל; אדם שתיקן את מידת החסד; משפיע ברחמים ואינו אוחז בדין",source:"פירוש הסולם — דיוקנות",rare:true},
  {id:362,organ:"שילוב — בעל מחלוקת",condition:"מצח צר + שיער שחור קשה + עיניים אדמדמות + גבות מחוברות + שיניים דקות",interp:"אדם שמשמת מריבות ומחלוקות; צריך תיקון במידת הדין וריסון הכעס",source:"פירוש הסולם — דיוקנות",rare:true},
  {id:363,organ:"שילוב — משכיל",condition:"מצח גבוה + עיניים שקועות + 3 אנכיים + כף יד צרה + זקן ארוך + חוטם נשרי",interp:"אדם המשכיל; מארי דרזין — בעל סודות; אינטלקטואל רוחני הפורש מהעולם",source:"פירוש הסולם — דיוקנות",rare:true},
  {id:364,organ:"שילוב — מארי דחן",condition:"נקודת חן במצח + גומות חן + שרטוט ש ביד + מבט ישר + שיער חלק",interp:"בעל חן אמיתי — מארי דחן; מוצא חן בעיני כל, ומשפיע טוב על סביבתו",source:"פירוש הסולם — דיוקנות",rare:true},
];

const TRAITS = [
  { id:"forehead", label:"מצח", icon:"◻", options:["","רחב וחלק מאוד","צר ונמוך","בולט קדימה","גדול ועגול ביופי","גדול ולא עגול","עור מצח מבריק","עור המצח מחוספס"] },
  { id:"forehead_lines", label:"קמטי מצח", icon:"≡", options:["","3 קמטים ישרים","2 קמטים אנכיים בין הגבות","3 קמטים אנכיים בין הגבות","קמטים שבורים","קמט אחד לרוחב","קמט V","קמט אלכסוני","קמטים דמויי סולם","קמטים בצורת ח","קמטים עמוקים מאוד","קמטים נחתכים אנכית","נקודת חן במרכז המצח","קו גדול + 4 קמטים בין הגבות","5 קווים (3 עוברים 2 לא)"] },
  { id:"eye_color", label:"עיניים — צבע", icon:"◉", options:["","לבן דומיננטי וצלול","אדמדמות — נימים בולטים","אישון שחור גדול","ירוק / צהבהב","צהובות ופקוחות","צבע משתנה","עין אחת שונה מהשנייה","נקודה שחורה בלובן","חוט ירוק בין העיניים"] },
  { id:"eye_position", label:"עיניים — מיקום", icon:"⊙", options:["","שקועות עמוק","שקועות מאוד — אזהרה","בולטות","בולטות עם לובן סביב","עפעפיים מכסים חצי","עין ימין כמעט סגורה","עפעף תחתון בולט","ריסים ארוכים וכהים"] },
  { id:"gaze", label:"מבט", icon:"→", options:["","ישיר שאינו זז","מתרוצץ","שפוף — למטה"] },
  { id:"eyebrows", label:"גבות", icon:"∧", options:["","עבות ומחוברות","דקות ובהירות","גבה אחת גבוהה","קשתיות ויפות","לבנות","רחוקות זו מזו","קרובות מאוד","נפרדות — אינן מגיעות זו לזו","שערות קטנות ביניהן","שערות בולטות לכל עבר"] },
  { id:"nose", label:"חוטם", icon:"▽", options:["","ישר וממוצע","כפוף — נשרי","נחיריים רחבים","נחיריים צרים","קצר וסולד","ארוך מאוד","רחב בבסיסו","דק בבסיסו"] },
  { id:"lips", label:"שפתיים ופה", icon:"◡", options:["","עבות ובשרניות","דקות ומתוחות","שפה עליונה בולטת","שפה תחתונה בולטת","שפה עליונה מחורצת","פינות פה למעלה","פינות פה למטה","פה קטן מאוד","פה גדול ופתוח"] },
  { id:"teeth", label:"שיניים", icon:"⌒", options:["","לבנות וישרות","קטנות ורווחים","בולטות קדימה","צהובות"] },
  { id:"chin", label:"סנטר ולחיים", icon:"◟", options:["","סנטר מחודד וחזק","סנטר כפול","גומה בסנטר","לחיים נפוחות ואדומות","לחיים שקועות וחוורות","גומות חן בלחיים"] },
  { id:"hair", label:"שיער", icon:"〜", options:["","שחור וקשה","לבן בגיל צעיר","אדמוני","מקורזל מאוד","רך וחלק","מכסה האוזניים","מלבין רק בצדדים","שומני מאוד","התקרחות קדמית","התקרחות אחורית"] },
  { id:"ears", label:"אוזניים", icon:"◖", options:["","גדולות ובשרניות","גדולות עומדות תחת השיער","קטנות וצמודות","תנוך ארוך","תנוך מחובר ללחי","תנוך חופשי","שערות בתוך האוזן","אדומות תמיד"] },
  { id:"beard", label:"זקן", icon:"Ω", options:["","ארוך ומלא","קצר ומסודר","חוסר שיער בלחיים"] },
  { id:"voice", label:"קול", icon:"♪", options:["","עמוק ונמוך","דק וגבוה","צרוד"] },
  { id:"neck", label:"צוואר וכתפיים", icon:"↕", options:["","צוואר ארוך ודק","צוואר קצר ועבה","כתפיים רחבות","כתפיים שמוטות"] },
  { id:"skin", label:"עור", icon:"◈", options:["","יבש ונוקשה","לח ומבריק","נקודות חן כהות"] },
  { id:"face_shape", label:"צורת פנים", icon:"○", options:["","מאורכות — סגלגלות","עגולות ומלאות","מרובעות","חוורות / ירוקות","מאירות / זהובות"] },
  { id:"palm", label:"כף היד", icon:"✋", options:["","רחבה ובשרנית","צרה וארוכה","חמה ומזיעה","קרה תמיד"] },
  { id:"palm_lines", label:"קווי יד", icon:"〳", options:["","קו חיים ארוך","קו לב מגיע למורה","קו ראש קצר","קווי רשת מרובים","שרטוט דמוי מ","שרטוט דמוי ש"] },
  { id:"fingers", label:"אצבעות וציפורניים", icon:"|||", options:["","ארוכות ודקות","קצרות ועבות","אגודל גדול","מורה ארוכה מקמיצה","קמיצה ארוכה ממורה","ציפורניים רחבות קצרות","ציפורניים ארוכות מטופחות","כתמים לבנים"] },
];

// מיפוי אפשרות ל-ID של כלל
const OPTION_TO_RULE = {
  forehead: {"רחב וחלק מאוד":1,"צר ונמוך":2,"בולט קדימה":7,"גדול ועגול ביופי":409,"גדול ולא עגול":408,"עור מצח מבריק":8,"עור המצח מחוספס":106},
  forehead_lines: {"3 קמטים ישרים":3,"2 קמטים אנכיים בין הגבות":85,"3 קמטים אנכיים בין הגבות":86,"קמטים שבורים":87,"קמט אחד לרוחב":10,"קמט V":118,"קמט אלכסוני":105,"קמטים דמויי סולם":11,"קמטים בצורת ח":5,"קמטים עמוקים מאוד":6,"קמטים נחתכים אנכית":4,"נקודת חן במרכז המצח":12,"קו גדול + 4 קמטים בין הגבות":406,"5 קווים (3 עוברים 2 לא)":410},
  eye_color: {"לבן דומיננטי וצלול":13,"אדמדמות — נימים בולטים":14,"אישון שחור גדול":15,"ירוק / צהבהב":16,"צהובות ופקוחות":404,"צבע משתנה":25,"עין אחת שונה מהשנייה":88,"נקודה שחורה בלובן":26,"חוט ירוק בין העיניים":415},
  eye_position: {"שקועות עמוק":21,"שקועות מאוד — אזהרה":411,"בולטות":22,"בולטות עם לובן סביב":89,"עפעפיים מכסים חצי":20,"עין ימין כמעט סגורה":412,"עפעף תחתון בולט":107,"ריסים ארוכים וכהים":23},
  gaze: {"ישיר שאינו זז":17,"מתרוצץ":18,"שפוף — למטה":108},
  eyebrows: {"עבות ומחוברות":27,"דקות ובהירות":28,"גבה אחת גבוהה":29,"קשתיות ויפות":30,"לבנות":407,"רחוקות זו מזו":90,"קרובות מאוד":91,"נפרדות — אינן מגיעות זו לזו":402,"שערות קטנות ביניהן":403,"שערות בולטות לכל עבר":109},
  nose: {"ישר וממוצע":44,"כפוף — נשרי":45,"נחיריים רחבים":46,"נחיריים צרים":47,"קצר וסולד":48,"ארוך מאוד":49,"רחב בבסיסו":98,"דק בבסיסו":99},
  lips: {"עבות ובשרניות":50,"דקות ומתוחות":51,"שפה עליונה בולטת":52,"שפה תחתונה בולטת":53,"שפה עליונה מחורצת":100,"פינות פה למעלה":54,"פינות פה למטה":55,"פה קטן מאוד":101,"פה גדול ופתוח":102},
  teeth: {"לבנות וישרות":56,"קטנות ורווחים":57,"בולטות קדימה":58,"צהובות":103},
  chin: {"סנטר מחודד וחזק":59,"סנטר כפול":60,"גומה בסנטר":61,"לחיים נפוחות ואדומות":62,"לחיים שקועות וחוורות":63,"גומות חן בלחיים":104},
  hair: {"שחור וקשה":31,"לבן בגיל צעיר":32,"אדמוני":33,"מקורזל מאוד":34,"רך וחלק":37,"מכסה האוזניים":38,"מלבין רק בצדדים":92,"שומני מאוד":110,"התקרחות קדמית":35,"התקרחות אחורית":36},
  ears: {"גדולות ובשרניות":39,"גדולות עומדות תחת השיער":405,"קטנות וצמודות":40,"תנוך ארוך":42,"תנוך מחובר ללחי":96,"תנוך חופשי":97,"שערות בתוך האוזן":41,"אדומות תמיד":43},
  beard: {"ארוך ומלא":93,"קצר ומסודר":94,"חוסר שיער בלחיים":95},
  voice: {"עמוק ונמוך":67,"דק וגבוה":68,"צרוד":69},
  neck: {"צוואר ארוך ודק":70,"צוואר קצר ועבה":71,"כתפיים רחבות":72,"כתפיים שמוטות":73},
  skin: {"יבש ונוקשה":64,"לח ומבריק":65,"נקודות חן כהות":66},
  face_shape: {"מאורכות — סגלגלות":119,"עגולות ומלאות":120,"מרובעות":121,"חוורות / ירוקות":122,"מאירות / זהובות":123},
  palm: {"רחבה ובשרנית":74,"צרה וארוכה":75,"חמה ומזיעה":114,"קרה תמיד":113},
  palm_lines: {"קו חיים ארוך":79,"קו לב מגיע למורה":111,"קו ראש קצר":112,"קווי רשת מרובים":80,"שרטוט דמוי מ":81,"שרטוט דמוי ש":82},
  fingers: {"ארוכות ודקות":76,"קצרות ועבות":77,"אגודל גדול":78,"מורה ארוכה מקמיצה":115,"קמיצה ארוכה ממורה":116,"ציפורניים רחבות קצרות":83,"ציפורניים ארוכות מטופחות":84,"כתמים לבנים":117},
};

const VISION_SYSTEM = `אתה מומחה לחכמת הפרצוף הקבלית. בחן תמונות של פנים/ידיים וזהה מאפיינים פיזיים גלויים בלבד.
חוקים: תאר אך ורק מה שאתה רואה. אל תנחש — אם לא ברור השאר ריק. אל תזהה את האדם. פלט JSON בלבד.
החזר JSON בלבד:
{"forehead":"","forehead_lines":"","eye_color":"","eye_position":"","gaze":"","eyebrows":"","nose":"","lips":"","teeth":"","chin":"","hair":"","ears":"","beard":"","voice":"","neck":"","skin":"","face_shape":"","palm":"","palm_lines":"","fingers":"","visible_notes":""}`;

const VISION_USER = (tl) =>
  `זהה מאפיינים גלויים. עבור כל שדה בחר מהרשימה:\n${tl.map(t=>`${t.id}: [${t.options.filter(Boolean).join(" | ")}]`).join("\n")}\nהחזר JSON בלבד.`;

const SOLO_SYSTEM = `אתה חוקר טקסטואלי מומחה בזוהר פרשת יתרו ופירוש הסולם — חכמת הפרצוף.
יש לך 400 כללים ממסד נתונים מפורט. השתמש בהם לניתוח המאפיינים שנבחרו.
כללים: רק מה שמופיע במפורש במקורות. כל כלל מקושר למקור מדויק. פלט בעברית.
החזר JSON בלבד:
{"diyukna":"","midot":[],"tikkun":"","archetype":"","kelim":[{"organ":"","condition":"","interpretation":"","source":"","confidence":"ישיר|ישיר עם פירוש|מוסק בזהירות","rare":false}]}`;

const MATCH_SYSTEM = (mode) => `אתה חוקר טקסטואלי מומחה בזוהר פרשת יתרו ופירוש הסולם — חכמת הפרצוף.
נתח התאמה בין שני אנשים לפי ${mode==="shidduch"?"שידוך זוגי":"שותפות עסקית"}.
בסס על עקרונות הזוהר: משלים/מנגד, ימין/שמאל, חסד/דין, מחשבה/מעשה.
החזר JSON בלבד:
{"title":"","score":0,"score_label":"","summary":"","strong_points":[],"tension_points":[],"recommendation":"","zohar_principle":""}`;

const fileToBase64=(f)=>new Promise((r,j)=>{const x=new FileReader();x.onload=()=>r(x.result.split(",")[1]);x.onerror=j;x.readAsDataURL(f);});
const blobToBase64=(b)=>new Promise((r,j)=>{const x=new FileReader();x.onload=()=>r(x.result.split(",")[1]);x.onerror=j;x.readAsDataURL(b);});

const callClaude=async(messages,system,max_tokens=1000)=>{
  const resp=await fetch("/.netlify/functions/claude",{
    method:"POST",
    headers:{"Content-Type":"application/json","zzz":"uqvI7T-d8uLHiB5Y1QGbD2yeLlrI6RrEoivouBa1NEFoBRkUkOG_qya2VkfBbMqEIzDL67o8IZrxELhdNQ1tGw-z2KYhQAAapi03-j2YRaWutafWbFI3zSKyEtBMvOa1jme-0C2SgVZBdLUIGCJ2fpRZL2H3ZP8weWTMFquO-4k8nqe5nC34o259qfg-jFp_3AAA","anthropic-version":"2023-06-01"},
    body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens,system,messages}),
  });
  const data=await resp.json();
  if(data.error)throw new Error(data.error.message);
  const text=data.content?.find(b=>b.type==="text")?.text||"";
  return text.replace(/```json|```/g,"").trim();
};

function CameraModal({onCapture,onClose}){
  const vr=useRef(null),cr=useRef(null),sr=useRef(null);
  const[ready,setReady]=useState(false),[facing,setFacing]=useState("user"),[flash,setFlash]=useState(false),[err,setErr]=useState(null);
  const start=useCallback(async(fm)=>{sr.current?.getTracks().forEach(t=>t.stop());setErr(null);setReady(false);
    try{const s=await navigator.mediaDevices.getUserMedia({video:{facingMode:fm,width:{ideal:1280},height:{ideal:720}},audio:false});
      sr.current=s;if(vr.current){vr.current.srcObject=s;vr.current.onloadedmetadata=()=>{vr.current.play();setReady(true);}}}
    catch(e){setErr("לא ניתן לגשת למצלמה — אשר גישה");}
  },[]);
  useState(()=>{start("user");if(!isAuth)return(<div style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",background:"#1A1208",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:9999}}><h2 style={{color:"#C9A84C",marginBottom:"20px"}}>הזן סיסמה</h2><input type="password" value={pwInput} onChange={e=>setPwInput(e.target.value)} style={{padding:"10px",fontSize:"18px",textAlign:"center",borderRadius:"8px",border:"2px solid #C9A84C",background:"#2C1F0A",color:"white",marginBottom:"15px"}} /><button onClick={()=>{if(pwInput===PASSWORD)setIsAuth(true);else alert("סיסמה שגויה");}} style={{padding:"10px 30px",background:"#C9A84C",color:"#1A1208",fontWeight:"bold",fontSize:"16px",borderRadius:"8px",border:"none",cursor:"pointer"}}>כניסה</button></div>);
return()=>sr.current?.getTracks().forEach(t=>t.stop());});
  const flip=()=>{const n=facing==="user"?"environment":"user";setFacing(n);start(n);};
  const capture=()=>{if(!vr.current||!cr.current)return;const v=vr.current,c=cr.current;c.width=v.videoWidth;c.height=v.videoHeight;
    const ctx=c.getContext("2d");if(facing==="user"){ctx.translate(c.width,0);ctx.scale(-1,1);}ctx.drawImage(v,0,0);
    setFlash(true);setTimeout(()=>setFlash(false),180);
    c.toBlob(async(b)=>{onCapture({base64:await blobToBase64(b),preview:URL.createObjectURL(b),mediaType:"image/jpeg"});},"image/jpeg",0.92);};
  return(<div style={{position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,0.93)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
    {flash&&<div style={{position:"absolute",inset:0,background:"white",opacity:0.55,zIndex:10,pointerEvents:"none"}}/>}
    <div style={{position:"relative",width:"100%",maxWidth:460}}>
      <div style={{position:"relative",background:"#000",borderRadius:12,overflow:"hidden"}}>
        <video ref={vr} style={{width:"100%",display:"block",transform:facing==="user"?"scaleX(-1)":"none",maxHeight:"58vh",objectFit:"cover"}} playsInline muted/>
        {ready&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none"}}><div style={{width:"55%",height:"75%",border:"2px solid #C9A84C88",borderRadius:"50%"}}/></div>}
        {err&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"#1A120899",color:"#F5EDD8",fontFamily:"sans-serif",fontSize:13,textAlign:"center",padding:"1rem"}}>{err}</div>}
        {!ready&&!err&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"#1A1208",color:"#C9A84C",fontFamily:"sans-serif",fontSize:12}}>טוען מצלמה...</div>}
      </div><canvas ref={cr} style={{display:"none"}}/>
    </div>
    <div style={{color:"#C4B490",fontFamily:"sans-serif",fontSize:11,marginTop:8}}>כוון את הפנים לתוך האליפסה</div>
    <div style={{display:"flex",alignItems:"center",gap:24,marginTop:16}}>
      <button onClick={onClose} style={{width:44,height:44,borderRadius:"50%",background:"#33251566",border:"1px solid #EDE4CC44",color:"#F5EDD8",fontSize:17,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
      <button onClick={capture} disabled={!ready} style={{width:66,height:66,borderRadius:"50%",background:ready?"#C9A84C":"#555",border:"4px solid rgba(255,255,255,0.25)",cursor:ready?"pointer":"not-allowed"}}/>
      <button onClick={flip} style={{width:44,height:44,borderRadius:"50%",background:"#33251566",border:"1px solid #EDE4CC44",color:"#F5EDD8",fontSize:17,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>⟳</button>
    </div>
  </div>);
}

function RuleCard({rule}){
  const cc=rule.confidence==="ישיר"?{bg:"#e8f5e2",c:"#2d6a1f"}:rule.confidence?.includes("עם פירוש")?{bg:"#e8eef8",c:"#1a3a72"}:{bg:"#fdf3e3",c:"#7a4a0a"};
  return(<div style={{background:"#FDF8EE",border:`1px solid ${rule.rare?"#C9A84C":"#EDE4CC"}`,borderRadius:8,padding:"0.75rem 0.9rem",borderRight:rule.rare?"4px solid #C9A84C":undefined}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
      <span style={{fontFamily:"sans-serif",fontWeight:600,fontSize:13,color:"#2C1F0A"}}>{rule.organ}{rule.rare&&<span style={{marginRight:5,fontSize:9,color:"#C9A84C",border:"1px solid #C9A84C",borderRadius:4,padding:"1px 5px"}}>נדיר</span>}</span>
      {rule.confidence&&<span style={{fontSize:9,padding:"2px 8px",borderRadius:10,background:cc.bg,color:cc.c,fontFamily:"sans-serif"}}>{rule.confidence}</span>}
    </div>
    <div style={{fontSize:11,color:"#7A6040",fontFamily:"sans-serif",marginBottom:4}}>תנאי: {rule.condition}</div>
    <div style={{fontSize:13,lineHeight:1.7,color:"#2C1F0A",fontFamily:"sans-serif"}}>{rule.interpretation||rule.interp}</div>
    <div style={{marginTop:5,paddingTop:5,borderTop:"1px solid #EDE4CC",fontSize:10,color:"#9A8060",fontFamily:"sans-serif"}}>מקור: {rule.source}</div>
  </div>);
}

function PersonPanel({label,color,images,traits,result,phase,detectedNotes,onAddFiles,onCamera,onRemoveImage,onDetect,onAnalyze,onTraitChange,onBack}){
  const fr=useRef();
  const selectedCount=Object.values(traits).filter(Boolean).length;
  // מציג כללים רלוונטיים ממסד הנתונים
  const localRules=Object.entries(traits).filter(([,v])=>v).flatMap(([tid,val])=>{
    const ruleId=OPTION_TO_RULE[tid]?.[val];
    if(!ruleId)return[];
    const r=RULES_DB.find(x=>x.id===ruleId);
    return r?[r]:[];
  });
  return(<div>
    <div style={{background:color,borderRadius:8,padding:"0.55rem 0.9rem",marginBottom:"0.75rem",display:"flex",alignItems:"center",gap:8}}>
      <div style={{width:26,height:26,borderRadius:"50%",background:"rgba(255,255,255,0.2)",border:"2px solid rgba(255,255,255,0.5)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:"white",fontWeight:700}}>{label[0]}</div>
      <span style={{color:"white",fontFamily:"sans-serif",fontSize:13,fontWeight:600}}>{label}</span>
      {result&&<span style={{marginRight:"auto",background:"rgba(255,255,255,0.2)",color:"white",fontSize:10,padding:"2px 8px",borderRadius:12,fontFamily:"sans-serif"}}>✓ נותח</span>}
    </div>
    {phase==="upload"&&(<>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:"0.7rem"}}>
        <button onClick={onCamera} disabled={images.length>=4} style={{padding:"0.8rem 0.4rem",background:images.length>=4?"#EDE4CC":"#1A1208",color:images.length>=4?"#9A8060":"#C9A84C",border:`2px solid ${images.length>=4?"#EDE4CC":"#C9A84C"}`,borderRadius:9,cursor:images.length>=4?"not-allowed":"pointer",fontFamily:"sans-serif",fontSize:12,fontWeight:600,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
          <span style={{fontSize:22}}>📷</span>מצלמה
        </button>
        <div onClick={()=>images.length<4&&fr.current.click()} style={{padding:"0.8rem 0.4rem",border:"2px dashed #EDE4CC",borderRadius:9,background:"#FDF8EE",cursor:images.length>=4?"not-allowed":"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,fontFamily:"sans-serif",fontSize:12,fontWeight:600,color:"#5C4A2A"}}>
          <span style={{fontSize:22}}>🖼</span>גלריה
        </div>
        <input ref={fr} type="file" accept="image/*" multiple style={{display:"none"}} onChange={e=>onAddFiles(e.target.files)}/>
      </div>
      {images.length>0&&(<>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:5,marginBottom:"0.65rem"}}>
          {images.map((img,i)=>(<div key={i} style={{position:"relative",borderRadius:5,overflow:"hidden",aspectRatio:"1",border:`2px solid ${color}`}}>
            <img src={img.preview} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            <button onClick={()=>onRemoveImage(i)} style={{position:"absolute",top:2,left:2,background:"rgba(26,18,8,0.8)",color:"#F5EDD8",border:"none",borderRadius:"50%",width:16,height:16,fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",padding:0}}>×</button>
          </div>))}
          {images.length<4&&<div onClick={onCamera} style={{aspectRatio:"1",border:"2px dashed #EDE4CC",borderRadius:5,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#9A8060",fontSize:16}}>+</div>}
        </div>
        <button onClick={onDetect} style={{width:"100%",padding:"0.65rem",background:color,color:"white",border:"none",borderRadius:7,fontFamily:"sans-serif",fontSize:12,fontWeight:600,cursor:"pointer"}}>זהה מאפיינים מ-{images.length} תמונות</button>
      </>)}
      <div style={{textAlign:"center",marginTop:"0.55rem"}}>
        <button onClick={()=>onTraitChange("__goto_review")} style={{background:"transparent",border:"none",color:"#9A8060",fontFamily:"sans-serif",fontSize:11,cursor:"pointer",textDecoration:"underline"}}>הזנה ידנית</button>
      </div>
    </>)}
    {phase==="detecting"&&(<div style={{textAlign:"center",padding:"2rem 1rem"}}>
      <div style={{width:40,height:40,border:"3px solid #EDE4CC",borderTop:`3px solid ${color}`,borderRadius:"50%",margin:"0 auto 0.75rem",animation:"spin 1s linear infinite"}}/>
      <div style={{fontFamily:"sans-serif",fontSize:12,color:"#2C1F0A"}}>בוחן תמונות...</div>
    </div>)}
    {phase==="review"&&(<>
      {images.length>0&&<div style={{display:"flex",gap:4,marginBottom:"0.6rem",overflowX:"auto"}}>{images.map((img,i)=><img key={i} src={img.preview} alt="" style={{height:40,width:40,objectFit:"cover",borderRadius:4,border:`2px solid ${color}`,flexShrink:0}}/>)}</div>}
      {detectedNotes&&<div style={{background:"#F0EAD6",borderRight:"3px solid #C9A84C",borderRadius:"0 6px 6px 0",padding:"0.5rem 0.7rem",marginBottom:"0.6rem",fontFamily:"sans-serif",fontSize:11,color:"#2C1F0A"}}>{detectedNotes}</div>}
      <div style={{background:"#FDF3D8",border:"1px solid #C9A84C44",borderRadius:6,padding:"0.45rem 0.7rem",marginBottom:"0.65rem",fontFamily:"sans-serif",fontSize:11,color:"#5C4A2A"}}>
        {selectedCount>0?`זוהו ${selectedCount} מאפיינים`:"בחר מאפיינים ידנית"}
      </div>
      {/* תצוגת כללים בזמן אמת */}
      {localRules.length>0&&(<div style={{marginBottom:"0.65rem"}}>
        <div style={{fontSize:9,fontFamily:"sans-serif",color:"#8B4513",letterSpacing:2,marginBottom:5,fontWeight:600}}>כללים שזוהו ממסד 400 הכללים</div>
        <div style={{display:"grid",gap:"0.35rem",maxHeight:180,overflowY:"auto"}}>
          {localRules.map((r,i)=>(<div key={i} style={{background:"#F0EAD6",border:`1px solid ${r.rare?"#C9A84C":"#EDE4CC"}`,borderRadius:6,padding:"0.4rem 0.6rem"}}>
            <div style={{fontFamily:"sans-serif",fontSize:11,fontWeight:600,color:"#2C1F0A",marginBottom:2}}>{r.organ}{r.rare&&<span style={{marginRight:4,fontSize:8,color:"#C9A84C",border:"1px solid #C9A84C",borderRadius:3,padding:"0px 4px"}}>נדיר</span>}</div>
            <div style={{fontFamily:"sans-serif",fontSize:11,color:"#3C2A0A",lineHeight:1.5}}>{r.interp}</div>
          </div>))}
        </div>
      </div>)}
      <div style={{display:"grid",gap:"0.4rem",marginBottom:"0.8rem",maxHeight:260,overflowY:"auto"}}>
        {TRAITS.map(trait=>(<div key={trait.id} style={{background:"#FDF8EE",border:`1px solid ${traits[trait.id]?color:"#EDE4CC"}`,borderRadius:6,padding:"0.4rem 0.65rem"}}>
          <label style={{display:"flex",alignItems:"center",gap:5,fontSize:11,fontFamily:"sans-serif",color:"#5C4A2A",marginBottom:3,fontWeight:500}}>
            <span style={{color,minWidth:13}}>{trait.icon}</span>{trait.label}
            {traits[trait.id]&&<span style={{marginRight:"auto",fontSize:8,background:"#F0E8CC",color:"#8B4513",padding:"1px 5px",borderRadius:7}}>זוהה</span>}
          </label>
          <select value={traits[trait.id]||""} onChange={e=>onTraitChange(trait.id,e.target.value)} style={{width:"100%",padding:"4px 6px",border:"1px solid #EDE4CC",borderRadius:4,background:"white",color:"#2C1F0A",fontFamily:"sans-serif",fontSize:11,direction:"rtl"}}>
            <option value="">— לא זוהה —</option>
            {trait.options.filter(Boolean).map(o=><option key={o} value={o}>{o}</option>)}
          </select>
        </div>))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"auto 1fr",gap:6}}>
        <button onClick={onBack} style={{padding:"0.6rem 0.8rem",background:"transparent",border:"1px solid #EDE4CC",borderRadius:6,fontFamily:"sans-serif",fontSize:11,color:"#7A6A50",cursor:"pointer"}}>← חזור</button>
        <button onClick={onAnalyze} disabled={selectedCount===0} style={{padding:"0.6rem",background:selectedCount>0?color:"#C5BAA0",color:selectedCount>0?"white":"#9A8F7A",border:"none",borderRadius:6,fontFamily:"sans-serif",fontSize:12,fontWeight:600,cursor:selectedCount>0?"pointer":"not-allowed"}}>
          {selectedCount===0?"בחר מאפיין":`נתח ${selectedCount} מאפיינים לפי הזוהר`}
        </button>
      </div>
    </>)}
    {phase==="analyzing"&&(<div style={{textAlign:"center",padding:"2rem 1rem"}}>
      <div style={{width:40,height:40,border:"3px solid #EDE4CC",borderTop:`3px solid ${color}`,borderRadius:"50%",margin:"0 auto 0.75rem",animation:"spin 1s linear infinite"}}/>
      <div style={{fontFamily:"sans-serif",fontSize:12,color:"#2C1F0A"}}>מנתח לפי הזוהר...</div>
    </div>)}
    {phase==="result"&&result&&(<>
      <div style={{background:"#1A1208",border:`2px solid ${color}`,borderRadius:8,padding:"0.85rem 1rem",marginBottom:"0.6rem",textAlign:"center"}}>
        <div style={{fontSize:9,color,fontFamily:"sans-serif",letterSpacing:3,marginBottom:3}}>דיוקן הנשמה</div>
        <div style={{fontSize:16,color:"#F5EDD8",fontWeight:400,marginBottom:4}}>{result.archetype}</div>
        <div style={{fontSize:12,color:"#C4B490",lineHeight:1.6,fontFamily:"sans-serif"}}>{result.diyukna}</div>
      </div>
      {result.midot?.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:"0.6rem"}}>{result.midot.map((m,i)=><span key={i} style={{background:"#F0E8CC",border:`1px solid ${color}`,borderRadius:14,padding:"2px 9px",fontSize:11,fontFamily:"sans-serif",color:"#2C1F0A"}}>{m}</span>)}</div>}
      {result.tikkun&&<div style={{background:"#F0EAD6",borderRight:"3px solid #C9A84C",borderRadius:"0 7px 7px 0",padding:"0.55rem 0.75rem",marginBottom:"0.6rem"}}>
        <div style={{fontSize:9,fontFamily:"sans-serif",color:"#8B4513",letterSpacing:2,marginBottom:3,fontWeight:600}}>המלצת תיקון</div>
        <div style={{fontSize:12,fontFamily:"sans-serif",color:"#2C1F0A",lineHeight:1.6}}>{result.tikkun}</div>
      </div>}
      <div style={{display:"grid",gap:"0.4rem"}}>{result.kelim?.slice(0,5).map((k,i)=><RuleCard key={i} rule={k}/>)}</div>
    </>)}
  </div>);
}

function MatchResult({match,mode}){
  const accent=mode==="shidduch"?"#6B1A2A":"#1A3A6B";
  const title=mode==="shidduch"?"התאמה זוגית — שידוך":"התאמה עסקית — שותפות";
  return(<div>
    <div style={{background:"#1A1208",border:`2px solid ${accent}`,borderRadius:10,padding:"1rem 1.1rem",marginBottom:"0.8rem",textAlign:"center"}}>
      <div style={{fontSize:9,color:accent,fontFamily:"sans-serif",letterSpacing:3,marginBottom:3}}>{title}</div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:7}}>
        <div style={{fontSize:40,fontWeight:700,color:match.score>=75?"#C9A84C":match.score>=50?"#C4B490":"#A06050"}}>{match.score}</div>
        <div><div style={{fontSize:9,color:"#9A8060",fontFamily:"sans-serif"}}>מתוך 100</div><div style={{fontSize:13,color:"#F5EDD8",fontFamily:"sans-serif",fontWeight:600}}>{match.score_label}</div></div>
      </div>
      <div style={{height:5,background:"#3A2D18",borderRadius:3,margin:"0 0.75rem"}}>
        <div style={{height:"100%",width:`${match.score}%`,background:match.score>=75?"#C9A84C":match.score>=50?"#C4B490":"#A06050",borderRadius:3}}/>
      </div>
    </div>
    <div style={{background:"#FDF8EE",border:"1px solid #EDE4CC",borderRadius:8,padding:"0.8rem 0.9rem",marginBottom:"0.65rem"}}>
      <div style={{fontSize:9,fontFamily:"sans-serif",color:"#8B4513",letterSpacing:2,marginBottom:5,fontWeight:600}}>סיכום ההתאמה</div>
      <div style={{fontSize:13,fontFamily:"sans-serif",color:"#2C1F0A",lineHeight:1.7}}>{match.summary}</div>
    </div>
    {match.strong_points?.length>0&&<div style={{background:"#EFF8E8",border:"1px solid #A8D88A",borderRadius:8,padding:"0.7rem 0.9rem",marginBottom:"0.6rem"}}>
      <div style={{fontSize:9,fontFamily:"sans-serif",color:"#2d6a1f",letterSpacing:2,marginBottom:5,fontWeight:600}}>נקודות חוזק משותפות</div>
      {match.strong_points.map((p,i)=><div key={i} style={{fontFamily:"sans-serif",fontSize:12,color:"#1A3A10",marginBottom:3,paddingRight:12,position:"relative"}}><span style={{position:"absolute",right:0,color:"#3d8a27"}}>✓</span>{p}</div>)}
    </div>}
    {match.tension_points?.length>0&&<div style={{background:"#FEF5E8",border:"1px solid #F0C070",borderRadius:8,padding:"0.7rem 0.9rem",marginBottom:"0.6rem"}}>
      <div style={{fontSize:9,fontFamily:"sans-serif",color:"#854F0B",letterSpacing:2,marginBottom:5,fontWeight:600}}>נקודות מתח ואיזון</div>
      {match.tension_points.map((p,i)=><div key={i} style={{fontFamily:"sans-serif",fontSize:12,color:"#5C3A0A",marginBottom:3,paddingRight:12,position:"relative"}}><span style={{position:"absolute",right:0,color:"#C4900A"}}>△</span>{p}</div>)}
    </div>}
    {match.recommendation&&<div style={{background:"#F0EAD6",borderRight:`4px solid ${accent}`,borderRadius:"0 8px 8px 0",padding:"0.7rem 0.9rem",marginBottom:"0.6rem"}}>
      <div style={{fontSize:9,fontFamily:"sans-serif",color:"#8B4513",letterSpacing:2,marginBottom:3,fontWeight:600}}>המלצה לפי הסולם</div>
      <div style={{fontSize:12,fontFamily:"sans-serif",color:"#2C1F0A",lineHeight:1.7}}>{match.recommendation}</div>
    </div>}
    {match.zohar_principle&&<div style={{background:"#1A1208",borderRadius:8,padding:"0.7rem 0.9rem",textAlign:"center"}}>
      <div style={{fontSize:9,color:accent,fontFamily:"sans-serif",letterSpacing:2,marginBottom:3}}>עיקרון מהזוהר</div>
      <div style={{fontSize:13,color:"#C4B490",fontFamily:"'Georgia',serif",lineHeight:1.6,fontStyle:"italic"}}>{match.zohar_principle}</div>
    </div>}
  </div>);
}

const INIT=()=>({images:[],traits:{},result:null,phase:"upload",detectedNotes:""});

export default function ZoharApp(){
  const[isAuth,setIsAuth]=useState(false);
const[pwInput,setPwInput]=useState("");
const[appMode,setAppMode]=useState("home");
  const[matchMode,setMatchMode]=useState(null);
  const[persons,setPersons]=useState([INIT(),INIT()]);
  const[showCamera,setShowCamera]=useState(null);
  const[matchResult,setMatchResult]=useState(null);
  const[matchLoading,setMatchLoading]=useState(false);
  const[globalError,setGlobalError]=useState(null);

  const upd=(idx,patch)=>setPersons(p=>p.map((x,i)=>i===idx?{...x,...patch}:x));

  const addFiles=async(idx,files)=>{
    const p=persons[idx];
    const valid=Array.from(files).filter(f=>f.type.startsWith("image/")).slice(0,4-p.images.length);
    if(!valid.length)return;
    const proc=await Promise.all(valid.map(async f=>({base64:await fileToBase64(f),preview:URL.createObjectURL(f),mediaType:f.type})));
    upd(idx,{images:[...p.images,...proc].slice(0,4)});
  };

  const handleCapture=(idx,img)=>{const p=persons[idx];if(p.images.length>=4)return;upd(idx,{images:[...p.images,img]});setShowCamera(null);};

  const detect=async(idx)=>{
    const p=persons[idx];if(!p.images.length)return;
    upd(idx,{phase:"detecting"});
    try{
      const content=[...p.images.map(img=>({type:"image",source:{type:"base64",media_type:img.mediaType,data:img.base64}})),{type:"text",text:VISION_USER(TRAITS)}];
      const raw=await callClaude([{role:"user",content}],VISION_SYSTEM,800);
      const det=JSON.parse(raw);const notes=det.visible_notes||"";delete det.visible_notes;
      const filled={};for(const t of TRAITS){const v=det[t.id]||"";filled[t.id]=t.options.includes(v)?v:"";}
      upd(idx,{traits:filled,detectedNotes:notes,phase:"review"});
    }catch(e){setGlobalError("שגיאה בזיהוי: "+e.message);upd(idx,{phase:"upload"});}
  };

  const analyze=async(idx)=>{
    const p=persons[idx];upd(idx,{phase:"analyzing"});
    try{
      // בנה הקשר עשיר ממסד הנתונים
      const localRules=Object.entries(p.traits).filter(([,v])=>v).flatMap(([tid,val])=>{
        const ruleId=OPTION_TO_RULE[tid]?.[val];if(!ruleId)return[];
        const r=RULES_DB.find(x=>x.id===ruleId);return r?[r]:[];
      });
      const rulesContext=localRules.length>0?`\n\nכללים ממסד 400 הכללים שזוהו:\n${localRules.map(r=>`- ${r.organ}: ${r.condition} → ${r.interp} (מקור: ${r.source})`).join("\n")}`:"";
      const lines=Object.entries(p.traits).filter(([,v])=>v).map(([id,v])=>{const t=TRAITS.find(x=>x.id===id);return`${t?.label}: ${v}`;});
      if(!lines.length){upd(idx,{phase:"review"});return;}
      const raw=await callClaude([{role:"user",content:`נתח לפי חכמת הפרצוף בזוהר פרשת יתרו עם פירוש הסולם:\n\n${lines.join("\n")}${rulesContext}`}],SOLO_SYSTEM,1000);
      upd(idx,{result:JSON.parse(raw),phase:"result"});
    }catch(e){setGlobalError("שגיאה בניתוח: "+e.message);upd(idx,{phase:"review"});}
  };

  const doMatch=async()=>{
    const[p1,p2]=persons;if(!p1.result||!p2.result){setGlobalError("יש לנתח את שני האנשים לפני ההשוואה");return;}
    setMatchLoading(true);setMatchResult(null);setGlobalError(null);
    try{
      const prompt=`אדם א:\nארכיטיפ: ${p1.result.archetype}\nמידות: ${p1.result.midot?.join(", ")}\nדיוקן: ${p1.result.diyukna}\n\nאדם ב:\nארכיטיפ: ${p2.result.archetype}\nמידות: ${p2.result.midot?.join(", ")}\nדיוקן: ${p2.result.diyukna}\n\nנתח התאמה לפי ${matchMode==="shidduch"?"שידוך זוגי":"שותפות עסקית"}.`;
      const raw=await callClaude([{role:"user",content:prompt}],MATCH_SYSTEM(matchMode),1000);
      setMatchResult(JSON.parse(raw));
    }catch(e){setGlobalError("שגיאה: "+e.message);}finally{setMatchLoading(false);}
  };

  const resetAll=()=>{setAppMode("home");setMatchMode(null);setPersons([INIT(),INIT()]);setMatchResult(null);setMatchLoading(false);setGlobalError(null);};
  const bothDone=persons[0].result&&persons[1].result;
  const PC=["#1A3A6B","#6B1A2A"],PL=["אדם א","אדם ב"];

  if(appMode==="home")return(
    <div style={{minHeight:"100vh",background:"#F5EDD8",fontFamily:"'Georgia','David',serif",direction:"rtl",color:"#2C1F0A"}}>
      <div style={{background:"#1A1208",borderBottom:"3px solid #C9A84C",padding:"1.5rem 1.5rem 1.1rem",textAlign:"center"}}>
        <div style={{fontSize:10,letterSpacing:4,color:"#C9A84C",marginBottom:4,fontFamily:"sans-serif",fontWeight:500}}>חכמת הפרצוף • ספר הזוהר • פירוש הסולם</div>
        <h1 style={{fontSize:24,color:"#F5EDD8",margin:0,fontWeight:400}}>ואתה תחזה מכל העם</h1>
        <div style={{fontSize:11,color:"#9A8060",marginTop:3,fontFamily:"sans-serif"}}>פרשת יתרו • 400+ כללים • זוהר + זוהר חדש + הסולם + רזא דרזין</div>
      </div>
      <div style={{maxWidth:480,margin:"0 auto",padding:"1.5rem 1rem"}}>
        <div style={{display:"grid",gap:"0.8rem"}}>
          <button onClick={()=>setAppMode("solo")} style={{padding:"1.1rem",background:"#1A1208",color:"#C9A84C",border:"2px solid #C9A84C",borderRadius:10,cursor:"pointer",fontFamily:"sans-serif",fontSize:14,fontWeight:600,textAlign:"right",display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:26}}>👤</span>
            <div><div>ניתוח אדם אחד</div><div style={{fontSize:11,fontWeight:400,color:"#C4B490",marginTop:2}}>זיהוי מתמונות + ניתוח מ-400 כללים</div></div>
          </button>
          <div style={{borderTop:"1px solid #EDE4CC",margin:"0.1rem 0",position:"relative",textAlign:"center"}}>
            <span style={{background:"#F5EDD8",padding:"0 0.75rem",color:"#9A8060",fontFamily:"sans-serif",fontSize:11,position:"relative",top:"-0.55rem"}}>או השווה שני אנשים</span>
          </div>
          <button onClick={()=>{setMatchMode("shidduch");setAppMode("duo");}} style={{padding:"1.1rem",background:"#1A1208",color:"#F5B8C0",border:"2px solid #6B1A2A",borderRadius:10,cursor:"pointer",fontFamily:"sans-serif",fontSize:14,fontWeight:600,textAlign:"right",display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:26}}>💍</span>
            <div><div>התאמה זוגית — שידוך</div><div style={{fontSize:11,fontWeight:400,color:"#C4B490",marginTop:2}}>ניתוח שני אנשים + בדיקת התאמה זוגית</div></div>
          </button>
          <button onClick={()=>{setMatchMode("business");setAppMode("duo");}} style={{padding:"1.1rem",background:"#1A1208",color:"#B8C8F5",border:"2px solid #1A3A6B",borderRadius:10,cursor:"pointer",fontFamily:"sans-serif",fontSize:14,fontWeight:600,textAlign:"right",display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:26}}>🤝</span>
            <div><div>התאמה עסקית — שותפות</div><div style={{fontSize:11,fontWeight:400,color:"#C4B490",marginTop:2}}>ניתוח שני אנשים + בדיקת שותפות עסקית</div></div>
          </button>
        </div>
        <div style={{marginTop:"1.25rem",background:"#FDF3D8",border:"1px solid #C9A84C44",borderRadius:8,padding:"0.75rem 1rem",fontFamily:"sans-serif",fontSize:11,color:"#5C4A2A",textAlign:"center"}}>
          מסד נתונים: {RULES_DB.length} כללים • זוהר יתרו • זוהר חדש • פירוש הסולם
        </div>
      </div>
    </div>
  );

  if(appMode==="solo"){const p=persons[0];return(
    <div style={{minHeight:"100vh",background:"#F5EDD8",fontFamily:"'Georgia','David',serif",direction:"rtl",color:"#2C1F0A"}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      {showCamera!==null&&<CameraModal onCapture={img=>handleCapture(showCamera,img)} onClose={()=>setShowCamera(null)}/>}
      <div style={{background:"#1A1208",borderBottom:"3px solid #C9A84C",padding:"0.9rem 1.5rem",textAlign:"center"}}>
        <div style={{fontSize:9,letterSpacing:4,color:"#C9A84C",marginBottom:2,fontFamily:"sans-serif",fontWeight:500}}>חכמת הפרצוף • ספר הזוהר</div>
        <h1 style={{fontSize:20,color:"#F5EDD8",margin:0,fontWeight:400}}>ואתה תחזה מכל העם</h1>
        <button onClick={resetAll} style={{marginTop:4,background:"transparent",border:"none",color:"#9A8060",fontFamily:"sans-serif",fontSize:10,cursor:"pointer"}}>← תפריט ראשי</button>
      </div>
      <div style={{maxWidth:540,margin:"0 auto",padding:"1rem 0.8rem"}}>
        {globalError&&<div style={{background:"#FEF0F0",border:"1px solid #FCCACA",borderRadius:7,padding:"0.6rem 0.8rem",marginBottom:"0.8rem",fontFamily:"sans-serif",fontSize:12,color:"#8B1A1A"}}>{globalError}</div>}
        <PersonPanel label="ניתוח אישי" color="#C9A84C" images={p.images} traits={p.traits} result={p.result} phase={p.phase} detectedNotes={p.detectedNotes}
          onAddFiles={f=>addFiles(0,f)} onCamera={()=>setShowCamera(0)}
          onRemoveImage={i=>upd(0,{images:p.images.filter((_,j)=>j!==i)})}
          onDetect={()=>detect(0)} onAnalyze={()=>analyze(0)}
          onTraitChange={(id,val)=>{if(id==="__goto_review"){upd(0,{phase:"review"});return;}upd(0,{traits:{...p.traits,[id]:val}});}}
          onBack={()=>upd(0,{phase:"upload"})}/>
      </div>
    </div>
  );}

  const mA=matchMode==="shidduch"?"#6B1A2A":"#1A3A6B";
  const mT=matchMode==="shidduch"?"התאמה זוגית — שידוך":"התאמה עסקית — שותפות";
  const mI=matchMode==="shidduch"?"💍":"🤝";
  return(
    <div style={{minHeight:"100vh",background:"#F5EDD8",fontFamily:"'Georgia','David',serif",direction:"rtl",color:"#2C1F0A"}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      {showCamera!==null&&<CameraModal onCapture={img=>handleCapture(showCamera,img)} onClose={()=>setShowCamera(null)}/>}
      <div style={{background:"#1A1208",borderBottom:"3px solid #C9A84C",padding:"0.9rem 1.5rem",textAlign:"center"}}>
        <div style={{fontSize:9,letterSpacing:3,color:"#C9A84C",marginBottom:2,fontFamily:"sans-serif",fontWeight:500}}>חכמת הפרצוף • ספר הזוהר • פירוש הסולם</div>
        <div style={{display:"inline-flex",alignItems:"center",gap:7,background:`${mA}22`,border:`1px solid ${mA}`,borderRadius:18,padding:"2px 10px",marginBottom:3}}>
          <span style={{fontSize:13}}>{mI}</span><span style={{fontSize:11,color:"#F5EDD8",fontFamily:"sans-serif",fontWeight:600}}>{mT}</span>
        </div>
        <h1 style={{fontSize:18,color:"#F5EDD8",margin:"2px 0 0",fontWeight:400}}>ואתה תחזה מכל העם</h1>
        <button onClick={resetAll} style={{marginTop:4,background:"transparent",border:"none",color:"#9A8060",fontFamily:"sans-serif",fontSize:9,cursor:"pointer"}}>← תפריט ראשי</button>
      </div>
      <div style={{maxWidth:700,margin:"0 auto",padding:"0.9rem 0.8rem"}}>
        {globalError&&<div style={{background:"#FEF0F0",border:"1px solid #FCCACA",borderRadius:7,padding:"0.6rem 0.8rem",marginBottom:"0.8rem",fontFamily:"sans-serif",fontSize:12,color:"#8B1A1A"}}>{globalError}<button onClick={()=>setGlobalError(null)} style={{marginRight:6,background:"transparent",border:"none",cursor:"pointer",color:"#8B1A1A",fontWeight:700}}>✕</button></div>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.8rem",marginBottom:"0.9rem"}}>
          {persons.map((p,idx)=>(<PersonPanel key={idx} label={PL[idx]} color={PC[idx]}
            images={p.images} traits={p.traits} result={p.result} phase={p.phase} detectedNotes={p.detectedNotes}
            onAddFiles={f=>addFiles(idx,f)} onCamera={()=>setShowCamera(idx)}
            onRemoveImage={i=>upd(idx,{images:p.images.filter((_,j)=>j!==i)})}
            onDetect={()=>detect(idx)} onAnalyze={()=>analyze(idx)}
            onTraitChange={(id,val)=>{if(id==="__goto_review"){upd(idx,{phase:"review"});return;}upd(idx,{traits:{...p.traits,[id]:val}});}}
            onBack={()=>upd(idx,{phase:"upload"})}/>))}
        </div>
        {!matchResult&&<button onClick={doMatch} disabled={!bothDone||matchLoading} style={{width:"100%",padding:"0.85rem",background:bothDone&&!matchLoading?mA:"#C5BAA0",color:bothDone&&!matchLoading?"white":"#9A8F7A",border:"none",borderRadius:8,fontFamily:"sans-serif",fontSize:14,fontWeight:600,cursor:bothDone&&!matchLoading?"pointer":"not-allowed",marginBottom:"0.9rem",display:"flex",alignItems:"center",justifyContent:"center",gap:7}}>
          {matchLoading?<><div style={{width:16,height:16,border:"2px solid rgba(255,255,255,0.3)",borderTop:"2px solid white",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/> מנתח...</>:!bothDone?`${mI} נתח את שני האנשים תחילה`:`${mI} נתח התאמה — ${mT}`}
        </button>}
        {matchResult&&(<>
          <MatchResult match={matchResult} mode={matchMode}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginTop:"0.9rem"}}>
            <button onClick={()=>setMatchResult(null)} style={{padding:"0.7rem",background:"transparent",border:"1px solid #EDE4CC",borderRadius:7,fontFamily:"sans-serif",fontSize:11,color:"#7A6A50",cursor:"pointer"}}>חשב מחדש</button>
            <button onClick={resetAll} style={{padding:"0.7rem",background:"#1A1208",color:"#C9A84C",border:"1px solid #C9A84C",borderRadius:7,fontFamily:"sans-serif",fontSize:11,fontWeight:600,cursor:"pointer"}}>ניתוח חדש</button>
          </div>
        </>)}
      </div>
    </div>
  );
}




