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

//MAPEO ARRAY PARA ACTUALIZAR STAGES

export const updateStageToTK = (stage) => {
  return stage.map((item) => {
    if (item.dataobject_id && item.id_stage) {
      return {
        dataObjectId: String(item.dataobject_id),
        newLifecycle: String(item.id_stage)
      }
    } 
  }).filter((item) => item !== undefined)
}

//MAPEO ARRAY PARA ACTUALIZAR CONTRATOS//

// export const updateContractTk = (contract) => {
//   return contract.map((item) => {
//     return {
//       DATAOBJECT_ID: String(item.dataobject_id),

//       attr: {
//         // 762: item.tipContrate creeemos que no se actualiza,
//         538: item.estrategia,
//         735: item.proveedor,
//         761: item.Nif,
//         784: item.programa,
//         169: item.fecha_inicio,
//         170: item.fecha_fin,
//         555: item.inic_rev_admin,
//         556: item.tramitacion,
//         557: item.inicio_adjudicacion,
//         584: item.peticion_revision,
//         666: item.entrada_GPIC,
//         560: item.formalizacion
//       }
//     }
//   })
// }
