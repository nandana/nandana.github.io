// Open Source Contributions section. Groups and items appear in this order.
// Each item: title (bold), optional meta (place or year), optional description,
// a logo from public/images, and links shown as buttons.
const asfLogo = { src: "images/logo-asf.svg", alt: "The Apache Software Foundation" };
const rampartLogo = { src: "images/logo-apache-rampart.jpg", alt: "Apache Rampart" };
const axis2Logo = { src: "images/logo-apache-axis2.png", alt: "Apache Axis2" };
const marmottaLogo = { src: "images/logo-apache-marmotta.png", alt: "Apache Marmotta" };

export const openSource = [
  {
    title: "Apache committer and PMC roles",
    items: [
      {
        title: "Committer, Apache Web Services (2007)",
        description: "Elected for contributions to Apache Rampart and Apache WSS4J, including enabling Rampart to interoperate with Microsoft WCF for WS-Security 1.0, WS-Security 1.1, and WS-SecureConversation.",
        logo: asfLogo,
        links: [
          { label: "Committer vote", href: "https://www.mail-archive.com/rampart-dev@ws.apache.org/msg01768.html" }
        ]
      },
      {
        title: "PMC member, Apache Web Services (2008), Axis, and Incubator",
        logo: asfLogo,
        links: [
          { label: "Board minutes, Dec 2008", href: "https://www.apache.org/foundation/board/minutes/2008/board_minutes_2008_12_17.html" },
          { label: "ASF phonebook entry", href: "https://people.apache.org/phonebook.html?uid=nandana" }
        ]
      }
    ]
  },
  {
    title: "Apache Incubator",
    items: [
      {
        title: "Apache Marmotta, mentor and founding PMC member (2013)",
        description: "Mentored the open-source Linked Data platform through incubation and was appointed to its founding PMC when the ASF Board established the project in November 2013.",
        logo: marmottaLogo,
        links: [
          { label: "Mentor roster", href: "https://incubator.apache.org/projects/marmotta.html" },
          { label: "Graduation vote", href: "https://www.mail-archive.com/general@incubator.apache.org/msg42019.html" },
          { label: "Vote result", href: "https://www.mail-archive.com/general@incubator.apache.org/msg42111.html" },
          { label: "Board resolution", href: "https://apache.org/foundation/board/minutes/2013/board_minutes_2013_11_20.html" }
        ]
      },
      {
        title: "Apache Stonehenge, initial committer (2008)",
        description: "Named among the initial committers in the incubation proposal. The project entered the Incubator in November 2008.",
        logo: asfLogo,
        links: [
          { label: "Proposal", href: "https://cwiki.apache.org/confluence/display/INCUBATOR/StonehengeProposal" },
          { label: "Project history", href: "https://incubator.apache.org/projects/stonehenge.html", icon: "fa-solid fa-arrow-up-right-from-square" }
        ]
      }
    ]
  },
  {
    title: "Release management",
    items: [
      {
        title: "Apache Rampart 1.5 (February 2010)",
        description: "Added SAML 2.0 support, keystore caching, and signing or encrypting with multiple keys.",
        logo: rampartLogo,
        links: [
          { label: "Release vote", href: "https://www.mail-archive.com/rampart-dev@ws.apache.org/msg04489.html" },
          { label: "Vote result", href: "https://www.mail-archive.com/rampart-dev@ws.apache.org/msg04497.html" },
          { label: "Announcement", href: "https://www.mail-archive.com/axis-dev@ws.apache.org/msg48906.html" }
        ]
      },
      {
        title: "Apache Axis2/Java 1.4.1 (August 2008)",
        logo: axis2Logo,
        links: [
          { label: "Release-manager thread", href: "https://www.mail-archive.com/axis-dev@ws.apache.org/msg43138.html" },
          { label: "Release vote", href: "https://www.mail-archive.com/axis-dev@ws.apache.org/msg43555.html" },
          { label: "Release history", href: "https://cwiki.apache.org/confluence/pages/viewpage.action?pageId=37041566" }
        ]
      },
      {
        title: "Apache Rampart 1.4 (June 2008)",
        description: "Added encrypted-header support and broader WS-SecurityPolicy and WS-Trust support.",
        logo: rampartLogo,
        links: [
          { label: "Release vote", href: "https://www.mail-archive.com/rampart-dev@ws.apache.org/msg02983.html" },
          { label: "Announcement", href: "https://www.mail-archive.com/rampart-dev@ws.apache.org/msg03074.html" }
        ]
      }
    ]
  },
  {
    title: "ApacheCon talks",
    items: [
      {
        title: "ApacheCon Europe 2012",
        meta: "Sinsheim, Germany",
        description: "“Publishing Linked Data – Lessons Learned in Government” (Linked Data track)",
        logo: asfLogo,
        links: [
          { label: "Program announcement", href: "https://blogsarchive.apache.org/conferences/entry/the_apache_software_foundation_announces1" }
        ]
      },
      {
        title: "ApacheCon US 2009",
        meta: "Oakland, California",
        description: "“Securing Web Services with Apache WS”",
        logo: asfLogo,
        links: [
          { label: "Program", href: "https://archive.apachecon.com/c/acus2009/schedule/grid" }
        ]
      }
    ]
  }
];
