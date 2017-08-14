import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  if(props.winnerPos){
    return (
      <button className="squareHighlight" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
  else{
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
}

class Row extends React.Component {
  renderSquare(i) {
    if(this.props.winner && 
       ( this.props.winner[0] === i ||
         this.props.winner[1] === i ||
         this.props.winner[2] === i
       )){
        return (
          <Square
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
            winnerPos={true}
          />
        );
       }
    else{
      return (
        <Square
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
          winnerPos={false}
        />
      );
    }
  }

  render() {
    return (
      <div className="board-row">
        {this.renderSquare(this.props.row*3+2)}
        {this.renderSquare(this.props.row*3+1)}
        {this.renderSquare(this.props.row*3+0)}
      </div>
    );
  }
}

class Board extends React.Component {
  render() {
    return (
      <div>
        <Row 
            squares={this.props.squares}
            onClick={this.props.onClick}
            winner={this.props.winner}
            row="0"
        />
        <Row 
            squares={this.props.squares}
            onClick={this.props.onClick}
            winner={this.props.winner}
            row="1"
        />
        <Row 
            squares={this.props.squares}
            onClick={this.props.onClick}
            winner={this.props.winner}
            row="2"
        />
      </div>
    );
  }
}

class Info extends React.Component {
  render(){
    return (
        <div className="game-info">
          <div>{this.props.status}</div>
          <ol>{this.props.moves}</ol>
        </div>
    );
  }
}

class Buttons extends React.Component {
  constructor(props) {
    super(props);
    this.handleToggleChange = this.handleToggleChange.bind(this);
    this.handleRestartChange = this.handleRestartChange.bind(this);
  }

  handleToggleChange(){
    this.props.onToggle();
  }

  handleRestartChange(){
    this.props.onRestart();
  }

  render(){
    return (
      <div className="game-info">
        <button onClick={this.handleToggleChange}>
          <b>Toggle Sorting</b>
        </button> <span></span>
        <button onClick={this.handleRestartChange}>
          <b>Restart</b>
        </button>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          rowNumber: 0,
          ColNumber: 0
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      ascending: true
    };
    this.onToggleChange = this.onToggleChange.bind(this);
    this.onRestartChange = this.onRestartChange.bind(this);
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          rowNumber: parseInt(i/3)+1,
          ColNumber: i%3+1,
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  onToggleChange(){
    this.setState({
      ascending: !this.state.ascending
    });
  }

  onRestartChange(){
    this.setState({
      history: [
        {
          squares: Array(9).fill(null),
          rowNumber: 0,
          ColNumber: 0
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      ascending: true
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const pos = "(" + step.rowNumber + "," + step.ColNumber + ")";
      const desc = move ? "Move #" + move + ":" + pos : "Game start";
      if (move == this.state.stepNumber)
      return (
        <li key={move}>
          <a href="#" onClick={() => this.jumpTo(move)}><b>{desc}</b></a>
        </li>
      );
      else
      return (
        <li key={move}>
          <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
        </li>
      );
    });

    let rarr = [];
    for (var index = history.length-1; index >= 0; index--) {
      rarr.push(history[index]);
    }
    
    const movesv = rarr.map((step, move) => {
      const pos = "(" + step.rowNumber + "," + step.ColNumber + ")";
      const desc = (move !== rarr.length-1)? "Move #" + (this.state.stepNumber - move) + ":" + pos : "Game start";
      if (move === 0)
        return (
          <li key={move}>
            <a href="#" onClick={() => this.jumpTo(move)}><b>{desc}</b></a>
          </li>
      );
      else
        return (
          <li key={move}>
            <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
          </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner[3];
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    if (this.state.ascending){
      return (
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={i => this.handleClick(i)}
              winner={winner}
            />
          </div>
          <div>
          <Buttons 
            onToggle={this.onToggleChange}
            onRestart={this.onRestartChange}
          />
          <Info
            status = {status}
            moves = {moves}
            />
            </div>
        </div>
      );
    }
    else{
      return (
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={i => this.handleClick(i)}
              winner={winner}
            />
          </div>
          <div>
            <Buttons  
              onToggle={this.onToggleChange}
              onRestart={this.onRestartChange}
            />
            <Info
              status = {status}
              moves = {movesv}
              />
          </div>
        </div>
      );
    }
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  let result = [];
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
      result = lines[i];
      result.push(squares[a]);
      return result;
    }
  }
  return null;
}
