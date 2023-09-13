import * as ReactDOM from 'react-dom/client';
import { Shell } from './Components/Shell/Shell';

const reactRootElement = document.getElementById('react-root')!;
const reactRoot = ReactDOM.createRoot(reactRootElement);
reactRoot.render(<Shell />);