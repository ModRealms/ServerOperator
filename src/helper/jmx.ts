import fs, { PathLike } from 'fs'
import child_process from 'child_process'
import { sendMessage } from './util'
import { JVMArguments } from './jvm'
import { JavaVersion } from '../types'

export type ConnectionVariables = {
    host: string
    port: number
    username?: string
    password?: string
}

export const setupJMXAuth = (
    user: string,
    directory: PathLike,
    jmxSettings: ConnectionVariables
) => {
    try {
        fs.writeFileSync(
            `${directory}/jmxremote.password`,
            `${jmxSettings.username} ${jmxSettings.password}`,
            { encoding: 'utf8' }
        )
        fs.writeFileSync(
            `${directory}/jmxremote.access`,
            `${jmxSettings.username} readwrite create com.sun.management.*,com.oracle.jrockit.* unregister`,
            { encoding: 'utf8' }
        )
        child_process.execSync(`chmod -R 600 ${directory}/jmxremote.password`)
        sendMessage(`JMX Username: ${jmxSettings.username}`)
        sendMessage(`JMX Password: ${jmxSettings.password}`)
        sendMessage(`JMX Connection: ${jmxSettings.host}:${jmxSettings.port}`)
        return true
    } catch (e) {
        sendMessage(`JMX Connection: ${jmxSettings.host}:${jmxSettings.port}`)
        sendMessage(
            'Could not setup the JMX authentication files. For the meantime, authentication has been disabled.'
        )
        return false
    }
}

export const getJavaVersion = (): JavaVersion => {
    const versionString = child_process
        .execSync(`java -version 2>&1 | head -n 1 | awk -F '"' '{print $2}'`)
        .toString()
    if (versionString.startsWith('1.8.')) {
        return 8
    } else {
        return parseInt(versionString.split('.')[0])
    }
}
export const getJMXArguments = (
    path: PathLike,
    jmxPort: number,
    hostname: string,
    ssl = false,
    auth = true
): JVMArguments => {
    const args = {
        ['Dcom.sun.management.jmxremote.port']: jmxPort,
        ['Dcom.sun.management.jmxremote.rmi.port']: jmxPort,
        ['Dcom.sun.management.jmxremote.local.only']: false,
        ['Dcom.sun.management.jmxremote.authenticate']: auth,
        ['Djava.rmi.server.hostname']: hostname,
        ['Dcom.sun.management.jmxremote.ssl']: ssl,
        ['XX:+UnlockCommercialFeatures']: '',
        ['XX:+FlightRecorder']: '',
    } as JVMArguments

    if (auth) {
        args[
            'Dcom.sun.management.jmxremote.password.file'
        ] = `${path}/jmxremote.password`
        args[
            'Dcom.sun.management.jmxremote.access.file'
        ] = `${path}/jmxremote.access`
    }

    return args
}
