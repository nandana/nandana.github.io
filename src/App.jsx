import { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import {
  awards,
  education,
  experience,
  news,
  profile,
  patents,
  projects,
  publicationGroups,
  publications,
  services,
  sections,
  siteMeta,
  talks,
  teaching,
  workshopOrganizers,
  conferenceOrganizers,
  steeringCommittee,
  programmeCommittees
} from "./content/index.js";
import {
  fallbackTitleIcon,
  getActionIcon,
  newsIconMap,
  profileIconMap,
  publicationGroupIconMap,
  sectionIconMap,
  serviceIconMap,
  statusIconMap,
  venueIcon
} from "./icons.js";

const chartColors = ["#245a96", "#5c9ec6", "#7a8f36", "#b66f36", "#7b6fb3", "#3f8b78", "#b75d69"];
const githubStatsCacheTtl = 1000 * 60 * 5;
const conferenceNames = {
  AAAI: "Association for the Advancement of Artificial Intelligence Conference",
  ACL: "Annual Meeting of the Association for Computational Linguistics",
  CAEPIA: "Conference of the Spanish Association for Artificial Intelligence",
  CIKM: "ACM International Conference on Information and Knowledge Management",
  COLD: "International Workshop on Consuming Linked Data",
  "CODS-COMAD": "Joint International Conference on Data Science and Management of Data",
  "EDBT/ICDT": "EDBT/ICDT Joint Conference",
  EDBT: "International Conference on Extending Database Technology",
  EKAW: "International Conference on Knowledge Engineering and Knowledge Management",
  EMNLP: "Conference on Empirical Methods in Natural Language Processing",
  "EMNLP-IJCNLP": "Conference on Empirical Methods in Natural Language Processing and International Joint Conference on Natural Language Processing",
  ESWC: "Extended Semantic Web Conference",
  ICWE: "International Conference on Web Engineering",
  ICDM: "IEEE International Conference on Data Mining",
  INFORMATIK: "Annual Conference of the German Informatics Society",
  ISIC: "International Semantic Intelligence Conference",
  ISWC: "International Semantic Web Conference",
  IUI: "International Conference on Intelligent User Interfaces",
  "K-CAP": "International Conference on Knowledge Capture",
  KGSWC: "International Conference on Knowledge Graphs and Semantic Web",
  NAACL: "Annual Conference of the North American Chapter of the Association for Computational Linguistics",
  NLDB: "International Conference on Applications of Natural Language to Information Systems",
  PAKDD: "Pacific-Asia Conference on Knowledge Discovery and Data Mining",
  SAC: "ACM Symposium on Applied Computing",
  SDSVoc: "W3C Smart Descriptions and Smarter Vocabularies Workshop",
  "Semantic Web": "Semantic Web Journal",
  "Web Engineering": "Journal of Web Engineering",
  "Web Semantics": "Journal of Web Semantics",
  "Big Data and Cognitive Computing": "Big Data and Cognitive Computing",
  TEXT2KG: "Workshop on Knowledge Graph Generation from Text",
  VLDB: "International Conference on Very Large Data Bases",
  W3C: "World Wide Web Consortium",
  WWW: "ACM Web Conference",
  XBRL: "XBRL Academic Track",
  arXiv: "arXiv e-print repository",
  Other: "Other publications"
};

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);
  const githubStatsSources = useMemo(() => [publications, projects], []);
  const githubStats = useGithubRepoStats(githubStatsSources);
  const stats = useMemo(() => getPublicationStats(publications), []);
  const groups = useMemo(() => getPublicationGroups(publications, publicationGroups), []);
  const visibleSections = useMemo(() => sections.filter((section) => section.enabled !== false), []);
  const navItems = useMemo(
    () => visibleSections
      .filter((section) => section.nav !== false)
      .map((section) => ({ href: `#${section.id}`, label: section.nav ?? section.title })),
    [visibleSections]
  );

  const sectionContent = {
    about: (
      <div className="intro-copy">
        {profile.about.map((paragraph, index) => (
          <p key={index}>{renderRichText(paragraph)}</p>
        ))}
      </div>
    ),
    metrics: <MetricsDashboard stats={stats} />,
    news: (
      <div className="news-list">
        {news.map((item) => (
          <div className="news-row" key={item.date}>
            <time>{item.date}</time>
            <span className="news-icon" aria-hidden="true">
              <SemanticIcon icon={newsIconMap[item.icon] ?? newsIconMap.accepted} />
            </span>
            <span className="news-text">{item.href ? <a href={item.href} target="_blank" rel="noreferrer">{item.text}</a> : renderRichText(item.text)}</span>
            {item.href ? <i className="news-external fa-solid fa-arrow-up-right-from-square" aria-hidden="true" /> : null}
          </div>
        ))}
      </div>
    ),
    publications: <PublicationBrowser papers={publications} githubStats={githubStats} />,
    projects: <ProjectList items={projects} githubStats={githubStats} />,
    teaching: <CollapsibleSectionList label="mentoring activities" items={teaching} render={(items) => <MentoringList items={items} />} />,
    talks: <CollapsibleSectionList label="invited talks" items={talks} render={(items) => <Timeline items={items} />} />,
    education: <Timeline items={education} />,
    experience: <Timeline items={experience} />,
    awards: <CollapsibleSectionList label="awards" items={awards} render={(items) => <HonorsList items={items} />} />,
    patents: <PatentList items={patents} />,
    service: (
      <>
        <SteeringCommitteeList items={steeringCommittee} />
        <ConferenceOrganizerList items={conferenceOrganizers} />
        <WorkshopOrganizerList items={workshopOrganizers} />
        <ProgrammeCommitteeList items={programmeCommittees} />
        <ServiceList items={services} />
      </>
    )
  };

  useEffect(() => {
    document.title = siteMeta.title;
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event) => {
      setTheme(event.matches ? "dark" : "light");
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="site-header">
        <a className="brand" href="#about" aria-label={`${siteMeta.brand} home`}>
          <img
             src="images/athena-mark.svg"
            width="30"
            height="30"
            alt=""
            aria-hidden="true"
          />
          <span>{siteMeta.brand}</span>
        </a>
        <nav className={`primary-nav ${menuOpen ? "is-open" : ""}`} aria-label="Primary navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="theme-button"
            type="button"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            aria-pressed={theme === "dark"}
            title={theme === "dark" ? "Light mode" : "Dark mode"}
            onClick={() => setTheme((currentTheme) => currentTheme === "dark" ? "light" : "dark")}
          >
            <i className={theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon"} aria-hidden="true" />
          </button>
          <button
            className="menu-button"
            type="button"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            <i className={menuOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars"} aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className="page-shell">
        <aside className="profile-sidebar" aria-label="Profile">
          <SidebarProfile />
        </aside>

        <main className="content-main" id="main-content">
          {visibleSections.map((section) => {
            const content = sectionContent[section.id];
            if (!content) return null;

            return (
              <section className={`section${section.id === "about" ? " about-section" : ""}`} id={section.id} key={section.id}>
                <SectionTitle title={section.title} note={section.note} />
                {content}
              </section>
            );
          })}
        </main>
      </div>

      <footer className="site-footer">
        <div className="section footer-inner">
          <span>{siteMeta.brand}</span>
          <div className="footer-links">
            {siteMeta.repositoryUrl ? (
              <a href={siteMeta.repositoryUrl} target="_blank" rel="noreferrer">
                <i className="fa-brands fa-github" aria-hidden="true" />
                 <span>Built with Athena</span>
              </a>
            ) : null}
            {profile.email ? <a href={`mailto:${profile.email}`}>{profile.email}</a> : null}
          </div>
        </div>
      </footer>
    </>
  );
}

function SidebarProfile() {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const organizationText = [profile.role, profile.organization ? `at ${profile.organization}` : ""].filter(Boolean).join(" ");

  return (
    <div className="sidebar-card">
      <div className="sidebar-avatar-frame">
        {profile.avatar ? (
          <img
            className="sidebar-avatar"
            src={profile.avatar}
            width="192"
            height="192"
            decoding="async"
            fetchPriority="high"
            alt={profile.name}
          />
        ) : (
          <div className="sidebar-avatar sidebar-avatar-placeholder" aria-hidden="true">
            {getInitials(profile.name)}
          </div>
        )}
      </div>
      <div className="sidebar-identity">
        <h1>{profile.name}</h1>
        {profile.nativeName ? <p>{profile.nativeName}</p> : null}
        {organizationText ? <span>{organizationText}</span> : null}
      </div>
      <div className="sidebar-meta">
        {profile.location ? (
          <span>
            <i className="fa-solid fa-location-dot" aria-hidden="true" />
            {profile.location}
          </span>
        ) : null}
        {profile.email ? (
          <a href={`mailto:${profile.email}`}>
            <i className="fa-solid fa-envelope" aria-hidden="true" />
            {profile.email}
          </a>
        ) : null}
      </div>
      <ProfileLinks />

      <button
        className="sidebar-toggle"
        type="button"
        aria-controls="profile-details"
        aria-expanded={detailsOpen}
        onClick={() => setDetailsOpen((value) => !value)}
      >
        <span>Profile Details</span>
        <i className={`fa-solid fa-chevron-${detailsOpen ? "up" : "down"}`} aria-hidden="true" />
      </button>

      <div id="profile-details" className={`sidebar-collapsible${detailsOpen ? " is-open" : ""}`}>
        {profile.focus?.length ? (
          <div className="sidebar-block">
            <h2>Research Focus</h2>
            <TagList items={profile.focus} className="focus-row" />
          </div>
        ) : null}

        {news.length ? (
          <div className="sidebar-block">
            <h2>Recent News</h2>
            <div className="sidebar-news">
              {news.slice(0, 4).map((item) => (
                <div className="sidebar-news-item" key={item.date}>
                  <time>{item.date}</time>
                  <span className="sidebar-news-text">
                    <span className="sidebar-news-icon" aria-hidden="true">
                      <SemanticIcon icon={newsIconMap[item.icon] ?? newsIconMap.accepted} />
                    </span>
                    <span>{item.href ? <a href={item.href} target="_blank" rel="noreferrer">{item.text}</a> : renderRichText(item.text)}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function MetricsDashboard({ stats }) {
  return (
    <div className="metrics-dashboard">
      <div className="metric-card-grid">
        <MetricCard label="Publications" value={stats.total} />
        <MetricCard label="Selected" value={stats.featured} />
        <MetricCard label="Open Artifacts" value={stats.openArtifacts} />
        <MetricCard label="Research Areas" value={stats.byGroup.length} />
      </div>
      <div className="chart-grid">
        <HorizontalBarChart title="Publications by Year" data={stats.byYear} />
        <DonutChart title="Research Areas" data={stats.byGroup} />
        <HorizontalBarChart title="Publication Types" data={stats.byType} />
        <HorizontalBarChart title="Venue Families" data={stats.byVenueFamily} />
      </div>
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="metric-card">
      <strong>{formatNumber(value)}</strong>
      <span>{label}</span>
    </div>
  );
}

function HorizontalBarChart({ title, data }) {
  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <article className="chart-card">
      <h3>{title}</h3>
      <div className="bar-chart">
        {data.map((item, index) => {
          const percent = Math.max((item.value / max) * 100, 4);
          return (
            <div className="bar-row" key={item.label}>
              <span className="bar-label">{item.label}</span>
              <span
                className="bar-track"
                style={{ "--bar-value": `${percent}%`, "--chart-color": chartColors[index % chartColors.length] }}
              >
                <span className="bar-fill" />
              </span>
              <span className="bar-value">{item.value}</span>
            </div>
          );
        })}
      </div>
    </article>
  );
}

function DonutChart({ title, data }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let start = 0;
  const gradient = total
    ? `conic-gradient(${data
        .map((item, index) => {
          const end = start + (item.value / total) * 360;
          const segment = `${chartColors[index % chartColors.length]} ${start}deg ${end}deg`;
          start = end;
          return segment;
        })
        .join(", ")})`
    : "var(--surface-strong)";

  return (
    <article className="chart-card chart-card-donut">
      <h3>{title}</h3>
      <div className="donut-layout">
        <div className="donut-chart" style={{ "--donut-gradient": gradient }}>
          <span>{total}</span>
        </div>
        <div className="chart-legend">
          {data.map((item, index) => (
            <span key={item.label}>
              <i style={{ "--chart-color": chartColors[index % chartColors.length] }} aria-hidden="true" />
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function PublicationGroup({ title, papers, githubStats }) {
  const highlighted = papers.filter((paper) => paper.featured);
  const compact = papers.filter((paper) => !paper.featured);

  return (
    <section className="publication-group" aria-labelledby={`group-${slugify(title)}`}>
      <h3 id={`group-${slugify(title)}`}>
        <TitleIcon icon={publicationGroupIconMap[title] ?? fallbackTitleIcon} compact />
        <span>{title}</span>
      </h3>
      {highlighted.length ? (
        <div className="highlight-list">
          {highlighted.map((paper) => (
            <FeaturedPaper key={paper.title} paper={paper} githubStats={githubStats} />
          ))}
        </div>
      ) : null}
      {compact.length ? (
        <div className="compact-paper-list">
          {compact.map((paper) => (
            <CompactPaper key={paper.title} paper={paper} githubStats={githubStats} />
          ))}
        </div>
      ) : null}
    </section>
  );
}

function PublicationBrowser({ papers, githubStats }) {
  const [venueFilter, setVenueFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const publicationRows = papers.map((paper) => ({ paper, venue: paper.conference || "Other" }));
  const venueCounts = countBy(publicationRows, (row) => row.venue);
  const venues = venueCounts.sort((a, b) => b.value - a.value || a.label.localeCompare(b.label)).map((item) => item.label);
  const researchTypes = Array.from(new Set(papers.map((paper) => paper.researchType || "Research"))).sort();
  const years = Array.from(new Set(papers.map((paper) => paper.year).filter(Boolean))).sort((a, b) => Number(b) - Number(a));
  const yearCounts = countBy(papers, (paper) => paper.year);
  const filtered = publicationRows.filter(({ paper, venue }) =>
    (venueFilter === "All" || venue === venueFilter)
    && (yearFilter === "All" || String(paper.year) === String(yearFilter))
  ).map(({ paper }) => paper);

  return (
    <>
      <ScholarMetrics />
      <div className="publication-filters" aria-label="Publication filters">
        <FilterRow label="Conference" value={venueFilter} options={venues} counts={venueCounts} total={papers.length} onChange={(value) => { setVenueFilter(value); setDetailsOpen(true); }} />
        <FilterRow label="Year" value={yearFilter} options={years} counts={yearCounts} total={papers.length} onChange={(value) => { setYearFilter(value); setDetailsOpen(true); }} />
      </div>
      <div className="details-toggle-row">
        <button
          className="publication-details-toggle workshop-organizer-toggle"
          type="button"
          aria-expanded={detailsOpen}
          onClick={() => setDetailsOpen((value) => !value)}
        >
          <span>{detailsOpen ? "Hide publication list" : `Show the list of ${filtered.length} publications`}</span>
          <i className={`fa-solid fa-chevron-${detailsOpen ? "up" : "down"}`} aria-hidden="true" />
        </button>
      </div>
      {detailsOpen ? (
        <>
          <p className="publication-filter-summary">
            Showing results for <strong>{formatPublicationFilterSummary(venueFilter, yearFilter)}</strong>
          </p>
          <div className="compact-paper-list publication-flat-list">
            {filtered.map((paper) => <CompactPaper key={`${paper.title}-${paper.year}`} paper={paper} githubStats={githubStats} />)}
          </div>
          {!filtered.length ? <p className="publication-empty">No publications match the selected filters.</p> : null}
        </>
      ) : null}
    </>
  );
}

function ScholarMetrics() {
  return (
    <div className="scholar-metrics" aria-label="Google Scholar metrics">
      <div className="scholar-metrics-heading">
        <a className="scholar-metrics-link" href="https://scholar.google.com/citations?user=obOPbVQAAAAJ&hl=en" target="_blank" rel="noreferrer">
          <i className="ai ai-google-scholar" aria-hidden="true" />
          <span>Google Scholar</span>
        </a>
        <small>Updated Aug 18, 2026</small>
      </div>
      <div className="scholar-metrics-values">
        <MetricStat label="Citations" value="2,120" />
        <MetricStat label="h-index" value="24" />
        <MetricStat label="i10-index" value="49" />
      </div>
    </div>
  );
}

function MetricStat({ label, value }) {
  return (
    <div className="scholar-metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function formatPublicationFilterSummary(venueFilter, yearFilter) {
  const conference = venueFilter === "All" ? "all conferences and venues" : conferenceNames[venueFilter] ?? venueFilter;
  if (yearFilter === "All") return conference;
  return `${conference} in ${yearFilter}`;
}

function FilterRow({ label, value, options, counts, total, onChange }) {
  return (
    <div className="publication-filter-row">
      <span>{label}</span>
      <div className="publication-filter-options" role="listbox" aria-label={`Filter by ${label}`}>
        {["All", ...options].map((option) => (
          <button key={option} type="button" title={label === "Conference" ? conferenceNames[option] ?? option : option} className={value === option ? "is-active" : ""} aria-selected={value === option} onClick={() => onChange(option)}>
            <span>{option}</span>
            <small>({option === "All" ? total : counts.find((item) => item.label === option)?.value ?? 0})</small>
          </button>
        ))}
      </div>
    </div>
  );
}

function PublicationVisualization({ papers }) {
  const sceneOrder = ["timeline", "venues", "topics", "network"];
  const [scene, setScene] = useState("timeline");
  const [playing, setPlaying] = useState(true);
  const years = Array.from(new Set(papers.map((paper) => Number(paper.year)).filter(Boolean))).sort((a, b) => a - b);
  const maxYearCount = Math.max(...years.map((year) => papers.filter((paper) => Number(paper.year) === year).length), 1);
  const venues = countBy(papers, (paper) => shortenVenue(paper.venue)).sort((a, b) => b.value - a.value).slice(0, 8);
  const topics = countBy(papers, (paper) => paper.group || "Other").sort((a, b) => b.value - a.value);
  const collaborators = getCollaborators(papers).slice(0, 18);

  useEffect(() => {
    if (!playing) return undefined;
    const timer = window.setInterval(() => {
      setScene((current) => sceneOrder[(sceneOrder.indexOf(current) + 1) % sceneOrder.length]);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [playing]);

  return (
    <div className="publication-visualization">
      <div className="publication-visualization-header">
        <div>
          <span className="visualization-eyebrow">Publication Atlas</span>
          <h3>{scene === "network" ? "A growing network of collaborations" : scene === "venues" ? "Where the work appears" : scene === "topics" ? "Research across connected themes" : "A publication timeline"}</h3>
        </div>
        <span className="visualization-count">Scene {sceneOrder.indexOf(scene) + 1} · {papers.length} records</span>
      </div>
      <div className="publication-visualization-stage">
        {scene === "timeline" ? <TimelineScene years={years} papers={papers} maxYearCount={maxYearCount} /> : null}
        {scene === "venues" ? <VenuesScene venues={venues} /> : null}
        {scene === "topics" ? <TopicsScene topics={topics} /> : null}
        {scene === "network" ? <CollaborationScene collaborators={collaborators} /> : null}
      </div>
      <div className="publication-visualization-controls" role="tablist" aria-label="Publication visualization views">
        <button type="button" className="visualization-transport" onClick={() => setPlaying((value) => !value)}>
          <span aria-hidden="true">{playing ? "||" : "▶"}</span> {playing ? "Pause" : "Play"}
        </button>
        <button type="button" className="visualization-transport" onClick={() => { setPlaying(false); setScene("timeline"); }}>
          <span aria-hidden="true">■</span> Stop
        </button>
        {[
          ["timeline", "Timeline"],
          ["venues", "Venues"],
          ["topics", "Topics"],
          ["network", "Network"]
        ].map(([value, label]) => (
          <button key={value} type="button" role="tab" aria-selected={scene === value} className={scene === value ? "is-active" : ""} onClick={() => { setPlaying(false); setScene(value); }}>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function TimelineScene({ years, papers, maxYearCount }) {
  const width = 900;
  const height = 230;
  const left = 48;
  const right = width - 24;
  const baseline = 174;
  const step = years.length > 1 ? (right - left) / (years.length - 1) : 0;

  return (
    <svg className="publication-visualization-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Publications by year">
      <line className="visual-axis" x1={left} x2={right} y1={baseline} y2={baseline} />
      {years.map((year, index) => {
        const count = papers.filter((paper) => Number(paper.year) === year).length;
        const x = years.length > 1 ? left + index * step : (left + right) / 2;
        const barHeight = 28 + (count / maxYearCount) * 92;
        return (
          <g key={year} className="visual-year">
            <line x1={x} x2={x} y1={baseline} y2={baseline - barHeight} />
            <circle className="visual-pulse" cx={x} cy={baseline - barHeight} r={7 + count * 0.35} />
            <text x={x} y={baseline + 25} textAnchor="middle">{year}</text>
            <text className="visual-value" x={x} y={baseline - barHeight - 16} textAnchor="middle">{count}</text>
          </g>
        );
      })}
      <text className="visual-caption" x={left} y="24">Number of publications</text>
    </svg>
  );
}

function VenuesScene({ venues }) {
  const max = Math.max(...venues.map((item) => item.value), 1);

  return (
    <div className="visual-bars">
      {venues.map((item, index) => (
        <div className="visual-bar-row" key={item.label}>
          <span title={item.label}>{item.label}</span>
          <div className="visual-bar-track"><i style={{ width: `${Math.max((item.value / max) * 100, 8)}%`, animationDelay: `${index * 45}ms` }} /></div>
          <b>{item.value}</b>
        </div>
      ))}
    </div>
  );
}

function TopicsScene({ topics }) {
  const colors = ["#60a5fa", "#2dd4bf", "#fbbf24", "#c084fc", "#fb7185"];
  return (
    <div className="visual-topic-cloud">
      {topics.map((item, index) => (
        <span key={item.label} style={{ "--topic-color": colors[index % colors.length], "--topic-size": `${Math.min(1.75, 0.82 + item.value / 45)}rem` }}>
          {item.label}<small>{item.value}</small>
        </span>
      ))}
    </div>
  );
}

function CollaborationScene({ collaborators }) {
  const width = 900;
  const height = 230;
  const center = { x: width / 2, y: height / 2 };
  const max = Math.max(...collaborators.map((item) => item.value), 1);

  return (
    <svg className="publication-visualization-svg collaboration-scene" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Publication coauthor network">
      {collaborators.map((item, index) => {
        const angle = (index / collaborators.length) * Math.PI * 2 - Math.PI / 2;
        const radius = 74 + (index % 3) * 26;
        const x = center.x + Math.cos(angle) * radius * 2.15;
        const y = center.y + Math.sin(angle) * radius * 0.72;
        return <line key={`line-${item.label}`} className="collaboration-link" x1={center.x} y1={center.y} x2={x} y2={y} style={{ opacity: 0.24 + item.value / max * 0.5, animationDelay: `${index * 65}ms` }} />;
      })}
      <circle className="collaboration-center" cx={center.x} cy={center.y} r="28" />
      <text className="collaboration-center-label" x={center.x} y={center.y + 4} textAnchor="middle">NM</text>
      {collaborators.map((item, index) => {
        const angle = (index / collaborators.length) * Math.PI * 2 - Math.PI / 2;
        const radius = 74 + (index % 3) * 26;
        const x = center.x + Math.cos(angle) * radius * 2.15;
        const y = center.y + Math.sin(angle) * radius * 0.72;
        return <g key={item.label} className="collaboration-node" style={{ animationDelay: `${index * 65}ms` }}><circle cx={x} cy={y} r={Math.min(13, 4 + item.value * 0.8)} /><title>{`${item.label}: ${item.value} coauthored publications`}</title></g>;
      })}
      <text className="visual-caption" x="20" y="24">Frequent coauthors are shown as larger nodes</text>
    </svg>
  );
}

function FeaturedPaper({ paper, githubStats }) {
  return (
    <article className="featured-paper">
      <PublicationVisual paper={paper} />
      <div className="featured-paper-copy">
        <PublicationMeta paper={paper} />
        <h4>{paper.title}</h4>
        <p className="authors">{highlightAuthors(paper.authors)}</p>
        {paper.summary ? <p>{paper.summary}</p> : null}
        {paper.tags?.length ? <TagList items={paper.tags} className="paper-tags" /> : null}
        <ActionLinks links={paper.links} paper={paper} githubStats={githubStats} />
      </div>
    </article>
  );
}

function PublicationVisual({ paper }) {
  if (!paper.image) {
    return (
      <div className="paper-figure paper-figure-fallback">
        <span>{paper.group ?? paper.type ?? "Research"}</span>
      </div>
    );
  }

  return (
    <div className="paper-figure">
      <picture>
        {isRasterImage(paper.image) ? <source srcSet={toWebpPath(paper.image)} type="image/webp" /> : null}
        <img src={paper.image} alt={`${paper.title} visual summary`} loading="lazy" decoding="async" />
      </picture>
    </div>
  );
}

function CompactPaper({ paper, githubStats }) {
  return (
    <article className="compact-paper-row">
      <PublicationMeta paper={paper} compact />
      <div className="compact-main">
        <p className="publication-citation">{formatChicagoCitation(paper)}</p>
        {paper.tags?.length ? <TagList items={paper.tags.slice(0, 4)} className="paper-tags" /> : null}
      </div>
      <ActionLinks links={paper.links} paper={paper} githubStats={githubStats} />
    </article>
  );
}

function formatChicagoCitation(paper) {
  const authors = formatChicagoAuthors(paper.authors);
  const venue = paper.venue ? ` ${paper.venue}` : "";
  const year = paper.year ? ` (${paper.year})` : "";
  return <>{authors}. "{paper.title}."{venue}{year}.</>;
}

function formatChicagoAuthors(authors = "") {
  const names = authors.split(/,\s*/).filter(Boolean);
  if (!names.length) return "";
  if (names.length === 1) return names[0];

  const [first, ...rest] = names;
  const firstParts = first.trim().split(/\s+/);
  const lastName = firstParts.pop();
  const invertedFirst = `${lastName}, ${firstParts.join(" ")}`;
  const body = [invertedFirst, ...rest];
  if (body.length === 2) return [highlightCitationName(body[0]), " and ", highlightCitationName(body[1])];
  return body.flatMap((name, index) => [
    index ? ", " : "",
    index === body.length - 1 ? "and " : "",
    highlightCitationName(name)
  ]);
}

function highlightCitationName(name) {
  const names = profile.highlightNames?.length ? profile.highlightNames : [profile.name].filter(Boolean);
  if (!names.some((highlightName) => name.includes(highlightName))) return name;
  return <strong>{name}</strong>;
}

function PublicationMeta({ paper, compact = false }) {
  const className = compact ? "compact-venue" : "paper-venue-line";
  const venueLabel = compact ? `${paper.conference || "Other"}${paper.year ? ` ${paper.year}` : ""}` : paper.venue;
  const displayVenue = paper.venue === "arXiv" ? "arXiv" : venueLabel;

  return (
    <span className={className}>
      <SemanticIcon icon={venueIcon} />
      <span>{displayVenue}</span>
      {paper.year && !displayVenue.includes(String(paper.year)) ? <time>{paper.year}</time> : null}
      {compact && paper.researchType ? <span className="publication-type-badge">{paper.researchType}</span> : null}
      {!compact && paper.type ? <span>{paper.type}</span> : null}
    </span>
  );
}

function ProjectList({ items, githubStats }) {
  return (
    <div className="project-grid" role="region" aria-label="Projects" tabIndex={0}>
      {items.map((project) => (
        <article className="project-card" key={project.title}>
          <div className="project-card-head">
            <h3>{project.title}</h3>
            {project.status ? (
              <span className="project-status">
                <SemanticIcon icon={statusIconMap[project.status] ?? fallbackTitleIcon} />
                {project.status}
              </span>
            ) : null}
          </div>
          <p>{project.summary}</p>
          {project.tags?.length ? <TagList items={project.tags} className="project-tags" /> : null}
          <ActionLinks links={project.links} githubStats={githubStats} />
        </article>
      ))}
    </div>
  );
}

function ProfileLinks() {
  return (
    <div className="profile-links">
      {profile.links.map((link) => (
        <a key={link.label} href={link.href} target="_blank" rel="noreferrer" aria-label={link.label} title={link.label}>
          <i className={profileIconMap[link.icon] ?? profileIconMap.Website} aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}

function SectionTitle({ title, note }) {
  return (
    <div className="section-title">
      <h2>
        <TitleIcon icon={sectionIconMap[title] ?? fallbackTitleIcon} />
        <span>{title}</span>
      </h2>
      {note ? <p>{note}</p> : null}
    </div>
  );
}

function TitleIcon({ icon, compact = false }) {
  return (
    <span className={compact ? "title-icon title-icon-compact" : "title-icon"} aria-hidden="true">
      <SemanticIcon icon={icon} />
    </span>
  );
}

function SemanticIcon({ icon }) {
  return <Icon className="semantic-icon" icon={icon} aria-hidden="true" />;
}

function TagList({ items, className }) {
  return (
    <div className={className}>
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
}

function ActionLinks({ links, paper, githubStats = {} }) {
  if (!links?.length) return null;

  return (
    <div className="action-links">
      {links.map((link) => {
        const githubRepo = getGithubRepo(link.href);
        const showStats = Boolean(githubRepo && shouldShowGithubStats(link));
        const stats = showStats
          ? mergeGithubStats(githubStats[githubRepo], getGithubStatsFallback(link))
          : null;

        return (
          <a key={`${link.label}-${link.href}`} href={link.href} target="_blank" rel="noreferrer">
            <i className={getActionIcon(link)} aria-hidden="true" />
            <span>{link.label}</span>
            {showStats ? <GithubRepoStats stats={stats} /> : null}
          </a>
        );
      })}
      <CitationButton paper={paper} />
    </div>
  );
}

function CitationButton({ paper }) {
  const [copied, setCopied] = useState(false);

  if (!paper) return null;

  const handleCopy = async () => {
    const citation = buildBibtex(paper);

    try {
      await navigator.clipboard.writeText(citation);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button className="citation-button" type="button" onClick={handleCopy} title="Copy BibTeX citation">
      <i className="fa-solid fa-quote-right" aria-hidden="true" />
      <span>{copied ? "Copied" : "Cite"}</span>
    </button>
  );
}

function buildBibtex(paper) {
  const key = `${slugify((paper.authors ?? "").split(",")[0] ?? "publication")}${paper.year ?? ""}`;
  const type = paper.type?.toLowerCase().includes("journal") ? "article" : "inproceedings";

  return `@${type}{${key},
  author = {${paper.authors ?? ""}},
  title = {${paper.title}},
  venue = {${paper.venue ?? ""}},
  year = {${paper.year ?? ""}}
}`;
}

function GithubRepoStats({ stats }) {
  if (!stats || typeof stats.stars !== "number") return null;

  return (
    <span className="repo-stats">
      <span className="repo-stat" title={`${stats.stars.toLocaleString()} GitHub stars`}>
        <i className="fa-solid fa-star" aria-hidden="true" />
        {formatGithubCount(stats.stars)}
      </span>
    </span>
  );
}

function Timeline({ items }) {
  return (
    <div className="timeline">
      {items.map((item, index) => {
        const logos = item.logos ?? (item.logo ? [{ src: item.logo, alt: item.logoAlt }] : []);
        const countries = item.countries ?? (item.countryFlag ? [{ name: item.country, flag: item.countryFlag }] : []);

        return (
        <div className={`timeline-item${logos.length || item.logoText ? " has-logo" : ""}${logos.length > 1 ? " has-multiple-logos" : ""}`} key={`${item.period}-${item.title}-${index}`}>
          {logos.length || item.logoText ? (
            <div className="timeline-identity">
              <div className="timeline-logos">
                {logos.map((logo) => <div className="timeline-logo" key={logo.src}><img src={logo.src} alt={logo.alt} /></div>)}
                {!logos.length && item.logoText ? <div className="timeline-logo"><span>{item.logoText}</span></div> : null}
              </div>
              <div className="timeline-countries">
                {countries.map((country) => <span className="timeline-country" title={country.name} aria-label={country.name} key={country.name}>{country.flag}</span>)}
              </div>
            </div>
          ) : null}
          <div className="timeline-main">
            <strong>{item.title}</strong>
            {item.href ? (
              <a className="timeline-place" href={item.href} target="_blank" rel="noreferrer">
                {renderRichText(item.place)}
              </a>
            ) : (
              <span className="timeline-place">{renderRichText(item.place)}</span>
            )}
            {item.detail ? <p>{renderRichText(item.detail)}</p> : null}
            {item.links?.length ? (
              <div className="action-links">
                {item.links.map((link) => <a href={link.href} target="_blank" rel="noreferrer" key={link.label}><i className="fa-solid fa-certificate" aria-hidden="true" /><span>{link.label}</span></a>)}
              </div>
            ) : null}
          </div>
          <div className="timeline-dates">
            <time>{item.period}</time>
            {item.duration ? <span className="timeline-duration"><i className="fa-solid fa-clock" aria-hidden="true" />{item.duration}</span> : null}
          </div>
        </div>
        );
      })}
    </div>
  );
}

function HonorsList({ items }) {
  return (
    <div className="honor-list">
      {items.map((item) => {
        const { title, year } = splitTrailingYear(item);

        return (
          <div className="honor-row" key={item}>
            <span>{title}</span>
            {year ? <time>{year}</time> : null}
          </div>
        );
      })}
    </div>
  );
}

function MentoringList({ items }) {
  return (
    <div className="mentoring-list">
      {items.map((item) => (
        <article className="mentoring-card" key={`${item.title}-${item.period}`}>
          <div className={`mentoring-card-logos${item.logos?.length > 1 ? " has-multiple" : ""}`}>
            {(item.logos ?? [{ src: item.logo, alt: item.logoAlt }]).map((logo) => (
              <div className="mentoring-card-logo" key={logo.src}>
                <img src={logo.src} alt={logo.alt} />
              </div>
            ))}
          </div>
          <div className="mentoring-card-content">
            <div className="mentoring-card-heading">
              <div>
                <span className="mentoring-organization">{item.organization ?? item.place}</span>
                <h3>{item.title}</h3>
              </div>
              <time>{item.period}</time>
            </div>
            {item.project ? (
              <p className="mentoring-project">
                <strong>Project</strong>
                {item.project.href ? <a href={item.project.href} target="_blank" rel="noreferrer">{item.project.label}</a> : <span>{item.project.label}</span>}
              </p>
            ) : null}
            {item.detail ? <p className="mentoring-detail">{item.detail}</p> : null}
            {item.students?.length || item.links?.length ? (
              <>
                {item.students?.length ? (
                  <div className="mentoring-actions-row">
                    <strong>{item.students.length === 1 ? "Mentee" : "Mentees"}</strong>
                    <div className="action-links">
                      {item.students.map((student) => <a href={student.href} target="_blank" rel="noreferrer" key={student.name}><i className="fa-solid fa-user" aria-hidden="true" /><span>{student.name}</span></a>)}
                    </div>
                  </div>
                ) : null}
                {item.links?.length ? (
                  <div className="action-links">
                    {item.links.map((link) => <a href={link.href} target="_blank" rel="noreferrer" key={link.label}><i className={link.icon ?? "fa-solid fa-certificate"} aria-hidden="true" /><span>{link.label}</span></a>)}
                  </div>
                ) : null}
              </>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}

function PatentList({ items }) {
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <>
      <div className="details-toggle-row">
        <button
          className="publication-details-toggle workshop-organizer-toggle"
          type="button"
          aria-expanded={detailsOpen}
          onClick={() => setDetailsOpen((value) => !value)}
        >
          <span>{detailsOpen ? "Hide patent list" : `Show the list of ${items.length} patents`}</span>
          <i className={`fa-solid fa-chevron-${detailsOpen ? "up" : "down"}`} aria-hidden="true" />
        </button>
      </div>
      {detailsOpen ? <div className="patent-list">
      {items.map((patent) => (
        <article className="patent-card" key={patent.number}>
          <div className="patent-card-copy">
            <span className="patent-kicker">{patent.country} Patent</span>
            <h3>{patent.title}</h3>
            <p className="patent-inventors">
              <strong>{patent.number}</strong> {patent.inventors} · {patent.assignee}
            </p>
            <div className="patent-dates">
              <span>Priority <time>{patent.priority}</time></span>
              <span>Filed <time>{patent.filed}</time></span>
              {patent.granted ? <span>Granted <time>{patent.granted}</time></span> : null}
              <span>Published <time>{patent.published}</time></span>
            </div>
            <p className="patent-summary">{patent.summary}</p>
            <div className="action-links">
              <a href={patent.href} target="_blank" rel="noreferrer">
                <i className="fa-solid fa-file-lines" aria-hidden="true" />
                <span>Google Patents</span>
              </a>
            </div>
          </div>
        </article>
      ))}
      </div> : null}
    </>
  );
}

function ServiceList({ items }) {
  return (
    <div className="service-groups">
      {items.map((group) => (
        <section className="service-group" key={group.category}>
          <h3>
            <TitleIcon icon={serviceIconMap[group.category] ?? fallbackTitleIcon} compact />
            <span>{group.category}</span>
          </h3>
          <div className="service-chip-grid">
            {group.items.map((item) => {
              const { title, year } = splitServiceYears(item);

              return (
                <span className="service-chip" key={item}>
                  <span>{title}</span>
                  {year ? <time>{year}</time> : null}
                </span>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

function WorkshopOrganizerList({ items }) {
  const [filter, setFilter] = useState("All");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const orderedItems = [...items].sort((a, b) => Number(b.year) - Number(a.year));
  const acronyms = Array.from(new Set(orderedItems.map((item) => item.acronym?.replace(/\s+20\d{2}$/, "")).filter(Boolean))).sort();
  const visibleItems = orderedItems.filter((item) => filter === "All" || item.acronym?.replace(/\s+20\d{2}$/, "") === filter);

  return (
    <div className="workshop-organizer-list">
      <div className="service-subsection-title">
        <h3>Workshop Organization</h3>
        <span>Co-chair of {items.length} international workshops related to AI, Knowledge Graphs, and NLP</span>
      </div>
      <div className="workshop-organizer-filters" aria-label="Workshop organizer filters">
        {["All", ...acronyms].map((acronym) => (
            <button key={acronym} type="button" className={filter === acronym ? "is-active" : ""} onClick={() => { setFilter(acronym); setDetailsOpen(true); }}>
            {acronym} ({acronym === "All" ? items.length : items.filter((item) => item.acronym?.replace(/\s+20\d{2}$/, "") === acronym).length})
          </button>
        ))}
      </div>
      <button
        className="workshop-organizer-toggle"
        type="button"
        aria-expanded={detailsOpen}
        onClick={() => setDetailsOpen((value) => !value)}
      >
        <span>{detailsOpen ? "Hide workshop list" : `Show ${visibleItems.length} workshops`}</span>
        <i className={`fa-solid fa-chevron-${detailsOpen ? "up" : "down"}`} aria-hidden="true" />
      </button>
      {detailsOpen ? visibleItems.map((item) => (
        <article className="workshop-organizer-card" key={`${item.title}-${item.year}-${item.conference}`}>
          <h3><span className="workshop-acronym">{item.acronym || item.conferenceAcronym}</span> <span>{item.title}</span></h3>
          <div className="workshop-organizer-meta">
            <span><strong>{item.role}</strong></span>
            <span><strong>Conference</strong> {item.conference}</span>
            <span><strong>Year</strong> {item.year}</span>
          </div>
          {item.proceedingsCitation ? <p>{item.proceedingsCitation}</p> : null}
          <div className="action-links">
            {item.website ? <a href={item.website} target="_blank" rel="noreferrer"><i className="fa-solid fa-globe" aria-hidden="true" /><span>Website</span></a> : null}
            {item.proceedingsUrl ? <a href={item.proceedingsUrl} target="_blank" rel="noreferrer"><i className="fa-solid fa-file-lines" aria-hidden="true" /><span>Proceedings</span></a> : null}
          </div>
        </article>
      )) : null}
    </div>
  );
}

function CollapsibleSectionList({ label, items, render }) {
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <>
      <div className="details-toggle-row">
        <button className="publication-details-toggle workshop-organizer-toggle" type="button" aria-expanded={detailsOpen} onClick={() => setDetailsOpen((value) => !value)}>
          <span>{detailsOpen ? `Hide ${label}` : `Show ${items.length} ${label}`}</span>
          <i className={`fa-solid fa-chevron-${detailsOpen ? "up" : "down"}`} aria-hidden="true" />
        </button>
      </div>
      {detailsOpen ? render(items) : null}
    </>
  );
}

function ServiceAcronymFilters({ items, filter, onChange, acronyms }) {
  return (
    <div className="workshop-organizer-filters" aria-label="Service filters">
      {["All", ...acronyms].map((acronym) => (
        <button key={acronym} type="button" className={filter === acronym ? "is-active" : ""} onClick={() => onChange(acronym)}>
          {acronym} ({acronym === "All" ? items.length : items.filter((item) => item.acronym.replace(/\s+20\d{2}$/, "") === acronym).length})
        </button>
      ))}
    </div>
  );
}

function ConferenceOrganizerList({ items }) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const orderedItems = [...items].sort((a, b) => Number(b.year) - Number(a.year));
  const [filter, setFilter] = useState("All");
  const acronyms = Array.from(new Set(items.map((item) => item.acronym.replace(/\s+20\d{2}$/, "")))).sort();
  const visibleItems = orderedItems.filter((item) => filter === "All" || item.acronym.replace(/\s+20\d{2}$/, "") === filter);

  return (
    <div className="workshop-organizer-list conference-organizer-list">
      <div className="service-subsection-title">
        <h3>Conference Organization Committee (OC)</h3>
        <span>{items.length} conferences</span>
      </div>
      <ServiceAcronymFilters items={items} filter={filter} onChange={(value) => { setFilter(value); setDetailsOpen(true); }} acronyms={acronyms} />
      <div className="details-toggle-row">
        <button className="publication-details-toggle workshop-organizer-toggle" type="button" aria-expanded={detailsOpen} onClick={() => setDetailsOpen((value) => !value)}>
          <span>{detailsOpen ? "Hide conference list" : `Show ${items.length} conferences`}</span>
          <i className={`fa-solid fa-chevron-${detailsOpen ? "up" : "down"}`} aria-hidden="true" />
        </button>
      </div>
      {detailsOpen ? visibleItems.map((item) => (
        <article className="workshop-organizer-card" key={`${item.acronym}-${item.year}`}>
          <h3><span className="workshop-acronym">{item.acronym}</span> <span>{item.title}</span></h3>
          <div className="workshop-organizer-meta">
            <span><strong>{item.role}</strong></span>
            <span><strong>Year</strong> {item.year}</span>
          </div>
          <div className="action-links">
            <a href={item.website} target="_blank" rel="noreferrer"><i className="fa-solid fa-globe" aria-hidden="true" /><span>Website</span></a>
            <a href={item.proceedingsUrl} target="_blank" rel="noreferrer"><i className="fa-solid fa-file-lines" aria-hidden="true" /><span>Proceedings</span></a>
          </div>
        </article>
      )) : null}
    </div>
  );
}

function SteeringCommitteeList({ items }) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const orderedItems = [...items].sort((a, b) => Number(b.year) - Number(a.year));
  const [filter, setFilter] = useState("All");
  const acronyms = Array.from(new Set(items.map((item) => item.acronym.replace(/\s+20\d{2}$/, "")))).sort();
  const visibleItems = orderedItems.filter((item) => filter === "All" || item.acronym.replace(/\s+20\d{2}$/, "") === filter);

  return (
    <div className="workshop-organizer-list conference-organizer-list">
      <div className="service-subsection-title">
        <h3>Conference Steering Committee (SC)</h3>
        <span>{items.length} conferences</span>
      </div>
      <ServiceAcronymFilters items={items} filter={filter} onChange={(value) => { setFilter(value); setDetailsOpen(true); }} acronyms={acronyms} />
      <div className="details-toggle-row">
        <button className="publication-details-toggle workshop-organizer-toggle" type="button" aria-expanded={detailsOpen} onClick={() => setDetailsOpen((value) => !value)}>
          <span>{detailsOpen ? "Hide steering committee list" : `Show ${items.length} conferences`}</span>
          <i className={`fa-solid fa-chevron-${detailsOpen ? "up" : "down"}`} aria-hidden="true" />
        </button>
      </div>
      {detailsOpen ? visibleItems.map((item) => (
        <article className="workshop-organizer-card" key={`${item.acronym}-${item.year}`}>
          <h3><span className="workshop-acronym">{item.acronym}</span> <span>{item.title}</span></h3>
          <div className="workshop-organizer-meta">
            <span><strong>{item.role}</strong></span>
            <span><strong>Year</strong> {item.year}</span>
          </div>
          <div className="action-links">
            <a href={item.website} target="_blank" rel="noreferrer"><i className="fa-solid fa-globe" aria-hidden="true" /><span>Website</span></a>
            <a href={item.proceedingsUrl} target="_blank" rel="noreferrer"><i className="fa-solid fa-file-lines" aria-hidden="true" /><span>Proceedings</span></a>
          </div>
        </article>
      )) : null}
    </div>
  );
}

function ProgrammeCommitteeList({ items }) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [conferenceFilter, setConferenceFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const ordered = [...items].sort((a, b) => Number(b.year) - Number(a.year));
  const years = Array.from(new Set(ordered.map((item) => item.year).filter(Boolean))).sort((a, b) => Number(b) - Number(a));
  const conferenceCounts = countBy(items, (item) => item.acronym.replace(/\s+20\d{2}$/, ""));
  const acronyms = conferenceCounts
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label))
    .map((item) => item.label);
  const yearCounts = countBy(items, (item) => item.year);
  const visible = ordered.filter((item) =>
    (conferenceFilter === "All" || item.acronym.replace(/\s+20\d{2}$/, "") === conferenceFilter)
    && (yearFilter === "All" || String(item.year) === String(yearFilter))
  );

  return (
    <div className="workshop-organizer-list conference-organizer-list">
      <div className="service-subsection-title"><h3>Conference Programme Committee (PC)</h3><span>{items.length} conferences</span></div>
      <div className="publication-filters" aria-label="Programme committee filters">
        <FilterRow label="Conference" value={conferenceFilter} options={acronyms} counts={conferenceCounts} total={items.length} onChange={(value) => { setConferenceFilter(value); setDetailsOpen(true); }} />
        <FilterRow label="Year" value={yearFilter} options={years} counts={yearCounts} total={items.length} onChange={(value) => { setYearFilter(value); setDetailsOpen(true); }} />
      </div>
      <div className="details-toggle-row"><button className="publication-details-toggle workshop-organizer-toggle" type="button" aria-expanded={detailsOpen} onClick={() => setDetailsOpen((value) => !value)}><span>{detailsOpen ? "Hide programme committee list" : `Show ${visible.length} conferences`}</span><i className={`fa-solid fa-chevron-${detailsOpen ? "up" : "down"}`} aria-hidden="true" /></button></div>
      {detailsOpen ? visible.map((item) => <article className="workshop-organizer-card" key={`${item.acronym}-${item.title}`}><h3><span className="workshop-acronym">{item.acronym}</span> <span>{item.title}</span></h3><div className="programme-roles">{item.roles.map((role) => <span key={role}>{role}</span>)}</div><div className="action-links"><a href={item.website} target="_blank" rel="noreferrer"><i className="fa-solid fa-globe" aria-hidden="true" /><span>Website</span></a>{item.proceedings.map((proceeding) => { const url = typeof proceeding === "string" ? proceeding : proceeding.url; const label = typeof proceeding === "string" ? "Proceedings" : proceeding.label; return <a href={url} target="_blank" rel="noreferrer" key={url}><i className="fa-solid fa-file-lines" aria-hidden="true" /><span>{label}</span></a>; })}</div></article>) : null}
      {detailsOpen && !visible.length ? <p className="publication-empty">No programme committees match the selected filters.</p> : null}
    </div>
  );
}

function getPublicationGroups(papers, preferredOrder) {
  const found = new Set(papers.map((paper) => paper.group).filter(Boolean));
  const ordered = preferredOrder.filter((group) => found.has(group));
  const remaining = Array.from(found).filter((group) => !ordered.includes(group)).sort();
  return [...ordered, ...remaining];
}

function getPublicationStats(papers) {
  const byYear = countBy(papers, (paper) => paper.year || "Unknown").sort((a, b) => b.label.localeCompare(a.label));
  const byGroup = countBy(papers, (paper) => paper.group || "Other").sort((a, b) => b.value - a.value);
  const byType = countBy(papers, (paper) => paper.type || "Publication").sort((a, b) => b.value - a.value);
  const byVenueFamily = countBy(papers, getVenueFamily).sort((a, b) => b.value - a.value);
  const openArtifacts = papers.filter((paper) =>
    paper.links?.some((link) => /code|dataset|demo|project|site|documentation/i.test(link.label))
  ).length;

  return {
    total: papers.length,
    featured: papers.filter((paper) => paper.featured).length,
    openArtifacts,
    byYear,
    byGroup,
    byType,
    byVenueFamily
  };
}

function countBy(items, getLabel) {
  const counts = new Map();
  items.forEach((item) => {
    const label = getLabel(item);
    counts.set(label, (counts.get(label) ?? 0) + 1);
  });
  return Array.from(counts, ([label, value]) => ({ label, value }));
}

function getVenueFamily(paper) {
  const value = `${paper.type ?? ""} ${paper.venue ?? ""}`.toLowerCase();
  if (value.includes("journal") || value.includes("jmlr") || value.includes("joss")) return "Journal";
  if (value.includes("dataset") || value.includes("benchmark")) return "Dataset";
  if (value.includes("report") || value.includes("preprint") || value.includes("technical")) return "Report";
  if (value.includes("workshop")) return "Workshop";
  return "Conference";
}

function getVenueAcronym(venue = "") {
  if (venue.toLowerCase() === "arxiv") return "arXiv";
  const normalizedVenue = venue
    .replace(/\\["'`^~]/g, "")
    .replace(/[{}]/g, "")
    .replace(/\s+/g, " ");
  const parentConference = normalizedVenue.match(/\b(ISWC|ESWC)\s*[- ]?(20\d{2})\b/i);
  if (parentConference && /co-located|colocated|satellite|posters|demonstrations|industry tracks/i.test(normalizedVenue)) {
    return `${parentConference[1].toUpperCase()} ${parentConference[2]}`;
  }
  const knownAcronyms = [
    "CODS-COMAD", "EMNLP-IJCNLP", "ACL/IJCNLP", "EDBT/ICDT", "K-CAP", "KGSWC", "INFORSID",
    "SEMANTiCS", "TEXT2KG", "INFORMATIK", "AAAI", "ACL", "CAEPIA", "CIKM", "COLD",
    "DBLP", "EDBT", "EKAW", "EMNLP", "ESWC", "ICDM", "ICWE", "ISIC", "ISWC", "IUI",
    "NAACL", "NLDB", "PAKDD", "QALD", "SAC", "SIGMOD", "VLDB", "WWW"
  ];
  const known = knownAcronyms.find((acronym) => new RegExp(`(?:^|[\\s(])${acronym.replace(/[/-]/g, "[-/]?")}(?=\\s|[),:]|$)`, "i").test(normalizedVenue));
  if (known) {
    const escaped = known.replace(/[/-]/g, "[-/]?");
    const withYear = normalizedVenue.match(new RegExp(`(?:^|[\\s(])${escaped}[-\\s]*(20\\d{2})\\b`, "i"));
    return withYear ? `${known.toUpperCase()} ${withYear[1]}` : known.toUpperCase();
  }

  if (/semantic web journal/i.test(normalizedVenue)) return "Semantic Web";
  if (/journal of web semantics/i.test(normalizedVenue)) return "Web Semantics";

  const acronymWithYear = normalizedVenue.match(/\b([A-Z][A-Z0-9]{2,15})[-\s]*(20\d{2})\b/);
  if (acronymWithYear) return `${acronymWithYear[1]} ${acronymWithYear[2]}`;

  const acronym = normalizedVenue
    .split(/[^A-Za-z]+/)
    .filter((word) => word.length > 2 && !/^(the|and|for|from|with|using|workshop|proceedings|conference|international|joint|on|of)$/i.test(word))
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return acronym.length >= 2 && acronym.length <= 8 ? acronym : "Other";
}

function getVenueCode(venue = "") {
  return getVenueAcronym(venue).replace(/\s+20\d{2}$/, "");
}

function renderRichText(content) {
  if (!Array.isArray(content)) return content;

  return content.map((part, index) => {
    if (typeof part === "string") return part;
    if (part.break) return <br key={`break-${index}`} />;
    if (part.nowrap) return <span className="rich-text-nowrap" key={`nowrap-${index}`}>{renderRichText(part.nowrap)}</span>;
    const body = part.strong ? <strong>{part.text}</strong> : part.text;

    if (part.href) {
      return (
        <a key={`${part.href}-${index}`} href={part.href} target="_blank" rel="noreferrer">
          {body}
        </a>
      );
    }

    return <span key={`${part.text}-${index}`}>{body}</span>;
  });
}

function useGithubRepoStats(collections) {
  const repos = useMemo(() => {
    const found = new Set();
    collections.forEach((items) => {
      items.forEach((item) => {
        item.links?.forEach((link) => {
          const repo = getGithubRepo(link.href);
          if (repo && shouldShowGithubStats(link)) {
            found.add(repo);
          }
        });
      });
    });
    return Array.from(found);
  }, [collections]);
  const [repoStats, setRepoStats] = useState({});

  useEffect(() => {
    if (!repos.length) {
      setRepoStats({});
      return undefined;
    }

    let cancelled = false;
    const now = Date.now();
    const cachedByRepo = Object.fromEntries(
      repos.map((repo) => [repo, readGithubStatsCache(repo)])
    );

    const cachedEntries = repos.flatMap((repo) => {
      const cached = cachedByRepo[repo];
      return cached ? [[repo, cached]] : [];
    });

    if (cachedEntries.length) {
      setRepoStats(Object.fromEntries(cachedEntries));
    }

    const reposToRefresh = repos.filter((repo) => {
      const cached = cachedByRepo[repo];
      // Template placeholder repos render fallback counts without noisy API errors.
      if (isPlaceholderGithubRepo(repo)) return false;
      return !cached || now - cached.checkedAt >= githubStatsCacheTtl;
    });

    if (!reposToRefresh.length) return undefined;

    const loadStats = async () => {
      const entries = await Promise.all(
        reposToRefresh.map(async (repo) => {
          const controller = new AbortController();
          const timeout = window.setTimeout(() => controller.abort(), 3500);
          try {
            const response = await fetch(`https://api.github.com/repos/${repo}`, {
              headers: { Accept: "application/vnd.github+json" },
              signal: controller.signal
            });
            if (!response.ok) {
              markGithubStatsCacheChecked(repo, cachedByRepo[repo]);
              return null;
            }
            const data = await response.json();
            const stats = normalizeGithubStats({ stars: data.stargazers_count });
            if (!stats) return null;
            writeGithubStatsCache(repo, stats);
            return [repo, stats];
          } catch {
            markGithubStatsCacheChecked(repo, cachedByRepo[repo]);
            return null;
          } finally {
            window.clearTimeout(timeout);
          }
        })
      );

      const liveEntries = entries.filter(Boolean);
      if (!cancelled && liveEntries.length) {
        setRepoStats((currentStats) => ({
          ...currentStats,
          ...Object.fromEntries(liveEntries)
        }));
      }
    };

    let cleanupIdle = () => {};
    const cleanupLoad = runAfterInitialLoad(() => {
      cleanupIdle = runWhenIdle(loadStats, 1200);
    });

    return () => {
      cancelled = true;
      cleanupLoad();
      cleanupIdle();
    };
  }, [repos]);

  return repoStats;
}

function readGithubStatsCache(repo) {
  const key = getGithubStatsCacheKey(repo);
  const legacyKey = getLegacyStarCacheKey(repo);
  return readGithubStatsCacheStorage("localStorage", key)
    ?? readGithubStatsCacheStorage("sessionStorage", key)
    ?? readGithubStatsCacheStorage("localStorage", legacyKey)
    ?? readGithubStatsCacheStorage("sessionStorage", legacyKey);
}

function writeGithubStatsCache(repo, stats) {
  const now = Date.now();
  writeGithubStatsCacheEntry(repo, { ...stats, updatedAt: now, checkedAt: now });
}

function markGithubStatsCacheChecked(repo, cached) {
  if (!cached) return;
  writeGithubStatsCacheEntry(repo, { ...cached, checkedAt: Date.now() });
}

function writeGithubStatsCacheEntry(repo, entry) {
  const key = getGithubStatsCacheKey(repo);
  if (writeGithubStatsCacheStorage("localStorage", key, entry)) return;
  if (!writeGithubStatsCacheStorage("sessionStorage", key, entry)) {
    // Optional cache only.
  }
}

function readGithubStatsCacheStorage(storageName, key) {
  try {
    const storage = window[storageName];
    const cached = JSON.parse(storage.getItem(key));
    const stats = normalizeGithubStats({ stars: cached?.stars ?? cached?.count });
    const updatedAt = Number(cached?.updatedAt ?? cached?.timestamp);
    const checkedAt = Number(cached?.checkedAt ?? updatedAt);
    if (!stats || !Number.isFinite(updatedAt) || !Number.isFinite(checkedAt)) return null;
    return { ...stats, updatedAt, checkedAt };
  } catch {
    return null;
  }
}

function writeGithubStatsCacheStorage(storageName, key, entry) {
  try {
    window[storageName].setItem(key, JSON.stringify(entry));
    return true;
  } catch {
    return false;
  }
}

function getGithubStatsCacheKey(repo) {
  return `github-repo-stats:${repo}`;
}

function getLegacyStarCacheKey(repo) {
  return `github-stars:${repo}`;
}

function shouldShowGithubStats(link) {
  if (link.showGithubStats === false || link.stats === false) return false;
  if (link.showGithubStats === true || link.stats === true) return true;
  const label = String(link.label ?? "").toLowerCase();
  return ["code", "github", "repo", "repository"].some((keyword) => label.includes(keyword));
}

function getGithubStatsFallback(link) {
  return normalizeGithubStats({ stars: link.stars });
}

function mergeGithubStats(liveStats, fallbackStats) {
  return normalizeGithubStats({ stars: liveStats?.stars ?? fallbackStats?.stars });
}

function normalizeGithubStats(stats) {
  const stars = Number(stats?.stars);
  return Number.isFinite(stars) ? { stars } : null;
}

function getGithubRepo(href) {
  try {
    const url = new URL(href);
    if (url.hostname !== "github.com") return null;
    const [owner, repo] = url.pathname.split("/").filter(Boolean);
    if (!owner || !repo) return null;
    return `${owner}/${repo.replace(/\.git$/, "")}`;
  } catch {
    return null;
  }
}

function isPlaceholderGithubRepo(repo) {
  return repo.split("/")[0]?.toLowerCase() === "example";
}

function highlightAuthors(authors = "") {
  const names = profile.highlightNames?.length ? profile.highlightNames : [profile.name].filter(Boolean);
  if (!names.length) return authors;

  const nameSet = new Set(names);
  const pattern = new RegExp(`(${names.map(escapeRegExp).join("|")})`, "g");
  return authors.split(pattern).map((part, index) => (
    nameSet.has(part) ? <strong key={`${part}-${index}`}>{part}</strong> : <span key={`${part}-${index}`}>{part}</span>
  ));
}

function getInitialTheme() {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function runAfterInitialLoad(callback) {
  let timeoutId = 0;

  const run = () => {
    timeoutId = window.setTimeout(callback, 0);
  };

  if (document.readyState === "complete") {
    run();
    return () => window.clearTimeout(timeoutId);
  }

  window.addEventListener("load", run, { once: true });
  return () => {
    window.removeEventListener("load", run);
    window.clearTimeout(timeoutId);
  };
}

function runWhenIdle(callback, timeout = 1000) {
  if ("requestIdleCallback" in window) {
    const idleId = window.requestIdleCallback(callback, { timeout });
    return () => window.cancelIdleCallback(idleId);
  }

  const timeoutId = window.setTimeout(callback, timeout);
  return () => window.clearTimeout(timeoutId);
}

function splitTrailingYear(value) {
  const match = value.match(/^(.*),\s*(\d{4})$/);
  if (!match) return { title: value, year: "" };
  return { title: match[1], year: match[2] };
}

function splitServiceYears(value) {
  const match = value.match(/^(.+?)\s((?:\d{4}(?:,\s*)?)+)$/);
  if (!match) return { title: value, year: "" };
  return { title: match[1], year: match[2].replace(/,\s*/g, " / ") };
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function formatNumber(value) {
  return new Intl.NumberFormat("en").format(value);
}

function formatGithubCount(value) {
  if (value >= 1000) {
    const rounded = Math.round((value / 1000) * 10) / 10;
    return `${rounded.toString().replace(/\.0$/, "")}k`;
  }
  return value.toString();
}

function getInitials(value = "") {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "A";
}

function isRasterImage(src) {
  return /\.(png|jpe?g)$/i.test(src);
}

function toWebpPath(src) {
  return src.replace(/\.(png|jpe?g)$/i, ".webp");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default App;
