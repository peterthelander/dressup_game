import React, { useMemo, useState } from "react";
import "./styles.css";

/** Dress-Up Game — multi-pane layout (header • event • avatar+score • catalog)
 *  - Uses inline layout styles so it looks structured even without extra CSS
 *  - Imports styles.css so your custom styles still apply (buttons, colors, etc.)
 */

// ---------- Data: Events -------------------------------------------------
// NEW: expanded event list (15+ events)
const EVENTS = [
  { id: "party",   name: "Birthday Party",   weather: "indoor", required: [], discouraged: ["helmet","wetsuit","fins"], tip: "Party time! Fun dress or colorful top works." },
  { id: "school",  name: "School Day",       weather: "mild",   required: [], discouraged: ["tiara","heels","wetsuit"], tip: "Keep it comfy and practical." },
  { id: "wedding", name: "Wedding Guest",    weather: "indoor", required: ["formal"], discouraged: ["helmet","wetsuit","sneakers"], tip: "Dressy outfit and a little sparkle." },
  { id: "work",    name: "Work Day",         weather: "mild",   required: ["smart"], discouraged: ["tiara","helmet"], tip: "Neat and tidy." },
  { id: "beach",   name: "Beach Day",        weather: "sunny",  required: ["sandals"], discouraged: ["heels","formal"], tip: "Light colors and sandals." },
  { id: "scuba",   name: "Scuba Diving",     weather: "sunny",  required: ["wetsuit","fins","mask"], discouraged: ["formal","heels","tiara"], tip: "Wetsuit, fins, and a mask!" },
  { id: "riding",  name: "Horseback Riding", weather: "mild",   required: ["helmet","ridingboots"], discouraged: ["heels","sandals"], tip: "Helmet + riding boots for safety." },
  { id: "rainy",   name: "Rainy Day",        weather: "rain",   required: ["raincoat"], discouraged: ["heels"], tip: "A raincoat helps a lot!" },
  { id: "winter",  name: "Snow Day",         weather: "cold",   required: ["puffer","gloves"], discouraged: ["sandals"], tip: "Bundle up!" },

  // NEW events
  { id: "sports",  name: "Sports Day",       weather: "mild",   required: ["sporty","sneakers"], discouraged: ["heels","tiara"], tip: "Comfy top + sneakers." },
  { id: "art",     name: "Art Class",        weather: "indoor", required: ["smock"], discouraged: ["formal"], tip: "Wear a smock so paint is okay!" },
  { id: "hiking",  name: "Hiking Trip",      weather: "mild",   required: ["hikingboots","backpack"], discouraged: ["heels","formal"], tip: "Boots & a small backpack." },
  { id: "picnic",  name: "Park Picnic",      weather: "sunny",  required: ["sunhat"], discouraged: ["wetsuit"], tip: "Light outfit & a hat." },
  { id: "sleep",   name: "Sleepover",        weather: "indoor", required: ["sleepwear"], discouraged: ["heels","helmet"], tip: "PJs for cozy time!" },
  { id: "pool",    name: "Pool Party",       weather: "sunny",  required: ["swim"], discouraged: ["heels","puffer"], tip: "Swimwear & sandals." },
  { id: "play",    name: "School Play",      weather: "indoor", required: ["costume"], discouraged: [], tip: "A fun costume for stage!" }
];

