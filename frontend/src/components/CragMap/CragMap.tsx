'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Mountain, X, ChevronRight, MapPin } from 'lucide-react';
import Link from 'next/link';
import type { Crag } from '@/types';
import { cn } from '@/lib/utils';
import { formatDistance } from '@/lib/utils';

interface MapPin {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  rockType?: string;
  regionName?: string;
  distanceMetres?: number;
  region?: { name: string };
  description?: string;
}

interface Props {
  crags: MapPin[];
  allCrags?: MapPin[];
  userLat?: number | null;
  userLng?: number | null;
  selectedCragId?: string | null;
  onCragClick?: (crag: Crag) => void;
  height?: string;
}

// ─── Grid-based clustering ────────────────────────────────────────────────────

interface Cluster {
  lat: number;
  lng: number;
  crags: MapPin[];
}

function clusterCrags(crags: MapPin[], zoom: number): Cluster[] {
  const gridSize = zoom >= 11 ? 0 : zoom >= 9 ? 0.25 : zoom >= 7 ? 0.8 : zoom >= 5 ? 2 : 4;

  const valid = crags
    .map((c) => ({ ...c, latitude: Number(c.latitude), longitude: Number(c.longitude) }))
    .filter((c) => isFinite(c.latitude) && isFinite(c.longitude));

  if (gridSize === 0) {
    return valid.map((c) => ({ lat: c.latitude, lng: c.longitude, crags: [c] }));
  }

  const grid = new Map<string, Cluster>();
  valid.forEach((c) => {
    const key = `${Math.round(c.latitude / gridSize)},${Math.round(c.longitude / gridSize)}`;
    if (!grid.has(key)) grid.set(key, { lat: c.latitude, lng: c.longitude, crags: [] });
    const cl = grid.get(key)!;
    cl.crags.push(c);
    cl.lat = cl.crags.reduce((s, x) => s + Number(x.latitude), 0) / cl.crags.length;
    cl.lng = cl.crags.reduce((s, x) => s + Number(x.longitude), 0) / cl.crags.length;
  });
  return Array.from(grid.values());
}

function clusterRadius(count: number): number {
  if (count >= 50) return 36;
  if (count >= 20) return 31;
  if (count >= 8)  return 27;
  if (count >= 3)  return 23;
  return 20;
}

function clusterColor(count: number): string {
  if (count >= 50) return '#4a2e14';
  if (count >= 20) return '#6b3e1e';
  if (count >= 8)  return '#8c5530';
  return '#a66c42';
}

// ─── Crag detail bottom sheet ─────────────────────────────────────────────────

