import { createMagicPacket } from '$lib/wol';

export async function get(req: { query: { mac: any; address?: string; port?: string; }; }) {
  const { mac, address, port } = req.query;

  const macAddressRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;

  if (!mac || !macAddressRegex.test(mac)) {
    return { status: 400, body: { message: 'Invalid or missing MAC address' } };
  }

  const safeAddress = address || '255:255:255:255';
  const safePort = port || '9';

  try {
    await createMagicPacket(mac, safeAddress, parseInt(safePort, 10));
    return { status: 200, body: { message: 'Magic packet sent successfully' } };
  } catch (error) {
    console.error(error);
    return { status: 500, body: { message: 'Failed to send magic packet' } };
  }
}