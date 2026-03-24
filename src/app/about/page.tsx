import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { JsonLd, breadcrumbSchema } from "@/lib/seo";
import { buildMetadata } from "@/lib/metadata";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "Synapse is a premium intelligence platform for AI and technology — covering large language models, alignment research, compute economics, and the systems reshaping civilization.",
  path: "/about",
});

const TEAM = [
  { name: "Alex Chen", role: "Founder & Editor", bio: "Former AI researcher. Writes on LLMs and alignment.", initial: "A" },
  { name: "Sarah Mitchell", role: "Senior Writer", bio: "ML engineer turned science communicator.", initial: "S" },
  { name: "James Park", role: "Engineering Editor", bio: "Distributed systems, cloud infra, and AI ops.", initial: "J" },
];

export default function AboutPage() {
  const breadcrumbs = [{ label: "About", href: "/about" }];

  return (
    <main className="min-h-screen bg-[var(--bg-primary)]">
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: BASE_URL },
        { name: "About", url: `${BASE_URL}/about` },
      ])} />
      <Navbar />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-36 pb-24">
        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-px bg-neon-blue" />
            <span className="text-xs font-semibold tracking-widest uppercase text-neon-blue">About</span>
          </div>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-[var(--text-primary)] tracking-tight mb-6">
            Intelligence for the{" "}
            <span className="gradient-text">AI era</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl">
            Synapse is a publication for people who want to think clearly about artificial intelligence
            — its capabilities, its limits, and its implications for society. We write for researchers,
            engineers, founders, and the intellectually curious.
          </p>
        </div>

        {/* Mission */}
        <div className="glass border border-[var(--glass-border)] rounded-2xl p-8 mb-12">
          <h2 className="font-display font-bold text-2xl text-[var(--text-primary)] mb-4 tracking-tight">Our Mission</h2>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
            The AI landscape moves faster than any single person can track. Synapse exists to distill
            the signal from the noise — giving you deeply reported articles that help you understand
            what&apos;s actually happening, why it matters, and what comes next.
          </p>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            We believe that clarity about AI is one of the most important skills for the next decade.
            Every piece we publish is designed to help you think more precisely about these systems.
          </p>
        </div>

        {/* Team */}
        <div>
          <h2 className="font-display font-bold text-2xl text-[var(--text-primary)] mb-8 tracking-tight">The Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {TEAM.map((member) => (
              <div key={member.name} className="glass border border-[var(--glass-border)] rounded-xl p-6 hover:border-neon-blue/25 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-white font-bold text-lg mb-4">
                  {member.initial}
                </div>
                <h3 className="font-display font-bold text-[var(--text-primary)] mb-0.5">{member.name}</h3>
                <p className="text-xs text-neon-blue mb-3">{member.role}</p>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
