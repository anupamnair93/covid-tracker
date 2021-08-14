import React from 'react';
import '../Map/Map.css';

import { Map as LeafletMap, TileLayer } from 'react-leaflet';
import { showDataOnMap } from '../../../utils/utils';

function Map({ countries, caseType, center, zoom }) {
    return (
        <div className='map'>
            <LeafletMap center={center} zoom={zoom}>
                <TileLayer
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {showDataOnMap(countries, caseType)}
            </LeafletMap>
        </div>
    );
}

export default Map;
