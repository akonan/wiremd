# Wiremd Element Showcase
<!-- This file demonstrates all supported elements in the wiremd/markdown-mockup tool -->

---

## Navigation Components
<!-- Navigation bars using [[...]] syntax -->

### Basic Navigation
[[ Home | Products | About | Contact ]]

### Navigation with Brand Icon
[[ :logo: MyApp | Home | Features | Pricing | Docs ]]

### Navigation with Buttons
[[ :rocket: StartupApp | Home | About | [Sign In] | [Get Started]* ]]

### Navigation with Classes
[[ Home | Products | Services | Contact ]]{.navbar .sticky}

---

## Form Elements
<!-- All form input types and controls -->

### Text Inputs

#### Basic Text Input
Username
[_____________________________]

#### Password Input
Password
[*****************************]

#### Input with Placeholder
[Enter your name_______________]

#### Required Email Input
Email
[email@example.com_____________]{type:email required}

#### Various Input Types
Phone
[+1 (555) 000-0000_____________]{type:tel}

Website
[https://example.com___________]{type:url}

Age
[25____________________________]{type:number min:0 max:120}

Birthday
[_____________________________]{type:date}

Appointment Time
[_____________________________]{type:time}

Search
[Search...____________________]{type:search}

### Buttons

#### Basic Buttons
[Submit] [Cancel] [Reset]

#### Primary Button (with asterisk)
[Save Changes]* [Discard]

#### Buttons with Classes
[Confirm]{.success} [Delete]{.danger} [Info]{.info}

#### Button States
[Loading...]{state:loading}
[Disabled Button]{disabled}
[Active Button]{state:active}

### Checkboxes
<!-- Task list syntax for checkboxes -->

Select your preferences:
- [ ] Receive newsletter
- [x] Accept terms and conditions
- [x] Enable notifications{required}
- [ ] Share usage data

### Radio Buttons
<!-- Radio button syntax with parentheses -->

Choose your plan:
- ( ) Free Plan
- (•) Pro Plan ($9/month)
- ( ) Enterprise (Contact us)

Payment method:
- (x) Credit Card{name:payment value:card}
- ( ) PayPal{name:payment value:paypal}
- ( ) Bank Transfer{name:payment value:bank}

### Dropdown/Select
<!-- Select boxes with v] ending -->

Country
[Select your country__________v]
- United States
- Canada
- United Kingdom
- Australia
- Other

Topic
[Choose a topic______________v]{required}
- General Inquiry
- Technical Support
- Billing
- Feature Request
- Bug Report

### Multi-line Text (Textarea)
Message
[Tell us more about your project...]{rows:5}

Feedback
[Your feedback helps us improve...]{rows:8 required}

---

## Layout Containers
<!-- Container blocks using ::: syntax -->

::: hero
# Welcome to Our Platform
Build amazing products with our powerful tools

[Get Started]* [Watch Demo]
:::

::: card {.featured}
## Premium Feature
This is a featured card with special styling.
Enhanced capabilities for power users.

[Upgrade Now]*
:::

::: modal
### Confirm Action
Are you sure you want to proceed with this action?

[Confirm]* [Cancel]
:::

::: sidebar
#### Quick Links
- Dashboard
- Settings
- Profile
- Help

#### Recent Activity
- User logged in
- File uploaded
- Settings updated
:::

::: alert {.warning}
**Warning!** Your session will expire in 5 minutes.
[Extend Session]
:::

::: section
### About Us
We are dedicated to creating innovative solutions that help businesses thrive in the digital age.
:::

::: footer
[[ Privacy | Terms | Contact | :twitter: | :github: | :linkedin: ]]
© 2024 Example Corp. All rights reserved.
:::

---

## Grid Layouts
<!-- Grid layouts using heading classes -->

### Three Column Grid
## Features {.grid-3}

### :rocket: Fast Performance
Lightning-fast load times and smooth interactions

### :shield: Secure by Default
Enterprise-grade security built into every layer

### :gear: Fully Customizable
Adapt every aspect to match your needs

### Two Column Grid
## Comparison {.grid-2}

### Free Plan
- 5 Projects
- Basic Support
- Community Access

[Choose Free]

