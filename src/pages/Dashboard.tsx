import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuery, useMutation } from "convex/react";
import { toast } from "sonner";
import { useState } from "react";
import { LogOut, Plus, Play, Trash2, Loader2, Terminal } from "lucide-react";
import { useNavigate } from "react-router";

type Instance = Doc<"instances">;

const LOADERS = ["vanilla", "fabric", "quilt", "neoforge", "forge"] as const;
const RENDERERS = ["ltw", "mobile_glues", "zink", "virgl"] as const;
const RUNTIMES = ["jre8", "jre17", "jre21"] as const;
const MC_VERSIONS = ["1.21.9", "1.21.8", "1.21.4", "1.21.1", "1.20.6", "1.20.1", "1.16.5", "1.12.2", "1.8.9"];

const STATUS_STYLES: Record<string, string> = {
  ready: "text-foreground",
  installing: "text-muted-foreground",
  broken: "text-destructive",
};

const LOADER_NOTES: Record<string, string> = {
  vanilla: "No mod loader",
  fabric: "Fabric Loader",
  quilt: "Quilt Loader",
  neoforge: "NeoForge",
  forge: "Forge",
};

const RENDERER_NOTES: Record<string, string> = {
  ltw: "LTW · Vulkan based",
  mobile_glues: "Mobile Glues · GLES 3.2",
  zink: "Zink · Mesa over OpenGL",
  virgl: "VirGL · compatibility",
};

const RUNTIME_NOTES: Record<string, string> = {
  jre8: "JRE 8 · legacy versions",
  jre17: "JRE 17 · 1.18+",
  jre21: "JRE 21 · 1.20.5+",
};

