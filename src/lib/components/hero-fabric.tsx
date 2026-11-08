"use client"

import { useEffect, useRef, useState } from "react"

// A tessellated garment, deformed and lit on the GPU. No 3D runtime or assets.
const vertexSource = `
attribute vec2 aPosition;
uniform float uTime;
uniform float uAspect;
uniform vec2 uPointer;
varying vec2 vUv;
varying float vLight;
void main() {
  vec2 p = aPosition;
  vUv = p;
  float phase = p.x * 5.5 + p.y * 2.4 + uTime * .65;
  float fold = sin(phase) * .055 + sin(p.x * 13.0 - p.y * 3.0 + uTime * .4) * .018;
  float z = fold + .09 * cos(p.y * 2.0);
  float yaw = -.23 + uPointer.x * .22 + sin(uTime * .22) * .055;
  float tilt = -.09 + uPointer.y * .06;
  vec3 pos = vec3(p.x * cos(yaw) + z * sin(yaw), p.y, -p.x * sin(yaw) + z * cos(yaw));
  pos.xy = mat2(cos(tilt), -sin(tilt), sin(tilt), cos(tilt)) * pos.xy;
  float perspective = 2.8 / (2.8 - pos.z);
  pos.xy *= perspective * .87;
  pos.y += sin(uTime * .55) * .014;
  gl_Position = vec4(pos.x / uAspect, pos.y, 0.0, 1.0);
  float slope = cos(phase) * .3 + cos(p.x * 13.0 - p.y * 3.0 + uTime * .4) * .23;
  vLight = .84 + slope * .55 + p.y * .1;
}`

const fragmentSource = `
precision mediump float;
varying vec2 vUv;
varying float vLight;
float segment(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p-a, ba = b-a;
  return length(pa-ba*clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0));
}
void main() {
  vec2 p = vUv;
  // Silhouette: straight body, sloped shoulders, short sleeves and a V neck.
  float halfWidth = .5;
  if (p.y > .12) halfWidth = .94;
  if (p.y > .44) halfWidth = mix(.94, .29, clamp((p.y-.44)/.42,0.0,1.0));
  if (abs(p.x) > halfWidth || p.y < -.88 || p.y > .86) discard;
  if (p.y > .47 + abs(p.x) * 1.45 && abs(p.x) < .27) discard;
  if (p.y < .33 && p.y > .12 && abs(p.x) > .5 + (p.y-.12)*1.7) discard;
  vec3 base = vec3(.40,.16,.27);
  float weave = sin(p.x*1100.0)*sin(p.y*1100.0)*.013;
  vec3 color = base * vLight + weave;
  // Sewn neckline, hem and pocket, all moving with the fabric.
  float neck = min(segment(p,vec2(-.27,.86),vec2(0.,.47)),segment(p,vec2(0.,.47),vec2(.27,.86)));
  float hem = abs(p.y+.81);
  vec2 q = abs(p-vec2(.25,.09))-vec2(.135,.16);
  float pocket = abs(max(q.x,q.y));
  float stitch = max(1.0-smoothstep(.003,.008,neck),1.0-smoothstep(.002,.005,pocket));
  stitch = max(stitch,(1.0-smoothstep(.002,.005,hem))*.5);
  color = mix(color, vec3(.70,.42,.52), stitch*.55);
  float inner = 1.0-smoothstep(.005,.02,abs(p.y-.25));
  color -= inner * step(.12,p.x) * step(p.x,.38) * .045;
  gl_FragColor = vec4(color,1.0);
}`

