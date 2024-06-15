import { exec } from 'child_process';

interface ActionRequest {
  action: string;
  address: string;
  port: string;
}

export async function POST({ request }: { request: Request }) {
  const { action, address, port } = await request.json() as ActionRequest;

  // アクションの検証
  if (action !== 'shutdown' && action !== 'sleep') {
    return new Response(JSON.stringify({ error: 'Invalid action specified' }), { status: 400 });
  }

  // コマンドの初期化
  let command: string = '';

  // コマンドの割り当て
  if (action === 'shutdown') {
    command = 'shutdown /s';
  } else if (action === 'sleep') {
    command = 'rundll32.exe powrprof.dll,SetSuspendState 0,1,0';
  }

  // コマンドの実行
  return new Promise<Response>((resolve) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        resolve(new Response(JSON.stringify({ error: 'Failed to execute command' }), { status: 500 }));
        return;
      }
      resolve(new Response(JSON.stringify({ message: `${action} command executed successfully` }), { status: 200 }));
    });
  });
}