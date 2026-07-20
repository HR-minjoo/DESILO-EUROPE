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
        "GDPR.",
        "PSD3 / PSR.",
        "AMLR Article 75.",
        "Regulation Article 75.",
        "DORA.",
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
      h1a: "Les banques voient des fragments.",
      h1b: "voit la fraude.",
      body: "Grâce aux technologies de renforcement de la vie privée, nous permettons aux banques européennes de détecter ensemble les fraudes multi-institutionnelles sans exposer les données de leurs clients.",
      microBase: "Conçu pour",
      microSuffix: ". Les données brutes restent dans l’environnement sécurisé de chaque banque.",
      microTerms: [
        "le RGPD.",
        "PSD3 / PSR.",
        "l’AMLR Article 75.",
        "le Règlement Article 75.",
        "DORA.",
      ],
      cta1: "Demander un pilote",
      cta2: "Voir comment ça fonctionne ↓",
    },
    problem: {
      label: "LE PROBLÈME",
      h2: "La fraude est conçue pour exploiter les failles entre les banques.",
      lead: "La fraude d’aujourd’hui se déroule rarement au sein d’une seule institution. L’activité est répartie entre les banques et les juridictions, ne laissant à chaque institution qu’une vue partielle du schéma global.",
      statsCaption1: "Les signaux isolés paraîssent légitimes.",
      statsCaption2: "Connectés, ils révèlent la fraude.",
      stats: [
        {
          cap: "Pertes totales dues à la fraude aux paiements dans l’UE/EEE en 2024, en hausse de 17 % d’une année sur l’autre.",
          src: "EBA & BCE, 2025",
        },
        {
          cap: "Part des pertes de fraude aux virements impliquant des transactions transfrontières.",
          src: "EBA · BCE",
        },
        {
          cap: "Environ un tiers des fonds frauduleux se déplacent à nouveau en moins de 15 minutes, échappant rapidement aux frontières institutionnelles.",
          src: "RUSI, 2025",
        },
      ],
      challengeFor: "Pendant des décennies, la réponse était non.",
      challengeTitle: "Les banques voulaient collaborer. Leurs données devaient rester séparées.",
      challengeBody:
        "Les données clients étaient confidentielles, et leur partage entre institutions risquait de violer les obligations de confidentialité et réglementaires. Les banques ont poursuivi les mêmes fraudeurs—chacune dans l’obscurité.",
      tlCaption1: "Autrefois hors limites.",
      tlCaption2: "Désormais à portée.",
      nodes: [
        {
          year: "2018",
          label: "RGPD",
          desc: "L’ère des barrières : le partage direct des données clients est devenu fortement contraint.",
        },
        {
          year: "2023",
          label: "PSD3 / PSR",
          desc: "Une base juridique commence à émerger pour l’échange d’informations sur la fraude aux paiements.",
        },
        {
          year: "10 juil. 2027",
          label: "AMLR Art. 75",
          desc: "La première voie juridique explicite pour les partenariats de partage d’informations inter-institutionnels (PfIS), avec une coordination au niveau européen via l’AMLA.",
        },
      ],
      amlrBadge: "En vigueur le 10 juillet 2027",
      scrollHint: "DÉFILER",
    },
    bridge: {
      line1: "« La réglementation a ouvert la voie à la collaboration. »",
      line2: "« Le vrai défi commence maintenant : y parvenir sans exposer les données clients. »",
    },
    solution: {
      label: "LA SOLUTION",
      tagline:
        "Infrastructure de détection pour les partenariats AMLR Article 75—chaque déploiement renforce le réseau.",
      features: [
        "Votre Zone Locale fonctionne dans le périmètre de votre banque ; les données brutes ne quittent jamais l’institution par architecture, non par politique",
        "La Zone Globale combine des signaux chiffrés entre banques, opérée par un organisme sectoriel neutre",
        "Aveugle par conception : les données brutes restent inaccessibles—même pour nous",
        "Résistant aux attaques quantiques, basé sur la cryptographie en réseaux",
      ],
      cta: "DÉCOUVRIR HOLMES",
    },
    technology: {
      label: "LA TECHNOLOGIE",
      h2: "Les Fondements Cryptographiques de HOLMES",
      body: "Construit sur des années de recherche cryptographique et de déploiement réel par notre société mère en Corée.",
      capabilities: [
        "Schéma FHE de 5ᵉ Génération",
        "Apprentissage automatique préservant la vie privée",
        "Créateurs originaux de TFHE & CKKS",
        "Éprouvé en production dans les grandes banques",
      ],
      cta: "Explorer la technologie",
    },
    finalCta: {
      h2: "Prêt à collaborer dans le cadre de l’Article 75 ?",
      body: "HOLMES fournit l’infrastructure pour un PfIS—le cadre de partage d’informations établi par l’AMLR Article 75. Avec HOLMES, vos données restent entièrement protégées, vous permettant de satisfaire aux exigences de responsabilité PSD3 sans augmenter les coûts de conformité.",
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
        h1: "Intelligence anti-fraude inter-institutionnelle sans partage de données brutes.",
        lead: "HOLMES combine les signaux de fraude de différentes institutions tandis que les données sous-jacentes restent chiffrées et inaccessibles à quiconque—y compris nous. En son cœur, l’inférence Transformer complète s’exécute directement sur des données chiffrées. Ses garanties sont cryptographiques, non contractuelles.",
        cta1: "Explorer la fraude inter-bancaire",
        cta2: "Voir comment ça fonctionne ↓",
      },
      capabilities: {
        label: "CAPACITÉS PRINCIPALES",
        cards: [
          {
            num: "01",
            title: "Inférence chiffrée",
            body: "Les modèles de séquences basés sur Transformer s’exécutent directement sur des données chiffrées—inférence complète, pas d’appariement de règles ni de statistiques dérivées de données hachées.",
          },
          {
            num: "02",
            title: "Aveugle par conception",
            body: "Le calcul est effectué sur des données chiffrées, maintenant le texte en clair dans chaque institution et hors de notre portée.",
          },
          {
            num: "03",
            title: "Résistant aux attaques quantiques",
            body: "Construit sur une cryptographie en réseaux pour résister aux attaques classiques et quantiques.",
          },
        ],
      },
      zones: {
        label: "Comment ça fonctionne",
        items: [
          {
            title: "Zone 1 — Nœuds Edge Locaux",
            intro:
              "Chaque banque traite ses propres données localement via un modèle de séquence Transformer, entièrement dans son propre périmètre.",
            bullets: [
              "Le comportement est modélisé en séquences plutôt qu’en transactions isolées, sans champs prédéfinis ni fenêtres temporelles fixes. Le modèle apprend quelles combinaisons sont pertinentes.",
              "La Zone 1 transforme les enregistrements bruts en signaux riches et comparables qui capturent des relations que les règles fixes n’ont jamais été conçues pour encoder. Ces signaux permettent à des schémas invisibles pour chaque banque d’émerger en Zone 2.",
              "Les données originales ne quittent jamais la banque.",
            ],
          },
          {
            title: "Zone 2 — Hub d’Orchestration Aveugle",
            intro:
              "C’est là que les enregistrements qui paraîssent normaux à chaque banque révèlent ensemble le schéma qu’ils forment—sans que personne, y compris le système lui-même, ne puisse lire ce qu’ils contiennent.",
            bullets: [
              "Au-delà de la correspondance chiffrée : l’inférence Transformer complète s’exécute directement sur des données chiffrées, alimentée par le schéma FHE propriétaire de DESILO. Le modèle conjoint voit la vue inter-institutionnelle tandis que les données restent scellées de bout en bout.",
              "Rien ne s’accumule dans le hub : chaque requête passe sans laisser de données derrière elle.",
            ],
          },
          {
            title: "Zone 3 — Garde-fou Chiffré",
            intro: "Les Zones 1 et 2 protègent les données. Cette couche protège le modèle lui-même.",
            bullets: [
              "Elle détecte et bloque les tentatives de sondage répétées visant à extraire la logique du modèle.",
              "Chaque vérification de sécurité laisse une piste d’audit de la requête—jamais des données.",
              "Ces journaux fournissent un enregistrement auditable de l’activité du système, soutenant l’explicabilité et les exigences d’audit DORA sans briser le chiffrement.",
            ],
          },
        ],
      },
      bottomCta: {
        label: "Commencer",
        h2: "Prêt à explorer comment HOLMES peut aider votre institution ?",
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
