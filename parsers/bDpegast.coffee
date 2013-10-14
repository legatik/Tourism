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
    sityDep = 144 

    iconverFunction  = (body) =>
      body = new Buffer(body, 'binary')
      conv = new Iconv.Iconv('windows-1251', 'utf8')
      body = conv.convert(body).toString()
      return body

    findCityFunction = (sityDep,cityArive) =>
      dataGetCities =
        samo_action:"STATEINC"
        TOWNFROMINC: sityDep
        STATEINC   : cityArive
        "_":new Date * 1
      findCitysOptions =
        encoding: 'binary'
        method:"GET"
        qs:dataGetCities
        uri: "http://pegast.ru/samo5/search_tour_person?"

      request findCitysOptions, (err, res, body) =>
        cityArr = []
        body = iconverFunction(body)
        cityArrTxt = body.substring(body.indexOf('samo.controls.TOWNTO).html(')+27, body.indexOf(");samo.jQuery(samo.controls.MEAL"))
        $ = cheerio.load cityArrTxt
        cityHtmlArr =$("div")
        cityHtmlArr.map (index,element) ->
          cityOne = {}
          cityOne.postcityArr = []
          labelArr = $(element).find("label")
          labelArr.map (i,el) ->
            if i == 0
              cityOne.globalName = $(el).text()
            else
              arr =[
                $(el).text().replace(/[ \n\t\r\\n\\]+/g,""),
                $(el).find("input").val().replace(/[ \n\t\r\\n\\/"]+/g,"")
              ]
              cityOne.postcityArr.push(arr)
          cityArr.push cityOne
        hotelsArrTxt = body.substring(body.indexOf('HOTELS).add_hotels(')+19, body.indexOf(");samo.jQuery(samo.controls.hotelsearch"))
        hotelsArr = eval("(" + hotelsArrTxt + ")")
        dataBd = []
        cityArr.forEach (citys) ->
          citys.postcityArr.forEach (infData) ->
            cityId = infData[1]
            cityName = infData[0]
            forBd = {}
            forBd.cityName = cityName
            forBd.cityId = cityId
            hotelsForBD = hotelsArr.filter (hotel) ->
              if (hotel.townKey)*1 == (cityId)*1 then return hotel
            forBd.hotels= hotelsForBD
            dataBd.push forBd
        console.log "dataBd",JSON.stringify dataBd
        

    dataGetCountries =
      samo_action:"TOWNFROMINC"
      TOWNFROMINC: sityDep
      "_":new Date * 1
    findCountryOptions =
      method:"GET"
      qs:dataGetCountries
      uri: "http://pegast.ru/samo5/search_tour_person?"
    request findCountryOptions, (err, res, body) =>
      countArrTxt = body.substring(body.indexOf('STATEINC).addOptions(')+22, body.indexOf(");samo.jQuery(samo.controls.TOURINC"))
      countArr = eval("(" + countArrTxt + ")")
      console.log "cityArr",countArr[5]
      findCityFunction(sityDep,countArr[5].inc)







##    callback?(null,requestOptions)
#  startFetching: (searchOptions, offset, callback) ->
#    offset = offset||904
#    searchOptions.qs["PRICEPAGE"] = offset
#    console.log "http://pegast.ru/samo5/search_tour_person?#{querystring.stringify(searchOptions.qs)}"
#    accommodations = []
#    check = 0
#    @request searchOptions, (res, body) =>
#      try
#        body = new Buffer(body, 'binary')
#        conv = new Iconv.Iconv('windows-1251', 'utf8')
#        body = conv.convert(body).toString()
#        html = body.substring(body.indexOf('ehtml')+6, body.indexOf("'); if (typeof"))
#        $ = cheerio.load html
#        tourArr = $("tbody > tr")
#        if tourArr.length
#          tourArr.map (index, element) =>
#            accommodation =
#              settlement : $(element).find("td").eq(0).text().replace(/[ \n\t\r\\n\\]+/g,"")
#              tour       : $(element).find("td").eq(1).text().replace(/[ \n\t\r]+/g,"")
#              dayNight   : $(element).find("td").eq(2).text().replace(/[ \n\t\r]+/g,"")
#              nameHotel  : $(element).find('td').eq(3).find("a").text().replace(/[ \n\t\r]+/g,"")
#              deeplink   : $(element).find('td').eq(3).find("a").attr("href")
#              nutrition  : $(element).find("td").eq(4).text().replace(/[ \n\t\r\\n\\\\n\\BB  ]+/g,"")
#              roomsType  : $(element).find("td").eq(5).text().replace(/[ \n\t\r]+/g,"")
#              price      : $(element).find("td").eq(8).text().replace(/[ \n\t\r]+/g,"")
##!!!          на http://searchru1.anextour.com  данных "typePrice" и "transport" нет
#              installmentPlan : $(element).find("td").eq(9).text().replace(/[ \n\t\r\\n\\]+/g,"")
#              typePrice  : $(element).find("td").eq(10).text().replace(/[ \n\t\r]+/g,"")
#              transport  : $(element).find("td").eq(11).text().replace(/[ \n\t\r\\n\\]+/g,"")
#            if accommodation.deeplink
#              accommodation.deeplink = accommodation.deeplink.replace(/[\\"]+/g,"")
#              searchDeepOptions =
#                encoding: 'binary'
#                method:"GET"
#                uri:accommodation.deeplink
#              request searchDeepOptions, (err, res, body) =>
#                if res.statusCode >= 400 && res.statusCode < 500
#                  accommodation.images = []
#                  accommodation.discription = ""
#                  collectTour(accommodation,tourArr.length)
#                else
#                  body = new Buffer(body, 'binary')
#                  conv = new Iconv.Iconv('windows-1251', 'utf8')
#                  body = conv.convert(body).toString()
#                  $ = cheerio.load(body)
#                  accommodation.images = []
#                  imgTagArr = $($(body).find(".nhotels ")).find("a")
#                  imgTagArr.map (index,element) =>
#                    if $(element).attr("onclick")
#                     accommodation.images.push($(element).attr("onclick").replace("ViewImage(\'","").replace("\');",""))
#                  tableInfo = $(".content > table")[1]
#                  tableInfoArr = $($(tableInfo).find("table>tr")).find(".info")
#                  #tableInfoArr  содержит инфу. Что бы посмореть нужно дописать <tbody><tr>tableInfoArr</tr></tbody>.Разбить нуно по td(1-й заголовок,2-й данные)
#                  accommodation.discription = "tableInfoArr"
#                  collectTour(accommodation,tourArr.length)
#            else
#              accommodation.images = []
#              accommodation.discription = ""
#              collectTour(accommodation,tourArr.length)
#        else
#          console.log "html",html
#          @endFetching()
#      catch error
#        callback?(error)
#    collectTour = (tour,lengthArr) =>
#      check++
#      console.log "check",check
#      console.log "___________-"
#      console.log "offset",offset
#      accommodations.push(tour)
#      if check == lengthArr
#        callback?(null, accommodations, offset+1)
#        offset++
#        @startFetching(searchOptions, offset, callback)


module.exports = Hotels

