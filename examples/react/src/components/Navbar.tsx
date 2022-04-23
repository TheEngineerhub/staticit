import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="center">
      <NavLink to="/">Home</NavLink>
      <NavLink to="/about">About</NavLink>
      <NavLink to="/private">Private</NavLink>
    </div>
  );
};

export default Navbar;
