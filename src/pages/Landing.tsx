import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";

const fadeUp = {
  initial: { opacity: 0, y: 10 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
};

const CAPABILITIES = [
  {
    label: "01",
    title: "Instances",
    body: "Every install is an isolated instance: its own Minecraft version, mod loader, renderer and Java runtime. Duplicate, edit, delete — nothing leaks between them.",
  },
  {
    label: "02",
    title: "Renderers & runtimes",
    body: "LTW, Mobile Glues, Zink or Virgl; JRE 8, 17 or 21. Set them per instance and per version, tuned to the device you hold.",
  },
  {
    label: "03",
    title: "Controls",
    body: "A touch-control layer with an editable layout system, gyro aiming, and a controller proxy for the TouchController mod.",
  },
];

const SOURCE_LINES = [
  {
    line: "Play line",
    pkg: "ca.dnamobile.droidbridgelauncher",
    repo: "DNAMobileApplications/DroidBridgeLauncherGplayGithub",
    detail: "253 Java files, full res tree, mesa AAR, nativeglfw module",
    authored: "app/build.gradle re-authored",
  },
  {
    line: "OFFLINE line",
    pkg: "ca.dnamobile.javalauncher",
    repo: "cheesakeyk/OFFLINE-FORK",
    detail: "Pojav-derived runtime, full JNI tree, agent sources",
    authored: "manifest, splash layout, Gradle files re-authored",
  },
];

const STATS = [
  { value: "361", label: "Java files" },
  { value: "63", label: "JNI sources" },
  { value: "3", label: "Gradle modules" },
  { value: "0.2.15", label: "APK baseline" },
];

export default function Landing() {
  const changelog = useQuery(api.changelog.list);
  const latest = changelog?.[0];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <a href="/" className="text-sm font-medium tracking-tight">
            DroidBridge
          </a>
          <nav className="flex items-center gap-1">
            <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
              <a href="#source">Source</a>
            </Button>
            <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
              <a href="#build">Build</a>
            </Button>
            <Button asChild size="sm">
              <a href="/dashboard">
                Open console
                <ArrowRight className="ml-1.5 size-3.5" />
              </a>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pb-24 pt-28 md:pt-40">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mono-label"
        >
          Android · Minecraft: Java Edition
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-3xl text-balance text-5xl font-medium leading-[1.05] tracking-tight md:text-7xl"
        >
          Java Edition,
          <br />
          on your phone.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 max-w-xl text-base leading-7 text-muted-foreground md:text-lg md:leading-8"
        >
          DroidBridge Launcher manages instances, renderers and controls for
          running Minecraft: Java Edition on Android. Its complete Android
          source lives in this repository — Gradle files included.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <Button asChild size="lg" className="h-11 px-7 text-sm">
            <a href="/dashboard">Open the console</a>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-11 px-7 text-sm">
            <a href="#build">Build it yourself</a>
          </Button>
        </motion.div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-border/70">
        <div className="mx-auto grid max-w-5xl grid-cols-2 px-6 md:grid-cols-4">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`py-10 md:py-12 ${i !== 0 ? "md:border-l md:border-border/70 md:pl-8" : ""}`}
            >
              <p className="text-3xl font-medium tabular-nums tracking-tight md:text-4xl">
                {s.value}
              </p>
              <p className="mono-label mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Capabilities */}
      <section className="mx-auto max-w-5xl px-6 py-24 md:py-32">
        <motion.div {...fadeUp}>
          <p className="mono-label">What it does</p>
          <h2 className="mt-4 max-w-2xl text-balance text-3xl font-medium tracking-tight md:text-4xl">
            Three concerns, handled precisely.
          </h2>
        </motion.div>
        <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-0">
          {CAPABILITIES.map((c, i) => (
            <motion.div
              key={c.label}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.08 }}
              className={`md:px-10 ${i !== 0 ? "md:border-l md:border-border/70" : "md:pl-0"} ${i === 0 ? "md:pr-10" : ""}`}
            >
              <p className="text-xs tabular-nums text-muted-foreground">{c.label}</p>
              <h3 className="mt-4 text-lg font-medium tracking-tight">{c.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{c.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Source */}
      <section id="source" className="border-t border-border/70 bg-muted/40">
        <div className="mx-auto max-w-5xl px-6 py-24 md:py-32">
          <motion.div {...fadeUp}>
            <p className="mono-label">The source, decoded</p>
            <h2 className="mt-4 max-w-2xl text-balance text-3xl font-medium tracking-tight md:text-4xl">
              One APK, two public source lines.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground">
              The <span className="text-foreground">DroidBridge.Launcher-v0.2.15.OFFLINE.apk</span>{" "}
              you started from unpacks to two distinct builds. Both lines are
              assembled here as buildable Gradle projects under{" "}
              <code className="rounded bg-background px-1.5 py-0.5 text-[13px]">android/</code>.
            </p>
          </motion.div>

          <motion.div {...fadeUp} className="mt-14 overflow-hidden border border-border/70 bg-background">
            <div className="hidden grid-cols-[1fr_1.4fr_1.6fr] border-b border-border/70 md:grid">
              <div className="px-6 py-3"><p className="mono-label">Line</p></div>
              <div className="border-l border-border/70 px-6 py-3"><p className="mono-label">Package</p></div>
              <div className="border-l border-border/70 px-6 py-3"><p className="mono-label">Contents</p></div>
            </div>
            {SOURCE_LINES.map((s) => (
              <div
                key={s.line}
                className="grid border-b border-border/70 last:border-b-0 md:grid-cols-[1fr_1.4fr_1.6fr]"
              >
                <div className="px-6 pb-4 pt-6 md:py-6">
                  <p className="text-sm font-medium">{s.line}</p>
                </div>
                <div className="border-border/70 px-6 pb-2 md:border-l md:py-6">
                  <code className="text-[13px]">{s.pkg}</code>
                </div>
                <div className="border-border/70 px-6 pb-6 md:border-l md:py-6">
                  <p className="text-sm leading-6 text-muted-foreground">{s.detail}</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground/80">
                    {s.authored} · upstream: {s.repo}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.p {...fadeUp} className="mt-6 text-xs leading-5 text-muted-foreground/80">
            Manifests, Gradle build files and wrapper properties missing from the
            public drops were re-authored and are marked as such inside the tree.
            Prebuilt native binaries are not public — build from source or extract
            them from an APK you own.
          </motion.p>
        </div>
      </section>

      {/* Changelog */}
      <section className="border-t border-border/70">
        <div className="mx-auto max-w-5xl px-6 py-24 md:py-32">
          <motion.div {...fadeUp} className="flex items-end justify-between">
            <div>
              <p className="mono-label">Changelog</p>
              <h2 className="mt-4 text-3xl font-medium tracking-tight md:text-4xl">
                Shipped, recently.
              </h2>
            </div>
            {latest && (
              <p className="hidden text-sm text-muted-foreground md:block">
                Latest: {latest.version}
              </p>
            )}
          </motion.div>
          <div className="mt-14">
            {changelog === undefined ? (
              <div className="space-y-10">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-12 animate-pulse bg-muted/60" />
                ))}
              </div>
            ) : changelog.length === 0 ? (
              <p className="text-sm text-muted-foreground">No releases yet.</p>
            ) : (
              changelog.slice(0, 4).map((entry) => (
                <motion.div
                  key={entry._id}
                  {...fadeUp}
                  className="grid gap-3 border-t border-border/70 py-8 md:grid-cols-[180px_1fr] md:gap-10"
                >
                  <div>
                    <p className="text-sm font-medium tabular-nums">{entry.version}</p>
                    <p className="mono-label mt-1.5">
                      {entry.channel} ·{" "}
                      {new Date(entry.releasedAt).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <ul className="space-y-1.5">
                    {entry.highlights.map((h) => (
                      <li key={h} className="text-sm leading-6 text-muted-foreground">
                        {h}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Build */}
      <section id="build" className="border-t border-border/70 bg-muted/40">
        <div className="mx-auto max-w-5xl px-6 py-24 md:py-32">
          <motion.div {...fadeUp}>
            <p className="mono-label">Build</p>
            <h2 className="mt-4 max-w-2xl text-balance text-3xl font-medium tracking-tight md:text-4xl">
              From clone to APK in three lines.
            </h2>
          </motion.div>
          <motion.div {...fadeUp} className="mt-12 grid gap-10 md:grid-cols-[1fr_1.2fr]">
            <ol className="space-y-6">
              {[
                {
                  n: "1",
                  t: "Get the tree",
                  d: "Push android/ to your GitHub repository — the README walks through it.",
                },
                {
                  n: "2",
                  t: "Open in Android Studio",
                  d: "Let it sync the wrapper (Gradle 8.14.1, AGP 8.10.1, NDK r27).",
                },
                {
                  n: "3",
                  t: "Assemble",
                  d: "Run assembleDebug for the Play line, or wire the OFFLINE variant from settings.gradle.",
                },
              ].map((s) => (
                <li key={s.n} className="flex gap-5">
                  <span className="text-sm tabular-nums text-muted-foreground">{s.n}</span>
                  <div>
                    <p className="text-sm font-medium">{s.t}</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="border border-border/70 bg-background">
              <div className="flex items-center justify-between border-b border-border/70 px-4 py-2.5">
                <p className="mono-label">terminal</p>
                <ArrowUpRight className="size-3.5 text-muted-foreground" />
              </div>
              <pre className="overflow-x-auto px-4 py-4 text-[13px] leading-7">
                <code>
                  <span className="text-muted-foreground">$</span> git clone
                  https://github.com/you/droidbridge-launcher{"\n"}
                  <span className="text-muted-foreground">$</span> cd
                  droidbridge-launcher/android{"\n"}
                  <span className="text-muted-foreground">$</span> ./gradlew
                  assembleDebug
                </code>
              </pre>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-border/70">
        <div className="mx-auto max-w-5xl px-6 py-28 text-center md:py-36">
          <motion.h2
            {...fadeUp}
            className="mx-auto max-w-2xl text-balance text-3xl font-medium tracking-tight md:text-5xl"
          >
            Manage your instances.
          </motion.h2>
          <motion.div {...fadeUp} className="mt-10">
            <Button asChild size="lg" className="h-11 px-8 text-sm">
              <a href="/dashboard">Open the console</a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/70">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <p className="text-sm font-medium">DroidBridge</p>
            <div className="flex flex-wrap gap-x-8 gap-y-2">
              <a
                href="https://github.com/DNAMobileApplications/DroidBridgeLauncherGplayGithub"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Play-line source
              </a>
              <a
                href="https://github.com/cheesakeyk/OFFLINE-FORK"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                OFFLINE-line source
              </a>
              <a
                href="/dashboard"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Console
              </a>
            </div>
          </div>
          <p className="mt-8 max-w-3xl text-xs leading-5 text-muted-foreground/70">
            Not an official Minecraft product. Not approved by or associated
            with Mojang, Microsoft, Xbox, or the PojavLauncher project. Users
            are responsible for owning Minecraft: Java Edition and complying
            with the Minecraft EULA.
          </p>
        </div>
      </footer>
    </div>
  );
}
