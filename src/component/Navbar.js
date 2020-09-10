import React from 'react';
import { Link } from 'react-router-dom';
import appLogo from '../appLogo.png';

function Navbar() {
  return (
    <nav className='navbar navbar-expand-lg navbar-light bg-light mb-3' style={{ backgroundColor: 'pink' }}>
      <Link className='navbar-brand' href='/'>
        <img src={appLogo} width='30' height='30' className='d-inline-block align-top mr-1' alt='' />
        Coins Collect
      </Link>
    </nav>
  );
}

export default Navbar;
