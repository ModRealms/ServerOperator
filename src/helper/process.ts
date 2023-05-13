import child_process, {
    ChildProcess,
    SpawnOptionsWithoutStdio,
} from 'child_process'
import { sendMessage } from './util'

export const runServerProcess = (
    command: string,
    args: string[],
    options?: SpawnOptionsWithoutStdio
): ChildProcess => {
    sendMessage('Starting server process...')
    return child_process.spawn(command, args, {
        env: process.env,
        ...options,
    })
}
