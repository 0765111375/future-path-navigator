import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

import { auth, db, googleProvider } from "@/lib/firebase";
import { BrandMark } from "@/components/nextpath/shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — NextPath" },
      {
        name: "description",
        content: "Continue with Google and build your personalised Grade 9 career roadmap.",
      },
      { property: "og:title", content: "Login — NextPath" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const continueWithGoogle = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        const initialProfile = {
          uid: user.uid,
          name: user.displayName ?? "",
          email: user.email ?? "",
          photoURL: user.photoURL ?? "",
          grade: "Grade 9",
          preferredLanguage: "English",
          province: "",
          area: "",
          subjects: [],
          marks: {},
          interests: [],
          strengths: [],
          goalMode: "unsure",
          targetCareerId: null,
          careerArea: null,
          completedSteps: [],
          onboardingComplete: false,
          createdAt: new Date().toISOString(),
          updatedAt: serverTimestamp(),
        };

        await setDoc(userRef, initialProfile, { merge: true });
        navigate({ to: "/onboarding" });
        return;
      }

      const profile = userSnap.data();

      if (profile.onboardingComplete) {
        navigate({ to: "/dashboard" });
        return;
      }

      navigate({ to: "/onboarding" });
    } catch (err) {
      console.error("Google sign-in error:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Google sign-in failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5">
        <BrandMark />

        <Button asChild variant="ghost" size="sm">
          <Link to="/">Back home</Link>
        </Button>
      </header>

      <main className="mx-auto grid max-w-5xl gap-8 px-4 pb-20 pt-8 md:grid-cols-[1.1fr_0.9fr]">
        <section className="panel p-8 sm:p-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="size-3.5" />
            Google-first sign in
          </span>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
            Continue with Google
          </h1>

          <p className="mt-4 max-w-xl text-base text-muted-foreground">
            Use your Google account, then tell us a few details to personalise your Grade 9 career
            roadmap.
          </p>

          <div className="mt-8 space-y-4">
            {[
              "Quick start with your Google account",
              "No long forms before you get value",
              "Your roadmap updates as you add marks and interests",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted-foreground"
              >
                <CheckCircle2 className="size-4 text-primary" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel p-6 sm:p-8">
          <div className="mb-6">
            <p className="text-sm font-medium text-muted-foreground">Sign in</p>

            <h2 className="mt-1 text-2xl font-semibold">Welcome back</h2>
          </div>

          <div className="space-y-4">
            <Button size="lg" className="w-full" onClick={continueWithGoogle} disabled={loading}>
              {loading ? (
                "Connecting to Google..."
              ) : (
                <>
                  Continue with Google
                  <ArrowRight className="ml-2 size-4" />
                </>
              )}
            </Button>

            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="rounded-xl border border-dashed border-border bg-surface px-4 py-3 text-xs text-muted-foreground">
              Your Google account is used to securely identify your NextPath profile.
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
