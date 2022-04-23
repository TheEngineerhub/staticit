import { Route, Routes } from 'react-router-dom';

import About from './pages/About';
import Home from './pages/Home';
import Private from './pages/Private';

const Router = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/private" element={<Private />} /> {/* We will exclude this in SSG */}
      </Routes>
    </>
  );
};

export default Router;
