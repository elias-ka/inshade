import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import './App.css';
import 'leaflet/dist/leaflet.css';

const SEARCH_URL = 'https://nominatim.openstreetmap.org/search.php';
const REVERSE_GEOCODE_URL = 'https://nominatim.openstreetmap.org/reverse.php';

function App() {
  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={13}
      scrollWheelZoom={true}
      style={styles.mapContainer}
      zoomAnimation={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
}
const styles = {
  mapContainer: {
    height: '100vh',
    width: '100vw',
  },
};

export default App;
