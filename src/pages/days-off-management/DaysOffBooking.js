import React, {useEffect, useState} from 'react';
import {
  Calendar as CalendarIcon,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Filter,
  XCircle
} from 'lucide-react';
import {
  freeDaysAcceptance,
  freeDaysBookingRead,
  readByDateAndStatus
} from "../../api/day-off-management/dayOffManagement";
import {getJobPosition} from "../../api/jobPosition";
import EmployeeCalendarView from "./days-off-booking/EmployeeCalendarView";

export default function DaysOffBooking() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [requests, setRequests] = useState([]);
  const currentYear = new Date().getFullYear();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [filterStatus, setFilterStatus] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [users, setUsers] = useState([]);
  const [visible, setVisible] = useState(false);
  // Added state for multi-select functionality
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    getRequests(0)
    setUsersByPosition()
  }, []);

  const getRequests = (status, plus = 0) => {
    const startDate = currentDate.getFullYear() + "-" + String(currentDate.getMonth() + plus).padStart(2, '0') + "-01";
    const endDate = currentDate.getFullYear() + "-" + String(currentDate.getMonth() + plus).padStart(2, '0') + "-" + daysOfMonth(currentDate.getFullYear(), currentDate.getMonth() + plus);
    readByDateAndStatus(startDate, endDate, status).then((res) => {
      if (res.status === 200) {
        setRequests(res.data);
        // Reset selections when getting new requests
        setSelectedRequests([]);
        setSelectAll(false);
      }
    })
  }

  const setUsersByPosition = async () => {
    try {
      const [freeDaysBookingRes, positionsRes] = await Promise.all([freeDaysBookingRead(), getJobPosition()]);
      if (freeDaysBookingRes.status === 200 && positionsRes.status === 200) {
        const freeDaysBooking = freeDaysBookingRes.data;
        const positions = positionsRes.data;

        const result = freeDaysBooking.map((item) => {
          const newItem = {...item}
          newItem.user = {...newItem.user}

          const position = positions.find(pos => pos.id === item.user.job_position_id);

          if (position) {
            newItem.user.job_position_id = position.title;
          }

          return newItem;
        });
        setUsers(result);
      } else {
        console.error('Error');
      }
    } catch (error) {
      console.error('Erreor:', error);
    }
  };

  const handleApprove = (id) => {
    setRequests(requests.map(request =>
      request.id === id ? {...request, status: 1} : request
    ));
    const json = [
      {
        id: id,
        status: 1
      }
    ]
    freeDaysAcceptance(json)
  };

  const handleReject = (id) => {
    setRequests(requests.map(request =>
      request.id === id ? {...request, status: 2} : request
    ));
    const json = [
      {
        id: id,
        status: 2
      }
    ]
    freeDaysAcceptance(json)
  };

  const handleReset = (id) => {
    setRequests(requests.map(request =>
      request.id === id ? {...request, status: 0} : request
    ));
    const json = [
      {
        id: id,
        status: 0
      }
    ]
    freeDaysAcceptance(json)
  };

  // New functions for bulk actions
  const handleBulkApprove = () => {
    if (selectedRequests.length === 0) return;

    const updatedRequests = requests.map(request =>
      selectedRequests.includes(request.id) ? {...request, status: 1} : request
    );
    setRequests(updatedRequests);

    const json = selectedRequests.map(id => ({
      id: id,
      status: 1
    }));

    freeDaysAcceptance(json);
    setSelectedRequests([]);
    setSelectAll(false);
  };

  const handleBulkReject = () => {
    if (selectedRequests.length === 0) return;

    const updatedRequests = requests.map(request =>
      selectedRequests.includes(request.id) ? {...request, status: 2} : request
    );
    setRequests(updatedRequests);

    const json = selectedRequests.map(id => ({
      id: id,
      status: 2
    }));

    freeDaysAcceptance(json);
    setSelectedRequests([]);
    setSelectAll(false);
  };

  const handleBulkReset = () => {
    if (selectedRequests.length === 0) return;

    const updatedRequests = requests.map(request =>
      selectedRequests.includes(request.id) ? {...request, status: 0} : request
    );
    setRequests(updatedRequests);

    const json = selectedRequests.map(id => ({
      id: id,
      status: 0
    }));

    freeDaysAcceptance(json);
    setSelectedRequests([]);
    setSelectAll(false);
  };

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedRequests([]);
    } else {
      const currentPageIds = currentItems.map(request => request.id);
      setSelectedRequests(currentPageIds);
    }
    setSelectAll(!selectAll);
  };

  // Toggle individual selection
  const toggleSelectRequest = (id) => {
    if (selectedRequests.includes(id)) {
      setSelectedRequests(selectedRequests.filter(requestId => requestId !== id));
      setSelectAll(false);
    } else {
      setSelectedRequests([...selectedRequests, id]);
      // Check if all items on current page are selected
      if (currentItems.length === selectedRequests.length + 1) {
        setSelectAll(true);
      }
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 1:
        return <CheckCircle className="text-success" size={16}/>;
      case 2:
        return <XCircle className="text-danger" size={16}/>;
      default:
        return <Clock className="text-warning" size={16}/>;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 1:
        return 'Approved';
      case 2:
        return 'Rejected';
      default:
        return 'In Progress';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 1:
        return 'bg-success-subtle text-success';
      case 2:
        return 'bg-danger-subtle text-danger';
      default:
        return 'bg-warning-subtle text-warning';
    }
  };

  const filteredRequests = requests.filter(request => {
    const statusMatches = request.status === filterStatus;
    const startDate = request?.calendar?.date;
    const date = new Date(startDate);
    const month = selectedMonth === 0 || (date.getMonth() + 1 === parseInt(selectedMonth));
    const year = selectedYear === 0 || (date.getFullYear() === parseInt(selectedYear));
    return statusMatches && month && year;
  })

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRequests?.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + direction);
      return newDate;
    });
    setCurrentPage(1);
    getRequests(filterStatus)
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric'
  }).format(currentDate);

  const daysOfMonth = (year, month) => {
    const day = new Date(year, month, 0).getDate()
    return String(day).padStart(2, '0');
  }

  const closeFunc = () => {
    setVisible(false)
  }

  return (
    <div className="container py-4">
      {!visible ? (
        <div className="card shadow border-0 mb-4">
          <div className="card-body">
            <div className="container-fluid mb-4">
              <div className="row align-items-center justify-content-between col-md-12">
                <div className="col-md-4">
                  <h1 className="h4 mb-0 text-secondary">Requests</h1>
                </div>
                <div className="col-md-4 d-flex justify-content-center">
                  <div className="btn-group btn-group-sm shadow-sm me-3">
                    <button
                      onClick={() => navigateMonth(-1)}
                      className="btn btn-light"
                      aria-label="Previous month"
                    >
                      <ChevronLeft size={20}/>
                    </button>
                    <button className="btn btn-light px-3 fw-medium">
                      {formattedDate}
                    </button>
                    <button
                      onClick={() => navigateMonth(1)}
                      className="btn btn-light"
                      aria-label="Next month"
                    >
                      <ChevronRight size={20}/>
                    </button>
                  </div>
                </div>
                <div className="col-md-4 d-flex justify-content-end">
                  <button
                    onClick={() => setVisible(true)}
                    className="btn btn-sm btn-primary shadow-sm d-flex align-items-center"
                  >
                    <Eye size={16} className="mr-1"/>
                    <span className="mx-lg-3">Show</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="row mb-3 align-items-center">
              <div className="col">
                <div className="btn-group" role="group" aria-label="Filter buttons">
                  <button
                    type="button"
                    onClick={() => {
                      getRequests(0, 1)
                      setFilterStatus(0)
                    }}
                    className={`btn ${filterStatus === 0 ? 'btn-warning' : 'btn-outline-warning'}`}
                  >
                    <span className={`${filterStatus === 0 ? 'text-white' : ''}`}>  In progress </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      getRequests(1, 1)
                      setFilterStatus(1)
                    }}
                    className={`btn ${filterStatus === 1 ? 'btn-success' : 'btn-outline-success'}`}
                  >
                    <span className={`${filterStatus === 1 ? 'text-white' : ''}`}>  Approved </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      getRequests(2, 1)
                      setFilterStatus(2)
                    }}
                    className={`btn ${filterStatus === 2 ? 'btn-danger' : 'btn-outline-danger'}`}
                  >
                    <span className={`${filterStatus === 2 ? 'text-white' : ''}`}> Rejected </span>
                  </button>
                </div>
              </div>
              <div className="col-auto">
                <div className="d-flex align-items-center">
                  <label htmlFor="itemsPerPage" className="me-2 form-label mb-0">Show:</label>
                  <select
                    id="itemsPerPage"
                    className="form-select form-select-sm"
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bulk actions toolbar - only visible when items are selected */}
            {selectedRequests.length > 0 && (
              <div className="bg-light p-2 rounded mb-3 d-flex justify-content-between align-items-center">
                <div>
                  <span className="fw-medium me-2">{selectedRequests.length} item(s) selected</span>
                  <button className="btn btn-sm btn-link text-decoration-none" onClick={() => setSelectedRequests([])}>
                    Clear selection
                  </button>
                </div>
                <div className="btn-group btn-group-sm">
                  <button
                    className="btn btn-success"
                    onClick={handleBulkApprove}
                    title="Approve selected"
                  >
                    <CheckCircle size={16} className="me-1"/> Approve
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={handleBulkReject}
                    title="Reject selected"
                  >
                    <XCircle size={16} className="me-1"/> Reject
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={handleBulkReset}
                    title="Reset selected"
                  >
                    <Clock size={16} className="me-1"/> Reset
                  </button>
                </div>
              </div>
            )}

            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                <tr className="table-light">
                  <th width="40">
                    <div className="form-check d-flex justify-content-center">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={selectAll}
                        onChange={toggleSelectAll}
                        id="selectAllCheckbox"
                      />
                    </div>
                  </th>
                  <th>Employee</th>
                  <th>Requested Days</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
                </thead>
                <tbody>
                {currentItems?.length > 0 ? (
                  currentItems.map((request) => (
                    <tr key={request.id} className="border-bottom">
                      <td>
                        <div className="form-check d-flex justify-content-center">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={selectedRequests.includes(request.id)}
                            onChange={() => toggleSelectRequest(request.id)}
                            id={`check-${request.id}`}
                          />
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="me-3">
                            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center"
                                 style={{width: '42px', height: '42px'}}>
                            <span className="h5 mb-0 text-secondary">
                              {request?.user?.first_name && request?.user?.first_name[0] + " " + request?.user?.last_name && request?.user?.last_name[0]}
                            </span>
                            </div>
                          </div>
                          <div>
                            <div
                              className="fw-medium">{request?.user?.first_name + " " + request?.user?.last_name}</div>
                            <small className="text-muted">
                              Requested: {request?.description}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <CalendarIcon size={16} className="text-secondary me-2"/>
                          <span className="text-secondary">{request?.calendar?.date}</span>
                        </div>
                      </td>
                      <td>{request?.description}</td>
                      <td>
                      <span className={`badge ${getStatusBadgeClass(request?.status)}`}>
                        <span className="d-flex align-items-center">
                          {getStatusIcon(request?.status)}
                          <span className="ms-1">{getStatusText(request?.status)}</span>
                        </span>
                      </span>
                      </td>
                      <td className="text-end">
                        {request.status === 0 ? (
                          <div className="btn-group">
                            <button
                              onClick={() => handleApprove(request.id, request)}
                              className="btn btn-sm btn-outline-success"
                              title="Approve request"
                            >
                              <CheckCircle size={16}/>
                            </button>
                            <button
                              onClick={() => handleReject(request.id, request)}
                              className="btn btn-sm btn-outline-danger"
                              title="Reject request"
                            >
                              <XCircle size={16}/>
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleReset(request.id)}
                            className="btn btn-sm btn-outline-secondary"
                            title="Reset status"
                          >
                            Reset
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-4">
                      <div className="py-3">
                        <Filter size={36} className="text-secondary mb-2 opacity-50"/>
                        <p className="text-secondary mb-2">No requests match your filters</p>
                        <div className="d-flex justify-content-center gap-2">
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => {
                              setFilterStatus(0);
                              setCurrentPage(1);
                            }}
                          >
                            Clear status filter
                          </button>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => {
                              setSelectedMonth(0);
                              setSelectedYear(0);
                              setCurrentPage(1);
                            }}
                          >
                            Show all dates
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="d-flex justify-content-between align-items-center mt-3 py-2">
                <div className="small text-secondary">
                  Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredRequests?.length)} of {filteredRequests?.length} requests
                </div>
                <nav aria-label="Page navigation">
                  <ul className="pagination pagination-sm mb-0">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => paginate(currentPage - 1)}
                        aria-label="Previous"
                      >
                        <ChevronLeft size={14}/>
                      </button>
                    </li>

                    {Array.from({length: totalPages}, (_, i) => i + 1).map(number => (
                      <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => paginate(number)}
                        >
                          {number}
                        </button>
                      </li>
                    ))}

                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => paginate(currentPage + 1)}
                        aria-label="Next"
                      >
                        <ChevronRight size={14}/>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </div>
        </div>
      ) : (
        <EmployeeCalendarView
          initialData={users}
          close={closeFunc}
        />
      )}
    </div>
  );
}
