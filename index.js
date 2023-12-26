import { getFiles } from './src/getFiles.js'
import Triskell from 'triskell'
import dotenv from 'dotenv'
import TkCreateDataObjectsClass from './TkCreateDataObjects/index.js'
import { getParseWritten } from './src/getParseWritten.js'
import { includeDataObjectParentId } from './utils/utils.js'

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
  try {
    //QUERY DE CONTRATOS
    const tkContratos = await new Promise((resolve) =>
      triskellClient.report.getSelectorData(
        {
          repParams: {
            STORED_SELECTOR_ID: '54'
          }
        },
        (error, res) => {
          if (error) {
            console.log('error al obtener contratos')
          }

          resolve(res.data.res)
        }
      )
    )

    const objectSAPFromCsv = await new Promise((resolve) => {
      const result = getParseWritten()
      resolve(result)
    })

    console.log('objetoJason', objectSAPFromCsv)

    const objectSapId = includeDataObjectParentId(objectSAPFromCsv, tkContratos)

    console.log('facturad con ID padres', objectSapId)

    //CREAMOS FACTURAS SAP EN TRISKELL

    const createDataObjects = new TkCreateDataObjectsClass({
      protocol: 'https',
      host: HOST_URL,
      password: PASSWORD_TK,
      username: USER_NAME_TK
    })

    await new Promise((resolve) =>
      createDataObjects.triskell.auth.loginSHA(
        {
          password: PASSWORD_TK,
          username: USER_NAME_TK
        },
        resolve
      )
    )

    try {
      await new Promise((resolve) =>
        createDataObjects.proccessStoredRes1(objectSapId, (err, res) => {
          if (err) {
            console.log('error al crear factura', err)
          }
          resolve(res)
        })
      )
    } catch (error) {
      console.error('Error al crear factura', error)
    }
  } catch (error) {
    console.error('error'.error)
  }
}

connectionTK()
