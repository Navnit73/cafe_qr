export type BarcodeFormatName =
  | "QR_CODE"
  | "AZTEC"
  | "CODABAR"
  | "CODE_39"
  | "CODE_93"
  | "CODE_128"
  | "DATA_MATRIX"
  | "MAXICODE"
  | "ITF"
  | "EAN_13"
  | "EAN_8"
  | "PDF_417"
  | "RSS_14"
  | "RSS_EXPANDED"
  | "UPC_A"
  | "UPC_E"
  | "UPC_EAN_EXTENSION"
  | "UNKNOWN";

export type PayloadCategory =
  | "url"
  | "wifi"
  | "vcard"
  | "email"
  | "phone"
  | "sms"
  | "geo"
  | "product"
  | "text"
  | "json";

export interface ParsedWifi {
  type: "wifi";
  ssid: string;
  password?: string;
  security?: "WPA" | "WEP" | "nopass" | string;
  hidden?: boolean;
}

export interface ParsedVCard {
  type: "vcard";
  name?: string;
  formattedName?: string;
  phone?: string;
  email?: string;
  org?: string;
  title?: string;
  url?: string;
  address?: string;
  note?: string;
  rawVCard: string;
}

export interface ParsedEmail {
  type: "email";
  email: string;
  subject?: string;
  body?: string;
}

export interface ParsedPhone {
  type: "phone";
  phoneNumber: string;
}

export interface ParsedSms {
  type: "sms";
  phoneNumber: string;
  message?: string;
}

export interface ParsedGeo {
  type: "geo";
  latitude: number;
  longitude: number;
  query?: string;
}

export interface ParsedUrl {
  type: "url";
  url: string;
  hostname: string;
  isSecure: boolean;
}

export interface ParsedProduct {
  type: "product";
  code: string;
  format: string;
}

export interface ParsedJson {
  type: "json";
  jsonString: string;
  data: Record<string, unknown> | unknown[];
}

export interface ParsedText {
  type: "text";
  text: string;
}

export type ParsedPayload =
  | ParsedUrl
  | ParsedWifi
  | ParsedVCard
  | ParsedEmail
  | ParsedPhone
  | ParsedSms
  | ParsedGeo
  | ParsedProduct
  | ParsedJson
  | ParsedText;

export interface ScannedResult {
  id: string;
  rawText: string;
  format: BarcodeFormatName;
  timestamp: number;
  source: "camera" | "file" | "paste" | "sample";
  parsed: ParsedPayload;
}

export type CameraStatus =
  | "idle"
  | "requesting"
  | "active"
  | "paused"
  | "permission_denied"
  | "no_camera"
  | "error";

export interface CameraDevice {
  id: string;
  label: string;
}
