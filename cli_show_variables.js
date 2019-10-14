#!/usr/bin/env node

// Show not used tags

// npm i cheerio officeparser ansicolor written-number
// Контроль целостности формыэ
// показывает каких name нет в доке

const cheerio = require('cheerio');
const officeParser = require('officeparser');
const { red } = require ('ansicolor');
const fs = require('fs');
const $ = cheerio.load(fs.readFileSync('index.html'));


officeParser.parseOffice("my_template.docx", function(data) {
	//console.log(data);
	
	var ok_tags = [];
	
	$("form#main_form :input").each(function() {
		var tag = $(this).attr('name');
		if ( typeof tag === 'undefined' ) {
			// console.log( $(this).toString() );
		} else {
			var check = ( typeof(data.includes(tag)) !== 'undefined' ) ? data.includes(tag) : data.includes(tag).red ;
			if ( check ) {
				ok_tags.push(tag); 
			} else {
				console.log(tag);
			}
		}
	});
	
	console.log(" OK TAGS: ");
	console.log(ok_tags);
	
});
