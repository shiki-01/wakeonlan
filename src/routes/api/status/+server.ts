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

    console.log(`Sending UDP packet to ${globalIP}:${port}...`);

    return new Promise((resolve) => {
        dns.lookup(deviceIP, (err, address, family) => {
            if (err) {
                console.log(`Device IP lookup error: ${err.message}`);
                resolve(json({ online: false, message: `Device IP lookup error: ${err.message}` }, { status: 500 }));
            } else {
                console.log(`Device IP: ${address} belongs to IP family: ${family}`);
                const message = Buffer.from('FF'.repeat(6) + deviceIP.replace(/\./g, ''), 'hex');
                const client = dgram.createSocket('udp4');

                client.send(message, port, globalIP, (err) => {
                    if (err) {
                        console.log(`UDP packet send error: ${err.message}`);
                        client.close();
                        resolve(json({ online: false, message: `UDP packet send error: ${err.message}` }, { status: 500 }));
                    } else {
                        console.log(`UDP packet sent to ${globalIP}:${port}.`);
                        client.close();
                        resolve(json({ online: true, message: "UDP packet sent successfully." }));
                    }
                });
            }
        });
    });
};
