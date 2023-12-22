import fs from 'fs'
import { log } from './logger.js'

const logger = log()

export const getParseWritten = async () => {
  try {
    const dataParseWritten = await new Promise((resolve) =>
      fs.readdir('../CsvSapToJson/parseWritten', (error, data) => {
        {
          if (error) {
            throw new Error(error)
          }

          resolve(data)
        }
      })
    )

    console.log(dataParseWritten)

    const dataParseWritten2 = await new Promise((resolve) =>
      fs.readFile(`../CsvSapToJson/parseWritten/${dataParseWritten[0]}`, (error, data) => {
        {
          if (error) {
            logger.error({message:'No hay Archivo de lectura en parseWritten en FTP'})
            throw new Error(error)
          }

          resolve(data)
        }
      })
    )

    await new Promise((resolve) =>
      fs.writeFile(`../CsvSapToJson//csvRead/${dataParseWritten[0]}`, dataParseWritten2, (error) => {
        if (error) {
          
          throw new Error(error)
        }
        resolve()
        logger.info({message:`Archivo csv:"${dataParseWritten[0]}" leido`})

      })
    )

    await new Promise((resolve) => {
      fs.unlink(`../CsvSapToJson/parseWritten/${dataParseWritten[0]}`, (error) => {
        if (error) {
          throw new Error(error)
        }
        resolve()
      })
    })

    const csvObject = JSON.parse(dataParseWritten2)

    return csvObject
  } catch (error) {
    console.log('error getParseWritten', error)
  }
}