import { NextRequest, NextResponse } from 'next/server';

// Serves generated mountain icon PNGs for PWA manifest
// /api/icon/192 → 192×192 PNG
// /api/icon/512 → 512×512 PNG

export async function GET(
  _req: NextRequest,
  { params }: { params: { size: string } },
) {
  const size = parseInt(params.size, 10);
  if (![192, 512].includes(size)) {
    return new NextResponse('Not found', { status: 404 });
  }

  // SVG mountain icon matching the CragLog brand (rock-600 = #6d5035)
  const s = size;
  const pad = Math.round(s * 0.1);
  const cx = s / 2;
  const cy = s / 2;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
  <rect width="${s}" height="${s}" rx="${Math.round(s * 0.22)}" fill="#6d5035"/>
  <!-- Mountain silhouette -->
  <polygon
    points="${cx},${pad + Math.round(s * 0.08)} ${s - pad},${s - pad - Math.round(s * 0.12)} ${pad},${s - pad - Math.round(s * 0.12)}"
    fill="white" opacity="0.95"
  />
  <!-- Snow cap -->
  <polygon
    points="${cx},${pad + Math.round(s * 0.08)} ${cx + Math.round(s * 0.12)},${pad + Math.round(s * 0.25)} ${cx - Math.round(s * 0.12)},${pad + Math.round(s * 0.25)}"
    fill="#6d5035"
  />
</svg>`;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
