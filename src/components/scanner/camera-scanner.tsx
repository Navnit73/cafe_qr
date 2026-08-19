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
  Smartphone,
  AlertCircle,
  Play,
  Pause,
  Maximize2,
  CheckCircle,
  Scan,
  Sparkles,
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

const SUPPORTED_FORMATS = [
  Html5QrcodeSupportedFormats.QR_CODE,
  Html5QrcodeSupportedFormats.AZTEC,
  Html5QrcodeSupportedFormats.CODABAR,
  Html5QrcodeSupportedFormats.CODE_39,
  Html5QrcodeSupportedFormats.CODE_93,
  Html5QrcodeSupportedFormats.CODE_128,
  Html5QrcodeSupportedFormats.DATA_MATRIX,
  Html5QrcodeSupportedFormats.MAXICODE,
  Html5QrcodeSupportedFormats.ITF,
  Html5QrcodeSupportedFormats.EAN_13,
  Html5QrcodeSupportedFormats.EAN_8,
  Html5QrcodeSupportedFormats.PDF_417,
  Html5QrcodeSupportedFormats.UPC_A,
  Html5QrcodeSupportedFormats.UPC_E,
  Html5QrcodeSupportedFormats.UPC_EAN_EXTENSION,
];

const SCAN_ELEMENT_ID = "qr-barcode-reader-viewfinder";

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
  const [isContinuous, setIsContinuous] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const lastScannedTimeRef = useRef<number>(0);
  const lastScannedTextRef = useRef<string>("");

  // Clean stop scanner instance
  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        await scannerRef.current.clear();
      } catch (err) {
        console.warn("Error stopping scanner:", err);
      } finally {
        scannerRef.current = null;
      }
    }
  }, []);

  // Handle successful barcode/QR detection
  const handleScanSuccessInternal = useCallback(
    (decodedText: string, decodedResult: unknown) => {
      const now = Date.now();
      // Prevent rapid spam of identical code within 2.5s
      if (
        decodedText === lastScannedTextRef.current &&
        now - lastScannedTimeRef.current < 2500
      ) {
        return;
      }

      lastScannedTextRef.current = decodedText;
      lastScannedTimeRef.current = now;
      setScanCooldown(true);
      setTimeout(() => setScanCooldown(false), 1200);

      // Feedback
      if (soundEnabled) {
        playScanBeep();
      }
      triggerHaptic(60);

      // Extract format
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

      onScanSuccess(item);

      if (!isContinuous) {
        // Pause scanning if single scan mode
        setIsPaused(true);
        if (scannerRef.current && scannerRef.current.isScanning) {
          scannerRef.current.pause(true);
        }
      }
    },
    [soundEnabled, isContinuous, onScanSuccess]
  );

  // Start scanner with specific camera or facing mode
  const startScanner = useCallback(
    async (deviceId?: string) => {
      setStatus("requesting");
      setErrorMessage("");

      try {
        await stopScanner();

        // Enumerate video devices first
        try {
          const availableDevices = await Html5Qrcode.getCameras();
          if (availableDevices && availableDevices.length > 0) {
            setDevices(
              availableDevices.map((d) => ({ id: d.id, label: d.label || `Camera ${d.id.slice(0, 5)}` }))
            );
            if (!deviceId && !selectedDeviceId) {
              const backCam = availableDevices.find(
                (d) =>
                  d.label.toLowerCase().includes("back") ||
                  d.label.toLowerCase().includes("rear") ||
                  d.label.toLowerCase().includes("environment")
              );
              deviceId = backCam ? backCam.id : availableDevices[0].id;
              setSelectedDeviceId(deviceId);
            }
          }
        } catch {
          // Camera enumeration may require active stream first
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
            const edgeSize = Math.floor(minEdge * 0.76);
            return {
              width: edgeSize,
              height: edgeSize,
            };
          },
          aspectRatio: 1.0,
        };

        const cameraConfig = deviceId
          ? { deviceId: { exact: deviceId } }
          : { facingMode: "environment" };

        await scanner.start(
          cameraConfig,
          config,
          (decodedText, decodedResult) => {
            handleScanSuccessInternal(decodedText, decodedResult);
          },
          () => {
            // Frame scanned but no code found (ignore)
          }
        );

        setStatus("active");
        setIsPaused(false);

        // Check torch capability
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
        console.error("Camera start error:", err);
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
            err instanceof Error ? err.message : "Failed to access camera feed."
          );
        }
      }
    },
    [stopScanner, selectedDeviceId, handleScanSuccessInternal]
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
      triggerHaptic(40);
    } catch (e) {
      console.warn("Could not toggle torch:", e);
    }
  };

  // Switch camera device
  const handleDeviceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDeviceId = e.target.value;
    setSelectedDeviceId(newDeviceId);
    await startScanner(newDeviceId);
  };

  // Flip between front and back camera
  const handleFlipCamera = async () => {
    if (devices.length < 2) return;
    const currentIndex = devices.findIndex((d) => d.id === selectedDeviceId);
    const nextIndex = (currentIndex + 1) % devices.length;
    const nextDevice = devices[nextIndex];
    if (nextDevice) {
      setSelectedDeviceId(nextDevice.id);
      await startScanner(nextDevice.id);
      triggerHaptic(40);
    }
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

  // Lifecycle: Auto start on mount, clean up on unmount
  useEffect(() => {
    startScanner();
    return () => {
      stopScanner();
    };
  }, [startScanner, stopScanner]);

  return (
    <div className="card bg-surface-1 border border-hairline rounded-3xl shadow-sm overflow-hidden flex flex-col">
      {/* Top Header Bar */}
      <div className="p-3.5 sm:p-4 border-b border-hairline-soft bg-canvas/60 backdrop-blur-sm flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-1 border border-hairline text-xs font-semibold text-ink shadow-2xs">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                status === "active" && !isPaused
                  ? "bg-semantic-success animate-pulse"
                  : status === "requesting"
                  ? "bg-warning animate-ping"
                  : "bg-ink-tertiary"
              }`}
            />
            <span>
              {status === "active"
                ? isPaused
                  ? "Paused"
                  : "Live Camera"
                : status === "requesting"
                ? "Starting..."
                : status === "permission_denied"
                ? "Blocked"
                : "Standby"}
            </span>
          </div>

          {/* Continuous Scan Toggle */}
          <button
            type="button"
            onClick={() => {
              setIsContinuous(!isContinuous);
              triggerHaptic(30);
            }}
            className={`btn btn-xs rounded-full border text-[11px] font-medium h-7 min-h-7 px-3 shadow-2xs transition-all ${
              isContinuous
                ? "bg-fin-orange text-white border-fin-orange shadow-sm"
                : "bg-surface-1 border-hairline text-ink-muted hover:text-ink"
            }`}
            title="Toggle Continuous Scanning"
          >
            {isContinuous ? "Continuous" : "Single Scan"}
          </button>
        </div>

        {/* Top Desktop Controls */}
        <div className="hidden sm:flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => {
              onToggleSound();
              triggerHaptic(30);
            }}
            className={`btn btn-circle btn-sm border shadow-2xs ${
              soundEnabled
                ? "bg-surface-1 border-hairline text-ink"
                : "bg-canvas border-hairline text-ink-tertiary"
            }`}
            title={soundEnabled ? "Mute scan chime" : "Enable scan chime"}
            aria-label="Toggle sound"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-fin-orange" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* Flashlight */}
          {torchAvailable && status === "active" && (
            <button
              type="button"
              onClick={handleToggleTorch}
              className={`btn btn-circle btn-sm border shadow-2xs ${
                torchOn
                  ? "bg-warning text-warning-content border-warning"
                  : "bg-surface-1 border-hairline text-ink"
              }`}
              title={torchOn ? "Turn off flashlight" : "Turn on flashlight"}
              aria-label="Toggle flashlight"
            >
              {torchOn ? (
                <Flashlight className="w-4 h-4" />
              ) : (
                <FlashlightOff className="w-4 h-4" />
              )}
            </button>
          )}

          {/* Pause / Resume */}
          {status === "active" && (
            <button
              type="button"
              onClick={handleTogglePause}
              className="btn btn-circle btn-sm bg-surface-1 border-hairline text-ink shadow-2xs hover:bg-canvas"
              title={isPaused ? "Resume scanning" : "Pause scanning"}
              aria-label="Pause or resume camera"
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>
          )}

          {/* Flip Camera (if >1 device) */}
          {devices.length > 1 && status === "active" && (
            <button
              type="button"
              onClick={handleFlipCamera}
              className="btn btn-circle btn-sm bg-surface-1 border-hairline text-ink shadow-2xs hover:bg-canvas"
              title="Flip camera"
              aria-label="Flip camera"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Viewfinder Window */}
      <div className="relative bg-black w-full min-h-[340px] sm:min-h-[420px] aspect-[4/3] sm:aspect-[16/10] flex items-center justify-center overflow-hidden">
        {/* Html5Qrcode video container */}
        <div
          id={SCAN_ELEMENT_ID}
          className="w-full h-full [&>video]:w-full [&>video]:h-full [&>video]:object-cover"
        />

        {/* HUD Scanner Reticle Overlay */}
        {status === "active" && !isPaused && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {/* Darkened backdrop with clear cutout */}
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 border-2 border-white/30 rounded-3xl flex items-center justify-center shadow-[0_0_0_9999px_rgba(0,0,0,0.55)] transition-all">
              {/* Corner Brackets */}
              <div className="absolute -top-1.5 -left-1.5 w-8 h-8 border-t-4 border-l-4 border-fin-orange rounded-tl-2xl shadow-[0_0_12px_rgba(255,86,0,0.6)]" />
              <div className="absolute -top-1.5 -right-1.5 w-8 h-8 border-t-4 border-r-4 border-fin-orange rounded-tr-2xl shadow-[0_0_12px_rgba(255,86,0,0.6)]" />
              <div className="absolute -bottom-1.5 -left-1.5 w-8 h-8 border-b-4 border-l-4 border-fin-orange rounded-bl-2xl shadow-[0_0_12px_rgba(255,86,0,0.6)]" />
              <div className="absolute -bottom-1.5 -right-1.5 w-8 h-8 border-b-4 border-r-4 border-fin-orange rounded-br-2xl shadow-[0_0_12px_rgba(255,86,0,0.6)]" />

              {/* Animated Laser Scanning Line */}
              <div
                className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-fin-orange to-transparent shadow-[0_0_16px_#ff5600]"
                style={{
                  animation: "scanner-laser 2.2s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate",
                }}
              />

              {/* Target Reticle Center Marker */}
              <div className="w-2.5 h-2.5 rounded-full bg-white/50" />

              {/* Success Flash Feedback */}
              {scanCooldown && (
                <div className="absolute inset-0 bg-semantic-success/30 rounded-3xl flex items-center justify-center animate-in fade-in zoom-in-95 duration-150 backdrop-blur-2xs">
                  <div className="badge badge-lg bg-semantic-success text-white font-bold border-0 gap-1.5 shadow-xl px-4 py-3">
                    <CheckCircle className="w-4 h-4" />
                    <span>Scanned!</span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Guidance Pill */}
            <div className="absolute bottom-16 sm:bottom-6 text-center px-4">
              <span className="inline-block bg-black/80 backdrop-blur-md text-white/95 text-xs px-4 py-1.5 rounded-full border border-white/15 shadow-md font-medium">
                Align QR Code or Barcode inside target frame
              </span>
            </div>
          </div>
        )}

        {/* Mobile Floating Thumb Action Bar (Inside Viewfinder for easy thumb reach) */}
        {status === "active" && (
          <div className="sm:hidden absolute bottom-3 left-0 right-0 px-4 flex items-center justify-center gap-3 pointer-events-auto z-10">
            {/* Torch */}
            {torchAvailable && (
              <button
                type="button"
                onClick={handleToggleTorch}
                className={`btn btn-circle btn-md h-12 w-12 min-h-12 border shadow-lg backdrop-blur-md transition-transform active:scale-90 ${
                  torchOn
                    ? "bg-warning text-warning-content border-warning"
                    : "bg-black/60 text-white border-white/20 hover:bg-black/80"
                }`}
                title="Toggle Torch"
                aria-label="Toggle Torch"
              >
                {torchOn ? <Flashlight className="w-5 h-5" /> : <FlashlightOff className="w-5 h-5" />}
              </button>
            )}

            {/* Pause / Resume */}
            <button
              type="button"
              onClick={handleTogglePause}
              className="btn btn-circle btn-md h-12 w-12 min-h-12 bg-black/60 text-white border border-white/20 shadow-lg backdrop-blur-md hover:bg-black/80 transition-transform active:scale-90"
              title={isPaused ? "Resume Scanner" : "Pause Scanner"}
              aria-label="Pause or Resume"
            >
              {isPaused ? <Play className="w-5 h-5 text-semantic-success" /> : <Pause className="w-5 h-5" />}
            </button>

            {/* Flip Camera */}
            {devices.length > 1 && (
              <button
                type="button"
                onClick={handleFlipCamera}
                className="btn btn-circle btn-md h-12 w-12 min-h-12 bg-black/60 text-white border border-white/20 shadow-lg backdrop-blur-md hover:bg-black/80 transition-transform active:scale-90"
                title="Flip Camera"
                aria-label="Flip Camera"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            )}

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={() => {
                onToggleSound();
                triggerHaptic(30);
              }}
              className="btn btn-circle btn-md h-12 w-12 min-h-12 bg-black/60 text-white border border-white/20 shadow-lg backdrop-blur-md hover:bg-black/80 transition-transform active:scale-90"
              title="Toggle Sound"
              aria-label="Toggle Sound"
            >
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-fin-orange" />
              ) : (
                <VolumeX className="w-5 h-5 text-white/50" />
              )}
            </button>
          </div>
        )}

        {/* Paused Overlay */}
        {status === "active" && isPaused && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-6 text-center text-white space-y-4">
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
              <Pause className="w-7 h-7 text-white" />
            </div>
            <div className="space-y-1 max-w-xs">
              <p className="text-base font-semibold">Scanner Paused</p>
              <p className="text-xs text-white/70">
                Single scan complete. Press resume to scan the next barcode.
              </p>
            </div>
            <button
              type="button"
              onClick={handleTogglePause}
              className="btn btn-primary btn-md rounded-xl text-xs font-semibold px-6 shadow-none gap-2"
            >
              <Play className="w-4 h-4" />
              <span>Resume Scanning</span>
            </button>
          </div>
        )}

        {/* Requesting State */}
        {status === "requesting" && (
          <div className="absolute inset-0 bg-inverse-canvas flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
            <span className="loading loading-spinner loading-lg text-fin-orange" />
            <div className="space-y-1">
              <p className="text-sm font-semibold">Opening Camera Stream...</p>
              <p className="text-xs text-white/60">
                Please allow camera permissions if prompted by your device.
              </p>
            </div>
          </div>
        )}

        {/* Permission Denied State */}
        {status === "permission_denied" && (
          <div className="absolute inset-0 bg-surface-1 flex flex-col items-center justify-center p-6 text-center text-ink space-y-4 max-w-md mx-auto">
            <div className="w-14 h-14 rounded-full bg-error/10 text-error flex items-center justify-center">
              <CameraOff className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-ink">Camera Access Blocked</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Your browser or operating system has camera permissions disabled for this page.
              </p>
            </div>

            <div className="bg-canvas border border-hairline rounded-2xl p-4 text-left w-full space-y-2.5 text-xs text-ink-muted">
              <div className="flex items-start gap-2">
                <span className="badge badge-xs bg-ink text-white font-bold px-1.5 py-1 rounded">1</span>
                <span>Tap the lock / settings icon <span className="font-semibold text-ink">🔒</span> in the address bar.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="badge badge-xs bg-ink text-white font-bold px-1.5 py-1 rounded">2</span>
                <span>Change <span className="font-semibold text-ink">Camera</span> permission to &quot;Allow&quot;.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="badge badge-xs bg-ink text-white font-bold px-1.5 py-1 rounded">3</span>
                <span>Tap <span className="font-semibold text-ink">&quot;Try Again&quot;</span> below.</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5 w-full pt-1">
              <button
                type="button"
                onClick={() => startScanner()}
                className="btn btn-primary btn-sm rounded-xl text-xs font-semibold px-4 gap-1.5 shadow-none"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>
              <button
                type="button"
                onClick={onSwitchToFileScan}
                className="btn btn-ghost btn-sm rounded-xl text-xs font-semibold text-ink hover:bg-canvas"
              >
                Upload Image Instead
              </button>
            </div>
          </div>
        )}

        {/* No Camera State */}
        {status === "no_camera" && (
          <div className="absolute inset-0 bg-surface-1 flex flex-col items-center justify-center p-6 text-center text-ink space-y-3 max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-full bg-canvas border border-hairline flex items-center justify-center text-ink-muted">
              <CameraOff className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-ink">No Camera Found</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                We couldn&apos;t detect a connected camera. You can still scan by uploading an image or screenshot.
              </p>
            </div>
            <button
              type="button"
              onClick={onSwitchToFileScan}
              className="btn btn-primary btn-sm rounded-xl text-xs font-semibold shadow-none mt-2"
            >
              Upload Barcode Image
            </button>
          </div>
        )}

        {/* Error State */}
        {status === "error" && (
          <div className="absolute inset-0 bg-surface-1 flex flex-col items-center justify-center p-6 text-center text-ink space-y-3 max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-full bg-error/10 text-error flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-ink">Unable to Access Camera</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                {errorMessage || "Make sure your camera is not in use by another tab or app."}
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

      {/* Desktop Camera Source Footer (if multiple cameras) */}
      {devices.length > 1 && status === "active" && (
        <div className="p-3 sm:p-4 border-t border-hairline-soft bg-surface-1 hidden sm:flex items-center justify-between gap-3 text-xs">
          <label htmlFor="camera-select-desktop" className="text-ink-muted font-medium shrink-0 flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-fin-orange" />
            <span>Camera Source:</span>
          </label>
          <select
            id="camera-select-desktop"
            value={selectedDeviceId}
            onChange={handleDeviceChange}
            className="select select-sm select-bordered w-full max-w-xs text-xs font-medium rounded-xl bg-canvas text-ink border-hairline"
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
