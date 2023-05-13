import { readJSON, writeJSON } from '../util'
import fs, { PathLike } from 'fs'
import { configurationStore } from '../config'

export type GitlabProjectRecord = {
    [projectId: number]: string
}

export type PluginsConfiguration = {
    downloads: {
        gitlab: GitlabProjectRecord
    }
}

export const setupPluginsConfiguration = (
    operatorDirectory: PathLike
): PluginsConfiguration => {
    const pluginsConfigurationPath = `${operatorDirectory}/plugins.json`

    if (!fs.existsSync(pluginsConfigurationPath))
        writeJSON({}, pluginsConfigurationPath)
    const pluginsConfiguration = readJSON(
        pluginsConfigurationPath
    ) as PluginsConfiguration

    // If plugins have not been specified in the configuration file, provide our own defaults.
    if (configurationStore.app.minecraftVersion === 12) {
        if (Object.keys(!pluginsConfiguration?.downloads?.gitlab ?? [])) {
            pluginsConfiguration.downloads = {
                ...(pluginsConfiguration?.downloads ?? {}),
                // todo: this should not be hard-coded in the project
                gitlab: {
                    14547790: 'Punishments-sponge.jar',
                    14547656: 'Chat-sponge.jar',
                    13686960: 'ConnectionBridge-sponge.jar',
                    14547906: 'Rewards-sponge.jar',
                    14547729: 'Achievements-sponge.jar',
                    14548277: 'Chunkloading-sponge.jar',
                    14547898: 'Worlds-sponge.jar',
                    14547914: 'ShopMenu-sponge.jar',
                    14547749: 'Titles-sponge.jar',
                    14547955: 'commands-sponge.jar',
                    14940205: 'Restrictions-sponge.jar',
                    14986737: 'Backups-sponge.jar',
                    14547834: 'Announcements-sponge.jar',
                },
            }
        }
    }

    return pluginsConfiguration
}
