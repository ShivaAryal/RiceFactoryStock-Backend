const Bran = require('./../../models/Sales/BranSales');
const MonthlySales = require('./../../models/Sales/MonthlySales');
const BranMonthlySales = require('./../../models/MonthlySales/branMonthlySales');

const getBranSales = () => new Promise((resolve,reject)=>{
    Bran.find({},(err,sales)=>{
        let salesArr = []
        sales.map((sale,i)=>{
            let saleObj = {
                _id:sale._id,
                customer:sale.customer,
                unitPrice:sale.unitPrice,
                noofPackets:sale.noofPackets,
                date:sale.date,
                total:sale.unitPrice*sale.noofPackets
            }
            salesArr.push(saleObj)
        })
        err && reject(err) || resolve(salesArr);
    })
})

const getBranMonthlySales = () => new Promise((resolve,reject)=>{
    BranMonthlySales.find({},(err,sales)=>{
        err && reject(err) || resolve(sales)
    })
})

const postBranSales = (sales) => new Promise((resolve,reject)=>{
    let saleData = new Bran(sales);
    saleData.save((err,sales)=>{
        if(err) reject(err);
        BranMonthlySales.findOne({month:parseInt(sales.date.slice(5,7))},(err,monthlySale)=>{
            let myMonthSale = {}
            if(err) reject(err)
            else if(!monthlySale){
                myMonthSale.month = parseInt(sales.date.slice(5,7))
                myMonthSale.total = sales.unitPrice * sales.noofPackets
                let monthData = new BranMonthlySales(myMonthSale);
                monthData.save((err,data)=>{
                    err && reject(err) || resolve(sales)
                })
            }else{
                monthlySale.month = monthlySale.month
                monthlySale.total = monthlySale.total + sales.unitPrice * sales.noofPackets
                monthlySale.save((err,data)=>{
                    err && reject(err) || resolve(sales)
                })
            }
        })

        MonthlySales.findOne({month:parseInt(sales.date.slice(5,7))},(err,monthlySale)=>{
            let myMonthSale = {}
            if(err) reject(err);
            else if(!monthlySale){
                myMonthSale.month=parseInt(sales.date.slice(5,7))
                myMonthSale.total = sales.unitPrice*sales.noofPackets
                myMonthSale.profit =sales.unitPrice*sales.noofPackets
                let monthData = new MonthlySales(myMonthSale);
                monthData.save((err,data)=>{
                    err && reject(err) || resolve(sales)
                })
            }else{
                monthlySale._id = monthlySale._id,
                monthlySale.month = monthlySale.month,
                monthlySale.total = monthlySale.total + sales.unitPrice*sales.noofPackets
                monthlySale.profit = monthlySale.profit + sales.unitPrice*sales.noofPackets
                monthlySale.save((err,data)=>{
                    err && reject(err) || resolve(sales)
                })
            }
        })
    })
})

const editBranSale = (sale) => new Promise((resolve,reject)=>{
    Bran.findOne({_id:sale.id},(err,mySale)=>{
        if(err) reject(err);
        mySale.customer = sale.customer
        mySale.unitPrice = sale.unitPrice
        mySale.noofPackets = sale.noofPackets
        mySale.date = sale.date
        mySale.save((err,data)=>{
            err && reject(err) || resolve(data)
        })
    })
})

const deleteBranSale = (id) => new Promise((resolve,reject)=>{
    Bran.deleteOne({_id:id},(err,data)=>{
        err && reject(err) || resolve(data)
    })
})

module.exports={
    getBranSales,postBranSales, getBranMonthlySales, editBranSale, deleteBranSale
}