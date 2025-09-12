import logo from '../assets/images/logo.svg';


export function FrontDeskHeader() {
  return (
    <header className="border-b-4 border-green-500">
      <nav className="flex items-center p-4 text-white h-25">
        <div className="flex items-center h-full">
          <img className="h-full ml-15" src={logo} alt="balay Ginhawa Logo" />
        </div>
      </nav>
    </header>

    );
}