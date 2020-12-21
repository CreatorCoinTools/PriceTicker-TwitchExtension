function getAllCreatorCoins(){
  return fetch('https://api.rally.io/v1/creator_coins/')
    .then(res => res.json())
}

function getCreatorCoinBySymbol(coinSymbol){
  return fetch(`https://api.rally.io/v1/creator_coins/${coinSymbol}/price`)
  .then(res => res.json())
}

// get price after currency conversion.
function getPrice(usdPrice, currencySymbol, floatPrecision){
  return getCurrencyRates().then(result => {
    return (usdPrice * parseFloat(result.rates[currencySymbol])).toFixed(floatPrecision);
  });
}

// get currency rates from ratesapi.io.
function getCurrencyRates(){
  return fetch("https://api.ratesapi.io/api/latest?base=USD")
  .then(res => res.json());
}

// save broadcaster configs
function saveConfig(twitch, configs){
  twitch.rig.log(configs);
  twitch.configuration.set("broadcaster", "1", JSON.stringify(configs));
}

// load broadcaster configs
function loadConfig(twitch){
  if (twitch.configuration.broadcaster){
      try{
        var result = JSON.parse(twitch.configuration.broadcaster.content);
        twitch.rig.log(typeof result);
        if (typeof result == "object"){
            return result;
        }else{
          twitch.rig.log("invalid config");
        }
      }catch(e){
        twitch.rig.log(e);
      }
  }
  twitch.rig.log("no configs");
  return ""
}