export default function HeroFabric() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)
  const [paused, setPaused] = useState(false)
  const pausedRef = useRef(false)

  useEffect(() => {
    pausedRef.current = paused
  }, [paused])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext("webgl", { alpha: true, antialias: true, powerPreference: "low-power" })
    if (!gl) return
    const shaders: WebGLShader[] = []
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)
      if (!shader) return null
      shaders.push(shader)
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null
    }
    const vertex = compile(gl.VERTEX_SHADER, vertexSource)
    const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource)
    const program = gl.createProgram()
    const buffer = gl.createBuffer()
    const dispose = () => {
      shaders.forEach((shader) => gl.deleteShader(shader))
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
    }
    if (!vertex || !fragment || !program || !buffer) {
      dispose()
      return
    }
    gl.attachShader(program, vertex)
    gl.attachShader(program, fragment)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      dispose()
      return
    }
    gl.useProgram(program)
    const points: number[] = []
    const columns = 100,
      rows = 110
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        const x0 = (x / columns) * 2 - 1,
          x1 = ((x + 1) / columns) * 2 - 1
        const y0 = (y / rows) * 1.8 - 0.9,
          y1 = ((y + 1) / rows) * 1.8 - 0.9
        points.push(x0, y0, x1, y0, x0, y1, x0, y1, x1, y0, x1, y1)
      }
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW)
    const position = gl.getAttribLocation(program, "aPosition")
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
    const time = gl.getUniformLocation(program, "uTime")
    const aspect = gl.getUniformLocation(program, "uAspect")
    const pointer = gl.getUniformLocation(program, "uPointer")
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const target = { x: 0, y: 0 },
      current = { x: 0, y: 0 }
    let frame = 0,
      visible = true,
      elapsed = 0,
      previous = 0,
      lastDraw = 0
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio || 1, 1.75)
      canvas.width = Math.round(rect.width * ratio)
      canvas.height = Math.round(rect.height * ratio)
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform1f(aspect, canvas.width / canvas.height)
    }
    const draw = (now: number) => {
      frame = 0
      const delta = previous ? Math.min(now - previous, 64) : 0
      previous = now
      if (!motion.matches && !pausedRef.current) elapsed += delta / 1000
      if (now - lastDraw > 30 || !lastDraw) {
        current.x += (target.x - current.x) * 0.07
        current.y += (target.y - current.y) * 0.07
        gl.uniform1f(time, elapsed)
        gl.uniform2f(
          pointer,
          motion.matches || pausedRef.current ? 0 : current.x,
          motion.matches || pausedRef.current ? 0 : current.y,
        )
        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.drawArrays(gl.TRIANGLES, 0, points.length / 2)
        lastDraw = now
      }
      if (visible && !document.hidden && !motion.matches && !pausedRef.current) frame = requestAnimationFrame(draw)
    }
    const start = () => {
      if (!frame && visible && !document.hidden) {
        previous = 0
        lastDraw = 0
        frame = requestAnimationFrame(draw)
      }
    }
    const move = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      target.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2
      target.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2
    }
    const leave = () => {
      target.x = 0
      target.y = 0
    }
    const contextLost = (event: Event) => {
      event.preventDefault()
      cancelAnimationFrame(frame)
      frame = 0
      setReady(false)
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
      else {
        cancelAnimationFrame(frame)
        frame = 0
      }
    })
    const sizing = new ResizeObserver(() => {
      resize()
      start()
    })
    observer.observe(canvas)
    sizing.observe(canvas)
    canvas.addEventListener("pointermove", move)
    canvas.addEventListener("pointerleave", leave)
    canvas.addEventListener("webglcontextlost", contextLost)
    document.addEventListener("visibilitychange", start)
    motion.addEventListener("change", start)
    canvas.addEventListener("animationtoggle", start)
    resize()
    start()
    setReady(true)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      sizing.disconnect()
      canvas.removeEventListener("pointermove", move)
      canvas.removeEventListener("pointerleave", leave)
      canvas.removeEventListener("webglcontextlost", contextLost)
      canvas.removeEventListener("animationtoggle", start)
      document.removeEventListener("visibilitychange", start)
      motion.removeEventListener("change", start)
      dispose()
    }
  }, [])

  return (
    <div className="fabric-scene">
      <div className="fabric-orbit" aria-hidden="true" />
      <span className="fabric-note fabric-note-top">Made for your every day.</span>
      <div className="fabric-canvas-wrap">
        {!ready && (
          <svg className="fabric-fallback" viewBox="0 0 400 440" aria-hidden="true">
            <path d="m146 55-74 45-42 83 64 31 24-38v218h164V176l24 38 64-31-42-83-74-45-54 65Z" fill="#663146" />
            <path d="m146 55 54 65 54-65M221 190h45v55h-45zM125 380h150" fill="none" stroke="#a47786" strokeWidth="2" />
          </svg>
        )}
        <canvas ref={canvasRef} className={ready ? "is-ready" : ""} aria-hidden="true" />
      </div>
      <div className="fabric-floor" aria-hidden="true" />
      <div className="fabric-tag">
        <span className="fabric-tag-dot" />A better fit for a busy day.
      </div>
      <span className="fabric-note fabric-note-bottom">Good people. Great uniforms.</span>
      {ready && (
        <button
          className="fabric-pause"
          type="button"
          aria-pressed={paused}
          onClick={() => {
            pausedRef.current = !paused
            setPaused(!paused)
            canvasRef.current?.dispatchEvent(new Event("animationtoggle"))
          }}
        >
          {paused ? "Play animation" : "Pause animation"}
        </button>
      )}
    </div>
  )
}
