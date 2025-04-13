import React, {useRef, useState} from 'react';
import {User, X} from 'lucide-react';

const ImageUploadField = ({ onImageChange, data }) => {
  const [previewImage, setPreviewImage] = useState(data?.profile_image);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        if (onImageChange) {
          onImageChange(file);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setPreviewImage(reader.result);
        if (onImageChange) {
          onImageChange(file);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onImageChange) {
      onImageChange(null);
    }
  };

  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const getInitials = () => {
    if (!data) return '';

    const firstInitial = data.first_name ? data.first_name.charAt(0).toUpperCase() : '';
    const lastInitial = data.last_name ? data.last_name.charAt(0).toUpperCase() : '';

    return firstInitial + lastInitial;
  };


  const getInitialsBackgroundColor = () => {
    const initials = getInitials();
    if (!initials) return '#0d6efd';

    let hash = 0;
    for (let i = 0; i < initials.length; i++) {
      hash = initials.charCodeAt(i) + ((hash << 5) - hash);
    }

    const h = Math.abs(hash % 360);
    return `hsl(${h}, 70%, 50%)`;
  };

  return (
    <div className="mb-4">
      <div
        className={`border shadow-sm rounded-3 p-3 text-center position-relative ${
          isDragging ? 'border-primary border-2' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          background: previewImage ? 'transparent' : '#f8f9fa',
          transition: 'all 0.2s ease',
          cursor: 'pointer',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
        onClick={!previewImage ? openFileSelector : undefined}
      >
        {previewImage ? (
          <div className="position-relative w-100">
            <img
              src={previewImage}
              alt="Profile"
              className="img-fluid rounded-3 mx-auto"
              style={{maxHeight: '250px', objectFit: 'cover'}}
            />
            <button
              className="btn btn-sm btn-danger position-absolute top-0 end-0 rounded-circle p-0 m-1"
              onClick={handleRemoveImage}
              type="button"
              style={{width: '24px', height: '24px'}}
            >
              <X size={14}/>
            </button>
          </div>
        ) : getInitials() ? (
          <div className="py-4">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center mb-3 mx-auto"
              style={{
                width: '120px',
                height: '120px',
                backgroundColor: getInitialsBackgroundColor(),
                color: 'white',
                fontSize: '2.5rem',
                fontWeight: 'bold'
              }}
            >
              {getInitials()}
            </div>
            <h6 className="mb-2">Upload Profile Photo</h6>
            <p className="text-muted small mb-0">Drag & drop or click to browse</p>
            <p className="text-muted small">JPG, PNG, GIF (max 5MB)</p>
          </div>
        ) : (
          <div className="py-4">
            <div className="bg-light rounded-circle p-4 d-inline-flex shadow-sm mb-3 mx-auto"
                 style={{ width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={45} className="text-secondary" />
            </div>
            <h6 className="mb-2">Upload Profile Photo</h6>
            <p className="text-muted small mb-0">Drag & drop or click to browse</p>
            <p className="text-muted small">JPG, PNG, GIF (max 5MB)</p>
          </div>
        )}

        <input
          type="file"
          className="d-none"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
      </div>
    </div>
  );
};

export default ImageUploadField;
