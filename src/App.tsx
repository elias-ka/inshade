import { Button, Paper, Stack } from '@mui/material';
import 'leaflet/dist/leaflet.css';
import { uniqueId } from 'lodash';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import './App.css';
import { search } from './api';
import { SearchField } from './components/SearchField';
import { AddressFeature, AddressFeatureCollection } from './models/Address';

function App() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<AddressFeatureCollection>();
    const [loading, setLoading] = useState(false);
    const [startingAddress, setStartingAddress] = useState<AddressFeature | null>(null);
    const [destinationAddress, setDestinationAddress] = useState<AddressFeature | null>(null);

    useEffect(() => {
        setSearchTerm('');
        setSearchResults(undefined);
    }, [startingAddress, destinationAddress]);

    useEffect(() => {
        (async () => {
            if (!searchTerm) return;
            setLoading(true);
            const results = await search(searchTerm);
            setLoading(false);
            setSearchResults(results);
        })();
    }, [searchTerm]);

    return (
        <div>
            <Paper
                style={{
                    position: 'absolute',
                    zIndex: 999,
                    top: 0,
                    left: 0,
                    padding: '1em',
                }}
            >
                <Stack direction="column" spacing={2} style={{ width: '25em' }}>
                    <SearchField
                        label={'Origin'}
                        loading={loading}
                        value={startingAddress}
                        options={searchResults?.features}
                        onInput={setSearchTerm}
                        onChange={setStartingAddress}
                    />
                    <SearchField
                        label={'Destination'}
                        loading={loading}
                        value={destinationAddress}
                        options={searchResults?.features}
                        onInput={setSearchTerm}
                        onChange={setDestinationAddress}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={!startingAddress || !destinationAddress}
                    >
                        Submit
                    </Button>
                </Stack>
            </Paper>
            <datalist id="search-results">
                {searchResults?.features.map((address) => (
                    <option key={uniqueId()} value={address.properties.displayName} />
                ))}
            </datalist>
            <MapContainer
                center={[50, 0]}
                zoom={4}
                scrollWheelZoom={true}
                style={styles.mapContainer}
                zoomAnimation={true}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
            </MapContainer>
        </div>
    );
}

const styles = {
    mapContainer: {
        height: '100vh',
        width: '100%',
    },
};

export default App;
