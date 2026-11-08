# J10 Projects

پورتفولیوی انگلیسی ابوالفضل جمشیدی با Next.js App Router و خروجی ایستا. بازسازی چیدمان و رفتارهای اصلی [مرجع Matthieu Givelet](https://matthieugivelet.com/) با اطلاعات و تصاویر موجود صاحب پورتفولیو.

## صفحات

- **صفحهٔ اصلی ← «Selected works»**: نام بزرگ با نمایش متناوب چهار تصویر، معرفی سه‌خطی، **«Approach»** و چهار پروژهٔ منتخبِ دارای تصویر.
- بخش کارها: همهٔ هشت پروژه در دو ستون دسکتاپ و یک ستون موبایل.
- **«Work» ← کارت پروژه**: توضیحات ثابت در سمت چپ و گالری در سمت راست؛ **«Visit website»**، **«Source code»** در صورت وجود، و **«Next project»**.
- **منوی بالا ← «About»**: عکس، معرفی، خدمات و اطلاعات تماس.
- **نسخهٔ موبایل ← «Menu»**: منوی تمام‌صفحه، بسته‌شدن با **«Close»** یا Escape، و محدودشدن حرکت Tab به کنترل‌های منو.

ورود بخش‌ها هنگام اسکرول، چرخش اولیهٔ تصویر میان حروف، تغییر تصویر و حرکت کوتاه لینک‌ها پیاده شده است. کلیک روی تصویر میان حروف نمایش متناوب را متوقف یا فعال می‌کند. تنظیم کاهش حرکت سیستم رعایت می‌شود. محتوای صفحات و لینک‌های پروژه‌ها در HTML اولیه موجود است؛ اطلاعات پروژه‌ها API ندارد.

## اجرا و ساخت

Node.js 22 یا جدیدتر:

```sh
npm ci
npm run dev
```

پیش‌نمایش: [نسخهٔ محلی](http://127.0.0.1:4317)

```sh
npm test
npm run build
```

خروجی مستقل در مسیر زیر تولید می‌شود:

`out/`

صفحهٔ اصلی، کارها، دربارهٔ من و صفحات پروژه‌ها از قبل ساخته می‌شوند. تغییرات این درخواست به‌صورت محلی انجام شده‌اند؛ انتشار روی میزبان عمومی انجام نشده است.

## ویرایش محتوا

- `data/profile.json`: متن معرفی، ایمیل، شبکهٔ اجتماعی، شهر، کشور، واتساپ و سال شروع فعالیت.
- `data/projects.json`: پروژه‌ها، توضیحات، برچسب‌ها، تصاویر و لینک‌ها. فیلد اختیاری `year` سال پروژه را مشخص می‌کند.
- `public/projects/`: تصاویر واقعی موجود پروژه‌ها.
- `app/navigation.js`: حرکت پوشاننده هنگام جابه‌جایی صفحات داخلی، با حفظ رفتار بازکردن لینک در تب جدید و رعایت کاهش حرکت.
- `app/interactions.js`

  منوی موبایل، ورود هنگام اسکرول و تصاویر نام.
- `app/portfolio.js`: اجزای مشترک، کارت‌ها و تماس.
- `app/globals.css`: چیدمان، تایپوگرافی، اندازه‌های موبایل و حرکت‌ها.

محل فعالیت طبق رزومه تهران، ایران است. شمارهٔ واتساپ، سال شروع کلی فعالیت و تاریخ پروژه‌ها هنوز مشخص نشده‌اند.


فونت انگلیسی فعلاً Arial/Helvetica است. فونت مرجع GT Standard است و برای تطابق دقیق تایپوگرافی باید فایل دارای مجوز آن فراهم شود. وزیرمتن محلی برای محتوای احتمالی فارسی نگه داشته شده و مجوزش در `app/fonts/Vazirmatn-LICENSE.txt` است. تصویرهای پروژه، عکس و متن معرفی متعلق به پورتفولیوی فعلی‌اند؛ آیکون ایده به‌صورت SVG بازطراحی شده است.

## آزمون‌ها

`npm test` یکتایی مسیرها، لینک‌ها، وجود تصاویر و ساختار اطلاعات را بررسی می‌کند. آزمون مرورگر در `tests/browser.mjs` برای اجرای مستقل با Playwright و Chrome آماده است:

```sh
node tests/browser.mjs
```

اگر Playwright بیرون پروژه نصب شده، مسیر بسته را در `PLAYWRIGHT_MODULE` بده. متغیرهای `TEST_URL`، `TEST_SCREENSHOTS` و `TEST_BROWSER_CHANNEL` نیز قابل تنظیم‌اند. آزمون مرورگر مسیر پروژه‌ها، منوی موبایل، اندازه‌های مختلف، توقف اسلایدها و کاهش حرکت را پوشش می‌دهد.


## تطبیق جزئیات مرجع — ۲۰۲۶-۱۰-۱۴

فاصله‌های معرفی و پروژه‌های منتخب، فاصلهٔ حروف و اندازهٔ متن‌ها، خط جداکنندهٔ پایین صفحه، تورفتگی متن دوم About، شمارنده‌های منوی موبایل و حرکت ورود تک‌تک حروف اصلاح شدند. جابه‌جایی لینک‌های داخلی با حرکت پوشاننده انجام می‌شود؛ با تنظیم کاهش حرکت سیستم، لینک‌ها مستقیم باز می‌شوند. پروژهٔ بدون تصویر در انتخاب دو پروژهٔ صفحهٔ اصلی وارد نمی‌شود، اما در Work باقی است.

`npm test` و `npm run build` موفق بودند. خروجی ایستا در مرورگر برای پنج مسیر اصلی در عرض‌های ۳۲۰، ۳۹۰، ۷۶۸ و ۱۲۸۰ پیکسل بررسی شد و سرریز افقی مشاهده نشد. منوی موبایل، Escape، رفتن به About، هفت صفحهٔ پروژه و لینک Next project نیز بررسی شدند؛ خطای اجرایی در گزارش مرورگر ثبت نشد. تطبیق اندازه‌ها بر مبنای CSS عمومی مرجع انجام شد؛ اتصال مرورگر به سایت مرجع خطا داشت، بنابراین تطبیق تصویری پیکسل‌به‌پیکسل تأیید نشده است. تفاوت فونت و محدودیت تصاویر که بالاتر ذکر شده همچنان برقرار است.


## Hiring-focused content — 2026-10-20

The portfolio presents the owner as a full-stack developer with a front-end focus, open to both full-stack and front-end roles. The owner confirmed responsibility for all programming on WePackaging and Fash Ba Tashdid. Avani leads the featured projects, followed by WePackaging, Fash Ba Tashdid, ToolBo, and IdiomYar. Selection is explicit in data/profile.json under featuredProjects.

Both primary project pages include a role, technology list, development notes, and a guided link to the live experience. WePackaging’s scroll-physics challenge comes from the owner; implementation details were checked against the local project source. Fash’s notes describe implemented features without inventing a personal challenge or business metrics. Design ownership, project dates, and total years of experience remain unclaimed. Professional roles and their dates are now sourced from the owner’s résumé (see below).

Optional project fields: summary, role, technologies, caseStudy (title, intro, sections, explore), and gallery (src, alt, width, height, caption). Home and project pages provide direct email contact. Gallery images are distinct assets, not repeated crops of the cover. WePackaging now has two real screenshots. All seven live project URLs returned HTTP 200 on 2026-10-20; this is a point-in-time check.

The existing Sites identity is retained. Its access was owner-only at the start of this update; deployment does not automatically make it public. A public audience is a separate setting required before sharing with employers.


## Résumé content — 2026-11-02

The owner supplied Abolfazl_Jamshidi_Frontend_CV.pdf as a content source. The portfolio now includes Tehran, Iran; availability for full-time on-site or remote roles; LinkedIn; experience at Avan Tech and Worldbuilderzzz (both 2025–present); and grouped technical skills. Experience and skills are maintained in data/profile.json and rendered on About. Framer Motion is retained from the existing, source-checked project content.

Project descriptions now specify Worldbuilderzzz’s co-founder/technical-lead role, the desktop-style Mehdi Arman portfolio, and IdiomYar’s audio, bilingual text, AI-generated practice stories, flashcards, and saved idioms. IdiomYar also has a feature-focused development note. No business metrics, project dates, or total experience figures were inferred. The original résumé and phone number are not published.
