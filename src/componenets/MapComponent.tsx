import { Feature, Geometry, GeoJsonProperties } from "geojson";
import { relative } from "path";
import React, { useState } from "react";
import Map, { Marker, Source, Layer } from "react-map-gl";
import { MapMouseEvent } from "react-map-gl/dist/esm/types";

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
    longitude: 76.47546738176874,
    latitude: 20.583044348815818,
    zoom: 14,
  });
  const [marker, setMarker] = useState<MarkerType[]>([]);
  const [isPlacingMarker, setIsPlacingMarker] = useState(false);
  const handleMarkerClick = (e: any) => {
    if (!isPlacingMarker) return;
    setMarker((marker) => [
      ...marker,
      {
        latitude: e.lngLat.lat,
        longitude: e.lngLat.lng,
      },
    ]);
  };
  return (
    <div style={{ position: "relative" }}>
      <button
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          zIndex: 1,
          fontSize: "18px",
          padding: "10px 20px",
          borderRadius: "8px",
        }}
        onClick={() => {
          console.log(isPlacingMarker);
          setIsPlacingMarker(!isPlacingMarker);
        }}
      >
        Marker {isPlacingMarker ? "on" : "off"}
      </button>
      <Map
        {...viewPort}
        style={{ width: "100vw", height: "100vh" }}
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        onMove={(e) => {
          setViewPort(e.viewState);
        }}
        onClick={handleMarkerClick}
      >
        {marker[0] &&
          marker.map((coordinate, index) => {
            return (
              <Marker
                key={`marker_${index + 1}`}
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
            layout={{
              "line-cap": "round",
              "line-join": "round",
            }}
            paint={{
              "line-color": "#ff0000",
              "line-width": 4,
              "line-dasharray": [1, 2],
            }}
          />
        </Source>
      </Map>
    </div>
  );
};

export default MapComponent;
