# Remo Students Relief Foundation — Website

Official website for **Remo Students Relief Foundation (Remo-SRF)**, a non-profit organisation supporting indigent students in Remo, Ogun State, Nigeria.

> Scholarship & Empowerment for Remo Youths

## Pages

| Page | Description |
| --- | --- |
| `index.html` | Home — hero, impact stats, programmes, Mobile Digital Class feature, impact and giving CTAs |
| `about.html` | Vision, mission, brief history, founding members and values |
| `programs.html` | All eight programmes with category filters |
| `impact.html` | Impact areas, SDG alignment, photo gallery and accountability commitments |
| `get-involved.html` | Donation, sponsorship, CSR partnership, volunteer form and FAQs |
| `apply.html` | Student support application form |
| `contact.html` | Contact details, message form and office map |

## Stack

- Semantic HTML5
- Tailwind CSS (Play CDN)
- Vanilla JavaScript
- Google Fonts: Fraunces (display) and Plus Jakarta Sans (body)

No build step is required. Open `index.html` directly, or serve the folder with XAMPP/Apache.

## Design system

- **Deep Green** `#0A4D2E`
- **Gold Yellow** `#C69A2C` / `#D4A017`
- **White** `#FFFFFF`
- Warm cream backgrounds, serif display headings and gold accents

The shared Tailwind theme lives in `assets/js/tailwind-config.js`; custom animation and component styles live in `assets/css/styles.css`.

## Interactions

`assets/js/main.js` handles:

- Sticky navigation, scroll progress and mobile menu
- Scroll-reveal animations and counters
- Programme filtering
- FAQ accordion
- Donation / pledge modal
- Gallery lightbox
- Form validation and success states
- Newsletter subscription feedback

All motion respects `prefers-reduced-motion`.

## Forms

The application, contact and volunteer forms validate on the client and then show a success state. The donation modal records a pledge intention and asks the Foundation to follow up with payment details. No payment processor or server-side handler is connected yet.

To make submissions live, connect the forms to a backend, Formspree/FormSubmit, or a CRM endpoint. Replace the success handling in `assets/js/main.js` (look for `form[data-form]` and `data-donate-form`).

## Contact

**Head office:** 24 Abiodun Ogunyanwo Street, Makun, Sagamu, Ogun State, Nigeria.

**Email:** support@remostudentsrelief.org

## Image assets

Photographs and the official logo are in `assets/`. `assets/renamr.py` is the naming utility used to prepare the original image files.
