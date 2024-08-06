"use client";

import { useCountires } from '@/lib/getCountries';
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import { icon } from "leaflet";
import "leaflet/dist/leaflet.css";


const ICON = icon({
  iconUrl:
    "https://images.vexels.com/media/users/3/131261/isolated/preview/b2e48580147ca0ed3f970f30bf8bb009-karten-standortmarkierung.png",
  iconSize: [50, 50],
});


export default function Map({ locationValue }: { locationValue: string }) {
  const { getCountryByValue } = useCountires();
  const latLang = getCountryByValue(locationValue)?.latLang;

  return (
    <MapContainer
      scrollWheelZoom={false}
      className="h-[50vh] rounded-lg relative z-0"
      center={latLang ?? [52.505, -0.09]}
      zoom={8}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={latLang ?? [52.505, -0.09]} icon={ICON} />
    </MapContainer>
  );

}