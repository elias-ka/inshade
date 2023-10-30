import { Button, Card, Stack } from '@mui/material';
import { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import './App.css';
import { search } from './api';
import { MapRoute } from './components/MapRoute';
import { SearchField } from './components/SearchField';
import { Address } from './models/Address';

function App() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<Address[]>([]);
    const [loading, setLoading] = useState(false);
    const [origin, setOrigin] = useState<Address | null>(null);
    const [destination, setDestination] = useState<Address | null>(null);

    useEffect(() => {
        setSearchTerm('');
        setSearchResults([]);
    }, [origin, destination]);

    useEffect(() => {
        (async () => {
            if (!searchTerm) return;
            setLoading(true);
            const results = await search(searchTerm);
            setLoading(false);
            setSearchResults(results);
        })();
    }, [searchTerm]);

    const getLatLng = (address: Address | null) => {
        return address && new LatLng(parseFloat(address.lat), parseFloat(address.lon));
    };

    return (
        <div>
            <Card
                style={{
                    position: 'absolute',
                    zIndex: 1000,
                    top: 0,
                    left: 0,
                    padding: '1em',
                }}
            >
                <Stack direction="column" spacing={2} style={{ width: '25em' }}>
                    <SearchField
                        label={'Choose starting point'}
                        loading={loading}
                        value={origin}
                        options={searchResults}
                        onInput={setSearchTerm}
                        onChange={setOrigin}
                    />
                    <SearchField
                        label={'Choose destination'}
                        loading={loading}
                        value={destination}
                        options={searchResults}
                        onInput={setSearchTerm}
                        onChange={setDestination}
                    />
                    <Button variant="contained" color="primary" disabled={!origin || !destination}>
                        Submit
                    </Button>
                </Stack>
            </Card>
            <MapContainer
                center={[50, 0]}
                zoom={4}
                scrollWheelZoom={true}
                style={{
                    height: '100vh',
                    width: '100%',
                }}
                zoomAnimation={true}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                <MapRoute
                    origin={getLatLng(origin)}
                    destination={getLatLng(destination)}
                    originTooltip={origin?.displayName}
                    destinationTooltip={destination?.displayName}
                />
            </MapContainer>
        </div>
    );
}

export default App;
