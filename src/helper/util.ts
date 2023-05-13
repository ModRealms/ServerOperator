import child_process from 'child_process'
import fs, { PathLike } from 'fs'

export const setupEULA = (serverPath: string) => {
    fs.writeFileSync(`${serverPath}/eula.txt`, 'eula=true', {
        encoding: 'utf8',
    })
}

export const ensureDirExists = (
    directory: string | PathLike
): string | PathLike => {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true })
    }
    return directory as PathLike
}

export const downloadFile = (address: string, output: PathLike) => {
    child_process.execSync(`curl -s -L "${address}" --output "${output}"`)
}

export const readJSON = (filePath: PathLike) => {
    try {
        return JSON.parse(fs.readFileSync(filePath, { encoding: 'utf8' }))
    } catch (e) {
        return {}
    }
}

export const writeJSON = (json: Object, filePath: PathLike) => {
    try {
        return fs.writeFileSync(filePath, JSON.stringify(json, undefined, 2))
    } catch (e: any) {
        sendMessage(
            `There was an issue while writing to ${filePath}`,
            e.message
        )
    }
}

export const sendMessage = (...message: string[]) => {
    console.log(`[Operator]`, ...message)
}
