import React, {useEffect, useState} from 'react';
import {Search} from 'lucide-react';
import {createMenu, getMenu} from "../../../api/menu";
import {getRole} from "../../../api/role";
import {createEndpointRole, createMenuRole, deleteMenuRole, getEndpoint} from "../../../api/menuRole";
import EndpointsManagement from "./developer-dashboard-assigned-accesability/Endpoints";
import MenuManagement from "./developer-dashboard-assigned-accesability/Menus";
import {MENU_ITEMS} from "../../../helper/constants/Menu";

const RoleCard = ({role, isSelected, onClick}) => (
  <div
    className={`card border-0 mb-2 cursor-pointer ${isSelected ? 'bg-primary text-white' : 'bg-white'}`}
    onClick={onClick}
  >
    <div className="card-body py-2 px-3">
      <h6 className={`mb-0 ${isSelected ? 'text-white' : 'text-dark'}`}>{role.name}</h6>
    </div>
  </div>
);


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
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState(null);

  useEffect(() => {
    fetchData();

    fetchMenu()
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await getMenu();
      if (response.status === 200) {
        const filtered = MENU_ITEMS.filter(menuItem =>
          !response.data.some(existing =>
            existing.menu_number === menuItem.menu_number && existing.name === menuItem.name
          )
        );
        if (filtered.length > 0) {
          await createMenu(filtered)
        }
      } else if (response.status === 204) {
        await createMenu(MENU_ITEMS)
      }
    } catch (error) {
      console.error('Failed to fetch menu:', error);
    }
  };

  function fetchData() {
    setIsLoading(true);
    Promise.all([
      getMenu(),
      getRole(),
      getEndpoint()
    ]).then(([menuRes, roleRes, endpointRes]) => {
      setMenuData(menuRes.data);
      setRoles(roleRes.data);
      setEndpointData(endpointRes.data);
      setIsLoading(false);
    }).catch(error => {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    });
  }

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setSaveStatus(null);

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
    setSaveStatus(null);
  };

  const toggleMenuAssignment = (menu) => {
    if (!selectedRole) return;

    setMenus(menus.map(m =>
      m.id === menu.id ? {...m, assigned: !m.assigned} : m
    ));
    setSaveStatus(null);
  };

  async function transformedData(data, fieldName, roleId) {
    return data.map((item) => ({
      [fieldName]: item.id,
      role_id: roleId
    }));
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

  const saveAssignments = async () => {
    setSaveStatus('saving');
    try {
      if (activeTab === 'endpoints') {
        const changes = await findAssignmentChanges(endpoints, initialEndpoints);
        const transformedAssignments = await transformedData(changes.newlyAssignedItems, 'endpoint_id', selectedRole.id);

        if (transformedAssignments.length > 0) {
          await createEndpointRole(transformedAssignments);
        }

        if (changes.itemsNoLongerUnassigned.length > 0) {
          const deleteEndpoints = changes.itemsNoLongerUnassigned.map(item => item.id);

          console.log("Endpoints to delete:", deleteEndpoints);
        }
      } else {
        const changes = await findAssignmentChanges(menus, initialMenus);
        const transformedAssignments = await transformedData(changes.newlyAssignedItems, 'menu_id', selectedRole.id);

        if (transformedAssignments.length > 0) {
          await createMenuRole(transformedAssignments);
        }

        if (changes.itemsNoLongerUnassigned.length > 0) {
          const deleteMenus = changes.itemsNoLongerUnassigned.map(item => item.id);
          for (const menuId of deleteMenus) {
            await deleteMenuRole(menuId);
          }
        }
      }
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error("Error saving assignments:", error);
      setSaveStatus('error');
    }
  };

  const filteredEndpoints = endpoints.filter(endpoint =>
    endpoint.controller_alias?.toLowerCase().includes(filterText?.toLowerCase()) ||
    endpoint.endpoint?.toLowerCase().includes(filterText?.toLowerCase())
  );

  const filteredMenus = menus.filter(menu =>
    menu.description?.toLowerCase().includes(filterText?.toLowerCase())
  );

  const groupedEndpoints = filteredEndpoints.reduce((acc, endpoint) => {
    const key = endpoint.controller_alias;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(endpoint);
    return acc;
  }, {});

  function splitCamelCase(str) {
    return str
      .split(/(?=[A-Z])/)
      .join(" ");
  }

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h3 mb-0">Role-Based Access Control</h1>
            {selectedRole && (
              <button
                className={`btn ${saveStatus === 'success' ? 'btn-success' : saveStatus === 'error' ? 'btn-danger' : 'btn-primary'}`}
                onClick={saveAssignments}
                disabled={saveStatus === 'saving'}
              >
                {saveStatus === 'saving' ? 'Saving...' :
                  saveStatus === 'success' ? 'Saved Successfully!' :
                    saveStatus === 'error' ? 'Error Saving' : 'Save Assignments'}
              </button>
            )}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-md-3 mb-4">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white">
                <h5 className="card-title mb-0">Roles</h5>
              </div>
              <div className="card-body p-2" style={{maxHeight: '65vh', overflowY: 'auto'}}>
                {roles.length === 0 ? (
                  <p className="text-center text-muted my-4">No roles available</p>
                ) : (
                  roles.map(role => (
                    <RoleCard
                      key={role.id}
                      role={role}
                      isSelected={selectedRole?.id === role.id}
                      onClick={() => handleRoleSelect(role)}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="col-md-9">
            {selectedRole ? (
              <>
                <div className="card shadow-sm border-0 mb-4">
                  <div className="card-header bg-white">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="card-title mb-0">Managing: {selectedRole.name}</h5>
                      <div className="btn-group">
                        <button
                          className={`btn ${activeTab === 'endpoints' ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => setActiveTab('endpoints')}
                        >
                          Endpoints
                        </button>
                        <button
                          className={`btn ${activeTab === 'menus' ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => setActiveTab('menus')}
                        >
                          Menus
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="card-body p-3">
                    <div className="input-group mb-3">
                      <span className="input-group-text bg-white">
                        <Search size={18}/>
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0"
                        placeholder={`Search ${activeTab}...`}
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                      />
                    </div>

                    <div style={{maxHeight: '60vh', overflowY: 'auto'}}>
                      {activeTab === 'endpoints' ? (
                        <EndpointsManagement groupedEndpoints={groupedEndpoints}
                                             splitCamelCase={splitCamelCase}
                                             toggleEndpointAssignment={toggleEndpointAssignment}
                        />
                      ) : (
                        <MenuManagement filteredMenus={filteredMenus}
                                        selectedMenu={selectedMenu}
                                        toggleMenuAssignment={toggleMenuAssignment}
                                        handleMenuSelect={handleMenuSelect}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="card shadow-sm border-0">
                <div className="card-body text-center py-5">
                  <div className="text-muted mb-3">
                    <Search size={48} className="opacity-50"/>
                  </div>
                  <h5>Select a role to manage permissions</h5>
                  <p className="text-muted">Choose a role from the left panel to view and modify its access rights</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleEndpointMenuManagement;
