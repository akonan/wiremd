# Form Controls Showcase

> **Use Case:** Comprehensive demonstration of all form input types and controls.
>
> **Key Features:** Text inputs, selections, checkboxes, radios, buttons, validation states, layouts

## Form Controls Component Showcase

Complete reference for all form control types supported by wiremd.

---

## 1. Text Inputs

### Basic Text Inputs

```markdown
Username
[_____________________________]

Email
[_____________________________] {type:email}

Password
[********] {type:password}

Confirm Password
[********] {type:password}
```

**Rendered:**

Username
[_____________________________]

Email
[_____________________________] {type:email}

Password
[********] {type:password}

Confirm Password
[********] {type:password}

---

### Input Width Variations

```markdown
Zip Code
[_____]

Phone Number
[_______________]

Full Name
[_____________________________]
```

**Rendered:**

Zip Code
[_____]

Phone Number
[_______________]

Full Name
[_____________________________]

---

### Specialized Input Types

```markdown
Website URL
[https://___________] {type:url}

Phone Number
[_____________________________] {type:tel}

Date of Birth
[_____________________________] {type:date}

Time
[_____________________________] {type:time}

Number
[1___] {type:number min:1 max:100}

Search
[Search...___________] {type:search}

Color
[#______] {type:color}
```

**Rendered:**

