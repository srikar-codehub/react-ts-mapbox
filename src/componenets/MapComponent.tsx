import { Feature, Geometry, GeoJsonProperties } from "geojson";
import React, { useState } from "react";
import Map, { Marker, Source, Layer } from "react-map-gl";

type MarkerType = {
  latitude: number;
  longitude: number;
};
const geojsonData: Feature<Geometry> = {
  type: "Feature",
  properties: {},
  geometry: {
    type: "LineString",
    coordinates: [
      [76.47546738176874, 20.583044348815818],
      [76.48756089289668, 20.520763374514644],
    ],
  },
};

const MapComponent: React.FC = () => {
  const [viewPort, setViewPort] = useState({
    longitude: 79.05268345247566,
    latitude: 21.153949800121893,
    zoom: 14,
  });
  const [marker, setMarker] = useState<MarkerType[]>([]);
  return (
    <Map
      {...viewPort}
      style={{ width: "100vw", height: "100vh" }}
      mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      onMove={(e) => setViewPort(e.viewState)}
      onClick={(e) => {
        console.log(marker);
        {
          setMarker((marker) => [
            ...marker,
            {
              latitude: e.lngLat.lat,
              longitude: e.lngLat.lng,
            },
          ]);
        }
      }}
    >
      {marker[0] &&
        marker.map((coordinate) => {
          return (
            <Marker
              latitude={coordinate.latitude}
              longitude={coordinate.longitude}
              color="red"
            ></Marker>
          );
        })}
      <Source type="geojson" data={geojsonData}>
        <Layer
          id="line-layer"
          type="line"
          paint={{
            "line-color": "blue",
            "line-width": 2,
          }}
        />
      </Source>
    </Map>
  );
};

export default MapComponent;
