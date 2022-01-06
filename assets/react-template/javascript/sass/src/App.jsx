import { ReactComponent as Logo } from './logo.svg';
import './style/app.sass';

export default function App() {
  const doc = 'https://github.com/cooperrunyan/Sculptr#readme';
  const github = 'https://github.com/cooperrunyan/Sculptr';

  const projectName = 'PROJECT-NAME';
  const port = 3000;
  const script = 'SCRIPT';
  const platform = 'PLATFORM';
  const style = 'STYLE';

  return (
    <div className="App">
      <nav className="nav">
        <div className="logo__container">
          <Logo className="logo" />
          <p className="brand-text">sculptr</p>
        </div>
        <ul className="nav__links">
          <li>
            <a target="_blank" href={doc} className="nav__link">
              documentation
            </a>
          </li>
          <li>
            <a target="_blank" href={github} className="nav__link">
              github
            </a>
          </li>
        </ul>
      </nav>
      <main className="main">
        <h1 className="project-name">{projectName}</h1>
        <div className="info">
          <p className="info__big">
            info:<span className="code"> {'{'}</span>
          </p>
          <div className="info__content">
            <p className="code i-1">port: {port}</p>
            <p className="code i-1">script: {script}</p>
            <p className="code i-1">platform: {platform}</p>
            <p className="code i-1">style: {style}</p>
          </div>
          <p className="code info__big">{'}'}</p>
        </div>
        <a target="_blank" href={doc} className="nav__card">
          documentation
        </a>
        <a target="_blank" href={github} className="nav__card">
          github
        </a>
      </main>

      <div className="spin__wrapper">
        <Logo className="logo logo__bg spin" />
      </div>
    </div>
  );
}
