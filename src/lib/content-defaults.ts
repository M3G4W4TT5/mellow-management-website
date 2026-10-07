import type { Localized } from './content-model';
import type { PortableTextBlock } from '@portabletext/types';

export const defaultText = {
  "skipLink": {
    "da": "Spring til indhold",
    "en": "Skip to content"
  },
  "navigationLabel": {
    "da": "Hovedmenu",
    "en": "Main navigation"
  },
  "artistsLink": {
    "da": "Artister",
    "en": "Artists"
  },
  "contactLink": {
    "da": "Kontakt",
    "en": "Contact"
  },
  "languageLabel": {
    "da": "EN",
    "en": "DK"
  },
  "languageAccessibleLabel": {
    "da": "View in English",
    "en": "Se på dansk"
  },
  "homeAccessibleLabel": {
    "da": "Mellow Management — hjem",
    "en": "Mellow Management — home"
  },
  "artistsHeading": {
    "da": "Vores artister.",
    "en": "Our artists."
  },
  "artistsSubtitle": {
    "da": "Hver deres lyd. Hver deres historie.",
    "en": "Each with their own sound. Each with their own story."
  },
  "privacyLink": {
    "da": "Privatliv",
    "en": "Privacy"
  },
  "backToTop": {
    "da": "Til toppen",
    "en": "Back to top"
  },
  "backToHome": {
    "da": "Til forsiden",
    "en": "Back to home"
  },
  "readMore": {
    "da": "Læs mere",
    "en": "Read more"
  },
  "flipCard": {
    "da": "Vend kortet for",
    "en": "Flip card for"
  },
  "returnToPhoto": {
    "da": "Vend tilbage til billedet af",
    "en": "Return to photo of"
  },
  "carouselLabel": {
    "da": "Artister",
    "en": "Artists"
  },
  "carouselInstructions": {
    "da": "Træk eller swipe for at se flere artister. Brug piletasterne, når et billede har fokus.",
    "en": "Drag or swipe to see more artists. Use the arrow keys when a picture is focused."
  },
  "puckInstructions": {
    "da": "Tryk for kys, træk eller skub med piletasterne",
    "en": "Tap for kisses, drag or nudge with arrow keys"
  },
  "emptyRoster": {
    "da": "Artister kommer snart.",
    "en": "Artists coming soon."
  },
  "photoCredit": {
    "da": "Foto",
    "en": "Photo"
  },
  "spotifyLink": {
    "da": "Lyt på Spotify",
    "en": "Listen on Spotify"
  },
  "spotifyPlayer": {
    "da": "Spotify-afspiller",
    "en": "Spotify player"
  },
  "companyNumberLabel": {
    "da": "CVR",
    "en": "CVR"
  },
  "responsibleContactLabel": {
    "da": "Kontakt",
    "en": "Contact"
  }
} satisfies Record<string, Localized>;

