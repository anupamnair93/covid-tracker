import React from 'react';
import '../Table/Table.css';

function Table({ countries }) {
    return (
        <div className='table'>
            {countries?.map(({ countryInfo: { iso2 }, country, cases }) => (
                <tr key={iso2}>
                    <td>{country}</td>
                    <td>
                        <strong>{cases}</strong>
                    </td>
                </tr>
            ))}
        </div>
    );
}

export default Table;
