import { latLng, latLngBounds } from 'leaflet';
import { useEffect } from 'react';
import { Marker, Polyline, Tooltip, useMap } from 'react-leaflet';
import { Place } from '../models/Address';
import { Route } from '../models/Route';

interface JourneyProps {
    origin: Place | null;
    destination: Place | null;
    routes: Route[] | undefined | null;
}

export function Journey({ origin, destination, routes }: JourneyProps) {
    const map = useMap();

    const getLatLng = (address: Place) => {
        return latLng(parseFloat(address.lat), parseFloat(address.lon));
    };
    useEffect(() => {
        const bounds = [];
        if (origin) bounds.push(getLatLng(origin));
        if (destination) bounds.push(getLatLng(destination));

        if (bounds.length > 0 && !routes) {
            map.fitBounds(latLngBounds(bounds), { padding: [50, 50] });
        }
    }, [origin, destination, routes, map]);

    return (
        <>
            {origin ? (
                <Marker position={getLatLng(origin)}>
                    <Tooltip>{origin.displayName}</Tooltip>
                </Marker>
            ) : null}
            {destination ? (
                <Marker position={getLatLng(destination)}>
                    <Tooltip>{destination.displayName}</Tooltip>
                </Marker>
            ) : null}
            {routes ? (
                <Polyline
                    positions={routes.map((route) =>
                        route.geometry.coordinates.map((c) => latLng(c[1], c[0]))
                    )}
                    weight={8}
                />
            ) : null}
        </>
    );
}
