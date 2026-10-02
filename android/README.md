# DroidBridge Launcher — Android Gradle project

A buildable reconstruction of the DroidBridge Launcher Android project from
genuine public sources, with the missing build scaffolding re-authored.

## Modules

| Module | Type | Package | Origin |
|---|---|---|---|
| `app/` | android application | `ca.dnamobile.droidbridgelauncher` | official public drop (unmodified sources) |
| `nativeglfw/` | android library | `ca.dnamobile.nativeglfw` | official public drop |
| `methods_injector_agent/` | java-library (JVM agent) | `ca.dnamobile.droidbridgelauncher.agent` | official public drop |
| `variants/offline/app/` | android application | `ca.dnamobile.javalauncher` | OFFLINE public mirror (unmodified sources) + re-authored scaffolding |

## Build

Prerequisites: JDK 17, Android SDK (API 35), NDK r27+, CMake 3.22.1.

```bash
./gradlew assembleDebug
```

Outputs: `app/build/outputs/apk/debug/app-debug.apk`

### OFFLINE variant

The OFFLINE line defines its own `AndroidManifest.xml`, so it is **not**
included in the default build (it would collide with the Play line's
manifest in one invocation):

```bash
# 1) add to settings.gradle:  include ':variants:offline:app'
# 2)
./gradlew :variants:offline:app:assembleDebug
```

See `variants/offline/README.md` for the honest list of gaps in that
snapshot and how to fill them (res overlay, `pojavexec` native, prebuilt
libs from an APK you own).

## Provenance & modifications

- `app/`, `nativeglfw/`, `methods_injector_agent/` Java/C/C++/res sources:
  **unmodified** from `DNAMobileApplications/DroidBridgeLauncherGplayGithub`.
- `variants/offline/app/src/main/{java,cpp,jni}` sources: **unmodified**
  from `cheesakeyk/OFFLINE-FORK` (the v0.2.15 OFFLINE line).
- Re-authored here (marked in-file): root wrapper properties, both
  `app/build.gradle` files, the OFFLINE `AndroidManifest.xml`, one splash
  layout, `proguard-rules.pro`, `gradle.properties` tuning.
- `app/libs/mesa.aar`: binary AAR shipped by the official public repo.

## Notes

- `gradle/wrapper/gradle-wrapper.properties` upstream was a corrupted
  `404: Not Found` text file; it is rewritten for Gradle 8.14.1 (AGP 8.10.1).
- The OFFLINE app's `res/` alone lacks ~170 string resources referenced by
  its code; the variant overlays the Play line's full `res/` tree via
  `res.srcDirs` in its `build.gradle`.
- JNI builds from source via `ndkBuild` (`app/src/main/jni/Android.mk`,
  prefab-importing `com.bytedance:bytehook`). To package prebuilt `.so`
  files instead, see `variants/offline/app/src/main/jniLibs/README.md`.
- `docs/UPSTREAM_README.md` is the official project README, preserved.
