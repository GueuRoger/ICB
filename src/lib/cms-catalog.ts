import { translate } from "../i18n/messages.ts";

export type ContentEntry = {
  page: string;
  section: string;
  content_key: string;
  en: string;
  fr?: string;
  same?: boolean;
};

function e(
  page: string,
  section: string,
  content_key: string,
  en: string,
  extra?: { fr?: string; same?: boolean },
): ContentEntry {
  return { page, section, content_key, en, ...extra };
}

const same = { same: true } as const;

const globalFluencySolution =
  "The solution to our problems lay not in books or trainings but in our own minds. You are abrilliant person in your field already more difficult than English, why would English be difficult for you, to the point of even blocking your progress?";

const worldStageProgram =
  "World Stage is a private, 12-month communication mentorship for senior leaders who operate in complex, high-stakes environments. It helps you communicate with greater clarity, influence and composure — so you can lead more effectively and contribute to a more stable, cooperative world.";

export const contentCatalog: ContentEntry[] = [
  e("shared", "brand", "brand_first", "Roger", same),
  e("shared", "brand", "brand_last", "Gueu", same),
  e("shared", "brand", "logo", "/images/navbar-t.svg", same),
  e("shared", "language", "language_current", "English", { fr: "Français" }),
  e("shared", "language", "language_aria", "Language: English"),
  e("shared", "language", "language_option_en", "English", same),
  e("shared", "language", "language_option_fr", "Français", same),
  e("shared", "language", "language_menu_label", "Language", { fr: "Langue" }),
  e("shared", "nav", "nav_label", "Primary", { fr: "Principale" }),
  e("shared", "nav", "nav_about", "About"),
  e("shared", "nav", "nav_products", "Our products"),
  e("shared", "nav", "nav_news", "News"),
  e("shared", "nav", "nav_login", "Login"),
  e("shared", "nav", "nav_account", "Account", { fr: "Compte" }),
  e("shared", "nav", "nav_account_menu_label", "Account menu", { fr: "Menu du compte" }),
  e("shared", "nav", "nav_logout", "Logout", { fr: "Se déconnecter" }),
  e("shared", "nav", "nav_cart", "Cart"),
  e("shared", "nav", "nav_my_course", "My Course", { fr: "Mon cours" }),
  e("shared", "form", "show_password", "Show password", { fr: "Afficher le mot de passe" }),
  e("shared", "form", "hide_password", "Hide password", { fr: "Masquer le mot de passe" }),
  e("my-course", "meta", "title", "My Course", { fr: "Mon cours" }),
  e(
    "my-course",
    "meta",
    "document_description",
    "Open the course videos for your enrolled programs.",
    { fr: "Accédez aux vidéos des programmes auxquels vous êtes inscrit." },
  ),
  e("my-course", "body", "heading", "My Course", { fr: "Mon cours" }),
  e("my-course", "body", "loading", "Checking your enrollments…", {
    fr: "Vérification de vos inscriptions…",
  }),
  e(
    "my-course",
    "body",
    "empty",
    "You do not have an active course enrollment yet. Purchase a program to get access.",
    {
      fr: "Vous n'avez pas encore d'inscription active. Achetez un programme pour y accéder.",
    },
  ),
  e(
    "my-course",
    "body",
    "choice_prompt",
    "Choose which course you want to open.",
    { fr: "Choisissez le cours que vous souhaitez ouvrir." },
  ),
  e("my-course", "body", "choice_global_fluency", "Global Fluency", same),
  e("my-course", "body", "choice_world_stage", "World Stage", same),
  e("shared", "footer", "footer_shop", "Shop"),
  e("shared", "footer", "footer_book", "Book Roger"),
  e("shared", "footer", "footer_speaking", "Speaking engagement"),
  e("shared", "footer", "footer_consulting", "Private consulting"),
  e("shared", "footer", "footer_media", "Media appearances"),
  e("shared", "footer", "footer_corporate", "Corporate services"),
  e("shared", "footer", "footer_speaking_message", "Hello, I am interested in Speaking engagement. I would like to discuss the details.", { fr: "Bonjour, je suis intéressé par « Conférence ». J'aimerais discuter des détails." }),
  e("shared", "footer", "footer_consulting_message", "Hello, I am interested in Private consulting. I would like to discuss the details.", { fr: "Bonjour, je suis intéressé par « Conseil privé ». J'aimerais discuter des détails." }),
  e("shared", "footer", "footer_media_message", "Hello, I am interested in Media appearances. I would like to discuss the details.", { fr: "Bonjour, je suis intéressé par « Médias ». J'aimerais discuter des détails." }),
  e("shared", "footer", "footer_corporate_message", "Hello, I am interested in Corporate services. I would like to discuss the details.", { fr: "Bonjour, je suis intéressé par « Services aux entreprises ». J'aimerais discuter des détails." }),
  e("shared", "footer", "footer_contact", "Contact us"),
  e("shared", "footer", "footer_phone", "+225 0705298727", same),
  e("shared", "footer", "footer_email", "gueuroger1111@gmail.com", same),
  e("shared", "money", "currency_symbol", "$", same),
  e("shared", "money", "currency_symbol_us", "US$", same),
  e("shared", "footer", "footer_instagram", "Instagram"),
  e("shared", "footer", "footer_linkedin", "LinkedIn"),
  e("shared", "footer", "footer_facebook", "Facebook"),
  e("shared", "footer", "footer_instagram_url", "https://www.instagram.com/roger_c_gueu/", same),
  e("shared", "footer", "footer_linkedin_url", "https://www.linkedin.com/in/roger-gueu/", same),
  e("shared", "footer", "footer_facebook_url", "https://www.facebook.com/gueuhidekiyukawa", same),
  e("shared", "nav", "breadcrumb_home", "Home"),
  e("shared", "nav", "breadcrumb_courses", "courses"),
  e("shared", "nav", "return_home", "Return to homepage"),

  e("home", "meta", "document_title", "Roger Gueu", same),
  e("home", "meta", "document_description", "Roger Gueu — Engineer, Inventor, Entrepreneur, and International Speaker."),
  e("home", "hero", "first_name", "Roger", same),
  e("home", "hero", "last_name", "Gueu", same),
  e("home", "hero", "shop_button", "Shop our products"),
  e("home", "hero", "trusted_by", "TESTED & TRUSTED BY PROFESSIONALS FROM"),
  e("home", "hero", "image_alt", "Roger Gueu standing in an office"),
  e("home", "hero", "hero_image", "/images/hero.png", same),
  e("home", "hero", "role_engineer", "Engineer"),
  e("home", "hero", "role_inventor", "Inventor"),
  e("home", "hero", "role_entrepreneur", "Entrepreneur"),
  e("home", "hero", "role_speaker", "International Speaker"),
  e("home", "partners", "partner_1_src", "/images/bnp-paribas.svg", same),
  e("home", "partners", "partner_1_alt", "BNP Paribas", same),
  e("home", "partners", "partner_2_src", "/images/vivo-energy.svg", same),
  e("home", "partners", "partner_2_alt", "Vivo Energy", same),
  e("home", "partners", "partner_3_src", "/images/attijariwafa.svg", same),
  e("home", "partners", "partner_3_alt", "Attijariwafa bank", same),
  e("home", "partners", "partner_4_src", "/images/coat-of-arms.svg", same),
  e("home", "partners", "partner_4_alt", "Coat of arms of Ivory Coast"),
  e("home", "partners", "partner_5_src", "/images/united-nations.svg", same),
  e("home", "partners", "partner_5_alt", "United Nations"),

  e("about", "meta", "title", "About"),
  e("about", "meta", "document_description", "Roger Gueu — international speaker, engineer, and inventor."),
  e("about", "speaker", "speaker_heading", "International Speaker"),
  e("about", "speaker", "speaker_line_1", "In this short video, Roger explains the mission behind world stage, who it is for,"),
  // Empty companions: DB may store the full bio in line_1 only; do not fall back to short stubs.
  e("about", "speaker", "speaker_line_2", "", same),
  e(
    "about",
    "speaker",
    "speaker_image",
    "https://apfvyuwziegbxyyyuory.supabase.co/storage/v1/object/public/about/speaker.png",
    same,
  ),
  e("about", "speaker", "speaker_image_alt", "Roger Gueu in a navy suit and red tie"),
  e("about", "engineer", "engineer_heading", "Engineer"),
  e("about", "engineer", "engineer_line_1", "In this short video, Roger explains the mission behind world stage, who it is for,"),
  e("about", "engineer", "engineer_line_2", "", same),
  e(
    "about",
    "engineer",
    "engineer_image",
    "https://apfvyuwziegbxyyyuory.supabase.co/storage/v1/object/public/about/engineer.png",
    same,
  ),
  e("about", "engineer", "engineer_image_alt", "Roger Gueu standing with his arms crossed"),
  e("about", "inventor", "inventor_heading", "Inventor"),
  e("about", "inventor", "inventor_line_1", "Right now this guy is an inventor, next he\u2019s oing to release greatr products that"),
  e("about", "inventor", "inventor_line_2", "", same),
  e("about", "inventor", "inventor_line_3", "", same),
  e("about", "inventor", "inventor_line_4", "", same),
  e(
    "about",
    "inventor",
    "inventor_image",
    "https://apfvyuwziegbxyyyuory.supabase.co/storage/v1/object/public/about/inventor.png",
    same,
  ),
  e("about", "inventor", "inventor_image_alt", "Roger Gueu adjusting his jacket cuff"),

  e("news", "meta", "title", "News"),
  e("news", "meta", "document_description", "ICB updates, new courses, promotions, and announcements."),
  e("news", "article", "image_alt", "Roger Gueu in a navy suit with his arms crossed"),

  e("courses", "meta", "title", "Courses"),
  e("courses", "meta", "document_description", "Courses by Roger Gueu — World Stage and Global Fluency."),
  e("courses", "catalog", "languages", "Languages supported: English, French"),
  e("courses", "catalog", "learn_more", "Learn more"),
  e("courses", "catalog", "portrait", "/images/courses-portrait.png", same),
  e("courses", "catalog", "portrait_alt", "Roger Gueu", same),

  e("global-fluency", "meta", "document_description", "Global Fluency course details by Roger Gueu."),
  // Cleared: obsolete "Your ultimate program to " (was catalog fallback for empty EN).
  e("global-fluency", "hero", "headline_lead", "", same),
  // CMS-owned: site_content.headline_emphasis (no catalog fallback text).
  e("global-fluency", "hero", "headline_emphasis", "", same),
  e("global-fluency", "hero", "solution", globalFluencySolution),
  // CMS-owned: site_content.hero_body (no catalog fallback text).
  e("global-fluency", "hero", "hero_body", "", same),
  e("global-fluency", "hero", "different_heading", "What makes Global Fluency different"),
  e(
    "global-fluency",
    "hero",
    "intro_image",
    "https://apfvyuwziegbxyyyuory.supabase.co/storage/v1/object/public/global-fluency/intro-thumbnail.png",
    same,
  ),
  e(
    "global-fluency",
    "hero",
    "intro_video",
    "https://apfvyuwziegbxyyyuory.supabase.co/storage/v1/object/public/global-fluency/intro-video.mp4",
    same,
  ),
  e("global-fluency", "hero", "intro_play", "Play program introduction"),
  e("global-fluency", "hero", "intro_alt", "Roger Gueu introducing the program"),
  e("global-fluency", "hero", "discover", "Discover Global Fluency"),
  e("global-fluency", "hero", "intro_heading", "Personal introduction to the program"),
  e("global-fluency", "hero", "intro_body", "Roger explains how World Stage prepares leaders to communicate with clarity, authority, and confidence in consequential international moments"),
  e("global-fluency", "hero", "pdf_preview", "PDF PREVIEW"),
  e("global-fluency", "offerings", "offerings", "Offerings"),
  e("global-fluency", "offerings", "offer_1_title_1", "12-month private"),
  // Empty: DB may store the full title in offer_1_title_1 only (e.g. "90-Day Transformation").
  e("global-fluency", "offerings", "offer_1_title_2", "", same),
  e("global-fluency", "offerings", "offer_1_body_1", "You're supported"),
  // Empty companions: full line may live in offer_1_body_1 only (DB EN).
  e("global-fluency", "offerings", "offer_1_body_2", "", same),
  e("global-fluency", "offerings", "offer_1_body_3", "", same),
  e("global-fluency", "offerings", "offer_2_title_1", "Access to life changing"),
  // Empty: full EN title may live in offer_2_title_1 only.
  e("global-fluency", "offerings", "offer_2_title_2", "", same),
  e("global-fluency", "offerings", "offer_2_body_1", "You access wha is"),
  // Empty: full EN body may live in offer_2_body_1 only.
  e("global-fluency", "offerings", "offer_2_body_2", "", same),
  e("global-fluency", "offerings", "offer_3_title_1", "Access to an international environment"),
  // Empty: full EN title lives in offer_3_title_1 only.
  e("global-fluency", "offerings", "offer_3_title_2", "", same),
  e("global-fluency", "offerings", "offer_3_body_1", "You access a community of other speakers."),
  // Empty companions: full EN body lives in offer_3_body_1 only (DB EN).
  e("global-fluency", "offerings", "offer_3_body_2", "", same),
  e("global-fluency", "offerings", "offer_3_body_3", "", same),
  // Unused on page (headings use description_word / breakdown_word).
  e("global-fluency", "description", "course_word", "", same),
  // CMS-owned: site_content.description_word (full two-tone heading).
  e("global-fluency", "description", "description_word", "", same),
  e("global-fluency", "description", "why_heading", "Why World Stage"),
  e("global-fluency", "description", "why_body", globalFluencySolution),
  // CMS-owned: site_content.different_body (no catalog fallback text).
  e("global-fluency", "description", "different_body", "", same),
  e("global-fluency", "description", "technology_body", globalFluencySolution),
  e("global-fluency", "description", "resources_body", globalFluencySolution),
  // CMS-owned: site_content.breakdown_word (full two-tone heading).
  e("global-fluency", "description", "breakdown_word", "", same),
  e("global-fluency", "description", "module_word", "Module"),
  // Unused: full heading lives in site_content.technology.
  e("global-fluency", "description", "innovative", "", same),
  // CMS-owned: site_content.technology (full two-tone heading).
  e("global-fluency", "description", "technology", "", same),
  // Unused: full heading lives in site_content.resources.
  e("global-fluency", "description", "proven", "", same),
  // CMS-owned: site_content.resources (full two-tone heading; last word blue).
  e("global-fluency", "description", "resources", "", same),
  e("global-fluency", "faq", "faqs", "FAQs"),
  e("global-fluency", "faq", "faq_question", "Q: Where do I access my digital courses?"),
  e("global-fluency", "faq", "faq_answer_label", "A:"),
  e("global-fluency", "faq", "faq_answer", globalFluencySolution),
  // Legacy sidebar keys — product cover now comes from courses.thumbnail_url.
  e("global-fluency", "sidebar", "cover_image", "/images/global-fluency-book.png", same),
  e("global-fluency", "sidebar", "cover_alt", "Global Fluency book"),
  e("global-fluency", "sidebar", "buy_now", "Buy now"),
  e("global-fluency", "sidebar", "course_language", "English"),
  e("global-fluency", "sidebar", "sidebar_label", "Global Fluency purchase"),
  // Unused: sidebar reads description_word.
  e("global-fluency", "sidebar", "link_description", "", same),
  // Unused: sidebar reads breakdown_word.
  e("global-fluency", "sidebar", "link_breakdown", "", same),
  // Unused: sidebar reads technology.
  e("global-fluency", "sidebar", "link_technology", "", same),
  // Sidebar-only short label (section heading uses resources).
  e("global-fluency", "sidebar", "link_resources", "Content & Resources"),
  // Unused: sidebar reads faqs.
  e("global-fluency", "sidebar", "link_faqs", "", same),
  e("global-fluency", "sidebar", "flag_image", "/images/flag.png", same),

  e("world-stage", "meta", "document_description", "World Stage course details by Roger Gueu."),
  e("world-stage", "hero", "hero_image", "/images/world-stage-hero-bg.png", same),
  e("world-stage", "hero", "hero_alt", "Roger Gueu in front of international flags"),
  e("world-stage", "hero", "hero_tagline", "A stronger voice for a more stable world", {
    fr: "Une voix plus forte pour un monde plus stable",
  }),
  // Unused: full headline lives in site_content.sr_heading (frontend splits white/blue).
  e("world-stage", "hero", "headline_lead", "", same),
  e("world-stage", "hero", "headline_emphasis", "", same),
  e(
    "world-stage",
    "hero",
    "sr_heading",
    "Give your career the global opportunities it deserves",
    { fr: "Donnez à votre carrière les opportunités internationales qu'elle mérite" },
  ),
  e(
    "world-stage",
    "hero",
    "hero_body",
    "A private 12-month mentorship for leaders who must communicate with clarity and credibility on the world stage",
    {
      fr: "Un mentorat privé de 12 mois pour les dirigeants qui doivent communiquer avec clarté et crédibilité sur la scène mondiale",
    },
  ),
  e("world-stage", "hero", "apply", "Apply to World Stage"),
  e("world-stage", "hero", "hero_footer_1", "BETTER EXPRESSION", { fr: "MEILLEURE EXPRESSION" }),
  e("world-stage", "hero", "hero_footer_2", "BRIGHTER FUTURE", { fr: "AVENIR PLUS RADIEUX" }),
  e("world-stage", "hero", "hero_footer_3", "MORE FULFILLMENT", { fr: "PLUS D'ÉPANOUISSEMENT" }),
  e(
    "world-stage",
    "hero",
    "hero_callout",
    "NOW IS THE TIME TO TAKE YOUR SEAT ON THE WORLD TABLE",
    { fr: "IL EST TEMPS DE PRENDRE VOTRE PLACE À LA TABLE MONDIALE" },
  ),
  e(
    "world-stage",
    "hero",
    "intro_image",
    "https://apfvyuwziegbxyyyuory.supabase.co/storage/v1/object/public/world-stage/intro-thumbnail.png",
    same,
  ),
  e(
    "world-stage",
    "hero",
    "intro_video",
    "https://apfvyuwziegbxyyyuory.supabase.co/storage/v1/object/public/world-stage/intro-video.mp4",
    same,
  ),
  e("world-stage", "hero", "intro_play", "Play program introduction", {
    fr: "Lire la présentation du programme",
  }),
  e("world-stage", "hero", "intro_alt", "Roger Gueu introducing World Stage"),
  e("world-stage", "hero", "program_video", "Program video"),
  e("world-stage", "hero", "intro_heading", "A personal introduction to world stage"),
  e("world-stage", "hero", "intro_body", "In this short video, Roger explains the mission behind world stage, who it is for, and what you can expect from it"),
  e("world-stage", "hero", "signature", "Roger Gueu", same),
  e("world-stage", "hero", "founder", "Founder, World Stage"),
  e("world-stage", "offerings", "offerings", "Offerings"),
  e("world-stage", "offerings", "offerings_kicker_1", "More than coaching, a higher"),
  e("world-stage", "offerings", "offerings_kicker_2", "program of self-fulfillment"),
  e("world-stage", "offerings", "offer_1_title", "12-month private mentorship program"),
  e("world-stage", "offerings", "offer_1_body", "A structured journey built around your goals"),
  e("world-stage", "offerings", "offer_2_title", "On-demand direct access"),
  e("world-stage", "offerings", "offer_2_body", "Real support when it matters most"),
  e("world-stage", "offerings", "offer_3_title", "High-stakes preparation"),
  e("world-stage", "offerings", "offer_3_body", "For speeches, meetings and critical moments"),
  e("world-stage", "offerings", "offer_4_title", "International proof"),
  e("world-stage", "offerings", "offer_4_body", "Visible progress on the world stage"),
  e("world-stage", "offerings", "offer_5_title", "Confidential by default"),
  e("world-stage", "offerings", "offer_5_body", "Your privacy is non-negotiable"),
  e("world-stage", "offerings", "offer_6_title", "Continuity plan"),
  e("world-stage", "offerings", "offer_6_body", "Lasting capabilities beyond the program"),
  e("world-stage", "program", "program_description_label", "Program description"),
  e("world-stage", "program", "description_1", worldStageProgram),
  e("world-stage", "program", "description_2", "This is not a generic training program. It is a highly personalized mentorship, designed around your role, your context and your ambitions."),
  e("world-stage", "program", "why_heading", "Why World Stage ?"),
  e("world-stage", "program", "why_body", "In today's world, technical expertise is not enough. Leaders are expected to inspire trust, navigate scrutiny and unite diverse stakeholders. World Stage gives you the mindset, tools and practice to do exactly that — with authenticity and authority."),
  e("world-stage", "journey", "journey", "The World Stage journey"),
  e("world-stage", "journey", "journey_intro", "A structured, 6-phase journey from clarity to global impact."),
  e("world-stage", "overview", "overview_label", "Selected overview"),
  e("world-stage", "overview", "overview_subtitle", "Private global communication mentorship"),
  e("world-stage", "overview", "overview_audience", "Senior leaders who want to communicate more effectively, inspire greater trust and make bigger impact on the world stage"),
  e("world-stage", "overview", "overview_1_title", "12 months"),
  e("world-stage", "overview", "overview_1_body", "Entirely individual"),
  e("world-stage", "overview", "overview_2_title", "Private access"),
  e("world-stage", "overview", "overview_2_body", "Direct support"),
  e("world-stage", "overview", "overview_3_title", "International proof"),
  e("world-stage", "overview", "overview_3_body", "Within 2\u20133 months"),
  e("world-stage", "overview", "overview_4_title", "Confidential"),
  e("world-stage", "overview", "overview_4_body", "By default"),
  e("world-stage", "overview", "investment", "Investment"),

  e("cart", "meta", "title", "Your cart"),
  e("cart", "meta", "document_description", "Your cart for Global Fluency."),
  e("cart", "cart", "shop_more", "Shop for more"),
  e("cart", "cart", "column_products", "PRODUCTS"),
  e("cart", "cart", "column_price", "PRICE"),
  e("cart", "cart", "column_quantity", "QUANTITY"),
  e("cart", "cart", "column_total", "TOTAL"),
  e("cart", "cart", "delete", "Delete"),
  e("cart", "cart", "pay_wave", "Pay with Wave"),
  e("cart", "cart", "pay_card", "Pay with credit card"),
  e("cart", "cart", "product_image", "/images/payment-book.png", same),
  e("cart", "cart", "line_quantity", "1", same),

  e("checkout", "meta", "title", "Checkout"),
  e("checkout", "meta", "document_description", "Checkout for Global Fluency."),
  e("checkout", "contact", "contact_payment", "Contact and payment"),
  e("checkout", "contact", "contact", "Contact"),
  e("checkout", "contact", "email", "Email"),
  e("checkout", "legal", "terms_intro", "By checking this box and clicking the \"Agree and Submit\" button below, I represent that I: 1) am 18+ years of age; 2) have read and agree to the International Career Bridge. [or rogergueu.com if it is a registered D/B/A]"),
  e("checkout", "legal", "terms", "Terms of Service"),
  e("checkout", "legal", "terms_and", "(including mandatory arbitration) and"),
  e("checkout", "legal", "privacy", "Privacy Policy"),
  e("checkout", "legal", "terms_end", "; and 3) agree to receive email marketing from International Career Bridge. and its marketing partners."),
  e("checkout", "payment", "payment", "Payment"),
  e("checkout", "payment", "secure", "All payment are secure and encrypted"),
  e("checkout", "payment", "credit_card", "credit card"),
  e("checkout", "payment", "card_mastercard_alt", "Mastercard", same),
  e("checkout", "payment", "card_mastercard_image", "/images/mastercard.png", same),
  e("checkout", "payment", "card_visa_alt", "Visa", same),
  e("checkout", "payment", "card_visa_image", "/images/visa.png", same),
  e("checkout", "payment", "card_number", "Card number"),
  e("checkout", "payment", "expiration", "Expiration date(MM/YY)"),
  e("checkout", "payment", "security", "Security code"),
  e("checkout", "payment", "name_on_card", "Name on card"),
  e("checkout", "billing", "billing", "Billing address"),
  e("checkout", "billing", "region", "Region/Country"),
  e("checkout", "billing", "country", "C\u00f4te d'Ivoire", same),
  e("checkout", "billing", "first_name", "First name"),
  e("checkout", "billing", "last_name", "Last name"),
  e("checkout", "billing", "address", "Address"),
  e("checkout", "billing", "apartment", "Apartment(Optional)"),
  e("checkout", "billing", "city", "City"),
  e("checkout", "billing", "phone", "Phone"),
  e("checkout", "legal", "phone_consent", "By checking this box and clicking the \"Agree and Submit\" button below, I give my express consent authorizing International Career Bridge, Inc. [or rogergueu.com if it is a registered D/B/A] to contact me by telephone. I understand that my consent is not required as a condition of service"),
  e("checkout", "payment", "pay_now", "Pay now"),
  e("checkout", "summary", "summary", "Order summary"),
  e("checkout", "summary", "total", "Total"),

  e("order-confirmation", "meta", "title", "Thank you"),
  e("order-confirmation", "meta", "document_description", "Your Global Fluency order has been received."),
  e("order-confirmation", "confirmation", "heading", "Thank you!"),
  e("order-confirmation", "confirmation", "received", "Your order has been received."),
  e("order-confirmation", "confirmation", "details", "Check out your email to see the necessary details to access your course. This may take a few minutes depending on your location. If you don't receive any email within one hour please email us at:"),
  e("order-confirmation", "confirmation", "email", "rogergueu1111@gmail.com", same),

  e("world-stage-apply", "meta", "title", "World Stage Application"),
  e("world-stage-apply", "meta", "document_description", "Apply to the World Stage program."),
  e("world-stage-apply", "form", "first_name", "First Name"),
  e("world-stage-apply", "form", "last_name", "Last Name"),
  e("world-stage-apply", "form", "email", "Email"),
  e("world-stage-apply", "form", "phone", "Mobile Phone"),
  e("world-stage-apply", "form", "company", "Company Name"),
  e("world-stage-apply", "form", "job", "Job Title"),
  e("world-stage-apply", "form", "industry", "Industry"),
  e("world-stage-apply", "form", "assignments", "Your Previous Assignments in English"),
  e("world-stage-apply", "form", "submit", "Agree and Submit"),
  e("world-stage-apply", "legal", "terms_intro", "By checking this box and clicking the \"Agree and Submit\" button below, I represent that I: 1) am 18+ years of age; 2) have read and agree to the International Career Bridge. [or rogergueu.com if it is a registered D/B/A]", { fr: "En cochant cette case et en cliquant sur le bouton « Accepter et envoyer » ci-dessous, je déclare que : 1) j'ai 18 ans ou plus ; 2) j'ai lu et j'accepte les documents d'International Career Bridge [ou rogergueu.com s'il s'agit d'un nom commercial enregistré]" }),
  e("world-stage-apply", "legal", "terms", "Terms of Service", { fr: "Conditions d'utilisation" }),
  e("world-stage-apply", "legal", "terms_and", "(including mandatory arbitration) and", { fr: "(y compris l'arbitrage obligatoire) et" }),
  e("world-stage-apply", "legal", "privacy", "Privacy Policy", { fr: "Politique de confidentialité" }),
  e("world-stage-apply", "legal", "terms_end", "; and 3) agree to receive email marketing from International Career Bridge. and its marketing partners.", { fr: "; et 3) j'accepte de recevoir des e-mails commerciaux d'International Career Bridge et de ses partenaires." }),
  e("world-stage-apply", "legal", "phone_consent", "By checking this box and clicking the \"Agree and Submit\" button below, I give my express consent authorizing International Career Bridge, Inc. [or rogergueu.com if it is a registered D/B/A] to contact me by telephone. I understand that my consent is not required as a condition of service", { fr: "En cochant cette case et en cliquant sur le bouton « Accepter et envoyer » ci-dessous, j'autorise expressément International Career Bridge, Inc. [ou rogergueu.com s'il s'agit d'un nom commercial enregistré] à me contacter par téléphone. Je comprends que mon consentement n'est pas une condition du service." }),

  e("world-stage-confirmation", "meta", "title", "Thank you"),
  e("world-stage-confirmation", "meta", "document_description", "Your World Stage application has been received."),
  e("world-stage-confirmation", "confirmation", "heading", "Thank you!"),
  e("world-stage-confirmation", "confirmation", "received", "Your submission has been received."),
  e("world-stage-confirmation", "confirmation", "followup", "Our team will be reaching out to you shortly."),

  e("login", "meta", "title", "Login"),
  e("login", "meta", "document_description", "Student login for Roger Gueu."),
  e("login", "form", "email", "Email"),
  e("login", "form", "password", "Password"),
  e("login", "form", "password_hint", "Password should be at least 6 characters."),
  e("login", "form", "forgot", "Forgot your password ?"),
  e("login", "form", "sign_in", "Sign in"),
  e("login", "form", "create", "Create an account"),
  e("login", "form", "error_required", "Enter your email and password."),
  e("login", "form", "error_invalid", "The email or password is not correct.", { fr: "L'e-mail ou le mot de passe est incorrect." }),
  e("login", "form", "error_confirm", "Confirm your email before signing in.", { fr: "Confirmez votre e-mail avant de vous connecter." }),

  e("signup", "meta", "title", "Create an account"),
  e("signup", "meta", "document_description", "Create a student account for Roger Gueu."),
  e("signup", "form", "name", "Your name"),
  e("signup", "form", "first_name", "First Name", { fr: "Prénom" }),
  e("signup", "form", "last_name", "Last Name", { fr: "Nom" }),
  e("signup", "form", "email", "Email address"),
  e("signup", "form", "whatsapp", "Your whatsApp number"),
  e("signup", "form", "password", "Enter a password (your password must contain at least 6 characters)"),
  e("signup", "form", "confirm", "Re-enter the password"),
  e("signup", "form", "continue", "Continue"),
  e("signup", "form", "already", "Already client?"),
  e("signup", "form", "sign_in_instead", "Sign in instead"),
  e("signup", "form", "error_fields", "Fill in every field."),
  e("signup", "form", "error_email", "Enter a valid email address."),
  e("signup", "form", "error_whatsapp", "Enter a valid WhatsApp number."),
  e("signup", "form", "error_password", "Password should be at least 6 characters."),
  e("signup", "form", "error_match", "Passwords do not match."),
  e("signup", "form", "error_exists", "An account with this email already exists."),
  e("signup", "form", "error_create", "The account could not be created. Try again."),

  e("forgot-password", "meta", "title", "Password Reset"),
  e("forgot-password", "meta", "document_description", "Request a link to create a new student password."),
  e("forgot-password", "form", "email_label", "Enter your Email address"),
  e("forgot-password", "form", "send", "Send"),
  e("forgot-password", "form", "sending", "Sending..."),
  e("forgot-password", "form", "error_required", "Enter your email address."),
  e("forgot-password", "form", "error_email", "Enter a valid email address."),
  e("forgot-password", "form", "error_send", "The reset email could not be sent. Try again."),

  e("forgot-password-confirmation", "meta", "title", "Password reset sent"),
  e("forgot-password-confirmation", "meta", "document_description", "Password-reset instructions have been sent to your email."),
  e("forgot-password-confirmation", "confirmation", "received", "Your request has been received."),
  e("forgot-password-confirmation", "confirmation", "sent", "Password-reset instructions have been sent to your email."),

  e("global-fluency-videos", "meta", "title", "Global Fluency Videos", {
    fr: "Vidéos Global Fluency",
  }),
  e(
    "global-fluency-videos",
    "meta",
    "document_description",
    "Course videos for Global Fluency students.",
    { fr: "Vidéos de cours pour les étudiants Global Fluency." },
  ),
  e("global-fluency-videos", "player", "play", "Play", { fr: "Lire" }),
  e("global-fluency-videos", "access", "loading", "Loading your course videos…", {
    fr: "Chargement de vos vidéos de cours…",
  }),
  e(
    "global-fluency-videos",
    "access",
    "denied",
    "You need an active enrollment to watch these course videos.",
    {
      fr: "Vous devez avoir une inscription active pour regarder ces vidéos de cours.",
    },
  ),
  e("world-stage-videos", "meta", "title", "World Stage Videos", {
    fr: "Vidéos World Stage",
  }),
  e(
    "world-stage-videos",
    "meta",
    "document_description",
    "Course videos for World Stage students.",
    { fr: "Vidéos de cours pour les étudiants World Stage." },
  ),
  e("world-stage-videos", "player", "play", "Play", { fr: "Lire" }),
  e("world-stage-videos", "access", "loading", "Loading your course videos…", {
    fr: "Chargement de vos vidéos de cours…",
  }),
  e(
    "world-stage-videos",
    "access",
    "denied",
    "You need an active enrollment to watch these course videos.",
    {
      fr: "Vous devez avoir une inscription active pour regarder ces vidéos de cours.",
    },
  ),

  e("payments", "message", "failure_message", "The payment could not be prepared. Try again.", { fr: "Le paiement n'a pas pu être préparé. Réessayez." }),
  e("payments", "message", "request_title", "ICB payment request", { fr: "Demande de paiement ICB" }),
  e("payments", "message", "label_name", "Name", { fr: "Nom" }),
  e("payments", "message", "label_email", "Email", { fr: "E-mail" }),
  e("payments", "message", "label_courses", "Courses", { fr: "Cours" }),
  e("payments", "message", "label_total", "Total", { fr: "Total" }),
  e("payments", "message", "label_method", "Payment method", { fr: "Mode de paiement" }),
  e("payments", "message", "label_reference", "Reference", { fr: "Référence" }),
  e("payments", "message", "method_wave", "Wave", same),
  e("payments", "message", "method_card", "Credit card", { fr: "Carte bancaire" }),
  e("payments", "message", "customer_fallback", "Customer", { fr: "Client" }),
  e("payments", "message", "currency_code", "USD", same),
];

const byKey = new Map<string, ContentEntry>();
for (const entry of contentCatalog) {
  const id = `${entry.page}:${entry.content_key}`;
  if (byKey.has(id)) throw new Error(`Duplicate content key ${id}`);
  byKey.set(id, entry);
}

export function findEntry(pages: string[], key: string) {
  for (const page of pages) {
    const entry = byKey.get(`${page}:${key}`);
    if (entry) return entry;
  }
  return undefined;
}

export function entryFrench(entry: ContentEntry) {
  if (entry.fr !== undefined) return entry.fr;
  if (entry.same) return entry.en;
  return translate("fr", entry.en);
}
