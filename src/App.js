import React, { Component } from 'react';
import WeatherView from './WeatherView';

class App extends Component {
  render() {
    return (
      <div className="App">
        <WeatherView lat='37' lon='127'></WeatherView>
      </div>
    );
  }
}

export default App;
