import { exec } from 'child_process';

interface ActionRequest {
  action: string;
  address: string;
  port: string;
}

export async function POST({ request }: { request: Request }) {
  const { action } = (await request.json()) as ActionRequest;

  if (action !== 'shutdown' && action !== 'sleep') {
    return new Response(JSON.stringify({ error: 'Invalid action specified' }), { status: 400 });
  }

  let command: string = '';

  if (action === 'shutdown') {
    command = 'shutdown /s';
  } else if (action === 'sleep') {
    command = 'rundll32.exe powrprof.dll,SetSuspendState 0,1,0';
  }

  return new Promise<Response>((resolve) => {
    exec(command, (error) => {
			if (error) {
				console.error(`exec error: ${error}`);
				resolve(
					new Response(JSON.stringify({ error: 'Failed to execute command' }), { status: 500 })
				);
				return;
			}
			resolve(
				new Response(JSON.stringify({ message: `${action} command executed successfully` }), {
					status: 200
				})
			);
		});
  });
}