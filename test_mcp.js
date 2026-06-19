const { spawn } = require('child_process');
const mcp = spawn('node', ['dist/mcp-server.js']);
const request = {
  jsonrpc: "2.0",
  id: 1,
  method: "tools/list",
  params: {}
};
let output = '';
mcp.stdin.write(JSON.stringify(request) + '\n');
mcp.stdout.on('data', (data) => {
  output += data.toString();
  if (output.includes('id":1')) {
     console.log(output);
     mcp.kill();
  }
});
mcp.stderr.on('data', (data) => {
  console.error(data.toString());
});
