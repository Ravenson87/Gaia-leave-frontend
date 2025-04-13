import React from "react";
import {Check, Search,} from 'lucide-react';

const MenuManagement = ({filteredMenus, selectedMenu, toggleMenuAssignment, handleMenuSelect}) => {

  const MenuListItem = ({menu}) => (
    <div
      className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center px-3 py-2 ${selectedMenu?.id === menu.id ? 'active' : ''}`}
      onClick={() => handleMenuSelect(menu)}
    >
      <div>
        <div className="d-flex align-items-center">
          <small className="badge bg-light text-secondary me-2 mt-1">
            #{menu.menu_number}
          </small>
          <div className="fw-medium">{menu.name}</div>
        </div>
        <div className="d-flex align-items-center">
          {menu.description && (
            <small className="text-muted">{menu.description}</small>
          )}
        </div>
      </div>
      <button
        className={`btn ${menu.assigned ? 'btn-success' : selectedMenu?.id === menu.id ? 'btn-outline-light' : 'btn-outline-secondary'} btn-sm`}
        onClick={(e) => {
          e.stopPropagation();
          toggleMenuAssignment(menu);
        }}
      >
        {menu.assigned ? <Check size={16}/> : 'Assign'}
      </button>
    </div>
  );

  return (
    <>
      {filteredMenus.length > 0 ? (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">
              Available Menus <span className="badge bg-primary ms-2">{filteredMenus.length}</span>
            </h5>
          </div>

          <div className="menu-container" style={{maxHeight: '65vh', overflowY: 'auto'}}>
            <div className="list-group shadow-sm">
              {filteredMenus.map((menu) => (
                <MenuListItem key={menu.id} menu={menu}/>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center my-5 py-5 bg-light rounded shadow-sm">
          <Search size={48} className="text-muted mb-3 opacity-50"/>
          <h5>No menus match your search criteria</h5>
          <p className="text-muted">Try adjusting your search or filters</p>
        </div>
      )}
    </>
  );
};

export default MenuManagement;
