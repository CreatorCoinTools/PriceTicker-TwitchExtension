

var twitch = window.Twitch ? window.Twitch.ext : null;

var configs = "";
twitch.onContext((context) => {
  twitch.rig.log(context);
});

twitch.onAuthorized((auth) => {
  // token = auth.token;
  // userId = auth.userId;
});

$(document).ready(function() {
    // First get all creator coins.    
    getAllCreatorCoins()
    .then((out) => {
      for(var item in out){
        console.log('Item: ', out[item]);
        $('#coins-select').append("<option value='"+out[item].coinSymbol+"'><span style='width:10px; height:10px; background-image:url("+ out[item].coinImagePath +");'><span>"+out[item].coinName+"</option>");
      }
      if (configs != ""){
        setCurrentCoin(configs.coin)
      }
    }).catch(err => twitch.rig.log(err));

    // get currency rates.
    getCurrencyRates()
    .then((out) => {
      // Add USD, RLY to the top of the list
      $('#currencies-select').append("<option value='USD'><span style='width:10px; height:10px;'><span>USD</option>");
      $('#currencies-select').append("<option value='RLY'><span style='width:10px; height:10px;'><span>RLY</option>");
      for(var currencySymbol in out.rates){
        $('#currencies-select').append("<option  value='"+currencySymbol+"'><span style='width:10px; height:10px;'><span>"+currencySymbol+"</option>");
      }
      if (configs != ""){
        setCurrentCurrency(configs.currency)
      }
    }).catch(err => twitch.rig.log(err));

    $('#save-config').click(function(){
      coin = $('#coins-select').val();
      currency = $('#currencies-select').val();
      maxPolling = $('input[name=time]').val();
      precision = $('input[name=precision]').val();
      save(coin, currency, maxPolling, precision);
    });

});

// we'll catch any config changes in here.
twitch.configuration.onChanged(function(){
    configs = loadConfig(twitch);
    if (configs != ""){
      setCurrentMaxPolling(configs.maxPolling);
      setCurrentPrecision(configs.floatPrecision);
    }
});

function save(coinSymbol, currencySymbol, maxPollinginMinutes, floatPrecision){
  configs = {"currency": currencySymbol, "coin": coinSymbol, "maxPolling": maxPollinginMinutes, "floatPrecision": floatPrecision};
  // save config in twitch configurations.
  saveConfig(twitch, configs);
}

function setCurrentCoin(coinSymbol){
  $('#coins-select option[value="'+coinSymbol+'"]').prop('selected', true);
}
function setCurrentCurrency(currency){
  $('#currencies-select option[value="'+currency+'"]').prop('selected', true);
}
function setCurrentMaxPolling(time){
  $('input[name=time]').val(time);
}
function setCurrentPrecision(precision){
  $('input[name=precision]').val(precision);
}
function setDefaultValues(coinSymbol, currency, time, precision){
  setCurrentCoin(coinSymbol);
  setCurrentCurrency(currency);
  setCurrentMaxPolling(time);
  setCurrentPrecision(precision);
}