import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button id={props.id} className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i) {
        return (
        <Square
            id={'square'+i}
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
        />
                );
    }

    static renderLocation(str) {
        return (
            <div className="location">{str}</div>
        )
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {Board.renderLocation('')}
                    {Board.renderLocation('A')}
                    {Board.renderLocation('B')}
                    {Board.renderLocation('C')}
                </div>
                <div className="board-row">
                    {Board.renderLocation('1')}
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {Board.renderLocation('2')}
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {Board.renderLocation('3')}
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {

    constructor(props) {
         super(props);
         this.state = {
             history: [{
                 squares: Array(9).fill(null),
                 location: Array(2).fill(null)
             }],
             stepNumber: 0,
             xIsNext: true
         }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        cleanBoldLinks(history.length);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const step = getStepLocation(i);
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                location: step
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step, length) {
        cleanBoldLinks(length);
        cleanRedSquares();
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
        const node = document.getElementById('link' + step);
        node.style.fontWeight = 'bold';
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
           const desc = move ?
           'Go to move #' + move + ' (' + step.location[0] + ':' + step.location[1] + ')' :
           'Go to game start';
           return (
               <li key={move}>
                   <button id={'link' + move} onClick={() => this.jumpTo(move, history.length)}>{desc}</button>
               </li>
           )

        });

        let status;
        if (winner === 0) {
            status = 'Game over';
        } else if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            const squareA = document.getElementById('square' + a);
            const squareB = document.getElementById('square' + b);
            const squareC = document.getElementById('square' + c);
            squareA.style.color = 'red';
            squareB.style.color = 'red';
            squareC.style.color = 'red';
            return squares[a];
        }
    }
    for (let i = 0; i < squares.length; i++) {
        if (squares[i] === null) {
            return null;
        }
    }
    return 0;
}

function getStepLocation(i) {
    const steps = [
        ['A','1'],
        ['B','1'],
        ['C','1'],
        ['A','2'],
        ['B','2'],
        ['C','2'],
        ['A','3'],
        ['B','3'],
        ['C','3']
    ];
    return steps[i];
}

function cleanBoldLinks(length) {
    for (let i = 0; i < length; i++) {
        const node = document.getElementById('link' + i);
        node.style.fontWeight = '';
    }
}

function cleanRedSquares() {
    for (let i = 0; i < 9; i++) {
        const node = document.getElementById('square' + i);
        node.style.color = 'black';
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);