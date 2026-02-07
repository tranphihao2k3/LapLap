export default function VeSinhLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50">
      <div className=" mx-auto px-4 ">
        {children}
      </div>
    </div>
  );
}
