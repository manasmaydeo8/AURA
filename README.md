<div align="center">

# AURA
### Home & Office Architectural Furniture

**Live with it. Rent first. Own forever.**

AURA is a modern furniture discovery and commerce experience for homes and workspaces. It brings curated furniture rentals, outright purchases, and a rent-to-own equity model together in one interface.

[Explore the repository](https://github.com/manasmaydeo8/AURA) · [Report an issue](https://github.com/manasmaydeo8/AURA/issues)

</div>

---

## Screenshots

The screenshots below show the main AURA experience: the landing page, rental catalog, rent-to-own calculator, and direct-purchase showroom.

![AURA application screenshots](public/sc.png)

## Overview

AURA is designed around a simple idea: choosing furniture for a space takes time. Customers can rent selected pieces, try them in their own environment, and build toward ownership instead of committing to an outright purchase immediately.

The platform supports two acquisition paths:

- **Rent first:** choose a rental duration, pay monthly, and accrue 80% of eligible rent toward the furniture's buyout value.
- **Buy outright:** browse the purchase showroom and acquire furniture with a one-time payment.
![AURA application screenshots](public/sc2.png)
![AURA application screenshots](public/sc3.png)
![AURA application screenshots](public/sc4.png)


## Key Features

### Furniture rental
- Dedicated rental catalog for home and office furniture.
- Space and category filters, search, and sorting.
- 3-, 6-, and 12-month rental durations with tenure-based discounts.
- Monthly rental pricing and buyout-credit information on product cards.

### Rent-to-own equity model
- 80% of eligible rental payments accrue as buyout equity.
- Interactive calculator for estimating rental costs and ownership balances.
- Displays effective monthly rent, total rent paid, accrued equity, and residual buyout price.
- Compare renting with purchasing a piece outright.

### Outright purchase showroom
- Dedicated catalog for direct furniture purchases.
- Product discovery with category, space, price, and rating controls.
- Product details and finish selection.
- Direct-buy and rent-first paths where available.

### Product details and bag
- Furniture detail views with descriptions and pricing information.
- Finish/color selection for supported products.
- Unified bag drawer for rental and purchase selections.

### Experience and design
- Editorial, architecture-inspired visual direction.
- Responsive layouts for browsing across screen sizes.
- Motion-aware interactions and reduced-motion support.
- Reusable React components and centralized furniture data.

## Technology Stack

| Technology | Usage |
|---|---|
| React 19 | Component-based user interface |
| Vite 8 | Development server and production build |
| JavaScript (ES Modules) | Application logic |
| Motion | UI animation and transitions |
| React Spring | Spring-based interaction animation |
| ESLint 9 | Code quality and linting |

## Getting Started

### Prerequisites

- Node.js compatible with the installed Vite version.
- npm.

### 1. Clone the repository

```bash
git clone https://github.com/manasmaydeo8/AURA.git
cd AURA
```

### 2. Enter the application directory

The Vite application is inside `ReatAPP`.

```bash
cd ReatAPP
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

Open the local URL printed by Vite in your browser.

## Available Scripts

Run these commands from the `ReatAPP` directory.

| Command | Description |
|---|---|
| `npm run dev` | Start the local Vite development server |
| `npm run build` | Create an optimized production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint checks |

## Project Structure

```text
AURA/
├── docs/
│   └── screenshots/
│       └── aura-overview.jpg
└── ReatAPP/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── calculator/
    │   │   ├── furniture/
    │   │   └── layout/
    │   ├── data/
    │   ├── hooks/
    │   ├── sections/
    │   └── styles/
    ├── design.md
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## Rent-to-Own Example

The calculator uses the selected furniture item, rental duration, monthly rate, and buyout value to estimate the ownership balance.

At a high level:

- **Accrued equity** = eligible rent paid × 80%
- **Residual buyout** = buyout value − accrued equity
- **Total rent paid** = effective monthly rent × selected rental months

Displayed figures are estimates based on the selected product and rental plan. Refer to the application for the current calculation and terms.

## Design Principles

- Furniture and interior imagery take priority.
- Neutral surfaces and restrained green accents support the architectural aesthetic.
- Pricing and buyout information remain visible during product discovery.
- Rental and purchase journeys are distinct but connected.
- Components are organized by responsibility to keep the application maintainable.

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Make and test your changes.
4. Run `npm run lint` and `npm run build` from `ReatAPP`.
5. Commit your changes and open a pull request.

## License

No license has been specified for this repository yet. Unless a license is added, the source code is not automatically granted permission for reuse or redistribution.

---

<div align="center">

**AURA — Architectural furniture for elevated homes and high-performance workspaces.**

</div>
