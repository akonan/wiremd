# Test Corpus v1: Balsamiq-Inspired Syntax

**Version:** 1.0
**Date:** November 6, 2025
**Approach:** Visual pattern syntax - symbols that visually resemble their output
**Philosophy:** Maximum visual similarity, minimal markdown extensions

---

## Pattern 1: Login Form

```wiremd
┌─────────────────────────────────┐
│        Welcome Back             │
│                                 │
│  Email                          │
│  [_____________________]        │
│                                 │
│  Password                       │
│  [*********************]        │
│                                 │
│  [ ] Remember me                │
│                                 │
│  [      Sign In       ]         │
│                                 │
│  Forgot password?               │
│  Don't have an account? Sign up │
└─────────────────────────────────┘
```

**Alternative Compact Syntax:**
```
Email
[________________________]

Password
[************************]

[ ] Remember me

[Sign In]

Forgot password?
```

---

## Pattern 2: Navigation Bar

```wiremd
[[ :logo: MyApp | Home | Products | Pricing | About | Contact | [Sign In] [Get Started]* ]]
```

**Legend:**
- `[[...]]` = Navigation container
- `|` = Separators between items
- `[Text]` = Button
- `[Text]*` = Primary/highlighted button
- `:icon:` = Icon placeholder

---

## Pattern 3: Hero Section

```wiremd
╔════════════════════════════════════════════╗
║                                            ║
║         Build Amazing Products             ║
║         ==================                 ║
║                                            ║
║    The fastest way to create wireframes   ║
║    and mockups using pure markdown        ║
║                                            ║
║    [Get Started]*  [Learn More]           ║
║                                            ║
║    [          Screenshot.png          ]    ║
║                                            ║
╚════════════════════════════════════════════╝
```

**Alternative:**
```
> # Build Amazing Products
> The fastest way to create wireframes and mockups using pure markdown
>
> [Get Started]*  [Learn More]
>
> ![Hero Screenshot](hero.png)
```

---

## Pattern 4: Feature Grid (3 columns)

```wiremd
╔════════════╗  ╔════════════╗  ╔════════════╗
║ :rocket:   ║  ║ :shield:   ║  ║ :zap:      ║
║            ║  ║            ║  ║            ║
║ Fast       ║  ║ Secure     ║  ║ Powerful   ║
║            ║  ║            ║  ║            ║
║ Lightning  ║  ║ Enterprise ║  ║ Advanced   ║
║ quick      ║  ║ grade      ║  ║ features   ║
║ rendering  ║  ║ security   ║  ║ included   ║
╚════════════╝  ╚════════════╝  ╚════════════╝
```

**Alternative Grid Syntax:**
```
[[ :rocket: | :shield: | :zap: ]] {.icons}
[[ **Fast** | **Secure** | **Powerful** ]]
[[ Lightning quick rendering | Enterprise grade security | Advanced features included ]]
```

---

## Pattern 5: Contact Form

```wiremd
Contact Us
──────────

Name*
[_____________________________]

Email*
[_____________________________]

Phone
[_____________________________]

Subject
[Select a topic____________v]

Message*
[                            ]
[                            ]
[                            ]
[                            ]
[____________________________]

[ ] Subscribe to newsletter

[Send Message]*
```

---

## Pattern 6: Search Bar

```wiremd
:magnifying-glass: [Search products, articles, help...____________] [Search]
```

**With autocomplete dropdown:**
```
:magnifying-glass: [Search products____________]
┌──────────────────────────────┐
│ Recent searches:             │
│ • Product A                  │
│ • Documentation              │
│ • Support                    │
└──────────────────────────────┘
```

---

## Pattern 7: User Profile Card

```wiremd
┌─────────────────────────────┐
│  [ Avatar.jpg ]             │
│   (  O   )                  │
│                             │
│  **John Doe**               │
│  Product Designer           │
│  San Francisco, CA          │
│                             │
│  [Edit Profile] [:gear:]    │
│                             │
│  ┌─────────┬─────────┬─────┐│
│  │ 1,234   │ 567     │ 89  ││
│  │ Posts   │ Follow  │ Fol ││
│  │         │ ers     │ low ││
│  └─────────┴─────────┴─────┘│
└─────────────────────────────┘
```

---

## Pattern 8: Settings Page

```wiremd
Settings
════════

Account Settings
────────────────

Display Name
[John Doe__________________]

Email
[john@example.com__________]
-john@example.com-  [Change Email]


Preferences
───────────

(•) Light mode
( ) Dark mode
( ) Auto

[x] Email notifications
[x] Push notifications
[ ] SMS notifications


Privacy
───────

( ) Public profile
(•) Friends only
( ) Private

[Save Changes]*  [Cancel]
```

---

## Pattern 9: Data Table

