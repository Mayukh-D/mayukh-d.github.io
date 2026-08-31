#!/usr/bin/env python3
"""Vector plan-view schematic of a Rafale EH, in the portfolio's palette.

Pure SVG + CSS: no canvas, no JS, no external assets. Geometry is authored in
metres against the real airframe (15.27 m long, 10.90 m span) and mirrored
about the centreline, so the proportions are honest rather than eyeballed.
"""

import math

CYAN   = "#00e5ff"
GREEN  = "#00ff41"
MUTED  = "#7d8f85"
DIM    = "#1d4a2f"

W, H = 1000, 600
CX, CY = 468.0, 258.0
S = 42.0                    # pixels per metre

MONO = "ui-monospace,'JetBrains Mono','SF Mono',Menlo,Consolas,monospace"


def P(x, y):
    """Aircraft metres (nose +x, starboard +y) to SVG units."""
    return (CX + x * S, CY + y * S)


def path(pts, close=True):
    d = ""
    for i, (x, y) in enumerate(pts):
        px, py = P(x, y)
        d += ("M" if i == 0 else "L") + f"{px:.1f} {py:.1f}"
    return d + ("Z" if close else "")


def mirror(pts):
    return [(x, -y) for x, y in pts]


# ---------------------------------------------------------------- geometry
# Fuselage half-outline, nose to tail down the starboard side. The bulge at
# x~3 is the side intake, which on a Rafale has no splitter plate.
FUSELAGE = [
    (7.62, 0.00), (7.32, 0.12), (6.60, 0.26), (5.60, 0.40), (4.60, 0.54),
    (3.85, 0.60), (3.34, 0.70), (3.20, 1.22), (2.55, 1.32), (1.30, 1.28),
    (0.55, 1.02), (-0.60, 0.95), (-2.40, 0.95), (-4.20, 0.97), (-5.60, 1.02),
    (-6.90, 1.04), (-7.45, 0.94), (-7.72, 0.54), (-7.78, 0.00),
]

# Compound delta, ~48 deg leading-edge sweep
WING = [(2.30, 1.00), (-3.30, 5.45), (-4.55, 5.45), (-5.45, 1.30)]

# Close-coupled all-moving canard, high on the intake shoulder
CANARD = [(4.30, 0.62), (2.85, 3.05), (2.20, 2.88), (2.72, 0.72)]

# Single centreline fin, edge-on from above
FIN = [(-2.05, 0.13), (-4.90, 0.10), (-6.45, 0.07), (-6.45, -0.07),
       (-4.90, -0.10), (-2.05, -0.13)]

CANOPY = [(5.05, 0.00), (4.30, 0.40), (3.40, 0.52), (2.60, 0.44), (2.20, 0.00)]


def wing_panels():
    """Panel lines and the elevon hinge, following the real control layout."""
    out = []
    # elevon hinge line, inboard to outboard along the trailing edge
    out.append(([(-5.05, 1.34), (-4.28, 5.45)], 0.55))
    # elevon splits: inboard and outboard surfaces
    for t in (0.34, 0.67):
        xa = -5.05 + (-4.28 + 5.05) * t
        ya = 1.34 + (5.45 - 1.34) * t
        xb = -5.45 + (-4.55 + 5.45) * t
        yb = 1.30 + (5.45 - 1.30) * t
        out.append(([(xa, ya), (xb, yb)], 0.4))
    # spanwise structural lines
    for t in (0.3, 0.58, 0.82):
        xle = 2.30 + (-3.30 - 2.30) * t
        yle = 1.00 + (5.45 - 1.00) * t
        xte = -5.45 + (-4.55 + 5.45) * t
        yte = 1.30 + (5.45 - 1.30) * t
        out.append(([(xle, yle), (xte, yte)], 0.22))
    return out


def stores():
    """Wingtip MICA rails, underwing pylons, inboard tanks."""
    out = []
    # wingtip missile: extends forward of the tip leading edge
    out.append(("missile", 5.45, -2.20, -4.90, 0.15))
    # underwing pylon stations
    out.append(("missile", 3.60, -1.15, -4.45, 0.18))
    out.append(("tank",    2.00,  0.35, -4.70, 0.32))
    return out


