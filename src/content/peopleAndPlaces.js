// People & Places photo strip, shown after the About biography.
// Photos appear in this order, so pair a workshop candid with a travel photo at the start.
// Each entry:
//   image    path under public/, e.g. "images/places/iswc-2025-workshop.webp"
//   alt      what the photo shows, for screen readers
//   caption  a short visible caption
//   focus    optional CSS object-position (e.g. "50% 30%") to keep faces in the 4:3 frame
// The section stays hidden until this list has at least one photo.
const photo = (file, caption, alt, focus) => ({ image: `images/places/${file}`, caption, alt, ...(focus ? { focus } : {}) });

export const peopleAndPlaces = [
  photo("text2kg-workshop-2023.webp", "TEXT2KG workshop organizers, ESWC 2023", "Organizers and speakers of the TEXT2KG 2023 workshop standing together in a row at the front of the room."),
  photo("kgc-skyline.webp", "Knowledge Graph Conference 2024, New York", "A group of Knowledge Graph Conference attendees on a terrace, with the East River and the Manhattan skyline behind them."),
  photo("iswc-text2kgbench.webp", "Presenting Text2KGBench, ISWC 2023, Athens", "A speaker at a lectern on a large stage, beneath a projected slide titled Text2KGBench: A Benchmark for Ontology-Driven Knowledge Graph Generation from Text."),
  photo("vldb-london.webp", "VLDB 2025, London", "Nandana smiling in a selfie in front of a VLDB 2025 Welcome to London screen."),
  photo("skillsbuild-group.webp", "IBM SkillsBuild mentors 2026", "IBM SkillsBuild mentors standing together in front of large IBM SkillsBuild screens."),
  photo("emnlp-abu-dhabi.webp", "EMNLP 2022, Abu Dhabi", "Nandana in a cap and conference lanyard, standing in a marble hall with Arabic and English direction signs overhead."),
  photo("vldb-structtext.webp", "Presenting StructText, VLDB 2025", "Nandana at a VLDB 2025 lectern, presenting the StructText paper on synthetic table-to-text benchmark generation."),
  photo("us-open-racket.webp", "IBM at the US Open", "Nandana in a watsonx T-shirt holding a tennis racket and ball in front of an IBM is serving up insight mural at the US Open."),
  photo("umap-new-york.webp", "UMAP 2025 industry track chairs", "The UMAP 2025 industry track chairs, including Nandana, in front of a slide titled Lessons from the Trenches: Industry Perspectives on User Studies and Modeling at Scale."),
  photo("w3c-visit.webp", "Visiting the W3C at MIT", "Nandana and two colleagues standing in a doorway beneath a World Wide Web Consortium (W3C) sign at MIT."),
  photo("iswc-watsonx.webp", "Representing IBM watsonx.data at ISWC 2023", "Nandana speaking at a lectern beside an ISWC 2023 banner, representing IBM watsonx.data, with a watsonx slide on the screen behind."),
  photo("upm-group.webp", "Summer School on Ontology Engineering and the Semantic Web (SSSW 2013)", "Participants of the Summer School on Ontology Engineering and the Semantic Web (SSSW 2013), sitting and standing on a lawn in front of a building with flags."),
  photo("iswc-2014-linked-data.webp", "Presenting Linked Data Platform at ISWC 2014", "Nandana speaking at an ISWC 2014 lectern, with a slide titled A Linked Data Platform adapter for the Bugzilla issue tracker."),
  photo("ibm-grammys.webp", "IBM at the GRAMMYs 2025", "Nandana posing beside a giant golden gramophone at the IBM at the GRAMMYs exhibit."),
  photo("text2kg-workshop-2024.webp", "TEXT2KG workshop organizers, ESWC 2024", "A projected title slide for the 3rd International Workshop on Knowledge Graph Generation from Text, showing photos of the organizers, with a camera on a tripod in front."),
  photo("kgc-selfie.webp", "With Bob Metcalfe, Turing Award Winner (2023)", "Selfie of Nandana with Turing Award winner Bob Metcalfe at the Knowledge Graph Conference."),
  photo("kgc-presentation.webp", "Presenting at the Knowledge Graph Conference 2025", "A laptop showing a slide on large language models for knowledge graph construction from text, facing a room of Knowledge Graph Conference attendees."),
  photo("apidays-new-york.webp", "apidays New York 2025", "Nandana smiling in a selfie in front of an apidays New York 2025 sponsor banner."),
  photo("emnlp-demo.webp", "Presenting a demo at EMNLP 2022", "Nandana standing beside a demo table with a laptop and a large screen, with an IBM poster on the wall behind."),
  photo("vldb-group.webp", "IBM Research at VLDB 2025, London", "A group of IBM Research colleagues with conference badges, standing together in a busy hall at VLDB 2025."),
  photo("iswc-baltimore-stage.webp", "As the Sponsorship Chair of ISWC 2024", "Nandana, as ISWC 2024 Sponsorship Chair, speaking at a clear lectern on stage, with a sponsor slide showing UMBC, Google, eBay, and IBM."),
  photo("us-open-tennis.webp", "IBM partnership with US Open", "Visitors posing with giant tennis rackets and oversized tennis balls at the IBM booth at the US Open."),
  photo("test-graduation-panel.webp", "TEST 2026 graduation panel", "Four panelists seated on stools in front of a screen reading TEST 2026 Graduation Panel."),
  photo("ai-unconference.webp", "AI Unconference, UN Open Source Week", "Nandana smiling in a selfie in front of an AI Unconference banner for IBM One Madison and UN Open Source Week."),
  photo("kcap-2023-ihmc.webp", "K-CAP 2023 at IHMC, Pensacola", "Nandana's K-CAP 2023 badge and an IHMC robot figure on a conference program from the Florida Institute for Human & Machine Cognition."),
  photo("us-open-portrait.webp", "With the tennis legend, Mary Joe Fernández at IBM", "Nandana in a US Open T-shirt standing next to tennis legend Mary Joe Fernández at an IBM event."),
  photo("acl-ibm-group.webp", "IBM Research at ACL 2022", "About a dozen IBM Research colleagues standing together in a conference exhibition hall."),
  photo("eswc-2023-badge.webp", "ESWC 2023", "Nandana's ESWC 2023 conference badge reading Nandana Mihindukulasooriya, IBM Research."),
  photo("acl-dublin-badge.webp", "ACL 2022, Dublin", "Nandana's ACL 2022 conference badge with a green sticker, next to a card explaining the social-distancing traffic light system."),
  photo("ibm-event-selfie.webp", "With my PhD advisor, Prof. Asunción Gómez Pérez", "Selfie of Nandana with his PhD advisor, Prof. Asunción Gómez Pérez, in front of a wall of IBM logos."),
  photo("skillsbuild-bootcamp.webp", "IBM SkillsBuild NextGen AI Bootcamp 2026", "A presentation screen introducing Nandana Mihindukulasooriya, Senior Research Scientist at IBM Research, as a speaker at the IBM SkillsBuild NextGen AI Innovation Bootcamp 2026."),
  photo("iswc-baltimore-badge.webp", "ISWC 2024", "Nandana's ISWC 2024 organizing committee badge, with the Live! Casino & Hotel sign behind it."),
  photo("ibm-team.webp", "IBM Research at ISWC 2024", "Six IBM Research colleagues in matching black IBM T-shirts posing together at ISWC 2024."),
  photo("ibm-event-table.webp", "New Women New Yorkers Career Fair at NYU, New York", "Nandana and two colleagues seated behind an IBM table at the New Women New Yorkers career fair at NYU."),
  photo("outdoor-lunch.webp", "Intern Exit Lunch 2026", "Nandana and IBM interns sharing an end-of-internship lunch at an outdoor table on a terrace surrounded by trees."),
  photo("watsonx-challenge.webp", "IBMer watsonx Challenge", "Nandana smiling in a selfie in front of an IBMer watsonx Challenge banner."),
  photo("nlp-summit.webp", "NLP Summit talk on knowledge graph construction", "Event graphic for the NLP Summit online talk The State of the Art on Knowledge Graph Construction from Text, by Jennifer D'Souza and Nandana Mihindukulasooriya.")
];
