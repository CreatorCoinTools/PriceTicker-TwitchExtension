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
       currentCurrency = configs.currency;
       currentCoin = configs.coin;
       currentMaxPolling = configs.maxPolling;
       currentFloatPrecision = configs.floatPrecision;
   }
   // Rally.io consts
   
   getAllCreatorCoins()
   .then((out) => {
        for(var item in out){
          if (out[item].coinSymbol == currentCoin){
              twitch.rig.log(out[item]);
              $('#current-coin-name').html(out[item].coinName);
              $('#current- coin-image').attr('src', out[item].coinImagePath);
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