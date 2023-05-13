import { AppConfiguration, setupAppConfiguration } from './app.config'
import {
    PluginsConfiguration,
    setupPluginsConfiguration,
} from './plugins.config'
import { ensureDirExists } from '../util'

export type EnvironmentVariables = {
    [variable: string]: string
}

export type ConfigurationStore = {
    app: AppConfiguration
    plugins: PluginsConfiguration
}

export const configurationStore: ConfigurationStore = {} as ConfigurationStore

export const setupConfiguration = (): ConfigurationStore => {
    configurationStore.app = setupAppConfiguration(
        process.env as EnvironmentVariables
    )

    const operatorDir = ensureDirExists(
        `${configurationStore.app.serverPath}/.operator`
    )

    configurationStore.plugins = setupPluginsConfiguration(operatorDir)

    return configurationStore as ConfigurationStore
}
