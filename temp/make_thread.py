#!/usr/bin/env python3
"""Generate AnantaSutra's 'infinite thread' (woven ∞) as brand SVG vector art."""
import math

W, H = 1600, 900
CX, CY = W / 2, H / 2
A = 520            # lobe half-width
N = 520            # samples along the curve
STRANDS = 11       # parallel threads
SPACING = 6.0      # px between strands

def gerono(t):
    # figure-eight (∞): x = a cos t, y = 0.5 a sin 2t
    x = A * math.cos(t)
    y = 0.5 * A * math.sin(2 * t)
    return x, y

def deriv(t):
    dx = -A * math.sin(t)
    dy = A * math.cos(2 * t)
    return dx, dy

def strand_path(offset):
    pts = []
    for i in range(N + 1):
        t = 2 * math.pi * i / N
        x, y = gerono(t)
        dx, dy = deriv(t)
        L = math.hypot(dx, dy) or 1e-6
        nx, ny = -dy / L, dx / L          # unit normal
        px = CX + x + nx * offset
        py = CY + y + ny * offset
        pts.append((px, py))
    d = "M " + " L ".join(f"{x:.2f} {y:.2f}" for x, y in pts) + " Z"
    return d

offsets = [(i - (STRANDS - 1) / 2) * SPACING for i in range(STRANDS)]
strands = "\n".join(
    f'    <path d="{strand_path(o)}" fill="none" stroke="url(#gold)" '
    f'stroke-width="1.7" stroke-opacity="{0.55 + 0.4*(1-abs(o)/(SPACING*(STRANDS-1)/2)):.2f}"/>'
    for o in offsets
)

# Diamond/star nodes: two loop centers + crossing center
def diamond(cx, cy, r, color, op=1.0):
    pts = f"{cx},{cy-r} {cx+r*0.62},{cy} {cx},{cy+r} {cx-r*0.62},{cy}"
    return f'<polygon points="{pts}" fill="{color}" fill-opacity="{op}"/>'

node_x = 0.66 * A
nodes = "\n".join([
    diamond(CX - node_x, CY, 16, "#F0C040"),
    diamond(CX,          CY, 13, "#F0C040"),
    diamond(CX + node_x, CY, 16, "#F0C040"),
    diamond(CX - node_x, CY, 7, "#FFFFFF", 0.9),
    diamond(CX,          CY, 6, "#FFFFFF", 0.9),
    diamond(CX + node_x, CY, 7, "#FFFFFF", 0.9),
])

# faint sacred-geometry rings behind
rings = "\n".join(
    f'    <circle cx="{CX}" cy="{CY}" r="{r}" fill="none" stroke="#E8A317" '
    f'stroke-width="1" stroke-opacity="0.05"/>'
    for r in (300, 380, 460)
)

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}">
  <defs>
    <radialGradient id="bgglow" cx="50%" cy="50%" r="55%">
      <stop offset="0%" stop-color="#E8A317" stop-opacity="0.16"/>
      <stop offset="45%" stop-color="#6A3DE8" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="#0A0A0F" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="gold" gradientUnits="userSpaceOnUse" x1="{CX-A}" y1="{CY}" x2="{CX+A}" y2="{CY}">
      <stop offset="0%" stop-color="#C8861A"/>
      <stop offset="25%" stop-color="#E8A317"/>
      <stop offset="50%" stop-color="#F0C040"/>
      <stop offset="75%" stop-color="#E8A317"/>
      <stop offset="100%" stop-color="#C8861A"/>
    </linearGradient>
    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="7" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="nodeglow" x="-120%" y="-120%" width="340%" height="340%">
      <feGaussianBlur stdDeviation="5"/>
    </filter>
  </defs>

  <rect width="{W}" height="{H}" fill="#0A0A0F"/>
  <rect width="{W}" height="{H}" fill="url(#bgglow)"/>
{rings}

  <!-- soft halo behind the threads -->
  <g filter="url(#glow)" opacity="0.5">
{strands}
  </g>
  <!-- crisp threads -->
  <g>
{strands}
  </g>

  <!-- glowing node halos -->
  <g filter="url(#nodeglow)" opacity="0.9">
    {diamond(CX-node_x, CY, 22, "#F0C040", 0.7)}
    {diamond(CX,        CY, 18, "#F0C040", 0.7)}
    {diamond(CX+node_x, CY, 22, "#F0C040", 0.7)}
  </g>
  <g>
{nodes}
  </g>
</svg>'''

with open("infinite-thread.svg", "w", encoding="utf-8") as f:
    f.write(svg)
print("wrote infinite-thread.svg", len(svg), "bytes")
