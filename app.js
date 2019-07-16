const cron = require('node-cron');
const axios = require('axios');
const fs = require('fs');

// checks for file to write data
(() => {
	try {
	  let fetched = fs.readFileSync('./todo.json');
	  let fetchedparsed = JSON.parse(fetched);
	  if(!fetchedparsed.length) fs.writeFileSync('./todo.json',JSON.stringify([]));
	}
	catch(e) {
	  fs.writeFileSync('./todo.json',JSON.stringify([]));
	}
})();

let count = 0;

var task = cron.schedule('*/3 * * * * *', () => {
	++count;
	console.log(`running cron job - ${count}`);

	let fetched = fs.readFileSync('./todo.json');
	let fetchedparsed = JSON.parse(fetched);

	if(count === 10) {
		task.stop();
		console.log('------- cron job completed -------');
	}

	(async () => {
		try{
			let body = await axios.get(`https://jsonplaceholder.typicode.com/todos/${count}`);
			// console.log(body.data);
			fetchedparsed.push(body.data);
			fs.writeFileSync('./todo.json',JSON.stringify(fetchedparsed));
		}
		catch(e) {
			console.log(e);
		}
	})();
});
