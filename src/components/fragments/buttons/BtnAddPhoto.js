import React, { useState, useRef } from "react";
import { FileImageTwoTone } from "@ant-design/icons";
import { Button } from "antd";

const BtnAddPhoto = ({ onPhotoAdded, qaId }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const fileInputRef = useRef(null);

  const handlePhotoChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile != null) {
      console.log(selectedFile);
      setSelectedPhoto(selectedFile);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Open the file input dialog
    }
  };

  const handleFileInputChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile != null) {
      setSelectedPhoto(selectedFile);
      handleUploadPhoto(selectedFile);
    }
  };

  const handleUploadPhoto = async (photo) => {
    try {
      const formData = new FormData();
      formData.append("photo", photo);

      const response = await fetch(
        `http://localhost:4000/upload-photo/${qaId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        // Reload the page after successful upload
        window.location.reload(false);
      } else {
        console.error("Error uploading photo. Status:", response.status);
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileInputChange}
      />
      <div>
        {selectedPhoto ? (
          <img
            src={URL.createObjectURL(selectedPhoto)}
            alt="Selected"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        ) : null
        // <FileImageTwoTone style={{ fontSize: "24px" }} />
        }
      </div>
      <Button onClick={handleUploadClick}>
        <FileImageTwoTone />
      </Button>
    </div>
  );
};

export default BtnAddPhoto;
