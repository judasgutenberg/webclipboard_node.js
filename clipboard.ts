
import express, { Request as ExpressRequest, Response as ExpressResponse }  from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import mysql from 'mysql2/promise';
 

class WebClipboard {
  private serverName: string;
  private username: string;
  private password: string;
  private database: string;
  private encryptionPassword: string;
  private connection: mysql.Pool;

  constructor() {
    this.serverName = 'your_server_name';
    this.username = 'your_username';
    this.password = 'your_password';
    this.database = 'your_database';
    this.encryptionPassword = 'your_encryption_password';
    this.connection = mysql.createPool({
        host: 'your_mysql_host',
        user: 'your_mysql_user',
        password: 'your_mysql_password',
        database: 'your_database_name',
      });
  }

  async start() {
    const app = express();
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());

    app.post('/', this.handleRequest.bind(this));

    app.listen(3000, () => {
      console.log('Web Clipboard server is running on port 3000');
    });
  }

  private async handleRequest(req: ExpressRequest, res: ExpressResponse) {
    const mode = req.body.mode;
    let out = '';

    if (mode === 'login') {
      this.loginUser(req, res);
    } else if (mode === 'Save Clip') {
      this.saveClip(req, res);
    } else if (mode === 'download') {
      //this.downloadFile(req, res); //doesn't work yet
    } else {
      // Handle other modes or display the login form
      res.send('Not implemented');
    }
  }

  private async loginUser(req: ExpressRequest, res: ExpressResponse) {
    const email = req.body.email;
    const password = req.body.password;
    const cookieName = 'webClipBoard';

    // Check credentials and set the cookie if valid
    const user = await this.getUser(email, password);
    if (user) {
      const encryptedEmail = this.encryptEmail(email);
      res.cookie(cookieName, encryptedEmail, { maxAge: 30 * 365 * 24 * 60 * 60 * 1000 });
      res.redirect('/');
    } else {
      res.send('Invalid credentials');
    }
  }

  private async getUser(email: string, password: string)  {
    const result = await this.connection.query(
      'SELECT * FROM `user` WHERE email = ? AND password = ?',
      [email, password]
    );

    if(result.length > 0 && result[0]) {
        return result[0];
    }
        /*
    if (rows.length > 0) {
      return rows[0];
    }
    */
    return null;
  }

  private encryptEmail(email: string) {
    // Implement your email encryption logic here
    // Return the encrypted email
  }

  private async saveClip(req: ExpressRequest, res: ExpressResponse) {
    const userId = req.cookies['webClipBoard'];
    const clip = req.body.clip;
 

 
  }

 
}

const webClipboard = new WebClipboard();
webClipboard.start();