import { PathLike, readdirSync } from 'fs'
import { downloadFile, ensureDirExists, sendMessage } from './util'
import { configurationStore } from './config'

export const downloadPlugins = (
    pluginBranch: string,
    pluginFolder: PathLike
) => {
    const plugins = configurationStore.plugins.downloads

    ensureDirExists(pluginFolder)
    for (const [projectId, artifactFile] of Object.entries(
        plugins?.gitlab ?? {}
    )) {
        try {
            if (!artifactFile) continue
            const outputFile = artifactFile.toLowerCase()
            const sourceUrl = `https://gitlab.com/api/v4/projects/${projectId}/jobs/artifacts/${pluginBranch}/raw/Sponge/build/libs/${artifactFile}?job=build`
            sendMessage(`Now downloading ${outputFile} to ${pluginFolder}`)
            downloadFile(sourceUrl, `${pluginFolder}/${outputFile}`)
        } catch (e: any) {
            sendMessage(
                `There was an issue while downloading this plugin:`,
                e.message
            )
        }
    }
}

export const isPluginInstalled = (pluginName: string, softSearch = true, caseSensitive = false): boolean => {
    if(!caseSensitive) pluginName = pluginName.toLowerCase()
    const pluginFileNames = readdirSync(`${configurationStore.app.serverPath}/${configurationStore.app.installation.plugins.directory}`).map(fileName => !caseSensitive ? fileName.toLowerCase() : fileName)
    return pluginFileNames.some(fileName => fileName === pluginName || softSearch ? fileName.includes(pluginName) : false)
}