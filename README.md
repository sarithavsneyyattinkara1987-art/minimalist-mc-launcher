# DroidBridge Launcher — source project & console

An Android Minecraft: Java Edition launcher ecosystem, reconstructed as a
**buildable Gradle project** from genuine public sources, with a minimalism
web console (this app) for managing launcher instances.

> **Not an official Minecraft product.** Not approved by or associated with
> Mojang, Microsoft, Xbox, or the PojavLauncher project. You are responsible
> for owning Minecraft: Java Edition and complying with the Minecraft EULA.

---

## What's in this repository

```
├── android/                  ← the buildable Android/Gradle project (see android/README.md)
│   ├── app/                  ← Play line: ca.dnamobile.droidbridgelauncher
│   ├── nativeglfw/           ← native GLFW compatibility Android library
│   ├── methods_injector_agent/  ← Java instrumentation agent (java-library)
│   └── variants/offline/     ← OFFLINE line: ca.dnamobile.javalauncher (v0.2.15)
└── src/…                     ← the web console (React + Vite + Convex)
```

## Android: what came from where (provenance)

**Genuine sources, unmodified:**

- Play line app module (253 Java files, full res tree, manifest, `mesa.aar`)
  from `DNAMobileApplications/DroidBridgeLauncherGplayGithub`
- OFFLINE line app module (108 Java files, complete JNI C/C++ tree)
  from `cheesakeyk/OFFLINE-FORK`
- `methods_injector_agent` and `nativeglfw` module sources
- `LICENSES/` (LGPL-3.0 for the Pojav-derived code)

**Re-authored by this project** (missing from the public drops, each is
marked with a comment inside the file):

- `android/app/build.gradle` — dependencies resolved from actual imports
- `android/gradle/wrapper/gradle-wrapper.properties` (upstream committed a
  literal `404: Not Found` text file here) and `gradle-wrapper.jar`
- `android/variants/offline/app/build.gradle` and `AndroidManifest.xml`
- `android/variants/offline/app/src/main/res/layout/activity_splash.xml`

**Not available anywhere public** (documented in `android/variants/offline/app/src/main/jniLibs/README.md`):

- Prebuilt native `.so` binaries. Build the JNI from source, or extract
  `lib/<abi>/*.so` from an APK you own into `jniLibs/`.

### Why not decompile the APK?

Decompiling (jadx/apktool) yields unreadable, unbuildable output: no original
names, broken resources, no way to satisfy EULA/redistribution requirements
for the embedded engine. Every Android Minecraft launcher of this lineage is
**partially open source** — DroidBridge publishes its launcher-side framework
on GitHub. This project therefore uses the genuine public sources and
supplies the missing build scaffolding, which is strictly better than
decompiled output. The APK itself was used only to verify which source line
matches (it is the OFFLINE line, package `ca.dnamobile.javalauncher`).

### Build the Android project

```bash
cd android
./gradlew assembleDebug                 # Play line
# OFFLINE line: add `include ':variants:offline:app'` to settings.gradle, then
./gradlew :variants:offline:app:assembleDebug
```

Toolchain: JDK 17, Android Gradle Plugin 8.10.1, Gradle 8.14.1 (wrapper),
compileSdk 35, NDK r27+ with CMake 3.22.1 for the native modules.

## The web console

A minimalism-styled React app backed by Convex:

- `/` — product landing page with source provenance and changelog
- `/auth` — email-OTP or guest sign-in
- `/dashboard` — instance manager: create, launch, delete; live release feed

```bash
bun install
bun dev            # web app
bun convex dev     # backend
```

## Publishing to your GitHub repository

Git is blocked inside this sandbox (the hosting platform manages version
control), so push the tree yourself from any machine with this project
downloaded:

```bash
cd <project-root>
git init
git add .
git commit -m "DroidBridge Launcher: Android Gradle project + web console"
git branch -M main
git remote add origin git@github.com:<you>/droidbridge-launcher.git
git push -u origin main
```

Suggested repo settings: description *"Buildable Gradle reconstruction of
DroidBridge Launcher (Minecraft: Java Edition on Android) + instance
console"*, topics `minecraft`, `android`, `launcher`, `pojav`, `gradle`.

## Licenses

- Pojav-derived code: LGPL-3.0-only (see `android/LICENSES/`)
- DNA Mobile Applications project code: proprietary headers preserved
  in-file
- Web console in `src/`: this project
