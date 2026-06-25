const { spawn } = require('child_process');
const mcp = spawn('node', ['dist/mcp-server.js']);

function callTool(name, args) {
  return new Promise((resolve) => {
    const request = {
      jsonrpc: "2.0",
      id: Math.random().toString(),
      method: "tools/call",
      params: { name, arguments: args }
    };
    
    let output = '';
    mcp.stdout.on('data', function onData(data) {
      output += data.toString();
      if (output.includes(`"id":"${request.id}"`)) {
         mcp.stdout.removeListener('data', onData);
         resolve(output);
      }
    });
    
    mcp.stdin.write(JSON.stringify(request) + '\n');
  });
}

async function run() {
  console.log("Calling init_project...");
  const initRes = await callTool('init_project', { targetDir: "/Volumes/Crucial/Projects.local/LOKI.Twitch" });
  console.log("initRes:", initRes);
  
  console.log("Calling import_resource...");
  const importRes = await callTool('import_resource', { 
    type: "agents", 
    name: "project-architect", 
    targetProjectDir: "/Volumes/Crucial/Projects.local/LOKI.Twitch" 
  });
  console.log("importRes:", importRes);
  
  mcp.kill();
}
run();
