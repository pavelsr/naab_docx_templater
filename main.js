$(document).ready(function(){
    
    var is_local = 1; // move to config
    var api_host = 'https://api.bankruptcy.fabmarket.ru';
    
    if (is_local) {
        api_host = 'http://localhost:3001';
    }
    
    clear_form();
    
    $( '#start_price, #desired_price' ). inputmask(
    {
        'alias'              : 'decimal',
        'groupSeparator'     : ' ',
        'autoGroup'          : true,
        'digits'             : 2,
        'digitsOptional'     : false,
        'placeholder'        : '0.00',
        'removeMaskOnSubmit' : true,
        'autoUnmask'		   : true
    }
  );		
	
	// change label or placeholder text
	jQuery.data( document.body, "labelchange", {
  		reg_period_label: {
			auction: "Период приёма заявок",
			public_offer: "Период приёма ценовых предложений"
		},
		price_step_placeholder: {
			auction: "Шаг аукциона, % от начальной цены",
			public_offer: "Падение цены на этапе, % от начальной цены"
		},
		request_type: {
			auction: "в форме аукциона",
			public_offer: "посредством публичного предложения"
		},
		tender_type: {
			auction: "аукцион",
			public_offer: "публичное предложение"
		}
	});

	$('#manager_regulator').hide();
	$('.only_public_offer').hide();
	
	$('#reg_start_dt').datetimepicker();
	$('#reg_stop_dt').datetimepicker();
	$('#tender_start_dt').datetimepicker();
	$('#tender_stop_dt').datetimepicker();
	$('#bid_start_period').datetimepicker();
	
	if ( $('#tender_type').val() == 'auction' ) {
		$('.only_public_offer').hide();
		$('.only_auction').show();
	}
	
	if ( $('#tender_type').val() == 'public_offer' ) {
		$('.only_auction').hide();
		$('.only_public_offer').show();
	}
	
	$(document).on('change','#tender_type',function(){
		
		if ( $(this).val() == 'auction' ) {
			$('.only_public_offer').hide();
			$('.only_auction').show();
		}
		
		if ( $(this).val() == 'public_offer' ) {	
			$('.only_auction').hide();
			$('.only_public_offer').show();
		}
	});
	
	//$("#manager_organizes_itself").click(function() {
	$(document).on('change','#manager_organizes_itself',function(){
		console.log("click!");
	  if ($(this).is(':checked')) {
	    $('#manager_regulator').show();
	  } else {
	    $('#manager_regulator').hide();
	  }
	});
	
	$('#lot_deposit_percent, #lot_start_price').change(function(){;
	//$(document).on('change','#lot_deposit_percent',function(){
		var perc = $(this).val();
		var price = $('#lot_start_price').val();
		var deposit_abs = (price*perc/100).toFixed(2);
	  	$('#lot_deposit_percent_help').text( deposit_abs );
	});
    
    $(document).on('change','#demo_url_select',function(){
        $( "input[name='url']" ).val( $('#demo_url_select').val() );
    });
    
    $(document).on('click','#auto_submit_button',function(){
		console.log('API call');
        $.get( api_host + '/api/lot_info', { url: $( "input[name='url']" ).val() }, function(data) {
            console.log(data);
            // $('input').each(function(){
            //     console.log( $(this).attr('name') + ' : ' + data[$(this).attr('name')]);
        	// 	$(this).val( data[$(this).attr('name')] );
        	// });
            
            
            
            jQuery.each(data, function(name, value) {
                $( "input[name='"+name+"'], select[name='"+name+"']" ).val(value);
            });
        
            
        });
        console.log('End of API call');
	});
    
});

function fill_sample() {
	$('input').each(function(){
		var sample_value = $(this).attr('data-sample');
		if ( sample_value ) {
			$(this).val(sample_value);
		}
		else {
			$(this).val( $(this).attr('placeholder') );
		}	
	})
};

function clear_form() {
	$('input').each(function(){
		$(this).val("");
	})
}

