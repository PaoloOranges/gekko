if(process.env.NODE_ENV != "undefined" && process.env.NODE_ENV == "DEBUG")
{
	var fork = require('./debug_tools/child_process_debug').fork;
}
else
{
	var fork = require('child_process').fork;
}

// ############# FORK AND CHILD FORK TEST ##############

let children = [];
for(let i = 0; i < 4; i++)
{
	let child = fork("test_child.js");
	children.push(child);
}


for(let i = 0; i < 10; i++)
{
	children.forEach( child => { child.send("number: " + 1); });
}

children.forEach( child => { child.send("exit"); });
