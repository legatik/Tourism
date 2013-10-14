Scraper = require('../models/scraper')
moment = require('moment')
cheerio = require('cheerio')
Iconv = require("iconv")
Buffer = require('buffer').Buffer
querystring = require('querystring')
request = require("request")

class Hotels extends Scraper

  constructor: (search) ->
    super
    @id = "hotels"
    sityDep = 469 #Краснодар
    country = 1189

    findCityFunction = (sityDep,country) =>
      dataGetCities =
        country:country
        holPack:""
      findCitysOptions =
        method:"POST"
        json:dataGetCities
        uri: "http://searchru1.anextour.com/SearchResult.aspx/BindHotelTownJson"
      request findCitysOptions, (err, res, body) =>
       cityJSON = JSON.parse(body.d)
       console.log cityJSON


    findHotelsFunction = (sityDep,country) =>
      dataGetHotels =
        country : country,
        depCity : sityDep,
        holPack : ''
      findCitysOptions =
        method:"POST"
        json:dataGetHotels
        uri: "http://searchru1.anextour.com/SearchResult.aspx/BindHotelListJson"
      request findCitysOptions, (err, res, body) =>
        hotelsJSON = JSON.parse(body.d)
#        console.log "body",hotelsJSON



    findHotelsFunction(sityDep,country)
    findCityFunction(sityDep,country)

module.exports = Hotels

