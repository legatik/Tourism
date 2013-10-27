request = require('request'),
cheerio = require('cheerio');
Buffer = require('buffer').Buffer
Iconv = require("iconv-lite")
var server = Bones.Server.extend({

  options: {},




  initialize: function (app) {
    this.cookieJar = request.jar(arguments.callee)
    var self = this;
    _.bindAll(this, 'createRequest','endFetching','startFetching',"collectTour");
    this.globalRes
  //  Bones.socket.emit('test')
    this.get('/pegas', function (rq, rs) {



      self.globalRes = rs
      var translatedSearch = {
        samo_action:"PRICES",
        TOWNFROMINC:144,
        STATEINC:4,
        TOURINC:0,
        PROGRAMINC:0,
        CHECKIN_BEG:20131228,
        NIGHTS_FROM:7,
        CHECKIN_END:20140104,
        NIGHTS_TILL:16,
        ADULT:2,
        CURRENCY:1,
        PRICE_MIN:0,
        CHILD:0,
        PRICE_MAX:0,
        TOWNTO_ANY:1,
        TOWNTO:"",
        STARS_ANY:1,
        STARS:"",
        hotelsearch:0,
        HOTELS_ANY:1,
        HOTELS:"",
        MEAL:"",
        FREIGHT:1,
        FILTER:1,
        HOTELTYPES:"",
        PACKET:0,
        _:new Date()*1
      }


      console.log("translatedSearch",translatedSearch)
      console.log("rq.query",rq.query)
      dataSearch = rq.query
      self.requestOptions = {
        encoding: 'binary',
        method:"GET",
        qs:dataSearch,
        uri: "http://pegast.ru/samo5/search_tour_person?"
      }
      self.startFetching(self.requestOptions)
    });
  },







  startFetching:function(searchOptions, offset){
    var self = this;
    searchOptions.qs["PRICEPAGE"] = offset;
    this.check = 0;
    this.offset = offset || 1
    this.accommodations = []
    self.createRequest(searchOptions, function(res, body) {
      var $, conv, html, tourArr;
        body = self.decodeText(body)
        html = body.substring(body.indexOf('ehtml') + 6, body.indexOf("'); if (typeof"));
        $ = cheerio.load(html);
        tourArr = $("tbody > tr");
        if (tourArr.length) {
          return tourArr.map(function(index, element) {
            var accommodation, searchDeepOptions;
            accommodation = {
              settlement: $(element).find("td").eq(0).text().replace(/[\n\t\r\\n\\]+/g, ""),
              tour: $(element).find("td").eq(1).text().replace(/[\n\t\r]+/g, ""),
              dayNight: $(element).find("td").eq(2).text().replace(/[\n\t\r]+/g, ""),
              nameHotel: $(element).find('td').eq(3).find("a").text().replace(/[\n\t\r]+/g, ""),
              deeplink: $(element).find('td').eq(3).find("a").attr("href"),
              nutrition: $(element).find("td").eq(4).text().replace(/[\n\t\r\\n\\\\n\\BB  ]+/g, ""),
              roomsType: $(element).find("td").eq(5).text().replace(/[\n\t\r]+/g, ""),
              price: $(element).find("td").eq(8).text().replace(/[\n\t\r]+/g, ""),
              installmentPlan: $(element).find("td").eq(9).text().replace(/[\n\t\r\\n\\]+/g, ""),
              typePrice: $(element).find("td").eq(10).text().replace(/[\n\t\r]+/g, ""),
              transport: $(element).find("td").eq(11).text().replace(/[\n\t\r\\n\\]+/g, "")
            };
            if (accommodation.deeplink) {
              accommodation.deeplink = accommodation.deeplink.replace(/[\\"]+/g, "");
              searchDeepOptions = {
                encoding: 'binary',
                method: "GET",
                uri: accommodation.deeplink
              };
              self.createRequest(searchDeepOptions, function(res, body) {
                var imgTagArr, tableInfo, tableInfoArr;
                if (res.statusCode >= 400 && res.statusCode < 500) {
                  accommodation.images = [];
                  accommodation.discription = "";
                  return self.collectTour(accommodation, tourArr.length);
                } else {
                  body = self.decodeText(body)
                  $ = cheerio.load(body);
                  accommodation.images = [];
                  imgTagArr = $($(body).find(".nhotels ")).find("a");
                  imgTagArr.map(function(index, element) {
                    if ($(element).attr("onclick")) {
                      return accommodation.images.push($(element).attr("onclick").replace("ViewImage(\'", "").replace("\');", ""));
                    }
                  });
                  tableInfo = $(".content > table")[1];
                  tableInfoArr = $($(tableInfo).find("table>tr")).find(".info");
                  accommodation.discription = "tableInfoArr";
                  return self.collectTour(accommodation, tourArr.length);
                }
              });
            } else {
              accommodation.images = [];
              accommodation.discription = "";
              return self.collectTour(accommodation, tourArr.length);
            }
          });
        } else {
          console.log("html", html);
          return self.endFetching();
        }
    });


  },


  collectTour: function(tour, lengthArr) {
    var self = this
    this.check++;
    this.accommodations.push(tour);
    //СОКЕТ ЕНКННЕКАЛ
    Bones.Core.socket.emit('pegasAnswer', {tour:tour})

    console.log("this.check",this.check)
    if (this.check === lengthArr) {
      console.log("this.accommodations",this.accommodations)
      self.offset++;
      return self.startFetching(self.requestOptions, self.offset);
    }
  },



  decodeText:function(body){
    body = new Buffer(body, 'binary')
    return Iconv.decode(body, 'win1251')
  },


  createRequest:function(requestOptions,callback){
    if (requestOptions.jar == null) {
      requestOptions.jar = this.cookieJar;
    }
    if (requestOptions.followAllRedirects == null) {
      requestOptions.followAllRedirects = true;
    }
    if (requestOptions.headers == null) {
      requestOptions.headers = {};
    }
    if (requestOptions.encoding == null) {
      requestOptions.encoding = "utf8";
    }
    if (requestOptions.headers["User-Agent"] == null) {
      requestOptions.headers["User-Agent"] = "Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.22 (KHTML, like Gecko) Ubuntu Chromium/25.0.1364.160 Chrome/25.0.1364.160 Safari/537.22";
    }
    request(requestOptions, function(error, res, body) {
      if (error != null) {
        return console.log(error, error.stack);
      }
      if (res.statusCode >= 400 && res.statusCode < 500) {
        error = new Error("http client error from scraper with id: @id\nstatus code: " + res.statusCode + "\nheaders: " + (JSON.stringify(res.headers, null, '\t')) + "\nbody: " + body);
        return console.error(error);
      } else if (res.statusCode >= 500 && res.statusCode < 600) {
        error = new Error("http server error from scraper with id: @id\nstatus code: " + res.statusCode + "\nheaders: " + (JSON.stringify(res.headers, null, '\t')) + "\nbody: " + body);
        return console.error(error);
      }
      return typeof callback === "function" ? callback(res, body) : void 0;
    })
  },

  endFetching:function(){
    this.globalRes.send(200)
  }

});

