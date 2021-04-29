import React, { useEffect, MutableRefObject, useRef, useState } from "react";
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

  const videoRef = useRef<HTMLVideoElement>(
    null
  ) as MutableRefObject<HTMLVideoElement>;
  //カメラとマイクのon/offボタンのstateを管理
  const [mutedState, setMutedState] = useState(false);
  const micSetter = (isChecked: boolean) => setMutedState(isChecked);
  const [cameraState, setCameraState] = useState(false);
  const cameraSetter = (isChecked: boolean) => setCameraState(isChecked);
  const [gaugeData, setGaugeData] = useState([0.5, 0.5]);
  const [shouldClassify, setShouldClassify] = useState(false);
  const [facialState, setFacialState] = useState("表情を判断します");

  const URL: String =
    "https://teachablemachine.withgoogle.com/models/i0Jjpiv7w/";
  const modelURL: String = URL + "model.json";
  const metadataURL: String = URL + "metadata.json";

  //画面がロードされたタイミングでwebカメラに接続
  useEffect(() => {
    classifier = ml5.imageClassifier(URL + "model.json", () => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        });
    });
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
      classifier.classify(videoRef.current, (error: any, results: any) => {
        if (error) {
          console.error(error);
          return;
        }
        results.sort((a: any, b: any) => b.label.localeCompare(a.label));
        if (results[0].confidence > results[1].confidence) {
          console.log("真顔");
          setFacialState("真顔");
        } else {
          console.log("笑顔");
          setFacialState("わろてるやん");
        }
      });
    }
  }, 2000);

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
      <p>{facialState}</p>
    </>
  );
};
