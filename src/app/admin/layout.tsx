import { Nav, NavLink } from "@/components/NavBar";

export default function AdminLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <>
        <Nav>
          <NavLink href={'/admin'}>Dashboard</NavLink>
          <NavLink href={'/admin/products'}>Products</NavLink>
          <NavLink href={'/admin/users'}>Customers</NavLink>
          <NavLink href={'/admin/orders'}>Sales</NavLink>
        </Nav>
        <div>
            {children}
        </div>
        </>
    )
}