function fmtDate(ms?: number) {
  if (!ms) return "never";
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const instances = useQuery(api.instances.list);
  const changelog = useQuery(api.changelog.list);
  const createInstance = useMutation(api.instances.create);
  const removeInstance = useMutation(api.instances.remove);
  const markPlayed = useMutation(api.instances.markPlayed);
  const updateStatus = useMutation(api.instances.updateStatus);

  const [open, setOpen] = useState(false);
  const [busyId, setBusyId] = useState<Id<"instances"> | null>(null);
  const [form, setForm] = useState({
    name: "",
    mcVersion: MC_VERSIONS[0],
    loader: LOADERS[0] as (typeof LOADERS)[number],
    renderer: RENDERERS[0] as (typeof RENDERERS)[number],
    javaRuntime: RUNTIMES[2] as (typeof RUNTIMES)[number],
    ramMb: 4096,
  });

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleCreate = async () => {
    if (!form.name.trim()) {
      toast.error("Give the instance a name");
      return;
    }
    try {
      await createInstance({ ...form, name: form.name.trim() });
      toast.success(`Instance “${form.name.trim()}” created — installing`);
      setOpen(false);
      setForm((f) => ({ ...f, name: "" }));
    } catch {
      toast.error("Could not create the instance");
    }
  };

  const withBusy = async (id: Id<"instances">, fn: () => Promise<unknown>) => {
    setBusyId(id);
    try {
      await fn();
    } finally {
      setBusyId(null);
    }
  };

  const stats = {
    total: instances?.length ?? 0,
    ready: instances?.filter((i) => i.status === "ready").length ?? 0,
    installing: instances?.filter((i) => i.status === "installing").length ?? 0,
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <a href="/" className="text-sm font-medium tracking-tight">
              DroidBridge
            </a>
            <p className="mono-label hidden sm:block">Console</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-muted-foreground sm:block">
              {user?.email ?? user?.name ?? "signed in"}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-muted-foreground"
            >
              <LogOut className="size-3.5" />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 pb-24">
        {/* Heading */}
        <div className="flex flex-col gap-6 pt-14 pb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mono-label">Instances</p>
            <h1 className="mt-3 text-3xl font-medium tracking-tight md:text-4xl">
              Your installs.
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
              Each instance is an isolated Minecraft: Java Edition install with
              its own version, loader, renderer and runtime.
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 self-start md:self-auto">
                <Plus className="size-4" />
                New instance
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-lg font-medium">New instance</DialogTitle>
                <DialogDescription className="text-sm leading-6">
                  Configure the install. You can change everything later.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-5 py-2">
                <div className="grid gap-2">
                  <Label htmlFor="inst-name" className="text-sm">Name</Label>
                  <Input
                    id="inst-name"
                    placeholder="Survival 1.21"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm">Minecraft version</Label>
                  <Select
                    value={form.mcVersion}
                    onValueChange={(v) => setForm({ ...form, mcVersion: v })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {MC_VERSIONS.map((v) => (
                        <SelectItem key={v} value={v}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-sm">Loader</Label>
                    <Select
                      value={form.loader}
                      onValueChange={(v) => setForm({ ...form, loader: v as typeof form.loader })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {LOADERS.map((l) => (
                          <SelectItem key={l} value={l}>{LOADER_NOTES[l]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-sm">Runtime</Label>
                    <Select
                      value={form.javaRuntime}
                      onValueChange={(v) => setForm({ ...form, javaRuntime: v as typeof form.javaRuntime })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {RUNTIMES.map((r) => (
                          <SelectItem key={r} value={r}>{RUNTIME_NOTES[r]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm">Renderer</Label>
                  <Select
                    value={form.renderer}
                    onValueChange={(v) => setForm({ ...form, renderer: v as typeof form.renderer })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {RENDERERS.map((r) => (
                        <SelectItem key={r} value={r}>{RENDERER_NOTES[r]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="inst-ram" className="text-sm">
                    Memory allocation — {form.ramMb / 1024} GB
                  </Label>
                  <input
                    id="inst-ram"
                    type="range"
                    min={1024}
                    max={8192}
                    step={1024}
                    value={form.ramMb}
                    onChange={(e) => setForm({ ...form, ramMb: Number(e.target.value) })}
                    className="accent-foreground"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={handleCreate}>Create instance</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stat hairline strip */}
        <div className="grid grid-cols-3 border-y border-border/70">
          <div className="py-6">
            <p className="text-2xl font-medium tabular-nums">{stats.total}</p>
            <p className="mono-label mt-1">Total</p>
          </div>
          <div className="border-l border-border/70 py-6 pl-6">
            <p className="text-2xl font-medium tabular-nums">{stats.ready}</p>
            <p className="mono-label mt-1">Ready</p>
          </div>
          <div className="border-l border-border/70 py-6 pl-6">
            <p className="text-2xl font-medium tabular-nums">{stats.installing}</p>
            <p className="mono-label mt-1">Installing</p>
          </div>
        </div>

        {/* Instance list */}
        <div className="mt-10">
          {instances === undefined ? (
            <div className="space-y-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-16 animate-pulse bg-muted/60" />
              ))}
            </div>
          ) : instances.length === 0 ? (
            <div className="border border-dashed border-border/70 py-16 text-center">
              <p className="text-sm font-medium">No instances yet</p>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                Create your first install — pick a Minecraft version, a loader
                and a renderer tuned for your device.
              </p>
              <Button variant="outline" className="mt-6" onClick={() => setOpen(true)}>
                <Plus className="mr-2 size-4" />
                New instance
              </Button>
            </div>
          ) : (
            <div>
              {instances.map((inst: Instance) => (
                <div
                  key={inst._id}
                  className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-border/70 py-5 md:grid-cols-[1.2fr_1fr_auto]"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <p className="truncate text-sm font-medium">{inst.name}</p>
                      <span
                        className={`text-[11px] uppercase tracking-[0.12em] ${STATUS_STYLES[inst.status]}`}
                      >
                        {inst.status}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-[13px] text-muted-foreground">
                      MC {inst.mcVersion} · {LOADER_NOTES[inst.loader]} ·{" "}
                      {RENDERER_NOTES[inst.renderer]} · {inst.ramMb / 1024} GB
                    </p>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-[13px] tabular-nums text-muted-foreground">
                      last played {fmtDate(inst.lastPlayedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {busyId === inst._id ? (
                      <Loader2 className="size-4 animate-spin text-muted-foreground" />
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Launch"
                          onClick={() =>
                            withBusy(inst._id, async () => {
                              await markPlayed({ id: inst._id });
                              toast.success(`${inst.name} launched (demo)`);
                            })
                          }
                        >
                          <Play className="size-3.5" />
                        </Button>
                        {inst.status !== "ready" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Mark ready"
                            onClick={() =>
                              withBusy(inst._id, () =>
                                updateStatus({ id: inst._id, status: "ready" }),
                              )
                            }
                          >
                            <Terminal className="size-3.5" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Delete"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() =>
                            withBusy(inst._id, async () => {
                              await removeInstance({ id: inst._id });
                              toast(`${inst.name} deleted`);
                            })
                          }
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Changelog sidebar section */}
        <div className="mt-20 border-t border-border/70 pt-12">
          <div className="flex items-end justify-between">
            <div>
              <p className="mono-label">Launcher releases</p>
              <h2 className="mt-3 text-xl font-medium tracking-tight">
                Recent builds.
              </h2>
            </div>
            <a
              href="/"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              About
            </a>
          </div>
          <div className="mt-8 grid gap-10 md:grid-cols-2">
            {(changelog ?? []).slice(0, 4).map((entry) => (
              <div key={entry._id} className="border-t border-border/70 pt-5">
                <div className="flex items-baseline justify-between">
                  <p className="text-sm font-medium tabular-nums">{entry.version}</p>
                  <p className="mono-label">{entry.channel}</p>
                </div>
                <ul className="mt-3 space-y-1">
                  {entry.highlights.slice(0, 3).map((h) => (
                    <li key={h} className="text-[13px] leading-6 text-muted-foreground">
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Build pointers */}
        <div className="mt-20 border-t border-border/70 pt-12">
          <p className="mono-label">From source</p>
          <div className="mt-6 grid gap-10 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium">Play line</p>
              <p className="mt-2 text-[13px] leading-6 text-muted-foreground">
                <code className="text-[12px]">ca.dnamobile.droidbridgelauncher</code> —
                the full public drop with authored Gradle files. Build with{" "}
                <code className="text-[12px]">./gradlew assembleDebug</code> from{" "}
                <code className="text-[12px]">android/</code>.
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">OFFLINE line</p>
              <p className="mt-2 text-[13px] leading-6 text-muted-foreground">
                <code className="text-[12px]">ca.dnamobile.javalauncher</code> —
                the v0.2.15 APK line, Pojav-derived. Wire{" "}
                <code className="text-[12px]">:variants:offline:app</code> in
                settings.gradle; manifest and Gradle files are re-authored and
                documented.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
