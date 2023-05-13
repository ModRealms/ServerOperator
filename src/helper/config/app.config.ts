import dotenv from 'dotenv'
import { EnvironmentVariables } from '../config'
import { MinecraftVersion } from '../../types'
import { ConnectionVariables } from '../jmx'

export type AppConfiguration = {
    docker: {
        user: string
        home: string
    }
    serverPath: string
    memory: number
    jmx: ConnectionVariables
    host: string
    jarFile: string
    modpackTag: string
    minecraftVersion: MinecraftVersion
    installation: {
        plugins: {
            branch: string
            directory: string
        }
    }
    forgeVersion: string
}

export const setupAppConfiguration = (
    env: EnvironmentVariables
): AppConfiguration => {
    dotenv.config()
    const config = {
        docker: {
            user: env['USER'],
            home: env['HOME'],
        },
        serverPath: env['HOME'],
        memory: parseInt(env['MEMORY']),
        jmx: {
            host: env['SERVER_IP'],
            port: parseInt(env['JMX_PORT']),
            username: env['JMX_USERNAME'] || env['MODPACK_TAG'],
            password: env['JMX_PASSWORD'] || env['MODPACK_TAG'],
        },
        host: env['SERVER_IP'],
        jarFile: env['JAR_FILE'],
        minecraftVersion: parseInt(env['MINECRAFT_VERSION']),
        modpackTag: env['MODPACK_TAG'],
        forgeVersion: env['FORGE_VERSION'],
        installation: {
            plugins: {
                branch: env['PLUGIN_BRANCH'],
                directory: env['PLUGIN_FOLDER'],
            },
        },
    }
    process.chdir(config.serverPath)
    return config
}