### Pro Plan
- Unlimited Projects
- Priority Support
- Advanced Features
- API Access

[Choose Pro]*

### Four Column Grid
## Our Services {.grid-4}

### Design
Creative solutions

### Development
Custom applications

### Consulting
Expert guidance

### Support
24/7 assistance

---

## Content Elements
<!-- Standard markdown content with enhancements -->

### Headings with Icons
# :star: Main Title
## :book: Section Header
### :bulb: Subsection
#### :info: Detail Level

### Text Content
This is a regular paragraph with **bold text** and *italic text*. You can also include `inline code` and combine various formatting options.

### Lists

#### Unordered List
- First item
- Second item
  - Nested item
  - Another nested item
- Third item

#### Ordered List
1. Step one
2. Step two
3. Step three

#### Mixed List with Checkboxes
1. Complete setup
   - [x] Install dependencies
   - [x] Configure environment
   - [ ] Run tests
2. Deploy application
3. Monitor performance

### Blockquotes
> "The best way to predict the future is to invent it."
>
> — Alan Kay

### Code Blocks
```javascript
function greet(name) {
  return `Hello, ${name}!`;
}
```

```python
def calculate_sum(a, b):
    return a + b
```

### Horizontal Rules
Above the line

---

Below the line

***

Another separator

___

### Tables (when implemented)
| Feature | Free | Pro | Enterprise |
|---------|------|-----|------------|
| Users | 5 | 50 | Unlimited |
| Storage | 10GB | 100GB | Custom |
| Support | Email | Priority | Dedicated |

---

## States & Modifiers
<!-- Demonstrating various states and attribute combinations -->

### Component States

#### Loading States
[Processing...]{state:loading}

::: card {state:loading}
### Loading Content
Please wait while we fetch your data...
:::

#### Error States
[Error: Invalid Input]{state:error}

Email
[invalid@email]{state:error type:email}

::: alert {state:error}
**Error!** Unable to save changes. Please try again.
:::

#### Success States
[Success!]{state:success}

::: alert {state:success}
**Success!** Your changes have been saved.
:::

#### Disabled States
[Disabled Button]{disabled}

Name
[Cannot edit this field_______]{disabled}

- [ ] Disabled option{disabled}

### Combined Attributes
<!-- Multiple attributes on single elements -->

[Submit Form]{.primary .large required type:submit}

[user@example.com_____________]{type:email required .form-input placeholder:"Enter email"}

[Choose File__________________v]{required multiple .custom-select}
- Option A
- Option B
- Option C

---

## Complete Form Example
<!-- Putting it all together -->

::: card
### Create Account

Full Name
[John Doe_____________________]{required}

Email Address
[john@example.com_____________]{type:email required}

Password
[*****************************]{required}

Confirm Password
[*****************************]{required}

Country
[United States_______________v]{required}
- United States
- Canada
- United Kingdom
- Australia
- Germany
- France
- Japan
- Other

Account Type
- (•) Personal
- ( ) Business
- ( ) Enterprise

Agreements
- [x] I accept the terms of service{required}
- [ ] Send me promotional emails
- [x] Enable two-factor authentication

[Create Account]* [Cancel]
:::

---

## Complex Layout Example
<!-- Demonstrating nested components and layouts -->

## Dashboard {.grid-3}

::: card
### :chart: Analytics
**Total Users:** 1,234
**Active Today:** 567
**Growth:** +12.3%

[View Details]
:::

::: card
### :bell: Notifications
- New user registered
- Payment received
- Report generated
- System update available

[Mark All Read]
:::

::: card {.featured}
### :star: Premium Features
Unlock advanced capabilities:
- Custom branding
- API access
- Priority support

[Upgrade Now]*
:::

---

## Footer Section
::: footer
### Company
- About Us
- Careers
- Press
- Blog

### Product
- Features
- Pricing
- Security
- Roadmap

### Support
- Help Center
- Documentation
- Contact Us
- Status

### Legal
- Privacy Policy
- Terms of Service
- Cookie Policy
- GDPR

[[ :facebook: | :twitter: | :linkedin: | :github: | :youtube: ]]

© 2024 Example Company. All rights reserved.
:::