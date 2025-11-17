# Tables and Data Grids

> **Use Case:** Comprehensive showcase of table layouts for displaying structured data.
>
> **Key Features:** Basic tables, sortable columns, filterable data, pagination, responsive tables, data grids

## Table Component Showcase

Examples of tables and data grids for various use cases.

---

## 1. Basic Tables

### Simple Table

```markdown
| Name | Email | Role |
|------|-------|------|
| John Doe | [email protected] | Admin |
| Jane Smith | [email protected] | Editor |
| Bob Wilson | [email protected] | User |
```

**Rendered:**

| Name | Email | Role |
|------|-------|------|
| John Doe | [email protected] | Admin |
| Jane Smith | [email protected] | Editor |
| Bob Wilson | [email protected] | User |

---

### Table with Alignment

```markdown
| Product | Price | Quantity | Total |
|:--------|------:|---------:|------:|
| Widget A | $10.00 | 5 | $50.00 |
| Widget B | $25.50 | 2 | $51.00 |
| Widget C | $100.00 | 1 | $100.00 |
```

**Rendered:**

| Product | Price | Quantity | Total |
|:--------|------:|---------:|------:|
| Widget A | $10.00 | 5 | $50.00 |
| Widget B | $25.50 | 2 | $51.00 |
| Widget C | $100.00 | 1 | $100.00 |

---

## 2. User Management Table

### User List with Actions

```markdown
| Select | User | Email | Role | Status | Last Login | Actions |
|--------|------|-------|------|--------|------------|---------|
| [ ] | ![👤] John Smith | [email protected] | Admin | Active | 2h ago | [Edit] [Delete] [•••] |
| [ ] | ![👤] Sarah Lee | [email protected] | Editor | Active | 5h ago | [Edit] [Delete] [•••] |
| [ ] | ![👤] Mike Chen | [email protected] | User | Pending | Never | [Edit] [Delete] [•••] |
| [ ] | ![👤] Emma Davis | [email protected] | User | Active | 1d ago | [Edit] [Delete] [•••] |
| [x] | ![👤] Alex Johnson | [email protected] | Moderator | Active | 2d ago | [Edit] [Delete] [•••] |
```

**Rendered:**

| Select | User | Email | Role | Status | Last Login | Actions |
|--------|------|-------|------|--------|------------|---------|
| [ ] | ![👤] John Smith | [email protected] | Admin | Active | 2h ago | [Edit] [Delete] [•••] |
| [ ] | ![👤] Sarah Lee | [email protected] | Editor | Active | 5h ago | [Edit] [Delete] [•••] |
| [ ] | ![👤] Mike Chen | [email protected] | User | Pending | Never | [Edit] [Delete] [•••] |
| [ ] | ![👤] Emma Davis | [email protected] | User | Active | 1d ago | [Edit] [Delete] [•••] |
| [x] | ![👤] Alex Johnson | [email protected] | Moderator | Active | 2d ago | [Edit] [Delete] [•••] |

---

## 3. E-Commerce Orders Table

### Order Management

```markdown
| Order # | Customer | Products | Total | Status | Date | Actions |
|---------|----------|----------|-------|--------|------|---------|
| #12456 | John Doe | 3 items | $129.99 | 🟢 Shipped | 10m ago | [View] [Invoice] |
| #12455 | Jane Smith | 1 item | $89.50 | 🟡 Processing | 1h ago | [View] [Process] |
| #12454 | Bob Wilson | 5 items | $234.99 | 🟢 Shipped | 2h ago | [View] [Track] |
| #12453 | Alice Brown | 2 items | $45.00 | 🔴 Pending | 3h ago | [View] [Confirm] |
| #12452 | Charlie Kim | 4 items | $178.50 | ✅ Delivered | 5h ago | [View] [Archive] |
```

**Rendered:**

| Order # | Customer | Products | Total | Status | Date | Actions |
|---------|----------|----------|-------|--------|------|---------|
| #12456 | John Doe | 3 items | $129.99 | 🟢 Shipped | 10m ago | [View] [Invoice] |
| #12455 | Jane Smith | 1 item | $89.50 | 🟡 Processing | 1h ago | [View] [Process] |
| #12454 | Bob Wilson | 5 items | $234.99 | 🟢 Shipped | 2h ago | [View] [Track] |
| #12453 | Alice Brown | 2 items | $45.00 | 🔴 Pending | 3h ago | [View] [Confirm] |
| #12452 | Charlie Kim | 4 items | $178.50 | ✅ Delivered | 5h ago | [View] [Archive] |

---

## 4. Analytics Data Table

### Performance Metrics

