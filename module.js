/**
@async
@function readSheet
@param {string} sheet_id - id of google sheet.
@param {string} g_id - id of specific card of google sheet.
@description Method that transforms google sheet into object { A: { '1': <Value of cell A1>, ... }, ... }. 
*/

function getColumnLetter(num) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';

    do {
        result = alphabet[num % 26] + result;
        num = Math.floor(num / 26) - 1;
    } while (num >= 0);

    return result;
}

function parse (str)
{
	const
		parsed = str
			.split(/(?:\r)?\n/)
			.map(el => el.split(/\t/));
			
	
	let
		object = {};
	
	for(let row in parsed)
	{
		for(let column in parsed[row])
		{
			const
				column_name = getColumnLetter(column);
			
			if(!(column_name in object)) object[column_name] = {};
			
			object[column_name][Number(row)+1] = parsed[row][column];
		}
	}
	
	return object;
}

async function readSheet(sheet_id, g_id)
{
	if(!sheet_id) throw Error('\'sheet_id\' parameter was not specified.');
	if(!g_id) throw Error('\'g_id\' parameter was not specified.');
	if(typeof sheet_id !== 'string') throw TypeError('\'sheet_id\' must be type of string.')
	if(typeof g_id !== 'string') throw TypeError('\'g_id\' must be type of string.')

	const
		sheet_url = `https://docs.google.com/spreadsheets/d/${sheet_id}/export?format=tsv&gid=${g_id}`;

	let
		response;

	try
	{
		let
			fetched = await fetch(sheet_url);
			
		if(!fetched.ok)
		{
			if(fetched.status == 404) throw Error(`Sheet under '${sheet_url}' url was not found.`);
			if([401, 403].includes(Number(fetched.status))) throw Error(`Public access for file under '${sheet_url}' url is disabled.`)
			
			throw Error('Response status is ' + fetched.status);
		}
			
		response = await fetched.text();
	}
	catch(error)
	{
		console.error('An error has occured during fetching the sheet. Check if its visibility is set to \'anyone who has link\'.');
		throw error;
	}
	
	return parse(response);
}

module.exports = readSheet;