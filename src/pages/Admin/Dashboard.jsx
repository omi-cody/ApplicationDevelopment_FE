export default function Dashboard() {
    return (
        <div>
            <h1 style={{ color: '#2b3053', marginBottom: '20px' }}>Admin Dashboard</h1>

            {/* Feature 15: Low Stock Notification Requirement */}
            <div style={{ backgroundColor: '#fee2e2', borderLeft: '5px solid #ef4444', padding: '15px', borderRadius: '5px' }}>
                <h3 style={{ color: '#b91c1c' }}>⚠️ Low Stock Alerts</h3>
                <p style={{ color: '#991b1b', marginTop: '5px' }}>The following parts have dropped below 10 units:</p>
                <ul style={{ marginTop: '10px', marginLeft: '20px', color: '#991b1b' }}>
                    <li>Brake Pads (Honda) - 4 units left</li>
                    <li>Engine Oil (Motul) - 2 units left</li>
                </ul>
            </div>

            <div style={{ marginTop: '30px', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h2>Welcome to BIKE 360 Admin Panel</h2>
                <p style={{ marginTop: '10px', color: '#666' }}>Use the sidebar to navigate through your management modules.</p>
            </div>
        </div>
    );
}