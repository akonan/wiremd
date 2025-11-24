# Modals and Dialogs

> **Use Case:** Showcase of modal windows, dialogs, and overlay components for user interactions.
>
> **Key Features:** Confirmation dialogs, form modals, alert dialogs, full-screen overlays, multi-step modals

## Modal and Dialog Showcase

Examples of various modal and dialog patterns.

---

## 1. Basic Modal

### Simple Information Modal

```markdown
::: modal
### Welcome to Our Platform!

Thanks for signing up. Let's get you started with a quick tour of the features.

[Take Tour]* [Skip]
:::
```

**Rendered:**

::: modal
### Welcome to Our Platform!

Thanks for signing up. Let's get you started with a quick tour of the features.

[Take Tour]* [Skip]
:::

---

## 2. Confirmation Dialogs

### Delete Confirmation

```markdown
::: modal
### Confirm Delete

Are you sure you want to delete this item? This action cannot be undone.

**Item:** Project Alpha
**Created:** Mar 10, 2025
**Size:** 234 MB

[Delete Permanently]* [Cancel]
:::
```

**Rendered:**

::: modal
### Confirm Delete

Are you sure you want to delete this item? This action cannot be undone.

**Item:** Project Alpha
**Created:** Mar 10, 2025
**Size:** 234 MB

[Delete Permanently]* [Cancel]
:::

---

### Confirmation with Checkbox

```markdown
::: modal
### Archive Project?

Archiving this project will hide it from your active projects list. You can restore it later from the archive.

**Project:** Mobile App Redesign
**Team Members:** 5 people
**Last Updated:** 2 days ago

- [ ] Also archive related tasks (234 items)
- [ ] Notify team members

[Archive Project]* [Cancel]
:::
```

**Rendered:**

::: modal
### Archive Project?

Archiving this project will hide it from your active projects list. You can restore it later from the archive.

**Project:** Mobile App Redesign
**Team Members:** 5 people
**Last Updated:** 2 days ago

- [ ] Also archive related tasks (234 items)
- [ ] Notify team members

[Archive Project]* [Cancel]
:::

---

## 3. Form Modals

### Create New Item Modal

```markdown
::: modal
### Create New Project

Project Name
[_____________________________] {required:true}

Description
[Tell us about your project...] {rows:4}

Project Type
- (*) Web Application
- ( ) Mobile App
- ( ) Desktop Software
- ( ) Other

Team Members
[Select members...v]

- [x] Make project private
- [ ] Enable notifications

[Create Project]* [Cancel]
:::
```

**Rendered:**

::: modal
### Create New Project

Project Name
[_____________________________] {required:true}

Description
[Tell us about your project...] {rows:4}

Project Type
- (*) Web Application
- ( ) Mobile App
- ( ) Desktop Software
- ( ) Other

Team Members
[Select members...v]

- [x] Make project private
- [ ] Enable notifications

[Create Project]* [Cancel]
:::

---

### User Profile Edit Modal

```markdown
::: modal
### Edit Profile

![Profile Photo](https://via.placeholder.com/100x100)

[Change Photo] [Remove]

---

Full Name
[John Doe___________] {required:true}

Email
[[email protected]___________] {type:email required:true}

Job Title
[Senior Designer___________]

Bio
[Write a short bio...] {rows:3}

Location
[San Francisco, CA___________]

Website
[https://johndoe.com___________] {type:url}

---

Social Links
- Twitter: [@johndoe___________]
- LinkedIn: [/in/johndoe___________]
- GitHub: [@johndoe___________]

[Save Changes]* [Cancel]
:::
```

**Rendered:**

::: modal
### Edit Profile

