import dgram from 'dgram';

export function createMagicPacket(mac: string, globalIP: string, port: number, deviceIP?: string) {
    return new Promise<void>((resolve, reject) => {
        const parts = mac.match(/[0-9A-Fa-f]{2}/g);
        if (!parts || parts.length !== 6) {
            return reject(new Error('Invalid MAC address'));
        }

        const buffer = Buffer.alloc(6 + (6 * 16), 0xff);
        for (let i = 0; i < 16; i++) {
            buffer.write(parts.join(''), 6 + (i * 6), 'hex');
        }

        const client = dgram.createSocket('udp4');
        const targetIP = deviceIP || globalIP;

        client.send(buffer, port, targetIP, (error) => {
            client.close();

            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}