import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import type { QrCodeDescriptor } from 'utils/qrCodeUtils';

type QrCodeProps = {
  descriptor: QrCodeDescriptor;
  size?: number;
  useCenterImage?: boolean;
};

const base = import.meta.env.BASE_URL;

const centerImageSrc: Record<string, string> = {
  url: `${base}qr-icons/camera-icon.png`,
  wifi: `${base}qr-icons/wifi-icon.png`,
};

const QrCode = ({ descriptor, size = 256, useCenterImage = true }: QrCodeProps) => {
  const imageSettings = useCenterImage && centerImageSrc[descriptor.type]
    ? {
        src: centerImageSrc[descriptor.type],
        height: Math.round(size * 0.25),
        width: Math.round(size * 0.25),
        excavate: true as const,
      }
    : undefined;

  return (
    <QRCodeSVG
      value={descriptor.content}
      size={size}
      level="H"
      imageSettings={imageSettings}
    />
  );
};

export default QrCode;
