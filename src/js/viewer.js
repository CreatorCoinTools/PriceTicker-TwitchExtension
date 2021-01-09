// some defaults
var currentCoin = "STEP";
var currentCurrency = "USD";
var currentMaxPolling = 5 * 60 * 1000;
var currentFloatPrecision = 5;

var twitch = window.Twitch ? window.Twitch.ext : null;
// $(document).ready(function() {
//   // executes when HTML-Document is loaded and DOM is ready

//  });

// we'll catch any config changes in here.
twitch.configuration.onChanged(function(){
  //  twitch.configuration.set("broadcaster", "1", JSON.stringify({"name": "dummy"}));
   
  configs = loadConfig(twitch);
   if (configs != ""){
       twitch.rig.log("config found");
       twitch.rig.log(configs);
       if (configs.hasOwnProperty('currency') && configs.currency != ""){
          currentCurrency = configs.currency;
       }
       if (configs.hasOwnProperty('coin') && configs.coin != ""){
          currentCoin = configs.coin;
       }
       if (configs.hasOwnProperty('maxPolling') && configs.maxPolling != "" ){
          currentMaxPolling = configs.maxPolling;
       }
       if (configs.hasOwnProperty('floatPrecision') && configs.floatPrecision != ""){
          currentFloatPrecision = configs.floatPrecision;
       }

       // Set header gradient color.
       if (configs.hasOwnProperty('headerStartColor') && configs.headerStartColor != ""){
         currentHeaderStartColor = configs.headerStartColor;
         if (configs.hasOwnProperty('headerEndColor') && configs.headerEndColor != ""){
            currentHeaderEndColor = configs.headerEndColor;
            $(".panel-header").css({
               //"backgroundImage": `linear-gradient(0deg, rgba(134,193,20,1) 0%, rgba(45,196,253,1) 100%);` 
               'background': `-webkit-gradient(linear,left top,left bottom,from(${currentHeaderStartColor}),to(${currentHeaderEndColor}))`
             });
             
           
         }
       }
       // Set price bg color.
       if (configs.hasOwnProperty('priceBG') && configs.priceBG != ""){
         $("body").css({
            background: `linear-gradient(${configs.priceBG}, ${configs.priceBG}, \
             ${configs.priceBG}) no-repeat 0px 10px`
         });
          $(".panel-card").css({
            "background-color": configs.priceBG
         });
         $(".panel-header-background").css({
            "background-color": configs.priceBG
         });
       }
       // Set font color.
       if (configs.hasOwnProperty('fontColor') && configs.fontColor != ""){
         $(".text").css({
            "color": configs.fontColor
         });
         $(".coin-name").css({
            "color": configs.fontColor
         });
       }
       // Set font stroke color.
       if (configs.hasOwnProperty('fontStrokeColor') && configs.fontStrokeColor != ""){
         $(".text").css({
            "text-shadow": `-1px -1px 0 ${configs.fontStrokeColor}, 1px -1px 0 ${configs.fontStrokeColor}, \
             -1px 1px 0 ${configs.fontStrokeColor}, 1px 1px 0 ${configs.fontStrokeColor}`
         });
         $(".coin-name").css({
            "text-shadow": `-1px -1px 0 ${configs.fontStrokeColor}, 1px -1px 0 ${configs.fontStrokeColor}, \
             -1px 1px 0 ${configs.fontStrokeColor}, 1px 1px 0 ${configs.fontStrokeColor}`
         });
       }

       // Set font family.
       if (configs.hasOwnProperty('fontFamily') && configs.fontFamily != ""){
         $(".text").css({
            fontFamily: "'"+configs.fontFamily+"'"
         });
         $(".coin-name").css({
            fontFamily: "'"+configs.fontFamily+"'"
         });
       }

   }
   // Rally.io consts
   
   getAllCreatorCoins()
   .then((out) => {
        for(var item in out){
          if (out[item].coinSymbol == currentCoin){
              twitch.rig.log(out[item]);
              $('#current-coin-name').html(out[item].coinName);
              $('#current-coin-image').attr('src', out[item].coinImagePath);
              $('#tooltiptext').text(`Learn more about ${out[item].creatorPreferredName} Creator Coin by going to rally.io.`);
              return
          }
        }
        
    }).catch(err => console.error(err));
    // Get coin price for the first time;
    updateCoinPrice();
    // Update using max polling
    setInterval(function(){ 
        // code goes here that will be run every `currentMaxPolling` minutes.  
        updateCoinPrice();
    }, currentMaxPolling * 60 * 1000);
});

function updateCoinPrice(){
      getCreatorCoinBySymbol(currentCoin)
      .then((out) => {
          twitch.rig.log(out);
          // add coin price to index 
          if (currentCurrency == "USD"){
             const price = parseFloat(out.priceInUSD).toFixed(currentFloatPrecision);
             setCoinPrice("$"+price)
          }else if( currentCurrency == "RLY"){
             const price = parseFloat(out.priceInRLY).toFixed(currentFloatPrecision);
              setCoinPrice(price + " $RLY")
          }else{
             getPrice(out.priceInUSD, currentCurrency, currentFloatPrecision).then(price =>{
              setCoinPrice(price + " " + currentCurrency)
             })
              
          }
          
      });  
}

function setCoinPrice(price){
  twitch.rig.log(price);
  $('#current-coin-price').html(price);
}
