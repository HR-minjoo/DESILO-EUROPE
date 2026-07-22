export const T = {
  en: {
    nav: {
      home: "Home",
      product: "Solution",
      news: "News",
      cta: "Get in touch",
    },
    promoBanner: {
      text: "Encrypted Collaboration in Financial Crime Detection",
      sub: "Technology Showcase & Pilot Programme, in view of AMLR Art.75",
    },
    hero: {
      h1a: "Banks see fragments.",
      h1b: "sees fraud.",
      body: "Using privacy-enhancing technology, we enable European banks to jointly detect cross-institutional fraud without exposing their customer data.",
      microBase: "Built for",
      microSuffix: ". Raw data remains within each bank's secure environment.",
      microTerms: [
        "GDPR",
        "PSD3 / PSR",
        "AMLR Article 75",
        "Regulation Article 75",
        "DORA",
      ],
      cta1: "Request a pilot",
      cta2: "See how it works ↓",
    },
    problem: {
      label: "THE PROBLEM",
      h2: "Fraud is engineered to exploit the gaps between banks.",
      lead: "Today's fraud rarely unfolds within a single institution. Activity is distributed across banks and jurisdictions, leaving each institution with only a partial view of the full scheme.",
      statsCaption1: "Isolated signals look legitimate.",
      statsCaption2: "Connected, they reveal fraud.",
      stats: [
        {
          cap: "Total payment fraud losses across the EU/EEA in 2024, up 17% year on year.",
          src: "EBA & ECB, 2025",
        },
        {
          cap: "Share of credit transfer fraud losses involving cross-border transactions.",
          src: "EBA · ECB",
        },
        {
          cap: "Around one-third of fraudulent funds move again within 15 minutes—quickly escaping institutional boundaries.",
          src: "RUSI, 2025",
        },
      ],
      challengeFor: "For decades, the answer was no.",
      challengeTitle: "Banks wanted to collaborate. Their data had to stay apart.",
      challengeBody:
        "Customer data was confidential, and sharing it across institutions risked breaching privacy and regulatory obligations.\n\nBanks have been pursuing the same fraudsters—each in the dark.",
      tlCaption1: "Once out of bounds.",
      tlCaption2: "Now within reach.",
      nodes: [
        {
          year: "2018",
          label: "GDPR",
          desc: "The age of barriers: direct sharing of customer data became heavily constrained.",
        },
        {
          year: "2023",
          label: "PSD3 / PSR",
          desc: "A legal basis begins to emerge for exchanging payment-fraud information.",
        },
        {
          year: "10 Jul 2027",
          label: "AMLR Art. 75",
          desc: "The first explicit legal pathway for cross-institutional information-sharing partnerships (PfIS), with EU-level coordination through AMLA.",
        },
      ],
      amlrBadge: "Effective July 10, 2027",
      scrollHint: "SCROLL",
    },
    bridge: {
      line1: `“Regulation opened the door to collaboration.`,
      line2: `Now comes the real challenge: making it work without exposing customer data.”`,
    },
    solution: {
      label: "THE SOLUTION",
      tagline:
        "Detection infrastructure for AMLR Article 75 partnerships—every deployment makes the network stronger.",
      features: [
        "Your Local Zone runs within your bank's perimeter; raw data never leaves by architecture, not policy",
        "The Global Zone combines encrypted signals across banks, operated by a neutral industry body",
        "Blind by design: Raw data stays out of reach—even to us",
        "Quantum-resistant, built on lattice-based cryptography",
      ],
      cta: "EXPLORE HOLMES",
    },
    technology: {
      label: "THE TECHNOLOGY",
      h2: "The Cryptographic Foundation of HOLMES",
      body: "Built on years of cryptographic research and real-world deployment by our parent company in Korea.",
      capabilities: [
        "5th-Generation FHE Scheme",
        "Privacy-Preserving Machine Learning",
        "Original Creators of TFHE & CKKS",
        "Production-proven at major banks",
      ],
      cta: "Explore the technology",
    },
    finalCta: {
      h2: "Preparing to collaborate under Article 75?",
      body: "HOLMES provides the infrastructure for a PfIS—the information-sharing framework established under AMLR Article 75. With HOLMES, your data remains fully protected, allowing you to meet PSD3 liability requirements without increasing compliance costs.",
      cta: "Explore HOLMES",
    },
    footer: {
      contact: "Contact",
      follow: "Follow",
      privacy: "Privacy notice",
      rights: "© DESILO Europe S.à r.l. All rights reserved.",
    },
    product: {
      hero: {
        h1: "Cross-institutional fraud intelligence without sharing raw data.",
        lead: "HOLMES combines fraud signals across institutions while the underlying data remains encrypted and inaccessible to anyone else—including us. At its core, full Transformer inference runs directly on encrypted data. Its guarantees are cryptographic, not contractual.",
        cta1: "Explore cross-bank fraud",
        cta2: "See how it works ↓",
      },
      capabilities: {
        label: "CORE CAPABILITIES",
        cards: [
          {
            num: "01",
            title: "Encrypted inference",
            body: "Transformer-based sequence models run directly on encrypted data—full deep-model inference, not rule matching or statistics derived from hashed data.",
          },
          {
            num: "02",
            title: "Blind by design",
            body: "Computation is performed on encrypted data, keeping plaintext within each institution and beyond our reach.",
          },
          {
            num: "03",
            title: "Quantum-resistant",
            body: "Built on lattice-based cryptography to withstand both classical and quantum attacks.",
          },
        ],
      },
      zones: {
        label: "How it works",
        items: [
          {
            title: "Zone 1 — Local Edge Nodes",
            intro:
              "Each bank processes its own data locally through a Transformer-based sequence model, entirely within its own perimeter.",
            bullets: [
              "Behaviour is modelled as sequences rather than isolated transactions, with no predefined fields or fixed time windows.\nThe model learns which combinations matter.",
              "Zone 1 transforms raw records into rich, comparable signals that capture relationships fixed rules were never designed to encode.\nThese signals allow patterns invisible to any single bank to emerge in Zone 2.",
              "The original data never leaves the bank.",
            ],
          },
          {
            title: "Zone 2 — Blind Orchestration Hub",
            intro:
              "This is where records that appear normal to each bank reveal the pattern they form together—without anyone, including the system itself, being able to read what they contain.",
            bullets: [
              "Beyond encrypted matching: Full Transformer inference runs directly on encrypted data, powered by DESILO's proprietary FHE scheme.\nThe joint model sees the cross-institutional picture while the data remains sealed end to end.",
              "Nothing accumulates in the hub: Each query passes through without leaving data behind.",
            ],
          },
          {
            title: "Zone 3 — Encrypted Guardrail",
            intro: "Zones 1 and 2 protect the data. This layer protects the model itself.",
            bullets: [
              "It detects and blocks repeated probing attempts intended to extract the model's logic.",
              "Every security check leaves an audit trail of the query—never the data.",
              "These logs provide an auditable record of system activity, supporting explainability and DORA audit requirements without breaking encryption.",
            ],
          },
        ],
      },
      bottomCta: {
        label: "Get started",
        h2: "Ready to explore how HOLMES can help your institution?",
        cta: "Get in touch",
      },
      footer: {
        rights: "© DESILO Europe S.à r.l. All rights reserved.",
        back: "Back to home",
      },
    },
    news: {
      label: "NEWS & INSIGHTS",
      empty: "No articles published yet.",
      loading: "Loading articles…",
      error: "We couldn't load articles right now. Please try again in a moment.",
      featured: "Featured",
      readMore: "Read more",
      allArticles: "All articles",
      backToNews: "← Back to News",
    },
  },

  fr: {
    nav: {
      home: "Accueil",
      product: "Solution",
      news: "Actualités",
      cta: "Nous contacter",
    },
    promoBanner: {
      text: "Collaboration chiffrée pour la détection des infractions financières",
      sub: "Démonstration technologique & programme pilote, dans la perspective de l’AMLR Art.75",
    },
    hero: {
      h1a: "Les banques ne voient seulement leurs propres données.",
      h1b: "repère la fraude.",
      body: "Grâce à des technologies renforçant la confidentialité, nous permettons aux banques européennes de détecter conjointement les fraudes inter-établissements sans exposer les données de leurs clients.",
      microBase: "Conçu pour ",
      microSuffix: ". Les données brutes restent au sein de l’environnement sécurisé de chaque banque.",
      microTerms: [
        "RGPD",
        "PSD3 / PSR",
        "l'article 75 de l'AMLR",
        "DORA",
      ],
      cta1: "Découvrir la fraude inter-bancaire",
      cta2: "Voir comment ça fonctionne ↓",
    },
    problem: {
      label: "LE PROBLÈME",
      h2: "La fraude repose sur l’exploitation des restrictions de communication entre les banques.",
      lead: "Aujourd’hui, la fraude se déroule rarement au sein d’un seul établissement. Les activités sont réparties entre plusieurs banques et juridictions, ce qui ne laisse à chaque établissement qu’une vue partielle du dispositif global.",
      statsCaption1: "Des signaux isolés semblent légitimes.",
      statsCaption2: "Une fois connectés, ils révèlent la fraude.",
      stats: [
        {
          cap: "Pertes totales liées à la fraude aux paiements dans l’UE/EEE en 2024, en hausse de 17 % sur un an.",
          src: "EBA & ECB, 2025",
        },
        {
          cap: "Part des pertes liées à la fraude par virement impliquant des transactions transfrontalières.",
          src: "EBA · ECB",
        },
        {
          cap: "Environ un tiers des fonds frauduleux sont à nouveau déplacés dans les 15 minutes — échappant rapidement aux frontières institutionnelles.",
          src: "RUSI, 2025",
        },
      ],
      challengeFor: "",
      challengeTitle: "Les banques voulaient collaborer mais leurs données ne pouvaient pas être partagées.",
      challengeBody:
        "Les données clients étaient confidentielles, et leur partage entre établissements risquait de violer des obligations de confidentialité et réglementaires.\n\nLes banques poursuivent les mêmes fraudeurs, chacune dans l’ignorance de l’autre.",
      tlCaption1: "Autrefois hors de portée.",
      tlCaption2: "Désormais à portée de main.",
      nodes: [
        {
          year: "2018",
          label: "RGPD",
          desc: "L’ère des barrières : le partage direct des données clients est devenu fortement restreint.",
        },
        {
          year: "",
          label: "PSD3/PSR",
          desc: "Une base juridique commence à émerger pour l’échange d’informations sur la fraude aux paiements.",
        },
        {
          year: "10 juillet 2027",
          label: "Article 75 de l’AMLR",
          desc: "Première voie juridique explicite pour les partenariats de partage d’informations inter-établissements (PfIS), avec une coordination au niveau européen via l’AMLA. La gouvernance et l’infrastructure doivent être prêtes avant son entrée en vigueur.",
        },
      ],
      amlrBadge: "En vigueur le 10 juillet 2027",
      scrollHint: "DÉFILER",
    },
    bridge: {
      line1: "La réglementation a ouvert la voie à la collaboration.",
      line2: "Reste maintenant le véritable défi : la faire fonctionner sans exposer les données des clients.",
    },
    solution: {
      label: "LA SOLUTION",
      tagline:
        "Une infrastructure de détection pour les partenariats de l’article 75 de l’AMLR — chaque déploiement renforce le réseau.",
      features: [
        "Votre Local Zone fonctionne au sein du périmètre de votre banque ; les données en clair (non chiffrées) n’en sortent jamais, par conception architecturale et non par politique",
        "La Global Zone combine des signaux chiffrés entre les banques, opérée par un organisme sectoriel neutre",
        "Aveugle par construction : les données brutes restent hors de portée — même pour nous",
        "Résistant au quantique, basé sur une cryptographie à réseaux euclidiens",
      ],
      cta: "DÉCOUVRIR HOLMES",
    },
    technology: {
      label: "LA TECHNOLOGIE",
      h2: "Les fondations cryptographiques de HOLMES",
      body: "Fruit de plusieurs années de recherche cryptographique et de déploiements concrets par notre maison mère en Corée.",
      capabilities: [
        "Schéma FHE de 5ᵉ génération",
        "Apprentissage automatique préservant la confidentialité",
        "Créateurs originaux de TFHE & CKKS",
        "Éprouvé en production auprès de grandes banques",
      ],
      cta: "Découvrir la technologie",
    },
    finalCta: {
      h2: "Vous préparez une collaboration dans le cadre de l’article 75 ?",
      body: "HOLMES fournit l’infrastructure nécessaire à un PfIS — le cadre de partage d’informations établi par l’article 75 de l’AMLR. Avec HOLMES, les données de votre établissement restent entièrement protégées, ce qui vous permet de répondre aux exigences de responsabilité de la PSD3 sans augmenter vos coûts de conformité.",
      cta: "Découvrir HOLMES",
    },
    footer: {
      contact: "Contact",
      follow: "Suivre",
      privacy: "Politique de confidentialité",
      rights: "© DESILO Europe S.à r.l. Tous droits réservés.",
    },
    product: {
      hero: {
        h1: "Cross-institutional fraud intelligence without sharing raw data.",
        lead: "HOLMES combine des signaux de fraude entre plusieurs établissements, tandis que les données sous-jacentes restent chiffrées et inaccessibles à quiconque, y compris à nous. Au cœur du système, l’inférence complète d’un Transformer s’exécute directement sur des données chiffrées. Ses garanties sont cryptographiques, et non contractuelles.",
        cta1: "Explorer la fraude inter-bancaire",
        cta2: "Voir comment ça fonctionne ↓",
      },
      capabilities: {
        label: "CAPACITÉS PRINCIPALES",
        cards: [
          {
            num: "01",
            title: "Encrypted inference",
            body: "Des modèles de séquence basés sur des Transformers s’exécutent directement sur des données chiffrées — une inférence complète de modèle profond, et non une correspondance de règles ou des statistiques dérivées de données hachées.",
          },
          {
            num: "02",
            title: "Aveugle par construction",
            body: "Le calcul s’effectue sur des données chiffrées, maintenant le texte en clair au sein de chaque établissement et hors de notre portée.",
          },
          {
            num: "03",
            title: "Post quantique",
            body: "Basé sur une cryptographie à réseaux euclidiens (lattice-based), résistante aux attaques classiques comme quantiques.",
          },
        ],
      },
      zones: {
        label: "Comment ça fonctionne",
        items: [
          {
            title: "Zone 1 — Local Edge Nodes",
            intro:
              "Chaque banque traite ses propres données localement via un modèle de séquence basé sur un Transformer, entièrement au sein de son propre périmètre.",
            bullets: [
              "Les comportements sont modélisés sous forme de séquences plutôt que de transactions isolées, sans champs prédéfinis ni fenêtres temporelles fixes. Le modèle apprend quelles combinaisons sont pertinentes.",
              "La Zone 1 transforme les données brutes en signaux riches et comparables, capturant des relations que des règles fixes n’ont jamais été conçues pour représenter. Ces signaux permettent de faire émerger, en Zone 2, des schémas invisibles à l’échelle d’une seule banque.",
              "Les données d’origine ne quittent jamais la banque.",
            ],
          },
          {
            title: "Zone 2 — Blind Orchestration Hub",
            intro:
              "C’est ici que des enregistrements paraissant normaux à chaque banque révèlent, une fois mis en commun, le schéma qu’ils forment ensemble — sans que quiconque, pas même le système lui-même, ne puisse en lire le contenu.",
            bullets: [
              "Au-delà de la correspondance chiffrée : l’inférence complète d’un Transformer s’exécute directement sur des données chiffrées, grâce au schéma FHE propriétaire de DESILO. Le modèle conjoint perçoit la vue inter-établissements, tandis que les données restent scellées de bout en bout.",
              "Rien ne s’accumule dans le hub : chaque requête transite sans laisser de données derrière elle.",
            ],
          },
          {
            title: "Zone 3 — Encrypted Guardrail",
            intro: "Les Zones 1 et 2 protègent les données. Cette couche protège le modèle lui-même.",
            bullets: [
              "Elle détecte et bloque les tentatives répétées de sondage visant à extraire la logique du modèle.",
              "Chaque contrôle de sécurité laisse une trace d’audit de la requête — jamais des données elles-mêmes.",
              "Ces journaux constituent un registre auditable de l’activité du système, favorisant l’explicabilité et répondant aux exigences d’audit DORA, sans compromettre le chiffrement.",
            ],
          },
        ],
      },
      bottomCta: {
        label: "Commencer",
        h2: "Prêt à explorer comment HOLMES peut aider votre institution ?",
        cta: "Nous contacter",
      },
      footer: {
        rights: "© DESILO Europe S.à r.l. Tous droits réservés.",
        back: "Retour à l’accueil",
      },
    },
    news: {
      label: "ACTUALITÉS & ANALYSES",
      empty: "Aucun article publié pour l’instant.",
      loading: "Chargement des articles…",
      error: "Impossible de charger les articles pour le moment. Veuillez réessayer.",
      featured: "À la une",
      readMore: "Lire la suite",
      allArticles: "Tous les articles",
      backToNews: "← Retour aux actualités",
    },

  },
} as const;

export type Translations = typeof T.en;
