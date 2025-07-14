import "./App.css";

import React, { useState, useRef } from "react";

const ImageUpload = () => {
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      let img = e.target.files[0];
      setShowVideo(false);
      setImage(URL.createObjectURL(img));
      setPicpresent(true);
      const video = videoRef.current;
      if (video) {
        const stream = video.srcObject;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach((track) => track.stop());
        }
      }
    }
  };
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const handleCaptureClick = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setShowVideo(true);
      setImage(false);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error("Error accessing camera.");
      setShowVideo(false);
    }
  };

  const handleSnap = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      const imageUrl = canvas.toDataURL("image/jpeg", 0.8);
      setImage(imageUrl);
      const stream = video.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      setShowVideo(false);
      setPicpresent(true);
    }
  };
  const [Picpresent, setPicpresent] = useState(false);
  const [msgPresent, setmsgPresent] = useState(false);

  const handleSend = async () => {
    const img = document.getElementById("img");
    const imageUrl = img.src;
    var message;

    const blob = await fetch(imageUrl).then((response) => response.blob());
    var base64data;
    var reader = new FileReader();
    reader.readAsDataURL(blob);
    //console.log(blob);
    reader.onload = async (event) => {
      const imgElement = new Image();
      imgElement.src = event.target.result;

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      canvas.width = imgElement.width;
      canvas.height = imgElement.height;

      context.drawImage(imgElement, 0, 0);

      const jpegImageUrl = canvas.toDataURL("image/jpeg", 0.8);

      let formData = new FormData();
      formData.append("image", jpegImageUrl);

      const iURL = "http://127.0.0.1:2900/process";

      try {
        const responseFile = await fetch(iURL, {
          method: "POST",
          body: formData,
        });
        const tbox = document.getElementById("msg");
        if (responseFile.status != 200) {
        }
        console.log(responseFile);
        message = responseFile;

        tbox.innerText = await message.text();

        console.log("Request sent");
        //console.log(await message.text());

        // Handle the response from the server here
      } catch (error) {
        console.error("Error sending the image:", error);
      }
    };
    setmsgPresent(true);

    //console.log(awaimessage);
  };
  return (
    <div>
      <div className="btndiv" style={{}}>
        <button
          display="block"
          style={{
            marginLeft: "auto",
            marginRight: "auto",
            marginBottom: "10px",
            padding: "0 8px",
          }}
          className="button"
          onClick={handleCaptureClick}
        >
          Use Webcam
        </button>
        <p>or</p>
        <input
          style={{
            //marginLeft: "43%",
            //marginRight: "auto",
            marginTop: "10px",
          }}
          className="button"
          type="file"
          accept="image/*"
          capture="camera"
          onChange={handleImageChange}
          display="block"
        />
      </div>
      {image && (
        <img
          id="img"
          className="imagrep"
          style={{
            marginTop: "30px",
            width: "216",
            height: "384px",
            objectFit: "cover",
            marginLeft: image ? "-200px" : "0px",
          }}
          src={image}
          alt="Uploaded"
        />
      )}
      <p
        id="msg"
        style={{
          display: msgPresent ? "block" : "none",
          paddingTop: "35px",
          paddingLeft: "10px",
          paddingRight: "10px",
          fontWeight: "bold",
          overflow: "scroll",
        }}
      ></p>
      <video
        ref={videoRef}
        className="videorep"
        style={{
          width: "216",
          height: "384px",
          display: showVideo ? "block" : "none",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "30px",
        }}
      />
      <button
        onClick={handleSnap}
        className="snapbtn"
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "30px",
          display: showVideo ? "block" : "none",
        }}
      >
        Snap
      </button>
      <button
        className="snapbtn"
        onClick={handleSend}
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "30px",
          display: Picpresent ? "block" : "none",
        }}
      >
        Send
      </button>
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </div>
  );
};

export default ImageUpload;
