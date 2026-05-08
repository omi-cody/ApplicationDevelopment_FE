import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Filler,
} from 'chart.js';
import { useEffect, useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    FiActivity,
    FiAlertTriangle,
    FiArrowDownRight,
    FiArrowUpRight,
    FiCheckCircle,
    FiDollarSign,
    FiEdit2,
    FiEye,
    FiMoreVertical,
    FiSearch,
    FiShoppingCart,
    FiUsers,
    FiXCircle,
} from 'react-icons/fi';
import './Admin.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

const statCards = [
    {
        id: 'revenue',
        label: 'Today Service Revenue',
        value: 'Rs. 74,500',
        trend: '+12%',
        up: true,
        icon: FiDollarSign,
        data: [28, 34, 31, 45, 41, 49, 52],
    },
    {
        id: 'jobs',
        label: 'Open Service Jobs',
        value: '18 Jobs',
        trend: '+8%',
        up: true,
        icon: FiActivity,
        data: [8, 9, 11, 10, 14, 16, 18],
    },
    {
        id: 'parts',
        label: 'Low Stock Parts',
        value: '7 Items',
        trend: '-14%',
        up: false,
        icon: FiAlertTriangle,
        data: [11, 10, 9, 8, 9, 7, 7],
    },
    {
        id: 'purchases',
        label: 'Pending Purchase Orders',
        value: '6 Orders',
        trend: '-6%',
        up: false,
        icon: FiShoppingCart,
        data: [9, 8, 7, 8, 7, 6, 6],
    },
    {
        id: 'staff',
        label: 'Active Technicians',
        value: '9 Techs',
        trend: '+5%',
        up: true,
        icon: FiUsers,
        data: [7, 8, 8, 8, 9, 9, 9],
    },
];

const categoryLoad = [
    { category: 'Full Bike Servicing', progress: 86, jobs: 31 },
    { category: 'Engine Diagnostics', progress: 72, jobs: 24 },
    { category: 'Brake & Suspension', progress: 61, jobs: 19 },
    { category: 'Electrical Repairs', progress: 54, jobs: 15 },
    { category: 'Wash & Detailing', progress: 47, jobs: 12 },
];

const serviceRowsSeed = [
    {
        id: '#SRV-2094',
        bike: 'Yamaha FZ V3',
        customer: 'Sandeep Khatri',
        service: 'Full Service',
        technician: 'Ritesh Adhikari',
        eta: '3 hrs',
        bill: 'Rs. 4,800',
        status: 'In Service',
    },
    {
        id: '#SRV-2095',
        bike: 'Honda Hornet 2.0',
        customer: 'Pratiksha Rai',
        service: 'Brake Check',
        technician: 'Ankit Thapa',
        eta: '1 hr',
        bill: 'Rs. 1,550',
        status: 'Ready',
    },
    {
        id: '#SRV-2096',
        bike: 'TVS Apache RTR',
        customer: 'Dipesh KC',
        service: 'Engine Tune-up',
        technician: 'Suraj Magar',
        eta: 'Waiting Parts',
        bill: 'Rs. 2,100',
        status: 'Waiting Parts',
    },
    {
        id: '#SRV-2097',
        bike: 'Royal Enfield Classic',
        customer: 'Nikita Shrestha',
        service: 'Electrical Fix',
        technician: 'Sabin Chaudhary',
        eta: '5 hrs',
        bill: 'Rs. 3,450',
        status: 'In Service',
    },
    {
        id: '#SRV-2098',
        bike: 'Bajaj Pulsar N160',
        customer: 'Aashish Bista',
        service: 'Chain + Oil',
        technician: 'Milan Basnet',
        eta: '2 hrs',
        bill: 'Rs. 2,250',
        status: 'Ready',
    },
];

const metricPalette = {
    revenue: { line: '#ff751f', top: 'rgba(255,117,31,0.35)', bottom: 'rgba(255,117,31,0.03)' },
    jobs: { line: '#f8923d', top: 'rgba(248,146,61,0.30)', bottom: 'rgba(248,146,61,0.03)' },
    parts: { line: '#e25e08', top: 'rgba(226,94,8,0.30)', bottom: 'rgba(226,94,8,0.03)' },
    purchases: { line: '#ff8f47', top: 'rgba(255,143,71,0.32)', bottom: 'rgba(255,143,71,0.03)' },
    staff: { line: '#f27922', top: 'rgba(242,121,34,0.32)', bottom: 'rgba(242,121,34,0.03)' },
};

