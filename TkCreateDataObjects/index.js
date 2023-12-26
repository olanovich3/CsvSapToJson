'use strict'

// Core packages

// Npm packages
import Triskell from 'triskell'
import xmlescape from 'xml-escape'
// Custom packages
import { NO_USERNAME_ERROR, NO_PASSWORD_ERROR } from './lib/error.js'

class TkCreateDataObjectsClass {
  constructor(config) {
    this.conf = {}
    config = config || {}
    if (!config.username) {
      throw new Error(NO_USERNAME_ERROR)
    } else if (!config.password) {
      throw new Error(NO_PASSWORD_ERROR)
    }
    for (let prop in config) {
      if (Object.hasOwn(config, prop)) {
        this.conf[prop] = config[prop]
      }
    }
    console.log('CONF')
    console.log(this.conf)

    this.triskell = new Triskell(this.conf)
    this.trLoginData = {
      username: this.conf.username,
      password: this.conf.password
    }
  }

  i = 0
  groupProjects = 5
  projectToSelect = null

  createDataObjects = function () {
    console.log('createDataObjects2')
    this.triskell.auth.loginSHA(this.trLoginData, (err, msg) => {
      if (err) {
        console.error(err)
      } else {
        console.info(msg)
        this.triskell.report.getReportData(
          {
            repParams: {
              REPORTID: this.conf.reports.createDataObject,
              valuesByParams:
                '' +
                this.conf.parameters.year +
                '#' +
                2021 +
                '##' +
                this.conf.parameters.month +
                '#' +
                11 +
                '##' +
                this.conf.parameters.projects +
                '#' +
                0
            }
          },
          function (err1, result) {
            if (err1) {
              console.error(err)
            } else {
              console.dir(result)
            }
          }
        )
      }
    })
  }

  runAll = function () {
    var me = this,
      paramid = me.conf.parameters.projects
    me.triskell.auth.loginSHA(this.trLoginData, (err, msg) => {
      if (err) {
        console.error(err)
      } else {
        console.log(msg, paramid)
        me.triskell.report.getParameterData(
          {
            params: {
              PARAMETER_ID: paramid
            }
          },
          function (error, result) {
            if (error) {
              console.log('TK ERROR: ', error)
            } else {
              me.projectToSelect = result.data['REP_PARAM_' + paramid]
              console.log('proccessNextProjects ', me.projectToSelect.length)
              me.proccessNextProjects()
            }
          }
        )
      }
    })
  }

  runSome = function (ids) {
    var me = this,
      projectToSelected = []
    ids = ids || me.conf.parametersValues.projects
    if (typeof ids === 'string') {
      ids = ids.split(',')
    } else if (typeof ids === 'number') {
      ids = ('' + ids).split(',')
    }
    for (let id of ids) {
      if (Number.isInteger(id * 1)) {
        projectToSelected.push({ id: id })
      }
    }
    me.triskell.auth.loginSHA(this.trLoginData, (err, msg) => {
      if (err) {
        console.error(err)
      } else {
        console.log(msg)
        me.projectToSelect = projectToSelected
        console.log('proccessNextProjects ', me.projectToSelect.length)
        me.proccessNextProjects()
      }
    })
  }

  proccessNextProjects = function () {
    var me = this,
      groupProjects = me.groupProjects
    if (me.i < me.projectToSelect.length /*&& i<=ii*/) {
      var projectsBlock = []
      console.log('loop from ', me.i)
      for (var k = 0; k < groupProjects && me.i < me.projectToSelect.length; k++, me.i++) {
        projectsBlock.push(me.projectToSelect[me.i])
      }
      console.log('loop to ', me.i)

      me.proccessBlock1(projectsBlock, function () {
        //me.proccessBlock2(projectsBlock,
        //function() {
        //pause(function() {
        me.proccessNextProjects()
        //})
        //}
        //);
      })
    } else {
      console.log(new Date().toLocaleString('fr-FR'), '>>> DONE', '\n')
      me.triskell.auth.logout()
    }
  }

