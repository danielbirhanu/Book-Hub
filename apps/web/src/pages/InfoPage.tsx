import { ArrowLeft } from "lucide-react";
/* eslint-disable react-refresh/only-export-components */

import { Link } from "react-router-dom";

type Section = { heading: string; paragraphs: string[] };
export function InfoPage({
  eyebrow,
  title,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections: Section[];
}) {
  return (
    <main className="info-page">
      <section className="info-hero">
        <div className="info-hero-content">
          <p className="eyebrow eyebrow-light">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{intro}</p>
          <div style={{ marginTop: '24px' }}>
            <Link className="back-link" style={{ color: 'rgba(255,255,255,0.8)' }} to="/">
              <ArrowLeft aria-hidden="true" size={17} /> Back to Book Hub
            </Link>
          </div>
        </div>
      </section>
      
      <section className="info-grid-section">
        {sections.map((section) => (
          <div className="info-card" key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        ))}
      </section>
    </main>
  );
}

export const aboutContent = {
  eyebrow: "About Book Hub",
  title: "A quieter place for your reading life.",
  intro:
    "Book Hub helps readers discover meaningful books, keep track of what they are reading, and exchange thoughtful reviews.",
  sections: [
    {
      heading: "What we are building",
      paragraphs: [
        "Book Hub is designed around the parts of reading that last: curiosity before a book, attention while reading, and reflection afterward.",
        "The service combines a searchable catalog, personal shelves, community reviews, and practical tools for maintaining a reading life over time.",
      ],
    },
    {
      heading: "Our approach",
      paragraphs: [
        "We favor useful, calm interfaces over noisy feeds. Reviews should add context, not pressure, and recommendations should help people explore rather than tell them what to think.",
      ],
    },
  ],
};
export const guidelinesContent = {
  eyebrow: "Community standards",
  title: "Make the conversation worth joining.",
  intro:
    "Book Hub works best when readers can disagree generously and share honest reactions without making the space hostile.",
  sections: [
    {
      heading: "Contribute in good faith",
      paragraphs: [
        "Write about the book, not the person. Explain your reasoning, avoid personal attacks, and assume that other readers may see the work differently.",
        "Mark meaningful spoilers and do not use reviews for advertising, harassment, impersonation, or repeated off-topic promotion.",
      ],
    },
    {
      heading: "Moderation",
      paragraphs: [
        "We may hide or remove content that violates these standards. Administrators can moderate reviews, and repeated abuse may result in account restrictions.",
        "If something needs attention, use the available reporting channel or contact the Book Hub team with the book, review, and reason for concern.",
      ],
    },
  ],
};
export const privacyContent = {
  eyebrow: "Your information",
  title: "Privacy, explained plainly.",
  intro:
    "We collect only what Book Hub needs to provide accounts, reading tools, reviews, and account security.",
  sections: [
    {
      heading: "What we store",
      paragraphs: [
        "Account information includes your username, email address, password hash, session records, reading shelves, and reviews. Passwords are never stored in plain text.",
        "Optional book covers are uploaded to ImageKit when configured. Transactional account messages may be delivered through Brevo.",
      ],
    },
    {
      heading: "How we use it",
      paragraphs: [
        "We use this information to authenticate you, maintain your library, display your public reviews, send security or recovery emails, prevent abuse, and operate the service.",
        "Session cookies are HttpOnly and are not used for advertising. We do not sell personal information.",
      ],
    },
    {
      heading: "Your choices",
      paragraphs: [
        "You can stop using the service at any time. For account or data requests, contact the Book Hub team with the email associated with your account. We will update this policy when the service or its data practices materially change.",
      ],
    },
  ],
};
