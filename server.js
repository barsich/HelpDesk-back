const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const cors = require('@koa/cors');
const app = new Koa();
const { v4: uuidv4 } = require('uuid');

const ticketsFull = [
  {
    id: uuidv4(),
    name: 'Download Node.js Installer',
    description:
      'In a web browser, navigate to https://nodejs.org/en/download/. Click the Windows Installer button to download the latest default version. At the time this article was written, version 10.16.0-x64 was the latest version. The Node.js installer includes the NPM package manager.',
    status: false,
    created: Date.now(),
  },
  {
    id: uuidv4(),
    name: 'Install Node.js and NPM from Browser',
    description: `1. Once the installer finishes downloading, launch it. Open the downloads link in your browser and click the file. Or, browse to the location where you have saved the file and double-click it to launch.
      2. The system will ask if you want to run the software – click Run.
      3. You will be welcomed to the Node.js Setup Wizard – click Next.
      4. On the next screen, review the license agreement. Click Next if you agree to the terms and install the software.
      5. The installer will prompt you for the installation location. Leave the default location, unless you have a specific need to install it somewhere else – then click Next.
      6. The wizard will let you select components to include or remove from the installation. Again, unless you have a specific need, accept the defaults by clicking Next.
      7. Finally, click the Install button to run the installer. When it finishes, click Finish.`,
    status: false,
    created: Date.now(),
  },
  {
    id: uuidv4(),
    name: 'Verify Installation',
    description: `Open a command prompt (or PowerShell), and enter the following:
      node -v
      The system should display the Node.js version installed on your system. You can do the same for NPM:
      npm -v`,
    status: false,
    created: Date.now(),
  },
];

const corsOptions = {
  origin: '*',
};

app.use(cors(corsOptions));
app.use(
  koaBody({
    multipart: true,
  })
);

app.use(async (context) => {
  const { method, id } = context.request.query;
  const { name, description } = context.request.body;

  const tickets = JSON.parse(JSON.stringify(ticketsFull)).filter(
    (ticket) => delete ticket.description
  );

  switch (method) {
    case 'allTickets':
      context.response.body = tickets;
      break;
    case 'ticketById':
      context.response.body = ticketsFull.find((ticket) => ticket.id === id);
      break;
    case 'createTicket':
      ticketsFull.push({
        id: uuidv4(),
        name,
        description: description || 'Дополнительное описание отсутствует',
        status: false,
        created: Date.now(),
      });
      context.response.body = '{ "status": "ok" }';
      break;
    case 'deleteTicket':
      const indexOfDelebleTicket = ticketsFull.findIndex((ticket) => ticket.id === id);
      ticketsFull.splice(indexOfDelebleTicket, 1);
      context.response.body = '{ "status": "ok" }';
      break;
    case 'editTicket':
      const editingTicket = ticketsFull.find((ticket) => ticket.id === id);
      editingTicket.name = name;
      editingTicket.description = description;
      context.response.body = '{ "status": "ok" }';
      break;
    case 'statusChange':
      const ticket = ticketsFull.find((ticket) => ticket.id === id);
      ticket.status ? (ticket.status = false) : (ticket.status = true);
      context.response.body = ticket;
      break;

    default:
      context.response.status = 404;
      break;
  }
});

const port = process.env.PORT || 7070;

// app.listen(port, (error) => {
//   if (error) {
//     return console.log('Error occured:', error);
//   }
//   console.log(`server is listening on ${port}`);
// });

http.createServer(app.callback()).listen(port);
