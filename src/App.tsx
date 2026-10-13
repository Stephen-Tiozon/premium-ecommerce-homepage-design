import { useState } from 'react';

const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=${w}`;

const products = [
  { name: 'Smoked Chili Crisp', note: 'Small batch · 8 oz', price: 18, rating: 4.9, reviews: 312, img: 'photo-1610135373417-910bd43a580d' },
  { name: 'Brown Butter Miso', note: 'Cultured · 6 oz', price: 22, rating: 4.8, reviews: 184, img: 'photo-1691480208637-6ed63aac6694' },
  { name: 'Charred Ember Hot Sauce', note: 'Fermented · 5 fl oz', price: 16, rating: 4.7, reviews: 256, img: 'photo-1663177239807-11d4d94a6d5f' },
  { name: 'Wild Fennel Olive Oil', note: 'Cold-pressed · 500 ml', price: 34, rating: 5.0, reviews: 98, img: 'photo-1608797689272-9fffaa177090' },
];

const extraImgs = ['photo-1610135373417-910bd43a580d','photo-1691480208637-6ed63aac6694','photo-1663177239807-11d4d94a6d5f','photo-1608797689272-9fffaa177090','photo-1610135373399-472c8722106f','photo-1725328493423-3771b60d02c2'];
const catalog: Record<string, [string, string, number][]> = {
  Sauces: [['Black Garlic Ketchup','10 oz',14],['Green Harissa','7 oz',17],['Bistro Béarnaise Base','8 oz',19],['Tamarind BBQ Glaze','12 oz',16],['Salsa Macha','6 oz',18],['Yuzu Kosho','3 oz',21],['Smoked Tomato Ragù','16 oz',24],['Ember Peri-Peri','5 fl oz',15],['Truffle Aioli','6 oz',26],['Romesco','8 oz',17]],
  Oils: [['Lemon Agrumato','250 ml',28],['Chili Garlic Oil','250 ml',22],['Basil Infused Oil','250 ml',24],['Aged Balsamic','100 ml',38],['Sherry Vinegar','250 ml',19],['Burnt Honey Vinegar','200 ml',21],['Smoked Rapeseed Oil','500 ml',26],['Pumpkin Seed Oil','250 ml',23]],
  Preserves: [['Fig & Black Pepper Jam','8 oz',15],['Bitter Orange Marmalade','8 oz',14],['Pickled Shallots','12 oz',13],['Preserved Lemons','10 oz',16],['Quince Paste','6 oz',18],['Cherry Mostarda','8 oz',19],['Fermented Hot Honey','9 oz',20],['Tomato Confit','10 oz',17],['Pickled Chanterelles','8 oz',29]],
  Spices: [['House Za’atar','2 oz',12],['Smoked Sea Salt','4 oz',11],['Ras el Hanout','2 oz',13],['Porcini Salt','3 oz',16],['Togarashi Blend','2 oz',12],['Fennel Pollen','1 oz',24],['Black Lime Powder','2 oz',14],['Bistro Pepper Mix','3 oz',13],['Vanilla Sugar','6 oz',15],['Saffron Threads','1 g',22],['Dukkah','4 oz',14]],
};
const allProducts = [
  ...products.map((p) => ({ ...p, cat: p.name.includes('Oil') ? 'Oils' : 'Sauces' })),
  ...Object.entries(catalog).flatMap(([cat, items], ci) =>
    items.map(([name, size, price], i) => ({
      name, cat, price, note: size,
      rating: Math.round((4.5 + ((i * 7 + ci * 3) % 6) / 10) * 10) / 10,
      reviews: 40 + ((i * 53 + ci * 31) % 260),
      img: extraImgs[(i + ci * 2) % extraImgs.length],
    })),
  ),
];
const cats = ['All', ...Object.keys(catalog)];

const times = ['5:00', '5:30', '6:00', '6:30', '7:00', '7:30', '8:00', '8:30', '9:00', '9:30'];
const isoDay = (d: Date) => d.toISOString().slice(0, 10);

function Reservation({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ date: isoDay(new Date(Date.now() + 864e5)), time: '7:00', guests: 2, name: '', email: '', notes: '' });
  const [done, setDone] = useState(false);
  const day = new Date(form.date + 'T12:00').getDay();
  const closed = day === 1;
  const slots = day === 0 ? ['11:00', '11:30', '12:00', '12:30', '1:00', '1:30', '2:00'] : times;
  const time = slots.includes(form.time) ? form.time : slots[0];
  const label = new Date(form.date + 'T12:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const set = (k: string, v: string | number) => setForm((f) => ({ ...f, [k]: v }));
  const field = 'w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm focus:border-olive focus:outline-none';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true" aria-label="Reserve a table">
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-cream p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.25em] text-ember uppercase">Reservations</p>
            <h3 className="mt-2 font-serif text-3xl">{done ? 'You’re booked.' : 'Reserve a table'}</h3>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-full p-2 hover:bg-ink/5"><Icon d="M6 6l12 12M18 6L6 18" /></button>
        </div>
        {done ? (
          <div>
            <div className="rounded-2xl bg-olive p-6 text-cream">
              <p className="font-serif text-2xl">{label}</p>
              <p className="mt-1 text-cream/80">{time} {day === 0 ? (time.startsWith('11') ? 'am' : 'pm') : 'pm'} · {form.guests} {form.guests === 1 ? 'guest' : 'guests'}</p>
              <p className="mt-4 text-sm text-cream/60">Confirmation #MO-{Math.abs(form.email.length * 7919 + form.guests * 131) % 9000 + 1000}</p>
            </div>
            <p className="mt-5 text-sm text-ink/70">Thank you, {form.name.split(' ')[0]}. A confirmation has been sent to {form.email}. We hold tables for 15 minutes.</p>
            <button onClick={onClose} className="mt-6 w-full rounded-full bg-ink py-4 text-sm font-semibold text-white hover:bg-olive">Done</button>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); if (!closed) setDone(true); }} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs font-medium text-ink/60">Date
                <input type="date" required min={isoDay(new Date())} value={form.date} onChange={(e) => set('date', e.target.value)} className={`${field} mt-1`} />
              </label>
              <label className="text-xs font-medium text-ink/60">Guests
                <select value={form.guests} onChange={(e) => set('guests', +e.target.value)} className={`${field} mt-1`}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>)}
                </select>
              </label>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-ink/60">Time</p>
              {closed ? (
                <p className="rounded-xl bg-ember/10 px-4 py-3 text-sm text-ember">We’re closed on Mondays. Please choose another day.</p>
              ) : (
                <div className="grid grid-cols-5 gap-2">
                  {slots.map((t) => (
                    <button type="button" key={t} onClick={() => set('time', t)} className={`rounded-full border py-2 text-sm transition ${time === t ? 'border-olive bg-olive text-white' : 'border-ink/15 hover:border-ink'}`}>{t}</button>
                  ))}
                </div>
              )}
            </div>
            <input required placeholder="Full name" value={form.name} onChange={(e) => set('name', e.target.value)} className={field} />
            <input required type="email" placeholder="Email" value={form.email} onChange={(e) => set('email', e.target.value)} className={field} />
            <textarea rows={2} placeholder="Allergies or occasion (optional)" value={form.notes} onChange={(e) => set('notes', e.target.value)} className={field} />
            <button disabled={closed} className="w-full rounded-full bg-ember py-4 text-sm font-semibold text-white transition hover:bg-[#a8461a] disabled:opacity-40">Confirm reservation</button>
            <p className="text-center text-xs text-ink/50">Parties larger than 8? Call (212) 555-0142.</p>
          </form>
        )}
      </div>
    </div>
  );
}

const meals = [
  { name: 'Dry-Aged Ribeye, Bordelaise', desc: 'Pommes purée, charred shallot, red wine jus', price: 48, cat: 'Mains', tag: 'Chef’s pick', img: 'photo-1663530761401-15eefb544889' },
  { name: 'Halibut en Beurre Blanc', desc: 'Spring peas, fennel, citrus oil', price: 42, cat: 'Mains', tag: '', img: 'photo-1676471926534-d5c9771909fa' },
  { name: 'Miso Glazed Rice Bowl', desc: 'Short rib, pickled greens, soft egg', price: 26, cat: 'Bowls', tag: 'Bestseller', img: 'photo-1606756790138-261d2b21cd75' },
  { name: 'Wild Mushroom Risotto', desc: 'Aged parmesan, porcini salt, thyme', price: 28, cat: 'Bowls', tag: 'Vegetarian', img: 'photo-1676471926534-d5c9771909fa' },
  { name: 'Coq au Vin for Two', desc: 'Braised heritage chicken, lardons, pearl onions', price: 64, cat: 'To Share', tag: 'Serves 2', img: 'photo-1606756790138-261d2b21cd75' },
  { name: 'Roast Lamb Shoulder', desc: 'Salsa verde, crushed potatoes, jus', price: 78, cat: 'To Share', tag: 'Serves 2–3', img: 'photo-1663530761401-15eefb544889' },
];
type Item = { name: string; desc: string; price: number; cat: string; tag: string; img: string };
const sauces: Item[] = [
  { name: 'Smoked Chili Crisp', desc: 'Our most-ordered condiment. Crunchy, smoky, a slow burn', price: 18, cat: 'Heat', tag: 'Bestseller', img: 'photo-1610135373417-910bd43a580d' },
  { name: 'Charred Ember Hot Sauce', desc: 'Fermented 60 days with charred habanero', price: 16, cat: 'Heat', tag: '', img: 'photo-1663177239807-11d4d94a6d5f' },
  { name: 'Salsa Macha', desc: 'Guajillo, sesame and peanut in warm oil', price: 18, cat: 'Heat', tag: 'New', img: 'photo-1610135373399-472c8722106f' },
  { name: 'Bordelaise Reduction', desc: 'The ribeye sauce, reduced for 12 hours', price: 24, cat: 'Classic', tag: 'From the line', img: 'photo-1663530761401-15eefb544889' },
  { name: 'Brown Butter Miso', desc: 'Cultured butter and two-year white miso', price: 22, cat: 'Classic', tag: '', img: 'photo-1691480208637-6ed63aac6694' },
  { name: 'Truffle Aioli', desc: 'Black truffle, confit garlic, cold-pressed oil', price: 26, cat: 'Classic', tag: '', img: 'photo-1608797689272-9fffaa177090' },
  { name: 'Sauce Trio Gift Box', desc: 'Chili Crisp, Hot Sauce and Miso in a linen box', price: 52, cat: 'Gift Sets', tag: 'Save $4', img: 'photo-1610135373417-910bd43a580d' },
];
const merch: Item[] = [
  { name: 'Waxed Canvas Apron', desc: 'Worn in our kitchen. Leather straps, brass hardware', price: 85, cat: 'Wear', tag: 'Bestseller', img: 'photo-1574966740637-12c84035a4f2' },
  { name: 'Line Cook Apron', desc: 'Pinstripe cotton, two deep pockets', price: 55, cat: 'Wear', tag: '', img: 'photo-1723021073699-77f5442510a2' },
  { name: 'Maison Olea Market Tote', desc: 'Heavy cotton canvas, embroidered logo', price: 38, cat: 'Wear', tag: 'New', img: 'photo-1775210603696-d88c802f80aa' },
  { name: "Chef's 8\" Gyuto Knife", desc: 'Hand-forged carbon steel, walnut handle', price: 210, cat: 'Tools', tag: 'Limited', img: 'photo-1623947851502-49082c0d8ab8' },
  { name: 'Petty Utility Knife', desc: '5" blade for shallots, herbs and fruit', price: 120, cat: 'Tools', tag: '', img: 'photo-1665596666171-2378d6e973b9' },
  { name: 'Cooking Class Voucher', desc: 'Three-hour class with Chef Julien, for one', price: 180, cat: 'Experiences', tag: 'Gift', img: 'photo-1622021142947-da7dedc7c39a' },
  { name: 'Butchery Masterclass', desc: 'Whole-animal session, dinner included', price: 240, cat: 'Experiences', tag: 'Monthly', img: 'photo-1574966740793-953ad374e8fe' },
];
type ShopKey = 'meals' | 'sauces' | 'merch';
const shops: Record<ShopKey, { title: string; eyebrow: string; items: Item[]; noun: [string, string]; done: string }> = {
  meals: { title: 'Hot Ready Meals', eyebrow: 'Delivery · 35–45 min', items: meals, noun: ['dish', 'dishes'], done: 'Your kitchen slot is held for 10 minutes.' },
  sauces: { title: 'Signature Sauces', eyebrow: 'Bottled from our line · Ships in 2 days', items: sauces, noun: ['jar', 'jars'], done: 'Free shipping on pantry orders over $60.' },
  merch: { title: "Chef's Merch", eyebrow: 'Wear it · Cook with it · Gift it', items: merch, noun: ['item', 'items'], done: 'Gift wrapping available at checkout.' },
};

function MealsMenu({ shop, onClose, onAdd }: { shop: ShopKey; onClose: () => void; onAdd: (n: string, q: number) => void }) {
  const { title, eyebrow, items: list, noun, done } = shops[shop];
  const mealCats = ['All', ...new Set(list.map((m) => m.cat))];
  const meals = list;
  const [cat, setCat] = useState('All');
  const [qty, setQty] = useState<Record<string, number>>({});
  const [placed, setPlaced] = useState(false);
  const items = Object.entries(qty).filter(([, q]) => q > 0);
  const count = items.reduce((a, [, q]) => a + q, 0);
  const subtotal = items.reduce((a, [n, q]) => a + q * (meals.find((m) => m.name === n)?.price ?? 0), 0);
  const bump = (n: string, d: number) => setQty((s) => ({ ...s, [n]: Math.max(0, (s[n] ?? 0) + d) }));
  const checkout = () => { items.forEach(([n, q]) => onAdd(n, q)); setPlaced(true); };

  return (
    <div className="fixed inset-0 z-[60] flex justify-end bg-ink/60 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
      <div className="flex h-full w-full max-w-2xl flex-col bg-cream shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between border-b border-ink/10 p-6 md:p-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.25em] text-ember uppercase">{eyebrow}</p>
            <h3 className="mt-2 font-serif text-4xl">{title}</h3>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-full p-2 hover:bg-ink/5"><Icon d="M6 6l12 12M18 6L6 18" /></button>
        </div>
        {placed ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-olive text-white"><Icon d="M5 12l5 5 9-10" className="h-7 w-7" /></span>
            <h4 className="mt-6 font-serif text-3xl">Added to your bag</h4>
            <p className="mt-2 max-w-sm text-sm text-ink/60">{count} {count === 1 ? noun[0] : noun[1]} · ${subtotal}. {done}</p>
            <button onClick={onClose} className="mt-8 rounded-full bg-ink px-8 py-4 text-sm font-semibold text-white hover:bg-olive">Continue browsing</button>
          </div>
        ) : (
          <>
            <div className="flex gap-2 overflow-x-auto px-6 pt-6 md:px-8">
              {mealCats.map((c) => (
                <button key={c} onClick={() => setCat(c)} className={`shrink-0 rounded-full border px-5 py-2 text-sm font-medium transition ${cat === c ? 'border-ink bg-ink text-white' : 'border-ink/20 hover:border-ink'}`}>{c}</button>
              ))}
            </div>
            <ul className="flex-1 space-y-4 overflow-y-auto p-6 md:p-8">
              {meals.filter((m) => cat === 'All' || m.cat === cat).map((m) => {
                const q = qty[m.name] ?? 0;
                return (
                  <li key={m.name} className="flex gap-4 rounded-2xl bg-white p-3 shadow-sm">
                    <img src={u(m.img, 400)} alt={m.name} className="h-28 w-28 shrink-0 rounded-xl object-cover" />
                    <div className="flex flex-1 flex-col py-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif text-lg leading-snug">{m.name}</h4>
                        <span className="font-semibold">${m.price}</span>
                      </div>
                      <p className="mt-1 text-xs text-ink/55">{m.desc}</p>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        {m.tag ? <span className="rounded-full bg-olive/10 px-3 py-1 text-[11px] font-medium text-olive">{m.tag}</span> : <span />}
                        {q === 0 ? (
                          <button onClick={() => bump(m.name, 1)} aria-label={`Add ${m.name}`} className="grid h-9 w-9 place-items-center rounded-full border border-ink/20 hover:bg-ink hover:text-white"><Icon d="M12 5v14M5 12h14" className="h-4 w-4" /></button>
                        ) : (
                          <div className="flex items-center gap-3 rounded-full bg-ink px-1 text-white">
                            <button onClick={() => bump(m.name, -1)} aria-label="Decrease" className="grid h-8 w-8 place-items-center"><Icon d="M5 12h14" className="h-4 w-4" /></button>
                            <span className="text-sm font-semibold">{q}</span>
                            <button onClick={() => bump(m.name, 1)} aria-label="Increase" className="grid h-8 w-8 place-items-center"><Icon d="M12 5v14M5 12h14" className="h-4 w-4" /></button>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="border-t border-ink/10 p-6 md:p-8">
              <button disabled={!count} onClick={checkout} className="flex w-full items-center justify-between rounded-full bg-ember px-8 py-4 text-sm font-semibold text-white transition hover:bg-[#a8461a] disabled:opacity-40">
                <span>{count ? `Add ${count} to bag` : `Select ${noun[1]}`}</span>
                <span>${subtotal}</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Stars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5 text-ember" aria-label={`${value} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 20 20" className={`h-3.5 w-3.5 ${i < Math.round(value) ? 'fill-current' : 'fill-ink/15'}`}>
          <path d="M10 1.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6L10 15l-5.4 3 1.2-6L1.3 7.8l6.1-.7z" />
        </svg>
      ))}
    </div>
  );
}

