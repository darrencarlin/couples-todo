interface Props {
  children: React.ReactNode;
}

export const Main = ({ children }: Props) => {
  return <main className="max-h-screen px-3 py-3">{children}</main>;
};
