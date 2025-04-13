import React from 'react';
import {Button, Card, Table} from 'react-bootstrap';

const DocumentsCard = ({user, setShowModal, removeDocument, showModal}) => {
  return (
    <Card className="mb-4 shadow-sm border-0">
      <Card.Header className="bg-white border-bottom-0 pt-4 pb-0 px-4">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">Document</h5>
          <Button
            variant="outline-primary"
            size="sm"
            className="rounded-pill px-3"
            onClick={() => setShowModal({...showModal, document: true})}
          >
            <i className="bi bi-upload me-1"></i>
            Add document
          </Button>
        </div>
      </Card.Header>
      <Card.Body className="px-4 py-4">
        <div className="table-responsive">
          <Table hover className="align-middle">
            <thead className="table-light">
            <tr>
              <th className="fw-medium text-muted" style={{fontSize: '0.9rem'}}>#</th>
              <th className="fw-medium text-muted" style={{fontSize: '0.9rem'}}>Document</th>
              <th className="fw-medium text-muted" style={{fontSize: '0.9rem'}}>Action</th>
            </tr>
            </thead>
            <tbody>
            {user.userDocuments.map((doc, idx) => (
              <tr key={doc.id}>
                <td className="fw-medium text-secondary">{idx + 1}</td>
                <td>
                  <div className="d-flex align-items-center">
                    <div className="bg-light rounded-3 p-2 me-3">
                      <i className="bi bi-file-earmark-pdf fs-4 text-danger"></i>
                    </div>
                    <div>
                      <span className="fw-medium">Document {idx + 1}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <a
                      href={doc.document_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-light rounded-pill px-3"
                    >
                      <i className="bi bi-eye me-1"></i>
                      Show
                    </a>
                    <Button
                      variant="light"
                      size="sm"
                      className="rounded-pill text-danger px-3"
                      onClick={() => removeDocument(doc.id)}
                    >
                      <i className="bi bi-trash me-1"></i>
                      Remove
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {user.userDocuments.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center py-4">
                  <div className="d-flex flex-column align-items-center opacity-75">
                    <i className="bi bi-file-earmark-x fs-1 text-muted mb-2"></i>
                    <p className="mb-0">There is no document</p>
                  </div>
                </td>
              </tr>
            )}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
};

export {DocumentsCard};
