# Scholarship Email Campaign Sequence

This folder contains a 5-email nurture campaign designed to guide prospective students from initial interest to scholarship application submission.

## Email Sequence Overview

### Email 1: Welcome/Confirmation (Day 0)
**File:** `01-welcome.html`

**Subject Line Options (A/B Test):**
- A: "Welcome, {{first_name}}! Your scholarship journey starts here 🎓"
- B: "{{first_name}}, thank you for your interest in our scholarship program"

**Preview Text:**
"Thank you for your interest, {{first_name}}! Here's what happens next in your scholarship journey."

**Send Timing:** Immediately after form submission

**Tracking Goals:**
- Email open rate
- Click-through to landing page
- Support email clicks

**Key Features:**
- Warm welcome message
- Clear timeline of what happens next
- Program interest confirmation
- Direct link to full program details
- Support contact information

---

### Email 2: Value Proposition (Day 3)
**File:** `02-value-proposition.html`

**Subject Line Options (A/B Test):**
- A: "See how our scholarship can transform your future, {{first_name}}"
- B: "{{first_name}}, here's what you'll gain with our scholarship"

**Preview Text:**
"See how our scholarship can transform your educational journey, {{first_name}}."

**Send Timing:** 3 days after form submission (72 hours)

**Tracking Goals:**
- Email open rate
- Click-through to application
- Student testimonial engagement
- Deadline reminder visibility (if applicable)

**Key Features:**
- Comprehensive benefits breakdown (tuition, support, community)
- Real student success story/testimonial
- Visual benefit cards with icons
- Application deadline reminder (conditional)
- Clear CTA to start application

---

### Email 3: Application Guidance (Day 7)
**File:** `03-application-guidance.html`

**Subject Line Options (A/B Test):**
- A: "{{first_name}}, here's your step-by-step application guide"
- B: "Ready to apply? We'll walk you through it, {{first_name}}"

**Preview Text:**
"Step-by-step guide to completing your scholarship application, {{first_name}}."

**Send Timing:** 7 days after form submission (1 week)

**Tracking Goals:**
- Email open rate
- Application start rate
- Document checklist downloads
- FAQ engagement
- Consultation booking clicks

**Key Features:**
- 4-step application process walkthrough
- Required documents checklist
- FAQ section addressing common concerns
- Free consultation booking option
- Encouraging, supportive tone

---

### Email 4: Urgency/Reminder (Day 10)
**File:** `04-urgency-reminder.html`

**Subject Line Options (A/B Test):**
- A: "⏰ {{first_name}}, your scholarship deadline is approaching"
- B: "Don't miss out, {{first_name}} – {{days_remaining}} days left to apply"

**Preview Text:**
"Don't miss out, {{first_name}}! Your scholarship application deadline is approaching."

**Send Timing:** 10 days after form submission (or calculated based on deadline)

**Tracking Goals:**
- Email open rate
- Application completion rate
- Support contact engagement
- Urgency response metrics

**Key Features:**
- Prominent deadline countdown
- Success statistics (acceptance rate, awards, etc.)
- Application completion percentage (if started)
- Benefits reminder
- Multiple support contact options
- Stronger CTA with urgency

**Conditional Logic:**
- Only send if application not yet submitted
- Show completion percentage if application started
- Adjust days remaining dynamically

---

### Email 5: Alternative Pathways (Day 14+)
**File:** `05-alternative-pathways.html`

**Subject Line Options (A/B Test):**
- A: "{{first_name}}, other ways to fund your education"
- B: "Still interested in studying with us, {{first_name}}? Let's explore options"

**Preview Text:**
"{{first_name}}, explore other funding options and programs that might be perfect for you."

**Send Timing:** 14+ days after form submission (only for non-converters)

**Tracking Goals:**
- Email open rate
- Alternative program interest
- Webinar registration
- Consultation booking
- Re-engagement rate

**Key Features:**
- Alternative scholarship programs
- Flexible payment plans
- Partial scholarships and grants
- Upcoming webinar/info session invitation
- Free consultation offer
- Success story from alternative pathway
- Encouraging, non-pushy tone

