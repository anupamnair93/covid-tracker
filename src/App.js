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

import { sortData } from './utils/utils';

function App() {
    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState('worldwide');
    const [countryInfo, setCountryInfo] = useState({});
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        fetch('https://disease.sh/v3/covid-19/all')
            .then((response) => response.json())
            .then((data) => {
                setCountryInfo(data);
            });
    }, []);

    useEffect(() => {
        const getCountriesData = async () => {
            await fetch('https://disease.sh/v3/covid-19/countries')
                .then((response) => response.json())
                .then((data) => {
                    const countries = data?.map((country) => ({
                        name: country.country, // India
                        code: country.countryInfo.iso2, // IN
                    }));

                    setTableData(sortData(data));
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
                        title='Coronovirus Cases'
                        cases={countryInfo.todayCases}
                        total={countryInfo.cases}
                    />
                    <InfoBox
                        title='Recovered'
                        cases={countryInfo.todayRecovered}
                        total={countryInfo.recovered}
                    />
                    <InfoBox
                        title='Deaths'
                        cases={countryInfo.todayDeaths}
                        total={countryInfo.deaths}
                    />
                </div>

                <Map />
            </div>
            <Card className='app__right'>
                <CardContent>
                    <h3>Live cases by country</h3>
                    <Table countries={tableData} />
                    <h3>Worldwide new cases</h3>
                    <LineGraph />
                </CardContent>
            </Card>
        </div>
    );
}

export default App;
