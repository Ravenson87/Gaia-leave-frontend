import React, {useState, useEffect, useRef} from 'react';
import {Search, Check, X} from 'lucide-react';
import {Accordion, AccordionDetails, AccordionSummary, Button, Typography} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {getMenu} from "../../../api/menu";
import {getRole} from "../../../api/role";
import {createEndpointRole, createMenuRole, deleteMenuRole, getEndpoint} from "../../../api/menuRole";

const RoleEndpointMenuManagement = () => {
  const [roles, setRoles] = useState([]);
  const [endpoints, setEndpoints] = useState([]);
  const [initialEndpoints, setInitialEndpoints] = useState([]);
  const [endpointData, setEndpointData] = useState([]);
  const [menus, setMenus] = useState([]);
  const [initialMenus, setInitialMenus] = useState([]);
  const [menuData, setMenuData] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [activeTab, setActiveTab] = useState('endpoints');
  const listRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  function fetchData() {

    getMenu().then((response) => {
      setMenuData(response.data)
    })

    getRole().then((response) => {
      setRoles(response.data)
    })

    getEndpoint().then((response) => {
      setEndpointData(response.data)
    })
  }

  const handleRoleSelect = (role) => {
    setSelectedRole(role);

    const menus = role?.roleMenus?.map(item => item.menu);
    const updatedMenus = menuData.map(menu => ({
      ...menu,
      assigned: menus?.some(assigned => assigned.id === menu.id)
    }));

    const endpoints = role?.roleEndpoints?.map(item => item.endpoint);
    const updatedEndpoint = endpointData.map(endpoint => ({
      ...endpoint,
      assigned: endpoints.some(assigned => assigned.id === endpoint.id)
    }));

    setInitialEndpoints(updatedEndpoint);
    setInitialMenus(updatedMenus);
    setEndpoints(updatedEndpoint);
    setMenus(updatedMenus);
  };

  const handleMenuSelect = (menu) => {
    setSelectedMenu(menu);
    setActiveTab('endpoints');
  };

  const toggleEndpointAssignment = (endpoint) => {
    if (!selectedRole) return;

    setEndpoints(endpoints.map(ep =>
      ep.id === endpoint.id ? {...ep, assigned: !ep.assigned} : ep
    ));
  };

  const toggleMenuAssignment = (menu) => {
    if (!selectedRole) return;

    setMenus(menus.map(m =>
      m.id === menu.id ? {...m, assigned: !m.assigned} : m
    ));
  };

  const saveAssignments = () => {
    if (activeTab === 'endpoints') {
      findAssignmentChanges(endpoints, initialEndpoints).then((response) => {
        transformedData(response.newlyAssignedItems, 'endpoint_id', selectedRole.id).then((response) => {
          response.length > 0 ? createEndpointRole(response).then(r => console.log(r)) : null;
        });
        if (response?.itemsNoLongerUnassigned.length > 0) {
          const deleteEndpoints = response?.itemsNoLongerUnassigned?.map(item => item.id);
          console.log(deleteEndpoints);
        }
      })
    } else {
      findAssignmentChanges(menus, initialMenus).then((response) => {
        transformedData(response.newlyAssignedItems, 'menu_id', selectedRole.id).then((response) => {
          response.length > 0 ? createMenuRole(response).then(r => console.log(r)) : null;
        });
        if (response?.itemsNoLongerUnassigned.length > 0) {
          const deleteMenus = response?.itemsNoLongerUnassigned?.map(item => item.id);
          deleteMenus.forEach(menus => {
            deleteMenuRole(menus)
          })
        }
      })
    }
    // alert('Assignments saved successfully!');
  };

  async function transformedData(data, fieldName, roleId) {
    return data.map((item) => ({
      [fieldName]: item.id,
      role_id: roleId
    }))
  }

  async function findAssignmentChanges(originalItems, updatedItems) {

    const assignedItemsInOriginal = originalItems.filter(item => item.assigned === true);
    const assignedItemsInUpdated = updatedItems.filter(item => item.assigned === true);


    const unassignedItemsInOriginal = originalItems.filter(item => item.assigned === false);
    const unassignedItemsInUpdated = updatedItems.filter(item => item.assigned === false);


    const newlyAssignedItems = assignedItemsInOriginal.filter(originalItem =>
      !assignedItemsInUpdated.some(updatedItem => originalItem.id === updatedItem.id)
    );


    const itemsNoLongerUnassigned = unassignedItemsInOriginal.filter(originalItem =>
      !unassignedItemsInUpdated.some(updatedItem => originalItem.id === updatedItem.id)
    );

    return {
      newlyAssignedItems,
      itemsNoLongerUnassigned
    };
  }

  const filteredEndpoints = endpoints.filter(endpoint =>
    endpoint.controller_alias.toLowerCase().includes(filterText.toLowerCase()) ||
    endpoint.endpoint.toLowerCase().includes(filterText.toLowerCase())
  );

  const filteredMenus = menus.filter(menu =>
    menu.description.toLowerCase().includes(filterText.toLowerCase())
  );

  const groupedEndpoints = filteredEndpoints.reduce((acc, endpoint) => {
    const key = endpoint.controller_alias;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(endpoint);
    return acc;
  }, {});

  const scrollUp = () => {
    if (listRef.current) listRef.current.scrollBy({top: -50, behavior: "smooth"});
  };

  const scrollDown = () => {
    if (listRef.current) listRef.current.scrollBy({top: 50, behavior: "smooth"});
  };

  function splitCamelCase(str) {
    return str
      .split(/(?=[A-Z])/)
      .join(" ");
  }

  return (
    <div className="menu-endpoints-role-container">
      <div className="p-4 bg-light min-vh-100">
        <h1 className="fs-4 fw-bold mb-4">Role-Based Access Control</h1>

        <div className="d-flex mb-4">
          <div className="w-25 me-3">
            <h2 className="fs-5 fw-semibold mb-2">Roles</h2>
            <div className="bg-white rounded shadow-sm overflow-hidden">
              {roles?.length > 3 && (<Button onClick={scrollUp} fullWidth variant="contained" size="small">▲</Button>)}
              <ul ref={listRef} className="list-group" style={{maxHeight: "150px", overflowY: 'hidden'}}>
                {roles?.length > 0 && roles?.map(role => (
                  <li
                    key={role.id}
                    className={`list-group-item cursor-pointer ${selectedRole?.id === role.id ? 'active' : ''}`}
                    onClick={() => handleRoleSelect(role)}
                  >
                    {role.name}
                  </li>
                ))}
              </ul>
              {roles?.length > 3 && (
                <Button onClick={scrollDown} fullWidth variant="contained" size="small">▼</Button>)}
            </div>
          </div>

          <div className="w-75">
            {selectedRole ? (
              <>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h2 className="fs-5 fw-semibold">Permissions for {selectedRole.name}</h2>
                  <div className="btn-group">
                    <button
                      className={`btn ${activeTab === 'endpoints' ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => setActiveTab('endpoints')}
                    >
                      Endpoints
                    </button>
                    <button
                      className={`btn ${activeTab === 'menus' ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => setActiveTab('menus')}
                    >
                      Menus
                    </button>
                  </div>
                  <button className="btn btn-success" onClick={saveAssignments}>
                    Save Assignments
                  </button>
                </div>

                <div className="position-relative mb-3">
                  <input
                    type="text"
                    placeholder="Filter..."
                    className="form-control ps-5"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                  />
                  <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={16}/>
                </div>

                {activeTab === 'endpoints' ? (
                  <div className="bg-white rounded shadow-sm overflow-hidden p-3">
                    {Object.keys(groupedEndpoints).map(group => (
                      <div key={group} className="mb-3">
                        <Accordion>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon/>}
                            aria-controls="panel1-content"
                            id="panel1-header"
                          >
                            <Typography component="span">{splitCamelCase(group)}</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <ul className="list-group">
                              {groupedEndpoints[group].map(endpoint => (
                                <li key={endpoint.id}
                                    className="list-group-item d-flex justify-content-between align-items-center">
                                  <div>
                                    <div className="d-flex align-items-center">
                              <span className={`badge me-2 ${
                                endpoint.method === 'GET' ? 'bg-success' :
                                  endpoint.method === 'POST' ? 'bg-primary' :
                                    endpoint.method === 'PUT' ? 'bg-warning' :
                                      endpoint.method === 'DELETE' ? 'bg-danger' : 'bg-secondary'
                              }`}>
                                {endpoint.method}
                              </span>
                                      <span>{endpoint.enpoint}</span>
                                    </div>
                                    <small className="text-muted">Service: {endpoint.service} |
                                      Action: {endpoint.action}</small>
                                  </div>
                                  <button
                                    className={`btn btn-sm rounded-circle ${endpoint.assigned ? 'btn-success' : 'btn-light'}`}
                                    onClick={() => toggleEndpointAssignment(endpoint)}
                                  >
                                    {endpoint.assigned ? <Check size={18}/> : <X size={18}/>}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </AccordionDetails>
                        </Accordion>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="d-flex">
                    <div className="w-75 me-3">
                      <h3 className="fw-medium mb-2">Available Menus</h3>
                      <div className="bg-white rounded shadow-sm overflow-hidden">
                        <ul className="list-group">
                          {filteredMenus.map(menu => (
                            <li
                              key={menu.id}
                              className={`list-group-item d-flex justify-content-between align-items-center cursor-pointer ${selectedMenu?.id === menu.id ? 'active' : ''}`}
                              onClick={() => handleMenuSelect(menu)}
                            >
                              <div>
                                <span className="fw-medium">{menu.name}</span>
                                <span className="text-muted ms-2">#{menu.menu_number}</span>
                              </div>
                              <button
                                className={`btn btn-sm rounded-circle ${menu.assigned ? 'btn-success' : 'btn-light'}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleMenuAssignment(menu);
                                }}
                              >
                                {menu.assigned ? <Check size={18}/> : <X size={18}/>}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded shadow-sm p-5 text-center mt-5">
                <p className="text-muted">Select a role to manage permissions</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleEndpointMenuManagement;
