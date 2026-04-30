'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Mountain, X, ChevronRight, MapPin } from 'lucide-react';
import Link from 'next/link';
import type { Crag } from '@/types';
import { formatDistance } from '@/lib/utils';

export interface MapPin {
  id: string;
  name: string;
  latitude?: number | string | null;
  longitude?: number | string | null;
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
          <Link href={`/log?cragId=${crag.id}`} className="btn-primary py-3 text-sm text-center">Log here</Link>
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
  const containerRef      = useRef<HTMLDivElement>(null);
  const mapRef            = useRef<any>(null);
  const leafletRef        = useRef<any>(null);
  const clusterGroupRef   = useRef<any>(null);
  const pinsRef           = useRef<MapPin[]>([]);
  const onCragClickRef    = useRef(onCragClick);
  onCragClickRef.current  = onCragClick;

  const [panel, setPanel] = useState<{ crag: MapPin } | null>(null);

  const handleCragClick = useCallback((crag: MapPin) => {
    setPanel({ crag });
    onCragClickRef.current?.(crag as unknown as Crag);
  }, []);

  // Rebuild all markers in the cluster group from pinsRef
  const rebuildMarkers = useCallback(() => {
    const L = leafletRef.current;
    const clusterGroup = clusterGroupRef.current;
    if (!L || !clusterGroup) return;

    clusterGroup.clearLayers();

    pinsRef.current.forEach((pin) => {
      const lat = Number(pin.latitude);
      const lng = Number(pin.longitude);
      if (!isFinite(lat) || !isFinite(lng)) return;

      const icon = L.divIcon({
        className: '',
        html: `<div style="
          width:20px;height:20px;
          background:#9c6b40;
          border-radius:50%;
          border:2.5px solid rgba(255,255,255,0.9);
          box-shadow:0 2px 8px rgba(0,0,0,0.35);
          cursor:pointer;
        "></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      const marker = L.marker([lat, lng], { icon });
      marker.bindTooltip(pin.name, { permanent: false, direction: 'top', offset: [0, -12] });
      marker.on('click', () => handleCragClick(pin));
      clusterGroup.addLayer(marker);
    });
  }, [handleCragClick]);

  // Initialize map once on mount
  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;
    let destroyed = false;

    const init = async () => {
      const L = (await import('leaflet')).default;
      // @ts-ignore
      await import('leaflet/dist/leaflet.css');
      // @ts-ignore
      await import('leaflet.markercluster');
      // @ts-ignore
      await import('leaflet.markercluster/dist/MarkerCluster.css');
      // @ts-ignore
      await import('leaflet.markercluster/dist/MarkerCluster.Default.css');

      if (destroyed || mapRef.current) return;

      const centre: [number, number] = userLat && userLng ? [userLat, userLng] : [54.5, -2.5];

      const map = L.map(containerRef.current!, {
        center: centre,
        zoom: userLat ? 11 : 6,
        zoomControl: true,
        attributionControl: true,
        tap: false,
      } as any);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const clusterGroup = (L as any).markerClusterGroup({
        chunkedLoading: true,
        maxClusterRadius: 50,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        iconCreateFunction: (cluster: any) => {
          const count = cluster.getChildCount();
          const size = count >= 100 ? 48 : count >= 50 ? 42 : count >= 20 ? 36 : count >= 8 ? 30 : 24;
          const bg   = count >= 50 ? '#4a2e14' : count >= 20 ? '#6b3e1e' : count >= 8 ? '#8c5530' : '#a66c42';
          const fs   = count >= 100 ? 11 : count >= 10 ? 13 : 13;
          return L.divIcon({
            html: `<div style="
              width:${size}px;height:${size}px;
              background:${bg};
              border-radius:50%;
              border:3px solid rgba(255,255,255,0.9);
              box-shadow:0 3px 10px rgba(0,0,0,0.4),0 0 0 2px ${bg}55;
              display:flex;align-items:center;justify-content:center;
              color:white;font-size:${fs}px;font-weight:700;letter-spacing:-0.5px;
              cursor:pointer;
            ">${count}</div>`,
            className: '',
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2],
          });
        },
      });

      map.addLayer(clusterGroup);
      mapRef.current      = map;
      leafletRef.current  = L;
      clusterGroupRef.current = clusterGroup;

      // Render whatever pins were loaded by the time leaflet finished
      rebuildMarkers();

      if (userLat && userLng) {
        const userIcon = L.divIcon({
          className: '',
          html: `<div style="width:14px;height:14px;background:#3b82f6;border-radius:50%;border:2.5px solid white;box-shadow:0 0 0 5px rgba(59,130,246,0.2)"></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });
        L.marker([userLat, userLng], { icon: userIcon })
          .addTo(map)
          .bindTooltip('You', { permanent: false, direction: 'top' });
      }
    };

    init();

    return () => {
      destroyed = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current    = null;
        clusterGroupRef.current = null;
        leafletRef.current = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-render markers whenever pins change
  useEffect(() => {
    pinsRef.current = allCrags ?? crags;
    rebuildMarkers();
  }, [crags, allCrags, rebuildMarkers]);

  // Pan/zoom to selected crag
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
