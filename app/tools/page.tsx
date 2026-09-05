"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, FileText, FileDown, Image as ImageIcon, Video, Music, Lock, BookOpen } from "@/components/icons";
import { Button } from "@/components/ui/button";

const allTools = [
  { id: "pdf-to-word", name: "PDF to Word", desc: "Convert PDF to editable DOCX", category: "document", icon: FileText },
  { id: "word-to-pdf", name: "Word to PDF", desc: "Convert DOCX to PDF format", category: "document", icon: FileText },
  { id: "compress-pdf", name: "Compress PDF", desc: "Reduce file size instantly", category: "document", icon: FileDown },
  { id: "merge-pdf", name: "Merge PDF", desc: "Combine multiple PDFs into one", category: "document", icon: FileText },
  { id: "split-pdf", name: "Split PDF", desc: "Extract pages from your PDF", category: "document", icon: FileText },
  { id: "jpg-to-png", name: "JPG to PNG", desc: "Lossless image conversion", category: "image", icon: ImageIcon },
  { id: "png-to-jpg", name: "PNG to JPG", desc: "Convert PNG to compressed JPG", category: "image", icon: ImageIcon },
  { id: "compress-image", name: "Compress Image", desc: "Reduce image file size", category: "image", icon: ImageIcon },
  { id: "mp4-to-mp3", name: "MP4 to MP3", desc: "Extract audio from video", category: "audio", icon: Music },
  { id: "wav-to-mp3", name: "WAV to MP3", desc: "Compress audio files", category: "audio", icon: Music },
  { id: "compress-video", name: "Compress Video", desc: "Reduce video file size", category: "video", icon: Video },
  { id: "ai-summarize", name: "AI Summarize", desc: "Summarize large documents", category: "ai", icon: BookOpen },
  { id: "protect-pdf", name: "Protect PDF", desc: "Add password to your PDF", category: "document", icon: Lock },
];

export default function ToolsDirectory() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = allTools.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header (Simplified for Tools Page) */}
      <header className="flex items-center justify-between px-6 py-4 border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="text-xl font-bold tracking-tight">ConvertHub</Link>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild><Link href="/app">Dashboard</Link></Button>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">All Tools</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Explore our complete suite of file conversion and AI tools.
          </p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <Input 
              type="text" 
              placeholder="Search tools (e.g. 'PDF', 'Compress')" 
              className="pl-10 h-12 text-base rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {searchQuery ? (
          <div>
            <h2 className="text-lg font-semibold mb-4">Search Results ({filteredTools.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTools.map((tool) => (
                <Link href={`/${tool.id}`} key={tool.id}>
                  <Card className="hover:shadow-md transition-all hover:border-primary cursor-pointer h-full">
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <tool.icon size={24} />
                      </div>
                      <CardTitle className="text-base">{tool.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{tool.desc}</CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              ))}
              {filteredTools.length === 0 && (
                <div className="col-span-full py-12 text-center text-muted-foreground">
                  No tools found matching "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <div className="flex justify-center mb-8 overflow-x-auto pb-2">
              <TabsList className="bg-muted/50 rounded-xl p-1 h-auto">
                <TabsTrigger value="all" className="rounded-lg px-6 py-2">All</TabsTrigger>
                <TabsTrigger value="document" className="rounded-lg px-6 py-2">Document</TabsTrigger>
                <TabsTrigger value="image" className="rounded-lg px-6 py-2">Image</TabsTrigger>
                <TabsTrigger value="audio" className="rounded-lg px-6 py-2">Audio</TabsTrigger>
                <TabsTrigger value="video" className="rounded-lg px-6 py-2">Video</TabsTrigger>
                <TabsTrigger value="ai" className="rounded-lg px-6 py-2">AI Tools</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allTools.map((tool) => (
                  <Link href={`/${tool.id}`} key={tool.id}>
                    <Card className="hover:shadow-md transition-all hover:border-primary cursor-pointer h-full">
                      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                          <tool.icon size={24} />
                        </div>
                        <CardTitle className="text-base">{tool.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{tool.desc}</CardDescription>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </TabsContent>

            {['document', 'image', 'audio', 'video', 'ai'].map((category) => (
              <TabsContent value={category} key={category} className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allTools.filter(t => t.category === category).map((tool) => (
                    <Link href={`/${tool.id}`} key={tool.id}>
                      <Card className="hover:shadow-md transition-all hover:border-primary cursor-pointer h-full">
                        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                          <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <tool.icon size={24} />
                          </div>
                          <CardTitle className="text-base">{tool.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription>{tool.desc}</CardDescription>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </main>
    </div>
  );
}