Website URL
[https://___________] {type:url}

Phone Number
[_____________________________] {type:tel}

Date of Birth
[_____________________________] {type:date}

Time
[_____________________________] {type:time}

Number
[1___] {type:number min:1 max:100}

Search
[Search...___________] {type:search}

Color
[#______] {type:color}

---

## 2. Textarea

### Multi-line Text Areas

```markdown
Short Comment
[Enter your comment...] {rows:3}

Long Description
[Write detailed description...] {rows:6}

Code Snippet
[Paste code here...] {rows:8 cols:60}
```

**Rendered:**

Short Comment
[Enter your comment...] {rows:3}

Long Description
[Write detailed description...] {rows:6}

Code Snippet
[Paste code here...] {rows:8 cols:60}

---

## 3. Checkboxes

### Single Checkbox

```markdown
- [x] I agree to the Terms of Service
- [ ] Subscribe to newsletter
```

**Rendered:**

- [x] I agree to the Terms of Service
- [ ] Subscribe to newsletter

---

### Checkbox Groups

```markdown
Select your interests:
- [x] Web Development
- [x] Mobile Development
- [ ] Data Science
- [ ] Machine Learning
- [ ] DevOps
- [ ] UI/UX Design
```

**Rendered:**

Select your interests:
- [x] Web Development
- [x] Mobile Development
- [ ] Data Science
- [ ] Machine Learning
- [ ] DevOps
- [ ] UI/UX Design

---

## 4. Radio Buttons

### Basic Radio Group

```markdown
Account Type:
- (*) Personal
- ( ) Business
- ( ) Enterprise
```

**Rendered:**

Account Type:
- (*) Personal
- ( ) Business
- ( ) Enterprise

---

### Radio with Descriptions

```markdown
Subscription Plan:
- (*) Free - Basic features for individuals
- ( ) Pro ($29/mo) - Advanced features for professionals
- ( ) Team ($99/mo) - Collaboration tools for teams
- ( ) Enterprise (Custom) - Full-featured for organizations
```

**Rendered:**

Subscription Plan:
- (*) Free - Basic features for individuals
- ( ) Pro ($29/mo) - Advanced features for professionals
- ( ) Team ($99/mo) - Collaboration tools for teams
- ( ) Enterprise (Custom) - Full-featured for organizations

---

## 5. Select Dropdowns

### Basic Select

```markdown
Country
[Select country...v]
- United States
- Canada
- United Kingdom
- Australia
- Other
```

**Rendered:**

Country
[Select country...v]

---

### Multiple Selects

```markdown
Skills (Select multiple)
[Choose skills...v]
- JavaScript
- Python
- Java
- C++
- Ruby
- Go

Time Zone
[Select timezone...v]
- (GMT-8) Pacific Time
- (GMT-5) Eastern Time
- (GMT) London
- (GMT+1) Paris
```

**Rendered:**

Skills (Select multiple)
[Choose skills...v]

Time Zone
[Select timezone...v]

---

## 6. Buttons

### Button Types

```markdown
[Default Button]

[Primary Button]*

[Secondary Button]{.outline}
```

**Rendered:**

[Default Button]

[Primary Button]*

[Secondary Button]{.outline}

---

### Button States

```markdown
[Normal]

[Disabled]{state:disabled}

[Loading...]{state:loading}

[Active]{state:active}

[Success]{state:success}
```

**Rendered:**

[Normal]

[Disabled]{state:disabled}

[Loading...]{state:loading}

[Active]{state:active}

[Success]{state:success}

---

### Button Variants

```markdown
[Primary Action]{variant:primary}

[Success]{variant:success}

[Warning]{variant:warning}

[Danger Action]{variant:danger}

[Info]{variant:info}
```

**Rendered:**

[Primary Action]{variant:primary}

[Success]{variant:success}

[Warning]{variant:warning}

[Danger Action]{variant:danger}

[Info]{variant:info}

---

### Button Groups

```markdown
[Save] [Cancel] [Reset]

[Cut] [Copy] [Paste]

[Bold] [Italic] [Underline]
```

**Rendered:**

[Save] [Cancel] [Reset]

[Cut] [Copy] [Paste]

[Bold] [Italic] [Underline]

---

## 7. Input States

### Required Fields

```markdown
Full Name (Required)
[_____________________________] {required:true}

Email (Required)
[_____________________________] {type:email required:true}
```

**Rendered:**

Full Name (Required)
[_____________________________] {required:true}

Email (Required)
[_____________________________] {type:email required:true}

---

### Disabled Fields

```markdown
Username (Cannot be changed)
[johndoe___________] {state:disabled}

Email (Verified)
[[email protected]___________] {type:email state:disabled}
```

**Rendered:**

Username (Cannot be changed)
[johndoe___________] {state:disabled}

Email (Verified)
[[email protected]___________] {type:email state:disabled}

---

### Error States

```markdown
Invalid Email
[not-an-email___________] {state:error}
⚠️ Please enter a valid email address

Password Too Short
[123___] {type:password state:error}
⚠️ Password must be at least 8 characters
```

**Rendered:**

Invalid Email
[not-an-email___________] {state:error}
⚠️ Please enter a valid email address

Password Too Short
[123___] {type:password state:error}
⚠️ Password must be at least 8 characters

---

## 8. Form Layouts

### Vertical Form (Default)

```markdown
::: card
### Contact Form

Full Name
[_____________________________] {required:true}

Email
[_____________________________] {type:email required:true}

Phone
[_____________________________] {type:tel}

Message
[Your message...] {rows:5 required:true}

[Submit]* [Clear]
:::
```

**Rendered:**

::: card
### Contact Form

Full Name
[_____________________________] {required:true}

Email
[_____________________________] {type:email required:true}

Phone
[_____________________________] {type:tel}

Message
[Your message...] {rows:5 required:true}

[Submit]* [Clear]
:::

---

### Two-Column Form Layout

```markdown
## Personal Information {.grid-2}

### Left Column

First Name
[_____________________________] {required:true}

Email
[_____________________________] {type:email required:true}

Phone
[_____________________________] {type:tel}

### Right Column

Last Name
[_____________________________] {required:true}

Date of Birth
[_____________________________] {type:date}

Country
[Select country...v]

##
```

**Rendered:**

## Personal Information {.grid-2}

### Left Column

First Name
[_____________________________] {required:true}

Email
[_____________________________] {type:email required:true}

Phone
[_____________________________] {type:tel}

### Right Column

Last Name
[_____________________________] {required:true}

Date of Birth
[_____________________________] {type:date}

Country
[Select country...v]

##

---

## 9. Complex Form Example

### Complete Registration Form

```markdown
::: card
### Create Account

## Account Details {.grid-2}

### Login Information

Email Address
[_____________________________] {type:email required:true}

Username
[_____________________________] {required:true}

Password
[********] {type:password required:true}
*Minimum 8 characters*

Confirm Password
[********] {type:password required:true}

### Personal Information

First Name
[_____________________________] {required:true}

Last Name
[_____________________________] {required:true}

Phone Number
[_____________________________] {type:tel}

Date of Birth
[_____________________________] {type:date}

##

---

**Address**

Street Address
[_____________________________]

City
[_____________________________]

State/Province
[Select state...v]

Zip/Postal Code
[_____]

Country
[United States...v]

---

**Account Preferences**

Account Type
- (*) Personal
- ( ) Business
- ( ) Student

Newsletter Preferences
- [x] Weekly newsletter
- [x] Product updates
- [ ] Special offers
- [ ] Event notifications

---

**Terms & Privacy**

- [x] I agree to the [Terms of Service](https://example.com/terms)
- [x] I agree to the [Privacy Policy](https://example.com/privacy)
- [ ] I want to receive marketing emails

[Create Account]* [Cancel]

:::
```

**Rendered:**

::: card
### Create Account

## Account Details {.grid-2}

### Login Information

Email Address
[_____________________________] {type:email required:true}

Username
[_____________________________] {required:true}

Password
[********] {type:password required:true}
*Minimum 8 characters*

Confirm Password
[********] {type:password required:true}

### Personal Information

First Name
[_____________________________] {required:true}

Last Name
[_____________________________] {required:true}

Phone Number
[_____________________________] {type:tel}

Date of Birth
[_____________________________] {type:date}

##

---

**Address**

Street Address
[_____________________________]

City
[_____________________________]

State/Province
[Select state...v]

Zip/Postal Code
[_____]

Country
[United States...v]

---

**Account Preferences**

Account Type
- (*) Personal
- ( ) Business
- ( ) Student

Newsletter Preferences
- [x] Weekly newsletter
- [x] Product updates
- [ ] Special offers
- [ ] Event notifications

---

**Terms & Privacy**

- [x] I agree to the [Terms of Service](https://example.com/terms)
- [x] I agree to the [Privacy Policy](https://example.com/privacy)
- [ ] I want to receive marketing emails

[Create Account]* [Cancel]

:::

---

## 10. Form Validation & Help Text

### Input with Helper Text

```markdown
Email Address
[_____________________________] {type:email required:true}
*We'll never share your email with anyone else*

Password
[********] {type:password required:true}
*Must be at least 8 characters with uppercase, number, and special character*
```

**Rendered:**

Email Address
[_____________________________] {type:email required:true}
*We'll never share your email with anyone else*

Password
[********] {type:password required:true}
*Must be at least 8 characters with uppercase, number, and special character*

---

## Best Practices

::: card

### Form Control Design Guidelines

1. **Labels & Instructions**
   - Always provide clear labels
   - Label must directly precede input (no blank line)
   - Use helper text for additional guidance
   - Mark required fields clearly

2. **Input Types**
   - Use appropriate input types (email, tel, date, etc.)
   - Consider mobile keyboard optimization
   - Provide sensible defaults
   - Use placeholders sparingly

3. **Validation**
   - Validate on submit, not on blur
   - Show clear error messages
   - Indicate which fields have errors
   - Provide actionable feedback

4. **Grouping & Organization**
   - Group related fields
   - Use fieldsets for logical sections
   - Consider multi-column layouts for long forms
   - Break long forms into steps

5. **Buttons & Actions**
   - Primary action should be prominent
   - Provide cancel/back options
   - Use action-oriented button labels
   - Position buttons consistently

6. **Accessibility**
   - Ensure proper label association
   - Support keyboard navigation
   - Provide adequate contrast
   - Use ARIA attributes when needed

7. **Mobile Considerations**
   - Ensure touch targets are large enough (44px minimum)
   - Use appropriate input types for mobile keyboards
   - Consider single-column layouts
   - Test on actual devices

:::

---

**Style Variations:**
- `sketch` - Hand-drawn form wireframes
- `clean` - Modern minimal forms
- `wireframe` - Structure-focused inputs
- `tailwind` - Contemporary form design
- `material` - Google-style form controls
- `brutal` - Bold form layouts
- `none` - Semantic HTML for custom styling

**Generate this example:**
```bash
wiremd form-controls.md --style sketch
wiremd form-controls.md --style clean -o forms-clean.html
wiremd form-controls.md --style material -o forms-material.html
```