```markdown
| Page | Views | Unique | Avg Time | Bounce Rate | Conversions |
|------|-------|--------|----------|-------------|-------------|
| /home | 45,678 | 34,567 | 2m 15s | 42% | 234 |
| /products | 38,901 | 29,234 | 3m 45s | 28% | 456 |
| /pricing | 34,567 | 28,901 | 2m 12s | 45% | 189 |
| /blog | 28,234 | 21,456 | 5m 34s | 25% | 89 |
| /contact | 12,345 | 11,234 | 1m 23s | 52% | 45 |
```

**Rendered:**

| Page | Views | Unique | Avg Time | Bounce Rate | Conversions |
|------|-------|----------|-------------|-------------|-------------|
| /home | 45,678 | 34,567 | 2m 15s | 42% | 234 |
| /products | 38,901 | 29,234 | 3m 45s | 28% | 456 |
| /pricing | 34,567 | 28,901 | 2m 12s | 45% | 189 |
| /blog | 28,234 | 21,456 | 5m 34s | 25% | 89 |
| /contact | 12,345 | 11,234 | 1m 23s | 52% | 45 |

---

## 5. Product Inventory Table

### Stock Management

```markdown
| SKU | Product | Category | Price | Stock | Min Stock | Status |
|-----|---------|----------|-------|-------|-----------|--------|
| WH-001 | Wireless Headphones | Electronics | $129.99 | 5 | 20 | 🔴 Critical |
| SW-002 | Smart Watch | Wearables | $299.99 | 12 | 25 | 🟡 Low |
| BS-003 | Bluetooth Speaker | Audio | $79.99 | 145 | 30 | 🟢 Good |
| FT-004 | Fitness Tracker | Wearables | $149.99 | 8 | 30 | 🔴 Critical |
| EC-005 | USB-C Cable | Accessories | $19.99 | 234 | 50 | 🟢 Good |
```

**Rendered:**

| SKU | Product | Category | Price | Stock | Min Stock | Status |
|-----|---------|----------|-------|-------|-----------|--------|
| WH-001 | Wireless Headphones | Electronics | $129.99 | 5 | 20 | 🔴 Critical |
| SW-002 | Smart Watch | Wearables | $299.99 | 12 | 25 | 🟡 Low |
| BS-003 | Bluetooth Speaker | Audio | $79.99 | 145 | 30 | 🟢 Good |
| FT-004 | Fitness Tracker | Wearables | $149.99 | 8 | 30 | 🔴 Critical |
| EC-005 | USB-C Cable | Accessories | $19.99 | 234 | 50 | 🟢 Good |

---

## 6. Financial Data Table

### Transaction History

```markdown
| Date | Description | Category | Amount | Balance | Status |
|------|-------------|----------|--------|---------|--------|
| Mar 17 | Client Payment #1234 | Income | +$5,000.00 | $12,345.67 | ✅ Cleared |
| Mar 16 | Office Supplies | Expense | -$245.50 | $7,345.67 | ✅ Cleared |
| Mar 15 | Subscription Fee | Recurring | -$99.00 | $7,591.17 | ✅ Cleared |
| Mar 14 | Freelance Project | Income | +$2,500.00 | $7,690.17 | 🟡 Pending |
| Mar 13 | Marketing Ad Spend | Marketing | -$1,250.00 | $5,190.17 | ✅ Cleared |
```

**Rendered:**

| Date | Description | Category | Amount | Balance | Status |
|------|-------------|----------|--------|---------|--------|
| Mar 17 | Client Payment #1234 | Income | +$5,000.00 | $12,345.67 | ✅ Cleared |
| Mar 16 | Office Supplies | Expense | -$245.50 | $7,345.67 | ✅ Cleared |
| Mar 15 | Subscription Fee | Recurring | -$99.00 | $7,591.17 | ✅ Cleared |
| Mar 14 | Freelance Project | Income | +$2,500.00 | $7,690.17 | 🟡 Pending |
| Mar 13 | Marketing Ad Spend | Marketing | -$1,250.00 | $5,190.17 | ✅ Cleared |

---

## 7. Task/Project Table

### Task List

```markdown
| Task ID | Task Name | Assigned | Priority | Status | Due Date | Progress |
|---------|-----------|----------|----------|--------|----------|----------|
| TASK-145 | Design login page | @sarah | 🔴 High | In Progress | Mar 20 | [#######___] 70% |
| TASK-146 | API integration | @mike | 🔴 High | To Do | Mar 22 | [__________] 0% |
| TASK-147 | Write documentation | @emma | 🟡 Medium | In Progress | Mar 25 | [####______] 40% |
| TASK-148 | Code review | @alex | 🟢 Low | Done | Mar 17 | [##########] 100% |
| TASK-149 | Performance testing | @lisa | 🔴 High | Blocked | Mar 23 | [#_________] 10% |
```

