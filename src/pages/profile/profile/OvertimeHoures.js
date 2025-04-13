import {useMemo, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Calendar, CheckCircle, ChevronLeft, ChevronRight, Clock, RefreshCw, Search, Trash, X} from 'lucide-react';

export default function OvertimeTracker({initialData}) {
  const extendedData = [...Array(3)].flatMap(() =>
    initialData.map((item, index) => ({
      ...item,
      calendars: {
        ...item.calendars,
        id: item.calendars.id + index * 100
      }
    }))
  );

  const [data] = useState(extendedData);
  const [selectedRows, setSelectedRows] = useState([]);
  const [conversionType, setConversionType] = useState('days');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const toggleRowSelection = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const toggleSelectAll = () => {
    const currentPageIds = paginatedData.map(item => item.calendars.id);
    if (currentPageIds.every(id => selectedRows.includes(id))) {
      setSelectedRows(selectedRows.filter(id => !currentPageIds.includes(id)));
    } else {
      const newSelectedRows = [...selectedRows];
      currentPageIds.forEach(id => {
        if (!newSelectedRows.includes(id)) {
          newSelectedRows.push(id);
        }
      });
      setSelectedRows(newSelectedRows);
    }
  };

  const filteredData = useMemo(() => {
    return data.filter(item =>
      item.calendars.date.includes(searchTerm) ||
      item.calendars.days.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const totalSelectedHours = useMemo(() => {
    return data
      .filter(item => selectedRows.includes(item.calendars.id))
      .reduce((sum, item) => sum + item.overtime_hours, 0);
  }, [data, selectedRows]);

  const convertedValue = useMemo(() => {
    if (conversionType === 'days') {
      return (totalSelectedHours / 8).toFixed(2);
    } else {
      return totalSelectedHours.toFixed(2);
    }
  }, [totalSelectedHours, conversionType]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const resetSelection = () => {
    setSelectedRows([]);
    setSearchTerm('');
    setCurrentPage(1);
  };

  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-10">
            <div className="card shadow border-0 rounded-3 overflow-hidden">
              <div className="card-header bg-primary text-white p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <Clock className="me-2" size={24} />
                    <h2 className="m-0 fw-bold">Overtime Tracker</h2>
                  </div>
                  {selectedRows.length > 0 && (
                    <div className="badge bg-white text-primary rounded-pill px-3 py-2 fs-6">
                      {selectedRows.length} entries selected
                    </div>
                  )}
                </div>
              </div>

              <div className="card-body p-4">
                <div className="row g-4">
                  <div className="col-lg-5">
                    <div className="card border-0 shadow-sm bg-white h-100">
                      <div className="card-body p-4">
                        <div className="d-flex align-items-center">
                          <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                            {/*<ClockHistory className="text-primary" size={24} />*/}
                          </div>
                          <div>
                            <h5 className="fw-bold mb-0">Total Overtime</h5>
                            <div className="d-flex align-items-baseline">
                              <span className="display-6 fw-bold me-2">{totalSelectedHours}</span>
                              <span className="text-muted">hours</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-7">
                    <div className="card border-0 shadow-sm bg-white h-100">
                      <div className="card-body p-4">
                        <div className="row align-items-center">
                          <div className="col-md-7">
                            <label className="form-label mb-2 fw-semibold">Convert to:</label>
                            <select
                              className="form-select mb-0"
                              value={conversionType}
                              onChange={(e) => setConversionType(e.target.value)}
                            >
                              <option value="days">Days off (8h = 1 day)</option>
                              <option value="paid">Paid hours</option>
                            </select>
                          </div>
                          <div className="col-md-5 mt-3 mt-md-0">
                            <div className="bg-light p-3 rounded text-center">
                              <small className="text-muted d-block mb-1">Converted value</small>
                              <div className="display-6 fw-bold">
                                {convertedValue}
                              </div>
                              <small className="badge bg-secondary">
                                {conversionType === 'days' ? 'days' : 'hours'}
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-end mt-4 gap-2">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={resetSelection}
                  >
                    <RefreshCw className="me-1" size={16} /> Reset
                  </button>
                  <button
                    className="btn btn-success"
                    disabled={selectedRows.length === 0}
                  >
                    <CheckCircle className="me-1" size={16} /> Apply Conversion
                  </button>
                </div>
              </div>

              <div className="card-body border-top p-4">
                <div className="mb-4">
                  <div className="row g-3 align-items-center">
                    <div className="col-md-7">
                      <div className="input-group">
                        <span className="input-group-text bg-white border-end-0">
                          <Search size={18} />
                        </span>
                        <input
                          type="text"
                          className="form-control border-start-0"
                          placeholder="Search by date or day..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          aria-label="Search"
                        />
                        {searchTerm && (
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => setSearchTerm('')}
                            aria-label="Clear search"
                          >
                            <X size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="col-md-5">
                      <div className="d-flex justify-content-md-end">
                        <button
                          className="btn btn-outline-danger"
                          disabled={selectedRows.length === 0}
                          onClick={() => setSelectedRows([])}
                        >
                          <Trash className="me-1" size={16} /> Clear Selection
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="table-responsive rounded shadow-sm overflow-hidden">
                  <table className="table table-hover mb-0">
                    <thead className="bg-light">
                    <tr>
                      <th width="60">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={paginatedData.length > 0 && paginatedData.every(item => selectedRows.includes(item.calendars.id))}
                            onChange={toggleSelectAll}
                            id="selectAll"
                            aria-label="Select all entries"
                          />
                          <label className="form-check-label" htmlFor="selectAll">
                            All
                          </label>
                        </div>
                      </th>
                      <th className="p-1">Date</th>
                      <th className="m-1">Day</th>
                      <th className="text-end m-1">Hours</th>
                    </tr>
                    </thead>
                    <tbody>
                    {paginatedData.length > 0 ? (
                      paginatedData.map((item) => (
                        <tr
                          key={item.calendars.id}
                          className={selectedRows.includes(item.calendars.id) ? "table-primary" : ""}
                          onClick={() => toggleRowSelection(item.calendars.id)}
                          style={{ cursor: 'pointer' }}
                        >
                          <td>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={selectedRows.includes(item.calendars.id)}
                                onChange={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleRowSelection(item.calendars.id);
                                }}
                                id={`checkbox-${item.calendars.id}`}
                                aria-label={`Select entry for ${formatDate(item.calendars.date)}`}
                              />
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <Calendar size={16} className="text-primary me-2" />
                              <span className="fw-semibold">{formatDate(item.calendars.date)}</span>
                            </div>
                          </td>
                          <td>
                              <span className="badge bg-light text-dark rounded-pill text-capitalize">
                                {item.calendars.days}
                              </span>
                          </td>
                          <td className="text-end fw-bold">
                            {item.overtime_hours} <small className="text-muted">hrs</small>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-4 text-muted">
                          <Search className="me-2" size={18} />
                          No matching records found
                        </td>
                      </tr>
                    )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4 gap-3">
                    <div>
                      <p className="text-muted mb-0">
                        Showing <span className="fw-semibold">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="fw-semibold">{Math.min(currentPage * itemsPerPage, filteredData.length)}</span> of <span className="fw-semibold">{filteredData.length}</span> entries
                      </p>
                    </div>
                    <nav aria-label="Page navigation">
                      <ul className="pagination mb-0">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            aria-label="Previous page"
                          >
                            <ChevronLeft size={16} />
                          </button>
                        </li>

                        {[...Array(totalPages)].map((_, i) => {
                          const pageNumber = i + 1;
                          // Show limited page buttons
                          const showDirectly =
                            pageNumber === 1 ||
                            pageNumber === totalPages ||
                            (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1);

                          // Add ellipsis indicators
                          const showEllipsisBefore = pageNumber === 2 && currentPage > 3;
                          const showEllipsisAfter = pageNumber === totalPages - 1 && currentPage < totalPages - 2;

                          if (showDirectly) {
                            return (
                              <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                                <button
                                  className="page-link"
                                  onClick={() => goToPage(pageNumber)}
                                  aria-label={`Page ${pageNumber}`}
                                  aria-current={currentPage === pageNumber ? "page" : null}
                                >
                                  {pageNumber}
                                </button>
                              </li>
                            );
                          } else if (showEllipsisBefore || showEllipsisAfter) {
                            return (
                              <li key={`ellipsis-${pageNumber}`} className="page-item disabled">
                                <span className="page-link">...</span>
                              </li>
                            );
                          }
                          return null;
                        })}

                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            aria-label="Next page"
                          >
                            <ChevronRight size={16} />
                          </button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
