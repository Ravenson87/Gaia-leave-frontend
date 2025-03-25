import React, { useState, useRef } from 'react';
import { Upload, Image, X } from 'lucide-react';

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

  const handleRemoveImage = () => {
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

  return (
    <div className="mb-4">
      <label className="form-label">Profile photo</label>
      <div
        className={`border rounded-4 p-4 text-center position-relative ${isDragging ? 'border-primary' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          minHeight: '200px',
          background: previewImage ? 'transparent' : '#f8f9fa',
          transition: 'all 0.2s ease',
          cursor: 'pointer'
        }}
        onClick={!previewImage ? openFileSelector : undefined}
      >
        {!!previewImage ? (
          <div className="position-relative">
            <img
              src={data?.profile_image}
              alt="Preview"
              className="img-fluid rounded-3 mx-auto"
              style={{ maxHeight: '300px' }}
            />
            <button
              className="btn btn-sm btn-danger position-absolute top-0 end-0 rounded-circle p-1 m-2"
              onClick={handleRemoveImage}
              type="button"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="py-4">
            <Upload size={48} className="text-secondary mb-3" />
            <h5>Click or drag the image here</h5>
            <p className="text-muted mb-0">Supported formats: JPG, PNG, GIF</p>
            <p className="text-muted small">Maximum size: 5MB</p>
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
