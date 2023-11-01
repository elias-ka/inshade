import { latLng, latLngBounds } from 'leaflet';
import { useEffect } from 'react';
import { Marker, Polyline, Tooltip, useMap } from 'react-leaflet';
import { Address } from '../models/Address';
import { Route } from '../models/Route';

interface JourneyProps {
    origin: Address | null;
    destination: Address | null;
    routes: Route[] | null;
}

export function Journey({ origin, destination, routes }: JourneyProps) {
    const map = useMap();

    const getLatLng = (address: Address) => {
        return latLng(parseFloat(address.lat), parseFloat(address.lon));
    };

    useEffect(() => {
        const bounds = [];
        if (origin) bounds.push(getLatLng(origin));
        if (destination) bounds.push(getLatLng(destination));

        if (bounds.length > 0 && !routes) {
            map.fitBounds(latLngBounds(bounds), { padding: [50, 50] });
        }
    }, [origin, destination]);

    return (
        <>
            {origin && (
                <Marker position={getLatLng(origin)}>
                    <Tooltip>{origin.displayName}</Tooltip>
                </Marker>
            )}
            {destination && (
                <Marker position={getLatLng(destination)}>
                    <Tooltip>{destination.displayName}</Tooltip>
                </Marker>
            )}
            {routes && (
                <Polyline
                    positions={routes.map((route) =>
                        route.geometry.coordinates.map((c) => latLng(c[1], c[0]))
                    )}
                    weight={8}
                />
            )}
        </>
    );
}
