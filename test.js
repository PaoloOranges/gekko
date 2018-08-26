var fork = require('child_process').fork;

console.log('Test');

const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

// if (cluster.isMaster) {
// 	console.log(`Master ${process.pid} is running`);

// 	// Fork workers.
// 	for (let i = 0; i < numCPUs; i++) {
// 		cluster.fork();
// 	}

// 	cluster.on('exit', (worker, code, signal) => {
// 		console.log(`worker ${worker.process.pid} died`);
// 	});
// } else {
// 	// Workers can share any TCP connection
// 	// In this case it is an HTTP server
// 	http.createServer((req, res) => {
// 		res.writeHead(200);
// 		res.end('hello world\n');
// 	}).listen(8000);

// 	console.log(`Worker ${process.pid} started`);
// }


// ############# FORK AND CHILD FORK TEST ##############

let children = [];
//for(let i = 0; i < 4; i++)
{
	let child = fork("test_child.js");
	child.send("number: " + 1);
	child.send("exit");
	
	//children.push(child);
}

// for(let i = 0; i < 10; i++)
// {
// 	for(let child in children)
// 	{
// 		child.send("print", "number: " + i);
// 	}
// }