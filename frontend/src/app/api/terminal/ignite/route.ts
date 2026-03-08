import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import os from 'os';

export async function POST() {
    const platform = os.platform();
    let command = '';

    const scriptPath = '/home/bajrangi/Wins/SYNAPSE/frontend/scripts/tactical_ignite.js';

    if (platform === 'linux') {
        // Wrap command for multiple Linux terminals
        command = `gnome-terminal -- node ${scriptPath} || konsole -e node ${scriptPath} || xfce4-terminal -e "node ${scriptPath}" || xterm -e "node ${scriptPath}"`;
    } else if (platform === 'darwin') {
        // macOS Terminal via AppleScript for reliability
        command = `osascript -e 'tell app "Terminal" to do script "node ${scriptPath}"' -e 'tell app "Terminal" to activate'`;
    } else if (platform === 'win32') {
        // Windows Terminal or CMD with /k to stay open
        command = `start wt node ${scriptPath} || start cmd /k node ${scriptPath}`;
    }

    return new Promise((resolve) => {
        if (!command) {
            resolve(NextResponse.json({ error: 'Unsupported platform' }, { status: 400 }));
            return;
        }

        exec(command, (error) => {
            if (error) {
                console.error(`Terminal ignition error: ${error}`);
                resolve(NextResponse.json({ error: 'Failed to ignite terminal' }, { status: 500 }));
            } else {
                resolve(NextResponse.json({ success: true }));
            }
        });
    });
}
