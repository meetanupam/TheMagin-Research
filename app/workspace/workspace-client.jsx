"use client";

import Link from "next/link";
import {
  ArrowLeft, ArrowRight, Bell, BookOpen, Check, ChevronDown, CircleHelp,
  Clock3, Command, Copy, FileDown, FilePlus2, FileText, FolderOpen, GitBranch,
  GraduationCap, Highlighter, Home, Library, Menu, MoreHorizontal, Plus,
  Quote, Search, Sparkles, Trash2, Upload, UserRound, Users,
  WandSparkles, X, LogOut
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useClerk } from "@clerk/nextjs";

const seed = {
  projects: [
    { id: "ai-agency", title: "AI feedback & student agency", question: "How does AI-generated feedback affect student agency in higher education?", updated: "12 min ago", color: "#d9ff56", sources: 8 },
    { id: "peer-review", title: "Peer review systems", question: "Which peer-review structures improve undergraduate scientific writing?", updated: "Yesterday", color: "#ded8ff", sources: 4 },
  ],
  sources: [
    { id: 1, projectId: "ai-agency", title: "Feedback literacy in AI-supported learning", authors: "Carless & Boud", year: "2024", type: "Empirical study", status: "Read", tags: ["student agency", "feedback"], note: "Students showed more agency when they could challenge or contextualize automated feedback.", url: "" },
    { id: 2, projectId: "ai-agency", title: "Generative AI and self-regulated learning: a systematic review", authors: "Jin, Mah & Park", year: "2025", type: "Systematic review", status: "Reading", tags: ["self-regulation", "review"], note: "Performance measures dominate the literature; perceived agency is rarely measured.", url: "" },
    { id: 3, projectId: "ai-agency", title: "Who owns the feedback loop?", authors: "Bearman", year: "2023", type: "Theory", status: "Read", tags: ["feedback", "power"], note: "Frames feedback as a negotiated relationship rather than information delivered to a student.", url: "" },
    { id: 4, projectId: "ai-agency", title: "Human–AI dialogue in formative assessment", authors: "Ouyang & Jiao", year: "2024", type: "Empirical study", status: "Unread", tags: ["assessment", "dialogue"], note: "", url: "" },
    { id: 5, projectId: "peer-review", title: "Peer assessment and writing development", authors: "Nicol et al.", year: "2022", type: "Meta-analysis", status: "Read", tags: ["peer review"], note: "Students improve most when they produce feedback, not only receive it.", url: "" },
  ],
  notes: [
    { id: 1, projectId: "ai-agency", sourceId: 1, text: "Agency increased when learners could contest the system’s recommendation.", page: "p. 14", kind: "Evidence" },
    { id: 2, projectId: "ai-agency", sourceId: 2, text: "Only three of forty-two studies directly measured perceived learner agency.", page: "p. 9", kind: "Gap" },
    { id: 3, projectId: "ai-agency", sourceId: 3, text: "Feedback is relational: authority is negotiated through the learner’s response.", page: "p. 6", kind: "Theory" },
  ],
  briefs: [],
};

