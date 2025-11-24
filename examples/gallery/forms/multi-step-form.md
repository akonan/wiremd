# Multi-Step Form

> **Use Case:** Complex onboarding flows, checkout processes, surveys, or application forms.
>
> **Key Features:** Progress indicator, step navigation, form validation, data persistence, review step

[[ :logo: OnboardFlow | Dashboard | [Sign Out] ]]

---

# Account Setup Wizard

Complete your profile in 4 easy steps

---

## Progress

[########__________] Step 2 of 4

[[ :check: Step 1 | *Step 2* | Step 3 | Step 4 ]]

---

## Step 2: Personal Information

::: card

### Tell Us About Yourself

Profile Picture
[Choose File] *profile-photo.jpg*

First Name
[_____________________________] {required:true}

Middle Name (Optional)
[_____________________________]

Last Name
[_____________________________] {required:true}

Date of Birth
[_____________________________] {type:date required:true}

Gender
- (*) Prefer not to say
- ( ) Male
- ( ) Female
- ( ) Non-binary
- ( ) Other

---

### Contact Information

Primary Email
[_____________________________] {type:email required:true state:disabled}
*Verified ✓*

Secondary Email (Optional)
[_____________________________] {type:email}

Mobile Phone
[_____________________________] {type:tel required:true}

Landline (Optional)
[_____________________________] {type:tel}

Preferred Contact
- (*) Email
- ( ) Phone
- ( ) SMS

:::

---

## Address Details {.grid-2}

### Home Address

Street Address
[_____________________________] {required:true}

Apartment, Suite, etc.
[_____________________________]

City
[_____________________________] {required:true}

State/Province
[Select state...v]
- California
- New York
- Texas
- Florida
- Other

Zip/Postal Code
[_____] {required:true}

Country
[United States...v]

### Billing Address

- [ ] Same as home address

Street Address
[_____________________________]

City
[_____________________________]

State/Province
[Select state...v]

Zip/Postal Code
[_____]

##

---

::: card

### Preferences

Language
[Select language...v]
- English
- Spanish
- French
- German
- Chinese
- Japanese

Timezone
[Select timezone...v]
- (GMT-8) Pacific Time
- (GMT-5) Eastern Time
- (GMT) London
- (GMT+1) Paris

Communication Preferences
- [x] Email notifications
- [x] SMS alerts
- [ ] Push notifications
- [ ] Phone calls

Newsletter Topics
- [x] Product Updates
- [x] Industry News
- [ ] Special Offers
- [ ] Events & Webinars

:::

---

## Navigation

[← Previous Step] [Save Draft] [Next Step →]* [Cancel]

::: alert info
ℹ️ Your progress is automatically saved. You can return to this form anytime.
:::

---

## All Steps Overview

::: card {.minimal}

### Wizard Steps

1. **Account Basics** ✓ *Completed*
   - Username, password, email verification

2. **Personal Information** *In Progress*
   - Profile details, contact info, address

3. **Professional Details** *Pending*
   - Job title, company, industry, experience

4. **Review & Submit** *Pending*
   - Confirm all information and activate account

:::

---

::: footer
Need help? [Contact Support](https://example.com/support) | [Save & Exit]
:::

---

**Style Variations:**
- `sketch` - Low-fidelity wireframe for UX testing
- `clean` - Polished multi-step experience
- `wireframe` - Focus on form flow structure
- `tailwind` - Modern step indicator design
- `material` - Elevated cards with transitions
- `brutal` - Bold step navigation
- `none` - Semantic markup for frameworks

**Generate this example:**
```bash
wiremd multi-step-form.md --style sketch
wiremd multi-step-form.md --style tailwind -o multi-step-tailwind.html
```
