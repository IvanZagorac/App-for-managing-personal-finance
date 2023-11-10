// import React, { useRef, useEffect, useState } from 'react';
// import { Line } from 'react-chartjs-2';
// import moment from 'moment';
// import Chart from 'chart.js/auto';
// import TransactionAccount from '../../model/Transaction/transactionAccount';

// interface LineChartProps {
//   transactions: TransactionAccount[];
// }

// const LineChart: React.FC<LineChartProps> = ({ transactions }) => 
// {
//     const chartRef = useRef<any>(null); // Ref to store the chart instance
//     const [chartData, setChartData] = useState<any>(null); // State to store chart data

//     useEffect(() => 
//     {
//         const uniqueMonths = new Set<string>();
//         const lastTotalAmounts: number[] = [];

//         transactions.forEach((transaction) => 
//         {
//             const month = moment(transaction.time).format('MMMM');
//             if (uniqueMonths.size > 1 && Array.from(uniqueMonths)[0] === month) 
//             {
//                 uniqueMonths.delete(month);
//                 uniqueMonths.add(month);
//                 lastTotalAmounts.shift();
//                 const index2: any = lastTotalAmounts.length;
//                 lastTotalAmounts[index2] = transaction.accountId.totalAmount;
//             }
//             else 
//             {
//                 if (!uniqueMonths.has(month)) 
//                 {
//                     uniqueMonths.add(month);
//                     lastTotalAmounts.push(transaction.accountId.totalAmount);
//                 }
//                 else 
//                 {
//                     const index = lastTotalAmounts.length - 1;
//                     lastTotalAmounts[index] = transaction.accountId.totalAmount;
//                 }
//             }
//         });

//         const labels = Array.from(uniqueMonths);

//         const newChartData = {
//             labels,
//             datasets: [
//                 {
//                     label: 'Total Amount',
//                     data: lastTotalAmounts,
//                     borderWidth: 2,
//                     borderColor: '#024916',
//                     backgroundColor: '#024916',
//                 },
//             ],
//         };

//         setChartData(newChartData); // Store the new chart data in state

//         if (chartRef.current) 
//         {
//             chartRef.current.destroy(); // Destroy the existing chart if it exists
//         }

//         return () => 
//         {
//             if (chartRef.current) 
//             {
//                 chartRef.current.destroy(); // Cleanup: destroy the chart when the component unmounts
//             }
//         };
//     }, [transactions]);

//     return (
//         <div>
//             {chartData && (
//                 <Line
//                     data={chartData}
//                     height={400}
//                     options={{
//                         responsive: true,
//                         maintainAspectRatio: false,
//                         scales: {
//                             x: {
//                                 ticks: {
//                                     color: 'gray', 
//                                 },
//                                 grid: {
//                                     color: 'gray', 
//                                 },
//                             },
//                             y: {
//                                 ticks: {
//                                     color: 'gray', 
//                                 },
//                                 grid: {
//                                     color: 'gray', 
//                                 },
                                              
//                             },
//                         },
//                     }}
//                     ref={chartRef} // Set the ref to the chart instance
//                 />
//             )}
//         </div>
//     );
// };

// export default LineChart;



import { Line } from 'react-chartjs-2';
import moment from 'moment';
import TransactionAccount from '../../model/Transaction/transactionAccount';
// eslint-disable-next-line max-len
import Chart, { ArcElement, BarController, BarElement, BubbleController, CategoryScale, Decimation, DoughnutController, Filler, Legend, LineController, LineElement, LinearScale, LogarithmicScale, PieController, PointElement, PolarAreaController, RadarController, RadialLinearScale, ScatterController, TimeScale, TimeSeriesScale, Title, Tooltip } from 'chart.js/auto';
Chart.register(
    ArcElement,
    LineElement,
    BarElement,
    PointElement,
    BarController,
    BubbleController,
    DoughnutController,
    LineController,
    PieController,
    PolarAreaController,
    RadarController,
    ScatterController,
    CategoryScale,
    LinearScale,
    LogarithmicScale,
    RadialLinearScale,
    TimeScale,
    TimeSeriesScale,
    Decimation,
    Filler,
    Legend,
    Title,
    Tooltip
);

interface LineChartProps {
  transactions: TransactionAccount[];
}

const LineChart: React.FC<LineChartProps> = ({ transactions }) => 
{
    const uniqueMonths = new Set<string>();
    const lastTotalAmounts: number[] = [];
    transactions.forEach((transaction) => 
    {
        const month = moment(transaction.time).format('MMMM');
        if (uniqueMonths.size > 1 && Array.from(uniqueMonths)[0] === month)
        {
            uniqueMonths.delete(month);
            uniqueMonths.add(month);
            lastTotalAmounts.shift();
            const index2:any = lastTotalAmounts.length ;
            lastTotalAmounts[index2] = transaction.accountId.totalAmount;
        }
        else
        {
            if (!uniqueMonths.has(month)) 
            {
                uniqueMonths.add(month);
                lastTotalAmounts.push(transaction.accountId.totalAmount);
            }
            else 
            {
                const index = lastTotalAmounts.length - 1;
                lastTotalAmounts[index] = transaction.accountId.totalAmount;
            }
        }
      
    });

    const labels = Array.from(uniqueMonths);

    const data = {
        labels,
        datasets: [
            {
                label: 'Total Amount',
                data: lastTotalAmounts,
                borderWidth: 2,
                borderColor: '#024916',
                backgroundColor: '#024916',
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                ticks: {
                    color: 'gray', 
                },
                grid: {
                    color: 'gray', 
                },
            },
            y: {
                ticks: {
                    color: 'gray', 
                },
                grid: {
                    color: 'gray', 
                },
                  
            },
        },
    };

    return (
        <div>
            <Line
                data={data}
                height={400}
                options={options}
            />
        </div>
    );
};

export default LineChart;
