

var twitch = window.Twitch ? window.Twitch.ext : null;

var configs = "";

// Default apearance.
const defaultColors = [
  '#2d60fd',
  '#22c1c3',
  '#808080',
  '#ffffff',
  '#0000ff',
];
// Apearance presets.
const presets = {
     "Default": defaultColors.join(","),
     "Dark": "#342342, #32e323, #ff6565, #123212, #0000ff",
     "Light": "#BABFCF,#20F1F3,#F5F3F3,#000000,#4CAF50"
}
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
    // Set apearance presets.
    for(var k in presets){
      $('#presets-select').append("<option  value='"+presets[k]+"'><span style='width:10px; height:10px;'><span>"+k+"</option>");
    }

    $('#presets-select').on('change', function() {
        colors = this.value.split(",");
        pickrHeaderStart.setColor(colors[0].trim());
        pickrHeaderEnd.setColor(colors[1].trim());
        pickrPriceBG.setColor(colors[2].trim());
        pickrPriceFont.setColor(colors[3].trim());
        pickrPriceFontStroke.setColor(colors[4].trim());
    });

    // Header start color pickr.
    pickrHeaderStart = Pickr.create({
      el: '#header-start',
      theme: 'nano', // or 'monolith', or 'nano'
      swatches: pickrSwatches,
      default: defaultColors[0],
      components: pickrComponents,
    });
    
    // Header end color pickr.
    pickrHeaderEnd = Pickr.create({
      el: '#header-end',
      theme: 'nano', // or 'monolith', or 'nano'
      swatches: pickrSwatches,
      default: defaultColors[1],
      components: pickrComponents,
    });

    // Price bg color.
    pickrPriceBG = Pickr.create({
      el: '#price-bg',
      theme: 'nano', // or 'monolith', or 'nano'
      swatches: pickrSwatches,
      default: defaultColors[2],
      components: pickrComponents,
    });

    // Font color.
    pickrPriceFont = Pickr.create({
      el: '#font-color',
      theme: 'nano', // or 'monolith', or 'nano'
      swatches: pickrSwatches,
      default: defaultColors[3],
      components: pickrComponents,
    });

    // Font stroke color.
    pickrPriceFontStroke = Pickr.create({
      el: '#font-stroke-color',
      theme: 'nano', // or 'monolith', or 'nano'
      swatches: pickrSwatches,
      default: defaultColors[4],
      components: pickrComponents,
    });

    // Font selector.
    $('#font-select').fontselect({
      systemFonts: ['Arial','Times+New+Roman', 'Verdana'],
  //      localFonts: ['Action+Man', 'Bauer', 'Bubble'],
  //      localFontsUrl: '/dist/fonts/' // End with a slash!
    });

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




    $('#save-config').click(function(){
      coin = $('#coins-select').val();
      currency = $('#currencies-select').val();
      maxPolling = $('input[name=time]').val();
      precision = $('input[name=precision]').val();
      preset = $('#presets-select').find(":selected").val();
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
      save(coin, currency, maxPolling, precision, headerStartColor, headerEndColor, priceBG, fontColor, fontStrokeColor, fontFamily, preset);
    });

    // Just to be sure!
    pickrPriceFontStroke.on('init', instance => {
      if (configs != ""){
        loadConfigs();
      }
    });
});

// we'll catch any config changes in here.
twitch.configuration.onChanged(function(){
    configs = loadConfig(twitch);
    if (configs != ""){
       loadConfigs();
        console.log(configs);
    }
});

function loadConfigs(){
  setCurrentMaxPolling(configs.maxPolling);
  setCurrentPrecision(configs.floatPrecision);
  setCurrentPreset(configs.preset);
  if (pickrHeaderStart != null && configs.hasOwnProperty('headerStartColor')){
    pickrHeaderStart.setColor(configs.headerStartColor);
  }
  if (pickrHeaderEnd != null && configs.hasOwnProperty('headerEndColor')){
    pickrHeaderEnd.setColor(configs.headerEndColor);
  }
  if (pickrPriceBG != null && configs.hasOwnProperty('priceBG')){
    pickrPriceBG.setColor(configs.priceBG);
  }
  if (pickrPriceFont != null && configs.hasOwnProperty('fontColor')){
    pickrPriceFont.setColor(configs.fontColor);
  }
  if (pickrPriceFontStroke != null && configs.hasOwnProperty('fontStrokeColor')){
    pickrPriceFontStroke.setColor(configs.fontStrokeColor);
  }
  setCurrentFont(configs.fontFamily);
}
function save(coinSymbol, currencySymbol, maxPollinginMinutes, floatPrecision, 
  headerStartColor, headerEndColor, priceBG, fontColor, fontStrokeColor, fontFamily, preset){
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
    "preset": preset,
  };
  // save config in twitch configurations.
  saveConfig(twitch, configs);
  // log these configs.
  twitch.rig.log(configs);
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

function setCurrentPreset(preset){
  $('#presets-select option[value="'+configs.preset+'"]').prop('selected', true);
}

function setCurrentFont(fontFamily, fontWeight){
  $('#font-select').trigger('setFont',fontFamily);
}
