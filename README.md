# M Gold

M Gold is a bilingual jewelry catalog with a cart, pickup reservation chat, and a staff panel. [Live storefront](https://mgold-uz.vercel.app/)

## Run locally

From the project directory, start the static preview.

```sh
python3 -m http.server 8765 --bind 127.0.0.1 --directory dist
```

Open [the storefront](http://127.0.0.1:8765/) or [the local catalog editor](http://127.0.0.1:8765/admin.html). The local preview keeps catalog edits and the cart in browser storage. It uses Supabase only on the hosted deployment.

## Deployment

Deploy the project root to Vercel. The static output is in `dist`, and `api/catalog.mjs` handles the hosted API. Apply `supabase/schema.sql` followed by `supabase/chat.sql` to a new Supabase project.

Set `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, and `M_GOLD_ADMIN_EMAIL` in Vercel. Create a staff user in Supabase Auth and add their user ID to `public.staff`. The admin login is `admin-001` and uses the password set in Supabase Auth.

## Demo imagery

All product photos are illustrative. The built-in imagegen tool created the images in `dist/assets` from these prompts. The six product photos were cropped from the contact sheet.

**Hero**

> Create a single wide 3:2 landscape luxury Uzbek fine jewelry ecommerce HERO photograph, no text, no logos. Warm ivory travertine plinth and sand studio background with hard afternoon sunlight creating warm shadow diagonals. Center-right: a striking sculptural broad polished yellow gold crossover ring propped upright beside a pair of small rounded textured gold hoop earrings on limestone, visible macro close-up, art-directed minimal still life, authentic realistic studio jewelry photography, rich warm amber highlights, grounded natural shadows, taupe neutral surround. Keep jewelry inside center 60% of frame for responsive cropping. High-end editorial campaign, vivid rich gold.

**Product contact sheet**

> Luxury fine jewelry ecommerce photo contact sheet, 3 columns by 2 rows, six equally sized square photo tiles edge-to-edge, absolutely no gutters, no labels or typography. Each product wholly inside central 65% of its own tile. Warm sunlit ivory / neutral beige stone backgrounds across all tiles, realistic clean studio photography. Row 1 left: sculptural polished yellow gold crossover ring upright. Row 1 middle: two textured small yellow gold hoop earrings. Row 1 right: polished yellow gold oval open bangle. Row 2 left: fine gold chain necklace with circular sunburst pendant. Row 2 middle: coordinated set with gold teardrop earrings and teardrop necklace. Row 2 right: thin yellow gold ring with an oval deep garnet center stone. Exact 3x2 evenly split layout, 3:2 wide canvas.

## Product deletion

Apply `supabase/product-trash.sql` before deploying this version. Admins can delete a product immediately from the catalog and restore it as a draft for 72 hours. A database Cron job runs every minute and permanently removes expired product records. Existing archives are unaffected; reservation snapshots and stored image objects are retained. Local preview removes expired records when the catalog is read.

Run deletion checks with `node --test tests/product-trash.test.mjs`.

Product descriptions are optional in both languages (up to 1,500 characters). Apply `supabase/optional-description.sql` when upgrading an existing database.
