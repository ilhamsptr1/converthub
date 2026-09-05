import Link from "next/link";
import { Button } from "@/components/ui/button";
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

// Social media icons as inline SVG components
const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);
const TikTokIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.5a8.18 8.18 0 0 0 4.78 1.52V6.57a4.85 4.85 0 0 1-1.01.12z"/>
  </svg>
);
const GitHubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);
const LinkedInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

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
          </nav>

          {/* Social Icons in Navbar */}
          <div className="flex items-center gap-4 text-gray-500">
            <a href="https://www.instagram.com/ilhammsptra_/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-colors" aria-label="Instagram">
              <InstagramIcon />
            </a>
            <a href="https://www.tiktok.com/@ninetofive925" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors" aria-label="TikTok">
              <TikTokIcon />
            </a>
            <a href="https://github.com/ilhamsptr1" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors" aria-label="GitHub">
              <GitHubIcon />
            </a>
            <a href="https://www.linkedin.com/in/ilham-saputra-61003b32a/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors" aria-label="LinkedIn">
              <LinkedInIcon />
            </a>
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

        {/* TOOLS GRID */}
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
                <div className="premium-card p-10 relative z-10 flex flex-col items-center justify-center text-center gap-4">
                  <div className="flex gap-4">
                    <a href="https://www.instagram.com/ilhammsptra_/" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md">
                      <InstagramIcon />
                    </a>
                    <a href="https://www.tiktok.com/@ninetofive925" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md">
                      <TikTokIcon />
                    </a>
                    <a href="https://github.com/ilhamsptr1" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-2xl bg-gray-800 flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md">
                      <GitHubIcon />
                    </a>
                    <a href="https://www.linkedin.com/in/ilham-saputra-61003b32a/" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md">
                      <LinkedInIcon />
                    </a>
                  </div>
                  <p className="font-semibold text-gray-800 mt-2">Made by Ilham Saputra</p>
                  <p className="text-sm text-gray-500">Follow me on social media for updates!</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-32 px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold tracking-tight mb-6">Ready to streamline your work?</h2>
            <p className="text-gray-500 text-lg mb-10">Start converting files instantly — completely free.</p>
            <Button asChild size="lg" className="text-base font-medium px-10 h-12 bg-black text-white hover:bg-gray-800 rounded-full shadow-lg">
              <Link href="/tools">Get started now</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 bg-white py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-black flex items-center justify-center text-white font-bold text-xs">I</div>
            <span className="font-semibold">Iconvert</span>
          </div>

          <p className="text-sm text-gray-400 text-center">
            © {new Date().getFullYear()} Ilham Saputra
          </p>

          <div className="flex items-center gap-4 text-gray-400">
            <a href="https://www.instagram.com/ilhammsptra_/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-colors"><InstagramIcon /></a>
            <a href="https://www.tiktok.com/@ninetofive925" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors"><TikTokIcon /></a>
            <a href="https://github.com/ilhamsptr1" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors"><GitHubIcon /></a>
            <a href="https://www.linkedin.com/in/ilham-saputra-61003b32a/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors"><LinkedInIcon /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