const chartLabels = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

const salesOptions = {
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
    },
    scales: {
        x: {
            grid: { color: '#edf0f8' },
            ticks: { color: '#8a91a8', font: { family: 'Manrope', size: 12 } },
            border: { display: false },
        },
        y: {
            min: 0,
            max: 60,
            ticks: {
                stepSize: 10,
                color: '#8a91a8',
                font: { family: 'Manrope', size: 12 },
            },
            grid: { color: '#edf0f8' },
            border: { display: false },
        },
    },
};

export default function Dashboard() {
    const [tableSearch, setTableSearch] = useState('');
    const [selectedMetric, setSelectedMetric] = useState(statCards[0].id);
    const [hoveredMetric, setHoveredMetric] = useState(null);
    const [serviceQueue, setServiceQueue] = useState(serviceRowsSeed);
    const [openRowMenuId, setOpenRowMenuId] = useState(null);
    const [rowActionFeedback, setRowActionFeedback] = useState('');

    const activeMetricId = hoveredMetric || selectedMetric;
    const activeMetric = statCards.find((metric) => metric.id === activeMetricId) || statCards[0];
    const activePalette = metricPalette[activeMetricId] || metricPalette.revenue;

    const filteredServiceRows = useMemo(() => {
        const normalizedQuery = tableSearch.trim().toLowerCase();
        if (!normalizedQuery) {
            return serviceQueue;
        }

        return serviceQueue.filter((row) =>
            Object.values(row).some((value) => String(value).toLowerCase().includes(normalizedQuery)),
        );
    }, [tableSearch, serviceQueue]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const clickedInsideMenuShell = event.target.closest('.admin-row-menu-shell');
            if (!clickedInsideMenuShell) {
                setOpenRowMenuId(null);
            }
        };

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setOpenRowMenuId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, []);

    const handleQueueAction = (action, row) => {
        if (action === 'view') {
            setRowActionFeedback(`Opened details for ${row.id}.`);
        }

        if (action === 'reassign') {
            setRowActionFeedback(`Reassign flow started for ${row.id}.`);
        }

        if (action === 'mark-ready') {
            setServiceQueue((currentRows) =>
                currentRows.map((item) =>
                    item.id === row.id ? { ...item, status: 'Ready', eta: 'Ready for Pickup' } : item,
                ),
            );
            setRowActionFeedback(`${row.id} marked as Ready.`);
        }

        if (action === 'cancel') {
            setServiceQueue((currentRows) =>
                currentRows.map((item) =>
                    item.id === row.id ? { ...item, status: 'Waiting Parts', eta: 'Needs Review' } : item,
                ),
            );
            setRowActionFeedback(`${row.id} set to Waiting Parts for follow-up.`);
        }

        setOpenRowMenuId(null);
    };

    const trendData = useMemo(
        () => ({
            labels: chartLabels,
            datasets: [
                {
                    label: activeMetric.label,
                    data: activeMetric.data,
                    borderColor: activePalette.line,
                    tension: 0.38,
                    borderWidth: 2,
                    fill: true,
                    pointRadius: 0,
                    pointHoverRadius: 4,
                    backgroundColor: (context) => {
                        const chart = context.chart;
                        const { ctx, chartArea } = chart;
                        if (!chartArea) {
                            return activePalette.top;
                        }

                        const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                        gradient.addColorStop(0, activePalette.top);
                        gradient.addColorStop(1, activePalette.bottom);
                        return gradient;
                    },
                },
            ],
        }),
        [activeMetric, activePalette],
    );

    return (
        <div className="admin-page admin-dashboard">
            <section className="admin-kpi-grid admin-kpi-grid-five">
                {statCards.map(({ id, label, value, trend, up, icon: Icon }) => {
                    const isActive = selectedMetric === id;
                    const isPreview = hoveredMetric === id && selectedMetric !== id;

                    return (
                        <button
                            type="button"
                            className={`admin-kpi-card ${isActive ? 'is-active' : ''} ${isPreview ? 'is-preview' : ''}`}
                            key={id}
                            onMouseEnter={() => setHoveredMetric(id)}
                            onMouseLeave={() => setHoveredMetric(null)}
                            onClick={() => setSelectedMetric(id)}
                            aria-pressed={isActive}
                            aria-label={`Show ${label} trend`}
                        >
                            <div className="admin-kpi-icon">
                                <Icon size={15} />
                            </div>
                            <p>{label}</p>
                            <h3>{value}</h3>
                            <span className={`admin-kpi-trend ${up ? 'is-up' : 'is-down'}`}>
                                {up ? <FiArrowUpRight size={13} /> : <FiArrowDownRight size={13} />}
                                {trend}
                            </span>
                        </button>
                    );
                })}
            </section>

            <section className="admin-analytics-grid">
                <article className="admin-panel">
                    <div className="admin-panel-head">
                        <h2>Service Category Load</h2>
                        <button type="button" className="admin-ghost-btn">Today</button>
                    </div>
                    <div className="admin-country-list">
                        {categoryLoad.map(({ category, progress, jobs }) => (
                            <div className="admin-country-item" key={category}>
                                <div className="admin-country-row">
                                    <span>{category}</span>
                                    <strong>{jobs} Jobs</strong>
                                </div>
                                <div className="admin-country-bar-track">
                                    <div className="admin-country-bar-fill" style={{ width: `${progress}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </article>

                <article className="admin-panel admin-sales-panel">
                    <div className="admin-panel-head">
                        <div>
                            <h2>Weekly Operations Trend</h2>
                            <p>
                                {activeMetric.value} <span>{activeMetric.trend} vs previous week</span>
                            </p>
                        </div>
                        <button type="button" className="admin-ghost-btn">Live View</button>
                    </div>
                    <div className="admin-chart-wrap">
                        <Line data={trendData} options={salesOptions} />
                    </div>
                </article>
            </section>

            <section className="admin-panel admin-table-panel">
                <div className="admin-panel-head">
                    <h2>Recent Service Queue</h2>
                    <div className="admin-table-controls">
                        <label className="admin-mini-search">
                            <FiSearch size={14} />
                            <input
                                type="search"
                                placeholder="Search jobs, customer or bike"
                                value={tableSearch}
                                onChange={(event) => setTableSearch(event.target.value)}
                            />
                        </label>
                        <button type="button" className="admin-ghost-btn">See All</button>
                    </div>
                </div>
                {rowActionFeedback && <p className="admin-row-feedback">{rowActionFeedback}</p>}

                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Job ID</th>
                                <th>Bike Model</th>
                                <th>Customer</th>
                                <th>Service Type</th>
                                <th>Assigned Tech</th>
                                <th>ETA</th>
                                <th>Bill</th>
                                <th>Status</th>
                                <th aria-label="Actions" />
                            </tr>
                        </thead>
                        <tbody>
                            {filteredServiceRows.map((row) => (
                                <tr key={row.id}>
                                    <td className="cell-strong">{row.id}</td>
                                    <td>{row.bike}</td>
                                    <td>{row.customer}</td>
                                    <td>{row.service}</td>
                                    <td>{row.technician}</td>
                                    <td>{row.eta}</td>
                                    <td>{row.bill}</td>
                                    <td>
                                        <span className={`admin-status-chip status-${row.status.toLowerCase().replace(/\s+/g, '-')}`}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="admin-row-menu-shell">
                                            <button
                                                type="button"
                                                className="admin-row-menu"
                                                aria-label={`More actions for ${row.id}`}
                                                aria-expanded={openRowMenuId === row.id}
                                                onClick={() =>
                                                    setOpenRowMenuId((currentId) =>
                                                        currentId === row.id ? null : row.id,
                                                    )
                                                }
                                            >
                                                <FiMoreVertical size={14} />
                                            </button>

                                            {openRowMenuId === row.id && (
                                                <div className="admin-row-action-menu" role="menu" aria-label={`Actions for ${row.id}`}>
                                                    <button type="button" className="admin-row-action-btn" onClick={() => handleQueueAction('view', row)}>
                                                        <FiEye size={13} />
                                                        <span>View Job</span>
                                                    </button>
                                                    <button type="button" className="admin-row-action-btn" onClick={() => handleQueueAction('reassign', row)}>
                                                        <FiEdit2 size={13} />
                                                        <span>Reassign Tech</span>
                                                    </button>
                                                    <button type="button" className="admin-row-action-btn" onClick={() => handleQueueAction('mark-ready', row)}>
                                                        <FiCheckCircle size={13} />
                                                        <span>Mark Ready</span>
                                                    </button>
                                                    <button type="button" className="admin-row-action-btn is-danger" onClick={() => handleQueueAction('cancel', row)}>
                                                        <FiXCircle size={13} />
                                                        <span>Pause / Review</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredServiceRows.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="admin-empty-cell">No service records match your search.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
