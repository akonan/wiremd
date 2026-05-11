# Navigation Patterns

> **Use Case:** Comprehensive showcase of navigation components for websites and applications.
>
> **Key Features:** Top navigation, breadcrumbs, tabs, sidebar menus, mobile navigation, footer links

## 1. Top Navigation Bars

### Basic Navigation

::: demo
[[ Home | Products | Services | About | Contact ]]
:::

### Navigation with Logo and Buttons

::: demo
[[ :logo: Brand | Features | Pricing | Docs | [Sign In] | [Get Started]* ]]
:::

### Navigation with Active State

::: demo
[[ Logo | Home | *Products* | Services | About | Contact ]]
:::

### Navigation with Icons

::: demo
[[ :home: Home | :shopping: Shop | :info: About | :mail: Contact | :user: Account ]]
:::

### Full Featured Navigation

::: demo
[[ :logo: MyApp | Home | Features | Pricing | Resources | Blog | :search: | :bell: (3) | :user: John Doe | [Sign Out] ]]
:::

---

## 2. Breadcrumb Navigation

### Simple Breadcrumbs

::: demo
[[ Home > Products > Electronics > Laptops ]]
:::

### Breadcrumbs with Icons

::: demo
[[ :home: Home > :folder: Documents > :file: Report.pdf ]]
:::

### Multi-Level Breadcrumbs

::: demo
[[ Dashboard > Projects > Mobile App v2.0 > Sprint 12 > Tasks ]]
:::

---

## 3. Sidebar Navigation

### Basic Sidebar

::: demo
::: sidebar
#### Navigation
- Dashboard
- Profile
- Settings
- Logout
:::
:::

### Sidebar with Icons and Badges

::: demo
::: sidebar
### Main Menu
- :home: Dashboard
- :users: Team Members (12)
- :calendar: Calendar
- :chart: Analytics
- :settings: Settings
- :bell: Notifications (5)
- :help: Help & Support

### Quick Actions
[+ New Project]*
[+ Invite User]

### Account
:user: John Doe
[Sign Out]
:::
:::

### Collapsible Sidebar Sections

::: demo
::: sidebar
### Projects
- :star: Favorites
  - Mobile App
  - Website Redesign
- :folder: Active Projects
  - E-Commerce Platform
  - Marketing Campaign
  - API Integration
- :archive: Archived
  - Old Project 1
  - Old Project 2

### Settings
- :user: Profile
- :bell: Notifications
- :lock: Privacy
- :credit-card: Billing
:::
:::

---

## 4. Tab-Style Navigation

### Horizontal Tab Nav

::: demo
[[ *Overview* | Details | Settings | History ]]
:::

### Tab Nav with Content Section

::: demo
[[ :logo: App | *Profile* | Security | Notifications | Billing ]]

---

### Profile Settings

Full Name
[John Doe___________]

Email
[john@example.com___________] {type:email}

[Save Changes]*
:::

---

## 5. Footer Navigation

### Simple Footer

::: demo
::: footer
[[ Privacy | Terms | Contact ]]
© 2025 Company Name
:::
:::

### Multi-Column Footer

::: demo
::: footer

::: grid-4 card

### Product
- Features
- Pricing
- Changelog
- Roadmap

### Resources
- Documentation
- Tutorials
- Blog
- API Reference

### Company
- About
- Careers
- Press
- Partners

### Legal
- Privacy Policy
- Terms of Service
- Cookie Policy
- GDPR

:::

---

[[ :twitter: Twitter | :facebook: Facebook | :linkedin: LinkedIn | :github: GitHub ]]

© 2025 Company Inc. All rights reserved.

:::
:::

---

## 6. Mobile Navigation

### Mobile Menu Structure

::: demo
::: sidebar
### Menu

- :home: Home
- :shopping: Products
- :info: About
- :mail: Contact

### Account
- :user: Profile
- :settings: Settings

[Search...___________] {type:search}
:::
:::

---

## 7. Pagination Navigation

### Basic Pagination

::: demo
Showing 1-20 of 1,234 items

[← Previous] [1] [2] [3] ... [62] [Next →]
:::

### Advanced Pagination

::: demo
Page [3___] of 62 | Show [20...v] per page

[« First] [‹ Prev] [1] [2] [*3*] [4] [5] [Next ›] [Last »]

Jump to page: [___] [Go]
:::

---

## 8. Step Navigation (Wizard)

### Progress Steps

::: demo
[########__________] Step 2 of 4

[[ :check: Step 1 | *Step 2* | Step 3 | Step 4 ]]

Currently on: **Personal Information**

[← Previous Step] [Next Step →]*
:::

---

## 9. Context Menu / Action Menu

### Action Menu

::: demo
Actions:
- :edit: Edit
- :copy: Duplicate
- :share: Share
- :download: Download
- :trash: Delete
:::

---

## 10. Tag / Filter Navigation

### Tag Cloud

::: demo
Filter by tags:

[All] [Design (45)] [Development (32)] [Marketing (23)] [Sales (12)] [Support (8)]

**Selected:** Design • Development
:::

---

## Best Practices

::: card

### Navigation Design Tips

1. **Keep it Simple**
   - Limit top navigation to 5-7 items
   - Use clear, concise labels
   - Maintain consistent positioning

2. **Show Current Location**
   - Use active states (*Item*)
   - Include breadcrumbs for deep hierarchies
   - Highlight current page

3. **Mobile Considerations**
   - Use hamburger menu for mobile
   - Ensure touch targets are large enough
   - Consider sticky navigation

4. **Accessibility**
   - Use semantic navigation elements
   - Provide keyboard navigation
   - Include skip links

5. **Visual Hierarchy**
   - Primary actions should stand out
   - Use icons sparingly and meaningfully
   - Group related items

:::

---

**Style Variations:**
- `sketch` - Hand-drawn navigation wireframes
- `clean` - Modern, minimal navigation
- `wireframe` - Structure-focused navigation
- `tailwind` - Contemporary nav with accents
- `material` - Google-style navigation
- `brutal` - Bold, distinctive nav
- `none` - Semantic HTML for custom styling

**Generate this example:**
```bash
wiremd navigation-patterns.md --style sketch
wiremd navigation-patterns.md --style clean -o nav-clean.html
wiremd navigation-patterns.md --style material -o nav-material.html
```
