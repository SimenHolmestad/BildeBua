import type { AdminConfigResponse } from 'api';

export type QrCodeDescriptor = {
  name: string;
  information: string;
  content: string;
  type: 'url' | 'wifi';
};

export function deriveQrCodes(config: AdminConfigResponse): QrCodeDescriptor[] {
  const codes: QrCodeDescriptor[] = [];

  if (config.wifi_qr_code.enabled) {
    const { wifi_name, protocol, password, description } = config.wifi_qr_code;
    codes.push({
      name: 'wifi_qr_code',
      information: description || `Skann for å koble til ${wifi_name}`,
      content: `WIFI:S:${wifi_name};T:${protocol};P:${password};;`,
      type: 'wifi',
    });
  }

  const origin = window.location.origin;
  const url = config.forced_album
    ? `${origin}/album/${config.forced_album}`
    : `${origin}/`;
  codes.push({
    name: 'start_page_url',
    information: config.qr_codes.url_qr_code_text || 'Scan this qr code to go to BildeBua!',
    content: url,
    type: 'url',
  });

  return codes;
}
