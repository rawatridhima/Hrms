import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../../components/Loader/Loader";

const DragFiles = ({ children, className, acceptedFiles, value, onChange }) => {
  //states
  const inputRef = useRef();
  const [showImgView, setShowImgView] = useState({ val: null, show: false });

  //Methods
  const handleFileUpload = () => {
    const fileObj = inputRef.current.files && inputRef.current.files[0];
    if (!fileObj) {
      setShowImgView({ val: null, show: false });
      onChange(null);
      return;
    }
    const fileName = fileObj.name;
    const regex = new RegExp("[^.]+$");
    const extension = fileName.match(regex).toString();
    if (acceptedFiles.includes(extension.toLowerCase())) {
      if (extension === "pdf") {
        setShowImgView({ val: fileName, show: true, isPdf: true });
      } else {
        const imgLink = URL.createObjectURL(fileObj);
        setShowImgView({ val: imgLink, show: true, isPdf: false });
      }
      onChange(fileObj);
    } else {
      toast.error(`Only ${acceptedFiles.toString()} files are allowed.`);
      setShowImgView({ val: null, show: false, isError: true });
      onChange(null);
    }
  };
  const handleFileDrop = (e) => {
    e.preventDefault();
    inputRef.current.files = e.dataTransfer.files;
    handleFileUpload();
  };

  useEffect(() => {
    if (value) {
      const fileObj = value;
      if (!fileObj) {
        setShowImgView({ val: null, show: false });
      } else if (typeof fileObj == "string") {
        if (fileObj.includes("pdf"))
          setShowImgView({ val: "Pdf File", show: true, isPdf: true });
        else setShowImgView({ val: fileObj, show: true });
      } else {
        const fileName = fileObj.name;
        const regex = new RegExp("[^.]+$");
        const extension = fileName.match(regex).toString();
        if (extension === "pdf") {
          setShowImgView({ val: fileName, show: true, isPdf: true });
        } else {
          const imgLink = URL.createObjectURL(fileObj);
          setShowImgView({ val: imgLink, show: true, isPdf: false });
        }
      }
    }
  }, []);

  if (value && !showImgView.show && !showImgView.isError)
    return <Loader size={50} />;
  return (
    <div className="DragFiles">
      <input onChange={handleFileUpload} ref={inputRef} type="file" hidden />
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleFileDrop(e)}
        onClick={() => inputRef.current.click()}
        className={className}
      >
        {showImgView.show ? (
          showImgView.isPdf ? (
            <div className="pdfView">
              <img src={require("../../Assests/images/pdf.png")} alt="" />
              <h3>{showImgView.val}</h3>
            </div>
          ) : (
            <img src={showImgView.val} alt="Uploaded File" />
          )
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default DragFiles;
