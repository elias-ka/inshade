import { Button, Card, Stack } from '@mui/material';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import './App.css';
import { Journey } from './components/Journey';
import { SearchField } from './components/SearchField';
import { usePlaceSearch } from './data/usePlaceSearch';
import { useRoute } from './data/useRoute';
import { Place } from './models/Address';

function App() {
    const [origin, setOrigin] = useState<Place | null>(null);
    const [destination, setDestination] = useState<Place | null>(null);
    const routes = useRoute(origin, destination);

    const [originQuery, setOriginQuery] = useState('');
    const [destinationQuery, setDestinationQuery] = useState('');

    const originPlaces = usePlaceSearch(originQuery);
    const destinationPlaces = usePlaceSearch(destinationQuery);

    useEffect(() => {
        setOriginQuery('');
        setDestinationQuery('');
    }, [origin, destination]);

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
                        loading={originPlaces.isPending}
                        value={origin}
                        options={originPlaces.data}
                        onInput={setOriginQuery}
                        onChange={setOrigin}
                    />
                    <SearchField
                        label={'Choose destination'}
                        loading={destinationPlaces.isPending}
                        value={destination}
                        options={destinationPlaces.data}
                        onInput={setDestinationQuery}
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
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Journey origin={origin} destination={destination} routes={routes.data} />
            </MapContainer>
        </div>
    );
}

export default App;
