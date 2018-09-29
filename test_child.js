
console.log("SPAWNED");

process.on("message", text => {
    console.log("Received: " + text);
    if(text === "exit")
    {
        process.exit();
    }
}
);

process.on("exit", () => { console.log("Leaving child");});