import React from "react";
import { io } from '../socket';

const reqSvgs = require.context('../cards', true, /\.svg$/);

let listOfCards = reqSvgs.keys();

const cards = listOfCards.map(path => reqSvgs(path))

let hand = [];
// const socket = io('https://localhost:300')
// Creates the hand of 5 cards
// TODO - change from hard value (game based variable)
for (let i = 0; i < 5; i++) {
    const random = Math.floor(Math.random() * cards.length);
    console.log('random', random);
    console.log('cards[random]', cards[random]);

    hand.push(cards[random]);

    // Removes the added card from the deck
    cards.splice(random, 1);
}

const Hand = ({ cards }) => {
    return (
        hand.map(
            (image) =>
                <img className="card" src={image} key={image} alt={image} />
        )
    );
}

export default Hand;