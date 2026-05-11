# Row Layout Examples

Complex row compositions not covered in the [Row reference](/components/row).

## Inline elements without `:::row`

Buttons and inputs on the **same line** align automatically — no container needed.

::: demo

[Cancel] [Save Changes]*

:::

Separate lines stack vertically:

::: demo

[Search___________________________]
[Select_______v]

:::

## Row inside a card

::: demo

::: card

### User Management

::: row

[All Users]* [Admins] [Inactive] [+ Invite User]*

:::

| Name | Role | Status |
|------|------|--------|
| Alice | Admin | Active |
| Bob | Editor | Active |
| Carol | Viewer | Inactive |

:::

:::

## Toolbar inside tab panels

::: demo

::: tabs

::: tab General

::: row

### {.left}
[Name_____________________________]{required}

### {.right}
[Save Changes]*

:::

| Name | Role | Status |
|------|------|--------|
| Alice | Admin | Active |
| Bob | Editor | Active |

:::

::: tab Notifications

::: row {.right}

[Save]*

:::

- [x] Email notifications
- [ ] SMS notifications
- [x] In-app alerts

:::

:::

:::