function CragDetailPanel({ crag, onClose }: { crag: MapPin; onClose: () => void }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-[1000] animate-slide-up">
      <div className="bg-white dark:bg-stone-900 rounded-t-3xl p-5 shadow-2xl border-t border-stone-100 dark:border-stone-800 max-w-2xl mx-auto">
        <div className="w-10 h-1 bg-stone-200 dark:bg-stone-700 rounded-full mx-auto mb-4" />
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rock-100 dark:bg-rock-900/30 flex items-center justify-center shrink-0">
            <Mountain className="w-5 h-5 text-rock-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-stone-900 dark:text-stone-50 text-base leading-tight">{crag.name}</h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {(crag.regionName || crag.region?.name) && (
                <span className="text-xs text-stone-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />{crag.regionName ?? crag.region?.name}
                </span>
              )}
              {crag.rockType && (
                <span className="text-xs bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 px-2 py-0.5 rounded-lg capitalize">
                  {crag.rockType}
                </span>
              )}
              {crag.distanceMetres != null && (
                <span className="text-xs text-summit-600 dark:text-summit-400 font-medium">
                  {formatDistance(crag.distanceMetres)}
                </span>
              )}
            </div>
            {crag.description && (
              <p className="text-sm text-stone-500 dark:text-stone-400 mt-2 line-clamp-2 leading-relaxed">
                {crag.description}
              </p>
            )}
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl bg-stone-100 dark:bg-stone-800 shrink-0">
            <X className="w-4 h-4 text-stone-500" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <Link href={`/log?cragId=${crag.id}`} className="btn-primary py-3 text-sm">Log here</Link>
          <Link href={`/crags/${crag.id}`} className="btn-secondary py-3 text-sm flex items-center justify-center gap-1.5">
            View crag <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CragMap({ crags, allCrags, userLat, userLng, selectedCragId, onCragClick, height = '100%' }: Props) {
  const containerRef     = useRef<HTMLDivElement>(null);
  const mapRef           = useRef<any>(null);
  const leafletRef       = useRef<any>(null);
  const markersRef       = useRef<any[]>([]);
  const userMarkerRef    = useRef<any>(null);
  const pinsRef          = useRef<MapPin[]>([]);
  const renderMarkersRef = useRef<(() => void) | null>(null);
  const [panel, setPanel] = useState<{ crag: MapPin } | null>(null);

  const handleCragClick = useCallback((crag: MapPin) => {
    setPanel({ crag });
    onCragClick?.(crag as unknown as Crag);
  }, [onCragClick]);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    const init = async () => {
      const L = (await import('leaflet')).default;
      // @ts-ignore
      await import('leaflet/dist/leaflet.css');
      leafletRef.current = L;

      if (mapRef.current) return;

      const sourcePins = allCrags ?? crags;
      pinsRef.current = sourcePins;

      const firstLat = Number(sourcePins[0]?.latitude);
      const firstLng = Number(sourcePins[0]?.longitude);
      const centre: [number, number] = userLat && userLng
        ? [userLat, userLng]
        : isFinite(firstLat) && isFinite(firstLng) ? [firstLat, firstLng] : [54.5, -2.5];

      const map = L.map(containerRef.current!, {
        center: centre,
        zoom: userLat ? 11 : 6,
        zoomControl: true,
        attributionControl: true,
        tap: false,
      } as any);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      mapRef.current = map;

      const renderMarkers = () => {
        markersRef.current.forEach(({ layer }) => map.removeLayer(layer));
        markersRef.current = [];

        const zoom = map.getZoom();
        const clusters = clusterCrags(pinsRef.current, zoom);

        clusters.forEach((cluster) => {
          const isCluster = cluster.crags.length > 1;
          const r = isCluster ? clusterRadius(cluster.crags.length) : 16;
          const bg = isCluster ? clusterColor(cluster.crags.length) : '#9c6b40';
          const size = r * 2;

          const html = isCluster
            ? `<div style="
                width:${size}px;height:${size}px;
                background:${bg};
                border-radius:50%;
                border:3px solid rgba(255,255,255,0.9);
                box-shadow:0 3px 10px rgba(0,0,0,0.4),0 0 0 2px ${bg}55;
                display:flex;align-items:center;justify-content:center;
                color:white;font-size:${cluster.crags.length >= 100 ? 11 : 13}px;font-weight:700;
                letter-spacing:-0.5px;
                cursor:pointer;
              ">${cluster.crags.length}</div>`
            : `<div style="
                width:${size}px;height:${size}px;
                background:${bg};
                border-radius:50%;
                border:2.5px solid rgba(255,255,255,0.9);
                box-shadow:0 2px 8px rgba(0,0,0,0.35);
                cursor:pointer;
              "></div>`;

          const icon = L.divIcon({
            className: '',
            html,
            iconSize: [size, size],
            iconAnchor: [r, r],
          });

          const marker = L.marker([cluster.lat, cluster.lng], { icon }).addTo(map);

          if (!isCluster) {
            marker.bindTooltip(cluster.crags[0].name, { permanent: false, direction: 'top', offset: [0, -(r + 4)] });
          }

          marker.on('click', () => {
            if (isCluster) {
              // Zoom into the cluster's bounding box
              const bounds = L.latLngBounds(
                cluster.crags.map((c) => L.latLng(Number(c.latitude), Number(c.longitude))),
              );
              map.fitBounds(bounds, { padding: [60, 60], maxZoom: 13, animate: true });
            } else {
              handleCragClick(cluster.crags[0]);
            }
          });

          markersRef.current.push({ layer: marker });
        });
      };

      renderMarkersRef.current = renderMarkers;
      renderMarkers();
      map.on('zoomend', renderMarkers);

      if (userLat && userLng) {
        const userIcon = L.divIcon({
          className: '',
          html: `<div style="width:14px;height:14px;background:#3b82f6;border-radius:50%;border:2.5px solid white;box-shadow:0 0 0 5px rgba(59,130,246,0.2)"></div>`,
          iconSize: [14, 14], iconAnchor: [7, 7],
        });
        userMarkerRef.current = L.marker([userLat, userLng], { icon: userIcon })
          .addTo(map)
          .bindTooltip('You', { permanent: false, direction: 'top' });
      }
    };

    init();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current = [];
      }
    };
  }, []);

  // Re-render when allCrags or crags change
  useEffect(() => {
    pinsRef.current = allCrags ?? crags;
    renderMarkersRef.current?.();
  }, [crags, allCrags]);

  // Pan to selected crag
  useEffect(() => {
    if (!mapRef.current || !selectedCragId) return;
    const pin = pinsRef.current.find((c) => c.id === selectedCragId);
    const lat = Number(pin?.latitude);
    const lng = Number(pin?.longitude);
    if (isFinite(lat) && isFinite(lng)) {
      mapRef.current.setView([lat, lng], Math.max(mapRef.current.getZoom(), 13), { animate: true });
    }
  }, [selectedCragId]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-stone-100 dark:border-stone-800" style={{ height }}>
      <div ref={containerRef} className="w-full h-full" />
      {panel && (
        <CragDetailPanel crag={panel.crag} onClose={() => setPanel(null)} />
      )}
    </div>
  );
}
