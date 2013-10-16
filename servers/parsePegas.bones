var phantom = require("node-phantom"),
request = require('request'),
cheerio = require('cheerio');
Iconv = require("iconv")
Buffer = require('buffer').Buffer
var server = Bones.Server.extend({

  options: {},
  initialize: function (app) {
    var self = this;
    _.bindAll(this, 'findHotelsFunction','findCityFunction','parseTownHotels','collateTitle');


    this.get('/pegas', function (req, res) {
      var sityDep = 303 //Ростов-На-Дону
      var country = 1189
      this.cityJSON = {}
      this.hotelsJSON = {}
      self.findCityFunction(sityDep,country,res)

    });
  },

  findCityFunction:function(sityDep,country,globalRes){
    var dataGetCities, findCitysOptions,
        self = this;
    dataGetCities = {
      country: country,
      holPack: ""
    };
    findCitysOptions = {
      method: "POST",
      json: dataGetCities,
      uri: "http://searchru1.anextour.com/SearchResult.aspx/BindHotelTownJson"
    };

    request(findCitysOptions, function(err, res, body) {
      self.cityJSON = JSON.parse(body.d);
      self.findHotelsFunction(sityDep,country,globalRes);
    });
  },

  findHotelsFunction:function(sityDep,country,globalRes){
    var dataGetHotels, findCitysOptions,
        self=this;
    dataGetHotels = {
      country: country,
      depCity: sityDep,
      holPack: ''
    };

    findCitysOptions = {
      method: "POST",
      json: dataGetHotels,
      uri: "http://searchru1.anextour.com/SearchResult.aspx/BindHotelListJson"
    };

    request(findCitysOptions, function(err, res, body) {
      self.hotelsJSON = JSON.parse(body.d)
      self.parseTownHotels(globalRes)
    });
  },

  parseTownHotels:function(globalRes){
    var self = this
//    console.log("self.cityJSON",JSON.stringify(self.cityJSON))
//    console.log("********************")
//    console.log("--------------------")
//    console.log("********************")
//    console.log("__-----------------_")
//    console.log("********************")
//    console.log("self.hotelsJSON",JSON.stringify(self.hotelsJSON))
//    globalRes.send(200)
    self.townHotelsArr = []
    self.cityJSON.forEach(function(city){
      townHotelsPath = {}
      townHotelsPath.title = city.Name
      townHotelsPath.id_anex = city.RecID
      townHotelsPath.hotels = self.hotelsJSON.filter(function(hotel){
        if(Number(hotel.Town) == Number(townHotelsPath.id_anex)){
          return(hotel)
        }
      })
      self.townHotelsArr.push(townHotelsPath)
    })
    self.collateTitle(globalRes)
  },

  collateTitle:function(globalRes){
    var self = this
//    console.log(JSON.stringify(self.townHotelsArr))
    var arrayCitiesPegas = new models.Arrcities
    arrayCitiesPegas.fetch({
      filter: {title:{$in: ["Алания","Анталья","Белек","Бурса","Кемер","Сиде"]}},
      success: function() {
        console.log(JSON.stringify(arrayCitiesPegas))
      }
    })
    
    globalRes.send(200)
  }

});

