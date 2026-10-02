# DroidBridge Launcher proguard rules.
# minify is disabled by default; these rules keep reflection-referenced
# classes safe if you enable it.

# LWJGL / SDL bridges are loaded via System.loadLibrary and JNI
-keep class org.lwjgl.** { *; }
-keep class org.libsdl.app.** { *; }
-keep class com.oracle.dalvik.** { *; }

# Pojav-derived game activity (OFFLINE variant)
-keep class net.kdt.pojavlaunch.** { *; }

# Native GLFW module
-keep class ca.dnamobile.nativeglfw.** { *; }

# TouchController proxy (kotlin reflect over transport)
-keep class top.fifthlight.touchcontroller.** { *; }

# AppAuth redirect handling
-keep class net.openid.appauth.** { *; }

# bytehook
-keep class com.bytedance.bytehook.** { *; }

# JNI callbacks into launcher code
-keepclasseswithmembernames class ca.dnamobile.** {
    native <methods>;
}
