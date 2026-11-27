// Featured Work carousel, shown below the introduction. Cards appear in this order.
// Each card: title, optional image (path under public/, plus alt text), body, and one link.
// `body` is a string, or a list of strings for several paragraphs.
// Leave `image` empty until the asset is ready; the card renders cleanly without it.
// Desktop shows three cards at once, so a fourth card turns on desktop rotation.
export const featuredWork = [
  {
    title: "Text2KGBench: A Benchmark for Ontology-Driven Knowledge Graph Generation from Text",
    image: "images/featured-text2kgbench.webp",
    imageAlt: "Text2KGBench overview: an ontology and a document corpus feed LLM-driven knowledge graph construction, where an AI agent invokes an LLM, to produce a knowledge graph. The benchmark has two datasets: Wikidata-TekGen with 10 ontologies and 13,474 sentences, and DBpedia-WebNLG with 19 ontologies and 4,860 sentences.",
    body: "Text2KGBench was one of the first benchmarks for evaluating how well large language models construct knowledge graphs from text using a given ontology. By defining the task and introducing evaluation metrics, it helped spur a growing body of research on ontology-driven knowledge graph construction. The paper has been cited more than 250 times.",
    link: { label: "Read the paper", href: "https://doi.org/10.1007/978-3-031-47243-5_14" }
  },
  {
    title: "ASTER: Agentic Text-to-SPARQL with Task Skills, Autonomous Exploration, and Refinement",
    image: "images/featured-aster.webp",
    imageAlt: "ASTER architecture: a natural-language question goes to the text2sparql agent, which uses few-shot-examples and sparql-generation skills and calls wikidata-search, graph-exploration, and sparql-execution tools against Wikidata. It returns the final SPARQL query, the answer, and an agent trajectory log.",
    body: "ASTER uses Agent Skills to answer natural-language questions by exploring Wikidata and refining its SPARQL queries. At the Wiki-Based Knowledge Graph Question Answering Challenge (WikiKGQA 2026) at ISWC 2026, it won the English questions with entity mentions track and was the runner-up in the English questions without entity mentions track.",
    link: { label: "Read the challenge paper", href: "https://ceur-ws.org/Vol-4284/paper4.pdf" }
  },
  {
    title: "10+ Years of Service to the Scientific Community",
    image: "images/featured-service.webp",
    imageAlt: "Network of connected conference names where Nandana has served: ESWC, ISWC, SEMANTiCS, K-CAP, AAAI, KGSWC, EMNLP, ACL, IJCAI, WWW, DEXA, EKAW, ICTERI, UMAP, KDD, NAACL, SAC, AMLDA, and SIMBig.",
    body: "Nandana has co-chaired 21 international workshops and served on the organizing committees of 7 conferences in roles such as General Chair and Industry Track Chair. He has also been an area chair, senior programme committee member, or programme committee member for more than 66 international conferences and 33 workshops. This service spans AI, knowledge graphs, semantic technologies, knowledge representation, NLP, and data science.",
    link: { label: "Explore my professional service", href: "#service" }
  }
];
