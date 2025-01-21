// Import React and hooks for state management
import React, { useState } from 'react';
// Import Resizer for image compression
import Resizer from 'react-image-file-resizer';
// Import icons for UI components
import { FaCompress, FaDownload, FaUpload } from 'react-icons/fa';
// Import external CSS file
import './ImageUploader.css';

const ImageUploader = () => {
  // State to store the selected image file
  const [selectedImage, setSelectedImage] = useState(null);
  // State to store the compressed image
  const [compressedImage, setCompressedImage] = useState(null);
  // State to store the original image size in bytes
  const [originalSize, setOriginalSize] = useState(0);
  // State to store the compressed image size in bytes
  const [compressedSize, setCompressedSize] = useState(0);
  // State to store the name of the uploaded file
  const [fileName, setFileName] = useState('');
  // State to manage the compression rate (default 70%)
  const [compressionRate, setCompressionRate] = useState(70);
  // State to show a warning for high compression rates
  const [showWarning, setShowWarning] = useState(false);
  // State to indicate whether the compression process is ongoing
  const [isProcessing, setIsProcessing] = useState(false);
  // State to show an error message if compression fails
  const [showError, setShowError] = useState(false);

  // Helper function to format file sizes into KB/MB
  const formatSize = (sizeInBytes) => {
    if (sizeInBytes < 1024 * 1024) {
      return `${(sizeInBytes / 1024).toFixed(2)} KB`;
    }
    return `${(sizeInBytes / 1024 / 1024).toFixed(2)} MB`;
  };

  // Handle the file upload and update state accordingly
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(URL.createObjectURL(file));
      setOriginalSize(file.size);
      setFileName(file.name);
      setShowError(false);
      setCompressedImage(null); // Reset compressed image on new upload
    } else {
      alert('Please select an image file');
    }
  };

  // Handle the image compression process
  const handleCompression = () => {
    if (!selectedImage) {
      alert('Please select an image first.');
      return;
    }

    // Show a warning if compression rate exceeds 85%
    if (compressionRate > 85) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }

    // Calculate the effective compression rate
    const effectiveCompressionRate = 100 - compressionRate;

    // Get the file object from the file input
    const file = document.querySelector('input[type="file"]').files[0];
    setIsProcessing(true);

    // Use Resizer to compress the image
    Resizer.imageFileResizer(
      file,
      file.width,
      file.height,
      'JPEG',
      effectiveCompressionRate,
      0,
      (uri) => {
        const base64StringLength =
          uri.length * (3 / 4) - (uri.indexOf('=') > 0 ? uri.length - uri.indexOf('=') : 0);
        setCompressedSize(base64StringLength);
        if (base64StringLength > originalSize) {
          setShowError(true);
          setCompressedImage(null); // Clear compressed image if error occurs
        } else {
          setCompressedImage(uri);
          setShowError(false);
        }
        setIsProcessing(false);
      },
      'base64'
    );
  };

  // Function to download the compressed image
  const downloadCompressedImage = (dataUrl) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    const fileExtension = '.jpg';
    a.download = `${fileName}_Compressed${fileExtension}`;
    a.click();
  };

  return (
    <div className="container">
      {/* Display the compressed or original image */}
      {compressedImage ? (
        <div className="image-container">
          <img src={compressedImage} alt="Compressed version of the uploaded file" className="image-preview" />
        </div>
      ) : (
        selectedImage && (
          <div className="image-container">
            <img src={selectedImage} alt="Original uploaded file" className="image-preview" />
          </div>
        )
      )}

      <div className="control-container">
        <div className="centered-input-container">
          {/* Step 1: File upload section */}
          <p className="helper-text">Step 1: Select an image to compress</p>
          <label htmlFor="file-upload" className="file-label">
            <FaUpload style={{ marginRight: '5px' }} /> Select Image
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="file-input"
            disabled={!!compressedImage}
          />
          <h5>* Images are not stored anywhere. <br /> No backend / server is involved *</h5>
          {/* Display uploaded file name */}
          {fileName && <p style={{ marginTop: '10px' }}>{fileName}</p>}
        </div>

        {selectedImage && (
          <>
            {/* Step 2: Compression rate selection */}
            <p className="helper-text">Step 2: Select Compression Rate</p>
            <input
              type="range"
              min="10"
              max="100"
              value={compressionRate}
              onChange={(e) => setCompressionRate(parseInt(e.target.value))}
              className="slider"
            />
            <p>Compression Rate: {compressionRate}%</p>

            {/* Warning for high compression rates */}
            {showWarning && (
              <p className="warning-text">
                High compression (more than 85%) may lead to significant quality loss and distortion!
              </p>
            )}

            {/* Table showing original and compressed sizes */}
            <table className="info-table">
              <tbody>
                <tr className="table-row">
                  <td className="table-data">Original Size:</td>
                  <td className="table-data">{formatSize(originalSize)}</td>
                </tr>
                {compressedImage && (
                  <tr className="table-row">
                    <td className="table-data">Compressed Size:</td>
                    <td className="table-data">{formatSize(compressedSize)}</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Compression button */}
            <button onClick={handleCompression} className="button" disabled={isProcessing}>
              {isProcessing ? (
                'Processing...'
              ) : (
                <>
                  <FaCompress style={{ marginRight: '5px' }} />
                  {(showError || compressedImage) ? 'Compress Image Again' : 'Compress Image'}
                </>
              )}
            </button>
          </>
        )}

        {/* Error message for compression failure */}
        {showError && (
          <p className="error-text">
            Image cannot be compressed this much because of its properties. Please try changing Compression Rate.
          </p>
        )}

        {/* Button to download compressed image */}
        {compressedImage && !showError && (
          <>
            <button onClick={() => downloadCompressedImage(compressedImage)} className="button">
              <FaDownload style={{ marginRight: '5px' }} /> Download Compressed Image
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