**Conditional Logic:**
- Only send to users who did NOT submit application
- Exclude users who unsubscribed or marked as not interested

---

## Merge Tags Reference

All emails use the following personalization merge tags:

### Required Tags (must be populated):
- `{{first_name}}` - Student's first name
- `{{institution_name}}` - Your institution's name
- `{{institution_address}}` - Institution's mailing address
- `{{support_email}}` - Support team email address
- `{{landing_page_url}}` - Link back to scholarship landing page
- `{{application_url}}` - Direct link to application form
- `{{unsubscribe_url}}` - Unsubscribe link (required by law)
- `{{preference_center_url}}` - Email preference management link

### Optional Tags (conditional):
- `{{program_interest}}` - Specific program student expressed interest in
- `{{application_deadline}}` - Application deadline date
- `{{days_remaining}}` - Days until deadline
- `{{coverage_percentage}}` - Scholarship coverage percentage (e.g., "100")
- `{{program_duration}}` - Duration of scholarship coverage (e.g., "4 years")
- `{{support_phone}}` - Support phone number
- `{{consultation_booking_url}}` - Link to book consultation
- `{{acceptance_rate}}` - Scholarship acceptance rate percentage
- `{{total_scholarships}}` - Number of scholarships awarded
- `{{avg_award_amount}}` - Average scholarship award amount
- `{{completion_percentage}}` - Application completion percentage
- `{{all_scholarships_url}}` - Link to all scholarship programs
- `{{payment_plans_url}}` - Link to payment plan information
- `{{partial_scholarships_url}}` - Link to partial scholarship options
- `{{webinar_date}}` - Upcoming webinar date
- `{{webinar_time}}` - Webinar time
- `{{webinar_registration_url}}` - Webinar registration link
- `{{next_cycle_date}}` - Next scholarship application cycle date

### Conditional Blocks:
Use your email platform's conditional logic for these sections:

\`\`\`
{{#if application_deadline}}
  <!-- Show deadline reminder -->
{{/if}}

{{#if show_stats}}
  <!-- Show success statistics -->
{{/if}}

{{#if application_started}}
  <!-- Show completion percentage -->
{{else}}
  <!-- Show "start application" messaging -->
{{/if}}
\`\`\`

---

## Send Timing Logic

### Recommended Schedule:
1. **Email 1:** Immediate (within 5 minutes of form submission)
2. **Email 2:** Day 3 (72 hours after submission)
3. **Email 3:** Day 7 (1 week after submission)
4. **Email 4:** Day 10 (or calculated based on deadline - send 5-7 days before deadline)
5. **Email 5:** Day 14+ (only if application not submitted)

### Conditional Send Rules:

**Stop sending if:**
- User submits application (move to different nurture sequence)
- User unsubscribes
- User marks emails as spam
- User clicks "not interested" link (if implemented)

**Adjust timing if:**
- Application deadline is less than 14 days away (compress schedule)
- User starts application (send Email 4 sooner with completion reminder)
- User books consultation (pause sequence temporarily)

---

## A/B Testing Recommendations

### Subject Lines:
Test personalization, urgency, and benefit-focused messaging:
- Personalized vs. non-personalized
- Question format vs. statement format
- Emoji vs. no emoji
- Urgency language vs. supportive language

### CTAs:
Test button copy variations:
- "Start Your Application" vs. "Apply Now"
- "Learn More" vs. "View Full Details"
- "Book Free Consultation" vs. "Talk to an Advisor"

### Send Times:
Test different send times for optimal open rates:
- Morning (8-10 AM) vs. Afternoon (2-4 PM) vs. Evening (6-8 PM)
- Weekday vs. Weekend
- Time zone optimization

---

## Tracking & Analytics

### Key Metrics to Track:

**Email Performance:**
- Open rate (target: 25-35%)
- Click-through rate (target: 3-8%)
- Unsubscribe rate (keep below 0.5%)
- Spam complaint rate (keep below 0.1%)

**Conversion Metrics:**
- Application start rate
- Application completion rate
- Time from email to application submission
- Consultation booking rate
- Webinar registration rate

**Engagement Metrics:**
- Link clicks by type (CTA, support, FAQ, etc.)
- Email forwarding rate
- Reply rate to support emails

### Recommended Tracking Parameters:

Add UTM parameters to all links:
\`\`\`
?utm_source=email&utm_medium=nurture&utm_campaign=scholarship_{{email_number}}&utm_content={{link_type}}
\`\`\`

Example:
\`\`\`
{{application_url}}?utm_source=email&utm_medium=nurture&utm_campaign=scholarship_email_3&utm_content=cta_button
\`\`\`

---

## Technical Requirements

### Email Client Compatibility:
These templates are tested and compatible with:
- Gmail (desktop & mobile)
- Apple Mail (iOS & macOS)
- Outlook (2016+, Office 365, Outlook.com)
- Yahoo Mail
- Mobile email clients (iOS Mail, Android Gmail)

### Responsive Design:
- Mobile-first approach
- Stacks to single column on screens < 600px
- Touch-friendly buttons (minimum 44x44px)
- Readable font sizes (minimum 14px body text)

### Accessibility:
- Semantic HTML structure
- Sufficient color contrast (WCAG AA compliant)
- Alt text for images (when images are added)
- Screen reader-friendly layout

---

## Customization Guide

### Brand Colors:
Replace these color values throughout the templates:

**Primary Blue:** `#3b82f6` → Your primary brand color
**Dark Blue:** `#1e3a8a` → Your dark accent color
**Success Green:** `#10b981` → Your success/positive color
**Warning Yellow:** `#f59e0b` → Your warning/attention color
**Urgent Red:** `#dc2626` → Your urgent/deadline color

