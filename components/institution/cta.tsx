"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"

export function InstitutionCTA() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    institution: "",
    role: "",
    institutionSize: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Demo request:", formData)
    alert("Thank you! Our team will contact you within 24 hours.")
  }

  return (
    <section id="demo" className="border-b border-border/40 py-20 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight md:text-5xl">
              Ready to Transform Your Scholarship Program?
            </h2>
            <p className="text-pretty text-lg text-muted-foreground">
              Schedule a personalized demo and see how EduScale can help your institution scale its impact.
            </p>
          </div>

          <Card className="border-border/50">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Smith"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Work Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@university.edu"
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="institution">Institution Name *</Label>
                    <Input
                      id="institution"
                      required
                      value={formData.institution}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          institution: e.target.value,
                        })
                      }
                      placeholder="University of Example"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Your Role *</Label>
                    <Input
                      id="role"
                      required
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      placeholder="Director of Financial Aid"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="institutionSize">Institution Size *</Label>
                  <Select
                    value={formData.institutionSize}
                    onValueChange={(value) => setFormData({ ...formData, institutionSize: value })}
                  >
                    <SelectTrigger id="institutionSize">
                      <SelectValue placeholder="Select institution size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small (Under 2,000 students)</SelectItem>
                      <SelectItem value="medium">Medium (2,000 - 10,000 students)</SelectItem>
                      <SelectItem value="large">Large (10,000 - 30,000 students)</SelectItem>
                      <SelectItem value="very-large">Very Large (30,000+ students)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Tell us about your scholarship program</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How many scholarships do you manage? What are your biggest challenges?"
                    rows={4}
                  />
                </div>

                <Button type="submit" size="lg" className="w-full">
                  Request Demo
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  By submitting this form, you agree to our Terms of Service and Privacy Policy. We'll contact you
                  within 24 hours.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
