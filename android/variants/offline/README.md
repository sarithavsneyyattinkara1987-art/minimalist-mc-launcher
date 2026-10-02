# OFFLINE variant (ca.dnamobile.javalauncher)

The APK you downloaded - `DroidBridge.Launcher-v0.2.15.OFFLINE.apk` - is a
**separate product line** from the Play Store `DroidBridge` app
(`ca.dnamobile.droidbridgelauncher`):

| | Play line (`/app`) | OFFLINE line (`/variants/offline`) |
|---|---|---|
| Package | `ca.dnamobile.droidbridgelauncher` | `ca.dnamobile.javalauncher` |
| Runtime | Custom DroidBridge runtime | Pojav-derived (`pojavexec`) |
| Source drop | `DNAMobileApplications/DroidBridgeLauncherGplayGithub` (public, official) | `cheesakeyk/OFFLINE-FORK` (public mirror of the OFFLINE snapshot) |
| Build files | Shipped in this repo (authored - see below) | Missing from the public drop; re-authored here |
| AndroidManifest | Included in official drop | **Not** in the OFFLINE drop; re-authored here |
| Native binaries | Not public (build from source) | Not public (build from source or extract from the APK you own) |

## What was re-authored vs. what is genuine

Genuine (from the public OFFLINE source drop):

- All Java sources under `app/src/main/java/`
- The complete JNI C/C++ tree under `app/src/main/jni/`
- The native entrypoint `app/src/main/cpp/native-lib.cpp`
- `methods_injector_agent` Java sources

Re-authored (missing from the public drop, written by this project):

- `app/build.gradle` (adapted from the Play line's dependency set)
- `app/src/main/AndroidManifest.xml` (activities/services/permissions resolved
  from the Java sources)
- `app/src/main/res/layout/activity_splash.xml` (referenced by
  `R.layout.activity_splash` but absent from the snapshot)
- `gradle.properties` / wrapper files

## Known gaps (snapshot is not self-sufficient)

- The OFFLINE drop's `res/values/` contains only 15 string resources but its
  Java references ~185 `R.string.*` symbols. This variant overlays the
  Play line's full `res/` tree (`res.srcDirs` in `build.gradle`) to provide
  the missing resources; conflicting names resolve to the OFFLINE file.
- `System.loadLibrary("pojavexec")` has no `LOCAL_MODULE := pojavexec` in the
  drop's `jni/Android.mk` (the OFFLINE tree builds `pojavexec` from a
  different toolchain than the one shipped publicly). Either extract
  `libpojavexec.so` from your APK into `jniLibs/` or patch `Android.mk`.
- **This variant is not wired into `settings.gradle` by default** because the
  Play line and the OFFLINE line both define `AndroidManifest.xml` at
  `app/src/main` and would collide in a single Gradle invocation. Add
  `include ':variants:offline:app'` to `settings.gradle` to build it
  explicitly.

## Build

```bash
# 1. Add to settings.gradle:
#      include ':variants:offline:app'
# 2. From the repo root:
./gradlew :variants:offline:app:assembleDebug
```
