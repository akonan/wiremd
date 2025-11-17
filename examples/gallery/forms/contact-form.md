# Contact Form

> **Use Case:** Standard contact form for websites, customer support pages, or inquiry forms.
>
> **Key Features:** Text inputs, email validation, textarea, required fields, button groups

## Get in Touch

We'd love to hear from you! Fill out the form below and we'll get back to you within 24 hours.

---

::: card

### Contact Us

Full Name
[_____________________________] {required:true}

Email Address
[_____________________________] {type:email required:true}

Phone Number
[_____________________________] {type:tel}

Subject
[Select a topic...v]
- General Inquiry
- Technical Support
- Sales Question
- Partnership Opportunity
- Other

Message
[Tell us how we can help...] {rows:6 required:true}

Preferred Contact Method
- (*) Email
- ( ) Phone
- ( ) Either

- [x] I agree to the privacy policy
- [ ] Send me updates and newsletters

[Submit Message]* [Clear Form]

:::

---

**Style Variations:**
- `sketch` - Hand-drawn Balsamiq-style appearance
- `clean` - Modern minimal design
- `wireframe` - Traditional grayscale wireframe
- `tailwind` - Purple accent utility-first design
- `material` - Google Material Design with elevation
- `brutal` - Neo-brutalism with bold borders
- `none` - Unstyled semantic HTML

**Generate this example:**
```bash
wiremd contact-form.md --style sketch
wiremd contact-form.md --style clean -o contact-form-clean.html
wiremd contact-form.md --style material -o contact-form-material.html
```
