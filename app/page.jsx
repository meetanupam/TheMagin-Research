"use client";

import Link from "next/link";
import {
  ArrowRight, BookOpen, Check, ChevronDown, CircleCheck, FileText,
  GitBranch, GraduationCap, Menu, Quote, Search, Sparkles, Users, X, Zap
} from "lucide-react";
import { useState } from "react";
import { Show, UserButton } from "@clerk/nextjs";

const features = [
  { icon: Search, n: "01", title: "Search with a point of view", text: "Ask a research question. TheMagin finds the papers, explains why they matter, and keeps every claim linked to its source." },
  { icon: GitBranch, n: "02", title: "See the field, not a feed", text: "Turn a pile of PDFs into a visual map of themes, disagreements, methods, and the gaps worth exploring." },
  { icon: Quote, n: "03", title: "Write from evidence", text: "Draft literature reviews and briefs with passage-level citations you can inspect, export, and defend." },
];

const faqs = [
  ["Is TheMagin another AI essay writer?", "No. TheMagin is designed for the work before and around writing: discovering sources, reading critically, mapping evidence, and building a traceable argument. It never hides where a claim came from."],
  ["Can I import my existing papers?", "Yes. Add PDFs, DOI links, Zotero exports, lecture notes, and web sources. TheMagin deduplicates your library and preserves your folders and metadata."],
  ["Does it work for group projects and labs?", "That is one of its strongest use cases. Share collections, assign reading, compare annotations, and publish a living evidence brief without losing authorship."],
  ["Will my research be used to train models?", "No. Your private libraries and workspaces are not used to train shared AI models. Team plans include role-based access and data retention controls."],
];

function Logo() {
  return <Link className="logo" href="/" aria-label="TheMagin home"><span className="logo-mark">TM</span><span>TheMagin</span></Link>;
}

function Header() {
  const [open, setOpen] = useState(false);
  return <header className="nav-shell">
    <nav className="nav">
      <Logo />
      <button className="menu-button" aria-label="Toggle menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      <div className={`nav-links ${open ? "open" : ""}`}>
        <Link href="/product">Product</Link><Link href="/solutions">Solutions</Link><Link href="/pricing">Pricing</Link><Link href="/about">Our thesis</Link>
      </div>
      <div className="nav-actions"><Show when="signed-out"><Link href="/login">Log in</Link><Link className="button button-sm dark" href="/signup">Start researching <ArrowRight size={15}/></Link></Show><Show when="signed-in"><Link className="button button-sm dark" href="/workspace">Open workspace <ArrowRight size={15}/></Link><UserButton afterSignOutUrl="/"/></Show></div>
    </nav>
  </header>;
}

function Footer() {
  return <footer>
    <div className="footer-top">
      <div><Logo/><p>A calmer place to do serious thinking.</p></div>
      <div className="footer-links"><div><b>Product</b><Link href="/product">How it works</Link><Link href="/pricing">Pricing</Link><Link href="/solutions">For universities</Link></div><div><b>Company</b><Link href="/about">Our thesis</Link><Link href="/about#principles">Principles</Link><a href="mailto:hello@themagin.com">Contact</a></div><div><b>Legal</b><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/security">Security</Link></div></div>
    </div>
    <div className="footer-bottom"><span>© 2026 TheMagin Labs</span><span>Made for curious minds everywhere.</span></div>
  </footer>;
}

