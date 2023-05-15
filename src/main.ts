import {
    downloadPlugins,
    ensureDirExists,
    sendMessage,
    setupConfiguration,
    setupEULA,
} from './helper'
import { getJavaVersion, getJMXArguments, setupJMXAuth } from './helper/jmx'
import {
    compileForgeJVMArguments,
    compileJVMArguments,
    getDefaultJVMArguments,
} from './helper/jvm'
import { setupInterface } from './helper/interface'
import { runServerProcess } from './helper/process'

const { app } = setupConfiguration()

const operatorDir = ensureDirExists(`${app.serverPath}/.operator`)

const javaVersion = getJavaVersion()
sendMessage(`Running Java ${javaVersion}`)

const jmxAuth = setupJMXAuth(app.docker.user, operatorDir, app.jmx)

setupEULA(app.serverPath)

if (app.installation.plugins.branch && app.installation.plugins.directory) {
    sendMessage('Now attempting to download the required plugins...')
    downloadPlugins(
        app.installation.plugins.branch,
        `${app.serverPath}/${app.installation.plugins.directory}`
    )
} else {
    sendMessage(
        'Downloading the required plugins is not possible without having specified the PLUGIN_BRANCH or PLUGIN_FOLDER environmental variables.'
    )
}

const serverProcess = runServerProcess('java', [
    `-Xms${app.memory}M`,
    `-Xmx${app.memory}M`,
    ...compileJVMArguments(getDefaultJVMArguments(javaVersion)),
    ...compileJVMArguments(
        javaVersion === 8 && app.jmx.port
            ? getJMXArguments(
                  operatorDir,
                  app.jmx.port,
                  app.jmx.host,
                  false,
                  jmxAuth
              )
            : {}
    ),
    `-Dhost=${app.host}`,
    ...(app.minecraftVersion >= 17 && app.forgeVersion
        ? compileForgeJVMArguments()
        : ['-jar', `${app.serverPath}/${app.jarFile}`]),
    '-nogui',
])

setupInterface(serverProcess)
