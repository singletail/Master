const config = require('./config');
const app = require('./app');

//const express = require('express');
//const http = require('http');
//const { Server } = require('socket.io');
//const axios = require('axios');

//const app = express();
//const server = http.createServer(app);
//const io = new Server(server);

/*
io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('message', async (message) => {
    try {
      const response = await axios.post(
        API_URL,
        { prompt: message, max_tokens: 100 },
        {
          headers: {
            'Authorization': `Bearer ${YOUR_OPENAI_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const reply = response.data.choices[0].text.trim();

      // Emit the response back to the client
      socket.emit('reply', reply);
    } catch (error) {
      console.error(error);
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
*/

//app.get('/', async (req, res) => {
//  console.log(`reached index`);
//  res.send('Server is running');
//});

app.listen(config.port, () => {
  console.log(`${config.name} ${config.version} ${config.port}`);
});
