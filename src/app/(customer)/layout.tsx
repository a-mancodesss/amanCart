import { Nav, NavLink } from "@/components/NavBar";

export const dynamic = 'force-dynamic'

export default function HomeLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <>
        <Nav>
          <NavLink href={'/'}>HomePage</NavLink>
          <NavLink href={'/products'}>Products</NavLink>
          <NavLink href={'/orders'}>Sales</NavLink>
        </Nav>
        <div className="p-4">
            {children}
        </div>
        </>
    )
}