// ---------- Data: Items --------------------------------------------------
// NEW: expanded wardrobe to match events
const ITEMS = [
  // Dresses (formal/party)
  { id: "dress_party_peach",  name: "Party Dress (Peach)",  slot: "dress", tags: ["party","formal"], color: "#F7B2A0", hem: "scallop" },
  { id: "dress_formal_lilac", name: "Formal Dress (Lilac)", slot: "dress", tags: ["formal"], color: "#C4B5FD", hem: "straight" },
  { id: "dress_sundress",     name: "Sun Dress (Lemon)",   slot: "dress", tags: ["party"], color: "#FDE68A", hem: "scallop" },

  // Tops
  { id: "top_teal",       name: "Sweater (Teal)",    slot: "top", tags: ["smart"],    color: "#23B2A6" },
  { id: "top_rashguard",  name: "Rashguard",         slot: "top", tags: ["wetsuit","swim"], color: "#0EA5E9" },
  { id: "top_sport",      name: "Sport Tee",         slot: "top", tags: ["sporty"],  color: "#10B981" },
  { id: "top_pajama",     name: "PJ Top",            slot: "top", tags: ["sleepwear"], color: "#F9A8D4" },

  // Bottoms
  { id: "bottom_jeans",    name: "Jeans",           slot: "bottom", tags: ["smart"],    color: "#2D5B87" },
  { id: "bottom_wetsuit",  name: "Wetsuit Pants",   slot: "bottom", tags: ["wetsuit","swim"], color: "#1F2937" },
  { id: "bottom_sport",    name: "Sport Shorts",    slot: "bottom", tags: ["sporty"],  color: "#34D399" },
  { id: "bottom_pajama",   name: "PJ Pants",        slot: "bottom", tags: ["sleepwear"], color: "#FBCFE8" },

  // Outerwear
  { id: "outer_blazer",   name: "Blazer",         slot: "outer", tags: ["smart"],    color: "#4B5563" },
  { id: "outer_raincoat", name: "Raincoat",       slot: "outer", tags: ["raincoat"], color: "#FCD34D" },
  { id: "outer_puffer",   name: "Puffer Jacket",  slot: "outer", tags: ["puffer"],   color: "#64748B" },
  { id: "outer_smock",    name: "Art Smock",      slot: "outer", tags: ["smock"],    color: "#A7F3D0" },

  // Shoes
  { id: "shoes_flats",    name: "Flats",         slot: "shoes", tags: ["flats"],       color: "#D1A06D" },
  { id: "shoes_sandals",  name: "Sandals",       slot: "shoes", tags: ["sandals"],     color: "#F59E0B" },
  { id: "shoes_riding",   name: "Riding Boots",  slot: "shoes", tags: ["ridingboots"], color: "#6B4423" },
  { id: "shoes_sneakers", name: "Sneakers",      slot: "shoes", tags: ["sneakers"],    color: "#9CA3AF" },
  { id: "shoes_hiking",   name: "Hiking Boots",  slot: "shoes", tags: ["hikingboots"], color: "#8B5E34" },

  // Accessories
  { id: "acc_tiara",     name: "Tiara",      slot: "accessory", tags: ["tiara"],    color: "#E5E7EB" },
  { id: "acc_necklace",  name: "Necklace",   slot: "accessory", tags: ["sparkle"],  color: "#FFE08A" },
  { id: "acc_scarf",     name: "Scarf",      slot: "accessory", tags: ["scarf"],    color: "#F87171" },
  { id: "acc_gloves",    name: "Gloves",     slot: "accessory", tags: ["gloves"],   color: "#93C5FD" },
  { id: "acc_sunhat",    name: "Sun Hat",    slot: "accessory", tags: ["sunhat"],   color: "#F5DEB3" },
  { id: "acc_backpack",  name: "Backpack",   slot: "accessory", tags: ["backpack"], color: "#60A5FA" },

  // Gear
  { id: "gear_helmet", name: "Helmet",  slot: "gear", tags: ["helmet"], color: "#9CA3AF" },
  { id: "gear_fins",   name: "Fins",    slot: "gear", tags: ["fins"],   color: "#22D3EE" },
  { id: "gear_mask",   name: "Mask",    slot: "gear", tags: ["mask"],   color: "#93C5FD" },

  // Makeup (light)
  { id: "makeup_soft", name: "Soft Makeup", slot: "makeup", tags: ["makeup"], color: "#FCA5A5" },
];

const CATEGORIES = [
  { key: "dress", label: "Dresses" },
  { key: "top", label: "Tops" },
  { key: "bottom", label: "Bottoms" },
  { key: "outer", label: "Outerwear" },
  { key: "shoes", label: "Shoes" },
  { key: "accessory", label: "Accessories" },
  { key: "gear", label: "Gear" },
  { key: "makeup", label: "Makeup" },
];

// ---------- Helpers ------------------------------------------------------
const rand = (n) => Math.floor(Math.random() * n);

