import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: `Hello`,
      num: 1
    };
  }
  componentDidMount() {
    setInterval(() => {
      this.setState({
        num: this.state.num += 1
      });
    }, 1000)
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <ion-item>
          <ion-checkbox>{this.state.text}{this.state.num}</ion-checkbox>
          <ion-label>{this.state.text}{this.state.num}</ion-label>
        </ion-item>
        <ion-item>
          <ion-checkbox>{this.state.text}{this.state.num}</ion-checkbox>
          {this.state.text}{this.state.num}
        </ion-item>
      </div>
    );
  }
}

export default App;
