import { LatLng, latLngBounds } from 'leaflet';
import { useEffect } from 'react';
import { Marker, Tooltip, useMap } from 'react-leaflet';

interface MapRouteProps {
    origin: LatLng | null;
    destination: LatLng | null;
    originTooltip: string | undefined;
    destinationTooltip: string | undefined;
}

export function MapRoute({
    origin,
    destination,
    originTooltip,
    destinationTooltip,
}: MapRouteProps) {
    const map = useMap();

    useEffect(() => {
        const bounds = [];
        if (origin) bounds.push(origin);
        if (destination) bounds.push(destination);

        if (bounds.length > 0) {
            map.fitBounds(latLngBounds(bounds));
        }
    }, [origin, destination]);

    return (
        <>
            {origin && (
                <Marker position={origin}>
                    <Tooltip>{originTooltip}</Tooltip>
                </Marker>
            )}
            {destination && (
                <Marker position={destination}>
                    <Tooltip>{destinationTooltip}</Tooltip>
                </Marker>
            )}
        </>
    );
}
