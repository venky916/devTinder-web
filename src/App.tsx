import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Body from './components/Body';
import Login from './components/Login';
import Profile from './components/Profile';
import { Provider } from 'react-redux';
import appStore from './utils/appStore';
import Feed from './components/Feed';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Connections from './components/Connections';
import Requests from './components/Requests';
import Chat from './components/Chat';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <>
      <Provider store={appStore}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter basename="/">
            <Routes>
              <Route path="/" element={<Body />}>
                <Route index element={<Feed />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/login" element={<Login />} />
                <Route path="/connections" element={<Connections />} />
                <Route path="/requests" element={<Requests />} />
                <Route path="/chat/:targetUserId" element={<Chat />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </Provider>
    </>
  );
}

export default App;
