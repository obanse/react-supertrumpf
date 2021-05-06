import React from 'react';

import './Card.css';
import Animal from '../models/Animal';
import PropTypes from 'prop-types';

export default function Card({ animal, uncovered, onSelectedProperty, selectedProperty }: {
    animal: Animal, uncovered: boolean, onSelectedProperty: any, selectedProperty: string }) {

    const front = (
        <div className="card">
            <h1>{ animal.name ? animal.name : 'Unbekannt' }</h1>
            { animal.image && (<img src={`${process.env.PUBLIC_URL}/${ animal.image }`} alt={ animal.name } />) }
            <table>
                <tbody>
                { (Object.keys(Animal.properties) as Array<keyof typeof Animal.properties>).map(property => {
                    const animalProperty = Animal.properties[property];
                    return (
                        <tr key={property}
                            className={ selectedProperty === property ? 'active' : '' }
                            onClick={ () => onSelectedProperty(property) }
                        >
                            <td>{ animalProperty.label }</td>
                            <td>{ animal[property] }&nbsp;{ animalProperty.unit }</td>
                        </tr>
                    );
                }) }
                </tbody>
            </table>
        </div>
    );
    const back = <div className="card back" />;

    if (uncovered)
        return front;
    else
        return back;

}

Card.propTypes = {
    uncovered: PropTypes.bool.isRequired,
    animal: PropTypes.instanceOf(Animal).isRequired,
    onSelectedProperty: PropTypes.func,
    selectedProperty: PropTypes.string
};
