'use client';
import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { TrashIcon, EyeIcon, XIcon } from '@heroicons/react/solid';
import { storage } from "../../../lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { fetchGraphQLData } from "@/lib/graphqlClient";

const MUTATION_ADD_ATTACHMENT = `
    mutation addAttachment($attachmentInput: NewAttachmentInput!) {
        addAttachment(attachmentInput: $attachmentInput) {
            status
            data {
                id
                name
                url
                type
                created_at
                updated_at
            }
            message
        }
    }
`;


export default function ImageUpload() {
  const [files, setFiles] = useState([]);
  const [displayImage, setDisplayImage] = useState(null);
  const [imageIds, setImageIds] = useState([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    console.log("files", files);
    console.log("imageIds", imageIds);
  }, [imageIds, files]);

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      name: file.name,
      size: file.size,
      progress: 0,
    }));
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  }, []);

  const uploadFiles = async () => {
    files.forEach(async (file) => {
      const storageRef = ref(storage, `images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file.file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setFiles((prevFiles) =>
            prevFiles.map((f) =>
              f.file.name === file.file.name ? { ...f, progress } : f
            )
          );
        },
        (error) => {
          console.error("Upload error: ", error);
        },
        async () => {
          try {
            const url = await getDownloadURL(storageRef);
            const fileType = file.file.type;
            const imageName = file.file.name;

            const variables = {
                attachmentInput: {
                    name: imageName,
                    url: url,
                    type: fileType,
                },
            };

            const response = await fetchGraphQLData(MUTATION_ADD_ATTACHMENT, variables);

            if (response.addAttachment && response.addAttachment.status === true) {
                setImageIds((prevIds) => [
                    ...prevIds,
                    { name: imageName, url, type: fileType },
                  ]);
                  // Remove the uploaded file from the list
                  setFiles((prevFiles) => prevFiles.filter((f) => f.file.name !== file.file.name));

                  console.log("Image uploaded successfully");
                  console.log(response.addAttachment.data);
            } else {
                console.error("Error saving attachment:", response.addAttachment.message);
            }
          } catch (err) {
            console.error("Error saving attachment:", err);
          }
        }
      );
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
  });

  // Remove image from the list and local storage
  const handleRemove = (fileToRemove) => {
    setFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter((file) => file.file.name !== fileToRemove.file.name);
      if (displayImage && displayImage.file.name === fileToRemove.file.name) {
        setDisplayImage(null);
      }
      return updatedFiles;
    });
  };

  // Remove image from storage and mongoDB
  const handleHardRemove = (fileToRemove) => {
    const storageRef = ref(storage, `images/${fileToRemove.file.name}`);
    deleteObject(storageRef).then(() => {

    
      setImageIds((prevIds) =>
        prevIds.filter((image) => image.name !== fileToRemove.file.name)
      );
    }).catch((error) => {
      console.error("Error removing image: ", error);
    }
    );
  }

  const openPreview = (file) => {
    setPreviewImage(file);
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
    setPreviewImage(null);
  };

  const handleSetDisplayImage = (file) => {
    setDisplayImage(file);
  };

  const allImages = [
    ...imageIds.map((image) => ({
      file: { name: image.name, type: image.type },
      url: image.url,
      isUploaded: true,
    })),
    ...files.map((file) => ({
      file: file.file,
      url: URL.createObjectURL(file.file),
      isUploaded: false,
    })),
  ];

  return (
    <div className="p-6 bg-gray-50 dark:bg-neutral-900 rounded-lg shadow-md">
      <label className="font-medium text-lg text-gray-800 dark:text-white">Product Images</label>
      <div
        {...getRootProps({
          className:
            "cursor-pointer p-12 flex justify-center items-center bg-white border border-dashed border-gray-300 rounded-xl transition hover:bg-gray-100 dark:bg-neutral-800 dark:border-neutral-600 dark:hover:bg-neutral-700",
        })}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          <p className="mt-1 text-xs text-gray-400 dark:text-neutral-400">
            Pick a file up to 2MB.
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        {allImages.map((image, index) => (
          <div
            key={index}
            className={`relative p-3 border border-solid rounded-xl ${
              displayImage && displayImage.file.name === image.file.name
                ? "border-blue-500 bg-blue-50 shadow-lg"
                : "border-gray-300 bg-white dark:bg-neutral-800 dark:border-neutral-600"
            }`}
          >
            <span
              className="flex justify-center items-center border border-gray-200 rounded-lg dark:border-neutral-700 cursor-pointer"
              onClick={() => openPreview(image)}
            >
              <img
                className="w-16 h-16 object-cover rounded-lg"
                src={image.url}
                alt={image.file.name}
              />
            </span>
            {!image.isUploaded && (
              <button
                type="button"
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                onClick={() => handleRemove(image)}
              >
                <TrashIcon className="w-5 h-5" aria-hidden="true" />
              </button>
            )}

            {/* Badge for selected image */}
            {displayImage && displayImage.file.name === image.file.name && (
              <span className="absolute top-2 left-2 px-2 py-1 text-xs text-white bg-blue-500 rounded-full">
                Display
              </span>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={uploadFiles}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        disabled={files.length === 0}
      >
        Upload
      </button>

      {isPreviewOpen && previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="relative p-6 bg-white rounded-lg shadow-lg">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={closePreview}
            >
              <XIcon className="w-6 h-6" />
            </button>
            <img
              src={previewImage.url}
              alt={previewImage.file.name}
              className="w-full h-full object-cover rounded-lg"
            />
            <button
              onClick={() => {
                handleSetDisplayImage(previewImage);
                closePreview();
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Set as Display Image
            </button>
            <button
                onClick={() => {
                    handleHardRemove(previewImage);
                    closePreview();
                }}
                className="mx-3 mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            > Delete </button>
          </div>
        </div>
      )}
    </div>
  );
}