function loadFile(url, callback) {
	PizZipUtils.getBinaryContent(url, callback)
}

function rub2str(n) { 
	var str;
	if (n % 10 >= 2 && n % 10 <= 4) {
		return 'рубля';
	}
	else if (n % 10 == 1) {
		return 'рубль';
	}
	else {
		return 'рублей';
	}
}

function kop2str(n) {
	var _second_num = parseInt( n.toString().substr(1, 2) );
	if (_second_num == 1) {
		return 'копейка';
	}
	else if ( _second_num > 1 && _second_num < 5 ) { 
		return 'копейки';
	}
	else {
		return 'копеек'; 
	}
}

function make_price_inputmask() {
	$( '#start_price, #desired_price' ). inputmask(
	{
		'alias'              : 'decimal',
		'groupSeparator'     : ' ',
		'autoGroup'          : true,
		'digits'             : 2,
		'digitsOptional'     : false,
		'placeholder'        : '0.00',
		'removeMaskOnSubmit' : true,
		'autoUnmask'		   : true
	}
  );
}

function flattenObject (ob, omit_key_suffix) {
	var toReturn = {};
	var groupSeparator = '_';
		
	for (var i in ob) {
		if (!ob.hasOwnProperty(i)) continue;
		
		if ((typeof ob[i]) == 'object') {
			var flatObject = flattenObject(ob[i]);
			for (var x in flatObject) {
				if (!flatObject.hasOwnProperty(x)) continue;
				
				toReturn[i + groupSeparator + x] = flatObject[x];
			}
		} else {
			toReturn[i] = ob[i];
		}
	}
		
	return toReturn;
};

function generate() {
	loadFile("my_template.docx", function(error, content) {
		if (error) {
			throw error
		};
		var zip = new PizZip(content);
		var doc = new window.docxtemplater().loadZip(zip);
        
		var formArray = $("form").serializeArray();        
        
		var data2docx = {};
		
        for (var i = 0; i < formArray.length; i++){
            data2docx[formArray[i]['name']] = formArray[i]['value'];
        }
	
		// postprocessing
			
		if ( data2docx.tender_type == 'auction' ) {
			data2docx.is_auction = 1;
		}
		
		if ( data2docx.tender_type == 'public_offer' ) {
			data2docx.is_public_offer = 1;
		}
		
		data2docx.deposit = ( data2docx.start_price * data2docx.deposit_percent / 100 ).toFixed(2);
		
		// все поля где могут быть цены
		var money_properties = ['start_price', 'deposit', 'desired_price'];
		var monies = new Object();
		money_properties.forEach(function (item) {
			monies[item] = data2docx[item];
		});
		
		// var monies = { 
		// 	"start_price": data2docx.start_price, 
		// 	"deposit": data2docx.deposit
		// };
		
		// console.log(monies);
		
		// deposit, start_price
		
		// _int_num
		// _int_padezh
		// _int_written
		// _decimals_num
		// _decimals_padezh
		
		$.each(monies, function (key, money_float) {
			data2docx[key] = written_money_obj(money_float);
		});
		
		// make object single depth
		data2docx = flattenObject(data2docx);

		data2docx.today = moment().format('DD MMMM YYYY г.'); 		// «___» __ 2018 г. 		
		// data2docx.kommersant_release_date.moment().format('DD MMMM YYYY г.')
		
		data2docx.kommersant_release_date = moment( data2docx.kommersant_release_date, "YYYY-MM-DD" ).format('DD MMMM YYYY г.');
		
		console.log(data2docx);

		doc.setData(data2docx);
		
		try {
			doc.render()
		} catch (error) {
			var e = {
				message: error.message,
				name: error.name,
				stack: error.stack,
				properties: error.properties,
			}
			console.log(JSON.stringify({
				error: e
			}));
			throw error;
		}
		var out = doc.getZip().generate({
			type: "blob",
			mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		})
		saveAs(out, "output.docx")
	})
}
