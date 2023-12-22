import fs from 'node:fs'
import path from 'node:path'
import { log } from './logger.js'
import parseCsvToObject from './parseCsvToObject.js'

const folderPathFtp = '../../../Desktop/PruebaSAP' // Nos tienen que decir donde esta el FTP
const logger = log()
export const getFiles = () => {
  try {
    fs.readdir(folderPathFtp, (error, data) => {
      {
        if (error) {
          logger.error({ message: 'Error al leer directorios FTP' })
          throw new Error(error)
        }
        data.forEach((file) => {
          let filePathFtp = path.join(folderPathFtp, file)

          //LEEMOS FICHERO CSV CON UTF8
          fs.readFile(filePathFtp, 'utf8', (err, data) => {
            if (err) {
              logger.error({ message: 'Error al leer fichero de FTP' })
              console.error('Error al leer el archivo de entrada:', err)
              return
            }
            const filePathParse = 'parseWritten'
            const filePathOriginal = 'originalFiles'
            const fileName = file
            const finalFilePathParse = path.join(filePathParse, fileName)
            const finalFilePathOriginal = path.join(filePathOriginal, fileName)

            //Guardamos el archivo original sin parsear//
            fs.writeFile(finalFilePathOriginal, JSON.stringify(data), 'utf8', (err) => {
              if (err) {
                logger.error({ message: 'Error al escribir ficheroFTP original' })
                console.error('Error al escribir el archivo de salida original:', err)
                return
              }
            })

            const nuevoContenido2 = parseCsvToObject(data)
            console.log('Nuevo', nuevoContenido2)

            /*AQUI ESTAMOS CREANDO UN FICHERO CSV Y ENVIANDOLO A UNA CARPETA PARSEWRITTEN
           DESPUES DE HABER PARSEADO EL FICHERO INICIAL. Se hace string porque así es como 
           necesita que le mandemos el archivo*/
            fs.writeFile(finalFilePathParse, JSON.stringify(nuevoContenido2), 'utf8', (err) => {
              if (err) {
                logger.error({ message: 'Error al escribir ficheroFTP parseado' })
                console.error('Error al escribir el archivo de salida:', err)
                return
              }

              console.log('Se ha realizado la conversión exitosamente.')

              // fs.unlink(filePathFtp, (error, data) => {
              //   if (error) {
              //     console.log('no se ha borrado', error)
              //   } else {
              //     console.log('archivo borrado', data)
              //   }
              // })
            })
          })
        })
      }
    })
  } catch (error) {
    console.log('Error al leer el archivo', error)
  }
}
