import { ChildProcess } from 'child_process'
import { sendMessage } from './util'
import { createInterface } from 'readline'
import { isPluginInstalled } from "./plugins";

export const setupInterface = (serverProcess: ChildProcess) => {
    serverProcess.stdout?.setEncoding('utf-8')
    serverProcess.stderr?.setEncoding('utf-8')

    serverProcess.stdout?.on('data', (data) => {
        console.log(data)
    })

    serverProcess.stderr?.on('data', (data) => {
        console.log(data)
    })

    serverProcess.on('exit', () => {
        sendMessage('Server process exited.')
        process.exit()
    })

    const readline = createInterface({
        input: process.stdin,
        output: process.stdout,
    })

    readline.on('line', (input) => {
        switch (input) {
            case 'test':
                sendMessage('Test command received')
                break
            case 'safeshutdown':
                // todo: we should reverse the logic and nest setup so that 'stop' is the default command always.
                input = !isPluginInstalled('ConnectionBridge') ? 'stop' : input
            default:
                serverProcess.stdin?.write(`${input}\n`)
        }
    })
}
