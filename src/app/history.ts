import {BrowserHistory, createBrowserHistory} from 'history';

const history: BrowserHistory = createBrowserHistory();

// https://stackoverflow.com/questions/44153517/how-to-access-history-object-outside-of-a-react-component
export default history;
