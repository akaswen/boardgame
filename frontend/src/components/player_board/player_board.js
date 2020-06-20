import React, { Component } from 'react';

import styles from './player_board.module.css';

import Tile from '../../components/tile/tile.js';

import MyContext from '../../context.js';

class PlayerBoard extends Component {
  static contextType = MyContext;

  constructor(props, context) {
    super(props, context)

    let active = false;

    if (context.currentGame.current_player_id === props.player.id) {
      active = true;
    }

    this.state = {
      active: active
    }
  }

  endingSpaces = () => {
    let player = this.props.player;
    let spaces = JSON.parse(player.player_board.ending_spaces);
    let rows = [];

    for (let i = 0; i < spaces.length; i++) {
      let tiles = [];
      let row = spaces[i].tiles;
      for (let j = 0; j < row.length; j++) {
        let tile = row[j];
        let inactive = tile.id === null
        tiles.push(
          <Tile
            inactive={inactive}
            color={tile.color}
            key={j} />
        )
      }
      rows.push(
        <div key={i}>
          {tiles}
        </div>
      )
    }

    return rows;
  }

  playingSpaces = () => {
    let player = this.props.player;
    let spaces = JSON.parse(player.player_board.playing_spaces);
    let rows = [];

    for (let i = 0; i < spaces.length; i++) {
      let tiles = [];
      let row = spaces[i];
      for (let j = 0; j < row.max_length; j++) {
        let color = 'empty';
        if (row.tiles[j]) {
          color = row.tiles[j].color;
        }
        tiles.push(
          <Tile key={j} color={color}/>
        )
      }
      rows.push(
        <div key={i}>
          {tiles}
        </div>
      )
    }

    return rows;
  }

  negativeSpaces = () => {
    let player = this.props.player;
    let board = player.player_board;

    let negativeSpaces = [];

    for (let i = 0; i < 7; i++) {
      let color = 'empty'
      if (board.negative_spaces[i]) {
        color = board.negative_spaces[i].color
      }
      let minus = null;
      switch (i) {
        case 0:
        case 1:
          minus = <p>-1</p>
          break;
        case 2:
        case 3:
        case 4:
          minus = <p>-2</p>
          break;
        case 5:
        case 6:
          minus = <p>-3</p>
          break;
      }
      negativeSpaces.push(
        <div
          key={i}
          className={styles.NegativeSpace}>
          {minus}
          <Tile color={color} />
        </div>
      )
    }

    return negativeSpaces;
  }

  render() {
    let player = this.props.player;
    let board = player.player_board;

    return (
      <div className={this.state.active ? styles.Active : styles.Board}>
        <h2>{player.name}</h2>
        <p>Points {board.points}</p>
        <div className={styles.PlayingSpaces}>
          {this.playingSpaces()}
        </div>
        <div className={styles.EndingSpaces}>
          {this.endingSpaces()}
        </div>
        <div className={styles.NegativeSpaces}>
          <h6>Negative Tiles</h6>
          {this.negativeSpaces()}
        </div>
      </div>
    );
  }
}

export default PlayerBoard;
