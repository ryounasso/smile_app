import React, { useEffect, MutableRefObject, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./tailwind.css";
import useInterval from "./components/useInterval";
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
  const [shouldClassify, setShouldClassify] = useState(false);
  const [facialState, setFacialState] = useState("わろたらアカンで");

  const URL: String =
    "https://teachablemachine.withgoogle.com/models/i0Jjpiv7w/";

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

  useInterval(() => {
    console.log(shouldClassify);
    if (classifier && shouldClassify) {
      classifier.classify(videoRef.current, (error: any, results: any) => {
        if (error) {
          console.error(error);
          return;
        }
        results.sort((a: any, b: any) => b.label.localeCompare(a.label));
        if (results[0].confidence > results[1].confidence) {
          setFacialState("わろてないなぁ");
        } else {
          setFacialState("わろてるやん");
        }
      });
    } else {
      setFacialState("わろたらあかんで");
    }
  }, 1000);

  return (
    <>
      <div className="container mx-auto">
        <div className="text-center">
          <h1 className="bg-blue-300 py-6 text-4xl text-white">
            笑ってはいけない○○時
          </h1>
          <video
            ref={videoRef}
            id="local-video"
            autoPlay
            playsInline
            muted
            // width={video.width}
            // height={video.height}
            width="600px"
            height="400px"
            style={{ transform: "scale(-1, 1)" }}
            className="block mx-auto my-4"
          />
        </div>
        <br />
        <div className="text-center">
          <button
            className="p-4 bg-blue-400 rounded text-white"
            onClick={() => setShouldClassify(!shouldClassify)}
          >
            {shouldClassify ? "停止" : "始める"}
          </button>
          <p className="my-4 text-4xl">{facialState}</p>
        </div>
        <Link
          className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded inline-block"
          to="/"
        >
          Topに戻る
        </Link>
      </div>
    </>
  );
};
