import { useEffect, useRef, useState } from 'preact/hooks'
import './app.css'

async function getCameras() {
  const initStream = await navigator.mediaDevices.getUserMedia({video: true});
  const devices = await navigator.mediaDevices.enumerateDevices();
  const cameras = devices.filter((d) => d.kind === 'videoinput');
  initStream.getVideoTracks().forEach((t) => t.stop());

  return cameras;
}

export function App() {
  const videosRef = useRef<Record<string, HTMLVideoElement | null>>({});
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    initCameras();
  }, []);

  async function initCameras() {
    try {
      const cameras = await getCameras();
      setCameras(cameras);
    } catch (e) {
      setErrors((v) => [...v, e.toString()]);
    }
  }

  async function startStream(deviceId: string) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId } });
      videosRef.current[deviceId].srcObject = stream;
    } catch (e) {
      setErrors((v) => [...v, e.toString()]);
    }
  }

  return (
    <div class="page">
      <div class="page__header">
        {cameras.map((c) => (
          <button onClick={() => startStream(c.deviceId)}>{c.label}</button>
        ))}
      </div>
      <div class="page__body streams">
        {cameras.map((c) => (
          <div key={c.deviceId} class="streams__card">
            <video ref={(r) => videosRef.current[c.deviceId] = r} class="streams__video" autoPlay playsInline></video>
          </div>
        ))}
        <div class="page__errorlog">
          {errors.map((e, i) => (
            <p key={i}>{e}</p>
          ))}
        </div>
      </div>
      <ul class="page__info">
        {cameras.map((c) => (
          <li key={c.deviceId}>
            {c.label}: {c.deviceId}
          </li>
        ))}
      </ul>
    </div>
  )
}
