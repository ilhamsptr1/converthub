import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileDown, FileText, Image as ImageIcon, Lock, ShieldCheck, Music, Video, Star } from "@/components/icons";

const tools = [
  { title: "PDF to Word",    slug: "pdf-to-word",    desc: "Convert PDFs to editable Word documents.", icon: FileText, color: "#2563eb", bg: "#eff6ff" },
  { title: "Word to PDF",    slug: "word-to-pdf",    desc: "Create pixel-perfect PDFs from Word.",     icon: FileText, color: "#7c3aed", bg: "#f5f3ff" },
  { title: "Compress PDF",   slug: "compress-pdf",   desc: "Reduce file size without losing quality.", icon: FileDown, color: "#dc2626", bg: "#fef2f2" },
  { title: "Merge PDF",      slug: "merge-pdf",      desc: "Combine multiple PDFs into one file.",     icon: FileDown, color: "#ea580c", bg: "#fff7ed" },
  { title: "Split PDF",      slug: "split-pdf",      desc: "Extract pages from your PDF file.",        icon: FileText, color: "#059669", bg: "#ecfdf5" },
  { title: "Protect PDF",    slug: "protect-pdf",    desc: "Add a secure password to your PDF.",       icon: Lock,     color: "#e11d48", bg: "#fff1f2" },
  { title: "JPG to PNG",     slug: "jpg-to-png",     desc: "Convert images to transparent PNGs.",      icon: ImageIcon,color: "#0891b2", bg: "#ecfeff" },
  { title: "PNG to JPG",     slug: "png-to-jpg",     desc: "Compress PNGs to lightweight JPGs.",       icon: ImageIcon,color: "#0284c7", bg: "#f0f9ff" },
  { title: "Compress Image", slug: "compress-image", desc: "Shrink image files for faster loading.",   icon: ImageIcon,color: "#65a30d", bg: "#f7fee7" },
  { title: "MP4 to MP3",     slug: "mp4-to-mp3",     desc: "Extract high-quality audio from video.",   icon: Music,    color: "#d97706", bg: "#fffbeb" },
  { title: "WAV to MP3",     slug: "wav-to-mp3",     desc: "Convert raw audio to compressed MP3.",     icon: Music,    color: "#ca8a04", bg: "#fefce8" },
  { title: "Compress Video", slug: "compress-video", desc: "Reduce video size for easy sharing.",      icon: Video,    color: "#9333ea", bg: "#faf5ff" },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] text-[#09090b] selection:bg-black selection:text-white">

      {/* HEADER */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-black/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded bg-black flex items-center justify-center text-white font-bold text-lg group-hover:bg-gray-800 transition-colors">
              I
            </div>
            <span className="text-[1.1rem] font-bold tracking-tight">Iconvert</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
            <Link href="/tools" className="hover:text-black transition-colors">All Tools</Link>
            <Link href="/pricing" className="hover:text-black transition-colors">Pricing</Link>
            <Link href="/about" className="hover:text-black transition-colors">About</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-500 hover:text-black transition-colors hidden sm:block">
              Log in
            </Link>
            <Button asChild className="text-sm font-medium px-5 h-9 bg-black text-white hover:bg-gray-800 rounded-full">
              <Link href="/signup">Sign up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">

        {/* HERO */}
        <section className="relative pt-24 pb-32 px-6 overflow-hidden hero-pattern">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#fafafa] pointer-events-none" />
          
          <div className="relative max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 shadow-sm text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Over 2 million files converted securely
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 gradient-text-subtle leading-[1.1]">
              The simple way to <br className="hidden md:block" />
              convert your files.
            </h1>
            
            <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
              Professional-grade file conversion without the clutter. Drag, drop, and download in seconds. No installation required.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="text-base font-medium px-8 h-12 bg-black text-white hover:bg-gray-800 rounded-full shadow-lg shadow-black/10 transition-transform hover:-translate-y-0.5">
                <Link href="/tools">Explore all tools</Link>
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 mt-12 text-sm font-medium text-gray-400">
              <span className="flex items-center gap-2"><ShieldCheck size={16} /> Bank-level encryption</span>
              <span className="flex items-center gap-2"><Lock size={16} /> Auto-deleted in 1 hour</span>
              <span className="flex items-center gap-2"><Star size={16} /> Zero quality loss</span>
            </div>
          </div>
        </section>

        {/* TOOLS GRID (Bento Box Style) */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="mb-16 md:flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-3">Powerful utilities.</h2>
                <p className="text-gray-500 text-lg">Everything you need to manage your documents and media.</p>
              </div>
              <Link href="/tools" className="text-blue-600 font-medium hover:underline hidden md:block">
                View all 12 tools &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool, i) => (
                <Link href={`/${tool.slug}`} key={i} className="block group">
                  <div className="premium-card p-6 h-full flex flex-col">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110" style={{background: tool.bg}}>
                      <tool.icon size={24} style={{color: tool.color}} />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{tool.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{tool.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-20 items-center">
              <div>
                <h2 className="text-4xl font-bold tracking-tight mb-6">Designed for privacy.</h2>
                <p className="text-lg text-gray-500 mb-10 leading-relaxed">
                  We believe your files belong to you. That's why our infrastructure is built with privacy at its core.
                </p>
                <div className="space-y-8">
                  {[
                    { title: "End-to-end encryption", desc: "Your files are encrypted using AES-256 during transfer. No one can intercept them." },
                    { title: "Automatic deletion", desc: "Every file you upload or convert is permanently purged from our servers after exactly one hour." },
                    { title: "No data mining", desc: "We don't analyze, read, or sell the contents of your documents. Our business is conversion, not data." },
                  ].map((f, i) => (
                    <div key={i}>
                      <h4 className="font-semibold text-lg mb-1">{f.title}</h4>
                      <p className="text-gray-500">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-blue-50 blur-[100px] rounded-full" />
                <div className="premium-card p-10 relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-bold">M</div>
                    <div>
                      <h5 className="font-semibold">Markus</h5>
                      <p className="text-sm text-gray-500">Legal Consultant</p>
                    </div>
                  </div>
                  <p className="text-lg font-medium leading-relaxed mb-6">
                    "As someone handling NDAs and contracts daily, I needed a tool I could actually trust. Iconvert's auto-delete policy and clean interface makes it the only converter I use."
                  </p>
                  <div className="flex gap-1 text-yellow-400">
                    <Star size={20} fill="currentColor" />
                    <Star size={20} fill="currentColor" />
                    <Star size={20} fill="currentColor" />
                    <Star size={20} fill="currentColor" />
                    <Star size={20} fill="currentColor" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="py-24 px-6 bg-white border-y border-gray-100">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Pricing that scales with you.</h2>
              <p className="text-gray-500 text-lg">No hidden fees. Cancel anytime.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { name: "Basic", price: "Free", desc: "Perfect for occasional use.", btn: "Start for free", features: ["10 conversions / day", "100MB file limit", "Standard speed"] },
                { name: "Pro", price: "$9", sub: "/mo", desc: "For heavy workflows.", btn: "Get Pro", features: ["Unlimited conversions", "2GB file limit", "Priority processing", "No ads"], highlight: true },
                { name: "Teams", price: "$29", sub: "/seat", desc: "For organizations.", btn: "Contact sales", features: ["5GB file limit", "Centralized billing", "Dedicated support", "Custom retention"] },
              ].map((p, i) => (
                <div key={i} className={`p-8 rounded-2xl ${p.highlight ? 'bg-black text-white shadow-xl scale-105 relative z-10' : 'bg-white border border-gray-200'}`}>
                  <h3 className={`font-semibold mb-2 ${p.highlight ? 'text-gray-300' : 'text-gray-500'}`}>{p.name}</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-4xl font-bold tracking-tight">{p.price}</span>
                    {p.sub && <span className={p.highlight ? 'text-gray-400' : 'text-gray-500'}>{p.sub}</span>}
                  </div>
                  <p className={`text-sm mb-8 ${p.highlight ? 'text-gray-300' : 'text-gray-500'}`}>{p.desc}</p>
                  
                  <Button className={`w-full mb-8 rounded-full h-10 ${p.highlight ? 'bg-white text-black hover:bg-gray-100' : 'bg-black text-white hover:bg-gray-800'}`}>
                    {p.btn}
                  </Button>

                  <ul className="space-y-4">
                    {p.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-3 text-sm">
                        <CheckIcon color={p.highlight ? "#fff" : "#000"} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-32 px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold tracking-tight mb-6">Ready to streamline your work?</h2>
            <p className="text-gray-500 text-lg mb-10">Join over 2 million users who trust Iconvert daily.</p>
            <Button asChild size="lg" className="text-base font-medium px-10 h-12 bg-black text-white hover:bg-gray-800 rounded-full shadow-lg">
              <Link href="/tools">Get started now</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 bg-white pt-16 pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-6 h-6 rounded bg-black flex items-center justify-center text-white font-bold text-xs">I</div>
                <span className="font-semibold">Iconvert</span>
              </div>
              <p className="text-sm text-gray-500 max-w-xs">
                The professional toolkit for all your file conversion needs. Built for speed, designed for privacy.
              </p>
            </div>
            
            {[
              { title: "Tools", links: ["PDF to Word", "Compress PDF", "Merge PDF", "All Tools"] },
              { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
              { title: "Legal", links: ["Privacy", "Terms", "Security"] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="font-semibold text-sm mb-4">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <Link href="#" className="text-sm text-gray-500 hover:text-black transition-colors">{link}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <p>© {new Date().getFullYear()} Iconvert Inc. All rights reserved.</p>
            <p>San Francisco, CA</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function CheckIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6L9 17L4 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
