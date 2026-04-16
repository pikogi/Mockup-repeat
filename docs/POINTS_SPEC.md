# Points Program — Backend Specification

This document describes all backend changes required to support the Points program feature set. It is organized as an ordered implementation guide — each section builds on the previous.

**Frontend branch:** `mockup/points-program`  
**Demo:** `/demo` route in the frontend app  
**Public catalog preview:** `/catalog/demo`

---

## Overview of changes

| Area                    | Type                  | Description                                    |
| ----------------------- | --------------------- | ---------------------------------------------- |
| `program_types` table   | Data                  | Register the new "points" program type         |
| `LoyaltyProgram` schema | Extension             | New fields in `program_rules` and `metadata`   |
| `catalog_items`         | New table + endpoints | Items available for redemption                 |
| `program_posts`         | New table + endpoints | Novedades, promos, events published to catalog |
| `transactions`          | Extension             | Add `order_number` field                       |
| `survey_responses`      | New table + endpoint  | Store satisfaction survey answers              |

---

## Step 1 — Register the Points program type

The frontend uses a hardcoded UUID for the points type. Register it in the `program_types` table so the backend recognizes it.

```sql
INSERT INTO program_types (id, key, name, description)
VALUES (
  '7aedc7a8-b1c9-4fa3-a0b0-4ea74b6fc157',
  'points',
  'Puntos',
  'Customers accumulate points per purchase and redeem them via direct conversion or a catalog of items.'
);
```

---

## Step 2 — Extend `LoyaltyProgram` with points fields

All points-specific config lives inside the existing `program_rules` (JSON) and `metadata` (JSON) columns. No schema migration is needed — just document and validate these new keys.

### `program_rules` — new keys for points programs

```json
{
  "money_per_point": 1000,
  "redeem_mode": "catalog",
  "money_per_point_redeem": 100,
  "require_order_number": false
}
```

| Field | Type | Required when | Description |
| --- | --- | --- | --- |
| `money_per_point` | `integer` | always (points) | Amount spent to earn 1 point. E.g. `1000` = spend $1.000 → 1 pt |
| `redeem_mode` | `enum: catalog \| direct` | always (points) | How points are redeemed |
| `money_per_point_redeem` | `integer` | `redeem_mode = direct` | Value of 1 point in currency. E.g. `100` = 1 pt → $100 discount |
| `require_order_number` | `boolean` | optional | Forces operator to enter order/ticket number on each transaction |

### Validation rules

- `program_type_id = '7aedc7a8-...'` → `money_per_point` is required, must be ≥ 1
- `redeem_mode = direct` → `money_per_point_redeem` is required, must be ≥ 1
- `redeem_mode = catalog` → `money_per_point_redeem` is ignored
- Stamp programs (`program_type_id ≠ points`) → reject `money_per_point`, `redeem_mode`, `money_per_point_redeem` if present

### `metadata` — survey config (optional)

```json
{
  "survey_question": "¿Cómo fue tu experiencia?",
  "ticker_text": "🚀 Referí un amigo y ganá 100 puntos · 🎁 Acumulá en cada compra"
}
```

| Field             | Type     | Description                                                                           |
| ----------------- | -------- | ------------------------------------------------------------------------------------- |
| `survey_question` | `string` | Question shown to customer after redeeming. Defaults to `"¿Cómo fue tu experiencia?"` |
| `ticker_text`     | `string` | Marquee message shown at the top of the public catalog                                |

---

## Step 3 — Catalog items

### Table: `catalog_items`

```sql
CREATE TABLE catalog_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id      UUID NOT NULL REFERENCES loyalty_programs(program_id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  description     TEXT,
  points_cost     INTEGER NOT NULL CHECK (points_cost > 0),
  image_url       TEXT,
  stock_enabled   BOOLEAN NOT NULL DEFAULT false,
  stock           INTEGER CHECK (stock IS NULL OR stock >= 0),
  is_active       BOOLEAN NOT NULL DEFAULT true,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ON catalog_items (program_id, is_active);
```

### Endpoints

#### `GET /loyalty-programs/:id/catalog`

Public. No auth required. Returns active items sorted by `sort_order ASC, created_at ASC`.

**Response**

```json
{
  "ok": true,
  "data": [
    {
      "id": "uuid",
      "name": "Café espresso",
      "description": "Espresso doble recién preparado.",
      "points_cost": 50,
      "image_url": "https://...",
      "stock_enabled": true,
      "stock": 10
    }
  ]
}
```

#### `POST /loyalty-programs/:id/catalog`

