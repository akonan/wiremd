# Row Layout Demo
---
## Default Behaviour Witout any {row} class


[Both Buttons] [+ In the same line]* [Search___________________________] [Select_______v]

[Search___________________________]
[Select_______v]


[Buttons underneath each other]
[+ without empty line in between]*

[+ New Item]*


---

## Basic Row — items at start (default)

::: row

:check: All systems operational:

[All]* [Active]
[Archived]

[Search__________________________]

:::

---

## Row aligned right

::: row {.right}

:check: All systems operational:

[All]* [Active]
[Archived]

[Search__________________________]

:::

---

## Row centered

::: row {.center}

:check: All systems operational:

[All]* [Active]
[Archived]

[Search__________________________]

:::

---

## Row inside a card


::: card

### User Management

::: row

[All Users]* [Admins]
[Inactive] [+ Invite User]*

:::

| Name | Role | Status |
|------|------|--------|
| Alice | Admin | Active |
| Bob | Editor | Active |
| Carol | Viewer | Inactive |

:::

---

## Grid with aligned items (### {.left} / {.right})

::: grid-2

### {.left}
[All]* [Active] [Archived]

### {.right}
[+ New Item]*

:::


---

## Tabs with row toolbar inside each panel

::: tabs

::: tab General

::: grid-2

###
[Name_____________________________]{required}
[Email_____________________________]{type:email required}

### {.right}
[Save Changes]*

:::

| Name | Role | Status |
|------|------|--------|
| Alice | Admin | Active |
| Bob | Editor | Active |
| Carol | Viewer | Inactive |

:::

::: tab Notifications

::: row {.right}

[Save]*

:::

- [x] Email notifications
- [ ] SMS notifications
- [x] In-app alerts

[Save]*

:::

:::
