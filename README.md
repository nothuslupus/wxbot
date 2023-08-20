# wxbot - A Weather Bot for Discord 🌦️
wxbot is a simple Discord bot that provides weather information. Built for practice and fun, wxbot does its best to tell you the weather. wxbot tries!
## Features
- Weather Command: Get the current weather for a specified city and state (U.S. only)
- User Preferences: Save your default location for personalized weather updates
## Getting Started
### Prerequisites
- Node.js
- A Discord account and bot token
### Installation
1. Clone the repository:
```
git clone https://github.com/nothuslupus/wxbot.git
```
2. Navigate to the project directory:
```
cd wxbot
```
3. Install dependencies:
```
npm install
```
4. Create a .env file with your Discord bot token and other configuration (see .env.example for a template).
### Setup Database
Run the following command to set up the database for storing user location preferences. This will create the necessary directory structure and database file if they don't already exist:
```
npm run setupdb
```
### Registering Commands
If you're setting up the bot for the first time or have added or updated commands (including registering `weather.js` for the first time), you'll need to register them with Discord. Run the following command to deploy the commands:
```
npm run deploy
```
### Start the Bot
Start the bot with:
```
npm start
```
## Author
Patrick Murphy
## Version History
* 1.0.0-beta
    * Initial Release
## Acknowledgments
My thanks to Michelle "LaureiVarju" Dilzell. I liberally cribbed from her Zapros project, and I don't even feel bad about it. But I am thankful.
## Contributing
Feel free to fork, modify, and contribute to this project. Pull requests are welcome!
## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
