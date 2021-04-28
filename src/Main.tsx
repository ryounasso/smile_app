import React, { useEffect, useRef, useState } from "react";
// import ml5 from "ml5";
const ml5 = require("ml5");

let classifier: any;

type MediaProps = {
  audio: boolean;
  video: {
    width: number;
    height: number;
  };
};

export const Main: React.FC<MediaProps> = ({ audio, video }) => {
  const constraints = {
    audio: false,
    video: {
      //   width: video.width,
      //   height: video.height,
      width: "600px",
      height: "400px",
    },
  };

  const videoRef = useRef<HTMLVideoElement>(null);
  //カメラとマイクのon/offボタンのstateを管理
  const [mutedState, setMutedState] = useState(false);
  const micSetter = (isChecked: boolean) => setMutedState(isChecked);
  const [cameraState, setCameraState] = useState(false);
  const cameraSetter = (isChecked: boolean) => setCameraState(isChecked);
  const [gaugeData, setGaugeData] = useState([0.5, 0.5]);
  const [shouldClassify, setShouldClassify] = useState(false);

  //画面がロードされたタイミングでwebカメラに接続
  useEffect(() => {
    classifier = ml5.imageClassifier(
      "../../tm-my-image-model/model.json",
      () => {
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: false })
          .then((stream) => {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          });
      }
    );
  }, []);

  //カメラのon/offボタンの実装
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        videoRef.current!.srcObject = cameraState ? null : stream;
      });
  }, [cameraState]);

  //マイクのon/offボタンの実装
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: mutedState ? false : true, video: true })
      .then(() => {});
    console.log(audio);
  }, [mutedState]);

  setInterval(() => {
    if (classifier && shouldClassify) {
      classifier.classify(videoRef.current, (error, results) => {
        if (error) {
          console.error(error);
          return;
        }
        results.sort((a, b) => b.label.localeCompare(a.label));
        setGaugeData(results.map((entry) => entry.confidence));
      });
    }
  }, 500);

  return (
    <>
      <h1>ここにメインページを書く</h1>
      <video
        ref={videoRef}
        id="local-video"
        autoPlay
        playsInline
        muted
        // width={video.width}
        width="400px"
        height="400px"
        style={{ transform: "scale(-1, 1)" }}
        // height={video.height}
      />
      <br />
      <button onClick={() => setShouldClassify(!shouldClassify)}>
        {shouldClassify ? "Stop classifying" : "Start classifying"}
      </button>
      {/* <Link href="/">
        <a>Back</a>
      </Link> */}
      {/* <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.3.1/dist/tf.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/@teachablemachine/image@0.8/dist/teachablemachine-image.min.js"></script> */}
    </>
  );
};
