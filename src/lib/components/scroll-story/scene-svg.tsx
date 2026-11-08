import { business } from "@/lib/business"
import { FIT_TAGS, SWATCHES, SWATCH_X, SWATCH_Y, garmentShape, type Attrs, type Frame } from "./scene"

type Props = {
  frame: Frame
  /** Unique per instance so gradient and pattern ids never collide. */
  id: string
  className?: string
  /**
   * Static snapshots draw the street inline. The live stage draws it as separate <svg>
   * elements moved by CSS transforms, which skips SVG relayout on every frame.
   */
  inlineStreet?: boolean
}

type AttrFn = (k: string) => Attrs & { "data-k"?: string }

const INK = "#2e2028"
const AWNING = "#59283f"
const STEEL = "#3b6a62"
const STEEL_DARK = "#2c524c"

/** Mini window mannequins reuse the real garment generator. */
const mini = garmentShape({ W: 92, H: 250, hem: 97, sl: 74, sa: 0.62, cw: 46, arm: 96, vd: 62 })
const WINDOW_TOPS = [
  { x: 132, hex: "#2a9a98" },
  { x: 222, hex: "#8fa9d6" },
  { x: 312, hex: "#a693c8" },
]

const pillWidth = (label: string) => Math.round(label.length * 9.4 + 34)

export const attrsFor =
  (frame: Frame): AttrFn =>
  (k) => ({ "data-k": k, ...(frame[k] ?? {}) })

export default function SceneSvg({ frame, id, className, inlineStreet = true }: Props) {
  const a = attrsFor(frame)
  const ref = (name: string) => `${id}-${name}`

  return (
    <svg
      data-product
      viewBox="0 0 600 600"
      preserveAspectRatio="xMidYMid meet"
      className={className}
      aria-hidden="true"
      focusable="false"
      style={{ fontFamily: "var(--font-display), ui-rounded, system-ui, sans-serif" }}
    >
      <defs>
        <pattern id={ref("twill")} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
          <rect width="2.2" height="7" fill="#fff" />
        </pattern>
        <linearGradient id={ref("shade")} x1="0" y1="0" x2="1" y2="0.35">
          <stop offset="0" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.2" />
        </linearGradient>
        <pattern id={ref("ticks")} width="10" height="16" patternUnits="userSpaceOnUse">
          <rect width="10" height="16" fill="#f7c02b" />
          <rect x="0" width="1.4" height="7" fill={INK} opacity="0.75" />
          <rect x="5" width="1.2" height="4" fill={INK} opacity="0.55" />
        </pattern>
        <pattern id={ref("ticksV")} width="16" height="10" patternUnits="userSpaceOnUse">
          <rect width="16" height="10" fill="#f7c02b" />
          <rect y="0" width="7" height="1.4" fill={INK} opacity="0.75" />
          <rect y="5" width="4" height="1.2" fill={INK} opacity="0.55" />
        </pattern>
        <radialGradient id={ref("spot")} cx="0.5" cy="0.48" r="0.5">
          <stop offset="0" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Soft spotlight behind the product */}
      <rect {...a("stageTint")} x="20" y="20" width="560" height="560" fill={`url(#${ref("spot")})`} />

      {/* ---------------------------------------------------------- street */}
      {inlineStreet && (
        <g {...a("street")}>
          <StreetLayer id={id} a={a} />
          <g {...a("train")}>
            <TrainCars />
          </g>
        </g>
      )}

      {/* --------------------------------------------------------- product */}
      <g {...a("product")}>
        {/* Box back (behind the garment) */}
        <g {...a("boxBack")}>
          <BoxBackParts />
        </g>

        {/* The scrub top */}
        <g {...a("garment")}>
          <path
            {...a("hanger")}
            fill="none"
            stroke="#8b93a3"
            strokeWidth="5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <path {...a("hook")} fill="none" stroke="#8b93a3" strokeWidth="5" strokeLinecap="round" />
          <path {...a("gInner")} />
          <path {...a("gBody")} />
          <path {...a("gTwill")} fill={`url(#${ref("twill")})`} opacity="0.07" />
          <path {...a("gShade")} fill={`url(#${ref("shade")})`} />
          <path {...a("gSeams")} fill="none" strokeWidth="2" opacity="0.5" />
          <path {...a("gNeck")} fill="none" strokeWidth="7" strokeLinejoin="round" strokeLinecap="round" />
          <rect {...a("gPocket")} rx="4" fill="none" strokeWidth="2.5" opacity="0.7" />
        </g>

        {/* Box front, flaps, tape and the special order tag */}
        <g {...a("boxFront")}>
          <BoxFrontParts a={a} />
        </g>

        {/* Tape measures */}
        <rect {...a("tapeH")} height="16" rx="2" fill={`url(#${ref("ticks")})`} />
        <rect {...a("tapeV")} width="16" rx="2" fill={`url(#${ref("ticksV")})`} />

        {/* Color swatches */}
        <g {...a("swatches")}>
          {SWATCHES.map((s, i) => (
            <text
              key={s.name}
              {...a(`swLabel${i}`)}
              x="300"
              y="506"
              textAnchor="middle"
              fontSize="21"
              fontWeight="800"
              fill={INK}
            >
              {s.name}
            </text>
          ))}
          {SWATCHES.map((s, i) => (
            <g key={s.name} {...a(`sw${i}`)}>
              <circle r="13" fill={s.hex} stroke="#fff" strokeWidth="3" />
            </g>
          ))}
          <g {...a("swRing")}>
            <circle r="19.5" fill="none" stroke={AWNING} strokeWidth="2.5" />
          </g>
        </g>

        {/* Fit tags */}
        {FIT_TAGS.map((tag) => {
          const w = pillWidth(tag.label)
          const x0 = "center" in tag ? -w / 2 : 0
          return (
            <g key={tag.key} {...a(tag.key)}>
              <rect x={x0} y="0" width={w} height="38" rx="19" fill="#fff" stroke="#cfd5e2" strokeWidth="1.5" />
              <text x={x0 + w / 2} y="25.5" textAnchor="middle" fontSize="17.5" fontWeight="800" fill={INK}>
                {tag.label}
              </text>
              <g {...a(`${tag.key}On`)}>
                <rect x={x0} y="0" width={w} height="38" rx="19" fill={AWNING} />
                <text x={x0 + w / 2} y="25.5" textAnchor="middle" fontSize="17.5" fontWeight="800" fill="#fff">
                  {tag.label}
                </text>
              </g>
            </g>
          )
        })}
      </g>
    </svg>
  )
}

