# DEV-TINDER WEB

# day 1
- Create a Vite + React application
- Remove unecessary code and create a Hello World app
- Install Tailwind CSS
- Install Daisy UI
- Add NavBar component to App.jsx
- Create a NavBar.jsx separate Component file
- Install react router dom
- Create BrowserRouter > Routes > Route=/ Body > RouteChildren
- Create an Outlet in your Body Component
- Create a footer

- Create a Login Page
- Install axios
- CORS - install cors in backend => add middleware to with configurations: orgin, credentials: true
- Whenever you're making API call so pass axios => { withCredentials: true }
- install react-redux + @reduxjs/toolkit - https://redux-toolkit.js.org/tutorials/quick-start
- configureStore => Provider => createSlice => add reducer to store
- Add redux devtools in chrome
- Login and see if your data is coming properly in the store
- NavBar should update as soon as user logs in
- Refactor our code to add constants file + create a components folder 

- You should not be access other routes without login
- If token is not present, redirect user to login page
- logout feature
- get the feed and add the feed in the store
- build the user card on feed
- edit profile features
- added toast on update profile
- see all my connections
- new page - see all my connections
- new page - see all my connection requests
- feature - accept/reject connection request
- feature -send or ignore the usercard from feed
- added sign up new user
- tested E2E


# Adding web socket 
- auth in websockets
- fix bug if i am not friend then i should not be able to send message?

- feature - show green when online - [lastseen 2 hrs ago]
- when connection establish store that info
- limit messages when fetching from db
- tic-tac-toe game
- type racer