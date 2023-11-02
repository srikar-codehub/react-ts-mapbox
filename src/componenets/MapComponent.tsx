import { Feature, Geometry, GeoJsonProperties } from "geojson";

import React, { useState } from "react";
import Map, { Marker, Source, Layer } from "react-map-gl";

type LineType = {
  latitude: number;
  longitude: number;
};

type GeoJsonPointFeature = {
  type: "Feature";
  properties: object;
  geometry: {
    coordinates: [number, number];
    type: "Point";
  };
};
type GeoJsonLineFeature = {
  type: "Feature";
  properties: object;
  geometry: {
    coordinates: [[number, number], [number, number]];
    type: "LineString";
  };
};

const geoJsonLine: Feature<Geometry> = {
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
  const [geoJsonPointData, setGeoJsonPointData] = useState<
    GeoJsonPointFeature[]
  >([]);
  const [line, setLine] = useState<LineType[]>([]);
  const [isPlacingMarker, setIsPlacingMarker] = useState(false);
  const [isDrawingLine, setIsDrawingLine] = useState(false);

  const handleMapClick = (e: any) => {
    if (!isPlacingMarker && !isDrawingLine) return;
    const latitude = e.lngLat.lat;
    const longitude = e.lngLat.lng;
    if (isPlacingMarker) {
      setGeoJsonPointData((geoJsonPointData) => [
        ...geoJsonPointData,
        {
          type: "Feature",
          properties: {},
          geometry: {
            coordinates: [latitude, longitude],
            type: "Point",
          },
        },
      ]);
    }
    if (isDrawingLine) {
      console.log(e.lngLat);
    }
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
          if (isDrawingLine) {
            setIsDrawingLine(!isDrawingLine);
          }
          setIsPlacingMarker(!isPlacingMarker);
        }}
      >
        Marker {isPlacingMarker ? "on" : "off"}
      </button>
      <button
        style={{
          position: "absolute",
          top: "70px",
          left: "10px",
          zIndex: 1,
          fontSize: "18px",
          padding: "10px 20px",
          borderRadius: "8px",
        }}
        onClick={() => {
          if (isPlacingMarker) {
            setIsPlacingMarker(!isPlacingMarker);
          }

          setIsDrawingLine(!isDrawingLine);
        }}
      >
        Line {isDrawingLine ? "on" : "off"}
      </button>
      <Map
        {...viewPort}
        style={{ width: "100vw", height: "100vh" }}
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        onMove={(e) => {
          setViewPort(e.viewState);
        }}
        onClick={handleMapClick}
      >
        {geoJsonPointData[0] &&
          geoJsonPointData.map((element, index) => {
            return (
              <Marker
                key={`marker_${index + 1}`}
                latitude={element.geometry.coordinates[0]}
                longitude={element.geometry.coordinates[1]}
                color="red"
              ></Marker>
            );
          })}
        <Source type="geojson" data={geoJsonLine}>
          <Layer
            id="line-layer"
            type="line"
            layout={{
              "line-cap": "round",
              "line-join": "round",
            }}
            paint={{
              "line-color": "#ff0000",
              "line-width": 2,
              "line-dasharray": [1, 2],
            }}
          />
        </Source>
      </Map>
    </div>
  );
};

export default MapComponent;
