import { createMagicPacket } from '$lib/wol';

interface Body {
  mac?: string;
  globalIP?: string;
  deviceIP?: string;
  port?: string;
}

export async function POST({ request }: { request: Request }) {
  const body = await request.json() as Body;
  const { mac, globalIP, port, deviceIP } = body;

  const macAddressRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;

  if (!mac || !macAddressRegex.test(mac)) {
    return new Response(JSON.stringify({ message: 'Invalid or missing MAC address' }), { status: 400 });
  }

  const safeGlobalIP = globalIP || '';
  const safeDeviceIP = deviceIP || globalIP || '255.255.255.255';
  const safePort = port || '9';

  console.log(`Sending magic packet to ${safeDeviceIP} on port ${safePort} with MAC address ${mac}`);

  try {
    await createMagicPacket(mac, safeGlobalIP, parseInt(safePort, 10), safeDeviceIP);
    return new Response(JSON.stringify({ message: 'Magic packet sent successfully' }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'An error occurred' }), { status: 500 });
  }
}