function ProductMockup() {
  return <div className="product-frame">
    <div className="window-bar"><div className="dots"><i/><i/><i/></div><span>Research map / AI feedback in higher education</span><div className="avatar-stack"><i>AK</i><i>+2</i></div></div>
    <div className="app-ui">
      <aside className="app-sidebar"><Logo/><small>Workspace</small><a className="active"><BookOpen/>Library <span>24</span></a><a><GitBranch/>Research map</a><a><FileText/>Briefs</a><small>Collections</small><a><span className="dot coral"/>AI feedback</a><a><span className="dot violet"/>Student agency</a><a><span className="dot gold"/>Assessment</a></aside>
      <div className="app-main">
        <div className="app-heading"><div><span className="eyebrow">RESEARCH QUESTION</span><h3>How does AI feedback affect student agency?</h3></div><button><Sparkles/>Find connections</button></div>
        <div className="map-area">
          <div className="map-line l1"/><div className="map-line l2"/><div className="map-line l3"/>
          <div className="paper-card p1"><span className="type empirical">EMPIRICAL</span><b>Feedback literacy in AI-supported learning</b><p>Carless & Boud · 2024</p><small>“Agency increased when students could contest…”</small></div>
          <div className="paper-card p2"><span className="type review">REVIEW</span><b>Generative AI and self-regulated learning</b><p>Jin et al. · 2025</p><small>42 studies</small></div>
          <div className="paper-card p3"><span className="type theory">THEORY</span><b>Who owns the feedback loop?</b><p>Bearman · 2023</p></div>
          <div className="insight-card"><Sparkles/><div><small>THEMAGIN INSIGHT</small><b>Most studies measure performance, but only 3 examine perceived agency.</b><a>Explore this gap <ArrowRight/></a></div></div>
        </div>
      </div>
    </div>
  </div>;
}

