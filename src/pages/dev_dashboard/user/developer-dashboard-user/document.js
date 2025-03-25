import React, {useState, useRef, useEffect} from 'react';
import {documentUpload} from "../../../../api/user";

const DocumentList = ({data, setDocumentVisible}) => {
  const [documents, setDocuments] = useState([]);
  console.log(data.userDocuments)
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    setDocuments(data.userDocuments)
  })

  const filteredDocuments = documents.filter(doc =>
    doc.name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    doc.type?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  const handleDelete = (id) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const handleDownload = (document) => {
    alert(`Downloading document: ${document.name}`);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const newDocument = {
        id: Date.now(),
        name: file.name,
        type: getFileType(file.name),
        uploadDate: new Date().toISOString().split('T')[0],
        size: formatFileSize(file.size)
      };
      documentUpload(data.id, file)
      setDocuments([...documents, newDocument]);
    }
  };

  const getFileType = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    const typeMap = {
      'pdf': 'PDF',
      'doc': 'Document',
      'docx': 'Document',
      'xls': 'Spreadsheet',
      'xlsx': 'Spreadsheet',
      'ppt': 'Presentation',
      'pptx': 'Presentation',
      'jpg': 'Image',
      'jpeg': 'Image',
      'png': 'Image',
      'txt': 'Text'
    };
    return typeMap[extension] || 'Other';
  };


  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12 col-md-10 mx-auto">
          <div className="card shadow-sm">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h2 className="h4 mb-0">My Documents</h2>

              <div className="row mb-3">
                <div className="d-flex align-items-center">

                  <input
                    type="file"
                    ref={fileInputRef}
                    className="d-none"
                    onChange={handleFileUpload}
                  />
                  <button
                    className="btn btn-primary"
                    style={{marginRight: '10px'}}
                    onClick={() => fileInputRef.current.click()}
                  >
                    <i className="bi bi-upload me-2"></i>Upload
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => setDocumentVisible(false)}
                  >
                    <i className="bi bi-upload me-2"></i>Close
                  </button>
                </div>
              </div>
            </div>

            <div className="card-body p-0">
              {filteredDocuments.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  No documents match your search.
                </div>
              ) : (
                filteredDocuments.map((document, index) => (
                  <div
                    key={document.id}
                    className={`d-flex justify-content-between align-items-center p-3 ${index < filteredDocuments.length - 1 ? 'border-bottom' : ''}`}
                  >
                    <div className="d-flex align-items-center">
                      <i className="bi bi-file-earmark-text text-primary fs-4 me-3"></i>
                      <div>
                        <h5 className="mb-1">Document {index + 1}</h5>
                        <div className="text-muted small">
                          {/*<span>{document.type}</span> •*/}
                          <span className="ms-1">
                            <i className="bi bi-calendar me-1"></i>{document?.document_path}
                          </span> •
                          {/*<span className="ms-1">{document.size}</span>*/}
                        </div>
                      </div>
                    </div>

                    <div>
                      <button
                        className="btn btn-sm btn-outline-success me-2"
                        onClick={() => handleDownload(document)}
                        title="Download"
                      >
                        <i className="bi bi-download"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger me-2"
                        onClick={() => handleDelete(document.id)}
                        title="Delete"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        title="Options"
                      >
                        <i className="bi bi-three-dots-vertical"></i>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentList;
