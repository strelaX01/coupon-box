import { Page, Card, DataTable, Pagination, DatePicker, Select, Text } from "@shopify/polaris";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { useState, useCallback, useEffect } from "react";
import { authenticate } from "../shopify.server";
import axios from 'axios';
import { json } from "@remix-run/node";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const loader = async ({ request }) => {
    await authenticate.admin(request);
    return json({ apiKey: process.env.SHOPIFY_API_KEY || "" });
  };
  

const Report = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedOption, setSelectedOption] = useState("today");
    const [totalEmails, setTotalEmails] = useState(0);
    const [selectedMonth, setSelectedMonth] = useState({
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
    });
    const [selectedDates, setSelectedDates] = useState({
        start: new Date(),
        end: new Date(),
    });
    const [reportData, setReportData] = useState([]);
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: "Emails Collected",
                data: [],
                backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
        ],
    });

    useEffect(() => {
        fetchReportData();
    }, [selectedDates]);

    const fetchReportData = async () => {
        try {
            const response = await axios.get('http://localhost:3000/get-emails');
            const data = response.data;

            const totalEmails = data.length;
            setTotalEmails(totalEmails);

            updateTableData(data);

            const filteredData = filterDataByDate(data, selectedDates.start, selectedDates.end);
            updateChartData(filteredData);
        } catch (error) {
            console.error("Error fetching report data:", error);
        }
    };

    const filterDataByDate = (data, startDate, endDate) => {
        const startDay = new Date(startDate.setHours(0, 0, 0, 0));
        const endDay = new Date(endDate.setHours(23, 59, 59, 999));

        return data.filter(item => {
            const submitDate = new Date(item.submit_date).setHours(0, 0, 0, 0);
            return submitDate >= startDay.getTime() && submitDate <= endDay.getTime();
        });
    };

    const groupData = (filteredData) => {
        const groupedData = filteredData.reduce((acc, item) => {
            const date = new Date(item.submit_date).toLocaleDateString();
            if (!acc[date]) {
                acc[date] = { count: 0, coupon_code: item.coupon_code ? 1 : 0 };
            }
            acc[date].count += 1;
            return acc;
        }, {});

        const labels = Object.keys(groupedData);
        const collectedData = Object.values(groupedData).map(item => item.count);

        return { groupedData, labels, collectedData };
    };

    const updateChartData = (filteredData) => {
        const { labels, collectedData } = groupData(filteredData);
        setChartData({
            labels: labels,
            datasets: [
                {
                    label: "Emails Collected",
                    data: collectedData,
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                },
            ],
        });
    
        console.log("Chart data updated:", { labels, collectedData });
    };
    
    const updateTableData = (filteredData) => {
        const tableRows = filteredData.map((item, index) => [
            index + 1,
            item.email,
            new Date(item.submit_date).toLocaleDateString(),
            item.firstname,
            item.lastname,
            item.phone,
            item.coupon_code,
            item.discount_value,
        ]);
        setReportData(tableRows);
    };

    const handleOptionChange = (value) => {
        setSelectedOption(value);
        const today = new Date();
        let startDate;

        if (value === "today") {
            startDate = new Date(today.setHours(0, 0, 0, 0));
        } else if (value === "last3days") {
            startDate = new Date(today.setDate(today.getDate() - 3));
        } else if (value === "last7days") {
            startDate = new Date(today.setDate(today.getDate() - 7));
        } else if (value === "last10days") {
            startDate = new Date(today.setDate(today.getDate() - 10));
        } else if (value === "month") {
            const start = new Date(selectedMonth.year, selectedMonth.month, 1);
            const end = new Date(selectedMonth.year, selectedMonth.month + 1, 0);
            setSelectedDates({ start, end });
            fetchReportData();
            return;
        }

        setSelectedDates({
            start: startDate,
            end: new Date(),
        });
    };

    const handleMonthChange = useCallback((month, year) => {
        setSelectedMonth({ month, year });
        const start = new Date(year, month, 1);
        const end = new Date(year, month + 1, 0);
        setSelectedDates({ start, end });
    }, []);

    const handlePickerChange = useCallback((value) => {
        setSelectedDates(value);
    }, []);

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: `Emails collected from ${selectedDates.start instanceof Date && !isNaN(selectedDates.start.getTime()) ? selectedDates.start.toLocaleDateString() : 'N/A'} to ${selectedDates.end instanceof Date && !isNaN(selectedDates.end.getTime()) ? selectedDates.end.toLocaleDateString() : 'N/A'}`,
            },
        },
    };

    const dateOptions = [
        { label: "Today", value: "today" },
        { label: "Last 3 days", value: "last3days" },
        { label: "Last 7 days", value: "last7days" },
        { label: "Last 10 days", value: "last10days" },
        { label: "Select month", value: "month" },
    ];

    const paginatedData = reportData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < Math.ceil(reportData.length / rowsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <Page title="Report">
            <Card sectioned>
                <Select
                    label="Select date range"
                    options={dateOptions}
                    onChange={handleOptionChange}
                    value={selectedOption}
                />

                {selectedOption === "month" && (
                    <DatePicker
                        month={selectedMonth.month}
                        year={selectedMonth.year}
                        onChange={handlePickerChange} 
                        onMonthChange={handleMonthChange}
                    />
                )}

                <div style={{ marginBottom: "20px" }}>
                    <Bar data={chartData} options={chartOptions} />
                </div>

                <Text variation="headingMd">
                    Total Emails Collected: {totalEmails}
                </Text>

                <DataTable
                    columnContentTypes={["text", "text", "text", "text", "text", "text", "text", "text"]}
                    headings={["No.", "Email", "Date", "Firstname", "Lastname", "Mobile", "Given Coupon", "Coupon Value"]}
                    rows={paginatedData}
                />

                <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                    <Pagination
                        hasPrevious={currentPage > 1}
                        onPrevious={handlePreviousPage}
                        hasNext={currentPage < Math.ceil(reportData.length / rowsPerPage)}
                        onNext={handleNextPage}
                    />
                </div>
            </Card>
        </Page>
    );
};

export default Report;
