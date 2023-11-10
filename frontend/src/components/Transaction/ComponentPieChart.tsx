import React from 'react';
import { Pie } from 'react-chartjs-2';
import TransactionAccount from '../../model/Transaction/transactionAccount';

interface DepositPieChartProps {
  transactions: TransactionAccount[];
  isDeposit:boolean,
  title:string;
}

const ComponentPieChart: React.FC<DepositPieChartProps> = ({ transactions,isDeposit,title }) => 
{
   
    const depositCategories = transactions
        .filter((transaction) => transaction.categoryId.isDeposit == isDeposit)
        .map((transaction) => transaction.categoryId);

    // Calculate the share of each category in transactions
    const categoryShares = transactions.reduce((acc:any, transaction) => 
    {
        const categoryName = transaction.categoryId.name;

        if (!acc[categoryName]) 
        {
            acc[categoryName] = 0;
        }

        acc[categoryName] += transaction.transactionPrize;

        return acc;
    }, {});

    // Filter out only the labels and dataValues for deposit categories
    const labels = Object.keys(categoryShares).filter((label) =>
        depositCategories.find((category) => category.name === label)
    );
    const dataValues = labels.map((label) => categoryShares[label]);

    // Calculate total sum for percentage calculation
    const totalSum = dataValues.reduce((sum, value) => sum + value, 0);

    const percentageDataValues = dataValues.map((value) =>
        ((value / totalSum) * 100).toFixed(2)
    );

    const data = {
        labels,
        datasets: [
            {
                data: dataValues,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',   // Red
                    'rgba(54, 162, 235, 0.7)',   // Blue
                    'rgba(255, 205, 86, 0.7)',   // Yellow
                    'rgba(75, 192, 192, 0.7)',   // Green
                    'rgba(153, 102, 255, 0.7)',  // Purple
                    'rgba(255, 159, 64, 0.7)',   // Orange
                    'rgba(50, 205, 50, 0.7)',    // Lime Green
                    'rgba(255, 140, 0, 0.7)',    // Dark Orange
                    'rgba(0, 128, 128, 0.7)',    // Teal
                    'rgba(138, 43, 226, 0.7)'    // Blue Violet
                ],
            },
        ],
    };
    const config: any = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    generateLabels (chart: any) 
                    {
                        chart.legend.ctx.fillStyle = 'white';
                        const data = chart.data;
                        if (data.labels.length && data.datasets.length) 
                        {
                            return data.labels.map(function (label: any, i: any) 
                            {
                                const dataset = data.datasets[0];
                                const value = dataset.data[i];
                                const percentage = ((value / totalSum) * 100).toFixed(0);
      
                                return {
                                    text: `${label}: $${value} (${percentage}%)`,
                                    fillStyle: dataset.backgroundColor[i],
                                };
                            });
                        }
                        return [];
                    },
                },
            },
            title: {
                display: true,
                text: title,
                color: '#d5d7e3',
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => 
                    {
                        const label = context.label || '';
                        const percentage = percentageDataValues[labels.indexOf(label)];
      
                        return `${label}: ${percentage}%`;
                    },
                },
            },
        },
    };
      
    return (
        <div>
            <Pie data={data} height={400} width={400} options={config} />
        </div>
    );
};

export default ComponentPieChart;
