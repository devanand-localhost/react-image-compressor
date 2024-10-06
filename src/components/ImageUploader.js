import React, { useState } from 'react';
import Resizer from 'react-image-file-resizer';
import styled from 'styled-components';
import { FaCompress, FaDownload, FaImage, FaUpload } from 'react-icons/fa';

const Container = styled.div`
  display: flex;
  justify-content: center; /* Center the entire container horizontally */
  align-items: flex-start;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  margin-top: 20px;
  font-family: 'Arial', sans-serif;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const ImageContainer = styled.div`
  width: 60%;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ControlContainer = styled.div`
  width: 40%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-left: 20px;

  @media (max-width: 768px) {
    width: 100%;
    padding-left: 0;
    margin-top: 20px;
  }
`;

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 80vh;
  object-fit: cover;
  border-radius: 10px;
  border: 2px solid #ddd;

  @media (max-width: 768px) {
    max-height: 60vh;
  }
`;

const Button = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 15px;
  margin-top: 20px;
  margin-right: 10px;
  font-size: 18px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  width: 100%;

  &:hover {
    background-color: #45a049;
  }

  &:disabled {
    background-color: #a5a5a5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    font-size: 16px;
    padding: 12px;
  }
`;

const CompressAnotherButton = styled(Button)`
  background-color: #007bff;

  &:hover {
    background-color: #0056b3;
  }
`;

const InfoTable = styled.table`
  width: 100%;
  margin-top: 20px;
  font-size: 16px;
  border-collapse: collapse;
  text-align: left;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #ddd;
`;

const TableData = styled.td`
  padding: 10px;
`;

const FileInput = styled.input`
  display: none;
`;

const FileLabel = styled.label`
  background-color: #4caf50;
  color: white;
  padding: 15px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  margin-top: 20px;

  &:hover {
    background-color: #45a049;
  }

  @media (max-width: 768px) {
    font-size: 16px;
    padding: 12px;
  }
`;

const Slider = styled.input`
  margin-top: 20px;
  width: 100%;
`;

const WarningText = styled.p`
  color: #daa520;
  font-weight: bold;
  font-size: 16px;
  margin-top: 10px;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const HelperText = styled.p`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #007bff;
  text-align: center;
  font-family: 'Roboto Condensed', sans-serif;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const CenteredInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const ImageUploader = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [fileName, setFileName] = useState('');
  const [compressionRate, setCompressionRate] = useState(70);
  const [showWarning, setShowWarning] = useState(false);
  const [isCompressed, setIsCompressed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const formatSize = (sizeInBytes) => {
    if (sizeInBytes < 1024 * 1024) {
      return `${(sizeInBytes / 1024).toFixed(2)} KB`;
    }
    return `${(sizeInBytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(URL.createObjectURL(file));
      setOriginalSize(file.size);
      setFileName(file.name);
    } else {
      alert('Please select an image file');
    }
  };

  const handleCompression = () => {
    if (!selectedImage) {
      alert("Please select an image first.");
      return;
    }

    if (compressionRate > 85) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }

    const effectiveCompressionRate = 100 - compressionRate;

    const file = document.querySelector('input[type="file"]').files[0];
    setIsProcessing(true);

    Resizer.imageFileResizer(
      file,
      file.width,
      file.height,
      'JPEG',
      effectiveCompressionRate,
      0,
      (uri) => {
        setCompressedImage(uri);
        const base64StringLength = uri.length * (3 / 4) - (uri.indexOf('=') > 0 ? uri.length - uri.indexOf('=') : 0);
        setCompressedSize(base64StringLength);
        setIsCompressed(true);
        setIsProcessing(false);
      },
      'base64'
    );
  };

  const handleCompressAnother = () => {
    window.location.reload();
  };

  const downloadCompressedImage = (dataUrl) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    const fileExtension = '.jpg';
    a.download = `${fileName}_Compressed${fileExtension}`;
    a.click();
  };

  return (
    <Container>
      {compressedImage ? (
        <ImageContainer>
          <ImagePreview src={compressedImage} alt="Compressed Image" />
        </ImageContainer>
      ) : (
        selectedImage && (
          <ImageContainer>
            <ImagePreview src={selectedImage} alt="Original Image" />
          </ImageContainer>
        )
      )}

      <ControlContainer>
        <CenteredInputContainer>
          <HelperText>Step 1: Select an image to compress</HelperText>
          <FileLabel htmlFor="file-upload">
            <FaUpload style={{ marginRight: '5px' }} /> Select Image
          </FileLabel>
          <FileInput
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={!!compressedImage}
          />
          {/* Display original image name after selection */}
          {fileName && <p style={{ marginTop: '10px' }}> {fileName}</p>}
        </CenteredInputContainer>

        {selectedImage && (
          <>
            <HelperText>Step 2: Select Compression Rate</HelperText>
            <Slider
              type="range"
              min="10"
              max="100"
              value={compressionRate}
              onChange={(e) => setCompressionRate(parseInt(e.target.value))}
              disabled={!!compressedImage}
            />
            <p>Compression Rate: {compressionRate}%</p>



            {showWarning && (
              <WarningText>
                Warning: High compression (more than 85%) may lead to significant quality loss and distortion!
              </WarningText>
            )}

            <InfoTable>
              <tbody>
                <TableRow>
                  <TableData>Original Size:</TableData>
                  <TableData>{formatSize(originalSize)}</TableData>
                </TableRow>
                {compressedImage && (
                  <TableRow>
                    <TableData>Compressed Size:</TableData>
                    <TableData>{formatSize(compressedSize)}</TableData>
                  </TableRow>
                )}
              </tbody>
            </InfoTable>

            {!isCompressed && (
              <Button onClick={handleCompression} disabled={isProcessing}>
                {isProcessing ? 'Processing...' : (
                  <>
                    <FaCompress style={{ marginRight: '5px' }} /> Compress Image
                  </>
                )}
              </Button>
            )}
          </>
        )}

        {compressedImage && (
          <>
            <div>
              <Button onClick={() => downloadCompressedImage(compressedImage)}>
                <FaDownload style={{ marginRight: '5px' }} /> Download Compressed Image
              </Button>
              <CompressAnotherButton onClick={handleCompressAnother}>
                <FaImage style={{ marginRight: '5px' }} /> Compress Another Image
              </CompressAnotherButton>
            </div>
          </>
        )}
      </ControlContainer>
    </Container>
  );
};

export default ImageUploader;
