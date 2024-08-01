import * as fs from 'fs'
import * as path from 'path'
import { Command } from 'commander'

const copyFiles = (source: string, destination: string) => {
  fs.readdirSync(source).forEach((file) => {
    const srcFile = path.join(source, file)
    const destFile = path.join(destination, file)

    if (fs.statSync(srcFile).isDirectory()) {
      fs.mkdirSync(destFile, { recursive: true })
      copyFiles(srcFile, destFile)
    } else {
      fs.copyFileSync(srcFile, destFile)
    }
  })
}

export async function main() {
  const program = new Command()

  // Adding arguments for the type and folder name
  program
    .argument('<type>', 'project type (c for CHooks, js for JSHooks)')
    .argument('<folderName>', 'name of the output folder')

  // Parsing the command line arguments
  program.parse(process.argv)

  const type = program.args[0] as 'c' | 'js'
  if (type === 'c') {
    console.error('CHooks init is not integrated yet.')
  }
  const folderName = program.args[1]

  const templateDir = path.join(__dirname, 'init')
  const newProjectDir = path.join(process.cwd(), folderName)

  // Check if the output directory already exists
  if (fs.existsSync(newProjectDir)) {
    console.error(`Directory ${folderName} already exists.`)
    process.exit(1)
  }

  // Create the new project directory
  fs.mkdirSync(newProjectDir, { recursive: true })

  // Copy files based on the type
  if (type === 'c' || type === 'js') {
    copyFiles(templateDir, newProjectDir)
    console.log(
      `Created ${
        type === 'c' ? 'CHooks' : 'JSHooks'
      } project in ${newProjectDir}`
    )
  } else {
    console.error('Invalid type. Use "c" for CHooks or "js" for JSHooks.')
    process.exit(1)
  }
}
