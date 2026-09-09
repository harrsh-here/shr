// Placeholder poster images — swap these files out when real posters are ready
// File paths: src/assets/placeholders/gyration-poster-placeholder.jpg
//             src/assets/placeholders/donde-mode-poster-placeholder.jpg
import gyrationPlaceholder from "./placeholders/gyration-poster-placeholder.jpg";
import donDeModePhaceholder from "./placeholders/donde-mode-poster-placeholder.jpg";

// Brochure is served from the public folder so it's accessible at /brochure.pdf
export const BROCHURE_URL = "/brochure.pdf";

export const eventsData = [
  {
    id: 9,
    image: gyrationPlaceholder,
    name: "Gyration",
    category: "Dance Competition",
    description: "Gyration is Shraddhanjali's flagship inter-college dance competition — a celebration of rhythm, energy, and artistry. Teams can perform any dance form: classical, folk, hip-hop, contemporary, fusion, or freestyle. Bring your best choreography, your tightest formation, and your most electrifying stage presence. The floor is yours.",
    rules: [
      "Open to all recognised dance styles: classical, folk, hip-hop, contemporary, fusion, and freestyle.",
      "Performance duration: minimum 4 minutes, maximum 6 minutes (including stage setup time).",
      "Music must be submitted in high-quality MP3 format at least two days before the event; carry a USB backup on the day.",
      "Simple props are permitted when arranged by the participants; hazardous materials are strictly prohibited.",
      "All songs, lyrics, and moves must be decent and culturally appropriate. Vulgarity will lead to immediate disqualification.",
      "Teams must report to the registration desk at least 30 minutes before their scheduled slot.",
      "Judging criteria: choreography, synchronisation, energy, costume, and overall presentation.",
      "⚠️ Registration fees are strictly non-refundable under any circumstances."
    ],
    prizes: [
      "[PLACEHOLDER: Gyration prizes — to be provided by user]"
    ],
    type: "team_fixed",
    minMembers: 6,
    maxMembers: 15,
    price: 50,
    feePerPerson: 50,
    contactInfo: [
      "Naina Khare — 9258689744",
      "Shashank Shrivastava — 9334024106",
      "Coordinator 3 — details to be announced"
    ],
    location: "Arya College of Engineering & I.T., Kukas, Jaipur",
    mapUrl: "https://maps.app.goo.gl/is9ex9H8gF7i2xP8A",
    date: "19 September 2026 · 6:30 PM onwards",
    note: [""],
    link: "#",
    rulebookLink: BROCHURE_URL,
  },
  {
    id: 10,
    image: donDeModePhaceholder,
    name: "Don-De-Mode",
    category: "Fashion Show",
    description: "Don-De-Mode is Shraddhanjali's inter-college fashion show — a runway spectacle where teams blend costume design, theme storytelling, and confident performance into one unforgettable ramp walk. Choose your concept, dress your team, and tell your story from the very first step to the final pose. Style is the language; the stage is yours.",
    rules: [
      "Teams must present a cohesive theme-based ramp-walk performance.",
      "Performance duration: minimum 5 minutes, maximum 8 minutes (including stage setup time).",
      "Music must be submitted in high-quality MP3 format at least two days before the event; carry a USB backup on the day.",
      "Simple props are permitted when arranged by participants; hazardous materials are strictly prohibited.",
      "All costumes, songs, and performances must be decent and culturally appropriate. Vulgarity will lead to immediate disqualification.",
      "Teams must report to the registration desk at least 30 minutes before their scheduled slot.",
      "Judging criteria: theme concept, costume design, choreography, confidence, and overall presentation.",
      "⚠️ Registration fees are strictly non-refundable under any circumstances."
    ],
    prizes: [
      "[PLACEHOLDER: Don-De-Mode prizes — to be provided by user]"
    ],
    type: "team_fixed",
    minMembers: 10,
    maxMembers: 20,
    price: 50,
    feePerPerson: 50,
    contactInfo: [
      "Naina Khare — 9258689744",
      "Shashank Shrivastava — 9334024106",
      "Coordinator 3 — details to be announced"
    ],
    location: "Arya College of Engineering & I.T., Kukas, Jaipur",
    mapUrl: "https://maps.app.goo.gl/is9ex9H8gF7i2xP8A",
    date: "19 September 2026 · 6:30 PM onwards",
    note: [""],
    link: "#",
    rulebookLink: BROCHURE_URL,
  },
];
