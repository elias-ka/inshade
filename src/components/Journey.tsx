import L from 'leaflet';
import { useEffect, useMemo } from 'react';
import { Marker, Polyline, Tooltip, useMap } from 'react-leaflet';
import { Place } from '../models/Address';
import { Route } from '../models/Route';
import { groupConsecutiveDuplicates } from '../util';
import { BlueIcon, RedIcon } from './MapIcons';

interface JourneyProps {
    origin: Place | null;
    destination: Place | null;
    route?: Route;
    segments?: number[];
}

const segmentToColor = new Map([
    [-1, '#FFA500'],
    [0, 'gray'],
    [1, '#4A90E2'],
]);

export default function Journey({ origin, destination, route, segments }: JourneyProps) {
    const map = useMap();

    const polylines = useMemo(() => {
        if (!route || !segments) return [];

        let currentIndex = 1;

        return groupConsecutiveDuplicates(segments).flatMap((group) => {
            const start = currentIndex - 1;
            const end = currentIndex + group.length + 1;
            const positions = route.geometry.coordinates
                .slice(start, end)
                .map(([lng, lat]) => L.latLng(lat, lng));

            currentIndex = end;

            return (
                <Polyline
                    key={currentIndex}
                    positions={positions}
                    color={segmentToColor.get(group[0])}
                    weight={5}
                    interactive={false}
                />
            );
        });
    }, [route, segments]);

    const getLatLng = (place: Place) => {
        const { lat, lon } = place;
        return L.latLng(lat, lon);
    };

    useEffect(() => {
        const bounds = [];
        if (origin) bounds.push(getLatLng(origin));
        if (destination) bounds.push(getLatLng(destination));

        if (bounds.length === 1) {
            map.setView(bounds[0], 8);
        } else if (bounds.length > 0) {
            map.fitBounds(L.latLngBounds(bounds), { padding: [50, 50], maxZoom: 10 });
        }
    }, [origin, destination, route, map]);

    return (
        <>
            {origin ? (
                <Marker position={getLatLng(origin)} icon={BlueIcon}>
                    <Tooltip>{origin.displayName}</Tooltip>
                </Marker>
            ) : null}
            {destination ? (
                <Marker position={getLatLng(destination)} icon={RedIcon}>
                    <Tooltip>{destination.displayName}</Tooltip>
                </Marker>
            ) : null}
            {polylines.length > 0 ? polylines : null}
        </>
    );
}