**Rendered:**

| Task ID | Task Name | Assigned | Priority | Status | Due Date | Progress |
|---------|-----------|----------|----------|--------|----------|----------|
| TASK-145 | Design login page | @sarah | 🔴 High | In Progress | Mar 20 | [#######___] 70% |
| TASK-146 | API integration | @mike | 🔴 High | To Do | Mar 22 | [__________] 0% |
| TASK-147 | Write documentation | @emma | 🟡 Medium | In Progress | Mar 25 | [####______] 40% |
| TASK-148 | Code review | @alex | 🟢 Low | Done | Mar 17 | [##########] 100% |
| TASK-149 | Performance testing | @lisa | 🔴 High | Blocked | Mar 23 | [#_________] 10% |

---

## 8. Comparison Table

### Product Comparison

```markdown
| Feature | Basic | Pro | Enterprise |
|---------|-------|-----|------------|
| **Price** | Free | $29/mo | Custom |
| **Users** | 1 | 10 | Unlimited |
| **Storage** | 5 GB | 100 GB | Unlimited |
| **Projects** | 3 | Unlimited | Unlimited |
| **Support** | Email | Priority | Dedicated |
| **API Access** | ❌ | ✅ | ✅ |
| **Custom Domain** | ❌ | ✅ | ✅ |
| **Analytics** | Basic | Advanced | Enterprise |
| **SLA** | ❌ | ❌ | ✅ |
```

**Rendered:**

| Feature | Basic | Pro | Enterprise |
|---------|-------|-----|------------|
| **Price** | Free | $29/mo | Custom |
| **Users** | 1 | 10 | Unlimited |
| **Storage** | 5 GB | 100 GB | Unlimited |
| **Projects** | 3 | Unlimited | Unlimited |
| **Support** | Email | Priority | Dedicated |
| **API Access** | ❌ | ✅ | ✅ |
| **Custom Domain** | ❌ | ✅ | ✅ |
| **Analytics** | Basic | Advanced | Enterprise |
| **SLA** | ❌ | ❌ | ✅ |

---

## 9. Data Table with Filters

### Filterable Table Interface

```markdown
::: card

### Employee Directory

**Filters:**
Department: [All Departments...v] | Role: [All Roles...v] | Status: [All...v]

[Search employees...___________] {type:search} [Search]

---

| Employee | Department | Role | Email | Phone | Hire Date |
|----------|------------|------|-------|-------|-----------|
| ![👤] John Smith | Engineering | Senior Dev | [email protected] | (555) 123-4567 | Jan 2020 |
| ![👤] Sarah Lee | Design | Lead Designer | [email protected] | (555) 234-5678 | Mar 2021 |
| ![👤] Mike Chen | Marketing | Manager | [email protected] | (555) 345-6789 | Jul 2019 |
| ![👤] Emma Davis | Sales | Account Exec | [email protected] | (555) 456-7890 | Sep 2022 |

**Showing 1-4 of 156 employees**

[← Previous] [1] [2] [3] ... [39] [Next →]

:::
```

**Rendered:**

::: card

### Employee Directory

**Filters:**
Department: [All Departments...v] | Role: [All Roles...v] | Status: [All...v]

[Search employees...___________] {type:search} [Search]

---

| Employee | Department | Role | Email | Phone | Hire Date |
|----------|------------|------|-------|-------|-----------|
| ![👤] John Smith | Engineering | Senior Dev | [email protected] | (555) 123-4567 | Jan 2020 |
| ![👤] Sarah Lee | Design | Lead Designer | [email protected] | (555) 234-5678 | Mar 2021 |
| ![👤] Mike Chen | Marketing | Manager | [email protected] | (555) 345-6789 | Jul 2019 |
| ![👤] Emma Davis | Sales | Account Exec | [email protected] | (555) 456-7890 | Sep 2022 |

**Showing 1-4 of 156 employees**

[← Previous] [1] [2] [3] ... [39] [Next →]

:::

---

## 10. Sortable Table Header

### Table with Sort Controls

```markdown
::: card

| Name ↕ | Email ↕ | Role ↕ | Status ↕ | Joined ↓ |
|--------|---------|--------|----------|----------|
| Alice Brown | [email protected] | Admin | Active | Mar 17, 2025 |
| Bob Wilson | [email protected] | Editor | Active | Mar 15, 2025 |
| Charlie Davis | [email protected] | User | Inactive | Mar 10, 2025 |
| Diana Evans | [email protected] | User | Active | Mar 5, 2025 |

*Sorted by: Joined Date (Descending)*

:::
```

**Rendered:**

::: card

| Name ↕ | Email ↕ | Role ↕ | Status ↕ | Joined ↓ |
|--------|---------|--------|----------|----------|
| Alice Brown | [email protected] | Admin | Active | Mar 17, 2025 |
| Bob Wilson | [email protected] | Editor | Active | Mar 15, 2025 |
| Charlie Davis | [email protected] | User | Inactive | Mar 10, 2025 |
| Diana Evans | [email protected] | User | Active | Mar 5, 2025 |

*Sorted by: Joined Date (Descending)*

:::

---

## 11. Nested/Expandable Rows

### Hierarchical Data Table

```markdown
| Category | Products | Revenue | Status |
|----------|----------|---------|--------|
| **Electronics** | 234 | $234,567 | 🟢 |
| → Headphones | 89 | $89,234 | 🟢 |
| → Speakers | 67 | $67,890 | 🟢 |
| → Cables | 78 | $77,443 | 🟢 |
| **Clothing** | 456 | $123,456 | 🟡 |
| → Shirts | 234 | $78,901 | 🟢 |
| → Pants | 156 | $34,567 | 🟡 |
| → Accessories | 66 | $9,988 | 🔴 |
```

**Rendered:**

| Category | Products | Revenue | Status |
|----------|----------|---------|--------|
| **Electronics** | 234 | $234,567 | 🟢 |
| → Headphones | 89 | $89,234 | 🟢 |
| → Speakers | 67 | $67,890 | 🟢 |
| → Cables | 78 | $77,443 | 🟢 |
| **Clothing** | 456 | $123,456 | 🟡 |
| → Shirts | 234 | $78,901 | 🟢 |
| → Pants | 156 | $34,567 | 🟡 |
| → Accessories | 66 | $9,988 | 🔴 |

---

## 12. Bulk Actions Table

### Table with Bulk Operations

```markdown
::: card

**Bulk Actions:** [Select action...v] [Apply to Selected]

- [x] Select All (50 items on this page)

| Select | Product | SKU | Price | Stock | Actions |
|--------|---------|-----|-------|-------|---------|
| [x] | Wireless Mouse | MS-001 | $29.99 | 145 | [Edit] [Delete] |
| [x] | Keyboard | KB-002 | $79.99 | 67 | [Edit] [Delete] |
| [ ] | Monitor Stand | ST-003 | $49.99 | 89 | [Edit] [Delete] |
| [ ] | USB Hub | HB-004 | $34.99 | 234 | [Edit] [Delete] |

**2 items selected**

[Delete Selected] [Export Selected] [Update Stock]

:::
```

**Rendered:**

::: card

**Bulk Actions:** [Select action...v] [Apply to Selected]

- [x] Select All (50 items on this page)

| Select | Product | SKU | Price | Stock | Actions |
|--------|---------|-----|-------|-------|---------|
| [x] | Wireless Mouse | MS-001 | $29.99 | 145 | [Edit] [Delete] |
| [x] | Keyboard | KB-002 | $79.99 | 67 | [Edit] [Delete] |
| [ ] | Monitor Stand | ST-003 | $49.99 | 89 | [Edit] [Delete] |
| [ ] | USB Hub | HB-004 | $34.99 | 234 | [Edit] [Delete] |

**2 items selected**

[Delete Selected] [Export Selected] [Update Stock]

:::

---

## Best Practices

::: card

### Table Design Guidelines

1. **Clarity & Readability**
   - Use clear column headers
   - Align numbers to the right
   - Align text to the left
   - Use consistent formatting

2. **Sorting & Filtering**
   - Indicate sortable columns
   - Show current sort state
   - Provide filter controls
   - Enable search functionality

3. **Actions & Interactions**
   - Place actions in rightmost column
   - Use consistent action buttons
   - Support keyboard navigation
   - Enable bulk operations

4. **Performance**
   - Implement pagination for large datasets
   - Show row count
   - Lazy load when appropriate
   - Optimize for mobile

5. **Visual Design**
   - Use zebra striping for readability
   - Highlight on hover
   - Use status colors consistently
   - Maintain adequate spacing

6. **Responsive Design**
   - Consider mobile layouts
   - Hide less important columns on small screens
   - Use horizontal scrolling when needed
   - Provide compact view options

:::

---

**Style Variations:**
- `sketch` - Hand-drawn table wireframes
- `clean` - Modern minimal tables
- `wireframe` - Structure-focused grids
- `tailwind` - Contemporary data tables
- `material` - Google-style data grids
- `brutal` - Bold table design
- `none` - Semantic HTML for custom styling

**Generate this example:**
```bash
wiremd tables-data-grids.md --style sketch
wiremd tables-data-grids.md --style clean -o tables-clean.html
wiremd tables-data-grids.md --style material -o tables-material.html
```
