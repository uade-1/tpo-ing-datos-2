"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle } from "lucide-react"

/**
 * CUSTOMIZATION: Update headline, description, and hero image
 * Customize CTA button text and form fields
 */
export function HeroSection() {
  const [email, setEmail] = useState("")
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [subscribeStatus, setSubscribeStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleEmailSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubscribing(true)
    setSubscribeStatus("idle")
    setErrorMessage("")

    try {
      const institucionSlug = "your-institution-slug"

      const response = await fetch("/api/v1/enrollment/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          institucion_slug: institucionSlug,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to subscribe")
      }

      console.log("[v0] Email subscription successful")
      setSubscribeStatus("success")
      setEmail("")

      setTimeout(() => {
        window.location.href = "/apply"
      }, 2000)
    } catch (error) {
      console.error("[v0] Subscription error:", error)
      setSubscribeStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Failed to subscribe. Please try again.")
    } finally {
      setIsSubscribing(false)
    }
  }

  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      <div className="container mx-auto px-4 py-16 md:px-6 md:py-24 lg:py-32">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-sm">
              <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
              <span className="text-muted-foreground">Now Accepting Applications for 2025-2026</span>
            </div>

            <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Transform Your Future with Our Scholarship Program
            </h1>

            <p className="text-pretty text-lg text-muted-foreground leading-relaxed">
              Join thousands of students who have achieved their academic dreams through our comprehensive scholarship
              opportunities. We support talented individuals from all backgrounds to pursue excellence in education.
            </p>

            <form onSubmit={handleEmailSubscribe} className="space-y-3">
              <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1"
                  aria-label="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubscribing}
                />
                <Button type="submit" size="lg" className="w-full font-medium sm:w-auto" disabled={isSubscribing}>
                  {isSubscribing ? "Subscribing..." : "Get Started"}
                </Button>
              </div>

              {subscribeStatus === "success" && (
                <Alert className="border-green-500 bg-green-50 text-green-900">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription>Successfully subscribed! Redirecting to application...</AlertDescription>
                </Alert>
              )}

              {subscribeStatus === "error" && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}
            </form>

            <p className="text-sm text-muted-foreground">
              By submitting, you agree to receive information about our scholarship programs.
            </p>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-muted lg:aspect-square">
            <img
              src="/diverse-students-studying-on-campus.jpg"
              alt="Students on campus"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
