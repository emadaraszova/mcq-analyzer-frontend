interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => (
  <h1 className="text-lg sm:text-2xl font-bold text-center mb-4 text-sky-700">
    {title}
  </h1>
);

export default Header;
