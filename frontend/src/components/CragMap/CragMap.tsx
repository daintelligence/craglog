'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Mountain, X, ChevronRight, MapPin } from 'lucide-react';
import Link from 'next/link';
import type { Crag } from '@/types';
import { cn } from '@/lib/utils';
import { formatDistance } from '@/lib/utils';

interface Props {
  crags: Crag[];
  userLat?: number | null;
  userLng?: number | null;
  selectedCragId?: string | null;
  onCragClick?: (crag: Crag) => void;
  height?: string;
}

// ─── Simple grid-based clustering ────────────────────────────────────────────

interface Cluster {
  lat: number;
  lng: number;
  crags: Crag[];
}

function clusterCrags(crags: Crag[], zoom: number): Cluster[] {
  const gridSize = zoom >= 10 ? 0 : zoom >= 8 ? 0.5 : zoom >= 6 ? 1.5 : 3;

  // Parse coordinates — TypeORM returns decimal columns as strings
  const valid = crags
    .map((c) => ({ ...c, latitude: Number(c.latitude), longitude: Number(c.longitude) }))
    .filter((c) => isFinite(c.latitude) && isFinite(c.longitude));

  if (gridSize === 0) {
    return valid.map((c) => ({ lat: c.latitude, lng: c.longitude, crags: [c] }));
  }

  const grid = new Map<string, Cluster>();
  valid.forEach((c) => {
    const key = `${Math.round(c.latitude / gridSize)},${Math.round(c.longitude / gridSize)}`;
    if (!grid.has(key)) {
      grid.set(key, { lat: c.latitude, lng: c.longitude, crags: [] });
    }
    const cluster = grid.get(key)!;
    cluster.crags.push(c);
    cluster.lat = cluster.crags.reduce((s, x) => s + Number(x.latitude), 0) / cluster.crags.length;
    cluster.lng = cluster.crags.reduce((s, x) => s + Number(x.longitude), 0) / cluster.crags.length;
  });
  return Array.from(grid.values());
}

// ─── Crag detail panel ────────────────────────────────────────────────────────

