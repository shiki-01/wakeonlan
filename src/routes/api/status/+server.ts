import { json, type RequestHandler } from '@sveltejs/kit';
import net from 'net';
import dns from 'dns';
import dgram from 'dgram';

interface Body {
    deviceIP: string;
    globalIP: string;
    port: number;
}

export const POST: RequestHandler = async ({ request }) => {
    const body: Body = await request.json();
    const { deviceIP, globalIP, port } = body;

    if (!net.isIP(globalIP)) {
        return json({ online: false, message: "No globalIP" }, { status: 200 });
    }

    return new Promise((resolve) => {
        dns.lookup(deviceIP, (err) => {
            if (err) {
                resolve(json({ online: false, message: `Device IP lookup error: ${err.message}` }, { status: 500 }));
            } else {
                const message = Buffer.from('FF'.repeat(6) + deviceIP.replace(/\./g, ''), 'hex');
                const client = dgram.createSocket('udp4');

                client.send(message, port, globalIP, (err) => {
                    if (err) {
                        client.close();
                        resolve(json({ online: false, message: `UDP packet send error: ${err.message}` }, { status: 500 }));
                    } else {
                        client.close();
                        resolve(json({ online: true, message: "UDP packet sent successfully." }));
                    }
                });
            }
        });
    });
};
