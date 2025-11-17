# Search Form

> **Use Case:** Advanced search interface for e-commerce, job boards, real estate, or content platforms.
>
> **Key Features:** Search input, filters, checkboxes, range inputs, date pickers, instant results

[[ :logo: SearchHub | Home | Categories | Deals | [Sign In] | [Cart (3)] ]]

---

::: hero
# Find What You're Looking For
Over 1 million items ready to ship
:::

---

## Search & Filters {.grid-4}

### Main Search

Search products
[Enter keywords...___________] {type:search}

[Search]*

### Category

Product Type
[All Categories...v]
- Electronics
- Clothing
- Home & Garden
- Sports & Outdoors
- Books & Media
- Toys & Games

### Price Range

Min Price
[$___] {type:number min:0}

Max Price
[$___] {type:number max:10000}

[Apply]

### More Filters

Condition
- [x] New
- [x] Like New
- [ ] Used
- [ ] Refurbished

Shipping
- [x] Free Shipping
- [ ] Ships Today
- [ ] Local Pickup

Rating
- [x] 4+ Stars
- [ ] 3+ Stars

##

---

## Advanced Search Options

::: card

### Detailed Filters

Brand
[_____________________________]

Color
- [ ] Black
- [ ] White
- [ ] Blue
- [ ] Red
- [ ] Other

Size
- ( ) Small
- (*) Medium
- ( ) Large
- ( ) X-Large

Availability
- [x] In Stock Only
- [ ] Include Pre-Orders
- [ ] Include Back-Orders

Date Listed
From: [_____________________________] {type:date}
To: [_____________________________] {type:date}

Sort Results By
[Select sorting...v]
- Relevance
- Price: Low to High
- Price: High to Low
- Newest First
- Best Rating
- Most Popular

[Apply Filters]* [Reset All]

:::

---

## Search Results

::: alert info
ℹ️ **Found 1,247 results** for your search criteria
:::

| Image | Product | Price | Rating | Stock |
|-------|---------|-------|--------|-------|
| [IMG] | Premium Wireless Headphones | $129.99 | ⭐⭐⭐⭐⭐ | In Stock |
| [IMG] | Smart Watch Series 5 | $299.00 | ⭐⭐⭐⭐ | In Stock |
| [IMG] | Portable Bluetooth Speaker | $79.99 | ⭐⭐⭐⭐⭐ | Low Stock |
| [IMG] | USB-C Hub 7-in-1 | $49.99 | ⭐⭐⭐⭐ | In Stock |

[Load More Results]

---

::: footer
[[ Help | Shipping Info | Returns | Contact ]]
© 2025 SearchHub
:::

---

**Style Variations:**
- `sketch` - Quick wireframe for testing UX
- `clean` - Modern e-commerce aesthetic
- `wireframe` - Focus on filter hierarchy
- `tailwind` - Vibrant, contemporary search
- `material` - Layered cards and chips
- `brutal` - Bold, high-contrast interface
- `none` - Semantic HTML for custom styling

**Generate this example:**
```bash
wiremd search-form.md --style sketch
wiremd search-form.md --style clean -o search-clean.html
```
