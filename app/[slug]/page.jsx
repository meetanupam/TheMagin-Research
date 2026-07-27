"use client";

import Link from "next/link";
import { ArrowRight, Check, GraduationCap, Building2, FlaskConical, ShieldCheck, Menu, X } from "lucide-react";
import { use, useState } from "react";
import { Show, UserButton } from "@clerk/nextjs";

const data = {
  product: {
    eyebrow: "THE PRODUCT", title: "A workspace built for the moment reading becomes thinking.",
    intro: "TheMagin brings discovery, close reading, synthesis, and citation into one evidence-linked flow.",
    sections: [
      ["Discover", "Search beyond keywords.", "Ask in plain language, filter by methodology, and understand why a paper belongs in your project before opening it."],
      ["Understand", "Read with context.", "Get plain-language explanations, inspect related claims, and annotate PDFs alongside your collaborators."],
      ["Connect", "Map the conversation.", "Cluster themes, expose contradictions, compare methods, and surface genuine gaps across your library."],
      ["Create", "Write what you can defend.", "Turn structured evidence into a brief or outline with passage-level citations that stay attached."],
    ]
  },
  solutions: {
    eyebrow: "SOLUTIONS", title: "One research standard. Built for every role on campus.",
    intro: "From a first-year paper to a funded lab, TheMagin gives people the right depth without adding another complicated system.",
    sections: [
      ["Students", "Confidence without shortcuts.", "Build stronger assignments and dissertations with guided discovery, traceable notes, and source-first AI support."],
      ["Researchers", "A living view of the field.", "Monitor questions, organize multi-year evidence, collaborate across institutions, and export anywhere."],
      ["Labs & libraries", "Shared knowledge that compounds.", "Create durable research collections, onboarding maps, and reading workflows that survive team turnover."],
      ["Universities", "Responsible AI, made practical.", "Offer SSO, admin controls, private deployment options, and transparent research workflows across campus."],
    ]
  },
  about: {
    eyebrow: "OUR THESIS", title: "AI should make human thinking more visible, not less.",
    intro: "TheMagin exists because the most important part of research is not producing sentences. It is learning how evidence changes your mind.",
    sections: [
      ["Principle 01", "Sources before synthesis.", "An answer without inspectable evidence is a suggestion, not scholarship."],
      ["Principle 02", "Augment judgment.", "The product should reveal choices, uncertainty, and disagreement—not collapse them into one smooth paragraph."],
      ["Principle 03", "Protect the unfinished.", "Early ideas deserve privacy. Private research is never used to train shared models."],
      ["Principle 04", "Reward curiosity.", "Great research tools should invite better questions, not simply accelerate the first answer."],
    ]
  }
};

function Logo(){return <Link className="logo" href="/" aria-label="TheMagin home"><span className="logo-mark">TM</span><span>TheMagin</span></Link>}
function SimpleHeader(){const [open,setOpen]=useState(false);return <header className="nav-shell"><nav className="nav"><Logo/><button className="menu-button" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button><div className={`nav-links ${open?"open":""}`}><Link href="/product">Product</Link><Link href="/solutions">Solutions</Link><Link href="/pricing">Pricing</Link><Link href="/about">Our thesis</Link></div><div className="nav-actions"><Show when="signed-out"><Link href="/login">Log in</Link><Link className="button button-sm dark" href="/signup">Start researching <ArrowRight size={15}/></Link></Show><Show when="signed-in"><Link className="button button-sm dark" href="/workspace">Open workspace <ArrowRight size={15}/></Link><UserButton afterSignOutUrl="/"/></Show></div></nav></header>}
function SimpleFooter(){return <footer><div className="footer-top"><div><Logo/><p>A calmer place to do serious thinking.</p></div><div className="footer-links"><div><b>Explore</b><Link href="/product">Product</Link><Link href="/solutions">Solutions</Link><Link href="/pricing">Pricing</Link></div><div><b>Contact</b><a href="mailto:hello@themagin.com">hello@themagin.com</a><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div></div></div><div className="footer-bottom"><span>© 2026 TheMagin Labs</span><span>Made for curious minds everywhere.</span></div></footer>}