```wiremd
┌─────┬────────────┬────────────┬──────────┬─────────┐
│ [ ] │ Name       │ Email      │ Role     │ Actions │
├─────┼────────────┼────────────┼──────────┼─────────┤
│ [x] │ John Doe   │ john@ex... │ Admin    │ [:edit:]│
│ [ ] │ Jane Smith │ jane@ex... │ User     │ [:edit:]│
│ [ ] │ Bob Wilson │ bob@exa... │ User     │ [:edit:]│
│ [ ] │ Alice Chen │ alice@e... │ Manager  │ [:edit:]│
└─────┴────────────┴────────────┴──────────┴─────────┘

[< Previous]  1 2 3 ... 10  [Next >]
```

**Markdown Table Alternative:**
```
| Select | Name        | Email          | Role    | Actions |
|--------|-------------|----------------|---------|---------|
| [ ]    | John Doe    | john@ex...     | Admin   | [:edit:]|
| [x]    | Jane Smith  | jane@ex...     | User    | [:edit:]|
| [ ]    | Bob Wilson  | bob@exa...     | User    | [:edit:]|
```

---

## Pattern 10: Modal/Dialog

```wiremd
╔═══════════════════════════════════╗
║ Confirm Delete              [:x:] ║
╠═══════════════════════════════════╣
║                                   ║
║  Are you sure you want to delete  ║
║  this item? This action cannot    ║
║  be undone.                       ║
║                                   ║
║                                   ║
║              [Cancel] [Delete]*   ║
║                                   ║
╚═══════════════════════════════════╝

--- Background (dimmed) ---
```

**Alternative:**
```
!!! modal "Confirm Delete"
    Are you sure you want to delete this item?
    This action cannot be undone.

    [Cancel] [Delete]*
```

---

## Pattern 11: Sidebar Navigation

```wiremd
┌──────────────────┐
│ :house: Home     │ ←
├──────────────────┤
│ :inbox: Messages │
│ :bell: Alerts    │
│ :user: Profile   │
│ :gear: Settings  │
├──────────────────┤
│ :help: Help      │
│ :logout: Logout  │
└──────────────────┘
```

**Compact:**
```
- :house: Home {.active}
- :inbox: Messages
- :bell: Alerts (3)
- :user: Profile
- :gear: Settings
---
- :help: Help
- :logout: Logout
```

---

## Pattern 12: Footer

```wiremd
════════════════════════════════════════════════════════
Product          Company          Resources         Legal
────────         ────────         ────────          ─────
Features         About            Docs              Terms
Pricing          Team             Blog              Privacy
Updates          Careers          Support           Cookies
Roadmap          Press            API
════════════════════════════════════════════════════════
© 2025 Company Name. All rights reserved.

:twitter: :linkedin: :github: :facebook:
════════════════════════════════════════════════════════
```

---

## Pattern 13: Breadcrumbs

```wiremd
Home > Products > Category > Item Name
```

**With icons:**
```
:house: Home  >  :folder: Products  >  :folder: Electronics  >  Laptop Pro
```

---

## Pattern 14: Tabs

```wiremd
╔════════════════════════════════════════╗
║ [Overview]* | Details | Reviews | FAQ  ║
╠════════════════════════════════════════╣
║                                        ║
║  This is the overview content...       ║
║                                        ║
║  • Feature 1                           ║
║  • Feature 2                           ║
║  • Feature 3                           ║
║                                        ║
╚════════════════════════════════════════╝
```

**Markdown-style:**
```
[Overview]* | Details | Reviews | FAQ
───────────────────────────────────

This is the overview content...

• Feature 1
• Feature 2
• Feature 3
```

---

## Pattern 15: Accordion/Collapsible

```wiremd
▼ Question 1: What is your refund policy?
  ─────────────────────────────────────────
  Our refund policy allows returns within 30 days
  of purchase for a full refund.

▼ Question 2: Do you offer support?
  ─────────────────────────────────────────
  Yes, we offer 24/7 email support and live chat
  during business hours.

▶ Question 3: What payment methods do you accept?

▶ Question 4: Is there a free trial?
```

---

## Pattern 16: Alert/Notification

```wiremd
┌─────────────────────────────────────────┐
│ :check-circle: Success                  │
│ Your changes have been saved!           │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ :info-circle: Information               │
│ System maintenance scheduled for 10 PM  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ :warning: Warning                       │
│ Your trial expires in 3 days            │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ :x-circle: Error                        │
│ Failed to save changes. Please retry.   │
└─────────────────────────────────────────┘
```

**Compact:**
```
:check-circle: Success: Your changes have been saved!

:info-circle: System maintenance scheduled for 10 PM

:warning: Warning: Your trial expires in 3 days

:x-circle: Error: Failed to save changes
```

