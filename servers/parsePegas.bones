var phantom = require("node-phantom"),
request = require('request'),
cheerio = require('cheerio');
Iconv = require("iconv")
Buffer = require('buffer').Buffer
var server = Bones.Server.extend({

  options: {},
  initialize: function (app) {
    var self = this;
    _.bindAll(this, 'funcGetCountries','findCityFunction','functionInteration');
  //  Bones.socket.emit('test')


    this.get('/pegas', function (req, res) {
//      self.funcGetCountries(res)
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
      self.countArr = eval("(" + countArrTxt + ")");
      self.globalIteration = 0
      self.depcity = {
        title:"Ростов-на-Дону",
        arr_cities:[],
        id_pegas:sityDep,
        id:Bones.utils.guid()
      }
      self.functionInteration(self.globalIteration,globalRes,sityDep)

    });
  },

  functionInteration:function(index,globalRes,sityDep){
    self = this
    if(self.countArr[index]){
      setTimeout( function() {
        self.depcityOne = {
          country:self.countArr[index].title,
          cities:[]
        }
        self.findCityFunction(sityDep, self.countArr[index].inc, globalRes);
      } , 500)
    }else{
      var depcitySaveModel = new models.Depcity(self.depcity)
      depcitySaveModel.save()
      globalRes.send(200)
    }

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
      


//___________________________________________________________
//      Для сохранений данных в коллекции Arrcity 
      dataBd = [];
      cityArr.forEach(function(citys) {
        var forBd = {};
        var hotelTempArr = [];
        forBd.hotels = [];
        forBd.id_pegas = ["NaN"];
        forBd.title = citys.globalName
        citys.postcityArr.forEach(function(region){
          regionId = region[1]*1
          forBd.id_pegas.push(regionId)
          hotelTempArr = hotelsArr.filter(function(hotel){
            if(regionId == hotel.townKey*1){
              return(hotel)
            }
          })
          tempArrNameHotel = hotelTempArr.map(function(hotel){
            return((hotel.name+" "+hotel.star).replace(/[&]+/g,"and"))
          })
          tempArrNameHotel.forEach(function(name){
            forBd.hotels.push(name)
          })
        })
        forBd.id = Bones.utils.guid()
        forBd.operators = ["Пегас"]
        var citySaveModel = new models.Arrcity(forBd)
        citySaveModel.save()
        dataBd.push(forBd)
        
      });
//      console.log("dataBd length",dataBd.length)
//      globalRes.send(200)
//____________________________________________________________________________

//      Для сохранений данных в коллекции Hotel

      var JsonArrSendBdHotels = JSON.parse(JSON.stringify(hotelsArr))
      console.log("hotelsArr",JsonArrSendBdHotels.length)
      JsonArrSendBdHotels.forEach(function(data) {
        var jsonSaveData = {}
        jsonSaveData.title = (data.name +" "+data.star).replace(/[&]+/g,"and")
        jsonSaveData.id_pegas = data.townKey*1
        jsonSaveData.category = data.starAlt
        jsonSaveData.id = Bones.utils.guid()
        var hotel = new models.Hotel(jsonSaveData)
        hotel.save()
      })
//      globalRes.send(200)


//____________________________________________________________________________


//Для сохранения городов Depcity
       cityArr.forEach(function(city){
         self.depcityOne.cities.push(city.globalName)
       })
       self.depcity.arr_cities.push(self.depcityOne)
       self.globalIteration++
       self.functionInteration(self.globalIteration,globalRes,sityDep)
       
    });



  },

});