export default function Home() {
  const [faq, setFaq] = useState(0);
  return <main>
    <Header/>
    <section className="hero grid-bg">
      <div className="hero-copy">
        <div className="announcement"><span>NEW</span> Shared research maps for teams <ArrowRight/></div>
        <h1>Research is messy.<br/><em>Your thinking</em> shouldn’t be.</h1>
        <p>TheMagin turns papers, notes, and questions into an evidence-linked workspace—so you can understand the field, find the gap, and write work that holds up.</p>
        <div className="hero-actions"><Link className="button dark" href="/signup">Start for free <ArrowRight/></Link><Link className="button ghost" href="/product"><span className="play">▶</span> See how it works</Link></div>
        <div className="micro-proof"><span><CircleCheck/>No credit card</span><span><CircleCheck/>Free for 3 projects</span><span><CircleCheck/>Your work stays yours</span></div>
      </div>
      <ProductMockup/>
      <div className="trusted"><span>BUILT FOR THE WAY RESEARCH REALLY HAPPENS</span><div><b>STUDENTS</b><b>RESEARCHERS</b><b>LABS</b><b>LIBRARIES</b><b>UNIVERSITIES</b></div></div>
    </section>

    <section className="problem section-pad">
      <div className="section-kicker"><span>01</span> THE PROBLEM</div>
      <div className="split-head"><h2>Your best ideas are buried under 37 open tabs.</h2><div><p>Research tools help you store information. AI tools help you generate text. Neither helps you build understanding.</p><p>TheMagin is the missing layer between reading and writing.</p></div></div>
      <div className="chaos-grid">
        <div className="chaos-before"><span>BEFORE THEMAGIN</span><div className="mess m1">PDF_final_v7.pdf</div><div className="mess m2">“interesting quote...”</div><div className="mess m3">where did I read this?</div><div className="mess m4">12 tabs</div><div className="mess m5">untitled notes</div></div>
        <div className="arrow-circle"><ArrowRight/></div>
        <div className="clarity-card"><span>WITH THEMAGIN</span><div className="mini-map"><i/><i/><i/><i/></div><h3>One connected argument.</h3><p>Every idea linked. Every source traceable.</p></div>
      </div>
    </section>

    <section className="features section-pad">
      <div className="section-kicker light"><span>02</span> THE WORKSPACE</div>
      <div className="feature-intro"><h2>From “I have a topic”<br/>to <em>“I found something.”</em></h2><p>One considered workflow for the entire research journey.</p></div>
      <div className="feature-list">{features.map((f) => <article key={f.n}><div className="feature-number">{f.n}</div><div className="feature-icon"><f.icon/></div><h3>{f.title}</h3><p>{f.text}</p><Link href="/product">Explore feature <ArrowRight/></Link></article>)}</div>
    </section>

    <section className="proof section-pad">
      <div className="proof-card">
        <div className="quote-mark">“</div><blockquote>TheMagin didn’t write my thesis. It did something more useful—it showed me where my argument was thin before my supervisor did.</blockquote>
        <div className="quote-person"><div className="person-avatar">NM</div><div><b>Nia Mensah</b><span>MSc Education, University of Edinburgh</span></div></div>
      </div>
      <div className="stats"><div><b>6.2h</b><span>saved per literature review</span></div><div><b>94%</b><span>of citations traceable to a passage</span></div><div><b>3.4×</b><span>more sources compared, not just collected</span></div></div>
    </section>

    <section className="audience section-pad">
      <div className="center-head"><div className="section-kicker"><span>03</span> BUILT FOR</div><h2>Serious tools for every curious mind.</h2></div>
      <div className="audience-grid">
        <article className="student-card"><div className="audience-icon"><GraduationCap/></div><span>FOR STUDENTS</span><h3>Stop collecting.<br/>Start connecting.</h3><p>Build stronger papers, capstones, and dissertations without losing your own voice.</p><ul><li><Check/>Citation-ready notes</li><li><Check/>Argument outlines</li><li><Check/>Free academic plan</li></ul><Link href="/solutions">Explore for students <ArrowRight/></Link></article>
        <article className="research-card"><div className="audience-icon"><Zap/></div><span>FOR RESEARCHERS</span><h3>Find the signal<br/>across the field.</h3><p>Track new evidence, surface contradictions, and move from reading to insight faster.</p><ul><li><Check/>Living literature maps</li><li><Check/>Semantic alerts</li><li><Check/>Zotero & BibTeX export</li></ul><Link href="/solutions">Explore for researchers <ArrowRight/></Link></article>
        <article className="uni-card"><div className="audience-icon"><Users/></div><span>FOR UNIVERSITIES</span><h3>Raise the standard,<br/>not the suspicion.</h3><p>Teach transparent, source-first AI use across courses, labs, and libraries.</p><ul><li><Check/>Campus SSO & admin</li><li><Check/>Research integrity controls</li><li><Check/>Usage insights</li></ul><Link href="/solutions">Explore for universities <ArrowRight/></Link></article>
      </div>
    </section>

    <section className="pricing-preview section-pad">
      <div className="pricing-copy"><div className="section-kicker light"><span>04</span> PRICING</div><h2>Start with a question.<br/>Upgrade when it grows.</h2><p>Free for individual study. Fairly priced for serious projects. Scalable for institutions.</p><Link className="button white" href="/pricing">See all plans <ArrowRight/></Link></div>
      <div className="price-card"><span className="popular">MOST POPULAR</span><small>THEMAGIN PRO</small><div className="price"><sup>$</sup><b>12</b><span>/ month<br/>with academic email</span></div><p>For dissertations, publications, and people who always have one more paper to read.</p><hr/><ul><li><Check/>Unlimited research projects</li><li><Check/>1,000 source pages / month</li><li><Check/>Research maps & gap detection</li><li><Check/>Word, Notion, Zotero exports</li></ul><Link className="button dark" href="/signup">Start 14-day trial <ArrowRight/></Link></div>
    </section>

    <section className="faq section-pad">
      <div><div className="section-kicker"><span>05</span> QUESTIONS</div><h2>The fine print,<br/>in plain English.</h2><p>Still wondering something?</p><a href="mailto:hello@themagin.com">Ask us directly →</a></div>
      <div className="faq-list">{faqs.map((item, i) => <div className={`faq-item ${faq === i ? "open" : ""}`} key={item[0]}><button onClick={() => setFaq(faq === i ? -1 : i)}><span>{item[0]}</span><ChevronDown/></button><p>{item[1]}</p></div>)}</div>
    </section>

    <section className="final-cta grid-bg"><div className="orb"/><span className="section-kicker centered">YOUR NEXT IDEA IS ALREADY IN THE LITERATURE.</span><h2>Find it. Connect it.<br/><em>Make it yours.</em></h2><p>Start your first research map in under two minutes.</p><div><Link className="button dark" href="/signup">Start researching for free <ArrowRight/></Link></div><small>No credit card · Free for 3 projects · Cancel anytime</small></section>
    <Footer/>
  </main>;
}
