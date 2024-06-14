import type { Actions } from '@sveltejs/kit';
import wol from 'wake_on_lan';

export const actions: Actions = {
  default: async ({ request }) => {
    // request.bodyをテキストとして取得
    const bodyText = await request.text();
    // URLSearchParamsを使用して解析
    const params = new URLSearchParams(bodyText);
    // 必要なデータを取り出す
    const mac = params.get('mac');
    const address = params.get('address') ?? '';
    const port = params.get('port') ? parseInt(params.get('port')!) : 9;

    // MACアドレスの形式を検証するための正規表現
    const macAddressRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;

    // データの検証
    if (!mac || !macAddressRegex.test(mac)) {
      return {
        status: 400,
        body: { message: 'Invalid or missing MAC address' }
      };
    }

    return new Promise((resolve) => {
      wol.wake(mac, { address, port }, (error: any) => {
        if (error) {
          console.error(error);
          resolve({
            status: 500,
            body: { message: 'Failed to send magic packet' }
          });
        } else {
          resolve({
            status: 200,
            body: { message: 'Magic packet sent successfully' }
          });
        }
      });
    });
  }
};