---

## Pattern 17: Loading State

```wiremd
┌─────────────────────────┐
│    [  Loading...  ]     │
│         ⟳               │
│                         │
│  Please wait while we   │
│  process your request   │
└─────────────────────────┘
```

**Inline:**
```
[Loading...]~

[Please wait...]~  {.spinner}

--- Loading ---
```

---

## Pattern 18: Empty State

```wiremd
┌──────────────────────────────┐
│                              │
│       :empty-box:            │
│                              │
│    No items found            │
│                              │
│  Get started by creating     │
│  your first item             │
│                              │
│      [Create Item]*          │
│                              │
└──────────────────────────────┘
```

---

## Pattern 19: Error State

```wiremd
┌──────────────────────────────┐
│                              │
│       :warning:              │
│                              │
│    Something went wrong      │
│                              │
│  We couldn't load this page. │
│  Please try again.           │
│                              │
│      [Retry] [Go Back]       │
│                              │
└──────────────────────────────┘
```

---

## Pattern 20: Dashboard Layout

```wiremd
╔════════════════════════════════════════════════════════╗
║ [[ :logo: Dashboard | :bell: :user: ]]                ║
╠═══════╦════════════════════════════════════════════════╣
║ Dash  ║  Welcome back, John!                          ║
║ ────  ║                                                ║
║ Users ║  ┌──────────┐ ┌──────────┐ ┌──────────┐      ║
║ Posts ║  │ :users:  │ │ :chart:  │ │ :dollar: │      ║
║ Files ║  │  1,234   │ │   +12%   │ │ $45,678  │      ║
║       ║  │  Users   │ │  Growth  │ │ Revenue  │      ║
║ ────  ║  └──────────┘ └──────────┘ └──────────┘      ║
║ Help  ║                                                ║
║ Exit  ║  Recent Activity                               ║
║       ║  ────────────────                              ║
║       ║  ┌────────────────────────────────────────┐   ║
║       ║  │ Name      Status    Date      Action  │   ║
║       ║  ├────────────────────────────────────────┤   ║
║       ║  │ Item 1    Active    Today     [:edit:]│   ║
║       ║  │ Item 2    Pending   Yester... [:edit:]│   ║
║       ║  └────────────────────────────────────────┘   ║
╚═══════╩════════════════════════════════════════════════╝
```

---

## Syntax Legend

### Components
- `[Text]` = Button
- `[Text]*` = Primary button
- `[Text___]` = Text input (underscores show width)
- `[***___]` = Password input
- `[Text...v]` = Dropdown/select
- `[Text...]` = Textarea (multiple lines)
- `[ ]` = Checkbox (unchecked)
- `[x]` = Checkbox (checked)
- `( )` = Radio button (unselected)
- `(•)` = Radio button (selected)
- `[Image.png]` = Image placeholder

### Containers
- `[[ ... ]]` = Navigation bar or inline container
- `╔═══╗` = Hero section / prominent container
- `┌───┐` = Standard container / card
- `> ...` = Blockquote for hero/callout
- `--- ... ---` = Separator with label

### States
- `~` suffix = Loading state (e.g., `[Loading...]~`)
- `-text-` = Disabled/grayed out text
- `*` suffix = Primary/active state
- `←` arrow = Active/selected item

### Icons
- `:icon-name:` = Icon (Slack/GitHub style)
- Examples: `:house:`, `:user:`, `:gear:`, `:check-circle:`

### Layout
- `|` = Column/section separator
- `─` = Horizontal divider
- `>` = Breadcrumb separator
- `▼` = Expanded accordion
- `▶` = Collapsed accordion

### Typography
- `**Text**` = Bold
- `*Text*` = Italic
- `-text-` = Strikethrough/disabled
- `#` = Heading levels (H1-H6)

---

## Design Notes

### Strengths of This Approach
1. **Maximum visual similarity** - The syntax looks like the output
2. **Intuitive** - Easy to understand what components will render
3. **Quick to write** - Similar to Balsamiq's shortcuts
4. **ASCII art friendly** - Can draw boxes for clarity

### Challenges
1. **ASCII boxes are tedious** - May need generator tools
2. **Alignment issues** - Monospace font dependency
3. **Not pure markdown** - Extends markdown significantly
4. **Width indicators** - Underscores for width may be unclear

### Best Use Cases
- Quick sketches
- Developers familiar with ASCII art
- When visual layout in source is important
- Teaching/documentation where seeing structure helps

### Worst Use Cases
- Version control diffs (boxes cause noise)
- Mobile/small screen editing
- When precision layout matters
- Non-technical users

---

**Status:** Draft for evaluation
**Next Steps:** Compare with v2 (Markdown-first) and v3 (Hybrid) approaches