def build():
    o = []
    css = []

    o.append(f'<rect width="{W}" height="{H}" fill="#010203"/>')

    # ---- air and cloud lines, streaming aft ----
    css.append("@keyframes drift{from{transform:translateX(0)}"
               f"to{{transform:translateX(-{W + 420}px)}}}}")
    o.append('<g class="air">')
    rnd = 12345
    for i in range(34):
        rnd = (rnd * 1103515245 + 12345) & 0x7FFFFFFF
        y = (rnd % 10000) / 10000.0 * H
        rnd = (rnd * 1103515245 + 12345) & 0x7FFFFFFF
        ln = 40 + (rnd % 260)
        rnd = (rnd * 1103515245 + 12345) & 0x7FFFFFFF
        dur = 5.5 + (rnd % 900) / 100.0
        rnd = (rnd * 1103515245 + 12345) & 0x7FFFFFFF
        op = 0.05 + (rnd % 16) / 100.0
        delay = -(i * 0.77) % dur
        css.append(f".a{i}{{animation:drift {dur:.2f}s linear infinite;"
                   f"animation-delay:-{delay:.2f}s}}")
        o.append(f'<line class="a{i}" x1="{W + 380}" y1="{y:.1f}" x2="{W + 380 + ln}" '
                 f'y2="{y:.1f}" stroke="{GREEN}" stroke-width="1" '
                 f'opacity="{op:.2f}" stroke-linecap="round"/>')

    # cloud wisps: longer, softer, slower
    for i in range(9):
        rnd = (rnd * 1103515245 + 12345) & 0x7FFFFFFF
        y = 40 + (rnd % (H - 80))
        rnd = (rnd * 1103515245 + 12345) & 0x7FFFFFFF
        sc = 0.7 + (rnd % 90) / 100.0
        dur = 17 + (rnd % 1400) / 100.0
        delay = -(i * 3.3) % dur
        w1, w2, w3 = 120 * sc, 210 * sc, 300 * sc
        d = (f"M0 0c{28*sc:.0f} -{16*sc:.0f} {70*sc:.0f} -{20*sc:.0f} {w1:.0f} -{9*sc:.0f}"
             f"c{34*sc:.0f} -{17*sc:.0f} {86*sc:.0f} -{12*sc:.0f} {w2-w1:.0f} {7*sc:.0f}"
             f"c{40*sc:.0f} {5*sc:.0f} {70*sc:.0f} {9*sc:.0f} {w3-w2:.0f} {4*sc:.0f}")
        css.append(f".c{i}{{animation:drift {dur:.2f}s linear infinite;"
                   f"animation-delay:-{delay:.2f}s}}")
        o.append(f'<path class="c{i}" d="{d}" transform="translate({W + 380} {y})" '
                 f'fill="none" stroke="{GREEN}" stroke-width="1.5" '
                 f'opacity="0.13" stroke-linecap="round"/>')
    o.append("</g>")

    # ---- airframe ----
    o.append('<g class="ac">')
    fill = f'fill="rgba(0,229,255,0.05)"'

    # wing, canard: drawn both sides
    for shape, op in ((WING, 1.0), (CANARD, 1.0)):
        for pts in (shape, mirror(shape)):
            o.append(f'<path d="{path(pts)}" {fill} stroke="{CYAN}" '
                     f'stroke-width="2.2" stroke-linejoin="round"/>')

    # stores: pointed nose, parallel body, tapered tail, plus a pylon stub
    for kind, y, xf, xa, r in stores():
        for sg in (1, -1):
            yy = y * sg
            nose = xf + (0.95 if kind == "missile" else 0.6)
            pts = [(nose, 0.0), (xf, -r), (xa + 0.22, -r), (xa, -r * 0.45),
                   (xa, r * 0.45), (xa + 0.22, r), (xf, r)]
            pts = [(px, py + yy) for px, py in pts]
            o.append(f'<path d="{path(pts)}" fill="rgba(0,229,255,0.07)" '
                     f'stroke="{CYAN}" stroke-width="1.5" opacity="0.85" '
                     f'stroke-linejoin="round"/>')
            if kind != "missile" or abs(y) < 5:
                px1, py1 = P((xf + xa) / 2 + 0.4, yy - (r + 0.30) * (1 if yy > 0 else -1))
                px2, py2 = P((xf + xa) / 2 + 0.4, yy)
                o.append(f'<line x1="{px1:.1f}" y1="{py1:.1f}" x2="{px2:.1f}" '
                         f'y2="{py2:.1f}" stroke="{CYAN}" stroke-width="1" opacity="0.5"/>')

    # fuselage
    body = FUSELAGE + list(reversed(mirror(FUSELAGE)))
    o.append(f'<path d="{path(body)}" fill="#04161c" stroke="{CYAN}" '
             f'stroke-width="2.6" stroke-linejoin="round"/>')

    # wing panel lines
    for pts, op in wing_panels():
        for p2 in (pts, mirror(pts)):
            o.append(f'<path d="{path(p2, close=False)}" fill="none" stroke="{CYAN}" '
                     f'stroke-width="1.3" opacity="{op}"/>')

    # intake mouths
    for sg in (1, -1):
        o.append(f'<path d="{path([(3.05, 0.98 * sg), (3.05, 1.58 * sg), (2.72, 1.66 * sg), (2.80, 1.00 * sg)])}" '
                 f'fill="rgba(0,229,255,0.16)" stroke="{CYAN}" stroke-width="1.5"/>')

    # fin and canopy
    o.append(f'<path d="{path(FIN)}" fill="rgba(0,229,255,0.10)" stroke="{CYAN}" '
             f'stroke-width="1.8"/>')
    cpy = CANOPY + list(reversed(mirror(CANOPY)))
    o.append(f'<path d="{path(cpy)}" fill="rgba(0,229,255,0.20)" stroke="{CYAN}" '
             f'stroke-width="1.8"/>')
    o.append(f'<path d="{path([(4.30, 0.0), (4.30, 0.40)], close=False)}" fill="none" '
             f'stroke="{CYAN}" stroke-width="1.3" opacity="0.6"/>')

    # nozzles
    for sg in (1, -1):
        x1, y1 = P(-6.95, 0.28 * sg)
        x2, y2 = P(-7.80, 1.18 * sg)
        o.append(f'<rect x="{min(x1,x2):.1f}" y="{min(y1,y2):.1f}" '
                 f'width="{abs(x2-x1):.1f}" height="{abs(y2-y1):.1f}" rx="6" '
                 f'fill="rgba(0,229,255,0.14)" stroke="{CYAN}" stroke-width="1.6"/>')

    # pitot boom
    n1, n2 = P(7.62, 0), P(8.55, 0)
    o.append(f'<line x1="{n1[0]:.1f}" y1="{n1[1]:.1f}" x2="{n2[0]:.1f}" y2="{n2[1]:.1f}" '
             f'stroke="{CYAN}" stroke-width="1.9"/>')

    # roundels, drawn as concentric rings so they stay in palette
    for sg in (1, -1):
        rx, ry = P(-2.20, 3.30 * sg)
        for r, op in ((17, 0.75), (11, 0.5), (5, 0.9)):
            o.append(f'<circle cx="{rx:.1f}" cy="{ry:.1f}" r="{r}" fill="none" '
                     f'stroke="{CYAN}" stroke-width="1.6" opacity="{op}"/>')
    o.append("</g>")

    # ---- technical annotation ----
    def label(x, y, t, size=19, col=MUTED, anchor="start", op=0.85):
        return (f'<text x="{x}" y="{y}" font-family="{MONO}" font-size="{size}" '
                f'fill="{col}" opacity="{op}" text-anchor="{anchor}">{t}</text>')

    def leader(x1, y1, x2, y2):
        return (f'<path d="M{x1} {y1}L{x2} {y2}" stroke="{CYAN}" stroke-width="1.1" '
                f'opacity="0.4" fill="none"/>')

    o.append('<g class="ann">')
    # span dimension, left edge
    ytop, ybot = P(0, -5.45)[1], P(0, 5.45)[1]
    xd = 96
    o.append(f'<path d="M{xd} {ytop:.0f}L{xd} {ybot:.0f}" stroke="{CYAN}" '
             f'stroke-width="1.1" opacity="0.45"/>')
    for yy in (ytop, ybot):
        o.append(f'<path d="M{xd-5} {yy:.0f}L{xd+5} {yy:.0f}" stroke="{CYAN}" '
                 f'stroke-width="1.1" opacity="0.45"/>')
    o.append(f'<text x="{xd-9}" y="{(ytop+ybot)/2:.0f}" font-family="{MONO}" '
             f'font-size="18" fill="{MUTED}" text-anchor="middle" opacity="0.85" '
             f'transform="rotate(-90 {xd-9} {(ytop+ybot)/2:.0f})">10.90 m span</text>')

    # title block
    o.append(f'<path d="M60 {H-104}L392 {H-104}" stroke="{CYAN}" stroke-width="1" '
             f'opacity="0.35"/>')
    o.append(label(60, H - 74, "DASSAULT RAFALE EH", 27, CYAN, op=0.95))
    o.append(label(60, H - 48, "No. 17 SQN · GOLDEN ARROWS", 18, MUTED))
    o.append(label(60, H - 24, "defence · geopolitics · airpower", 18, GREEN, op=0.55))
    o.append(label(W - 60, 56, "[ PLAN VIEW ]", 18, MUTED, "end", 0.6))
    o.append("</g>")

    css.append("@media (prefers-reduced-motion: reduce){.air *{animation:none!important}}")

    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" '
            f'preserveAspectRatio="xMidYMid meet" role="img" '
            f'aria-label="Plan-view schematic of a Dassault Rafale EH of No. 17 Squadron, '
            f'Indian Air Force: canard delta, twin engines, 10.90 m span.">'
            f'<style>{"".join(css)}</style>{"".join(o)}</svg>')


if __name__ == "__main__":
    import sys
    open(sys.argv[1], "w").write(build())
    print("wrote", sys.argv[1])