### Typography:
Current font stack:
\`\`\`
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
\`\`\`

To use custom fonts, add web font imports in the `<head>` section.

### Logo:
Replace the emoji placeholder (🎓) in Email 1 with your institution logo:
\`\`\`html
<img src="{{logo_url}}" alt="{{institution_name}}" style="width: 60px; height: 60px; display: block; margin: 0 auto 16px;">
\`\`\`

### Images:
Add hero images or illustrations by replacing placeholder divs:
\`\`\`html
<img src="{{image_url}}" alt="Description" style="width: 100%; height: auto; border-radius: 8px; display: block;">
\`\`\`

---

## Legal Compliance

### CAN-SPAM Act Requirements:
✅ Physical mailing address in footer
✅ Clear unsubscribe link in every email
✅ Honor unsubscribe requests within 10 business days
✅ Accurate "From" name and email address
✅ Honest subject lines

### GDPR Compliance (if applicable):
- Obtain explicit consent before sending
- Provide clear privacy policy link
- Allow users to access/delete their data
- Document consent records

---

## Integration Notes

### Email Service Provider Setup:

**Recommended ESPs:**
- SendGrid
- Mailchimp
- HubSpot
- ActiveCampaign
- Klaviyo

**Setup Steps:**
1. Import HTML templates to your ESP
2. Map merge tags to your contact fields
3. Set up automation workflow with timing rules
4. Configure conditional logic for Email 4 & 5
5. Set up tracking and analytics
6. Test emails across devices and clients
7. Set up A/B tests for subject lines

### CRM Integration:
Sync email engagement data back to your CRM:
- Track which emails were opened
- Record link clicks
- Update application status
- Trigger follow-up tasks for sales team

---

## Support & Maintenance

### Regular Updates:
- Review and update statistics quarterly
- Refresh testimonials annually
- Update deadline dates for each application cycle
- Test emails after ESP platform updates

### Performance Optimization:
- Monitor deliverability rates
- Clean email list regularly (remove bounces)
- Segment based on engagement
- Adjust send times based on analytics

---

## Questions?

For technical support or customization assistance, contact your development team or email platform administrator.

**Template Version:** 1.0
**Last Updated:** {{current_date}}
**Maintained By:** {{your_team_name}}