/** The back edge of the shipping box, drawn behind the folded top. */
export function BoxBackParts() {
  return <rect x="-104" y="-72" width="208" height="14" rx="3" fill="#a7774a" />
}

/** The box front with flaps, tape, shop sticker and the special order tag. Centered on (0, 0). */
export function BoxFrontParts({ a }: { a: AttrFn }) {
  return (
    <>
      <rect x="-110" y="-60" width="220" height="132" rx="4" fill="#c99561" />
      <rect x="-110" y="-60" width="220" height="10" fill="#b5824f" />
      <g {...a("flapL")}>
        <rect x="-110" y="-68" width="112" height="10" rx="2" fill="#b98652" />
      </g>
      <g {...a("flapR")}>
        <rect x="-2" y="-68" width="112" height="10" rx="2" fill="#b98652" />
      </g>
      <g {...a("boxTape")}>
        <rect x="0" y="0" width="32" height="74" fill="#ead7b0" opacity="0.95" />
      </g>
      {/* Shop label sticker */}
      <g transform="translate(-86 6)">
        <rect width="62" height="40" rx="5" fill={AWNING} />
        <text x="31" y="27" textAnchor="middle" fontSize="19" fontWeight="900" fill="#fff">
          <tspan fill="#f7c02b">F</tspan>
          <tspan fill="#ee5a2f">S</tspan>
        </text>
      </g>
      <g {...a("orderTag")}>
        <path d="M96 -36 L118 22" stroke={INK} strokeWidth="2" fill="none" />
        <circle cx="96" cy="-36" r="4" fill={INK} />
        <g transform="translate(68 20)">
          <rect width="196" height="100" rx="10" fill="#fff" stroke="#e3dcd8" strokeWidth="2" />
          <rect width="196" height="32" rx="10" fill="#f7c02b" />
          <rect y="20" width="196" height="12" fill="#f7c02b" />
          <circle cx="50" cy="0" r="5" fill="#fff" stroke={INK} strokeWidth="2" />
          <text x="14" y="23" fontSize="16" fontWeight="900" fill={INK}>
            Special order
          </text>
          <path
            d="M14 53l4 4 7-8M14 79l4 4 7-8"
            fill="none"
            stroke="#59283f"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text x="32" y="59" fontSize="15.5" fontWeight="800" fill={INK}>
            {business.specialOrders.terms[0]}
          </text>
          <text x="32" y="85" fontSize="15.5" fontWeight="800" fill={INK}>
            {business.specialOrders.terms[1]}
          </text>
        </g>
      </g>
    </>
  )
}

