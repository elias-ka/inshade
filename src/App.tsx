import { Button, Card, Stack, Typography } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import './App.css';
import SearchField from './components/SearchField';
import TimezoneSelect from './components/TimezoneSelect';
import usePlaceSearch from './data/usePlaceSearch';
import useRoute from './data/useRoute';
import { Place } from './models/Address';
import { SunExposureResult, sunExposureWorker } from './worker';
import dayjs from 'dayjs';
import MapWrapper from './components/MapWrapper';
import { SunExposureDisplay } from './components/SunExposureDisplay';

function App() {
    const [origin, setOrigin] = useState<Place | null>(null);
    const [destination, setDestination] = useState<Place | null>(null);
    const routes = useRoute(origin, destination);

    const [originQuery, setOriginQuery] = useState('');
    const [destinationQuery, setDestinationQuery] = useState('');

    const originPlaces = usePlaceSearch(originQuery);
    const destinationPlaces = usePlaceSearch(destinationQuery);

    const [selectedTz, setSelectedTz] = useState(() => dayjs.tz.guess());
    const [selectedDate, setSelectedDate] = useState(() => dayjs().tz(selectedTz, true));

    const [workerResult, setWorkerResult] = useState<SunExposureResult | null>(null);

    const postMessage = () => {
        if (!routes.data || !selectedDate || !selectedTz) return;
        sunExposureWorker.postMessage([
            selectedDate.tz(selectedTz, true).toDate(),
            routes.data.flatMap((route) => route.geometry.coordinates),
            routes.data.reduce((acc, route) => acc + route.duration, 0),
        ]);
    };

    useEffect(() => {
        sunExposureWorker.onmessage = (event) => {
            setWorkerResult(event.data as SunExposureResult);
        };
    });

    useEffect(() => {
        setWorkerResult(null);
    }, [origin, destination, selectedDate, selectedTz]);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div>
                <Card
                    style={{
                        position: 'absolute',
                        zIndex: 1000,
                        top: 0,
                        left: 0,
                        padding: '0.75em',
                    }}
                >
                    <Typography variant="h5">
                        <strong>Inshade</strong>
                    </Typography>
                    <Stack
                        direction="column"
                        spacing={1.5}
                        style={{
                            width: '25em',
                        }}
                    >
                        <Typography>
                            Find the ideal bus seating side to reduce sun exposure during your
                            travel
                        </Typography>
                        <SearchField
                            label="Enter origin"
                            loading={originPlaces.isPending}
                            options={originPlaces.data}
                            onInput={setOriginQuery}
                            onChange={setOrigin}
                        />
                        <SearchField
                            label="Enter destination"
                            loading={destinationPlaces.isPending}
                            options={destinationPlaces.data}
                            onInput={setDestinationQuery}
                            onChange={setDestination}
                        />
                        <DateTimePicker
                            label="Date and time of departure"
                            value={selectedDate}
                            onChange={(date) => {
                                if (date) setSelectedDate(date);
                            }}
                            slotProps={{ textField: { size: 'small' } }}
                            timezone={selectedTz}
                        />
                        <TimezoneSelect
                            label="Timezone of departure"
                            onChange={(_, tz) => setSelectedTz(tz.value)}
                            value={selectedTz}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={!origin || !destination || routes.isPending}
                            onClick={() => {
                                postMessage();
                            }}
                        >
                            Submit
                        </Button>
                        {workerResult ? <SunExposureDisplay result={workerResult} /> : null}
                    </Stack>
                </Card>
                <MapWrapper
                    origin={origin}
                    destination={destination}
                    routes={routes}
                    workerResult={workerResult}
                />
            </div>
        </LocalizationProvider>
    );
}

export default App;
