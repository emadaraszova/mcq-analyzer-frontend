import { HeaderProps } from "@/types/common";

const Header = ({ title }: HeaderProps) => (
  <h1 className="text-3xl sm:text-5xl font-bold text-center mb-4 text-sky-700">
    {title}
  </h1>
);

export default Header;
