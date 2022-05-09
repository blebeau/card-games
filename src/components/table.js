import React, { useState, useEffect } from 'react';
import Chat from './chat';

// Shuffle algorithim (Fisher-Yates, or Knuth, shuffle)
function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

// Gets total value of the players cards
const getTotal = (cards) => {
    let total = 0;

    // Sorting the cards to have aces last. That way when
    // calculating the score, ace will be calculated as 
    // 1 or 11
    cards.sort(function (a, b) {
        return a.length - b.length;
    });

    cards.forEach(async (card) => {
        if (card.includes('10') || card.includes('j') || card.includes('q') || card.includes('k')) {
            total += 10;
        } else if (card.includes('2')) {
            total += 2;
        } else if (card.includes('3')) {
            total += + 3;
        } else if (card.includes('4')) {
            total += 4;
        } else if (card.includes('5')) {
            total += 5;
        } else if (card.includes('6')) {
            total += 6;
        } else if (card.includes('7')) {
            total += 7;
        } else if (card.includes('8')) {
            total += 8;
        } else if (card.includes('9')) {
            total += 9;
        } else if (card.includes('a')) {
            total += 11 > 21 ? total += 1 : total += 11;
        }
    });
    console.log('total', total)
    return total;
}

const Table = ({ socket, table }) => {
    console.log('socket ion table', socket);
    const cards = [
        '2h', '2c', '2s', '2d',
        '3h', '3c', '3s', '3d',
        '4h', '4c', '4s', '4d',
        '5h', '5c', '5s', '5d',
        '6h', '6c', '6s', '6d',
        '7h', '7c', '7s', '7d',
        '8h', '8c', '8s', '8d',
        '9h', '9c', '9s', '9d',
        '10h', '10c', '10s', '10d',
        'jh', 'jc', 'js', 'jd',
        'qh', 'qc', 'qs', 'qd',
        'kh', 'kc', 'ks', 'kd',
        'aceh', 'acec', 'aces', 'aced',
    ]

    const [hands, setHands] = useState([]);
    const [playerScore, setPlayerScore] = useState(0);
    const [dealerScore, setdealerScore] = useState(0);
    const [dealerHand, setDealerHand] = useState([]);
    const [deck, setDeck] = useState([]);
    const [playerStay, setPlayerStay] = useState(false);
    const [winner, setWinner] = useState('');
    const [deal, setDeal] = useState(false);

    // Runs once to initiate the game
    useEffect(() => {
        socket.emit('joinedgame', () => {
            console.log('table call - joined game');
        });
        // Randomize the deck
        const shuffledDeck = shuffle(cards);

        console.log('test', shuffledDeck[0])

        // Set hands, dealing to player first
        setHands(shuffledDeck.splice(0, 2))
        setDealerHand(shuffledDeck.splice(0, 2))


        setPlayerStay(false)
        setdealerScore(0);
        setPlayerScore(0);

        socket.emit('createTable', {
            winner: false,
            playerHand: [hands],
            playerScore: 0,
            dealerScore: 0,
            dealerHand: [dealerHand],
            deck: shuffledDeck,
            table: table,
        });

        setDeck(shuffledDeck);
    }, [])

    useEffect(() => {
        console.log('deal')
        if (deal) {
            setHands(deck.splice(0, 2));
            setDealerHand(deck.splice(0, 2));
            setPlayerScore(0);
            setdealerScore(0);
            setWinner('');
            setPlayerStay(false)
        }
    }, [deal])

    // Updates whenever a card is added to either hand
    // and calcualtes/ compares the scores
    useEffect(() => {
        console.log('dealer hand log');
        setdealerScore(0);
        setPlayerScore(0);

        const dealerTotal = getTotal(dealerHand);
        const playerTotal = getTotal(hands);

        setdealerScore(dealerTotal);
        setPlayerScore(playerTotal)

        //TODO: Add score udates for socket

        if (playerTotal > 21) {
            alert('Busted!');
            setWinner('Dealer');
        }
        if (dealerTotal > 21) {
            alert('Busted!');
            setWinner('Player');
        }
        if (dealerTotal < playerTotal && dealerTotal > 16) {
            setWinner('Player')
        }
        if (dealerTotal >= playerTotal && dealerTotal > 16) {
            setWinner('Dealer')
        }
    }, [dealerHand, hands])


    const hit = () => {
        if (!playerStay)
            setHands([...hands, deck[0]]);
        else
            setDealerHand([...dealerHand, deck[0]]);
        console.log('dealerHand', dealerHand);
        console.log('hands', hands);
        // removes added card from the deck
        setDeck(deck.filter(x => x !== deck[0]))

        socket.emit('updateState', {
            playerHand: [...hands],
            dealerHand: [...dealerHand],
            deck: deck.filter(x => x !== deck[0]),
        });
    }

    const stay = () => {
        setPlayerStay(true);
    }

    const endHand = () => {
        const dealerTotal = getTotal(dealerHand);
        const playerTotal = getTotal(hands);

        setdealerScore(dealerTotal);
        setPlayerScore(playerTotal)

        //TODO: Add score udates for socket

        if (playerTotal > 21) {
            alert('Busted!');
            setWinner('Dealer');
        }
        if (dealerTotal > 21) {
            alert('Busted!');
            setWinner('Player');
        }
        if (dealerTotal < playerTotal && dealerTotal > 16) {
            setWinner('Player')
        }
        if (dealerTotal > playerTotal && dealerTotal > 16) {
            setWinner('Dealer')
        }

        if (winner !== '')
            setDeal(true)
    }

    return (
        <div>
            <div className='dealer'>
                <div >Dealer</div>
                {
                    // To get the dealers second card to show face down first
                    // !playerStay ?
                    //     <div>
                    //         {console.log('deal hand', dealerHand[0])}
                    //         <img className="card"
                    //             src={require(`../utils/PNG-cards-1.3/${dealerHand[0]}.png`)}
                    //             key={dealerHand[0]}
                    //             alt={dealerHand[0]} />
                    //         <img className="card"
                    //             src={require('../utils/PNG-cards-1.3/backOfCard.png')}
                    //             key={'backOfCard'}
                    //             alt={'backOfCard'} />
                    //     </div>
                    //     :
                    dealerHand.map(
                        (image) =>
                            <img className="card"
                                src={require(`../utils/PNG-cards-1.3/${image}.png`)}
                                key={image}
                                alt={image} />
                    )

                }
                <button
                    disabled={!playerStay || dealerScore > 16}
                    onClick={hit}
                >Hit</button>
                <button
                    onClick={endHand}
                >Stay</button>

            </div>
            <div className='player'>
                <div>Player</div>
                {
                    hands.map(
                        (image) =>
                            <img className="card"
                                src={require(`../utils/PNG-cards-1.3/${image}.png`)}
                                key={image}
                                alt={image} />
                    )
                }
                <button
                    disabled={playerStay}
                    onClick={hit}
                >Hit</button>
                <button
                    onClick={stay}
                >Stay</button>
            </div>
            <div className='chat'>
                <Chat socket={socket} table={table} />
            </div>

        </div>

    );

}

export default Table;