![Profile Photo](https://via.placeholder.com/100x100)

[Change Photo] [Remove]

---

Full Name
[John Doe___________] {required:true}

Email
[[email protected]___________] {type:email required:true}

Job Title
[Senior Designer___________]

Bio
[Write a short bio...] {rows:3}

Location
[San Francisco, CA___________]

Website
[https://johndoe.com___________] {type:url}

---

Social Links
- Twitter: [@johndoe___________]
- LinkedIn: [/in/johndoe___________]
- GitHub: [@johndoe___________]

[Save Changes]* [Cancel]
:::

---

## 4. Alert Dialogs

### Success Alert

```markdown
::: modal
::: alert success
✅ **Success!**

Your changes have been saved successfully.
:::

[Close]
:::
```

**Rendered:**

::: modal
::: alert success
✅ **Success!**

Your changes have been saved successfully.
:::

[Close]
:::

---

### Warning Dialog

```markdown
::: modal
::: alert warning
⚠️ **Warning: Unsaved Changes**

You have unsaved changes. Are you sure you want to leave this page?
:::

[Save & Leave]* [Leave Without Saving] [Stay on Page]
:::
```

**Rendered:**

::: modal
::: alert warning
⚠️ **Warning: Unsaved Changes**

You have unsaved changes. Are you sure you want to leave this page?
:::

[Save & Leave]* [Leave Without Saving] [Stay on Page]
:::

---

### Error Dialog

```markdown
::: modal
::: alert error
❌ **Error: Upload Failed**

Unable to upload file. Please check your connection and try again.

**Error Code:** ERR_UPLOAD_001
**File:** document.pdf (2.4 MB)
:::

[Retry Upload]* [Cancel] [View Details]
:::
```

**Rendered:**

::: modal
::: alert error
❌ **Error: Upload Failed**

Unable to upload file. Please check your connection and try again.

**Error Code:** ERR_UPLOAD_001
**File:** document.pdf (2.4 MB)
:::

[Retry Upload]* [Cancel] [View Details]
:::

---

## 5. Multi-Step Modal

### Wizard Modal

```markdown
::: modal
### Setup Wizard - Step 2 of 4

[####______] 50% Complete

[[ :check: Step 1 | *Step 2* | Step 3 | Step 4 ]]

---

**Configure Your Settings**

Notification Preferences
- [x] Email notifications
- [x] Push notifications
- [ ] SMS alerts

Email Frequency
- (*) Real-time
- ( ) Daily digest
- ( ) Weekly summary

Time Zone
[UTC-8 Pacific Time...v]

---

[← Back] [Next →]* [Skip Setup] [×]
:::
```

**Rendered:**

::: modal
### Setup Wizard - Step 2 of 4

[####______] 50% Complete

[[ :check: Step 1 | *Step 2* | Step 3 | Step 4 ]]

---

**Configure Your Settings**

Notification Preferences
- [x] Email notifications
- [x] Push notifications
- [ ] SMS alerts

Email Frequency
- (*) Real-time
- ( ) Daily digest
- ( ) Weekly summary

Time Zone
[UTC-8 Pacific Time...v]

---

[← Back] [Next →]* [Skip Setup] [×]
:::

---

## 6. Media/Preview Modals

### Image Preview Modal

```markdown
::: modal
![Product Image](https://via.placeholder.com/800x600)

**Premium Wireless Headphones**

High-quality audio with active noise cancellation

Image 1 of 5 | [← Previous] [Next →]

[Add to Cart]* [Close] [Download] [Share]
:::
```

**Rendered:**

::: modal
![Product Image](https://via.placeholder.com/800x600)

**Premium Wireless Headphones**

High-quality audio with active noise cancellation

Image 1 of 5 | [← Previous] [Next →]

[Add to Cart]* [Close] [Download] [Share]
:::

---

### Video Player Modal

```markdown
::: modal
### Product Demo Video

![Video Player](https://via.placeholder.com/700x400)

[▶ Play] [⏸ Pause] [🔊] [⚙️ Settings] [⛶ Fullscreen]

**Duration:** 5:24 | **Quality:** 1080p

[Close] [Share] [Download]
:::
```

**Rendered:**

::: modal
### Product Demo Video

![Video Player](https://via.placeholder.com/700x400)

[▶ Play] [⏸ Pause] [🔊] [⚙️ Settings] [⛶ Fullscreen]

**Duration:** 5:24 | **Quality:** 1080p

[Close] [Share] [Download]
:::

---

## 7. Selection/Picker Modals

### Date Picker Modal

```markdown
::: modal
### Select Date Range

**Start Date**
[2025-03-01___________] {type:date}

**End Date**
[2025-03-31___________] {type:date}

---

**Quick Select:**
[Today] [Last 7 Days] [Last 30 Days] [This Month] [Custom]

---

[Apply]* [Cancel]
:::
```

**Rendered:**

::: modal
### Select Date Range

**Start Date**
[2025-03-01___________] {type:date}

**End Date**
[2025-03-31___________] {type:date}

---

**Quick Select:**
[Today] [Last 7 Days] [Last 30 Days] [This Month] [Custom]

---

[Apply]* [Cancel]
:::

---

### File Upload Modal

```markdown
::: modal
### Upload Files

Drag and drop files here or click to browse

[Choose Files]

---

**Accepted formats:** JPG, PNG, PDF, DOCX
**Max file size:** 10 MB per file

---

**Uploaded:**
- ✅ document.pdf (2.4 MB) [×]
- ✅ image.png (856 KB) [×]
- 🔄 large-file.pdf (8.2 MB) - Uploading... 67%

[Upload All]* [Cancel]
:::
```

**Rendered:**

::: modal
### Upload Files

Drag and drop files here or click to browse

[Choose Files]

---

**Accepted formats:** JPG, PNG, PDF, DOCX
**Max file size:** 10 MB per file

---

**Uploaded:**
- ✅ document.pdf (2.4 MB) [×]
- ✅ image.png (856 KB) [×]
- 🔄 large-file.pdf (8.2 MB) - Uploading... 67%

[Upload All]* [Cancel]
:::

---

## 8. Settings/Preferences Modal

### Account Settings Modal

```markdown
::: modal
### Account Settings

[[ *General* | Security | Privacy | Notifications ]]

---

**General Settings**

Account Email
[[email protected]___________] {type:email}

Display Name
[John Doe___________]

Language
[English...v]

Time Zone
[UTC-8 Pacific...v]

Date Format
- (*) MM/DD/YYYY
- ( ) DD/MM/YYYY
- ( ) YYYY-MM-DD

---

**Danger Zone**

[Delete Account] - Permanently delete your account and all data

---

[Save Changes]* [Cancel]
:::
```

**Rendered:**

::: modal
### Account Settings

[[ *General* | Security | Privacy | Notifications ]]

---

**General Settings**

Account Email
[[email protected]___________] {type:email}

Display Name
[John Doe___________]

Language
[English...v]

Time Zone
[UTC-8 Pacific...v]

Date Format
- (*) MM/DD/YYYY
- ( ) DD/MM/YYYY
- ( ) YYYY-MM-DD

---

**Danger Zone**

[Delete Account] - Permanently delete your account and all data

---

[Save Changes]* [Cancel]
:::

---

## 9. Share/Export Modal

### Share Content Modal

```markdown
::: modal
### Share This Project

**Project:** Mobile App Redesign

---

Share Link
[https://app.example.com/project/abc123___________]

[Copy Link] [Generate QR Code]

---

**Invite via Email**

Email addresses (comma-separated)
[[email protected], [email protected]___________]

Permission Level
[Can View...v]
- Can View
- Can Edit
- Can Admin

- [x] Send notification email
- [ ] Allow invitees to share

[Send Invites]*

---

**Share on Social**

[Twitter] [Facebook] [LinkedIn] [Copy Link]

---

[Close]
:::
```

**Rendered:**

::: modal
### Share This Project

**Project:** Mobile App Redesign

---

Share Link
[https://app.example.com/project/abc123___________]

[Copy Link] [Generate QR Code]

---

**Invite via Email**

Email addresses (comma-separated)
[[email protected], [email protected]___________]

Permission Level
[Can View...v]
- Can View
- Can Edit
- Can Admin

- [x] Send notification email
- [ ] Allow invitees to share

[Send Invites]*

---

**Share on Social**

[Twitter] [Facebook] [LinkedIn] [Copy Link]

---

[Close]
:::

---

## 10. Full-Screen Modal/Overlay

### Full-Screen Content Modal

```markdown
::: modal {.fullscreen}
### Terms of Service

[×] Close

---

Last Updated: March 17, 2025

## 1. Introduction

Welcome to our platform. By using our services, you agree to these terms...

## 2. User Accounts

You are responsible for maintaining the security of your account...

## 3. Privacy Policy

We respect your privacy. Please review our privacy policy...

## 4. Acceptable Use

You agree not to misuse our services...

*(Continue with full terms...)*

---

- [ ] I have read and agree to the Terms of Service

[Accept & Continue]* [Decline]

:::
```

**Rendered:**

::: modal
### Terms of Service

[×] Close

---

Last Updated: March 17, 2025

## 1. Introduction

Welcome to our platform. By using our services, you agree to these terms...

## 2. User Accounts

You are responsible for maintaining the security of your account...

- [ ] I have read and agree to the Terms of Service

[Accept & Continue]* [Decline]

:::

---

## Best Practices

::: card

### Modal Design Guidelines

1. **Purpose & Context**
   - Use modals for focused tasks
   - Don't overuse modals
   - Provide clear context
   - Include descriptive titles

2. **User Actions**
   - Always provide a way to close
   - Highlight primary action
   - Support keyboard shortcuts (Esc to close)
   - Prevent accidental dismissal

3. **Content**
   - Keep content concise
   - Use clear, action-oriented button labels
   - Avoid nested modals
   - Show progress for multi-step

4. **Accessibility**
   - Trap focus within modal
   - Return focus after close
   - Use appropriate ARIA labels
   - Support keyboard navigation

5. **Visual Design**
   - Use overlay/backdrop
   - Center or position appropriately
   - Ensure adequate contrast
   - Make buttons clearly clickable

6. **Mobile Considerations**
   - Use full-screen on mobile when needed
   - Ensure touch targets are large enough
   - Consider bottom sheets alternative
   - Test scrolling behavior

:::

---

**Style Variations:**
- `sketch` - Hand-drawn modal wireframes
- `clean` - Modern minimal modals
- `wireframe` - Structure-focused dialogs
- `tailwind` - Contemporary modal design
- `material` - Google-style dialogs
- `brutal` - Bold modal layouts
- `none` - Semantic HTML for custom styling

**Generate this example:**
```bash
wiremd modals-dialogs.md --style sketch
wiremd modals-dialogs.md --style clean -o modals-clean.html
wiremd modals-dialogs.md --style material -o modals-material.html
```
