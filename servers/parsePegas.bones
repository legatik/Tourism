var phantom = require("node-phantom"),
request = require('request'),
cheerio = require('cheerio');
Iconv = require("iconv")
Buffer = require('buffer').Buffer
var server = Bones.Server.extend({

  options: {},
  initialize: function (app) {
    var self = this;
    _.bindAll(this, 'funcGetCountries','findCityFunction');
  //  Bones.socket.emit('test')


    this.get('/pegas', function (req, res) {
      self.funcGetCountries(res)
      });
  },

  iconverFunction : function(body) {
    var conv;
    body = new Buffer(body, 'binary');
    conv = new Iconv.Iconv('windows-1251', 'utf8');
    body = conv.convert(body).toString();
    return body;
  },

  funcGetCountries:function(globalRes) {
    var self = this
    var sityDep = 144;
    var dataGetCountries = {
      samo_action: "TOWNFROMINC",
      TOWNFROMINC: sityDep,
      "_": new Date * 1
    };

    var findCountryOptions = {
      method: "GET",
      qs: dataGetCountries,
      uri: "http://pegast.ru/samo5/search_tour_person?"
    };

    request(findCountryOptions, function(err, res, body) {
      var countArr, countArrTxt;
      countArrTxt = body.substring(body.indexOf('STATEINC).addOptions(') + 22, body.indexOf(");samo.jQuery(samo.controls.TOURINC"));
      countArr = eval("(" + countArrTxt + ")");
      return self.findCityFunction(sityDep, countArr[5].inc, globalRes);

    });
  },


  findCityFunction:function(sityDep,cityArive,globalRes) {
    var self = this
    var dataGetCities = {
      samo_action: "STATEINC",
      TOWNFROMINC: sityDep,
      STATEINC: cityArive,
      "_": new Date * 1
    };

    var findCitysOptions = {
      encoding: 'binary',
      method: "GET",
      qs: dataGetCities,
      uri: "http://pegast.ru/samo5/search_tour_person?"
    };

    request(findCitysOptions, function(err, res, body) {
      var $, cityArr, cityArrTxt, cityHtmlArr, dataBd, hotelsArr, hotelsArrTxt;
      cityArr = [];
      body = self.iconverFunction(body);
      cityArrTxt = body.substring(body.indexOf('samo.controls.TOWNTO).html(') + 27, body.indexOf(");samo.jQuery(samo.controls.MEAL"));
      $ = cheerio.load(cityArrTxt);
      cityHtmlArr = $("div");
      cityHtmlArr.map(function(index, element) {
        var cityOne, labelArr;
        cityOne = {};
        cityOne.postcityArr = [];
        labelArr = $(element).find("label");
        labelArr.map(function(i, el) {
          var arr;
          if (i === 0) {
            return cityOne.globalName = $(el).text();
          } else {
            arr = [$(el).text().replace(/[ \n\t\r\\n\\]+/g, ""), $(el).find("input").val().replace(/[ \n\t\r\\n\\/"]+/g, "")];
            return cityOne.postcityArr.push(arr);
          }
        });
        return cityArr.push(cityOne);
      });
      hotelsArrTxt = body.substring(body.indexOf('HOTELS).add_hotels(') + 19, body.indexOf(");samo.jQuery(samo.controls.hotelsearch"));
      hotelsArr = eval("(" + hotelsArrTxt + ")");
      dataBd = [];
      cityArr.forEach(function(citys) {
        return citys.postcityArr.forEach(function(infData) {
          var cityId, cityName, forBd, hotelsForBD;
          cityId = infData[1];
          cityName = infData[0];
          forBd = {};
          forBd.cityName = cityName;
          forBd.cityId = cityId;
          hotelsForBD = hotelsArr.filter(function(hotel) {
            if (hotel.townKey * 1 === cityId * 1) {
              return hotel;
            }
          });
          forBd.hotels = hotelsForBD;
          return dataBd.push(forBd);
        });
      });
      var arrSendBd = []
      dataBd.forEach(function(data) {
        var arrSendPath = {}
        arrSendPath.title = data.cityName
        arrSendPath.hotels = data.hotels.map(function(hotel) {
          return(hotel.name+" "+hotel.star)
        })
        arrSendPath.id_pegas = data.cityId*1
        arrSendPath.operators = ["PEGAS"]
        arrSendBd.push(arrSendPath)
      })
//____________________________________________________________________________

//      Для сохранений данных в коллекции Hotel

//      var JsonArrSendBdHotels = JSON.parse(JSON.stringify(hotelsArr))
//      console.log("hotelsArr",JsonArrSendBdHotels.length)
//      JsonArrSendBdHotels.forEach(function(data) {
//        var jsonSaveData = {}
//        jsonSaveData.title = data.name +" "+data.star
//        jsonSaveData.id_pegas = data.townKey*1
//        jsonSaveData.category = data.starAlt
//        jsonSaveData.id = Bones.utils.guid()
//        var hotel = new models.Hotel(jsonSaveData)
//        hotel.save()
//      })
//      globalRes.send(200)


//____________________________________________________________________________

//      Для сохранений данных в коллекции Arrcity
      JsonArrSendBd = JSON.parse(JSON.stringify(arrSendBd))
      console.log("JsonArrSendBd",JsonArrSendBd.length);

      JsonArrSendBd.forEach(function(jsonData) {
        var city = new models.Arrcity(jsonData)
        city.id = Bones.utils.guid()
        city.save(function(err) {
          console.log("SAVE",err);
        })
      })
      globalRes.send(200)
//____________________________________________________________________________
    });



  },

});

