

var twitch = window.Twitch ? window.Twitch.ext : null;

var configs = "";

// Pickr objects.
var pickrHeaderStart, pickrHeaderEnd, pickrPriceBG, pickrPriceFont, pickrPriceFontStroke;
// pickr swatches.
const pickrSwatches = [
  'rgba(244, 67, 54, 1)',
  'rgba(233, 30, 99, 1)',
  'rgba(156, 39, 176, 1)',
  'rgba(103, 58, 183, 1)',
  'rgba(63, 81, 181, 1)',
  'rgba(33, 150, 243, 1)',
  'rgba(3, 169, 244, 1)',
  'rgba(0, 188, 212, 1)',
  'rgba(0, 150, 136, 1)',
  'rgba(76, 175, 80, 1)',
  'rgba(139, 195, 74, 1)',
  'rgba(205, 220, 57, 1)',
  'rgba(255, 235, 59, 1)',
  'rgba(255, 193, 7, 1)'
]

// pickr components.
const pickrComponents = {
  // Main components
  preview: true,

  // Input / output Options
  interaction: {
      hex: true,
      input: true,
      clear: true,
      save: true
  }
}

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


    // Header start color pickr.
    pickrHeaderStart = Pickr.create({
      el: '#header-start',
      theme: 'nano', // or 'monolith', or 'nano'
      swatches: pickrSwatches,
      components: pickrComponents,
    });
    
    // Header end color pickr.
    pickrHeaderEnd = Pickr.create({
      el: '#header-end',
      theme: 'nano', // or 'monolith', or 'nano'
      swatches: pickrSwatches,
      components: pickrComponents,
    });

    // Price bg color.
    pickrPriceBG = Pickr.create({
      el: '#price-bg',
      theme: 'nano', // or 'monolith', or 'nano'
      swatches: pickrSwatches,
      components: pickrComponents,
    });

    // Font color.
    pickrPriceFont = Pickr.create({
      el: '#font-color',
      theme: 'nano', // or 'monolith', or 'nano'
      swatches: pickrSwatches,
      components: pickrComponents,
    });

    // Font stroke color.
    pickrPriceFontStroke = Pickr.create({
      el: '#font-stroke-color',
      theme: 'nano', // or 'monolith', or 'nano'
      swatches: pickrSwatches,
      components: pickrComponents,
    });

    // Font selector.
    $('#font-select').fontselect({
      systemFonts: ['Arial','Times+New+Roman', 'Verdana'],
      localFonts: ['Action+Man', 'Bauer', 'Bubble'],
      googleFonts: ['Piedra', 'Questrial', 'Ribeye'],
      localFontsUrl: 'fonts/' // End with a slash!
    });

    $('#save-config').click(function(){
      coin = $('#coins-select').val();
      currency = $('#currencies-select').val();
      maxPolling = $('input[name=time]').val();
      precision = $('input[name=precision]').val();
      headerStartColor = pickrHeaderStart.getSelectedColor();
      headerEndColor = pickrHeaderEnd.getSelectedColor();
      priceBG = pickrPriceBG.getSelectedColor();
      fontColor = pickrPriceFont.getSelectedColor();
      fontStrokeColor = pickrPriceFontStroke.getSelectedColor();

      // getting font family and weight.
      var fontFamily;
      var font = $('#font-select').val();
      if (font != null){
        var font = $('#font-select').val().replace(/\+/g, ' ');
        // Split font into family and weight
        font = font.split(':');
        fontFamily = font[0];
      }
      save(coin, currency, maxPolling, precision, headerStartColor, headerEndColor, priceBG, fontColor, fontStrokeColor, fontFamily);
    });

});

// we'll catch any config changes in here.
twitch.configuration.onChanged(function(){
    configs = loadConfig(twitch);
    if (configs != ""){
      setCurrentMaxPolling(configs.maxPolling);
      setCurrentPrecision(configs.floatPrecision);
      pickrHeaderStart.setColor(configs.headerStartColor);
      pickrHeaderEnd.setColor(configs.headerEndColor);
      pickrPriceBG.setColor(configs.priceBG);
      pickrPriceFont.setColor(configs.fontColor);
      pickrPriceFontStroke.setColor(configs.fontStrokeColor);
      setCurrentFont(configs.fontFamily)
    }
});

function save(coinSymbol, currencySymbol, maxPollinginMinutes, floatPrecision, 
  headerStartColor, headerEndColor, priceBG, fontColor, fontStrokeColor, fontFamily){
  $("#saved").hide();
  configs = {
    "currency": currencySymbol, 
    "coin": coinSymbol, 
    "maxPolling": maxPollinginMinutes, 
    "floatPrecision": floatPrecision,
    "headerStartColor": headerStartColor.toHEXA().toString(),
    "headerEndColor": headerEndColor.toHEXA().toString(),
    "priceBG": priceBG.toHEXA().toString(),
    "fontColor": fontColor.toHEXA().toString(),
    "fontStrokeColor": fontStrokeColor.toHEXA().toString(),
    "fontFamily": fontFamily,
  };
  // log these configs.
  console.log(configs);
  // save config in twitch configurations.
  saveConfig(twitch, configs);
  $("#saved").show();
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

function setCurrentPrecision(precision){
  $('input[name=precision]').val(precision);
}

function setCurrentFont(fontFamily, fontWeight){
  $('#font-select').trigger('setFont',fontFamily);
}
