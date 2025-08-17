import React, { useState } from "react";
import "./styles.css";

// ---------- Dress-up Game -------------------------------------------------

export default function App() {
  const [equipped, setEquipped] = useState({});
  const [event, setEvent] = useState(null);
  const [score, setScore] = useState(null);

  const events = [
    { name: "Party", required: ["dress"] },
    { name: "Wedding Guest", required: ["dress", "accessory"] },
    { name: "Work", required: ["top", "bottom"] },
    { name: "Scuba Diving", required: ["gear"] },
    { name: "Horseback Riding", required: ["gear", "shoes"] },
  ];

  const items = {
    dress: [
      { name: "Pink Dress", color: "#F472B6", hem: "full" },
      { name: "Blue Dress", color: "#60A5FA", hem: "full" },
    ],
    top: [
      { name: "Yellow Top", color: "#FACC15" },
      { name: "Green Top", color: "#34D399" },
    ],
    bottom: [
      { name: "Skirt", color: "#E879F9" },
      { name: "Pants", color: "#A78BFA" },
    ],
    shoes: [
      { name: "Sandals", color: "#FCD34D" },
      { name: "Boots", color: "#92400E" },
    ],
    accessory: [
      { name: "Tiara", color: "#F9A8D4", tags: ["tiara"] },
      { name: "Necklace", color: "#A7F3D0", tags: ["necklace"] },
    ],
    gear: [
      { name: "Scuba Mask", color: "#38BDF8", tags: ["mask"] },
      { name: "Flippers", color: "#22D3EE", tags: ["fins"] },
      { name: "Helmet", color: "#D1D5DB", tags: ["helmet"] },
    ],
  };

  function spinWheel() {
    const choice = events[Math.floor(Math.random() * events.length)];
    setEvent(choice);
    setScore(null);
  }

  function checkScore() {
    if (!event) return;
    let s = 0;
    event.required.forEach((req) => {
      if (equipped[req]) s += 1;
    });
    setScore(`${s}/${event.required.length}`);
  }

  return (
    <div style={{ fontFamily: "sans-serif", textAlign: "center", padding: 20 }}>
      <h1>Dress-Up Game 🎀</h1>
      <button onClick={spinWheel}>🎡 Spin for Event</button>
      {event && (
        <h2>
          Event: <span style={{ color: "purple" }}>{event.name}</span>
        </h2>
      )}
      <div style={{ margin: "20px auto", width: 260 }}>
        <GirlSVG equipped={equipped} />
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {Object.entries(items).map(([slot, arr]) => (
          <div key={slot} style={{ margin: 8 }}>
            <strong>{slot}</strong>
            <div>
              {arr.map((item) => (
                <button
                  key={item.name}
                  style={{
                    display: "block",
                    margin: "4px auto",
                    padding: "4px 8px",
                    background:
                      equipped[slot]?.name === item.name ? "#ddd" : "#fff",
                  }}
                  onClick={() => setEquipped({ ...equipped, [slot]: item })}
                >
                  {item.name}
                </button>
              ))}
              <button
                style={{ marginTop: 4 }}
                onClick={() => {
                  const copy = { ...equipped };
                  delete copy[slot];
                  setEquipped(copy);
                }}
              >
                ❌ None
              </button>
            </div>
          </div>
        ))}
      </div>

      {event && (
        <div style={{ marginTop: 20 }}>
          <button onClick={checkScore}>Check Outfit ✅</button>
          {score && <h3>Score: {score}</h3>}
        </div>
      )}
    </div>
  );
}

// ---------- Avatar -------------------------------------------------------

