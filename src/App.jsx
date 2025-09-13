import React from 'react'
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import Home from './pages/Home';
import Genre from './pages/Genre';
import TopPicks from './pages/TopPicks';
import SearchResults from './pages/SearchResults';

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/genre" element={<Genre/>}/>
            <Route path="/top" element={<TopPicks/>}/>
            <Route path="/search" element={<SearchResults />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
