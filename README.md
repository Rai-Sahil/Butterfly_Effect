## Butterfly Effect - BBY32

* [General Info](#general-info)
* [Technologies](#technologies)
* [File Contents](#file-contents)
* [How to Install](#how-to-install)
* [How to Use](#how-to-use)
* [References](#references)
* [Contact Information](#contact-information)

## General Info

Butterfly Effect is a text-based game designed to help educate the general public on how they can contribute to climate change, with carefully researched game scenarios illustrating the impact of daily lifestyle decisions on the environment.

Delson Tan - Developer  
Wendy Kong - Developer  
Navdeep Litt - Developer  
Kemp Liao - Developer  
Sahil Rai - Developer  

Demo URL - https://bby32-2800-202210.herokuapp.com/  

## Technologies

* Frontend
- HTML
- CSS
- JavaScript

* Backend
- JavaScript
- Node.js
- Express
- Express Session
- Multer
- Dotenv
* Database
- JavaScript
- MySQL2
- Bcrypt

* Other Tools
- Figma
- Trello
- Zoom
- Docs
- Notion
- Github and Git

## File Contents

.  
├── README.md  
├── Readme.txt  
├── app  
│   ├── a86cb1f3-d285-11ec-873f-744ca1bdc988  
│   │   └── avatar-image.png  
│   └── a9ec65da-d30d-11ec-873f-744ca1bdc988  
│       └── avatar-image.png  
├── app.js  
├── package-lock.json  
├── package.json  
├── public  
│   ├── css  
│   │   ├── 404.css  
│   │   ├── How_To_Play.css  
│   │   ├── about-us.css  
│   │   ├── admin-dashboard.css  
│   │   ├── contact-us.css  
│   │   ├── ending-collection.css  
│   │   ├── ending-details.css  
│   │   ├── ending.css  
│   │   ├── game-card.css  
│   │   ├── header-footer.css  
│   │   ├── index.css  
│   │   ├── login-signup.css  
│   │   ├── logo.css  
│   │   ├── navbar.css  
│   │   ├── profile.css  
│   │   ├── question-edit.css  
│   │   ├── style.css  
│   │   ├── thank-you.css  
│   │   └── timeline.css  
│   ├── font  
│   │   └── SuperMarioBros2.ttf  
│   ├── html  
│   │   ├── 404.html  
│   │   ├── How_To_Play.html  
│   │   ├── about-us.html  
│   │   ├── admin-dashboard.html  
│   │   ├── components  
│   │   │   ├── footer.html  
│   │   │   └── header.html  
│   │   ├── contact-us.html  
│   │   ├── ending-collection.html  
│   │   ├── ending-details.html  
│   │   ├── ending.html  
│   │   ├── game-card.html  
│   │   ├── index.html  
│   │   ├── login.html  
│   │   ├── profile.html  
│   │   ├── question-edit.html  
│   │   └── timeline.html  
│   ├── img  
│   │   ├── Blue.ico  
│   │   ├── Butterfly_flaps_down.svg  
│   │   ├── Butterfly_flaps_up.svg  
│   │   ├── Confirmation_Icon.png  
│   │   ├── achievement_icon.png  
│   │   ├── add.png  
│   │   ├── admin-dash.svg  
│   │   ├── comfort0.png  
│   │   ├── comfort100.png  
│   │   ├── comfort50.png  
│   │   ├── contactus.png  
│   │   ├── default-avatar.png  
│   │   ├── delete.png  
│   │   ├── earth.svg  
│   │   ├── edit.png  
│   │   ├── environment0.png  
│   │   ├── environment100.png  
│   │   ├── environment50.png  
│   │   ├── exclamation_Mark.png  
│   │   ├── favicon.svg  
│   │   ├── game  
│   │   │   └── 1.jpg  
│   │   ├── game-editor.svg  
│   │   ├── home.svg  
│   │   ├── logout_icon.svg  
│   │   ├── mission_icon.jpg  
│   │   ├── nature-for-aboutus-page.svg  
│   │   ├── nature-for-login-page.svg  
│   │   ├── nature-for-signup-page.svg  
│   │   ├── profile.svg  
│   │   ├── profile1.svg  
│   │   ├── profile2.svg  
│   │   ├── smileyface.svg  
│   │   ├── timeline.svg  
│   │   ├── user.svg  
│   │   └── vision_icon.png  
│   └── js  
│       ├── admin-dashboard.js  
│       ├── contact-us.js  
│       ├── easter-egg.js  
│       ├── ending-collection.js  
│       ├── ending-details.js  
│       ├── ending.js  
│       ├── game-card.js  
│       ├── header-footer.js  
│       ├── index.js  
│       ├── login.js  
│       ├── logo.js  
│       ├── profile.js  
│       ├── question-edit.js  
│       ├── signup.js  
│       ├── thank-you.js  
│       └── timeline.js  
└── server  
    ├── constants.js  
    ├── database.sql  
    ├── db.js  
    ├── game-db.js  
    ├── init-db.js  
    ├── middleware.js  
    ├── routes.js  
    └── upload-avatar-images.js  

## How to install

* Installing MySQL on a Device
- Windows: visit https://dev.mysql.com/downloads/installer/ and download the installer, then follow the prompts to complete installation.
- Mac: visit https://formulae.brew.sh/formula/mysql and follow steps to install MySQL.

* Project Setup
1. Clone repository.
2. Navigate to project root.
3. Type `npm ci` to install dependencies without modifying the `package-lock.json` file.
4. Make a copy of the `.env.template` file and rename to `.env`. Update the values to match your local db configuration.
5. Type `npm run init-db` to initialize the db locally and seed it with data. (must have active mySQL connection on local device).
6. Type `npm start` to start the app.

## How to use

1. Sign up for an account and log in.
2. Click on "start" to start the game.
3. You'll be prompted with a question, pick an option that you think is correct.
4. After you've make your decision, your comfort meter and environment meter will be affected.
5. Once your decision has been chosen, your timeline will be updated automatically as you play the game with your decision.
6. At the end of each playthrough, you will earn ending based on the points you receive for answering questions.
7. Click on "Play History" to review all the decisions you made in the last playthrough.
8. Click on "Endings Collection" to review all the endings you collected.
9. Click on the "user icon" in the navbar to go to the profile page to edit your profile.
10. If you log in with an admin account, you will have two extra options in the navbar. One is admin dashboard, which allows you to manage users; another one is game editor, which allows you to manage questions for the game.

## References
Resources for the questions:

https://archive.curbed.com/2017/6/7/15749900/how-to-stop-climate-change-actions 

https://www.realsimple.com/home-organizing/green-living/plastic-bottle-caps-recylable 

https://imperfectidealist.com/common-recycling-mistakes/ 


## Contact Information

* Delson Tan  
delsonwtan@gmail.com  
Github - https://github.com/DelsonTan

* Wendy Kong  
eoeomj97@gmail.com  
Github - https://github.com/MinjiKong

* Navdeep Litt  
navdeepnx@gmail.com  
Github - https://github.com/nvlt1

* Kemp Liao  
kempliao@gmail.com  
Github - https://github.com/kemp-liao

* Sahil Rai  
raisahil580@gmail.com  
Github - https://github.com/Rai-Sahil
