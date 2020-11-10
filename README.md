# 📝NOTE APP (Full, with authentication)
Simple app where you can (CRUD) create, read, update add delete notes.

You can send notes with your email client.

You need to authenticate first, you can manage only your notes, you can't delete or update notes created by other users.

Data persistence is ensured through the use of json-servers.

![note app](/public/img/note.gif)

# 🥞 Teck Stack
_BackEnd_:
[NodeJs](https://nodejs.org/en/)
[Express](http://expressjs.com/)
[Json-Server](https://www.npmjs.com/package/json-server#https)
[Ejs](https://ejs.co/)
[JWT](https://jwt.io/)
[bcrypt](https://www.npmjs.com/package/bcrypt)

_FrontEnd_:
HTML
CSS
Javascript

### Installation
Download project files.

After filling the fields with your data, rename the file env.env to .env.

Open a terminal inside the project folder and install packages with this

>npm install

### Run
_Development_
```
npm run dev
```
or *production*
```
npm run start
```
In production you can also configure the [ngnix](https://www.nginx.com/) on your server like this:

```
location /notes {
 proxy_pass http://localhost:3000;
 proxy_http_version 1.1;
 proxy_set_header Upgrade $http_upgrade;
 proxy_set_header Connection 'upgrade';
 proxy_set_header Host $host;
 proxy_cache_bypass $http_upgrade;
 }
```

### Youtube Front End creation 
[YouTube Part 1](https://youtu.be/jgdCM2vicXM)

### License
[MIT](https://choosealicense.com/licenses/mit/)

##### with ❤️ @lexpaper gd.