function Pricing(){
 const [annual,setAnnual]=useState(true);
 const plans=[
  ["Free","$0","For coursework and curious beginnings.",["3 active projects","150 source pages / month","Core citation tools","PDF & link imports"],"Start free"],
  ["Pro",annual?"$10":"$12","For dissertations and active research.",["Unlimited projects","1,000 source pages / month","Research maps & gap detection","Zotero, Word & Notion exports"],"Start 14-day trial"],
  ["Teams",annual?"$24":"$29","For labs, cohorts, and small teams.",["Everything in Pro","Shared collections & briefs","Roles and project templates","Priority support"],"Create a team"]
 ];
 return <><SimpleHeader/><main className="inner-page pricing-page"><section className="inner-hero grid-bg"><span>PRICING</span><h1>Plans that grow with<br/><em>the question.</em></h1><p>Start free. Upgrade when your research becomes serious.</p><div className="billing"><button className={annual?"active":""} onClick={()=>setAnnual(true)}>Annual <i>2 months free</i></button><button className={!annual?"active":""} onClick={()=>setAnnual(false)}>Monthly</button></div></section><section className="plans">{plans.map((p,i)=><article className={i===1?"featured":""} key={p[0]}>{i===1&&<span className="popular">MOST POPULAR</span>}<small>{p[0]}</small><div className="plan-price"><b>{p[1]}</b><span>{i?" / user / month":""}</span></div><p>{p[2]}</p><Link className={`button ${i===1?"dark":"ghost"}`} href="/signup">{p[4]} <ArrowRight/></Link><ul>{p[3].map(x=><li key={x}><Check/>{x}</li>)}</ul></article>)}</section><section className="institution"><div><Building2/><h2>For universities</h2><p>Campus-wide access, SSO, governance, onboarding, and support designed with your library and research office.</p></div><Link className="button white" href="mailto:hello@themagin.com">Talk to our campus team <ArrowRight/></Link></section></main><SimpleFooter/></>
}

function Auth({signup=false}){const [done,setDone]=useState(false);return <main className="auth-page"><Link className="auth-back" href="/">← Back to TheMagin</Link><div className="auth-panel"><Logo/><span>{signup?"START YOUR WORKSPACE":"WELCOME BACK"}</span><h1>{signup?"Begin with a question.":"Continue your research."}</h1><p>{signup?"Free for 3 projects. No credit card required.":"Your papers have been waiting."}</p>{done?<div className="auth-success"><ShieldCheck/><h3>Check your inbox</h3><p>We sent you a secure sign-in link.</p></div>:<form onSubmit={(e)=>{e.preventDefault();setDone(true)}}><label>Academic or work email<input required type="email" placeholder="you@university.edu"/></label><button className="button dark" type="submit">{signup?"Create free workspace":"Email me a sign-in link"} <ArrowRight/></button><div className="or"><span/>or<span/></div><button className="button ghost" type="button">Continue with Google</button></form>}<small>By continuing, you agree to our <Link href="/terms">Terms</Link> and <Link href="/privacy">Privacy Policy</Link>.</small></div><div className="auth-art"><div className="floating-note n1">“Agency increased when students…”</div><div className="floating-note n2">12 connected papers</div><div className="floating-note n3">A gap worth exploring →</div><blockquote>Good research begins<br/>where the obvious answer ends.</blockquote></div></main>}

function Legal({slug}){const title={privacy:"Privacy policy",terms:"Terms of service",security:"Security at TheMagin"}[slug];return <><SimpleHeader/><main className="legal"><span>LAST UPDATED · JULY 2026</span><h1>{title}</h1><p className="lead">Plain-language policies for a research product built on trust.</p><h2>Our commitment</h2><p>Your research belongs to you. TheMagin does not use private papers, annotations, projects, or workspace content to train shared AI models. We collect only what is needed to provide and improve the service.</p><h2>Data and security</h2><p>Data is encrypted in transit and at rest. Access to production systems is restricted, logged, and reviewed. Team customers can configure retention and member access.</p><h2>Your choices</h2><p>You can export your work at any time and request deletion of your account and associated content. For questions, contact privacy@themagin.com.</p><h2>Service terms</h2><p>TheMagin is a research aid, not a substitute for academic judgment. Users remain responsible for checking sources, following institutional policies, and representing authorship honestly.</p></main><SimpleFooter/></>}

export default function Page({params}){const {slug}=use(params);if(slug==="pricing")return <Pricing/>;if(slug==="signup")return <Auth signup/>;if(slug==="login")return <Auth/>;if(["privacy","terms","security"].includes(slug))return <Legal slug={slug}/>;const page=data[slug]||data.product;return <><SimpleHeader/><main className="inner-page"><section className="inner-hero grid-bg"><span>{page.eyebrow}</span><h1>{page.title}</h1><p>{page.intro}</p><Link className="button dark" href="/signup">Start researching <ArrowRight/></Link></section><section className="detail-list">{page.sections.map((s,i)=><article key={s[0]}><div className="detail-num">0{i+1}</div><small>{s[0]}</small><h2>{s[1]}</h2><p>{s[2]}</p><div className={`detail-visual v${i+1}`}><div/><div/><div/></div></article>)}</section><section className="sub-cta"><h2>Make your next literature review<br/>the last one you start from scratch.</h2><Link className="button white" href="/signup">Start for free <ArrowRight/></Link></section></main><SimpleFooter/></>}
