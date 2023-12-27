//MAPEO PARA CREAR FACTURAS//

export const csvToTK = (csv) => {
  return csv.map((item) => {
    return {
      object: 'Contratos',
      name: item.dataobject_name,
      description: item.dataobject_description,
      stage: item.stage,
      pool: 'NONE',
      parentid: item.lineaPim_id,
      currency: 5
    }
  })
}

// Incluir ID del contrato al que pertenece la factura

export const includeDataObjectParentId = (array1, array2) => {
  for (let i = 0; i < array1.length; i++) {
    const currentName = array1[i].contrato
    const matchingObject = array2.find((obj) => obj.dataobject_name === currentName)
    if (matchingObject) {
      array1[i].dataobject_parent_id = matchingObject.dataobject_id
    }
  }
  return array1
}
