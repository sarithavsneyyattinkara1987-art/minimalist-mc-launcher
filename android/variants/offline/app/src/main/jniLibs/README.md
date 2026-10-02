# jniLibs - prebuilt native libraries

The OFFLINE v0.2.15 APK ships **prebuilt** native libraries. The public OFFLINE
source drop contains the JNI C/C++ sources but not the compiled binaries or the
exact NDK toolchain used.

## Using prebuilt libs from an APK you own

1. Unzip the APK: `unzip DroidBridge.Launcher-v0.2.15.OFFLINE.apk -d apk-extract`
2. Copy the ABI you need:
   ```bash
   mkdir -p app/src/main/jniLibs/arm64-v8a
   cp apk-extract/lib/arm64-v8a/*.so app/src/main/jniLibs/arm64-v8a/
   ```
3. **Comment out** the `externalNativeBuild { ndkBuild { ... } }` block in
   `build.gradle` - Gradle refuses to package both from-source and prebuilt
   outputs for the same module.
4. Build as normal.

## Expected .so names (from the source tree)

- `libpojavexec.so` - Pojav-derived game engine loader (`System.loadLibrary("pojavexec")`)
- `libjavalauncher_native.so` - OFFLINE variant JNI (`cpp/CMakeLists.txt`)
- `libdroidbridge_runtime.so`, `libdroidbridge_openjdk_hooks.so`, `libdroidbridge_awt.so`,
  `libdroidbridge_driver_helper.so`, `libdroidbridge_verity_sherpa_onnx_jni.so`,
  `libdroidbridge_vulkan_proxy.so`, `libdroidbridge_sdl3_egl.so`
- X11/GL bridge libs (`libEGL.so`, `libX11.so`, ...), `liblinkerhook.so`, `libexithook.so`,
  `libcutils.so`, `libpulse.so`, `libudev.so`, `libdrm.so`, `libgbm.so` and friends

## From-source build

Without prebuilt libs, the module builds the JNI tree from source via
`ndkBuild` (see `build.gradle`). Expect it to take a while; some embedded
third-party sources in the official drop may need local patches depending on
your NDK version.
