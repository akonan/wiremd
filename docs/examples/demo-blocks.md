# Demo Blocks

Use `::: demo` to show wiremd syntax side-by-side with its rendered output. Write it once — no duplication needed.

---

## Form Components

::: demo

## Login Form

Username
[_____________________________]{required}

Password
[*****________________________]{required}

- [ ] Remember me

[Sign In]*
[Forgot Password?]

:::

---

## Buttons

::: demo
[Primary]*
[Secondary]
[Danger]{.danger}
[Disabled]{disabled}
:::

---

## Inputs

::: demo
Name
[_____________________________]

Email
[_____________________________]{type:email required}

Message
[Message...]{rows:4}

Country
[Select country_v]
- United States
- United Kingdom
- Germany

:::

---

## Badges & Status

::: demo
|New|{.primary} |Beta|{.warning} |Deprecated|{.error} |Stable|{.success}
:::

---

## Navigation

::: demo
[[ Logo | Dashboard | Users | Settings | [Logout] ]]
:::

---

## Cards (Grid)

::: demo

::: grid-3 card

### Free
$0/mo
- 1 user
- 5 projects
[Get Started]

### Pro
$12/mo
- 10 users
- Unlimited projects
[Start Trial]*

### Enterprise
Custom
- Unlimited users
- SLA support
[Contact Sales]

:::

:::

---

## Tabs

::: demo

::: tabs

::: tab Profile
Name
[_____________________________]

Bio
[Bio...]{rows:3}

[Save Changes]*
:::

::: tab Security
[Change Password]
[Enable 2FA]
:::

:::

:::

---

## Alert States

::: demo

::: alert
Payment method saved successfully.
:::

:::
