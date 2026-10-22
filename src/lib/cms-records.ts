import { translate } from "../i18n/messages.ts";

const solution =
  "The solution to our problems lay not in books or trainings but in our own minds. You are abrilliant person in your field already more difficult than English, why would English be difficult for you, to the point of even blocking your progress?";

export type ModuleRecord = {
  position: number;
  title_en: string;
  title_fr: string;
  description_en: string;
  description_fr: string;
};

export type CourseRecord = {
  slug: string;
  name_en: string;
  name_fr: string;
  description_en: string;
  description_fr: string;
  short_description_en: string;
  short_description_fr: string;
  price: number;
  currency: string;
  thumbnail_url: string;
  modules: ModuleRecord[];
};

function text(en: string) {
  return { en, fr: translate("fr", en) };
}

function module(position: number, title: string, description: string): ModuleRecord {
  const titleText = text(title);
  const descriptionText = text(description);
  return {
    position,
    title_en: titleText.en,
    title_fr: titleText.fr,
    description_en: descriptionText.en,
    description_fr: descriptionText.fr,
  };
}

const globalFluencyDescription = text(
  "It's simple. In this program you get work with Roger, who is a software engineer, inventor and entrepreneur. He grew up in rural francophone Africa and rose to the world stage through self-reliance. He acquire English and Spanish through unconventional methods mostly for his own desire to have a seat on world stage. And today he share just that with hundreds of corporate leaders from around the world who simply can't afford to be viewed as a second class citizen in front of their international peers",
);

const globalFluencyShort = text(
  "The ultimate system to reaching in months the natural fluency you've been dreaming about for years and now entering the company or position that has always been out of your reach",
);

const worldStageDescription = text(
  "World Stage is a private, 12-month communication mentorship for senior leaders who operate in complex, high-stakes environments. It helps you communicate with greater clarity, influence and composure — so you can lead more effectively and contribute to a more stable, cooperative world.",
);

const worldStageShort = text(
  "Your passport to walking into meetings, presentations and negotiations in English feeling comfortable with your own skin just as you do in French, using the techniques and wisdom Roger discovered and used during his years of meditation and self-discovery",
);

export const courseRecords: CourseRecord[] = [
  {
    slug: "world-stage",
    name_en: "World Stage",
    name_fr: "World Stage",
    description_en: worldStageDescription.en,
    description_fr: worldStageDescription.fr,
    short_description_en: worldStageShort.en,
    short_description_fr: worldStageShort.fr,
    price: 10000,
    currency: "USD",
    thumbnail_url: "/images/world-stage-book.png",
    modules: [
      module(
        1,
        "Onboarding & baseline",
        "We start with a deep dive into your background, goals, key communication context, establishing a clear baseline and success metrics",
      ),
      module(
        2,
        "Internal repositioning",
        "We work on mindset, presence, narrative, aligning how you see yourself with how you need to be perceived",
      ),
      module(
        3,
        "Communication architecture",
        "We build a clear, dependable framework for your key messages, tailored to different audiences and situations",
      ),
      module(
        4,
        "Rehearsed performance",
        "You practice in realistic, high-pressure scenarios, with personalized feedback to sharpen your delivery and composure",
      ),
      module(
        5,
        "International proof",
        "We apply your skills in real-world settings, from international meetings to media appearances, with visible progress within 2\u20133 months",
      ),
      module(
        6,
        "Continuity & independence",
        "We ensure the gains last, with a tailored plan, ongoing resources and the confidence to thrive long after the program",
      ),
    ],
  },
  {
    slug: "global-fluency",
    name_en: "Global Fluency",
    name_fr: "Global Fluency",
    description_en: globalFluencyDescription.en,
    description_fr: globalFluencyDescription.fr,
    short_description_en: globalFluencyShort.en,
    short_description_fr: globalFluencyShort.fr,
    price: 500,
    currency: "USD",
    thumbnail_url: "/images/global-fluency-book.png",
    modules: [
      module(1, "Self-image shift", solution),
      module(2, "Understanding native accents", solution),
      module(3, "Achieving native level speaking", solution),
      module(4, "12-month private mentorship", solution),
    ],
  },
];

export const newsRecord = {
  slug: "black-friday-sale",
  title_en: "Black Friday Sale!",
  title_fr: translate("fr", "Black Friday Sale!"),
  summary_en:
    "And on thios Friday we\u2019re going to sell everything off for no money and I mean\nabsolutely no money.  In this short video, Roger explains the mission behind\nworld stage, who it is for, and what you can expect  an here is what we\u2019re going\nto do to succeed",
  summary_fr: "",
  image_url: "/images/news-black-friday.png",
  image_alt_en: "Roger Gueu in a navy suit with his arms crossed",
  is_published: true,
  type: "promotion",
};

newsRecord.summary_fr = translate("fr", newsRecord.summary_en);
