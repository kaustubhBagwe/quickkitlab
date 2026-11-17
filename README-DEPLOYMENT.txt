QUICKKITLAB — STATIC WEBSITE STARTER
===================================

WHAT'S INCLUDED
- index.html homepage with a single hamburger menu
- 15 individual tool pages
- Contact and report forms
- About and privacy pages
- Shared assets/style.css and assets/app.js
- sitemap.xml and robots.txt

IMPORTANT BEFORE PUBLISHING
1. Brand availability: QuickKitLab is a provisional project name, not a legal/trademark/domain clearance. Search results did not show a direct exact match for "QuickKitLab", but this is not a guarantee of availability. Check GitHub, domain registrars, social handles and trademark databases yourself.
2. Replace YOUR-DOMAIN.example in canonical URLs, sitemap.xml and robots.txt with your real HTTPS domain.
3. Replace REPLACE-WITH-YOUR-EMAIL@example.com in assets/app.js with an email address you control.
4. Rebuild sitemap.xml if you add, remove or rename pages.
5. Deploy the folder to a static host such as GitHub Pages, Cloudflare Pages or Netlify. Do not open pages using file:// for final testing; use a local static server or deployed HTTPS site.
6. Test every tool on current desktop and mobile browsers before launch.

TOOL IMPLEMENTATION NOTES
- QR generator, PDF renderer, PDF-lib and HEIC conversion load libraries from public CDNs; an internet connection is needed for those library downloads.
- Image compression outputs JPEG; transparency is flattened.
- Image cropper currently performs a centered square crop, not a drag-selection crop.
- Image resizer uses exact dimensions; if "keep aspect ratio" is checked and one dimension is blank, the other is calculated.
- PDF to JPG downloads each page as a separate JPG. Large PDFs may use substantial memory.
- PDF merge, split and rotate use pdf-lib in the browser.
- Contact/report forms use mailto and do not submit to a database or email API.
- No analytics, ads or tracking scripts are included.

SEO NOTES
- Each tool page has a unique title, meta description, canonical placeholder, Open Graph tags, descriptive copy and WebApplication structured data.
- This does not guarantee indexing or rankings. Add genuinely useful examples, original instructions, accessible labels, internal links and test performance.
- Do not publish fabricated search-volume figures as facts. The keyword volumes discussed in planning are third-party estimates and need independent validation.
