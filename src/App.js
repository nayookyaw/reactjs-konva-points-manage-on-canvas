import React, {Component} from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Login from './views/Login/Login';
import Home from './views/Home/Home';
import ImagePoint from './views/ImagePoint/ImagePoint';
import ImagePointGrid from './views/ImagePoint/ImagePointGrid';

class App extends Component {
  render () {
    return (
      <div className="wrapper">
        <BrowserRouter>
          <div className="container">
            <Routes>
              <Route path="/login" element={ <Login />} />
              <Route path="/home" element={ <Home />} />
              <Route path="/" element={ <ImagePoint />} />
              <Route path="/image/point/grid" element={ <ImagePointGrid />} />
            </Routes>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;