export const defaultBrand = { name: 'Mellow Management', heroLineOne: 'Mellow', heroLineTwo: 'Management', logo: '/mellow-logo.webp', mark: '/mellow-mark.svg', tickerMark: '/mellow-lips.png', favicon: '/mellow-mark.svg' };
export const defaultFooter = { companyNumber: '35347380', address: { da: 'Åboulevard 32, 2. tv\n2200 København N, Danmark', en: 'Åboulevard 32, 2. tv\n2200 Copenhagen N, Denmark' } as Localized, copyrightName: 'Mellow Management', creditLabel: {da:'Designed by', en:'Designed by'} as Localized, creditName: 'Memory(One)', creditUrl: 'https://memoryone.eu/', creditLogo: '/memoryone-logo.png' };
export const defaultSeo = { title: { da: 'Mellow Management — Artister', en: 'Mellow Management — Artists' } as Localized, description: { da: '', en: '' } as Localized, sharingImage: '', sharingImageAlt: {da:'',en:''} as Localized };
export type PolicySection = { _type?: 'policySection'; _key: string; title: Localized; kind: 'responsible' | 'text'; body?: {da?: PortableTextBlock[]; en?: PortableTextBlock[]} };
export const defaultPrivacy: {title:Localized; seoTitle:Localized; description:Localized; sections:PolicySection[]} = { title: {da:'Privatliv.',en:'Privacy.'}, seoTitle: {da:'Privatliv — Mellow Management',en:'Privacy — Mellow Management'}, description:{da:'',en:''}, sections: [
  {
    "_type": "policySection",
    "_key": "policy-0",
    "title": {
      "da": "Hvem er ansvarlig?",
      "en": "Who is responsible?"
    },
    "kind": "responsible",
    "body": {
      "da": [
        {
          "_type": "block",
          "_key": "paragraph",
          "style": "normal",
          "markDefs": [
            {
              "_type": "contactEmail",
              "_key": "link0"
            }
          ],
          "children": [
            {
              "_type": "span",
              "_key": "span0",
              "text": "Mellow Management, CVR 35347380, Åboulevard 32, 2. tv, 2200 København N, Danmark. Kontakt: ",
              "marks": []
            },
            {
              "_type": "span",
              "_key": "span1",
              "text": "john@mellowmanagement.com",
              "marks": [
                "link0"
              ]
            },
            {
              "_type": "span",
              "_key": "span2",
              "text": ".",
              "marks": []
            }
          ]
        }
      ],
      "en": [
        {
          "_type": "block",
          "_key": "paragraph",
          "style": "normal",
          "markDefs": [
            {
              "_type": "contactEmail",
              "_key": "link0"
            }
          ],
          "children": [
            {
              "_type": "span",
              "_key": "span0",
              "text": "Mellow Management, CVR 35347380, Åboulevard 32, 2. tv, 2200 Copenhagen N, Denmark. Contact: ",
              "marks": []
            },
            {
              "_type": "span",
              "_key": "span1",
              "text": "john@mellowmanagement.com",
              "marks": [
                "link0"
              ]
            },
            {
              "_type": "span",
              "_key": "span2",
              "text": ".",
              "marks": []
            }
          ]
        }
      ]
    }
  },
  {
    "_type": "policySection",
    "_key": "policy-1",
    "title": {
      "da": "Når du skriver til os",
      "en": "When you contact us"
    },
    "kind": "text",
    "body": {
      "da": [
        {
          "_type": "block",
          "_key": "paragraph",
          "style": "normal",
          "markDefs": [],
          "children": [
            {
              "_type": "span",
              "_key": "span0",
              "text": "Når du kontakter os via e-mail eller telefon, modtager vi de oplysninger, du deler med os. Vi bruger oplysningerne til at læse og besvare din henvendelse og til nødvendig opfølgning. Grundlaget er vores legitime interesse i at besvare henvendelser (GDPR artikel 6, stk. 1, litra f), eller skridt forud for en aftale, hvis din henvendelse handler om en sådan (artikel 6, stk. 1, litra b).",
              "marks": []
            }
          ]
        }
      ],
      "en": [
        {
          "_type": "block",
          "_key": "paragraph",
          "style": "normal",
          "markDefs": [],
          "children": [
            {
              "_type": "span",
              "_key": "span0",
              "text": "When you contact us by email or phone, we receive the information you share with us. We use this information to read, answer and follow up on your enquiry. The legal basis is our legitimate interest in answering enquiries (GDPR Article 6(1)(f)), or taking steps before a contract if your enquiry concerns one (Article 6(1)(b)).",
              "marks": []
            }
          ]
        }
      ]
    }
  },
  {
    "_type": "policySection",
    "_key": "policy-2",
    "title": {
      "da": "Hvor længe gemmes oplysningerne?",
      "en": "How long do we keep it?"
    },
    "kind": "text",
    "body": {
      "da": [
        {
          "_type": "block",
          "_key": "paragraph",
          "style": "normal",
          "markDefs": [],
          "children": [
            {
              "_type": "span",
              "_key": "span0",
              "text": "Almindelige henvendelser slettes, når opfølgningen er afsluttet, som udgangspunkt senest 12 måneder efter sidste kontakt. Hvis henvendelsen bliver del af et samarbejde, kan relevante oplysninger opbevares længere efter aftale og lovkrav. Kontakt os, hvis du ønsker oplysninger om en konkret henvendelse.",
              "marks": []
            }
          ]
        }
      ],
      "en": [
        {
          "_type": "block",
          "_key": "paragraph",
          "style": "normal",
          "markDefs": [],
          "children": [
            {
              "_type": "span",
              "_key": "span0",
              "text": "Ordinary enquiries are deleted when follow-up is complete, normally no later than 12 months after the last contact. Relevant information may be kept longer if an enquiry leads to a working relationship or a legal obligation requires it. Contact us about a particular enquiry.",
              "marks": []
            }
          ]
        }
      ]
    }
  },
  {
    "_type": "policySection",
    "_key": "policy-3",
    "title": {
      "da": "Leverandører og deling",
      "en": "Providers and sharing"
    },
    "kind": "text",
    "body": {
      "da": [
        {
          "_type": "block",
          "_key": "paragraph",
          "style": "normal",
          "markDefs": [],
          "children": [
            {
              "_type": "span",
              "_key": "span0",
              "text": "Cloudflare hoster websitet. Redigerbart websiteindhold ligger hos Sanity. Vi sælger ikke dine oplysninger. Eventuelle overførsler uden for EU/EØS håndteres efter de relevante leverandøraftaler og overførselsgrundlag.",
              "marks": []
            }
          ]
        }
      ],
      "en": [
        {
          "_type": "block",
          "_key": "paragraph",
          "style": "normal",
          "markDefs": [],
          "children": [
            {
              "_type": "span",
              "_key": "span0",
              "text": "Cloudflare hosts the site. Sanity stores editable website content. We do not sell your information. Transfers outside the EU/EEA are handled under the relevant provider agreements and transfer safeguards.",
              "marks": []
            }
          ]
        }
      ]
    }
  },
  {
    "_type": "policySection",
    "_key": "policy-4",
    "title": {
      "da": "Spotify og cookies",
      "en": "Spotify and cookies"
    },
    "kind": "text",
    "body": {
      "da": [
        {
          "_type": "block",
          "_key": "paragraph",
          "style": "normal",
          "markDefs": [],
          "children": [
            {
              "_type": "span",
              "_key": "span0",
              "text": "Spotify-afspilleren indlæses automatisk på siden for den valgte artist. Spotify kan modtage tekniske oplysninger og anvende cookies eller lignende teknologier efter sine egne vilkår, også selvom du ikke starter musikken. Vi bruger ikke analyse- eller markedsføringscookies på siden. Cloudflare kan anvende teknisk nødvendige sikkerhedsmekanismer.",
              "marks": []
            }
          ]
        }
      ],
      "en": [
        {
          "_type": "block",
          "_key": "paragraph",
          "style": "normal",
          "markDefs": [],
          "children": [
            {
              "_type": "span",
              "_key": "span0",
              "text": "The Spotify player loads automatically on the page for the selected artist. Spotify may receive technical information and use cookies or similar technologies under its own terms, even if you do not start the music. We do not use analytics or marketing cookies on the site. Cloudflare may use essential security mechanisms.",
              "marks": []
            }
          ]
        }
      ]
    }
  },
  {
    "_type": "policySection",
    "_key": "policy-5",
    "title": {
      "da": "Dine rettigheder",
      "en": "Your rights"
    },
    "kind": "text",
    "body": {
      "da": [
        {
          "_type": "block",
          "_key": "paragraph",
          "style": "normal",
          "markDefs": [
            {
              "_type": "contactEmail",
              "_key": "link0"
            },
            {
              "_type": "link",
              "_key": "link1",
              "href": "https://www.datatilsynet.dk/"
            }
          ],
          "children": [
            {
              "_type": "span",
              "_key": "span0",
              "text": "Du kan bede om indsigt, berigtigelse eller sletning og i relevante tilfælde gøre indsigelse, få behandling begrænset eller få data udleveret. Skriv til ",
              "marks": []
            },
            {
              "_type": "span",
              "_key": "span1",
              "text": "john@mellowmanagement.com",
              "marks": [
                "link0"
              ]
            },
            {
              "_type": "span",
              "_key": "span2",
              "text": ". Du kan også klage til ",
              "marks": []
            },
            {
              "_type": "span",
              "_key": "span3",
              "text": "Datatilsynet",
              "marks": [
                "link1"
              ]
            },
            {
              "_type": "span",
              "_key": "span4",
              "text": ".",
              "marks": []
            }
          ]
        }
      ],
      "en": [
        {
          "_type": "block",
          "_key": "paragraph",
          "style": "normal",
          "markDefs": [
            {
              "_type": "contactEmail",
              "_key": "link0"
            },
            {
              "_type": "link",
              "_key": "link1",
              "href": "https://www.datatilsynet.dk/english"
            }
          ],
          "children": [
            {
              "_type": "span",
              "_key": "span0",
              "text": "You can ask to access, correct or erase your data, and where applicable object to or restrict processing or request data portability. Write to ",
              "marks": []
            },
            {
              "_type": "span",
              "_key": "span1",
              "text": "john@mellowmanagement.com",
              "marks": [
                "link0"
              ]
            },
            {
              "_type": "span",
              "_key": "span2",
              "text": ". You may also complain to the ",
              "marks": []
            },
            {
              "_type": "span",
              "_key": "span3",
              "text": "Danish Data Protection Agency",
              "marks": [
                "link1"
              ]
            },
            {
              "_type": "span",
              "_key": "span4",
              "text": ".",
              "marks": []
            }
          ]
        }
      ]
    }
  }
] as PolicySection[] };