function CragDetailPanel({ crag, onClose }: { crag: Crag; onClose: () => void }) {
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
              {crag.region?.name && (
                <span className="text-xs text-stone-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />{crag.region.name}
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
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-stone-100 dark:bg-stone-800 shrink-0"
          >
            <X className="w-4 h-4 text-stone-500" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <Link
            href={`/log?cragId=${crag.id}`}
            className="btn-primary py-3 text-sm"
          >
            Log here
          </Link>
          <Link
            href={`/crags/${crag.id}`}
            className="btn-secondary py-3 text-sm flex items-center justify-center gap-1.5"
          >
            View crag <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Cluster panel (when cluster is clicked) ──────────────────────────────────

function ClusterPanel({ cluster, onCragPick, onClose }: { cluster: Cluster; onCragPick: (c: Crag) => void; onClose: () => void }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-[1000] animate-slide-up">
      <div className="bg-white dark:bg-stone-900 rounded-t-3xl p-5 shadow-2xl border-t border-stone-100 dark:border-stone-800 max-w-2xl mx-auto max-h-[60vh] flex flex-col">
        <div className="w-10 h-1 bg-stone-200 dark:bg-stone-700 rounded-full mx-auto mb-3" />
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-stone-900 dark:text-stone-50">{cluster.crags.length} crags here</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl bg-stone-100 dark:bg-stone-800">
            <X className="w-4 h-4 text-stone-500" />
          </button>
        </div>
        <div className="overflow-y-auto space-y-2">
          {cluster.crags.map((c) => (
            <button
              key={c.id}
              onClick={() => onCragPick(c)}
              className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-stone-50 dark:hover:bg-stone-800 text-left transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-rock-100 dark:bg-rock-900/30 flex items-center justify-center shrink-0">
                <Mountain className="w-4 h-4 text-rock-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-stone-900 dark:text-stone-50 truncate">{c.name}</p>
                <p className="text-xs text-stone-400 capitalize">{c.rockType}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-300 shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CragMap({
  crags,
  userLat,
  userLng,
  selectedCragId,
  onCragClick,
  height = '100%',
}: Props) {
  const containerRef     = useRef<HTMLDivElement>(null);
  const mapRef           = useRef<any>(null);
  const markersRef       = useRef<any[]>([]);
  const userMarkerRef    = useRef<any>(null);
  const cragsRef         = useRef<Crag[]>(crags);
  const renderMarkersRef = useRef<(() => void) | null>(null);
  const [panel, setPanel] = useState<{ type: 'crag'; crag: Crag } | { type: 'cluster'; cluster: Cluster } | null>(null);

  const handleCragClick = useCallback((crag: Crag) => {
    setPanel({ type: 'crag', crag });
    onCragClick?.(crag);
  }, [onCragClick]);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    const init = async () => {
      const L = (await import('leaflet')).default;
      // @ts-ignore — no type declarations for CSS module
      await import('leaflet/dist/leaflet.css');

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      if (mapRef.current) return;

      const firstLat = Number(crags[0]?.latitude);
      const firstLng = Number(crags[0]?.longitude);
      const centre: [number, number] = userLat && userLng
        ? [userLat, userLng]
        : isFinite(firstLat) && isFinite(firstLng)
          ? [firstLat, firstLng]
          : [54.0, -2.1]; // Centre of England/Wales

      const map = L.map(containerRef.current!, {
        center: centre,
        zoom: userLat ? 11 : 7,
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
        // Clear existing
        markersRef.current.forEach(({ layer }) => map.removeLayer(layer));
        markersRef.current = [];

        const zoom = map.getZoom();
        const clusters = clusterCrags(cragsRef.current, zoom);

        clusters.forEach((cluster) => {
          const isCluster = cluster.crags.length > 1;

          const markerHtml = isCluster
            ? `<div style="
                width:36px;height:36px;background:#6d5035;border-radius:50%;
                border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.35);
                display:flex;align-items:center;justify-content:center;
                color:white;font-size:12px;font-weight:700;
              ">${cluster.crags.length}</div>`
            : `<div style="
                width:24px;height:24px;background:#856440;
                border-radius:50% 50% 50% 0;transform:rotate(-45deg);
                border:2.5px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);
              "></div>`;

          const icon = L.divIcon({
            className: '',
            html: markerHtml,
            iconSize: isCluster ? [36, 36] : [24, 24],
            iconAnchor: isCluster ? [18, 18] : [12, 24],
          });

          const marker = L.marker([cluster.lat, cluster.lng], { icon }).addTo(map);

          if (!isCluster) {
            marker.bindTooltip(cluster.crags[0].name, { permanent: false, direction: 'top', offset: [0, -26] });
          }

          marker.on('click', () => {
            if (isCluster) {
              setPanel({ type: 'cluster', cluster });
            } else {
              handleCragClick(cluster.crags[0]);
            }
          });

          markersRef.current.push({ id: cluster.crags.map((c) => c.id).join(','), layer: marker });
        });
      };

      renderMarkersRef.current = renderMarkers;
      renderMarkers();
      map.on('zoomend', renderMarkers);

      // User location
      if (userLat && userLng) {
        const userIcon = L.divIcon({
          className: '',
          html: `<div style="width:14px;height:14px;background:#3b82f6;border-radius:50%;border:2.5px solid white;box-shadow:0 0 0 4px rgba(59,130,246,0.25)"></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });
        userMarkerRef.current = L.marker([userLat, userLng], { icon: userIcon })
          .addTo(map)
          .bindTooltip('You are here', { permanent: false, direction: 'top' });
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

  // Re-render markers whenever crags prop changes
  useEffect(() => {
    cragsRef.current = crags;
    renderMarkersRef.current?.();
  }, [crags]);

  // Pan to selected crag
  useEffect(() => {
    if (!mapRef.current || !selectedCragId) return;
    const crag = crags.find((c) => c.id === selectedCragId);
    const lat = Number(crag?.latitude);
    const lng = Number(crag?.longitude);
    if (isFinite(lat) && isFinite(lng)) {
      mapRef.current.panTo([lat, lng], { animate: true });
    }
  }, [selectedCragId, crags]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-stone-100 dark:border-stone-800" style={{ height }}>
      <div ref={containerRef} className="w-full h-full" />

      {panel?.type === 'crag' && (
        <CragDetailPanel crag={panel.crag} onClose={() => setPanel(null)} />
      )}
      {panel?.type === 'cluster' && (
        <ClusterPanel
          cluster={panel.cluster}
          onCragPick={(crag) => setPanel({ type: 'crag', crag })}
          onClose={() => setPanel(null)}
        />
      )}
    </div>
  );
}
