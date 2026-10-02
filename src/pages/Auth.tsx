import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { useAuth } from "@/hooks/use-auth";
import { ArrowRight, Loader2 } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

interface AuthProps {
  redirectAfterAuth?: string;
}

function resolveRedirectAfterAuth(
  returnTo: string | null,
  fallback = "/dashboard",
) {
  if (returnTo?.startsWith("/") && !returnTo.startsWith("//")) {
    return returnTo;
  }
  return fallback;
}

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { isLoading: authLoading, isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = resolveRedirectAfterAuth(
    searchParams.get("returnTo"),
    redirectAfterAuth,
  );
  const [step, setStep] = useState<"signIn" | { email: string }>("signIn");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(redirect);
    }
  }, [authLoading, isAuthenticated, navigate, redirect]);

  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      await signIn("email-otp", formData);
      setStep({ email: formData.get("email") as string });
      setIsLoading(false);
    } catch (error) {
      console.error("Email sign-in error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to send verification code. Please try again.",
      );
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      await signIn("email-otp", formData);
      navigate(redirect);
    } catch (error) {
      console.error("OTP verification error:", error);
      setError("The verification code you entered is incorrect.");
      setIsLoading(false);
      setOtp("");
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn("anonymous");
      navigate(redirect);
    } catch (error) {
      console.error("Guest login error:", error);
      setError(
        `Failed to sign in as guest: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Top bar */}
      <header className="hairline-b">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-6">
          <a href="/" className="text-sm font-medium tracking-tight">
            DroidBridge
          </a>
          <span className="mono-label">Sign in</span>
        </div>
      </header>

      <div className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-sm">
          {step === "signIn" ? (
            <div>
              <p className="mono-label">DroidBridge Console</p>
              <h1 className="mt-4 text-2xl font-medium tracking-tight">
                Sign in to continue.
              </h1>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Manage your instances, renderers and control layouts. Enter
                your email and we&apos;ll send a code.
              </p>

              <form onSubmit={handleEmailSubmit} className="mt-10">
                <div className="grid gap-3">
                  <label htmlFor="email" className="mono-label">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    placeholder="name@example.com"
                    type="email"
                    autoComplete="email"
                    className="h-11 rounded-none"
                    disabled={isLoading}
                    required
                  />
                </div>
                {error && (
                  <p className="mt-3 text-sm text-destructive">{error}</p>
                )}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="mt-6 h-11 w-full rounded-none"
                >
                  {isLoading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="ml-2 size-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="my-8 flex items-center gap-4">
                <span className="h-px flex-1 bg-border" />
                <span className="mono-label">or</span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <Button
                type="button"
                variant="outline"
                className="h-11 w-full rounded-none"
                onClick={handleGuestLogin}
                disabled={isLoading}
              >
                Continue as guest
              </Button>
            </div>
          ) : (
            <div>
              <p className="mono-label">Check your email</p>
              <h1 className="mt-4 text-2xl font-medium tracking-tight">
                Enter your code.
              </h1>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                We sent a six-digit code to{" "}
                <span className="text-foreground">{step.email}</span>.
              </p>

              <form onSubmit={handleOtpSubmit} className="mt-10">
                <input type="hidden" name="email" value={step.email} />
                <input type="hidden" name="code" value={otp} />

                <div className="flex justify-center">
                  <InputOTP
                    value={otp}
                    onChange={setOtp}
                    maxLength={6}
                    disabled={isLoading}
                    onKeyDown={(e) => {
                      if (
                        e.key === "Enter" &&
                        otp.length === 6 &&
                        !isLoading
                      ) {
                        const form = (e.target as HTMLElement).closest("form");
                        if (form) {
                          form.requestSubmit();
                        }
                      }
                    }}
                  >
                    <InputOTPGroup>
                      {Array.from({ length: 6 }).map((_, index) => (
                        <InputOTPSlot key={index} index={index} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                {error && (
                  <p className="mt-4 text-center text-sm text-destructive">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  className="mt-8 h-11 w-full rounded-none"
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Verifying
                    </>
                  ) : (
                    <>
                      Verify code
                      <ArrowRight className="ml-2 size-4" />
                    </>
                  )}
                </Button>

                <div className="mt-6 flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={() => setStep("signIn")}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                    disabled={isLoading}
                  >
                    Use a different email
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep("signIn")}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                    disabled={isLoading}
                  >
                    Resend
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      <footer className="hairline-t">
        <div className="mx-auto w-full max-w-5xl px-6 py-6">
          <p className="text-xs leading-5 text-muted-foreground/70">
            Not an official Minecraft product. Not approved by or associated
            with Mojang, Microsoft, or Xbox.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function AuthPage(props: AuthProps) {
  return (
    <Suspense>
      <Auth {...props} />
    </Suspense>
  );
}
