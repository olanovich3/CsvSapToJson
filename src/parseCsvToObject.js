const results = []

export let filterDataLog
const parseCsvToObject = (nuevoContenido) => {
  /*Aquí estás dividiendo el contenido en líneas individuales. 
  La función split('\n') divide el texto en líneas basadas en saltos de línea.*/
  const rows = nuevoContenido.split('\n')
  /*Esta línea toma la primera línea de rows, que contiene los encabezados, 
  y los divide en un array utilizando la coma como separador. 
  Esto te da una lista de los nombres de las propiedades para los objetos resultantes.*/
  const headers = rows[0].split(';')
  /*El bucle for que sigue itera a través de cada línea en rows a partir del segundo elemento 
  (índice 1) hasta el final. Para cada línea, estás dividiendo la línea en columnas individuales 
  usando la coma como separador y luego creando un objeto. Luego, estás asignando cada valor de 
  columna al objeto usando los encabezados como claves. Finalmente, estás agregando cada objeto 
  a la matriz results.*/
  for (let i = 1; i < rows.length; i++) {
    const obj = {}
    const currentRow = rows[i].split(';')

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j].trim()] = currentRow[j]
    }

    results.push(obj)
  }

  // FILTRAMOS LOS DATOS CON LAS COLUMNAS QUE QUEREMOS.

  filterDataLog = results.filter(
    (line) =>
      line['Capítol'] &&
      line['Capítol'].includes('6') &&
      (line['St.'].includes('07') || line['St.'].includes('09'))
  )

  // MAPEAMOS EL ARRAY PARA QUE LOS OBJETOS VENGAN COMO SALDRÁ EN TK.

  const dataMap = filterDataLog.map((item) => {
    return {
      contrato: item['Expedient'],
      codi_SAP: item['Contr/Sub'],
      proveedor: item['Tercer - Nom'],
      dataobject_name: item['Doc.'],
      dataobject_description: item['Descripció'],
      import: item['Oblig.'],
      ejercicio: item['Exer'],
      data_aprovacio: item['D.Apr.'],
      validador_factura: item['Val.Fact.'],
      aprobador_factura: item['Apr.Fact.'],
      direccio: item['Desr.Of.Validació'],
      divisa: 'Euro'
    }
  })

  return dataMap
}

export default parseCsvToObject
