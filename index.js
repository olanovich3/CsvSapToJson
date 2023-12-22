import { getFiles } from './src/getFiles.js'
import Triskell from 'triskell'
import dotenv from 'dotenv'
import { getParseWritten } from './src/getParseWritten.js'

dotenv.config({ path: '.env.dev' })
const HOST_URL = process.env.HOST_URL
const PASSWORD_TK = process.env.PASSWORD_TK
const USER_NAME_TK = process.env.USER_NAME_TK

const connectionTK = async () => {
  await new Promise((resolve) => {
    getFiles()
    resolve()
  })

  const triskellClient = new Triskell({
    host: HOST_URL,
    password: PASSWORD_TK,
    username: USER_NAME_TK
  })
  await new Promise((resolve) =>
    triskellClient.auth.loginSHA({ password: PASSWORD_TK, username: USER_NAME_TK }, (error) => {
      if (error) {
        console.log('error al Login', error)
      }
      resolve()
    })
  )

  const objectFromCsv = await new Promise((resolve) => {
    const result = getParseWritten()
    resolve(result)
  })

  console.log('objetoJason', objectFromCsv)
}

connectionTK()