  proccessBlock1 = function (projectsBlock, callback) {
    var me = this
    var valueparams = ''
    valueparams += '' + me.conf.parameters.year + '#' + me.conf.parametersValues.year
    valueparams += '##'
    valueparams += '' + me.conf.parameters.month + '#' + me.conf.parametersValues.month
    valueparams += '##'
    valueparams += '' + me.conf.parameters.projects + '#'
    for (let l = 0; l < projectsBlock.length; l++) {
      if (l > 0) {
        valueparams += ','
      }
      valueparams += projectsBlock[l].id
    }
    // call report
    me.triskell.report.getReportData(
      {
        repParams: {
          REPORTID: me.conf.reports.createDataObject,
          valuesByParams: valueparams
        }
      },
      function (error, result) {
        if (error) {
          console.log(error)
        } else if (result && result.success === false) {
          console.log('result.success===false')
          console.log(result)
        } else if (result && result.success && result.success === true) {
          var truncated = false
          var selectorsJoinData = []
          for (var selectorName in result.data) {
            var selectorData = result.data[selectorName]
            if (selectorName === 'datareport') {
              continue
            }
            if (selectorData.isTruncatedResult) {
              console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
              console.log('!!!!!!!!!!!!!!!!!!!DATA is being TRUNCATED!!!!!!!!!!!!!!!!!!!')
              console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
              truncated = true
              break
            } else {
              console.log('---------------------------------------------------------\n')
              console.log(
                'selectorName ' + selectorName + ' length ' + result.data[selectorName].res.length
              )
              console.log('---------------------------------------------------------\n')
              for (let row of result.data[selectorName].res) {
                selectorsJoinData.push(row)
              }
              console.log('---------------------------------------------------------\n')
            }
          }
          if (!truncated) {
            me.proccessStoredRes1(selectorsJoinData, callback)
          }
        } else {
          console.log('erro inesperado')
          console.log(error)
        }
      }
    )
  }

  proccessStoredRes1 = function (storedResData, callback) {
    var me = this

    var dataobjects = []
    for (let row of storedResData) {
      if (row.dataobjet_id && Number.isInteger(row.dataobjet_id * 1) && row.dataobjet_id * 1 > 0) {
        continue
      }

      let dataobject = []
      let attributes = []
      let relationships = []

      if (row.object) {
        dataobject.push({ object: xmlescape(row.object) })
      }
      if (row.name) {
        dataobject.push({ name: xmlescape(row.name) })
      }
      if (row.description) {
        dataobject.push({ description: xmlescape(row.description) })
      }
      if (row.stage) {
        dataobject.push({ stage: xmlescape(row.stage) })
      }
      if (row.pool) {
        dataobject.push({ pool: row.pool })
      }
      if (row.parentid) {
        dataobject.push({ parentid: row.parentid })
      }
      if (row.currency) {
        dataobject.push({ currency: row.currency })
      }

      for (let column of Object.keys(row)) {
        if (column.startsWith('attr_')) {
          if (
            (typeof row[column] === 'string' && row[column].length > 0) ||
            typeof row[column] === 'number'
          ) {
            attributes.push({
              attribute: [
                { name: column.substr(5) },
                { value: typeof row[column] === 'string' ? xmlescape(row[column]) : row[column] }
              ]
            })
          }
        }
      }

      if (attributes.length > 0) {
        dataobject.push({ attributes: attributes })
      }

      for (let column of Object.keys(row)) {
        if (column.startsWith('rel_')) {
          for (let actual of Object.keys(row.rel_)) {
            relationships.push({
              relationship: [
                { dataobjectid: row.rel_[actual].dataobjectid },
                {
                  type:
                    typeof row.rel_[actual].type === 'string'
                      ? xmlescape(row.rel_[actual].type)
                      : row.rel_[actual].type
                }
              ]
            })
          }
        }
      }

      if (relationships.length > 0) {
        dataobject.push({ relationships: relationships })
      }

      dataobjects.push({ dataobject: dataobject })
    }
    if (dataobjects.length > 0) {
      me.triskell.dataobject.createDataObjects({ dataobjects: dataobjects }, (error, result) => {
        if (error) {
          console.log('TRISKELL ERROR: ', error)
        }
        if (result) {
          console.log('result : \n', result)
        }
        if (callback) {
          callback(error, result)
        }
      })
    } else {
      if (callback) {
        callback()
      }
    }
  }
}

export default TkCreateDataObjectsClass
