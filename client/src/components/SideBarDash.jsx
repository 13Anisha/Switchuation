import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';

const SideBarDash = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
 

  return (
    <div className={`d-flex ${isCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`} 
         style={{ height: '100vh', transition: 'width 0.3s' }}>
      <div style={{ 
          width: isCollapsed ? '60px' : '200px', 
          borderRight: '1px solid #ccc', 
          position: 'relative', 
          backgroundColor: '#f8f9fa'
        }}>
        <button 
          onClick={toggleSidebar} 
          className="btn btn-outline-secondary"
          style={{ 
            position: 'absolute', 
            top: '50%', 
            right: '-40px', 
            transform: 'translateY(-50%)',
            width: '30px', 
            height: '30px', 
            cursor: 'pointer',
            borderRadius: '50%', 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <i className={`fa ${isCollapsed ? 'fa-chevron-right' : 'fa-times'}`} style={{ fontSize: '18px' }}></i>
        </button>
        {!isCollapsed && (
          <>
            <h3 className="text-center mt-2 mb-3" style={{ fontSize: '1.2rem' }}>Dashboard</h3>
            <ul className="list-unstyled d-flex flex-column align-items-center">
              <li className="mb-2"><Link to="/round1" className="text-decoration-none" >Round 1</Link></li>
              <li className="mb-2"><Link to="/round2" className="text-decoration-none" >Round 2</Link></li>
              <li className="mb-2"><Link to="/round3" className="text-decoration-none" >Round 3</Link></li>
              <li className="mb-2"><Link to="/round4" className="text-decoration-none" >Round 4</Link></li>
            </ul>
          </>
        )}
      </div>
      <div style={{ flex: 1, marginLeft: isCollapsed ? '10px' : '20px', transition: 'margin-left 0.3s' }}>
        {/* Dashboard Content Goes Here */}
      </div>
    </div>
  );
};

export default SideBarDash;
