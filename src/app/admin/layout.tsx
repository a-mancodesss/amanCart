
export default function AdminLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <>
        {/* <Nav></Nav> */}
        <div>
            {children}
        </div>
        </>
    )
}