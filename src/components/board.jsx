import React from 'react'
import {NobleSet} from './nobles.jsx'
import {Piles} from './gems.jsx'
import {CardGrid} from './cards.jsx'
import {Players, PlayerReserves} from './players.jsx'
import {Logs, logBundle} from './logs.jsx'
import './styles/gem.css'
import './styles/coin.css'
import './styles/card.css'
import './styles/noble.css'
import './styles/player.css'
import './styles/board.css'
import './styles/logs.css'
import Bundle from '../bundle.js'

function GemMessage(props) {
    let message = [props.verb + ' ']
    message = message.concat(logBundle(props.gems))
    message.push('?')
    return <span>{message}</span>
}

function ActionBox(props) {
    // TODO: Organize this better

    if (props.gameOver) {
        const winners = props.gameOver.winnerIDs.map((id) => props.playerMap[id])
        return <div className="action-box"><span className="action-text">
            {'Game over. Winner(s): ' + winners.join(', ')}
        </span></div>
    }

    if (!props.myTurn) {
        return <div className="action-box"><span className="action-text">Wait for your turn!</span></div>
    }

    let options;

    if (Object.keys(props.selectedCard).length !== 0) {
        const buyDisabled = props.validCardBuy ? '' : 'disabled'
        const reserveDisabled = props.validCardReserve ? '' : 'disabled'
        options = <div className="options">
            <button disabled={buyDisabled} onClick={() => props.buyCard()}>Buy</button>
            <button disabled={reserveDisabled} onClick={() => props.reserveCard()}>Reserve</button>
        </div>
    } else if (Bundle.getGemCount(props.selectedGems) !== 0) {
        const disabled = props.validGemPick ? '' : 'disabled'
        options = [
            <div key="option" className="options">
                <GemMessage gems={props.selectedGems} verb="Take"></GemMessage>
                <button disabled={disabled} onClick={() => props.takeGems()}>Confirm</button>
            </div>,
            <button key="clear" onClick={() => props.clearGems()}>Clear</button>
        ]
    } else if (props.stage === "nobles" && (props.selectedNoble || props.selectedNoble === 0)) {
        options = <button onClick={() => props.takeNoble()}>Select</button>
    } else if (props.stage === "nobles") {
        options = <span className="action-text">Select a noble.</span>
    } else if (props.stage === "discard" && Bundle.getGemCount(props.discardedGems) > 0) {
        const disabled = props.validDiscard ? '' : 'disabled'
        options = [
            <div key="option" className="options">
                <GemMessage gems={props.discardedGems} verb="Discard"></GemMessage>
                <button disabled={disabled} onClick={() => props.discardGems()}>Confirm</button>
            </div>,
            <button key="clear" onClick={() => props.clearGems()}>Clear</button>
        ]
    } else if (props.stage === "discard") {
        options = <span className="action-text">Discard down to 10 gems.</span>
    } else {
        options = <span className="action-text">Select a card or gem.</span>
    }

    return (
        <div className="action-box selected-player">
            {options}
        </div>
    )
}

export class GembalayaTable extends React.Component {

    constructor(props) {
        super(props)
        this.playerMap = {}
        if (this.props.gameMetadata) {
            for (let i = 0; i < this.props.gameMetadata.length; i ++) {
                // Limit to 10 characters
                this.playerMap[this.props.gameMetadata[i].id] = this.props.gameMetadata[i].name.slice(0, 10)
            }
        } else {
            for (let i = 0; i < this.props.ctx.numPlayers; i ++) {
                this.playerMap[i] = 'Player ' + i
            }
        }
    }

    //TODO: Game metadata holds player names, but only in lobby mode. Use that to get names if possible.
    
    render () {
        const myTurn = this.props.playerID === this.props.ctx.currentPlayer
        const stage = this.props.ctx.activePlayers && this.props.ctx.activePlayers[this.props.ctx.currentPlayer]
        return (
            <div className="board">
                <Players 
                    players={this.props.G.players} 
                    currentPlayer={this.props.ctx.currentPlayer}
                    selectDiscard={this.props.moves.selectDiscard}
                    playerMap={this.playerMap}
                ></Players>
                <CardGrid 
                    board={this.props.G.board} 
                    decks={this.props.G.decks} 
                    selectedCard={this.props.G.selectedCardPosition} 
                    selectCard={this.props.moves.selectCard}
                    myTurn={myTurn}
                ></CardGrid>
                <NobleSet
                    nobles={this.props.G.nobles}
                    availableNobles={this.props.G.availableNobles}
                    myTurn={myTurn}
                    selectedNoble={this.props.G.selectedNoble}
                    selectNoble={this.props.moves.selectNoble}
                ></NobleSet>
                <Piles gems={this.props.G.gems} selectedGems={this.props.G.selectedGems} selectGem={this.props.moves.selectGem} myTurn={myTurn}></Piles>
                <ActionBox 
                    selectedCard={this.props.G.selectedCardPosition} 
                    selectedGems={this.props.G.selectedGems}
                    discardedGems={this.props.G.discardedGems}
                    clearGems={this.props.moves.clearGems}
                    validGemPick={this.props.G.validGemPick}
                    validDiscard={this.props.G.validDiscard}
                    validCardBuy={this.props.G.validCardBuy}
                    validCardReserve={this.props.G.validCardReserve}
                    takeGems={this.props.moves.takeGems}
                    discardGems={this.props.moves.discardGems}
                    buyCard={this.props.moves.buyCard}
                    reserveCard={this.props.moves.reserveCard}
                    myTurn={myTurn}
                    gameOver={this.props.ctx.gameover}
                    playerMap={this.playerMap}
                    stage={stage}
                    selectedNoble={this.props.G.selectedNoble}
                    takeNoble={this.props.moves.takeNoble}
                ></ActionBox>
                <div className="sidebar">
                    <PlayerReserves
                        reserves={this.props.G.players[this.props.playerID].reserves}
                        selectCard={this.props.moves.selectCard}
                        playerID={this.props.playerID}
                        selectedCard={this.props.G.selectedCardPosition}  
                    ></PlayerReserves>
                    <Logs logs={this.props.G.logs} playerMap={this.playerMap} playerID={this.props.playerID}></Logs>
                </div>
            </div>
        )
    }
}