// ---------- Component ----------------------------------------------------
export default function App() {
  const [equipped, setEquipped] = useState({}); // slot -> itemId
  const [category, setCategory] = useState("dress");
  const [round, setRound] = useState(1);
  const [event, setEvent] = useState(EVENTS[rand(EVENTS.length)]);
  const [spinning, setSpinning] = useState(false);
  const [lastScore, setLastScore] = useState(null); // {score, stars, detail}
  const [total, setTotal] = useState(0);

  const equippedItems = useMemo(() => {
    const map = {};
    for (const [slot, id] of Object.entries(equipped)) {
      const it = ITEMS.find((x) => x.id === id);
      if (it) map[slot] = it;
    }
    return map;
  }, [equipped]);

  function equip(item) {
    setEquipped((prev) => {
      const next = { ...prev };
      if (!item) return next;
      if (item.slot === "dress") { delete next.top; delete next.bottom; }
      if (item.slot === "top" || item.slot === "bottom") { delete next.dress; }
      next[item.slot] = item.id;
      return next;
    });
  }
  function unequipSlot(slot) { setEquipped((p) => { const n = { ...p }; delete n[slot]; return n; }); }

  function spin() {
    if (spinning) return;
    setSpinning(true);
    let i = 0;
    const t = setInterval(() => {
      i++;
      setEvent(EVENTS[rand(EVENTS.length)]);
      if (i > 18) {
        clearInterval(t);
        setEvent(EVENTS[rand(EVENTS.length)]);
        setSpinning(false);
        setLastScore(null);
      }
    }, 90);
  }

  function computeScore() {
    const req = new Set(event.required); const dis = new Set(event.discouraged);
    const allTags = Object.values(equippedItems).flatMap((it) => it.tags || []);

    let base = 0;
    if (event.id === "wedding" && allTags.includes("formal")) base += 3;
    if (event.id === "work" && allTags.includes("smart")) base += 3;
    if (event.id === "party" && (allTags.includes("party") || allTags.includes("sparkle"))) base += 3;
    // NEW: event-specific bonuses
    if (event.id === "sports") {
      const s = allTags.includes("sporty");
      const sn = allTags.includes("sneakers");
      base += s && sn ? 3 : (s || sn ? 1 : 0);
    }
    if (event.id === "art" && allTags.includes("smock")) base += 2;
    if (event.id === "hiking") {
      const b = allTags.includes("hikingboots");
      const p = allTags.includes("backpack");
      base += b && p ? 3 : (b || p ? 1 : 0);
    }
    if (event.id === "picnic" && allTags.includes("sunhat")) base += 2;
    if (event.id === "sleep" && allTags.includes("sleepwear")) base += 2;
    if (event.id === "pool") {
      const sw = allTags.includes("swim");
      const sa = allTags.includes("sandals");
      base += sw && sa ? 3 : (sw || sa ? 1 : 0);
    }
    if (event.id === "winter" && allTags.includes("gloves")) base += 1;
    if (event.id === "play" && allTags.includes("costume")) base += 2;
    if (["school","beach","rainy","winter","riding","scuba","sports","art","hiking","picnic","sleep","pool","play"].includes(event.id)) base += 2;

    let safety = 0; req.forEach((tag)=>{ if(allTags.includes(tag)) safety += 1;}); safety = Math.min(3, safety);

    let weather = 0;
    if (event.weather === "rain" && allTags.includes("raincoat")) weather += 2;
    if (event.weather === "cold" && allTags.includes("puffer")) weather += 2;
    if (event.id === "beach" && allTags.includes("sandals")) weather += 2;

    const palette = Object.values(equippedItems).map((it)=>it.color);
    let style = 0;
    if (palette.length >= 2) {
      const light = (c)=>{ if(!c) return .5; const v=parseInt(c.slice(1),16); const r=(v>>16)&255,g=(v>>8)&255,b=v&255; return (r+g+b)/(255*3);};
      const avg=palette.reduce((a,c)=>a+light(c),0)/palette.length;
      const v=palette.reduce((a,c)=>{const d=light(c)-avg;return a+d*d;},0);
      style = v<0.01?2:v<0.02?1:0;
    }

    let penalty = 0; dis.forEach((tag)=>{ if(allTags.includes(tag)) penalty += 1; });

    const score = Math.max(0, Math.min(10, base + safety + weather + style - penalty));
    const stars = score >= 8 ? 3 : score >= 5 ? 2 : 1;
    return { score, stars, detail: { base, safety, weather, style, penalty } };
  }

  function finishRound() { const r = computeScore(); setLastScore(r); setTotal((t)=>t + r.score); }
  function nextRound() { setRound((r)=>r+1); setEvent(EVENTS[rand(EVENTS.length)]); setEquipped({}); setLastScore(null); }

  // ---------- Layout ------------------------------------------------------
  return (
    <div style={{ minHeight: "100vh", background: "#F3FFFC", color: "#0F172A", fontFamily: "ui-sans-serif, system-ui" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: 16 }}>
        {/* Header */}
        <header style={{ display: "flex", gap: 12, alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap" }}>
          <div>
            <h1 style={{ fontSize: 24, margin: 0 }}>Dress-Up Game (MVP)</h1>
            <div style={{ color: "#64748B" }}>Round {round} • Total Score {total}</div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button onClick={spin} disabled={spinning}>
              {spinning ? "Spinning…" : "Spin Event"}
            </button>
            <button onClick={finishRound}>Finish Look</button>
            <button onClick={nextRound}>Next Round</button>
          </div>
        </header>

        {/* Two-column: Event card • Avatar+Score */}
        <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 16, marginTop: 12 }}>
          {/* Event Card */}
          <div style={card()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12, textTransform: "uppercase", color: "#64748B" }}>Current Event</div>
                <div style={{ fontSize: 18, fontWeight: 600 }}>{event.name}</div>
                <div style={{ color: "#64748B" }}>{event.tip}</div>
              </div>
              <div style={{ fontSize: 32 }}>{icon(event.id)}</div>
            </div>
            <div style={{ marginTop: 8, background: "#F8FAFC", padding: 8, borderRadius: 12, color: "#475569", fontSize: 14 }}>
              Requirements: {event.required.length ? event.required.join(", ") : "None"}
            </div>
          </div>

          {/* Avatar + Score */}
          <div style={card({ position: "relative" })}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <GirlSVG equipped={equippedItems} />
              </div>
              <div>
                <div style={{ color: "#64748B", fontSize: 14 }}>Score</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Stars n={lastScore?.stars || 0} />
                  {lastScore && <span style={{ fontSize: 18, fontWeight: 600 }}>{lastScore.score} / 10</span>}
                </div>
                {lastScore ? (
                  <ul style={{ marginTop: 8, color: "#475569", fontSize: 14 }}>
                    <li>Base fit: +{lastScore.detail.base}</li>
                    <li>Safety: +{lastScore.detail.safety}</li>
                    <li>Weather: +{lastScore.detail.weather}</li>
                    <li>Style: +{lastScore.detail.style}</li>
                    {lastScore.detail.penalty > 0 && <li>Penalty: -{lastScore.detail.penalty}</li>}
                  </ul>
                ) : (
                  <div style={{ color: "#64748B", fontSize: 14 }}>Finish your look to see the score ✨</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Catalog */}
        <div style={{ ...card(), marginTop: 16 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {CATEGORIES.map((c) => (
              <button key={c.key} onClick={() => setCategory(c.key)} style={pill(category === c.key)}>
                {c.label}
              </button>
            ))}
            <div style={{ marginLeft: "auto", color: "#64748B", fontSize: 14 }}>Tip: tap an item to equip, or “Remove” to clear.</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10, marginTop: 10 }}>
            {ITEMS.filter((i)=>i.slot===category).map((item)=> (
              <button key={item.id} onClick={()=>equip(item)} style={tile(Object.values(equipped).includes(item.id))}>
                <div style={{ height: 96, display: "grid", placeItems: "center", background: "#F1F5F9", borderRadius: 8 }}>
                  <MiniPreview item={item} />
                </div>
                <div style={{ marginTop: 6, fontSize: 14, fontWeight: 600 }}>{item.name}</div>
                <div style={{ fontSize: 12, color: "#64748B" }}>tags: {(item.tags || []).join(", ") || "—"}</div>
              </button>
            ))}
            <button onClick={()=>unequipSlot(category)} style={tile(false)}>
              <div style={{ height: 96, display: "grid", placeItems: "center", background: "#F1F5F9", borderRadius: 8, fontSize: 28 }}>✖️</div>
              <div style={{ marginTop: 6, fontSize: 14, fontWeight: 600 }}>Remove {CATEGORIES.find((c)=>c.key===category)?.label}</div>
              <div style={{ fontSize: 12, color: "#64748B" }}>Clear equipped item</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Small UI helpers --------------------------------------------
const card = (extra={}) => ({ background: "white", border: "1px solid #E5E7EB", borderRadius: 20, padding: 12, boxShadow: "0 1px 2px rgba(0,0,0,.04)", ...extra });
const pill = (active) => ({ borderRadius: 999, padding: "6px 12px", border: "1px solid", borderColor: active?"transparent":"#E5E7EB", background: active?"#14B8A6":"#F8FAFC", color: active?"white":"#0F172A", cursor: "pointer" });
const tile = (active) => ({ textAlign: "left", border: "1px solid", borderColor: active?"#14B8A6":"#E5E7EB", background: active?"#ECFEFF":"white", borderRadius: 14, padding: 10, cursor: "pointer" });
// NEW: icons for additional events
const icon = (id) => ({
  scuba: "🤿",
  riding: "🐎",
  rainy: "🌧️",
  winter: "❄️",
  beach: "🏖️",
  wedding: "💒",
  work: "💼",
  school: "📚",
  sports: "🏀",
  art: "🎨",
  hiking: "🥾",
  picnic: "🧺",
  sleep: "🛌",
  pool: "🏊‍♀️",
  play: "🎭",
}[id] || "🎉");

function Stars({ n }) {
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {[0,1,2].map((i)=> (
        <svg key={i} width="26" height="26" viewBox="0 0 24 24" fill={i<n?"#F59E0B":"#E5E7EB"}>
          <path d="M12 2l2.9 6.26 6.9.58-5.2 4.5 1.6 6.66L12 16.9 5.8 20l1.6-6.66-5.2-4.5 6.9-.58L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function MiniPreview({ item }) {
  const is = (t) => (item.tags || []).includes(t);
  return (
    <svg viewBox="0 0 80 80" width={80} height={80}>
      {item.slot === "dress" && (
        <path d={
          item.hem === "scallop"
            ? "M40 18 L56 42 Q40 50 24 42 Z"
            : "M32 18 h16 l12 24 h-40 z"
        } fill={item.color} />
      )}
      {item.slot === "top" && (
        <g>
          <rect x="24" y="22" width="32" height="20" rx="6" fill={item.color} />
          <path d="M24 36 h32" stroke="#fff" strokeOpacity="0.3" />
          <path d="M32 22 q8 8 16 0" stroke="#fff" strokeOpacity="0.3" />
        </g>
      )}
      {item.slot === "bottom" && (
        <g>
          <rect x="28" y="44" width="24" height="18" rx="5" fill={item.color} />
          <path d="M28 53 h24" stroke="#fff" strokeOpacity="0.3" />
        </g>
      )}
      {item.slot === "outer" && (
        <g>
          <rect x="20" y="20" width="40" height="32" rx="8" fill={item.color} />
          <path d="M40 20 v32" stroke="#fff" strokeOpacity="0.3" />
        </g>
      )}
      {item.slot === "shoes" && (
        <g>
          <ellipse cx="33" cy="66" rx="8" ry="6" fill={item.color} />
          <ellipse cx="47" cy="66" rx="8" ry="6" fill={item.color} />
          <path d="M25 69 h18" stroke="#000" strokeOpacity="0.2" />
          <path d="M37 69 h18" stroke="#000" strokeOpacity="0.2" />
        </g>
      )}
      {item.slot === "accessory" && (
        is("sunhat") ? (
          <path d="M40 30 a12 12 0 0 1 12 12 h-24 a12 12 0 0 1 12-12zm-20 12 h40" fill={item.color} stroke={item.color} />
        ) : is("scarf") ? (
          <path d="M28 40 q12 12 24 0 q-4 12 -12 14 q-8 -2 -12 -14z" fill={item.color} />
        ) : is("gloves") ? (
          <g fill={item.color}><rect x="20" y="50" width="12" height="10" rx="4" /><rect x="48" y="50" width="12" height="10" rx="4" /></g>
        ) : is("backpack") ? (
          <g>
            <rect x="28" y="26" width="24" height="28" rx="6" fill={item.color} />
            <path d="M28 30 q-6 10 0 20 M52 30 q6 10 0 20" stroke="#fff" strokeOpacity="0.3" />
          </g>
        ) : (
          <circle cx="40" cy="40" r="10" fill={item.color} />
        )
      )}
      {item.slot === "gear" && (<rect x="30" y="30" width="20" height="20" rx="4" fill={item.color} />)}
      {item.slot === "makeup" && (<circle cx="40" cy="40" r="8" fill={item.color} opacity={0.3} />)}
    </svg>
  );
}

// ---------- Avatar -------------------------------------------------------
function GirlSVG({ equipped }) {
  const skin = "#FFD9C0";
  const hair = "#F2C761"; // warm blonde
  const line = "#CBD5E1"; // soft outline
  const sleeveColor = equipped.dress?.color || equipped.top?.color || null;
  const hasOuter = !!equipped.outer;

  return (
    <svg viewBox="0 0 240 360" width={240} height={360}>
      <defs>
        <radialGradient id="cheek" cx="50%" cy="50%" r="0.6">
          <stop offset="0%" stopColor="#FCA5A5" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#FCA5A5" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hairshine" x1="0" x2="1">
          <stop offset="0%" stopColor="#FFF7D6" stopOpacity="0.8" />
          <stop offset="100%" stopColor={hair} stopOpacity="0.2" />
        </linearGradient>
        {/* NEW: generic cloth shading */}
        <linearGradient id="clothShade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Hair back + locks (more volume) */}
      <path d="M44,78 Q120,8 196,78 L196,210 Q120,260 44,210 Z" fill={hair} stroke={line} strokeWidth="1.5" />
      <path d="M44,120 q-10 30 12 62 q12 18 20 20 v-32 q-12 -18 -14 -50 z" fill={hair} stroke={line} strokeWidth="1.5" />
      <path d="M196,120 q10 30 -12 62 q-12 18 -20 20 v-32 q12 -18 14 -50 z" fill={hair} stroke={line} strokeWidth="1.5" />

      {/* Head + hairline + shine */}
      <circle cx="120" cy="90" r="42" fill={skin} stroke={line} strokeWidth="1.2" />
      <path d="M78,78 Q120,50 162,78 Q150,60 120,56 Q90,60 78,78 Z" fill={hair} />
      <path d="M86,74 q34 -18 68 0" stroke="url(#hairshine)" strokeWidth="6" fill="none" strokeLinecap="round" />

      {/* Ears */}
      <circle cx="78" cy="90" r="8" fill={skin} stroke={line} strokeWidth="1" />
      <circle cx="162" cy="90" r="8" fill={skin} stroke={line} strokeWidth="1" />

      {/* Face */}
      <circle cx="106" cy="86" r="6.5" fill="#111827" />
      <circle cx="134" cy="86" r="6.5" fill="#111827" />
      <circle cx="104.5" cy="84.5" r="1.4" fill="#fff" />
      <circle cx="132.5" cy="84.5" r="1.4" fill="#fff" />
      {/* NEW: eyebrows and nose */}
      <path d="M96 74 q10 -6 20 0" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
      <path d="M124 74 q10 -6 20 0" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
      <path d="M118 92 q2 4 0 8" stroke="#D97706" strokeWidth="1" fill="none" />
      <path d="M102 106 Q120 118 138 106" stroke="#EF4444" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="98" cy="98" r="8" fill="url(#cheek)" />
      <circle cx="142" cy="98" r="8" fill="url(#cheek)" />

      {/* Neck + torso */}
      <rect x="112" y="120" width="16" height="14" rx="4" fill={skin} stroke={line} strokeWidth="1" />
      <path d="M90 134 h60 v70 a30 30 0 0 1 -60 0 z" fill="#FFEFE6" stroke={line} strokeWidth="1.2" />

      {/* Backpack (behind) */}
      {equipped.accessory?.tags?.includes("backpack") && <BackpackBack color={equipped.accessory.color} />}

      {/* Arms + hands */}
      <path d="M88 140 q-20 18 -18 46 q4 26 20 30 q10 2 18 -4" fill={skin} stroke={line} strokeWidth="1" />
      <ellipse cx="104" cy="210" rx="10" ry="8" fill={skin} stroke={line} strokeWidth="1" />
      <path d="M152 140 q20 18 18 46 q-4 26 -20 30 q-10 2 -18 -4" fill={skin} stroke={line} strokeWidth="1" />
      <ellipse cx="136" cy="210" rx="10" ry="8" fill={skin} stroke={line} strokeWidth="1" />

      {/* Sleeves that match dress/top */}
      {sleeveColor && <SleevesLayer color={sleeveColor} long={hasOuter} />}

      {/* Clothes */}
      {equipped.dress && (<DressLayer color={equipped.dress.color} hem={equipped.dress.hem} />)}
      {!equipped.dress && (<>{equipped.top && <TopLayer color={equipped.top.color} />}{equipped.bottom && <BottomLayer color={equipped.bottom.color} />}</>)}
      {equipped.outer && <OuterLayer color={equipped.outer.color} />}

      {/* Neck accessories */}
      {equipped.accessory?.tags?.includes("scarf") && <ScarfLayer color={equipped.accessory.color} />}
      {equipped.accessory?.tags?.includes("backpack") && <BackpackStraps color={equipped.accessory.color} />}
      {equipped.accessory?.tags?.includes("gloves") && <GlovesLayer color={equipped.accessory.color} />}
      {equipped.accessory && equipped.accessory.tags.includes("sparkle") && <NecklaceLayer color={equipped.accessory.color} />}

      {/* Gear */}
      {equipped.gear?.tags?.includes("mask") && <MaskLayer color={equipped.gear.color} />}
      {equipped.gear?.tags?.includes("fins") && <FinsLayer color={equipped.gear.color} />}

      {/* Legs & shoes */}
      <LegsAndFeet colorFeet={equipped.shoes?.color || "#D1A06D"} />

      {/* Hair front */}
      <path d="M76,72 Q120,44 164,72 Q148,56 132,56 Q120,60 108,56 Q92,56 76,72 Z" fill={hair} stroke={line} strokeWidth="1.2" />

      {/* Headgear */}
      {equipped.gear?.tags?.includes("helmet") && <HelmetLayer color={equipped.gear.color} />}
      {equipped.accessory?.tags?.includes("tiara") && <TiaraLayer color={equipped.accessory.color} />}
      {equipped.accessory?.tags?.includes("sunhat") && <SunHatLayer color={equipped.accessory.color} />}
    </svg>
  );
}

// ---------- Clothing & Layers -------------------------------------------
function TopLayer({ color }) {
  return (
    <g>
      <rect x="90" y="134" width="60" height="40" rx="8" fill={color} stroke="#CBD5E1" strokeWidth="2" />
      <rect x="90" y="134" width="60" height="40" rx="8" fill="url(#clothShade)" />
      <path d="M90 158 h60" stroke="#CBD5E1" strokeWidth="0.8" opacity="0.5" />
      {/* collar */}
      <path d="M108 134 q12 12 24 0" stroke="#CBD5E1" strokeWidth="1" fill="none" />
    </g>
  );
}

function BottomLayer({ color }) {
  return (
    <g>
      <path d="M95 174 h50 v26 a22 22 0 0 1 -50 0 z" fill={color} stroke="#CBD5E1" strokeWidth="2" />
      <path d="M95 174 h50 v26 a22 22 0 0 1 -50 0 z" fill="url(#clothShade)" />
      <path d="M95 186 h50" stroke="#CBD5E1" strokeWidth="0.8" opacity="0.5" />
    </g>
  );
}

function DressLayer({ color, hem = "scallop" }) {
  if (hem === "scallop") {
    const arcs = Array.from({ length:5 }, () => " q-7 8 -14 0").join("");
    const d = `M85 134 h70 v28${arcs} z`;
    return (
      <g>
        <path d={d} fill={color} stroke="#CBD5E1" strokeWidth="2" />
        <path d={d} fill="url(#clothShade)" />
        <path d="M85 134 h70" stroke="#CBD5E1" strokeWidth="0.8" opacity="0.5" />
      </g>
    );
  }
  const d = "M85 134 h70 v30 l-70 0 z";
  return (
    <g>
      <path d={d} fill={color} stroke="#CBD5E1" strokeWidth="2" />
      <path d={d} fill="url(#clothShade)" />
      <path d="M85 134 h70" stroke="#CBD5E1" strokeWidth="0.8" opacity="0.5" />
    </g>
  );
}

function OuterLayer({ color }) {
  const d = "M80 132 h80 v50 q-40 16 -80 0 z";
  return (
    <g opacity="0.96">
      <path d={d} fill={color} stroke="#CBD5E1" strokeWidth="2" />
      <path d={d} fill="url(#clothShade)" />
      <path d="M120 132 v50" stroke="#CBD5E1" strokeWidth="1" />
    </g>
  );
}

function TiaraLayer({ color }) { return (<g><path d="M90 62 q30 -22 60 0" stroke={color} strokeWidth="6" fill="none" /><circle cx="120" cy="50" r="6" fill={color} /></g>); }
function NecklaceLayer({ color }) { return <path d="M108 124 q12 10 24 0" stroke={color} strokeWidth="4" fill="none" />; }
function HelmetLayer({ color }) { return <path d="M78 64 q42 -28 84 0 v18 h-84 z" fill={color} opacity="0.9" />; }
function MaskLayer({ color }) { return (<g opacity={0.9}><rect x="96" y="80" width="48" height="16" rx="8" fill={color} /><path d="M96 88 h-10 M144 88 h10" stroke={color} strokeWidth="3" /></g>); }
function FinsLayer({ color }) { return (<g><path d="M88 300 q14 6 28 0 v16 q-14 10 -28 0 z" fill={color} /><path d="M124 300 q14 6 28 0 v16 q-14 10 -28 0 z" fill={color} /></g>); }

function LegsAndFeet({ colorFeet }) {
  return (
    <g>
      <rect x="100" y="200" width="12" height="100" rx="6" fill="#FFD9C0" />
      <rect x="128" y="200" width="12" height="100" rx="6" fill="#FFD9C0" />
      <g>
        <ellipse cx="106" cy="305" rx="16" ry="10" fill={colorFeet} />
        <path d="M90 310 h32" stroke="#000" strokeOpacity="0.2" />
      </g>
      <g>
        <ellipse cx="134" cy="305" rx="16" ry="10" fill={colorFeet} />
        <path d="M118 310 h32" stroke="#000" strokeOpacity="0.2" />
      </g>
    </g>
  );
}

function SleevesLayer({ color, long }) {
  return (
    <g>
      {long ? (
        <>
          <path d="M86 136 q18 -6 36 -6 v34 q-26 14 -46 10 q6 -16 10 -38 z" fill={color} stroke="#CBD5E1" strokeWidth="1.5" />
          <path d="M154 136 q-18 -6 -36 -6 v34 q26 14 46 10 q-6 -16 -10 -38 z" fill={color} stroke="#CBD5E1" strokeWidth="1.5" />
        </>
      ) : (
        <>
          <path d="M86 136 q18 -6 36 -6 v20 q-26 10 -46 6 q6 -10 10 -20 z" fill={color} stroke="#CBD5E1" strokeWidth="1.5" />
          <path d="M154 136 q-18 -6 -36 -6 v20 q26 10 46 6 q-6 -10 -10 -20 z" fill={color} stroke="#CBD5E1" strokeWidth="1.5" />
        </>
      )}
    </g>
  );
}

function ScarfLayer({ color }) {
  return <path d="M100 130 q20 14 40 0 q-8 24 -20 28 q-12 -4 -20 -28z" fill={color} stroke="#CBD5E1" strokeWidth="1" />;
}

function GlovesLayer({ color }) {
  return (
    <g fill={color} stroke="#CBD5E1" strokeWidth="1">
      <rect x="92" y="202" width="20" height="16" rx="6" />
      <rect x="128" y="202" width="20" height="16" rx="6" />
    </g>
  );
}

function SunHatLayer({ color }) {
  return (
    <g>
      <ellipse cx="120" cy="60" rx="60" ry="14" fill={color} stroke="#CBD5E1" strokeWidth="1" />
      <ellipse cx="120" cy="48" rx="24" ry="14" fill={color} stroke="#CBD5E1" strokeWidth="1" />
    </g>
  );
}

function BackpackBack({ color }) {
  return <rect x="88" y="142" width="64" height="70" rx="12" fill={color} stroke="#CBD5E1" strokeWidth="1" opacity="0.9" />;
}

function BackpackStraps({ color }) {
  return (
    <g stroke={color} strokeWidth="4" fill="none" opacity="0.8">
      <path d="M100 134 q-12 30 0 60" />
      <path d="M140 134 q12 30 0 60" />
    </g>
  );
}
