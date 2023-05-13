job("Build & Deploy Image JDK 8") {
    startOn {
        gitPush {
            branchFilter {
                +"refs/heads/develop"
                +"refs/heads/production"
            }
        }
    }

    docker {
        env["SPACE_REGISTRY"] = Params("space_registry_name")
        env["REGISTRY_NAME"] = Params("docker_registry_name")

        beforeBuildScript {
            content = """
                export BRANCH_NAME=${'$'}(echo ${'$'}JB_SPACE_GIT_BRANCH | cut -d'/' -f 3)
                export REPOSITORY_NAME_LOWERCASE=${'$'}(echo ${'$'}JB_SPACE_GIT_REPOSITORY_NAME | tr '[:upper:]' '[:lower:]')
                export PROJECT_KEY_LOWERCASE=${'$'}(echo ${'$'}JB_SPACE_PROJECT_KEY | tr '[:upper:]' '[:lower:]')
                export REGISTRY_PATH=${'$'}SPACE_REGISTRY/p/${'$'}PROJECT_KEY_LOWERCASE/${'$'}REGISTRY_NAME/${'$'}REPOSITORY_NAME_LOWERCASE
            """
        }

        build {
            file = ".docker/Dockerfile"
            args["JAVA_VERSION"] = "8"
        }

        push("\$REGISTRY_PATH") {
            tags("\$BRANCH_NAME-jdk8")
        }
    }
}

job("Build & Deploy Image JDK 11") {
    startOn {
        gitPush {
            branchFilter {
                +"refs/heads/production"
            }
        }
    }

    docker {
        env["SPACE_REGISTRY"] = Params("space_registry_name")
        env["REGISTRY_NAME"] = Params("docker_registry_name")

        beforeBuildScript {
            content = """
                export BRANCH_NAME=${'$'}(echo ${'$'}JB_SPACE_GIT_BRANCH | cut -d'/' -f 3)
                export REPOSITORY_NAME_LOWERCASE=${'$'}(echo ${'$'}JB_SPACE_GIT_REPOSITORY_NAME | tr '[:upper:]' '[:lower:]')
                export PROJECT_KEY_LOWERCASE=${'$'}(echo ${'$'}JB_SPACE_PROJECT_KEY | tr '[:upper:]' '[:lower:]')
                export REGISTRY_PATH=${'$'}SPACE_REGISTRY/p/${'$'}PROJECT_KEY_LOWERCASE/${'$'}REGISTRY_NAME/${'$'}REPOSITORY_NAME_LOWERCASE
            """
        }

        build {
            file = ".docker/Dockerfile"
            args["JAVA_VERSION"] = "11"
        }

        push("\$REGISTRY_PATH") {
            tags("\$BRANCH_NAME-jdk11")
        }
    }
}

job("Build & Deploy Image JDK 17") {
    startOn {
        gitPush {
            branchFilter {
                +"refs/heads/production"
            }
        }
    }

    docker {
        env["SPACE_REGISTRY"] = Params("space_registry_name")
        env["REGISTRY_NAME"] = Params("docker_registry_name")

        beforeBuildScript {
            content = """
                export BRANCH_NAME=${'$'}(echo ${'$'}JB_SPACE_GIT_BRANCH | cut -d'/' -f 3)
                export REPOSITORY_NAME_LOWERCASE=${'$'}(echo ${'$'}JB_SPACE_GIT_REPOSITORY_NAME | tr '[:upper:]' '[:lower:]')
                export PROJECT_KEY_LOWERCASE=${'$'}(echo ${'$'}JB_SPACE_PROJECT_KEY | tr '[:upper:]' '[:lower:]')
                export REGISTRY_PATH=${'$'}SPACE_REGISTRY/p/${'$'}PROJECT_KEY_LOWERCASE/${'$'}REGISTRY_NAME/${'$'}REPOSITORY_NAME_LOWERCASE
            """
        }

        build {
            file = ".docker/Dockerfile"
            args["JAVA_VERSION"] = "17"
        }

        push("\$REGISTRY_PATH") {
            tags("\$BRANCH_NAME-jdk17")
        }
    }
}