function openPdfStore() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("margin_pdf_store", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("pdfs");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function savePdfFile(sourceId, file) {
  const db = await openPdfStore();
  await new Promise((resolve, reject) => {
    const tx = db.transaction("pdfs", "readwrite");
    tx.objectStore("pdfs").put(file, String(sourceId));
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

async function loadPdfFile(sourceId) {
  const db = await openPdfStore();
  const file = await new Promise((resolve, reject) => {
    const request = db.transaction("pdfs", "readonly").objectStore("pdfs").get(String(sourceId));
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return file;
}

const nav = [
  ["Overview", Home], ["Library", Library], ["Research map", GitBranch],
  ["Evidence", Highlighter], ["Briefs", FileText],
];

function useResearchStore(storageKey) {
  const [data, setData] = useState({ projects: [], sources: [], notes: [], briefs: [] });
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setData(JSON.parse(saved));
    } catch {}
    setReady(true);
  }, [storageKey]);
  useEffect(() => {
    if (ready) localStorage.setItem(storageKey, JSON.stringify(data));
  }, [data, ready, storageKey]);
  return [data, setData, ready];
}

function Mark() {
  return <Link className="ws-logo" href="/"><span>M</span><b>margin</b></Link>;
}

function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [role, setRole] = useState("");
  const [topic, setTopic] = useState("");
  const options = [
    ["Student", GraduationCap, "Coursework, capstone, or dissertation"],
    ["Researcher", Sparkles, "Independent or professional research"],
    ["Lab or team", Users, "Shared evidence and research briefs"],
  ];
  return <div className="onboarding">
    <div className="onboarding-card">
      <Mark/>
      <div className="onboarding-progress"><i className={step >= 0 ? "done" : ""}/><i className={step >= 1 ? "done" : ""}/></div>
      {step === 0 ? <>
        <small>LET’S SET UP YOUR WORKSPACE</small>
        <h1>What kind of researcher are you?</h1>
        <p>This changes the templates and guidance you see. You can change it later.</p>
        <div className="role-options">{options.map(([name, Icon, text]) => <button className={role === name ? "selected" : ""} onClick={() => setRole(name)} key={name}><Icon/><span><b>{name}</b><small>{text}</small></span>{role === name && <Check/>}</button>)}</div>
        <button className="ws-primary" disabled={!role} onClick={() => setStep(1)}>Continue <ArrowRight/></button>
      </> : <>
        <small>YOUR FIRST PROJECT</small>
        <h1>What are you exploring?</h1>
        <p>A rough topic is enough. You can sharpen the research question inside Margin.</p>
        <label className="topic-input"><span>Research topic</span><textarea autoFocus value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. The effect of AI feedback on student agency"/></label>
        <div className="starter-prompts"><span>Try one:</span>{["AI in education", "Climate adaptation policy", "Peer review systems"].map(x => <button key={x} onClick={() => setTopic(x)}>{x}</button>)}</div>
        <div className="onboarding-actions"><button className="ws-secondary" onClick={() => setStep(0)}><ArrowLeft/> Back</button><button className="ws-primary" disabled={!topic.trim()} onClick={() => onComplete({ role, topic })}>Create workspace <Sparkles/></button></div>
      </>}
    </div>
  </div>;
}

function Sidebar({ active, setActive, projects, projectId, setProjectId, open, setOpen, account, setCommandOpen, usageCount }) {
  const [accountOpen, setAccountOpen] = useState(false);
  const { openUserProfile, signOut } = useClerk();
  return <aside className={`ws-sidebar ${open ? "mobile-open" : ""}`}>
    <div className="ws-sidebar-top"><Mark/><button onClick={() => setOpen(false)}><X/></button></div>
    <button className="quick-find" onClick={()=>setCommandOpen(true)}><Search/><span>Quick find</span><kbd>⌘ K</kbd></button>
    <nav>{nav.map(([label, Icon]) => <button key={label} className={active === label ? "active" : ""} onClick={() => { setActive(label); setOpen(false); }}><Icon/><span>{label}</span></button>)}</nav>
    <div className="project-nav">
      <div><span>PROJECTS</span><button aria-label="New project" onClick={() => setActive("New project")}><Plus/></button></div>
      {projects.map(p => <button className={p.id === projectId ? "active" : ""} onClick={() => {setProjectId(p.id);setActive("Overview");setOpen(false)}} key={p.id}><i style={{background:p.color}}/><span>{p.title}</span></button>)}
    </div>
    <div className="ws-sidebar-bottom"><div className="usage"><div><span>Free plan</span><b>{usageCount} / 25 sources</b></div><i><em style={{width:`${Math.min(100,usageCount/25*100)}%`}}/></i><Link href="/pricing">Upgrade plan <ArrowRight/></Link></div><div className="account-wrap"><button className="user-chip" onClick={()=>setAccountOpen(!accountOpen)}>{account.imageUrl?<img src={account.imageUrl} alt=""/>:<span>{account.initials}</span>}<div><b>{account.name}</b><small>{account.email}</small></div><MoreHorizontal/></button>{accountOpen&&<div className="account-menu"><div><b>{account.name}</b><span>{account.email}</span></div><button onClick={()=>openUserProfile()}><UserRound/> Manage account</button><hr/><button className="logout" onClick={()=>signOut({redirectUrl:"/"})}><LogOut/> Log out</button></div>}</div></div>
  </aside>;
}

function Topbar({ project, setOpen, setCommandOpen }) {
  return <header className="ws-topbar"><button className="ws-mobile-menu" onClick={() => setOpen(true)}><Menu/></button><div className="crumb"><span>Workspace</span><b>/</b><strong>{project?.title || "All research"}</strong></div><div className="top-actions"><button onClick={() => setCommandOpen(true)}><Command/><span>Search</span></button></div></header>;
}

function Overview({ project, sources, notes, setActive }) {
  const read = sources.filter(s => s.status === "Read").length;
  return <div className="ws-view">
    <div className="view-heading"><div><span className="view-kicker">RESEARCH PROJECT</span><h1>{project.title}</h1><p>{project.question}</p></div></div>
    <div className="metric-row"><article><span>Sources</span><b>{sources.length}</b><small><i className="green"/> {read} read</small></article><article><span>Evidence notes</span><b>{notes.length}</b><small><i className="violet-dot"/> 1 research gap</small></article><article><span>Coverage</span><b>{sources.length ? Math.min(92, 28 + sources.length * 7) : 0}%</b><small>Across 3 themes</small></article><article><span>Last session</span><b className="time-metric">42m</b><small>12 minutes ago</small></article></div>
    {sources.length ? <section className="next-step"><div className="spark-box"><Sparkles/></div><div><span>MARGIN SUGGESTS</span><h3>{notes.length ? "You have enough evidence to begin comparing claims across sources." : "Start capturing findings as you read—Margin will connect them across the literature."}</h3><p>{notes.length ? `${notes.length} evidence note${notes.length===1?" is":"s are"} ready to organize into themes and a source-linked brief.` : "Open a source, save the claims that matter, and keep every idea attached to its origin."}</p><button onClick={() => setActive(notes.length?"Research map":"Evidence")}>{notes.length?"Open research map":"Capture first evidence"} <ArrowRight/></button></div></section> : <section className="getting-started"><div><span>01</span><div><b>Add your first source</b><p>Import a PDF or save a DOI and bibliographic details.</p></div><button onClick={()=>setActive("Library")}>Add source <ArrowRight/></button></div><div><span>02</span><div><b>Capture evidence while you read</b><p>Keep findings, quotes, methods, and gaps linked to their source.</p></div></div><div><span>03</span><div><b>Build a defensible synthesis</b><p>Compare the literature and generate a brief only from saved evidence.</p></div></div></section>}
    <div className="overview-grid">
      <section className="panel recent-sources"><div className="panel-head"><div><h2>Recent sources</h2><p>Continue where you left off.</p></div><button onClick={() => setActive("Library")}>View library <ArrowRight/></button></div>{sources.length?sources.slice(0,4).map(s => <div className="source-row" key={s.id}><div className={`source-type ${s.type.includes("Review")?"review":s.type==="Theory"?"theory":""}`}><FileText/></div><div><b>{s.title}</b><span>{s.authors} · {s.year}</span></div><em className={`status ${s.status.toLowerCase()}`}>{s.status}</em><MoreHorizontal/></div>):<button className="panel-empty" onClick={()=>setActive("Library")}><FilePlus2/><span><b>Your library is empty</b><small>Add a paper to begin building this project.</small></span><ArrowRight/></button>}</section>
      <section className="panel activity"><div className="panel-head"><div><h2>Project pulse</h2><p>Your last 7 days.</p></div></div><div className="activity-chart">{[35,62,44,80,55,92,68].map((x,i)=><i key={i} style={{height:`${x}%`}}><span>{i===5?"6":""}</span></i>)}</div><div className="chart-labels"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div><div className="pulse-foot"><div><b>6</b><span>notes added</span></div><div><b>3</b><span>papers read</span></div></div></section>
    </div>
  </div>;
}

function SourceReader({ source, notes, onClose, updateSource, addNote, flash }) {
  const [tab,setTab]=useState("Reader");
  const [note,setNote]=useState("");
  const [kind,setKind]=useState("Evidence");
  const [pdfUrl,setPdfUrl]=useState("");
  const [selection,setSelection]=useState("");
  const [selectionKind,setSelectionKind]=useState("Evidence");
  const sourceNotes=notes.filter(n=>n.sourceId===source.id);
  const citation=`${source.authors} (${source.year}). ${source.title}.`;
  const copyCitation=async()=>{await navigator.clipboard.writeText(citation);flash("Citation copied")};
  const saveNote=e=>{e.preventDefault();addNote({text:note,sourceId:source.id,kind,page:"Personal note"});setNote("")};
  useEffect(()=>{let url="";loadPdfFile(source.id).then(file=>{if(file){url=URL.createObjectURL(file);setPdfUrl(url)}});return()=>{if(url)URL.revokeObjectURL(url)}},[source.id]);
  const captureClipboard=async()=>{try{const text=await navigator.clipboard.readText();if(text.trim()){setSelection(text.trim());flash("Copied PDF text captured")}}catch{flash("Copy text in the PDF, then paste it into the selection box")}};
  const saveSelection=()=>{if(!selection.trim())return;addNote({text:selection.trim(),sourceId:source.id,kind:selectionKind,page:"PDF selection"});setSelection("")};
  return <div className="source-reader">
    <header className="reader-header"><button onClick={onClose}><ArrowLeft/> Back to library</button><div><span className={`status ${source.status.toLowerCase()}`}>{source.status}</span><button onClick={()=>updateSource(source.id,{status:source.status==="Unread"?"Reading":source.status==="Reading"?"Read":"Unread"})}>Change status <ChevronDown/></button><button onClick={copyCitation}><Copy/> Copy citation</button></div></header>
    <div className="reader-title"><div className="reader-doc-icon">PDF</div><div><span>{source.type} · {source.year}</span><h1>{source.title}</h1><p>{source.authors}</p></div></div>
    <nav className="reader-tabs">{["Reader","Evidence","Details"].map(x=><button className={tab===x?"active":""} onClick={()=>setTab(x)} key={x}>{x}{x==="Evidence"&&<span>{sourceNotes.length}</span>}</button>)}</nav>
    {tab==="Reader"&&<div className="reader-layout"><article className="paper-reader">{pdfUrl?<iframe className="pdf-frame" src={`${pdfUrl}#toolbar=1&navpanes=0`} title={source.title}/>:<div className="paper-page"><header><span>{source.authors}</span><span>{source.year}</span></header><h2>{source.title}</h2><p className="abstract-label">DOCUMENT PREVIEW</p><p>{source.note||"No PDF file is stored for this source. Add a DOI or source URL in Details, or re-import the PDF."}</p><div className="reader-placeholder"><BookOpen/><span><b>Original document</b>{source.fileName||source.url||"No file or URL attached"}</span>{source.url&&<a href={source.url} target="_blank" rel="noreferrer">Open source <ArrowRight/></a>}</div></div>}</article><aside className="annotation-panel"><div><span>EVIDENCE FROM THIS SOURCE</span><b>{sourceNotes.length}</b></div>{pdfUrl&&<section className="selection-capture"><b>Save text from the PDF</b><p>Select and copy text in the document, then capture it here.</p><button type="button" className="ws-secondary" onClick={captureClipboard}><Copy/> Capture copied text</button><textarea value={selection} onChange={e=>setSelection(e.target.value)} placeholder="Copied passage appears here…"/><div><select value={selectionKind} onChange={e=>setSelectionKind(e.target.value)}><option>Evidence</option><option>Gap</option><option>Theory</option><option>Method</option></select><button type="button" className="ws-primary" disabled={!selection.trim()} onClick={saveSelection}><Highlighter/> Save selection</button></div></section>}<form onSubmit={saveNote}><label>Type<select value={kind} onChange={e=>setKind(e.target.value)}><option>Evidence</option><option>Gap</option><option>Theory</option><option>Method</option></select></label><label>Your own note<textarea required value={note} onChange={e=>setNote(e.target.value)} placeholder="Interpret the finding in your own words…"/></label><button className="ws-primary"><Highlighter/> Save note</button></form><div className="reader-notes">{sourceNotes.map(n=><article key={n.id}><span className={`note-kind ${n.kind.toLowerCase()}`}>{n.kind}</span><p>{n.text}</p><small>{n.page}</small></article>)}{!sourceNotes.length&&<div className="reader-notes-empty"><Quote/><p>No evidence saved from this source yet.</p></div>}</div></aside></div>}
    {tab==="Evidence"&&<div className="source-evidence-view"><div><h2>Evidence captured from this source</h2><p>Review the claims you extracted before using them in a synthesis.</p></div>{sourceNotes.length?<div className="source-evidence-list">{sourceNotes.map(n=><article key={n.id}><span className={`note-kind ${n.kind.toLowerCase()}`}>{n.kind}</span><blockquote>{n.text}</blockquote><small>{n.page}</small></article>)}</div>:<div className="empty-state"><Highlighter/><h3>No evidence yet</h3><p>Return to the Reader tab to capture your first finding.</p></div>}</div>}
    {tab==="Details"&&<div className="source-details"><section><h2>Bibliographic details</h2><div className="details-grid"><label>Title<input value={source.title} onChange={e=>updateSource(source.id,{title:e.target.value})}/></label><label>Authors<input value={source.authors} onChange={e=>updateSource(source.id,{authors:e.target.value})}/></label><label>Publication year<input value={source.year} onChange={e=>updateSource(source.id,{year:e.target.value})}/></label><label>Source type<select value={source.type} onChange={e=>updateSource(source.id,{type:e.target.value})}><option>PDF</option><option>Article</option><option>Empirical study</option><option>Systematic review</option><option>Theory</option></select></label><label className="full">DOI or URL<input value={source.url||""} onChange={e=>updateSource(source.id,{url:e.target.value})} placeholder="https://doi.org/..."/></label></div></section><section className="citation-preview"><span>APA CITATION PREVIEW</span><p>{citation}</p><button onClick={copyCitation}><Copy/> Copy citation</button></section></div>}
  </div>;
}

function LibraryView({ sources, notes, addSource, removeSource, updateSource, addNote, flash }) {
  const [query, setQuery] = useState("");
  const [statusFilter,setStatusFilter]=useState("All");
  const [typeFilter,setTypeFilter]=useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const [selected,setSelected]=useState(null);
  const [form, setForm] = useState({title:"",authors:"",year:"2026",type:"Article",url:""});
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const visible = sources.filter(s => `${s.title} ${s.authors} ${s.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase())&&(statusFilter==="All"||s.status===statusFilter)&&(typeFilter==="All"||s.type===typeFilter));
  const chooseFile = selected => {
    if (!selected) return;
    if (selected.type !== "application/pdf") return;
    setFile(selected);
    setForm(current => ({
      ...current,
      title: current.title || selected.name.replace(/\.pdf$/i, "").replace(/[-_]+/g, " "),
      type: "PDF",
    }));
  };
  const submit = async e => { e.preventDefault();const id=Date.now();if(file)await savePdfFile(id,file);addSource({...form,id,fileName:file?.name||"",fileSize:file?.size||0}); setShowAdd(false); setFile(null); setForm({title:"",authors:"",year:"2026",type:"Article",url:""}); };
  if(selected){const current=sources.find(s=>s.id===selected);if(current)return <SourceReader source={current} notes={notes} onClose={()=>setSelected(null)} updateSource={updateSource} addNote={addNote} flash={flash}/>}
  return <div className="ws-view">
    <div className="view-heading compact"><div><span className="view-kicker">PROJECT LIBRARY</span><h1>Sources</h1><p>Every paper, link, and document in this research project.</p></div><button className="ws-primary" onClick={() => setShowAdd(true)}><Plus/> Add source</button></div>
    <div className="library-tools"><label><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search title, author, or tag…"/></label><select aria-label="Source type" value={typeFilter} onChange={e=>setTypeFilter(e.target.value)}><option>All</option>{[...new Set(sources.map(s=>s.type))].map(x=><option key={x}>{x}</option>)}</select><select aria-label="Reading status" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}><option>All</option><option>Unread</option><option>Reading</option><option>Read</option></select><span>{visible.length} sources</span></div>
    <div className="source-table"><div className="table-head"><span>Source</span><span>Type</span><span>Status</span><span>Added</span><span/></div>{visible.map(s=><div className="table-row clickable" key={s.id} onClick={()=>setSelected(s.id)}><div className="source-main"><div className="pdf-icon">PDF</div><div><b>{s.title}</b><small>{s.authors} · {s.year}</small><div>{s.tags.map(t=><em key={t}>{t}</em>)}</div></div></div><span>{s.type}</span><button className={`status ${s.status.toLowerCase()}`} onClick={e=>{e.stopPropagation();updateSource(s.id,{status:s.status==="Unread"?"Reading":s.status==="Reading"?"Read":"Unread"})}}>{s.status}<ChevronDown/></button><span>Jul 27</span><button className="row-delete" onClick={e=>{e.stopPropagation();removeSource(s.id)}}><Trash2/></button></div>)}</div>
    {!visible.length && <div className="empty-state"><Search/><h3>No sources found</h3><p>Try another search or add a new paper to this project.</p></div>}
    {showAdd && <div className="modal-wrap" onMouseDown={e=>e.target===e.currentTarget&&setShowAdd(false)}><form className="source-modal" onSubmit={submit}><div className="modal-head"><div><span>ADD TO LIBRARY</span><h2>Bring in a source</h2></div><button type="button" onClick={()=>setShowAdd(false)}><X/></button></div><input ref={fileRef} hidden type="file" accept="application/pdf" onChange={e=>chooseFile(e.target.files?.[0])}/><button className={`dropzone ${file?"has-file":""}`} type="button" onClick={()=>fileRef.current?.click()} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();chooseFile(e.dataTransfer.files?.[0])}}><Upload/><b>{file?file.name:"Choose or drop a PDF"}</b><span>{file?`${(file.size/1024/1024).toFixed(1)} MB · Ready to add`:"PDF files up to 25 MB"}</span></button><label>Title<input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Paper or article title"/></label><div className="form-split"><label>Author(s)<input required value={form.authors} onChange={e=>setForm({...form,authors:e.target.value})} placeholder="Last name et al."/></label><label>Year<input value={form.year} onChange={e=>setForm({...form,year:e.target.value})}/></label></div><label>DOI or URL <small>optional</small><input value={form.url} onChange={e=>setForm({...form,url:e.target.value})} placeholder="https://doi.org/..."/></label><div className="modal-actions"><button type="button" className="ws-secondary" onClick={()=>setShowAdd(false)}>Cancel</button><button className="ws-primary">Add to library <ArrowRight/></button></div></form></div>}
  </div>;
}

function MapView({ sources, notes, addNote }) {
  const [selected, setSelected] = useState(null);
  const [layout, setLayout] = useState(0);
  const [adding, setAdding] = useState(false);
  const [noteText, setNoteText] = useState("");
  const positions = [[10,20],[40,9],[70,24],[25,58],[58,60],[78,69],[46,38],[8,72]];
  return <div className="ws-view map-view">
    <div className="view-heading compact"><div><span className="view-kicker">VISUAL SYNTHESIS</span><h1>Research map</h1><p>See themes, evidence, and gaps across your literature.</p></div><div className="map-actions"><button className="ws-secondary" onClick={()=>setLayout(x=>x+1)}><WandSparkles/> Auto-arrange</button><button className="ws-primary" onClick={()=>setAdding(true)}><Plus/> Add note</button></div></div>
    <div className="map-toolbar map-legend"><span><i className="legend-source"/>Sources</span><span><i className="legend-evidence"/>Evidence notes</span><span><i className="legend-gap"/>Research gaps</span><em>{sources.length} sources · {notes.length} notes</em></div>
    {sources.length ? <div className="research-canvas">
      <svg className="connections" viewBox="0 0 1000 600" preserveAspectRatio="none"><path d="M160 150 L465 90 L725 170 M160 150 L300 390 L500 270 L610 410 L805 450 M465 90 L500 270 L725 170 M300 390 L610 410"/></svg>
      <div className="theme-label tl1">STUDENT AGENCY</div><div className="theme-label tl2">FEEDBACK DESIGN</div>
      {sources.slice(0,8).map((s,i)=>{const pos=positions[(i+layout)%positions.length];return <button onClick={()=>setSelected(s)} style={{left:`${pos[0]}%`,top:`${pos[1]}%`}} className={`map-node ${selected?.id===s.id?"selected":""}`} key={s.id}><small>{s.type.toUpperCase()}</small><b>{s.title}</b><span>{s.authors} · {s.year}</span><em>{s.status}</em></button>})}
      {notes.slice(0,4).map((n,i)=><button className="map-note" style={{left:`${18+i*17}%`,top:`${42+(i%2)*28}%`}} key={n.id} onClick={()=>setSelected({note:true,title:n.text})}><Highlighter/><span>{n.text}</span></button>)}
      <button className="gap-node" onClick={()=>setSelected({gap:true,title:"Underexplored gap"})}><Sparkles/><span><small>RESEARCH GAP</small><b>Perceived control is rarely measured directly.</b></span></button>
    </div> : <div className="map-empty"><GitBranch/><h2>Your map will grow with your library.</h2><p>Add at least two sources to begin comparing themes, methods, and disagreements.</p></div>}
    {selected && <aside className="map-inspector"><button onClick={()=>setSelected(null)}><X/></button>{selected.note?<><span className="gap-tag">EVIDENCE NOTE</span><h2>{selected.title}</h2><p>This note is linked to the project evidence board.</p></>:selected.gap?<><span className="gap-tag">MARGIN INSIGHT</span><h2>{selected.title}</h2><p>This gap is inferred from the evidence currently saved in the project.</p><button className="ws-primary" onClick={()=>{addNote(`Research gap: ${selected.title}`);setSelected(null)}}>Save as evidence <ArrowRight/></button></>:<><span>{selected.type}</span><h2>{selected.title}</h2><p>{selected.authors} · {selected.year}</p><h3>Your note</h3><blockquote>{selected.note||"No evidence note yet."}</blockquote>{selected.url?<a className="ws-secondary" href={selected.url} target="_blank" rel="noreferrer">Open source <ArrowRight/></a>:<button className="ws-secondary" disabled>No source URL</button>}</>}</aside>}
    {adding&&<div className="modal-wrap"><form className="source-modal small-modal" onSubmit={e=>{e.preventDefault();addNote(noteText);setNoteText("");setAdding(false)}}><div className="modal-head"><div><span>MAP NOTE</span><h2>Add an analytical note</h2></div><button type="button" onClick={()=>setAdding(false)}><X/></button></div><label>Observation, connection, or question<textarea autoFocus required value={noteText} onChange={e=>setNoteText(e.target.value)} placeholder="What connection do you see across these sources?"/></label><div className="modal-actions"><button type="button" className="ws-secondary" onClick={()=>setAdding(false)}>Cancel</button><button className="ws-primary">Add to map</button></div></form></div>}
  </div>;
}

function EvidenceView({ notes, sources, addNote }) {
  const [kind,setKind]=useState("All");
  const [show,setShow]=useState(false);
  const [text,setText]=useState("");
  const [newKind,setNewKind]=useState("Evidence");
  const [sourceId,setSourceId]=useState("");
  const shown=kind==="All"?notes:notes.filter(n=>n.kind===kind);
  return <div className="ws-view"><div className="view-heading compact"><div><span className="view-kicker">EVIDENCE BOARD</span><h1>Claims worth keeping</h1><p>Quotes, findings, theories, and gaps—always linked to their source.</p></div><button className="ws-primary" onClick={()=>setShow(true)}><Plus/> New evidence</button></div><div className="evidence-filter">{["All","Evidence","Gap","Theory","Method"].map(x=><button className={kind===x?"active":""} onClick={()=>setKind(x)} key={x}>{x}</button>)}</div><div className="evidence-grid">{shown.map(n=>{const s=sources.find(x=>x.id===n.sourceId);return <article key={n.id}><span className={`note-kind ${n.kind.toLowerCase()}`}>{n.kind}</span><Quote/><blockquote>{n.text}</blockquote><div><b>{s?.title||"Independent note"}</b><span>{s?.authors} · {n.page}</span></div></article>})}<button className="new-evidence-card" onClick={()=>setShow(true)}><Plus/><b>Add evidence</b><span>Capture a finding or research gap.</span></button></div>{show&&<div className="modal-wrap"><form className="source-modal small-modal" onSubmit={e=>{e.preventDefault();addNote({text,kind:newKind,sourceId:sourceId?Number(sourceId):undefined});setText("");setShow(false)}}><div className="modal-head"><div><span>NEW EVIDENCE</span><h2>Capture the idea</h2></div><button type="button" onClick={()=>setShow(false)}><X/></button></div><div className="form-split"><label>Type<select value={newKind} onChange={e=>setNewKind(e.target.value)}><option>Evidence</option><option>Gap</option><option>Theory</option><option>Method</option></select></label><label>Source<select value={sourceId} onChange={e=>setSourceId(e.target.value)}><option value="">Independent note</option>{sources.map(s=><option value={s.id} key={s.id}>{s.title}</option>)}</select></label></div><label>Evidence or insight<textarea required autoFocus value={text} onChange={e=>setText(e.target.value)} placeholder="Write the claim in your own words…"/></label><div className="modal-actions"><button type="button" className="ws-secondary" onClick={()=>setShow(false)}>Cancel</button><button className="ws-primary">Save {newKind.toLowerCase()}</button></div></form></div>}</div>
}

function BriefsView({ project, notes, briefs, createBrief }) {
  const [generated,setGenerated]=useState(null);
  const generate=()=>{if(!notes.length)return;const brief={id:Date.now(),title:`Evidence brief: ${project.title}`,date:"Just now"};createBrief(brief);setGenerated(brief)};
  const exportBrief=()=>{const markdown=`# ${generated.title}\n\n**Research question:** ${project.question}\n\n## Evidence in this project\n\n${notes.map((n,i)=>`${i+1}. ${n.text} _(${n.page})_`).join("\n\n")}\n\n## Next analytical step\n\nCompare where these findings agree, where their methods differ, and which part of the research question remains unanswered.\n`;const blob=new Blob([markdown],{type:"text/markdown"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`${project.title.replace(/[^a-z0-9]+/gi,"-").toLowerCase()}-brief.md`;a.click();URL.revokeObjectURL(url)};
  return <div className="ws-view"><div className="view-heading compact"><div><span className="view-kicker">SYNTHESIS</span><h1>Research briefs</h1><p>Turn traceable evidence into a structured argument.</p></div><button className="ws-primary" disabled={!notes.length} onClick={generate}><Sparkles/> Generate brief</button></div>{generated?<div className="brief-editor"><div className="brief-toolbar"><span>Saved just now</span><div><button onClick={exportBrief}><FileDown/> Export Markdown</button><button onClick={()=>window.print()}><FileText/> Print</button></div></div><div className="brief-paper"><span>EVIDENCE BRIEF</span><h1>{generated.title}</h1><p className="brief-question">{project.question}</p><h2>Evidence in this project</h2><p>This working brief organizes the claims you saved while reading. Review each statement against its source before using it in academic work.</p>{notes.map((n,i)=><div className="citation-block" key={n.id}><sup>{i+1}</sup><p>{n.text}</p></div>)}<h2>Next analytical step</h2><p>Compare where these findings agree, where their methods differ, and which part of your research question remains unanswered.</p><div className="integrity"><Check/><span><b>Evidence check complete</b>Every item above comes from evidence saved in this project.</span></div></div></div>:<div className="brief-empty"><div className="brief-illustration"><FileText/><i/><i/></div><h2>{notes.length?"Turn your evidence into a clear brief.":"Capture evidence before generating a brief."}</h2><p>{notes.length?`Margin will organize ${notes.length} evidence note${notes.length===1?"":"s"} into a source-linked summary you can inspect and edit.`:"A useful brief needs real findings. Add a source, then save the claims that matter."}</p><button className="ws-primary" disabled={!notes.length} onClick={generate}><Sparkles/> Generate from this project</button><small>Margin never invents citations. Every claim stays connected to your library.</small></div>}{briefs.length>0&&!generated&&<div className="saved-briefs"><h2>Previous briefs</h2>{briefs.map(b=><button key={b.id} onClick={()=>setGenerated(b)}><FileText/><span><b>{b.title}</b><small>{b.date}</small></span><ArrowRight/></button>)}</div>}</div>
}

function NewProject({ addProject, setActive }) {
  const [title,setTitle]=useState("");const [question,setQuestion]=useState("");
  return <div className="ws-view new-project-view"><button className="back-link" onClick={() => setActive("Overview")}><ArrowLeft/> Current project</button><span className="view-kicker">NEW RESEARCH PROJECT</span><h1>Start with what you want to understand.</h1><p>Give the project a clear name and a working question. Both can evolve.</p><form onSubmit={e=>{e.preventDefault();addProject({title,question})}}><label>Project name<input required value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. AI feedback & student agency"/></label><label>Working research question<textarea required value={question} onChange={e=>setQuestion(e.target.value)} placeholder="What are you trying to understand?"/></label><div className="question-tip"><Sparkles/><span><b>A strong question names a relationship or tension.</b>Try “How does X affect Y in Z context?” rather than a broad topic.</span></div><button className="ws-primary">Create project <ArrowRight/></button></form></div>
}

function CommandMenu({ open, close, setActive, projects, sources, setProjectId }) {
  const [q,setQ]=useState(""); if(!open)return null;
  const actions=[["Go to Library","Library"],["Open Research map","Research map"],["View Evidence","Evidence"],["Create a Brief","Briefs"]];
  const projectMatches=projects.filter(x=>x.title.toLowerCase().includes(q.toLowerCase()));
  const sourceMatches=q?sources.filter(x=>`${x.title} ${x.authors}`.toLowerCase().includes(q.toLowerCase())).slice(0,4):[];
  return <div className="command-wrap" onMouseDown={e=>e.target===e.currentTarget&&close()}><div className="command-menu"><label><Search/><input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Search projects, sources, or jump to…"/><kbd>ESC</kbd></label><span>QUICK ACTIONS</span>{actions.filter(x=>x[0].toLowerCase().includes(q.toLowerCase())).map(x=><button key={x[1]} onClick={()=>{setActive(x[1]);close()}}><Command/><span>{x[0]}</span><ArrowRight/></button>)}{projectMatches.length>0&&<><span>PROJECTS</span>{projectMatches.map(p=><button key={p.id} onClick={()=>{setProjectId(p.id);setActive("Overview");close()}}><i className="command-project-dot" style={{background:p.color}}/><span>{p.title}</span><ArrowRight/></button>)}</>}{sourceMatches.length>0&&<><span>SOURCES</span>{sourceMatches.map(s=><button key={s.id} onClick={()=>{setProjectId(s.projectId);setActive("Library");close()}}><FileText/><span>{s.title}<small>{s.authors} · {s.year}</small></span><ArrowRight/></button>)}</>}</div></div>;
}

export default function Workspace({ account }) {
  const storageKey = `margin_workspace_v2_${account.id}`;
  const onboardingKey = `margin_onboarded_v2_${account.id}`;
  const [data,setData,ready]=useResearchStore(storageKey);
  const [onboarded,setOnboarded]=useState(null);
  const [active,setActive]=useState("Overview");
  const [projectId,setProjectId]=useState("ai-agency");
  const [mobileOpen,setMobileOpen]=useState(false);
  const [commandOpen,setCommandOpen]=useState(false);
  const [notice,setNotice]=useState("");
  useEffect(()=>{setOnboarded(localStorage.getItem(onboardingKey)==="true")},[onboardingKey]);
  useEffect(()=>{const requested=new URLSearchParams(window.location.search).get("project");if(requested&&data.projects.some(p=>p.id===requested))setProjectId(requested)},[ready]);
  useEffect(()=>{if(projectId&&ready)window.history.replaceState(null,"",`/workspace?project=${encodeURIComponent(projectId)}`)},[projectId,ready]);
  useEffect(()=>{const fn=e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();setCommandOpen(true)}if(e.key==="Escape")setCommandOpen(false)};addEventListener("keydown",fn);return()=>removeEventListener("keydown",fn)},[]);
  const project=data.projects.find(p=>p.id===projectId)||data.projects[0];
  const sources=data.sources.filter(s=>s.projectId===project?.id);
  const notes=data.notes.filter(n=>n.projectId===project?.id);
  const completeOnboarding=({topic})=>{const id=`project-${Date.now()}`;const p={id,title:topic,question:`What does current research reveal about ${topic}?`,updated:"Just now",color:"#ffd0c7",sources:0};setData(d=>({...d,projects:[p],sources:[],notes:[],briefs:[]}));setProjectId(id);localStorage.setItem(onboardingKey,"true");setOnboarded(true)};
  const flash=message=>{setNotice(message);setTimeout(()=>setNotice(""),2600)};
  const addSource=form=>{setData(d=>({...d,sources:[...d.sources,{...form,id:form.id||Date.now(),projectId:project.id,status:"Unread",tags:["new"],note:""}]}));flash("Source added to your library")};
  const removeSource=id=>{setData(d=>({...d,sources:d.sources.filter(s=>s.id!==id),notes:d.notes.filter(n=>n.sourceId!==id)}));flash("Source removed")};
  const updateSource=(id,patch)=>setData(d=>({...d,sources:d.sources.map(s=>s.id===id?{...s,...patch}:s)}));
  const addNote=input=>{const entry=typeof input==="string"?{text:input}:{...input};setData(d=>({...d,notes:[...d.notes,{id:Date.now(),projectId:project.id,sourceId:entry.sourceId??sources[0]?.id,text:entry.text,page:entry.page||"Personal note",kind:entry.kind||"Evidence"}]}));flash("Evidence saved")};
  const createBrief=brief=>{setData(d=>({...d,briefs:[brief,...d.briefs]}));flash("Brief generated from your evidence")};
  const addProject=p=>{const id=p.title.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"")+Date.now().toString().slice(-3);setData(d=>({...d,projects:[{...p,id,updated:"Just now",color:"#ffd0c7",sources:0},...d.projects]}));setProjectId(id);setActive("Overview");flash("Project created")};
  if(!ready||onboarded===null)return <div className="ws-loading"><Mark/><span/></div>;
  if(!onboarded)return <Onboarding onComplete={completeOnboarding}/>;
  return <main className="workspace-shell">
    <Sidebar active={active} setActive={setActive} projects={data.projects} projectId={project?.id} setProjectId={setProjectId} open={mobileOpen} setOpen={setMobileOpen} account={account} setCommandOpen={setCommandOpen} usageCount={data.sources.length}/>
    <div className="workspace-main"><Topbar project={project} setOpen={setMobileOpen} setCommandOpen={setCommandOpen}/>
      {active==="Overview"&&<Overview project={project} sources={sources} notes={notes} setActive={setActive}/>}
      {active==="Library"&&<LibraryView sources={sources} notes={notes} addSource={addSource} removeSource={removeSource} updateSource={updateSource} addNote={addNote} flash={flash}/>}
      {active==="Research map"&&<MapView sources={sources} notes={notes} addNote={addNote}/>}
      {active==="Evidence"&&<EvidenceView notes={notes} sources={sources} addNote={addNote}/>}
      {active==="Briefs"&&<BriefsView project={project} notes={notes} briefs={data.briefs} createBrief={createBrief}/>}
      {active==="New project"&&<NewProject addProject={addProject} setActive={setActive}/>}
    </div>
    {mobileOpen&&<div className="mobile-scrim" onClick={()=>setMobileOpen(false)}/>}
    <CommandMenu open={commandOpen} close={()=>setCommandOpen(false)} setActive={setActive} projects={data.projects} sources={data.sources} setProjectId={setProjectId}/>
    {notice&&<div className="ws-toast"><Check/><span>{notice}</span></div>}
  </main>;
}
