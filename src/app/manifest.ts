import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "QRVenues — QR Code Menus, Review Links & Free QR Studio",
    short_name: "QRVenues",
    description:
      "Create QR code menus, Google review links, Wi-Fi QR codes, WhatsApp QR codes, bulk QR batches, and scan barcodes free in your browser.",
    start_url: "/en-us",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#5645d4",
    categories: ["business", "utilities", "productivity"],
    icons: [
      {
        src: "/favicons.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
