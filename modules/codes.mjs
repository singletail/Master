// res.status(404).send('Not Found');
// res.sendStatus(404).end();

// set type (Content-Header):
// res.type('png')              // => 'image/png'
// res.type('html')             // => 'text/html'
// res.type('application/json') // =>'application/json'

// res.set field:
// res.set('Content-Type', 'text/plain');
// res.set({
//   'Content-Type': 'text/plain',
//   'Content-Length': '123',
//   'ETag': '12345'
// })

//res.append adds to existing header:
// res.append('Link', ['<http://localhost/>', '<http://localhost:3000/>']);
// res.append('Set-Cookie', 'foo=bar; Path=/; HttpOnly');
// res.append('Warning', '199 Miscellaneous warning');

// res.cookie(name, value [, options])
// multiple are ok.

// res.clearCookie(name [, options])

// res.download(path [, filename] [, options] [, fn])
// sends a file as attachment

// res.end ends the response process.
// sends code but no data

// res.get checks specific header field before sending

// res.send can be used for short responses
// can also be combined with status:
// res.status(404).send('Sorry, we cannot find that!');

// res.status sets status code but doesn't send

// res.sendStatus sets status code and sends its string representation as response body.
// res.sendStatus(404)

const response = {
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  203: 'Non-Authoritative Information', // like 200 but from a 3rd party
  204: 'No Content', // but no response, like for delete
  205: 'Reset Content', // success but requests client to reset view
  206: 'Partial Content', // like 200 but only part of the resource is returned
  207: 'Multi-Status', // like 200 but multiple resources returned
  208: 'Already Reported', // like 200 but results changed since last request
  226: 'IM Used', // like 200 but server is a transforming proxy
  301: 'Moved Permanently', // like 302 but permanent
  302: 'Found', // like 301 but temporary
  303: 'See Other', // like 301 but use GET to retrieve
  304: 'Not Modified', // like 200 but use cache
  305: 'Use Proxy', // like 200 but use proxy
  306: 'Switch Proxy', // like 200 but no longer used
  307: 'Temporary Redirect', // like 301 but temporary
  308: 'Permanent Redirect', // like 301 but permanent

  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required', // like 403 but payment required
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed', // like 404 but method not allowed
  406: 'Not Acceptable', // like 404 but not acceptable
  407: 'Proxy Authentication Required', // like 404 but proxy auth required
  408: 'Request Timeout', // like 404 but request timed out
  409: 'Conflict',
  410: 'Gone', // like 404 but resource is gone
  411: 'Length Required', // like 404 but length required
  412: 'Precondition Failed', // like 404 but precondition failed
  413: 'Payload Too Large', // like 404 but payload too large
  414: 'URI Too Long', // like 404 but URI too long
  415: 'Unsupported Media Type', // like 404 but unsupported media type
  416: 'Range Not Satisfiable', // like 404 but range not satisfiable
  417: 'Expectation Failed', // like 404 but expectation failed
  418: "I'm a teapot", // like 404 but I'm a teapot
  421: 'Misdirected Request', // like 404 but misdirected request
  422: 'Unprocessable Entity', // like 404 but unprocessable entity
  423: 'Locked', // like 404 but locked
  424: 'Failed Dependency', // like 404 but failed dependency
  425: 'Too Early', // like 404 but too early
  426: 'Upgrade Required', // like 404 but upgrade required
  428: 'Precondition Required', // like 404 but precondition required
  429: 'Too Many Requests', // like 404 but too many requests
  431: 'Request Header Fields Too Large', // like 404 but request header fields too large
  451: 'Unavailable For Legal Reasons', // like 404 but unavailable for legal reasons
  500: 'Internal Server Error',
  502: 'Bad Gateway',
  501: 'Not Implemented',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
  505: 'HTTP Version Not Supported',
  506: 'Variant Also Negotiates', // like 404 but variant also negotiates
  507: 'Insufficient Storage', // like 404 but insufficient storage
  508: 'Loop Detected', // like 404 but loop detected
  510: 'Not Extended', // like 404 but not extended
  511: 'Network Authentication Required', // like 404 but network authentication required
}
const status = {
  200: 'success',
  201: 'success',
  202: 'success',
  204: 'success',
  400: 'fail',
  401: 'fail',
  403: 'fail',
  404: 'fail',
  409: 'fail',
  500: 'error',
  501: 'error',
  503: 'error',
}
const statusCodes = {
  success: [200, 201, 202, 204],
  fail: [400, 401, 403, 404, 409],
  error: [500, 501, 503],
}
