import React, { useState, useEffect } from 'react';
import { Send, X, Paperclip, ChevronDown, Search, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { createMailByAddress, getMailHistoryByAddress } from "../../../../api/user";

export default function EmailForwardingInterface({ address }) {
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [emailHistory, setEmailHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const fetchEmailHistory = async (page = 1) => {
    if (showHistory) {
      setHistoryLoading(true);
      try {
        const response = await getMailHistoryByAddress(address);

        if (response === 200) {
          const data = await response.data;
          setEmailHistory(data);

          if (data.totalItems && data.totalPages) {
            setTotalPages(data.totalPages);
          } else {
            setTotalPages(Math.ceil((data).length / itemsPerPage));
          }
        } else {
          console.error('Error loading history');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setHistoryLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchEmailHistory(currentPage);
  }, [showHistory, currentPage, itemsPerPage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await createMailByAddress(recipient, subject, message);
      if (response === 200) {
        setRecipient('');
        setSubject('');
        setMessage('');

        alert('Email successfully sent!');

        if (showHistory) {
          fetchEmailHistory(currentPage);
        }
      } else {
        alert('An error occurred while sending the email.');
      }
    } catch (error) {
      alert('An error occurred while sending the email: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = emailHistory.filter(email =>
    email.recipient?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.subject?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="container py-4">
      <div className="card shadow">
        <div className="card-body">
          <h1 className="card-title h4 text-primary mb-4">Email Forwarding</h1>

          <div className="btn-group mb-4">
            <button
              className={`btn ${!showHistory ? 'btn-primary' : 'btn-light'}`}
              onClick={() => setShowHistory(false)}
            >
              New Email
            </button>
            <button
              className={`btn ${showHistory ? 'btn-primary' : 'btn-light'}`}
              onClick={() => setShowHistory(true)}
            >
              History
            </button>
          </div>

          {!showHistory ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Recipient:</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="email@example.com"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Subject:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Message:</label>
                <textarea
                  className="form-control"
                  rows="6"
                  placeholder="Enter message text..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="d-flex align-items-center mt-4">
                <button type="button" className="btn btn-link text-dark d-flex align-items-center me-3">
                  <Paperclip className="me-1" size={16} />
                  <span>Attach file</span>
                </button>

                <div className="ms-auto">
                  <button
                    type="button"
                    className="btn btn-light me-2"
                    onClick={() => {
                      setRecipient('');
                      setSubject('');
                      setMessage('');
                    }}
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary d-flex align-items-center"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="spinner-border spinner-border-sm me-2" size={16} />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="me-2" size={16} />
                        <span>Send</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="email-history">
              <div className="mb-4 position-relative">
                <input
                  type="text"
                  className="form-control ps-4"
                  placeholder="Search history..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="position-absolute" style={{ left: '10px', top: '10px', color: '#6c757d' }} size={18} />
              </div>

              {historyLoading ? (
                <div className="d-flex justify-content-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <div className="table-responsive">
                  {filteredHistory.length > 0 ? (
                    <>
                      <table className="table table-hover">
                        <thead>
                        <tr className="table-light">
                          <th>Recipient</th>
                          <th>Subject</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th className="text-center">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredHistory.map(email => (
                          <tr key={email.id}>
                            <td>{email.recipient}</td>
                            <td>{email.subject}</td>
                            <td>{email.date || 'N/A'}</td>
                            <td>
                                <span className={`badge ${
                                  email.status === 'Sent' || email.status === 'Poslat' ? 'bg-success' :
                                    email.status === 'Failed' || email.status === 'Neuspešno' ? 'bg-danger' :
                                      'bg-warning'
                                }`}>
                                  {email.status === 'Poslat' ? 'Sent' :
                                    email.status === 'Neuspešno' ? 'Failed' :
                                      email.status || 'Unknown'}
                                </span>
                            </td>
                            <td className="text-center">
                              <button
                                className="btn btn-link text-primary me-2 p-0"
                                onClick={() => {
                                  setShowHistory(false);
                                  setRecipient(email.recipient);
                                  setSubject(`Fw: ${email.subject}`);
                                  setMessage(`--- Forwarded message ---\n${email.message || ''}`);
                                }}
                              >
                                Forward
                              </button>
                              <button className="btn btn-link text-secondary p-0">
                                Details
                              </button>
                            </td>
                          </tr>
                        ))}
                        </tbody>
                      </table>

                      <div className="d-flex align-items-center justify-content-between mt-4">
                        <div className="small text-muted">
                          Showing page {currentPage} of {totalPages}
                        </div>
                        <div className="d-flex">
                          <select
                            className="form-select form-select-sm me-2"
                            value={itemsPerPage}
                            onChange={(e) => {
                              setItemsPerPage(Number(e.target.value));
                              setCurrentPage(1);
                            }}
                          >
                            <option value="5">5 per page</option>
                            <option value="10">10 per page</option>
                            <option value="25">25 per page</option>
                            <option value="50">50 per page</option>
                          </select>

                          <nav aria-label="Page navigation">
                            <ul className="pagination pagination-sm mb-0">
                              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button
                                  className="page-link"
                                  onClick={() => handlePageChange(currentPage - 1)}
                                  disabled={currentPage === 1}
                                >
                                  <ChevronLeft size={18} />
                                </button>
                              </li>

                              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                let pageNum;

                                if (totalPages <= 5) {
                                  pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                  pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                  pageNum = totalPages - 4 + i;
                                } else {
                                  pageNum = currentPage - 2 + i;
                                }

                                return (
                                  <li
                                    key={pageNum}
                                    className={`page-item ${currentPage === pageNum ? 'active' : ''}`}
                                  >
                                    <button
                                      className="page-link"
                                      onClick={() => handlePageChange(pageNum)}
                                    >
                                      {pageNum}
                                    </button>
                                  </li>
                                );
                              })}

                              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button
                                  className="page-link"
                                  onClick={() => handlePageChange(currentPage + 1)}
                                  disabled={currentPage === totalPages}
                                >
                                  <ChevronRight size={18} />
                                </button>
                              </li>
                            </ul>
                          </nav>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-5 text-muted">
                      {searchQuery ? 'No results for your search.' : 'No email history available.'}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
