import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import db from "@/database/db"
import { formatCurrency, formatNumber } from "@/lib/formatter"
interface cardType{
  title:string
  description:string
  content:string
}
const CardComponent = ({title,description,content}:cardType) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{content}</p>
      </CardContent>
    </Card>
  )}
  
async function getSalesData(){
const data = await db.order.aggregate({
  _sum:{pricePaidInCents:true},
  _count:true,
})
// await wait()
return{
  amount:(data._sum.pricePaidInCents || 0) /100,
  numberOfSales: data._count,
}
}
// function wait() {
//   return new Promise((resolve) => {
//     setTimeout(resolve, 3000)
//   })
// }


async function getUserData() {
  const [userCount,orderData]=await Promise.all([
    db.user.count(),
    db.order.aggregate({
      _sum:{pricePaidInCents:true},
    }),
  ])
  return {
    userCount,
    avaerageValuePerUser: userCount ===0?0:(orderData._sum.pricePaidInCents||0)/userCount/100,
  }
}
async function getProductData() {
  const [activeCount, inactiveCount] = await Promise.all([
    db.product.count({ where: { isAvailableForPurchase: true } }),
    db.product.count({ where: { isAvailableForPurchase: false } }),
  ])

  return { activeCount, inactiveCount }
}
const AdminPage = async() => {
  const [salesData, userData, productData] = await Promise.all([
    getSalesData(),
    getUserData(),
    getProductData(),
  ])
  return (<>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
    <CardComponent
      title="Total Sales"
      description={`${formatNumber(salesData.numberOfSales)} Orders`}
      content={formatCurrency(salesData.amount)}
  />
    <CardComponent
      title="Users Info"
      description={`${formatCurrency(userData.avaerageValuePerUser)} Average Value`}
      content={formatNumber(userData.userCount)}
  />

    </div>
  </>
  )
}

export default AdminPage