function GirlSVG({ equipped }) {
  const skin = "#FFD9C0";
  const hair = "#F2C761"; // warm blonde
  const line = "#CBD5E1"; // outline

  const sleeveColor = equipped.dress?.color || equipped.top?.color || null;

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
      </defs>

      {/* hair back */}
      <path
        d="M48,78 Q120,10 192,78 L192,210 Q120,250 48,210 Z"
        fill={hair}
        stroke={line}
        strokeWidth="1.5"
      />

      {/* head */}
      <circle
        cx="120"
        cy="90"
        r="42"
        fill={skin}
        stroke={line}
        strokeWidth="1.2"
      />

      {/* hairline + shine */}
      <path d="M78,78 Q120,50 162,78 Q150,60 120,56 Q90,60 78,78 Z" fill={hair} />
      <path
        d="M86,74 q34 -18 68 0"
        stroke="url(#hairshine)"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />

      {/* face */}
      <circle cx="106" cy="86" r="5.6" fill="#111827" />
      <circle cx="134" cy="86" r="5.6" fill="#111827" />
      <circle cx="104.5" cy="84.5" r="1.2" fill="#fff" />
      <circle cx="132.5" cy="84.5" r="1.2" fill="#fff" />
      <path
        d="M102 106 Q120 118 138 106"
        stroke="#EF4444"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="98" cy="98" r="8" fill="url(#cheek)" />
      <circle cx="142" cy="98" r="8" fill="url(#cheek)" />

      {/* neck */}
      <rect
        x="112"
        y="120"
        width="16"
        height="14"
        rx="4"
        fill={skin}
        stroke={line}
        strokeWidth="1"
      />

      {/* torso */}
      <path
        d="M90 134 h60 v70 a30 30 0 0 1 -60 0 z"
        fill="#FFEFE6"
        stroke={line}
        strokeWidth="1.2"
      />

      {/* arms */}
      <path
        d="M88 140 q-18 18 -16 46 q2 24 18 28 q10 2 18 -4"
        fill={skin}
        stroke={line}
        strokeWidth="1"
      />
      <ellipse
        cx="104"
        cy="210"
        rx="10"
        ry="8"
        fill={skin}
        stroke={line}
        strokeWidth="1"
      />
      <path
        d="M152 140 q18 18 16 46 q-2 24 -18 28 q-10 2 -18 -4"
        fill={skin}
        stroke={line}
        strokeWidth="1"
      />
      <ellipse
        cx="136"
        cy="210"
        rx="10"
        ry="8"
        fill={skin}
        stroke={line}
        strokeWidth="1"
      />

      {/* sleeves */}
      {sleeveColor && <SleevesLayer color={sleeveColor} />}

      {/* clothes */}
      {equipped.dress && (
        <DressLayer color={equipped.dress.color} hem={equipped.dress.hem} />
      )}
      {!equipped.dress && (
        <>
          {equipped.top && <TopLayer color={equipped.top.color} />}
          {equipped.bottom && <BottomLayer color={equipped.bottom.color} />}
        </>
      )}
      {equipped.outer && <OuterLayer color={equipped.outer.color} />}

      {/* accessories */}
      {equipped.accessory?.tags?.includes("tiara") && (
        <TiaraLayer color={equipped.accessory.color} />
      )}
      {equipped.accessory &&
        !equipped.accessory.tags.includes("tiara") && (
          <NecklaceLayer color={equipped.accessory.color} />
        )}

      {/* gear */}
      {equipped.gear?.tags?.includes("helmet") && (
        <HelmetLayer color={equipped.gear.color} />
      )}
      {equipped.gear?.tags?.includes("mask") && (
        <MaskLayer color={equipped.gear.color} />
      )}
      {equipped.gear?.tags?.includes("fins") && (
        <FinsLayer color={equipped.gear.color} />
      )}

      {/* legs */}
      <LegsAndFeet colorFeet={equipped.shoes?.color || "#D1A06D"} />

      {/* hair front */}
      <path
        d="M76,72 Q120,44 164,72 Q148,56 132,56 Q120,60 108,56 Q92,56 76,72 Z"
        fill={hair}
        stroke={line}
        strokeWidth="1.2"
      />
    </svg>
  );
}

// ---------- Layer helpers -------------------------------------------------

function SleevesLayer({ color }) {
  return (
    <g>
      <path
        d="M86 136 q18 -6 36 -6 v20 q-26 10 -46 6 q6 -10 10 -20 z"
        fill={color}
        stroke="#CBD5E1"
        strokeWidth="1.5"
      />
      <path
        d="M154 136 q-18 -6 -36 -6 v20 q26 10 46 6 q-6 -10 -10 -20 z"
        fill={color}
        stroke="#CBD5E1"
        strokeWidth="1.5"
      />
    </g>
  );
}

function DressLayer({ color }) {
  return (
    <path
      d="M90 204 h60 v90 a30 30 0 0 1 -60 0 z"
      fill={color}
      stroke="#CBD5E1"
      strokeWidth="1.2"
    />
  );
}

function TopLayer({ color }) {
  return (
    <rect
      x="90"
      y="134"
      width="60"
      height="40"
      fill={color}
      stroke="#CBD5E1"
      strokeWidth="1.2"
    />
  );
}

function BottomLayer({ color }) {
  return (
    <rect
      x="90"
      y="174"
      width="60"
      height="40"
      fill={color}
      stroke="#CBD5E1"
      strokeWidth="1.2"
    />
  );
}

function OuterLayer({ color }) {
  return (
    <rect
      x="84"
      y="134"
      width="72"
      height="100"
      fill={color}
      stroke="#CBD5E1"
      strokeWidth="1.2"
    />
  );
}

function TiaraLayer({ color }) {
  return (
    <path
      d="M100 58 q20 -20 40 0"
      stroke={color}
      strokeWidth="4"
      fill="none"
      strokeLinecap="round"
    />
  );
}

function NecklaceLayer({ color }) {
  return (
    <path
      d="M104 120 q16 16 32 0"
      stroke={color}
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
    />
  );
}

function HelmetLayer({ color }) {
  return (
    <circle cx="120" cy="90" r="44" fill={color} opacity="0.5" />
  );
}

function MaskLayer({ color }) {
  return (
    <rect x="98" y="78" width="44" height="18" rx="6" fill={color} opacity="0.6" />
  );
}

function FinsLayer({ color }) {
  return (
    <g>
      <path d="M90 300 q-20 30 0 40 h20 v-40 z" fill={color} />
      <path d="M150 300 q20 30 0 40 h-20 v-40 z" fill={color} />
    </g>
  );
}

function LegsAndFeet({ colorFeet }) {
  return (
    <g>
      <rect x="100" y="224" width="16" height="80" fill="#FFD9C0" />
      <rect x="124" y="224" width="16" height="80" fill="#FFD9C0" />
      <rect x="94" y="304" width="28" height="12" fill={colorFeet} />
      <rect x="124" y="304" width="28" height="12" fill={colorFeet} />
    </g>
  );
}