Auth required (`brand_admin` or `employee` of the program's brand).

**Request body**

```json
{
  "name": "Café espresso",
  "description": "Espresso doble recién preparado.",
  "points_cost": 50,
  "image_url": "https://...",
  "stock_enabled": true,
  "stock": 10
}
```

#### `PATCH /loyalty-programs/:id/catalog/:itemId`

Auth required. Updates any field. If `stock_enabled` is set to `false`, set `stock = null`.

#### `DELETE /loyalty-programs/:id/catalog/:itemId`

Auth required. Soft delete: set `is_active = false`.

### `GET /loyalty-programs` — include catalog

When `program_type_id = points`, include `catalog_items` in the list response (same pattern as current `wallet_design` nesting):

```json
{
  "catalog_items": [...]
}
```

---

## Step 4 — Program posts (Novedades)

### Table: `program_posts`

```sql
CREATE TABLE program_posts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id  UUID NOT NULL REFERENCES loyalty_programs(program_id) ON DELETE CASCADE,
  type        TEXT NOT NULL CHECK (type IN ('promo', 'novedad', 'evento')),
  title       TEXT NOT NULL,
  description TEXT,
  image_url   TEXT,
  expires_at  TIMESTAMPTZ,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ON program_posts (program_id, is_active, expires_at);
```

### Endpoints

#### `GET /loyalty-programs/:id/posts`

Public. No auth. Returns posts where `is_active = true` AND (`expires_at IS NULL` OR `expires_at > now()`), ordered by `created_at DESC`.

**Response**

```json
{
  "ok": true,
  "data": [
    {
      "id": "uuid",
      "type": "promo",
      "title": "2x1 en cafés este finde",
      "description": "Válido sábado y domingo de 9 a 13hs.",
      "image_url": "https://...",
      "expires_at": "2026-04-20T00:00:00Z",
      "created_at": "2026-04-15T10:00:00Z"
    }
  ]
}
```

#### `POST /loyalty-programs/:id/posts`

Auth required.

**Request body**

```json
{
  "type": "promo",
  "title": "2x1 en cafés este finde",
  "description": "Válido sábado y domingo de 9 a 13hs.",
  "image_url": "https://...",
  "expires_at": "2026-04-20T00:00:00Z"
}
```

#### `DELETE /loyalty-programs/:id/posts/:postId`

Auth required. Hard delete (posts are ephemeral content).

---

## Step 5 — Order number on transactions

### Extension to `POST /transactions`

Add an optional `order_number` field to the transaction request body.

**When to enforce it:** If `program_rules.require_order_number = true`, the field becomes required. Return `400` with error code `T0010` if missing.

**Updated request body**

```json
{
  "loyalty_card_id": "uuid",
  "transaction_type": "stamp_added",
  "unit_type": "point",
  "amount": 1,
  "order_number": "ORD-00421"
}
```

**Storage:** Add `order_number TEXT` column to the `transactions` table.

```sql
ALTER TABLE transactions ADD COLUMN order_number TEXT;
```

**New error code**

| Code    | HTTP  | Condition                                                      |
| ------- | ----- | -------------------------------------------------------------- |
| `T0010` | `400` | `order_number` is required by the program but was not provided |

**Include in transaction response** — add `order_number` to the `Transaction` schema so it appears in card history and customer reports.

---

## Step 6 — Survey responses

### Table: `survey_responses`

```sql
CREATE TABLE survey_responses (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id      UUID NOT NULL REFERENCES loyalty_programs(program_id) ON DELETE CASCADE,
  loyalty_card_id UUID REFERENCES loyalty_cards(card_id) ON DELETE SET NULL,
  rating          SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment         TEXT,
  google_redirect BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ON survey_responses (program_id, created_at DESC);
```

### Endpoint

#### `POST /loyalty-programs/:id/survey`

Public (no auth — the customer fills this from the public catalog page).

**Request body**

```json
{
  "loyalty_card_id": "uuid",
  "rating": 5,
  "comment": "Excelente atención, el café estaba perfecto.",
  "google_redirect": true
}
```

- `loyalty_card_id` is optional (customer may not have their card ID available)
- `google_redirect: true` means the customer tapped "Dejar reseña en Google Maps"

**Response**

```json
{
  "ok": true,
  "message": "Survey response recorded."
}
```

---

## Step 7 — Public catalog endpoint (program details)

The public catalog page (`/catalog/:programId`) needs a single endpoint that returns everything needed to render the page without auth.

#### `GET /loyalty-programs/:id/public`

No auth. Already exists for the stamp card (`/publicprogram`). Extend or create a variant that includes:

```json
{
  "ok": true,
  "data": {
    "program_id": "uuid",
    "program_name": "Club Café Bonafide",
    "program_type": "points",
    "brand_color": "#2563EB",
    "logo_url": "https://...",
    "money_per_point": 1000,
    "redeem_mode": "catalog",
    "money_per_point_redeem": null,
    "ticker_text": "🚀 Referí un amigo y ganá 100 puntos",
    "survey_question": "¿Cómo fue tu experiencia?",
    "catalog_items": [...],
    "posts": [...]
  }
}
```

This replaces the three separate calls (`GET /catalog`, `GET /posts`, `GET /program`) with a single request, keeping the public page fast.

---

## Summary of new endpoints

| Method   | Path                                    | Auth     | Description                       |
| -------- | --------------------------------------- | -------- | --------------------------------- |
| `GET`    | `/loyalty-programs/:id/public`          | None     | Full public data for catalog page |
| `GET`    | `/loyalty-programs/:id/catalog`         | None     | List active catalog items         |
| `POST`   | `/loyalty-programs/:id/catalog`         | Required | Add catalog item                  |
| `PATCH`  | `/loyalty-programs/:id/catalog/:itemId` | Required | Update catalog item               |
| `DELETE` | `/loyalty-programs/:id/catalog/:itemId` | Required | Remove catalog item               |
| `GET`    | `/loyalty-programs/:id/posts`           | None     | List active posts                 |
| `POST`   | `/loyalty-programs/:id/posts`           | Required | Create post                       |
| `DELETE` | `/loyalty-programs/:id/posts/:postId`   | Required | Delete post                       |
| `POST`   | `/loyalty-programs/:id/survey`          | None     | Submit survey response            |

## Summary of schema changes

| Table | Change |
| --- | --- |
| `program_types` | Insert points type row |
| `loyalty_programs.program_rules` | New keys: `money_per_point`, `redeem_mode`, `money_per_point_redeem`, `require_order_number` |
| `loyalty_programs.metadata` | New keys: `survey_question`, `ticker_text` |
| `transactions` | Add column `order_number TEXT` |
| `catalog_items` | New table |
| `program_posts` | New table |
| `survey_responses` | New table |
