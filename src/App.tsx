import { Button, Card, Stack, Typography } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import 'leaflet/dist/leaflet.css';
import { useMemo, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import './App.css';
import Journey from './components/Journey';
import SearchField from './components/SearchField';
import TimezoneSelect from './components/TimezoneSelect';
import usePlaceSearch from './data/usePlaceSearch';
import useRoute from './data/useRoute';
import { Place } from './models/Address';

dayjs.extend(utc);
dayjs.extend(timezone);

function App() {
    const [origin, setOrigin] = useState<Place | null>(null);
    const [destination, setDestination] = useState<Place | null>(null);
    const routes = useRoute(origin, destination);

    const [originQuery, setOriginQuery] = useState('');
    const [destinationQuery, setDestinationQuery] = useState('');

    const originPlaces = usePlaceSearch(originQuery);
    const destinationPlaces = usePlaceSearch(destinationQuery);

    const [selectedDate, setSelectedDate] = useState(() => dayjs());
    const [selectedTz, setSelectedTz] = useState(() => dayjs.tz.guess());

    const worker = useMemo(() => {
        return new Worker(new URL('./worker.ts', import.meta.url));
    }, []);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                    <Typography variant="h4">
                        <strong>Inshade</strong>
                    </Typography>
                    <Stack direction="column" spacing={2} style={{ width: '25em' }}>
                        <Typography>
                            Find the ideal bus seating side to reduce sun exposure during your
                            travel
                        </Typography>
                        <SearchField
                            label="Choose starting point"
                            loading={originPlaces.isPending}
                            options={originPlaces.data}
                            onInput={setOriginQuery}
                            onChange={setOrigin}
                        />
                        <SearchField
                            label="Choose destination"
                            loading={destinationPlaces.isPending}
                            options={destinationPlaces.data}
                            onInput={setDestinationQuery}
                            onChange={setDestination}
                        />
                        <DateTimePicker
                            label="Date and time"
                            reduceAnimations
                            value={selectedDate}
                            onChange={(date) => {
                                if (date) setSelectedDate(date);
                            }}
                            slotProps={{ textField: { size: 'small' } }}
                        />
                        <TimezoneSelect onChange={setSelectedTz} value={selectedTz} />
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={!origin || !destination}
                        >
                            Submit
                        </Button>
                    </Stack>
                </Card>
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
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Journey origin={origin} destination={destination} routes={routes.data} />
                </MapContainer>
            </div>
        </LocalizationProvider>
    );
}

export default App;
