import React from "react";

const reqSvgs = require.context('../cards', true, /\.svg$/);

let listOfCards = reqSvgs.keys();

const cards = listOfCards.map(path => reqSvgs(path))

let hand = [];

for (let i = 0; i < 5; i++) {
    const random = Math.floor(Math.random() * 52 - i);
    hand.push(cards[random]);
    cards.splice(random, 1);
}

const Hand = () => {
    return (
        hand.map(
            (image, index) =>
                <img src={image} />
        )
    );
}

export default Hand;