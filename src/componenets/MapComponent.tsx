// import { Feature, Geometry, GeoJsonProperties } from "geojson";

import React, { useState } from "react";
import Map, { Marker, Source, Layer } from "react-map-gl";

//Point///////////////////////
type GeoJsonPointFeature = {
  type: "Feature";
  properties: object;
  geometry: {
    coordinates: [number, number];
    type: "Point";
  };
};
///line//////////////////
type GeoJsonLineFeature = {
  type: "Feature";
  properties: object;
  geometry: {
    coordinates: [[number, number], [number, number]];
    type: "LineString";
  };
};
/////CIRCLE TYPE//////////

type GeoJsonCircleFeature = {
  type: "Feature";
  properties: {
    radius: number;
  };
  geometry: {
    coordinates: [number, number];
    type: "Point";
  };
};

////start component ///////////////////////////////////////
const MapComponent: React.FC = () => {
  const [viewPort, setViewPort] = useState({
    longitude: 76.47546738176874,
    latitude: 20.583044348815818,
    zoom: 14,
  });

  //GEO json value states//////////////////
  const [startEndPoint, setStartEndPoint] = useState<number[][]>([]);
  const [geoJsonPointData, setGeoJsonPointData] = useState<
    GeoJsonPointFeature[]
  >([]);
  const [geoJsonLineData, setGeoJsonLineData] = useState<GeoJsonLineFeature[]>(
    []
  );
  const [geoJsonCircleData, setGeoJsonCircleData] = useState<
    GeoJsonCircleFeature[]
  >([]);

  /////BUTTON STATES//////////////////
  const [isPlacingMarker, setIsPlacingMarker] = useState(false);
  const [isDrawingLine, setIsDrawingLine] = useState(false);
  const [isDrawingCircle, setIsDrawingCircle] = useState(false);

  //HANDLE ALL CLICK EVENTS IN MAP ////////////

  const handleMapClick = (e: any) => {
    if (!isPlacingMarker && !isDrawingLine && !isDrawingCircle) return;

    const latitude = e.lngLat.lat;
    const longitude = e.lngLat.lng;

    /////point event//////////
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
    ///////line event/////////////////
    if (isDrawingLine) {
      if (startEndPoint.length !== 2) {
        startEndPoint.push(Object.values(e.lngLat));
      }

      if (startEndPoint.length === 2) {
        setGeoJsonLineData((geoJsonLineData) => [
          ...geoJsonLineData,
          {
            type: "Feature",
            properties: {},
            geometry: {
              coordinates: [
                [startEndPoint[0][0], startEndPoint[0][1]],
                [startEndPoint[1][0], startEndPoint[1][1]],
              ],
              type: "LineString",
            },
          },
        ]);

        setStartEndPoint([]);
      }
    }
    //////CIRCLE EVENT /////////////////////
    if (isDrawingCircle) {
      if (startEndPoint.length !== 2) {
        startEndPoint.push(Object.values(e.lngLat));
      }

      if (startEndPoint.length === 2) {
        const radius = Math.sqrt(
          Math.pow(startEndPoint[1][0] - startEndPoint[0][0], 2) +
            Math.pow(startEndPoint[1][1] - startEndPoint[0][1], 2)
        );
        setGeoJsonCircleData((geoJsonCircleData) => [
          ...geoJsonCircleData,
          {
            type: "Feature",
            properties: {
              radius: radius,
            },
            geometry: {
              coordinates: [startEndPoint[0][0], startEndPoint[0][1]],
              type: "Point",
            },
          },
        ]);

        setStartEndPoint([]);
      }
    }
  };
  return (
    <div style={{ position: "relative" }}>
      {/* point Button.......................... */}
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
          if (isDrawingCircle) {
            setIsDrawingCircle(!isDrawingCircle);
          }
          setIsPlacingMarker(!isPlacingMarker);
        }}
      >
        Marker {isPlacingMarker ? "on" : "off"}
      </button>
      {/* LINE BUTTON......................... */}
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
          if (isDrawingCircle) {
            setIsDrawingCircle(!isDrawingCircle);
          }
          setStartEndPoint([]);

          setIsDrawingLine(!isDrawingLine);
        }}
      >
        Line {isDrawingLine ? "on" : "off"}
      </button>
      {/* CIRCLE BUTTON......................... */}
      <button
        style={{
          position: "absolute",
          top: "140px",
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
          if (isDrawingLine) {
            setIsDrawingLine(!isDrawingLine);
          }
          setStartEndPoint([]);
          setIsDrawingCircle(!isDrawingCircle);
        }}
      >
        Circle {isDrawingCircle ? "on" : "off"}
      </button>
      {/* clear geojson button.......................... */}
      <button
        style={{
          position: "absolute",
          top: "210px",
          left: "10px",
          zIndex: 1,
          fontSize: "18px",
          padding: "10px 20px",
          borderRadius: "8px",
        }}
        onClick={() => {
          setGeoJsonPointData([]);
          setGeoJsonLineData([]);
          setGeoJsonCircleData([]);
        }}
        disabled={geoJsonLineData || geoJsonPointData ? false : true}
      >
        Clear geoJson
      </button>
      {/* Map intialize.................................... */}
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
        {/* POINT geojson on map render .................................*/}
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
        {/* LINE geojson on map render .................................*/}
        {geoJsonLineData[0] &&
          geoJsonLineData.map((element, index) => {
            return (
              <Source key={index} type="geojson" data={element}>
                <Layer
                  key={index}
                  id={`line-layer-${index}`}
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
            );
          })}
        {/* CIRCLE GEOJSON ON MAP RENDER.................. */}
        {geoJsonCircleData[0] &&
          geoJsonCircleData.map((element, index) => {
            console.log(element);
            return (
              <Source key={index} type="geojson" data={element}>
                <Layer
                  key={index}
                  id={`circle-layer-${index}`}
                  type="circle"
                  paint={{
                    "circle-color": "#ff0000",
                    "circle-radius": element.properties.radius,
                  }}
                />
              </Source>
            );
          })}
      </Map>
    </div>
  );
};

export default MapComponent;