/** The shop front under the elevated 7 line, in the scene's 600 x 600 world units. */
export function StreetLayer({ id, a }: { id: string; a: AttrFn }) {
  const ref = (name: string) => `${id}-${name}`
  return (
    <>
      <defs>
        <linearGradient id={ref("glass")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#75445b" />
          <stop offset="1" stopColor="#432032" />
        </linearGradient>
        <linearGradient id={ref("sky")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#eee5e5" />
          <stop offset="1" stopColor="#f4f1ea" />
        </linearGradient>
      </defs>
      <rect x="-60" y="-60" width="720" height="720" fill={`url(#${ref("sky")})`} />
      {/* Building above the shop */}
      <rect x="44" y="96" width="512" height="450" fill="#e2d8ca" />
      <rect x="44" y="96" width="512" height="450" fill="none" stroke="#d2c6b5" strokeWidth="2" />
      {[92, 204, 316, 428].map((x) => (
        <g key={x}>
          <rect x={x} y="140" width="80" height="62" rx="2" fill="#d6c9cc" />
          <rect x={x} y="140" width="80" height="62" rx="2" fill="none" stroke="#fff" strokeWidth="4" />
          <line x1={x + 40} y1="140" x2={x + 40} y2="202" stroke="#fff" strokeWidth="3" />
        </g>
      ))}

      {/* Awning */}
      <rect x="56" y="210" width="488" height="16" rx="6" fill="#75445b" />
      <rect x="56" y="222" width="488" height="98" fill={AWNING} />
      <text x="300" y="262" textAnchor="middle" fontSize="36" fontWeight="900" fill="#fff" letterSpacing="0.5">
        <tspan fill="#f7c02b">F</tspan>our <tspan fill="#ee5a2f">S</tspan>easons
      </text>
      <text x="300" y="290" textAnchor="middle" fontSize="25" fontWeight="900" fill="#6cc24a">
        Uniform
      </text>
      <rect x="88" y="298" width="424" height="1.6" fill="#fff" opacity="0.85" />
      <text x="300" y="313" textAnchor="middle" fontSize="11" fontWeight="800" fill="#f7c02b" letterSpacing="0.6">
        {business.address.street}.
      </text>

      {/* Storefront */}
      <rect x="56" y="320" width="488" height="224" fill="#27375a" />
      <rect x="70" y="332" width="330" height="200" fill={`url(#${ref("glass")})`} />
      <rect x="120" y="338" width="60" height="5" rx="2" fill="#fff4cf" opacity="0.9" />
      <rect x="270" y="338" width="60" height="5" rx="2" fill="#fff4cf" opacity="0.9" />
      {WINDOW_TOPS.map((m) => (
        <g key={m.x} transform={`translate(${m.x + 44} 452) scale(0.34)`}>
          <rect x="-14" y={mini.top - 40} width="28" height="40" rx="10" fill="#e7e2da" />
          <rect x="-86" y={mini.hemY - 20} width="80" height="190" rx="10" fill={m.hex} />
          <rect x="6" y={mini.hemY - 20} width="80" height="190" rx="10" fill={m.hex} />
          <path d={mini.body} fill={m.hex} />
          <path d={mini.inner} fill="#000" opacity="0.35" />
          <path d={mini.neck} stroke="#000" strokeOpacity="0.25" strokeWidth="8" fill="none" />
        </g>
      ))}
      {/* Neon "Uniforms & Shoes" (from the shop's window sign) */}
      <g transform="translate(236 376)">
        <text
          textAnchor="middle"
          fontSize="19"
          fontWeight="800"
          fontStyle="italic"
          fill="none"
          stroke="#ff7a59"
          strokeWidth="1"
          opacity="0.35"
        >
          Uniforms <tspan stroke="#8fe07a">&amp; Shoes</tspan>
        </text>
        <g {...a("neon")}>
          <text
            textAnchor="middle"
            fontSize="19"
            fontWeight="800"
            fontStyle="italic"
            fill="none"
            stroke="#ff7a59"
            strokeWidth="6"
            opacity="0.28"
          >
            Uniforms <tspan stroke="#8fe07a">&amp; Shoes</tspan>
          </text>
          <text textAnchor="middle" fontSize="19" fontWeight="800" fontStyle="italic" fill="#ffd2c4">
            Uniforms <tspan fill="#d8ffcc">&amp; Shoes</tspan>
          </text>
        </g>
      </g>
      {/* Door */}
      <rect x="412" y="336" width="120" height="196" fill="#392b34" />
      <rect x="420" y="344" width="104" height="188" fill="#715160" opacity="0.85" />
      <rect x="508" y="420" width="5" height="34" rx="2" fill="#d9dee7" />
      <rect x="56" y="532" width="488" height="12" fill="#382b34" />

      {/* Sidewalk */}
      <rect x="-60" y="544" width="720" height="120" fill="#c8ccd3" />
      <polygon points="70,544 400,544 430,600 40,600" fill="#fff3c9" opacity="0.28" />
      <rect x="-60" y="586" width="720" height="4" fill="#adb3bd" />

      {/* The elevated 7 line: deck, lattice girder, columns */}
      <rect x="-60" y="78" width="720" height="4" fill="#59616c" />
      <rect x="-60" y="82" width="720" height="16" fill={STEEL_DARK} />
      <rect x="-60" y="98" width="720" height="26" fill={STEEL} />
      <path
        d={Array.from({ length: 19 }, (_, i) => {
          const x = -60 + i * 40
          return `M${x} 98L${x + 40} 124M${x + 40} 98L${x} 124`
        }).join("")}
        stroke={STEEL_DARK}
        strokeWidth="3"
      />
      <rect x="-60" y="122" width="720" height="5" fill={STEEL_DARK} />
      {[14, 562].map((x) => (
        <g key={x}>
          <rect x={x} y="124" width="24" height="424" fill={STEEL} />
          <rect x={x - 6} y="124" width="36" height="10" fill={STEEL_DARK} />
          <rect x={x - 8} y="534" width="40" height="14" rx="2" fill={STEEL_DARK} />
        </g>
      ))}
    </>
  )
}

/** Two subway cars. Moved along x by the scene. */
export function TrainCars() {
  return (
    <>
      {[0, 262].map((x) => (
        <g key={x} transform={`translate(${x} 30)`}>
          <rect width="252" height="46" rx="9" fill="#d5dae1" stroke="#a9b1bc" strokeWidth="2" />
          <rect x="10" y="9" width="232" height="17" rx="4" fill="#33405c" />
          {[22, 82, 142, 202].map((wx) => (
            <rect key={wx} x={wx} y="11" width="30" height="13" rx="2" fill="#7f93b8" opacity="0.55" />
          ))}
          <rect x="64" y="8" width="14" height="36" rx="2" fill="#bfc6d0" />
          <rect x="174" y="8" width="14" height="36" rx="2" fill="#bfc6d0" />
          <rect x="10" y="32" width="232" height="3" fill="#8e5bbf" opacity="0.75" />
          <rect x="24" y="44" width="34" height="6" rx="2" fill="#3c4250" />
          <rect x="194" y="44" width="34" height="6" rx="2" fill="#3c4250" />
        </g>
      ))}
    </>
  )
}

/** Exported for the swatch math to stay in one place. */
export { SWATCH_X, SWATCH_Y }
