import child_process from 'child_process'
import { sendMessage } from './util'
import { JavaVersion } from '../types'
import { configurationStore } from './config'
import fs from 'fs'

export type JVMArguments = {
    [argument: string]: string | number | boolean
}

export const getDefaultJVMArguments = (
    javaVersion: JavaVersion
): JVMArguments => {
    const globalArguments = {
        ['Dfml.readTimeout']: 180,
        ['Dfml.doNotBackup']: true,
        ['Dfml.ignorePatchDiscrepancies']: true,
        ['Dfml.ignoreInvalidMinecraftCertificates']: true,
        ['Dterminal.ansi']: true,
        ['Dterminal.jline']: false,
        ['XX:+UnlockExperimentalVMOptions']: ''
    }

    let versionSpecificArguments = {}

    switch (javaVersion) {
        case 8:
            versionSpecificArguments = {
                Xmn128M: '',
                ['XX:+DisableExplicitGC']: '',
                ['XX:+UseConcMarkSweepGC']: '',
                ['XX:+UseParNewGC']: '',
                ['XX:+UseNUMA']: '',
                ['XX:+CMSParallelRemarkEnabled']: '',
                ['XX:MaxTenuringThreshold']: 15,
                ['XX:MaxGCPauseMillis']: 30,
                ['XX:GCPauseIntervalMillis']: 150,
                ['XX:+UseAdaptiveGCBoundary']: '',
                ['XX:-UseGCOverheadLimit']: '',
                ['XX:+UseBiasedLocking']: '',
                ['XX:SurvivorRatio']: 8,
                ['XX:TargetSurvivorRatio']: 90,
                ['XX:+UseFastAccessorMethods']: '',
                ['XX:+UseCompressedOops']: '',
                ['XX:+OptimizeStringConcat']: '',
                ['XX:+AggressiveOpts']: '',
                ['XX:ReservedCodeCacheSize']: '2048m',
                ['XX:+UseCodeCacheFlushing']: '',
                ['XX:SoftRefLRUPolicyMSPerMB']: 10000,
                ['XX:ParallelGCThreads']: 10,
                ['XX:HeapDumpPath']:
                    'MojangTricksIntelDriversForPerformance_javaw.exe_minecraft.exe.heapdump',
            }
            break;
        case 17:
            versionSpecificArguments = {
                Xmn128M: '',
                'XX:+UseZGC': '',
                'XX:+ParallelRefProcEnabled': '',
                'XX:MaxGCPauseMillis': 200,
                'XX:+DisableExplicitGC': '',
                'XX:+AlwaysPreTouch': '',
                'XX:InitiatingHeapOccupancyPercent': 15,
                'XX:SurvivorRatio': 32,
                'XX:+PerfDisableSharedMem': '',
                'XX:MaxTenuringThreshold': ''
            }
            break;
    }

    return {
        ...globalArguments,
        ...versionSpecificArguments,
    }
}

export const compileJVMArguments = (args: JVMArguments): string[] => {
    const argArray: string[] = []
    Object.entries(args).forEach(([key, value]) => {
        value = value ? `=${value}` : ''
        argArray.push(`-${key}${value}`)
    })
    return argArray
}

export const ensureJavaInstallation = (version: number) => {
    if (!process.env.JAVA_HOME) {
        sendMessage(
            `Java not found! Attempting to install AdoptiumJDK ${version}`
        )
        child_process.execSync(
            `apt-get update && apt-get install -y temurin-${version}-jdk`
        )
    }
}

export const compileForgeJVMArguments = (): string[] => {
    const forgeVersion = configurationStore.app.forgeVersion
    const serverPath = configurationStore.app.serverPath
    const argsPath = `${serverPath}/libraries/net/minecraftforge/forge/${forgeVersion}/unix_args.txt`
    if (!fs.existsSync(argsPath)) {
        sendMessage(
            `Forge version ${forgeVersion} is not installed, we cannot launch the server without it.`
        )
        process.exit()
    }

    return fs
        .readFileSync(argsPath, { encoding: 'utf-8' })
        .replace(/\n/g, ' ')
        .split(' ')
}
