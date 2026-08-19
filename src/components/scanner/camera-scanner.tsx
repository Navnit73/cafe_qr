"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Camera,
  CameraOff,
  Flashlight,
  FlashlightOff,
  RefreshCw,
  Volume2,
  VolumeX,
  AlertCircle,
  Play,
  Pause,
  CheckCircle,
  UploadCloud,
} from "lucide-react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import {
  BarcodeFormatName,
  CameraDevice,
  CameraStatus,
  ScannedResult,
} from "./scanner.types";
import {
  formatBarcodeType,
  parseBarcodePayload,
  playScanBeep,
  triggerHaptic,
} from "./scanner.utils";

interface CameraScannerProps {
  onScanSuccess: (result: ScannedResult) => void;
  onSwitchToFileScan: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

// Core formats prioritized for ultra-fast barcode/QR scanning
const SUPPORTED_FORMATS = [
  Html5QrcodeSupportedFormats.QR_CODE,
  Html5QrcodeSupportedFormats.EAN_13,
  Html5QrcodeSupportedFormats.EAN_8,
  Html5QrcodeSupportedFormats.UPC_A,
  Html5QrcodeSupportedFormats.UPC_E,
  Html5QrcodeSupportedFormats.CODE_128,
  Html5QrcodeSupportedFormats.CODE_39,
  Html5QrcodeSupportedFormats.CODE_93,
  Html5QrcodeSupportedFormats.DATA_MATRIX,
  Html5QrcodeSupportedFormats.AZTEC,
  Html5QrcodeSupportedFormats.PDF_417,
  Html5QrcodeSupportedFormats.ITF,
];

const SCAN_ELEMENT_ID = "qr-camera-reader-viewport";

export function CameraScanner({
  onScanSuccess,
  onSwitchToFileScan,
  soundEnabled,
  onToggleSound,
}: CameraScannerProps) {
  const [status, setStatus] = useState<CameraStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [devices, setDevices] = useState<CameraDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
  const [torchAvailable, setTorchAvailable] = useState<boolean>(false);
  const [torchOn, setTorchOn] = useState<boolean>(false);
  const [scanCooldown, setScanCooldown] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Stable references to prevent camera teardown on UI prop changes
  const onScanSuccessRef = useRef(onScanSuccess);
  const soundEnabledRef = useRef(soundEnabled);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isStartingRef = useRef<boolean>(false);
  const isStoppingRef = useRef<boolean>(false);
  const lastScannedTimeRef = useRef<number>(0);
  const lastScannedTextRef = useRef<string>("");

  useEffect(() => {
    onScanSuccessRef.current = onScanSuccess;
  }, [onScanSuccess]);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  // Clean stop scanner instance
  const stopScanner = useCallback(async () => {
    if (isStoppingRef.current) return;
    isStoppingRef.current = true;

    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        await scannerRef.current.clear();
      } catch (err) {
        console.warn("Error stopping camera scanner:", err);
      } finally {
        scannerRef.current = null;
      }
    }
    isStoppingRef.current = false;
  }, []);

  // Handle successful detection
  const handleDecodedCode = useCallback((decodedText: string, decodedResult: unknown) => {
    const now = Date.now();
    // Debounce duplicate scans of identical content within 2.0s
    if (
      decodedText === lastScannedTextRef.current &&
      now - lastScannedTimeRef.current < 2000
    ) {
      return;
    }

    lastScannedTextRef.current = decodedText;
    lastScannedTimeRef.current = now;

    // Visual feedback
    setScanCooldown(true);
    setTimeout(() => setScanCooldown(false), 900);

    // Audio & Haptic feedback
    if (soundEnabledRef.current) {
      playScanBeep();
    }
    triggerHaptic(50);

    // Format resolution
    const resultObj = decodedResult as {
      result?: { format?: { formatName?: string; format?: number } };
    };
    const rawFormat =
      resultObj?.result?.format?.formatName ||
      resultObj?.result?.format?.format ||
      "QR_CODE";
    const formatName: BarcodeFormatName = formatBarcodeType(rawFormat);

    const parsed = parseBarcodePayload(decodedText, formatName);

    const item: ScannedResult = {
      id: `scan-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      rawText: decodedText,
      format: formatName,
      timestamp: Date.now(),
      source: "camera",
      parsed,
    };

    onScanSuccessRef.current(item);
  }, []);

  // Start scanner
  const startScanner = useCallback(
    async (targetDeviceId?: string) => {
      if (isStartingRef.current) return;
      isStartingRef.current = true;
      setStatus("requesting");
      setErrorMessage("");

      try {
        await stopScanner();

        // Enumerate video devices
        try {
          const availableDevices = await Html5Qrcode.getCameras();
          if (availableDevices && availableDevices.length > 0) {
            setDevices(
              availableDevices.map((d, index) => ({
                id: d.id,
                label: d.label || `Camera ${index + 1}`,
              }))
            );
            if (!targetDeviceId) {
              const backCam = availableDevices.find(
                (d) =>
                  d.label.toLowerCase().includes("back") ||
                  d.label.toLowerCase().includes("rear") ||
                  d.label.toLowerCase().includes("environment")
              );
              targetDeviceId = backCam ? backCam.id : availableDevices[0].id;
              setSelectedDeviceId(targetDeviceId);
            }
          }
        } catch {
          // Camera enumeration requires permission first on some browsers
        }

        const scanner = new Html5Qrcode(SCAN_ELEMENT_ID, {
          formatsToSupport: SUPPORTED_FORMATS,
          verbose: false,
          experimentalFeatures: {
            useBarCodeDetectorIfSupported: true,
          },
        });
        scannerRef.current = scanner;

        const config = {
          fps: 15,
          qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
            const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
            const edgeSize = Math.floor(minEdge * 0.72);
            return {
              width: edgeSize,
              height: edgeSize,
            };
          },
          aspectRatio: 1.333333,
        };

        const cameraConfig = targetDeviceId
          ? { deviceId: { exact: targetDeviceId } }
          : { facingMode: "environment" };

        await scanner.start(
          cameraConfig,
          config,
          (decodedText, decodedResult) => {
            handleDecodedCode(decodedText, decodedResult);
          },
          () => {
            // Frame scanned, no code detected
          }
        );

        setStatus("active");
        setIsPaused(false);

        // Check flashlight capability
        try {
          const capabilities = scanner.getRunningTrackCapabilities();
          if (capabilities && "torch" in capabilities) {
            setTorchAvailable(true);
          } else {
            setTorchAvailable(false);
          }
        } catch {
          setTorchAvailable(false);
        }
      } catch (err: unknown) {
        console.error("Camera scanner start error:", err);
        const errStr = String(err).toLowerCase();
        if (
          errStr.includes("notallowederror") ||
          errStr.includes("permission") ||
          errStr.includes("denied")
        ) {
          setStatus("permission_denied");
        } else if (
          errStr.includes("notfounderror") ||
          errStr.includes("no camera") ||
          errStr.includes("devicesnotfound")
        ) {
          setStatus("no_camera");
        } else {
          setStatus("error");
          setErrorMessage(
            err instanceof Error ? err.message : "Unable to access camera feed."
          );
        }
      } finally {
        isStartingRef.current = false;
      }
    },
    [stopScanner, handleDecodedCode]
  );

  // Toggle torch / flashlight
  const handleToggleTorch = async () => {
    if (!scannerRef.current || !torchAvailable) return;
    try {
      const nextTorch = !torchOn;
      await scannerRef.current.applyVideoConstraints({
        advanced: [{ torch: nextTorch } as MediaTrackConstraintSet],
      });
      setTorchOn(nextTorch);
      triggerHaptic(30);
    } catch (e) {
      console.warn("Could not toggle flashlight:", e);
    }
  };

  // Flip between available cameras
  const handleFlipCamera = async () => {
    if (devices.length < 2) return;
    const currentIndex = devices.findIndex((d) => d.id === selectedDeviceId);
    const nextIndex = (currentIndex + 1) % devices.length;
    const nextDevice = devices[nextIndex];
    if (nextDevice) {
      setSelectedDeviceId(nextDevice.id);
      await startScanner(nextDevice.id);
      triggerHaptic(30);
    }
  };

  // Switch camera device via dropdown
  const handleDeviceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDeviceId = e.target.value;
    setSelectedDeviceId(newDeviceId);
    await startScanner(newDeviceId);
  };

  // Pause / Resume
  const handleTogglePause = () => {
    if (!scannerRef.current) return;
    if (isPaused) {
      scannerRef.current.resume();
      setIsPaused(false);
    } else {
      scannerRef.current.pause(true);
      setIsPaused(true);
    }
    triggerHaptic(30);
  };

  // Lifecycle: start on mount, clean on unmount
  useEffect(() => {
    const timer = setTimeout(() => {
      startScanner();
    }, 0);
    return () => {
      clearTimeout(timer);
      stopScanner();
    };
  }, [startScanner, stopScanner]);

  return (
    <div className="card bg-surface-1 border border-hairline rounded-2xl sm:rounded-3xl shadow-xs overflow-hidden flex flex-col w-full">
      {/* Streamlined Controls Toolbar */}
      <div className="px-3 py-2.5 sm:px-4 sm:py-3 border-b border-hairline-soft bg-canvas/60 flex items-center justify-between gap-2">
        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full shrink-0 ${
              status === "active" && !isPaused
                ? "bg-semantic-success animate-pulse"
                : status === "requesting"
                ? "bg-warning animate-ping"
                : "bg-ink-tertiary"
            }`}
          />
          <span className="text-xs font-semibold text-ink">
            {status === "active"
              ? isPaused
                ? "Scanner Paused"
                : "Live Camera"
              : status === "requesting"
              ? "Connecting..."
              : status === "permission_denied"
              ? "Camera Blocked"
              : "Camera Standby"}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Torch Toggle */}
          {torchAvailable && status === "active" && (
            <button
              type="button"
              onClick={handleToggleTorch}
              className={`btn btn-circle btn-xs sm:btn-sm border ${
                torchOn
                  ? "bg-warning text-warning-content border-warning"
                  : "bg-surface-1 border-hairline text-ink hover:bg-canvas"
              }`}
              title={torchOn ? "Turn off light" : "Turn on light"}
              aria-label="Toggle flashlight"
            >
              {torchOn ? <Flashlight className="w-3.5 h-3.5" /> : <FlashlightOff className="w-3.5 h-3.5" />}
            </button>
          )}

          {/* Pause / Resume */}
          {status === "active" && (
            <button
              type="button"
              onClick={handleTogglePause}
              className="btn btn-circle btn-xs sm:btn-sm bg-surface-1 border-hairline text-ink hover:bg-canvas"
              title={isPaused ? "Resume camera" : "Pause camera"}
              aria-label="Pause or resume"
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-semantic-success" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
          )}

          {/* Switch Camera (if >1 camera) */}
          {devices.length > 1 && status === "active" && (
            <button
              type="button"
              onClick={handleFlipCamera}
              className="btn btn-circle btn-xs sm:btn-sm bg-surface-1 border-hairline text-ink hover:bg-canvas"
              title="Flip camera"
              aria-label="Flip camera"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Sound Mute/Unmute */}
          <button
            type="button"
            onClick={() => {
              onToggleSound();
              triggerHaptic(30);
            }}
            className={`btn btn-circle btn-xs sm:btn-sm border ${
              soundEnabled
                ? "bg-surface-1 border-hairline text-fin-orange hover:bg-canvas"
                : "bg-canvas border-hairline text-ink-tertiary hover:text-ink"
            }`}
            title={soundEnabled ? "Mute scan audio" : "Enable scan audio"}
            aria-label="Toggle audio"
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Main Viewfinder Window */}
      <div className="relative bg-black w-full aspect-square sm:aspect-[4/3] max-h-[460px] flex items-center justify-center overflow-hidden">
        {/* Html5Qrcode video container */}
        <div
          id={SCAN_ELEMENT_ID}
          className="w-full h-full [&>video]:w-full [&>video]:h-full [&>video]:object-cover"
        />

        {/* Laser HUD Target Overlay */}
        {status === "active" && !isPaused && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {/* Viewfinder Target Frame */}
            <div className="relative w-56 h-56 sm:w-68 sm:h-68 rounded-2xl flex items-center justify-center">
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-3 border-l-3 border-fin-orange rounded-tl-xl" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-3 border-r-3 border-fin-orange rounded-tr-xl" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-3 border-l-3 border-fin-orange rounded-bl-xl" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-3 border-r-3 border-fin-orange rounded-br-xl" />

              {/* Animated Laser Line */}
              <div
                className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-fin-orange to-transparent shadow-[0_0_8px_#dd5b00]"
                style={{
                  animation: "scanner-laser 2s ease-in-out infinite alternate",
                }}
              />

              {/* Success Scanned Badge Overlay */}
              {scanCooldown && (
                <div className="absolute inset-0 bg-semantic-success/25 rounded-2xl flex items-center justify-center animate-in fade-in zoom-in-95 duration-150 backdrop-blur-2xs">
                  <div className="badge badge-lg bg-semantic-success text-white font-bold border-0 gap-1.5 shadow-md px-3.5 py-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Scanned</span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Guidance Label */}
            <div className="absolute bottom-4 text-center px-4">
              <span className="inline-block bg-black/75 backdrop-blur-sm text-white/90 text-xs px-3.5 py-1 rounded-full border border-white/10 shadow-xs font-medium">
                Align QR Code or Barcode inside frame
              </span>
            </div>
          </div>
        )}

        {/* Paused Overlay */}
        {status === "active" && isPaused && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <Pause className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-semibold">Camera is Paused</p>
            <button
              type="button"
              onClick={handleTogglePause}
              className="btn btn-primary btn-sm rounded-xl text-xs font-semibold px-4 shadow-none gap-1.5"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Resume Camera</span>
            </button>
          </div>
        )}

        {/* Connecting / Requesting */}
        {status === "requesting" && (
          <div className="absolute inset-0 bg-inverse-canvas flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
            <span className="loading loading-spinner loading-md text-fin-orange" />
            <div className="space-y-1">
              <p className="text-sm font-semibold">Opening Camera Feed...</p>
              <p className="text-xs text-white/60">
                Please allow camera access when prompted
              </p>
            </div>
          </div>
        )}

        {/* Permission Denied Alert */}
        {status === "permission_denied" && (
          <div className="absolute inset-0 bg-surface-1 flex flex-col items-center justify-center p-5 sm:p-6 text-center text-ink space-y-3.5 max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-full bg-error/10 text-error flex items-center justify-center">
              <CameraOff className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-ink">Camera Access Denied</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Allow camera permissions in your browser address bar settings to scan live codes.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => startScanner()}
                className="btn btn-primary btn-sm rounded-xl text-xs font-semibold px-4 shadow-none gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Camera</span>
              </button>
              <button
                type="button"
                onClick={onSwitchToFileScan}
                className="btn btn-ghost btn-sm rounded-xl text-xs font-semibold text-ink hover:bg-canvas gap-1.5"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload Image</span>
              </button>
            </div>
          </div>
        )}

        {/* No Camera Found */}
        {status === "no_camera" && (
          <div className="absolute inset-0 bg-surface-1 flex flex-col items-center justify-center p-5 sm:p-6 text-center text-ink space-y-3 max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-full bg-canvas border border-hairline flex items-center justify-center text-ink-muted">
              <CameraOff className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-ink">No Camera Found</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                No active camera detected on this device. You can scan by uploading an image.
              </p>
            </div>
            <button
              type="button"
              onClick={onSwitchToFileScan}
              className="btn btn-primary btn-sm rounded-xl text-xs font-semibold shadow-none gap-1.5"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload Image File</span>
            </button>
          </div>
        )}

        {/* Generic Error */}
        {status === "error" && (
          <div className="absolute inset-0 bg-surface-1 flex flex-col items-center justify-center p-5 sm:p-6 text-center text-ink space-y-3 max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-full bg-error/10 text-error flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-ink">Camera Unavailable</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                {errorMessage || "Make sure camera is not used by another application."}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => startScanner()}
                className="btn btn-primary btn-sm rounded-xl text-xs font-semibold shadow-none"
              >
                Retry
              </button>
              <button
                type="button"
                onClick={onSwitchToFileScan}
                className="btn btn-ghost btn-sm rounded-xl text-xs font-semibold"
              >
                Upload Image
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Multiple Camera Dropdown Selector (if >1 device) */}
      {devices.length > 1 && status === "active" && (
        <div className="px-3 py-2 sm:px-4 sm:py-2.5 border-t border-hairline-soft bg-surface-1 flex items-center justify-between gap-2 text-xs">
          <label htmlFor="camera-select-dropdown" className="text-ink-muted font-medium shrink-0 flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-fin-orange" />
            <span className="hidden sm:inline">Camera Device:</span>
          </label>
          <select
            id="camera-select-dropdown"
            value={selectedDeviceId}
            onChange={handleDeviceChange}
            className="select select-xs sm:select-sm select-bordered w-full max-w-xs text-xs font-medium rounded-lg bg-canvas text-ink border-hairline"
          >
            {devices.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
