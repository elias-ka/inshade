import { MapContainer, TileLayer } from 'react-leaflet';
import Journey from './Journey';
import useRoute from '../data/useRoute';
import { SunExposureResult } from '../worker';
import { Place } from '../models/Address';

interface MapWrapperProps {
    origin: Place | null;
    destination: Place | null;
    routes: ReturnType<typeof useRoute>;
    workerResult: SunExposureResult | null;
}

export default function MapWrapper({ origin, destination, routes, workerResult }: MapWrapperProps) {
    return (
        <MapContainer
            center={[50, 0]}
            zoom={4}
            scrollWheelZoom
            style={{
                height: '100vh',
                width: '100%',
            }}
            zoomAnimation
            zoomControl={false}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                keepBuffer={16}
                crossOrigin
                updateWhenIdle={false}
                updateWhenZooming={false}
            />
            <Journey
                origin={origin}
                destination={destination}
                route={routes.data?.[0]}
                segments={workerResult?.segments}
            />
        </MapContainer>
    );
}
