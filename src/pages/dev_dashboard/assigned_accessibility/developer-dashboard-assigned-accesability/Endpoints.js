import React, {useState} from 'react';
import {Check, Code, Search, Server} from 'lucide-react';
import {Accordion, AccordionDetails, AccordionSummary, Typography} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const EndpointsManagement = ({groupedEndpoints, splitCamelCase, toggleEndpointAssignment}) => {
  const [expandedGroups, setExpandedGroups] = useState({});

  const handleAccordionChange = (group) => (event, isExpanded) => {
    setExpandedGroups({
      ...expandedGroups,
      [group]: isExpanded
    });
  };

  const accordionStyle = {
    boxShadow: 'none',
    borderRadius: '8px',
    border: '1px solid #e9ecef',
    marginBottom: '12px',
  };

  const accordionSummaryStyle = {
    backgroundColor: '#f8f9fa',
    borderRadius: '8px 8px 0 0',
    '&.Mui-expanded': {
      borderBottom: '1px solid #e9ecef',
    }
  };

  const getMethodBadgeClass = (method) => {
    switch (method?.toUpperCase()) {
      case 'GET':
        return 'bg-success';
      case 'POST':
        return 'bg-primary';
      case 'PUT':
        return 'bg-warning text-dark';
      case 'PATCH':
        return 'bg-info text-dark';
      case 'DELETE':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <div className="endpoints-management">
      {Object.keys(groupedEndpoints).length > 0 ? (
        <div className="endpoint-groups">
          {Object.keys(groupedEndpoints).map(group => (
            <Accordion
              key={group}
              expanded={expandedGroups[group] || false}
              onChange={handleAccordionChange(group)}
              sx={accordionStyle}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon/>}
                aria-controls={`${group}-content`}
                id={`${group}-header`}
                sx={accordionSummaryStyle}
              >
                <div className="d-flex align-items-center">
                  <Server size={18} className="me-2 text-primary"/>
                  <Typography component="span" fontWeight="500">
                    {splitCamelCase(group)}
                  </Typography>
                  <span className="badge bg-primary bg-opacity-10 text-primary ms-2 rounded-pill">
                    {groupedEndpoints[group].length}
                  </span>
                </div>
              </AccordionSummary>
              <AccordionDetails sx={{padding: '16px'}}>
                <div className="list-group">
                  {groupedEndpoints[group].map(endpoint => (
                    <div
                      key={endpoint.id}
                      className="list-group-item list-group-item-action border-0 border-bottom rounded-0 py-3 px-3"
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <div className="d-flex align-items-center mb-1">
                            <span className={`badge me-2 ${getMethodBadgeClass(endpoint.method)}`}>
                              {endpoint.method}
                            </span>
                            <span className="fw-medium text-break" style={{maxWidth: '550px'}}>
                              {endpoint.endpoint || endpoint.enpoint}
                            </span>
                          </div>
                          <div className="d-flex flex-wrap text-muted small gap-2">
                            {endpoint.service && (
                              <span className="d-flex align-items-center">
                                <Code size={14} className="me-1"/>
                                Service: {endpoint.service}
                              </span>
                            )}
                            {endpoint.action && (
                              <>
                                <span className="text-muted">|</span>
                                <span>Action: {endpoint.action}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <button
                          className={`btn ${endpoint.assigned ? 'btn-success' : 'btn-outline-secondary'} btn-sm`}
                          onClick={() => toggleEndpointAssignment(endpoint)}
                          title={endpoint.assigned ? "Remove access" : "Grant access"}
                        >
                          {endpoint.assigned ? <Check size={16}/> : 'Assign'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      ) : (
        <div className="text-center bg-light rounded p-5 my-3">
          <Search size={32} className="text-muted mb-3 opacity-50"/>
          <h5>No endpoints match your search criteria</h5>
          <p className="text-muted">Try adjusting your search terms or filters</p>
        </div>
      )}

      <style jsx>{`
        .endpoints-management .list-group-item:hover {
          background-color: #f8f9fa;
        }

        .endpoints-management .list-group-item:last-child {
          border-bottom: 0 !important;
        }
      `}</style>
    </div>
  );
};

export default EndpointsManagement;
