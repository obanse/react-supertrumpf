import React from 'react';

import './Game.css';
import Card from './components/Card';
import Animal from './models/Animal';
import PropTypes from 'prop-types';

import update from 'immutability-helper';

export default class Game extends React.Component<AppProps, AppState> {
    static defaultProps =  {
        title: 'Supertrumpf',
    };
    static propTypes = {
        title: PropTypes.string,
    };

    state = {
        selectedProperty: '',
        playersTurn: true,
        player: [new Animal('Elefant', 'placeholder.png', 3.3, 6000, 70, 1, 40)],
        computer: [new Animal('Nashorn', 'placeholder.png', 1.9, 2300, 50, 1, 50)],
    }

    getSelectPropertyHandler () {
        return (property: any) =>
            this.setState((state) =>
                update(state, { selectedProperty: { $set: property } })
            );
    }

    render() {
        const { playersTurn, player, computer, selectedProperty } = this.state;
        return (
            <div>
                <h1>{ this.props.title }</h1>
                <div className="info">
                    { playersTurn ? 'Du bist' : 'Der Computer ist' } an der Reihe
                </div>
                <div className="cards">
                    <Card animal={ player[0] } uncovered={ playersTurn }
                          selectedProperty={ selectedProperty }
                          onSelectedProperty={ this.getSelectPropertyHandler() } />
                    <Card animal={ computer[0] } uncovered={ !playersTurn }
                          selectedProperty={ selectedProperty } />
                </div>
            </div>
        );
    }
}

interface AppState {
    selectedProperty: string,
    playersTurn: boolean,
    player: Animal[],
    computer: Animal[],
}

interface AppProps {
    title: string
}
