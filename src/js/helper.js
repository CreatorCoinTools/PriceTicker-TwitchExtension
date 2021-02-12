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
  twitch.configuration.set("broadcaster", "1", JSON.stringify(configs));
  console.log(configs);
}

// load broadcaster configs
function loadConfig(twitch){
  if (twitch.configuration.broadcaster){
      try{
        var result = JSON.parse(twitch.configuration.broadcaster.content);
        if (typeof result == "object"){
            return result;
        }else{
          console.log("invalid config");
        }
      }catch(e){
        console.log(e);
      }
  }
  console.log("no configs");
  return ""
}
