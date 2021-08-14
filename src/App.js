import React, { useState, useEffect } from 'react';
import './App.css';

import {
    MenuItem,
    FormControl,
    Select,
    Card,
    CardContent,
} from '@material-ui/core';

import InfoBox from './components/InfoBox/InfoBox';
import Map from './components/common/Map/Map';
import Table from './components/common/Table/Table';
import LineGraph from './components/common/LineGraph/LineGraph';

import 'leaflet/dist/leaflet.css';

import { prettyPrintStat, sortData } from './utils/utils';

function App() {
    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState('worldwide');
    const [countryInfo, setCountryInfo] = useState({});
    const [tableData, setTableData] = useState([]);
    const [mapCenter, setMapCenter] = useState({
        lat: 34.80746,
        lng: -40.4796,
    });
    const [mapZoom, setMapZoom] = useState(3);
    const [mapCountries, setMapCountries] = useState([]);
    const [caseType, setCaseType] = useState('cases');

    useEffect(() => {
        fetch('https://disease.sh/v3/covid-19/all')
            .then((response) => response.json())
            .then((data) => {
                setCountryInfo(data);
            });
    }, []);

    useEffect(() => {
        const getCountriesData = async () => {
            fetch('https://disease.sh/v3/covid-19/countries')
                .then((response) => response.json())
                .then((data) => {
                    const countries = data?.map((country) => ({
                        name: country.country, // India
                        code: country.countryInfo.iso2, // IN
                    }));

                    setTableData(sortData(data));
                    setMapCountries(data);
                    setCountries(countries);
                });
        };

        getCountriesData();
    }, []);

    const onCountryChange = async (event) => {
        const countryCode = event.target.value;

        const url =
            countryCode === 'worldwide'
                ? 'https://disease.sh/v3/covid-19/all'
                : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

        await fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setCountry(countryCode);
                setCountryInfo(data);
                setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
                setMapZoom(4);
            });
    };

    return (
        <div className='app'>
            <div className='app__left'>
                <div className='app__header'>
                    <h1>COVID-19 TRACKER</h1>
                    <FormControl className='app__dropdown'>
                        <Select
                            variant='outlined'
                            value={country}
                            onChange={onCountryChange}>
                            <MenuItem value='worldwide'>Worldwide</MenuItem>
                            {countries?.map((country) => (
                                <MenuItem
                                    key={country.code}
                                    value={country.code}>
                                    {country.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div className='app__stats'>
                    <InfoBox
                        active={caseType === 'cases'}
                        isRed
                        onClick={(e) => setCaseType('cases')}
                        title='Coronovirus Cases'
                        cases={prettyPrintStat(countryInfo.todayCases)}
                        total={prettyPrintStat(countryInfo.cases)} // numeral(countryInfo.cases).format("0.0a")
                    />
                    <InfoBox
                        active={caseType === 'recovered'}
                        onClick={(e) => setCaseType('recovered')}
                        title='Recovered'
                        cases={prettyPrintStat(countryInfo.todayRecovered)}
                        total={prettyPrintStat(countryInfo.recovered)}
                    />
                    <InfoBox
                        active={caseType === 'deaths'}
                        isRed
                        onClick={(e) => setCaseType('deaths')}
                        title='Deaths'
                        cases={prettyPrintStat(countryInfo.todayDeaths)}
                        total={prettyPrintStat(countryInfo.deaths)}
                    />
                </div>

                <Map
                    countries={mapCountries}
                    caseType={caseType}
                    center={mapCenter}
                    zoom={mapZoom}
                />
            </div>
            <Card className='app__right'>
                <CardContent>
                    <h3>Live cases by country</h3>
                    <Table countries={tableData} />
                    <h3 className='app__graphTitle'>
                        Worldwide new {caseType}
                    </h3>
                    <LineGraph className='app__graph' caseType={caseType} />
                </CardContent>
            </Card>
        </div>
    );
}

export default App;