const Icon = ({ d, className = 'h-5 w-5' }: { d: string; className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d={d} />
  </svg>
);

export default function App() {
  const [cart, setCart] = useState(2);
  const [added, setAdded] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [booking, setBooking] = useState(false);
  const [mealsOpen, setMealsOpen] = useState<ShopKey | null>(null);
  const [cat, setCat] = useState('All');
  const visible = showAll ? allProducts.filter((p) => cat === 'All' || p.cat === cat) : products;
  const toggleAll = () => {
    setShowAll((v) => !v);
    setCat('All');
    if (showAll) document.getElementById('pantry')?.scrollIntoView({ behavior: 'smooth' });
  };

  const add = (name: string) => {
    setCart((c) => c + 1);
    setAdded(name);
    setTimeout(() => setAdded(null), 1200);
  };

  return (
    <div className="min-h-screen bg-cream text-ink antialiased">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-ink/10 bg-cream/85 backdrop-blur-md">
        <nav className="mx-auto grid h-16 max-w-7xl grid-cols-3 items-center px-6">
          <ul className="hidden gap-8 text-[13px] font-medium tracking-wide uppercase md:flex">
            {['Menu', 'Pantry', 'Reservations'].map((l) => (
              <li key={l}>
                <a
                  href={`#${l.toLowerCase()}`}
                  onClick={l === 'Reservations' ? (e) => { e.preventDefault(); setBooking(true); } : undefined}
                  className="transition hover:text-ember"
                >{l}</a>
              </li>
            ))}
          </ul>
          <a href="#" className="col-start-2 text-center font-serif text-2xl tracking-tight">
            Maison <em className="text-ember">Olea</em>
          </a>
          <div className="flex justify-end">
            <button className="relative rounded-full p-2 transition hover:bg-ink/5" aria-label={`Cart, ${cart} items`}>
              <Icon d="M6 7h12l-1 13H7L6 7zm3 0V5a3 3 0 016 0v2" className="h-6 w-6" />
              <span className="absolute -top-0.5 -right-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-ember px-1 text-[10px] font-semibold text-white">{cart}</span>
            </button>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative flex min-h-[88vh] items-end overflow-hidden">
        <img src={u('photo-1663530761401-15eefb544889', 2400)} alt="Chef pouring sauce over a plated steak" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
        <div className="relative mx-auto w-full max-w-7xl px-6 pb-20 text-white">
          <p className="mb-6 text-xs font-medium tracking-[0.3em] text-white/70 uppercase">Bistro · Pantry · Delivery</p>
          <h1 className="max-w-4xl font-serif text-6xl leading-[0.95] font-medium md:text-8xl">
            Taste the <em className="font-normal">Extraordinary</em>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-white/80">
            Michelin-trained cooking, delivered warm to your door — and the sauces behind it, bottled for your own kitchen.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#menu" onClick={(e) => { e.preventDefault(); setMealsOpen('meals'); }} className="rounded-full bg-ember px-8 py-4 text-sm font-semibold transition hover:bg-[#a8461a]">Order for Delivery</a>
            <a href="#pantry" className="rounded-full bg-white px-8 py-4 text-sm font-semibold text-ink transition hover:bg-cream">Shop the Pantry</a>
          </div>
        </div>
      </section>

      {/* Bento */}
      <section id="menu" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="font-serif text-4xl md:text-5xl">Explore the <em className="text-olive">house</em></h2>
          <p className="hidden max-w-xs text-sm text-ink/60 md:block">Everything we cook, bottle and wear — available today.</p>
        </div>
        <div className="grid gap-4 md:h-[640px] md:grid-cols-2 md:grid-rows-2">
          {[
            { key: 'meals', t: 'Hot Ready Meals', s: 'Plated nightly, delivered in 40 minutes', img: 'photo-1606756790138-261d2b21cd75', cls: 'md:row-span-2 min-h-[420px]', big: true },
            { key: 'sauces', t: 'Signature Sauces', s: 'Bottled from our line', img: 'photo-1610135373399-472c8722106f', cls: 'min-h-[260px]' },
            { key: 'merch', t: "Chef's Merch", s: 'Aprons, totes & knives', img: 'photo-1775210603696-d88c802f80aa', cls: 'min-h-[260px]' },
          ].map((c) => (
            <a key={c.t} href="#" onClick={(e) => { e.preventDefault(); setMealsOpen(c.key as ShopKey); }} className={`group relative overflow-hidden rounded-3xl ${c.cls}`}>
              <img src={u(c.img, 1400)} alt={c.t} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-8 text-white">
                <div>
                  <h3 className={`font-serif ${c.big ? 'text-5xl' : 'text-3xl'}`}>{c.t}</h3>
                  <p className="mt-2 text-sm text-white/75">{c.s}</p>
                </div>
                <span className="grid h-11 w-11 place-items-center rounded-full border border-white/40 transition group-hover:bg-white group-hover:text-ink">
                  <Icon d="M7 17L17 7M9 7h8v8" className="h-4 w-4" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Pantry */}
      <section id="pantry" className="border-t border-ink/10 bg-white/50">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="mb-3 text-xs font-semibold tracking-[0.25em] text-ember uppercase">The Pantry</p>
              <h2 className="font-serif text-4xl md:text-5xl">Shop the Pantry</h2>
            </div>
            <button onClick={toggleAll} aria-expanded={showAll} className="text-sm font-medium underline underline-offset-4 hover:text-ember">
              {showAll ? 'Show fewer' : `View all ${allProducts.length} items`}
            </button>
          </div>
          {showAll && (
            <div className="-mt-4 mb-10 flex flex-wrap gap-2">
              {cats.map((c) => (
                <button key={c} onClick={() => setCat(c)} className={`rounded-full border px-5 py-2 text-sm font-medium transition ${cat === c ? 'border-ink bg-ink text-white' : 'border-ink/20 hover:border-ink'}`}>
                  {c} <span className="opacity-50">{c === 'All' ? allProducts.length : allProducts.filter((p) => p.cat === c).length}</span>
                </button>
              ))}
            </div>
          )}
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
            {visible.map((p) => (
              <article key={p.name} className="group">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#EDECE8]">
                  <img src={u(p.img, 800)} alt={p.name} className="h-full w-full object-cover mix-blend-multiply transition duration-500 group-hover:scale-105" />
                </div>
                <div className="mt-4 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-lg leading-snug">{p.name}</h3>
                    <p className="text-xs text-ink/50">{p.note}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Stars value={p.rating} />
                      <span className="text-xs text-ink/50">({p.reviews})</span>
                    </div>
                    <p className="mt-2 font-semibold">${p.price}</p>
                  </div>
                  <button
                    onClick={() => add(p.name)}
                    aria-label={`Add ${p.name} to cart`}
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border transition ${added === p.name ? 'border-olive bg-olive text-white' : 'border-ink/20 hover:border-ink hover:bg-ink hover:text-white'}`}
                  >
                    <Icon d={added === p.name ? 'M5 12l5 5 9-10' : 'M12 5v14M5 12h14'} className="h-4 w-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
          {showAll && (
            <div className="mt-14 text-center">
              <button onClick={toggleAll} className="rounded-full border border-ink/20 px-8 py-3 text-sm font-semibold transition hover:border-ink hover:bg-ink hover:text-white">Show fewer</button>
            </div>
          )}
        </div>
      </section>

      {/* Chef's note */}
      <section id="reservations" className="grid bg-olive text-cream md:grid-cols-2">
        <div className="flex flex-col justify-center px-6 py-20 md:px-16 lg:px-24">
          <p className="mb-8 text-xs font-semibold tracking-[0.25em] text-[#E8A27A] uppercase">A Note from the Chef</p>
          <blockquote className="font-serif text-3xl leading-tight md:text-5xl">
            “Every plate begins on a farm within eighty miles of our door. If I can’t shake the grower’s hand, it doesn’t go on the menu.”
          </blockquote>
          <div className="mt-10">
            <p className="font-serif text-4xl italic text-[#E8A27A]" style={{ fontFamily: 'Playfair Display' }}>Julien Moreau</p>
            <p className="mt-1 text-sm text-cream/60">Executive Chef & Founder</p>
          </div>
          <button onClick={() => setBooking(true)} className="mt-10 w-fit rounded-full bg-cream px-8 py-4 text-sm font-semibold text-olive transition hover:bg-white">Reserve a Table</button>
        </div>
        <div className="relative min-h-[480px]">
          <img src={u('photo-1622021142947-da7dedc7c39a', 1600)} alt="Chef preparing vegetables in a modern kitchen" className="absolute inset-0 h-full w-full object-cover" />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ink text-cream">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="font-serif text-3xl">Maison <em className="text-ember">Olea</em></p>
              <p className="mt-4 max-w-sm text-sm text-cream/60">New menus, pantry drops and private supper invitations — once a month.</p>
              <form onSubmit={(e) => e.preventDefault()} className="mt-6 flex max-w-md rounded-full border border-cream/20 p-1.5 focus-within:border-cream/60">
                <input type="email" required placeholder="your@email.com" className="flex-1 bg-transparent px-4 text-sm placeholder:text-cream/40 focus:outline-none" />
                <button className="rounded-full bg-ember px-6 py-3 text-sm font-semibold transition hover:bg-[#a8461a]">Subscribe</button>
              </form>
            </div>
            <div className="lg:col-span-3">
              <h4 className="mb-4 text-xs font-semibold tracking-[0.25em] text-cream/50 uppercase">Hours</h4>
              <dl className="space-y-2 text-sm">
                {[['Tue – Thu', '5pm – 10pm'], ['Fri – Sat', '5pm – 11pm'], ['Sunday', '11am – 3pm'], ['Monday', 'Closed']].map(([d, h]) => (
                  <div key={d} className="flex justify-between border-b border-cream/10 pb-2"><dt className="text-cream/60">{d}</dt><dd>{h}</dd></div>
                ))}
              </dl>
            </div>
            <div className="lg:col-span-4">
              <h4 className="mb-4 text-xs font-semibold tracking-[0.25em] text-cream/50 uppercase">Visit</h4>
              <div className="relative h-40 overflow-hidden rounded-2xl bg-[#2E2B28]" style={{ backgroundImage: 'linear-gradient(#ffffff0d 1px,transparent 1px),linear-gradient(90deg,#ffffff0d 1px,transparent 1px)', backgroundSize: '24px 24px' }}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-ember">
                  <Icon d="M12 21s-7-6.2-7-12a7 7 0 0114 0c0 5.8-7 12-7 12zm0-9a3 3 0 100-6 3 3 0 000 6z" className="h-8 w-8" />
                </div>
              </div>
              <p className="mt-3 text-sm text-cream/70">214 Orchard Street, New York, NY</p>
            </div>
          </div>
          <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-cream/10 pt-8 md:flex-row">
            <p className="text-xs text-cream/40">© 2025 Maison Olea. All rights reserved.</p>
            <div className="flex gap-3">
              {[
                ['Instagram', 'M4 8a4 4 0 014-4h8a4 4 0 014 4v8a4 4 0 01-4 4H8a4 4 0 01-4-4zm8 7a3 3 0 100-6 3 3 0 000 6zm4.5-7.5h.01'],
                ['TikTok', 'M14 4v10a3.5 3.5 0 11-3.5-3.5M14 4c.5 2.5 2.5 4 5 4'],
                ['Facebook', 'M15 4h-2a4 4 0 00-4 4v3H7v3h2v6h3v-6h2.5l.5-3h-3V8a1 1 0 011-1h2z'],
              ].map(([n, d]) => (
                <a key={n} href="#" aria-label={n} className="grid h-10 w-10 place-items-center rounded-full border border-cream/20 transition hover:border-ember hover:text-ember">
                  <Icon d={d} className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
      {mealsOpen && <MealsMenu key={mealsOpen} shop={mealsOpen} onClose={() => setMealsOpen(null)} onAdd={(_, q) => setCart((c) => c + q)} />}
      {booking && <Reservation onClose={() => setBooking(false)} />}
    </div>
  );
}
