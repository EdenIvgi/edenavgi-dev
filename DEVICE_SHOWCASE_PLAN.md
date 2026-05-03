# תוכנית פעולה — Device Showcase פוטוריאליסטי

> **חשוב:** קובץ זה הוא תוכנית פעולה חיה. **יש לעדכן אותו בסיום כל שלב** — לסמן את ה-checkbox שהושלם (`[x]`) ולעדכן הערות אם חלו שינויים בהיקף או בגישה. הקובץ הוא מקור האמת היחיד למצב ההתקדמות.

## הקשר

עמוד פרויקט בודד (`/projects/:id`) יקבל **Hero scene** מקצועי המציג שלושה מכשירים פוטוריאליסטיים: **iPad Pro 11" (landscape)** עם מסך אפליקציה, **iPhone 16 Pro** עם מסך נוסף, ו-**iPhone 16 Pro שני** שמנגן וידאו של זרימת האפליקציה. המסגרות הן Apple Design Resources רשמיות (Bezels), חינמיות — לא מסגרות SVG מצוירות מאפס.

---

## Phase A — Hero ריק (מסגרות בלבד, ללא תוכן)

- [x] **A1.** ייבוא נכסי מכשירים מ-Apple Design Resources ✅
  - יוצאו מ-Figma (iOS 18 / Bezels): iPhone 16 Pro + iPad Pro 11"
  - PNG @3x, רקע שקוף, מסך פנימי שקוף (alpha=0)
  - aperture זוהה אוטומטית באמצעות סקריפט Python (PIL) — סריקת קווי אמצע למציאת גבולות המסך
  - קבצים שמורים ב-`public/devices/`:
    - `iphone-16pro.png` (1350×2760) + `iphone-16pro.aperture.json` — מסך 1204×2620 @ (73,70), radius 165
    - `ipad-11.png` (3960×2820, landscape) + `ipad-11.aperture.json` — מסך 3628×2500 @ (166,160), radius 54

- [x] **A2.** רכיב `DeviceFrame.tsx` ✅
  - יצירת `src/components/ui/DeviceFrame.tsx`
  - יצירת `src/utils/deviceApertures.ts` — מיפוי `variant → aperture` (טוען את ה-JSONs)
  - props: `variant: 'iphone-16pro' | 'ipad-11'`, `children?`, `className?`
  - `<div>` עם יחס גובה־רוחב מקורי של ה-PNG, מסך פנימי ממוקם בפרצנטים מחושבים מה-aperture עם `border-radius` תואם, PNG מעל

- [x] **A3.** רכיב `ProjectShowcase.tsx` ✅
  - יצירת `src/components/sections/ProjectShowcase.tsx`
  - קומפוזיציית Hero: iPad Pro 11" landscape במרכז־אחור, iPhone סטטי קדימה־שמאל, iPhone וידאו קדימה־ימין
  - `transform-style: preserve-3d` + `perspective: 1400px` + `rotateY`/`translateZ` לכל מכשיר
  - שימוש ב-`fadeUp` מ-`useScrollAnimation.ts` ל-`whileInView` עדין
  - Responsive: מתחת ל-`md` עובר ל-stack אנכי (iPad למעלה, iPhones מתחת)
  - props: `tabletScreen?`, `phoneScreen?`, `videoPhone?` — כולם אופציונליים

- [x] **A4.** חיבור לעמוד פרויקט ✅
  - איתור עמוד הפרויקט (`src/pages/ProjectDetail.tsx` או דומה)
  - החלפת בלוק ה-hero הקיים ב-`<ProjectShowcase />` ללא props
  - גלריה ותיאור נשארים ללא שינוי

- [x] **A5.** וידוא Phase A ✅
  - הרצת dev server (`preview_start`)
  - ניווט ל-`/projects/baros` — לראות 3 מכשירים ריקים מסודרים נכון
  - בדיקת console נקי
  - בדיקת responsive ב-mobile
  - `preview_screenshot` לאישור

---

## Phase B — חיבור מסכי האפליקציה האמיתיים

- [x] **B1.** הרחבת טיפוס `Project` ✅
  - עדכון `src/types/project.ts`:
    ```ts
    export interface ProjectShowcaseSlots {
      tabletScreen?: string
      phoneScreen?: string
      videoPhone?: { mp4?: string; webm?: string; poster?: string }
    }
    ```
  - הוספת `showcase?: ProjectShowcaseSlots` ל-`Project` (additive, לא שובר קוד קיים)

- [x] **B2.** מילוי showcase ל-BarOS ✅
  - עדכון `src/data/projects.ts` — שימוש בנכסים קיימים תחת `/public/projects/baros/mobile/`
  - השארת TaskRail ו-GetHome ללא `showcase` (fallback ל-frames ריקים)
  - הערה: צילום iPad landscape חסר → משימת המשך נפרדת (סקריפט Playwright ב-1194×834)

- [x] **B3.** הזרמת תוכן ל-`ProjectShowcase` ✅
  - עדכון עמוד הפרויקט להעביר slots מ-`p.showcase`
  - עטיפת `<img>`/`<video>` בתוך `DeviceFrame` עם `object-fit: cover` ו-`object-position: top center`
  - וידאו: muted, loop, autoplay, playsInline + `<source>` WebM ואז MP4 + poster

- [x] **B4.** וידוא Phase B ✅ — 2 iPhones מציגים BarOS, iPad שחור (אין tablet screenshot עדיין), console נקי
  - `/projects/baros` — 3 מסכים אמיתיים, וידאו מתנגן באייפון הוידאו
  - `/projects/taskrail` ו-`/projects/gethome` — frames ריקים (graceful fallback)
  - `preview_screenshot` סופי
  - `preview_console_logs` נקי

---

## קבצים קריטיים

| קובץ | שלב | פעולה |
|---|---|---|
| `public/devices/*.png` + `*.aperture.json` | A1 | חדש |
| `src/components/ui/DeviceFrame.tsx` | A2 | חדש |
| `src/utils/deviceApertures.ts` | A2 | חדש |
| `src/components/sections/ProjectShowcase.tsx` | A3 | חדש |
| `src/pages/ProjectDetail.tsx` | A4 + B3 | עריכה |
| `src/types/project.ts` | B1 | עריכה |
| `src/data/projects.ts` | B2 | עריכה |
| `src/components/ui/DeviceMockup.tsx` | — | לא נגעים — ממשיך לשרת את כרטיסי הגריד |

## מחוץ להיקף

- שירותי mockup בתשלום / ספריות 3D (Three.js נשאר בצד).
- החלפת `DeviceMockup.tsx` בכרטיסי הגריד.
- צילום נכסים חסרים (BarOS iPad landscape, TaskRail, GetHome) — משימת המשך.
