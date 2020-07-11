import React from 'react'
import { Card } from './cards.jsx'

function Player(props) {

    let cards = []
    for (const gem in props.cards) {
        // No gold cards.
        if (gem !== 'gold') { cards.push(<div key={gem} className={'gem gem-' + gem}>{props.cards[gem]}</div>) }
    }

    let gems = []
    for (const gem in props.gems) {
        gems.push(<div
            key={gem} 
            className={'gem gem-player-coin gem-' + gem}
            onClick={() => props.selectDiscard(gem)}
        >{props.gems[gem]}</div>)
    }

    let reserves = [<span key="label">Reserves:&nbsp;</span>]
    for (let i = 0; i < props.reserves.length; i++) {
        const tier = 'i'.repeat(props.reserves[i].tier)
        reserves.push(<div
            key={i}
            className={'card-back card-back-' + tier}
        >{tier.toUpperCase()}</div>)
    }

    return (
        <div className="player-wrapper">
            <div className={'player-aspect-box' + (props.active ? ' selected-player' : '')}>
                <div className="player-mat">
                    <div className="player-info">
                        <span className="points">{props.score}</span>
                        <span className="player-name">{props.playerName}</span>
                    </div>
                    <div className="player-holdings">
                        {cards}
                    </div>
                    <div className="player-holdings">
                        {gems}
                    </div>
                    <div className="player-public-reserves">
                        {reserves}
                    </div>
                </div>
            </div>
        </div>
        )
}

export function Players(props) {
    let players = []
    for (const playerID in props.players) {
        const player = props.players[playerID]
        const playerName = props.playerMap[playerID]
        const active = props.currentPlayer === playerID
        players.push(
        <Player 
            key={playerID}
            cards={player.cards}
            gems={player.gems}
            score={player.score}
            playerName={playerName}
            active={active}
            selectDiscard={props.selectDiscard}
            reserves={player.reserves}
        ></Player>
        )
    }
    return <div className='player-column'>{players}</div>
}

export function PlayerReserves(props) {

    let reserves = []
    for (let i = 0; i < props.reserves.length; i++) {
        const card = props.reserves[i]
        const selectedCard = props.selectedCard
        let selected = (
            selectedCard.reserved &&
            selectedCard.playerID === props.playerID &&
            selectedCard.position === i
        )
        reserves.push(<Card 
            key={i} 
            cardPosition={{reserved: true, playerID: props.playerID, position: i}}
            cost={card.cost} 
            gem={card.gem} 
            points={card.points} 
            selected={selected}
            selectCard={props.selectCard}
        ></Card>)
    }

    return (
        <div className="player-reserves">
            <span className="player-reserves-label">Your Reserves:</span>
            <div className="player-reserves-cards">{reserves}</div>
        </div>
    )
}