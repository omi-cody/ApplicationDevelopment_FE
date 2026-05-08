import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    FiBell,
    FiChevronDown,
    FiClock,
    FiHelpCircle,
    FiLogOut,
    FiMenu,
    FiSearch,
    FiSettings,
    FiUser,
} from 'react-icons/fi';

const routeTitles = [
    { key: '/admin/staff', title: 'Staff Management' },
    { key: '/admin/inventory', title: 'Inventory & Vendors' },
    { key: '/admin/reports', title: 'Financial Reports' },
    { key: '/admin/settings', title: 'Profile Settings' },
];

const localSearchCatalog = [
    {
        id: 'dashboard-overview',
        title: 'Dashboard Overview',
        description: 'Revenue, shipments, orders, delivery trend and live shipping table',
        to: '/admin',
        keywords: ['dashboard', 'revenue', 'orders', 'shipments', 'delivery', 'kpi', 'sales'],
    },
    {
        id: 'staff-directory',
        title: 'Staff Directory',
        description: 'Browse all staff members and their access status',
        to: '/admin/staff/directory',
        keywords: ['staff', 'employee', 'directory', 'access', 'roles'],
    },
    {
        id: 'staff-register',
        title: 'Register New Staff',
        description: 'Create a new staff account',
        to: '/admin/staff/register',
        keywords: ['register', 'staff', 'create', 'account'],
    },
    {
        id: 'inventory-parts',
        title: 'Parts Inventory',
        description: 'Part stock, prices and categories',
        to: '/admin/inventory/parts',
        keywords: ['inventory', 'parts', 'stock', 'price', 'category'],
    },
    {
        id: 'inventory-vendors',
        title: 'Vendor Management',
        description: 'Supplier contacts and active vendor status',
        to: '/admin/inventory/vendors',
        keywords: ['vendor', 'supplier', 'contact', 'distributor'],
    },
    {
        id: 'inventory-purchases',
        title: 'Purchase Invoices',
        description: 'All purchase records and invoices',
        to: '/admin/inventory/purchases',
        keywords: ['purchase', 'invoice', 'orders', 'billing'],
    },
    {
        id: 'report-daily',
        title: 'Daily Financial Reports',
        description: 'Daily income and expense summary',
        to: '/admin/reports/daily',
        keywords: ['daily', 'reports', 'finance', 'income', 'expense'],
    },
    {
        id: 'report-monthly',
        title: 'Monthly Financial Reports',
        description: 'Monthly financial trends and performance',
        to: '/admin/reports/monthly',
        keywords: ['monthly', 'reports', 'finance', 'trends'],
    },
    {
        id: 'report-yearly',
        title: 'Yearly Financial Reports',
        description: 'Yearly business performance comparison',
        to: '/admin/reports/yearly',
        keywords: ['yearly', 'annual', 'report', 'performance'],
    },
    {
        id: 'profile-settings',
        title: 'Profile Settings',
        description: 'Manage admin profile and account preferences',
        to: '/admin/settings/profile',
        keywords: ['profile', 'settings', 'account', 'preferences'],
    },
];

const notifications = [
    { id: 1, title: 'New purchase invoice pending review', time: '2m ago', tone: 'primary' },
    { id: 2, title: 'Inventory alert: Engine Oil stock is low', time: '14m ago', tone: 'warning' },
    { id: 3, title: 'Monthly report export completed', time: '1h ago', tone: 'success' },
];

function getTitle(pathname) {
    const routeMatch = routeTitles.find(({ key }) => pathname.startsWith(key));
    return routeMatch ? routeMatch.title : 'Dashboard';
}

function normalizeBackendResults(payload) {
    const source = Array.isArray(payload)
        ? payload
        : payload?.results || payload?.items || payload?.data || [];

    if (!Array.isArray(source)) {
        return [];
    }

    return source
        .map((item, index) => {
            if (typeof item === 'string') {
                return {
                    id: `remote-${index}`,
                    title: item,
                    description: 'Search result',
                    to: '/admin',
                };
            }

            return {
                id: item.id || item._id || `remote-${index}`,
                title: item.title || item.name || item.label || 'Untitled Result',
                description: item.description || item.subtitle || item.type || 'Search result',
                to: item.to || item.route || item.path || '/admin',
            };
        })
        .filter((item) => item.title);
}

export default function Navbar({ onToggleSidebar }) {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [query, setQuery] = useState('');
    const [remoteResults, setRemoteResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const searchShellRef = useRef(null);
    const notificationShellRef = useRef(null);
    const userShellRef = useRef(null);
    const searchEndpoint = import.meta.env.VITE_ADMIN_SEARCH_URL || '/api/admin/search';
    const isOverlayActive = isSearchOpen || isNotificationsOpen || isUserMenuOpen;

    const localResults = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        if (!normalizedQuery) {
            return [];
        }

        return localSearchCatalog
            .filter((item) => {
                const text = `${item.title} ${item.description} ${item.keywords.join(' ')}`.toLowerCase();
                return text.includes(normalizedQuery);
            })
            .slice(0, 6);
    }, [query]);

    const mergedResults = useMemo(() => {
        const dedupe = new Map();
        [...remoteResults, ...localResults].forEach((result) => {
            const key = `${result.title}::${result.to}`;
            if (!dedupe.has(key)) {
                dedupe.set(key, result);
            }
        });
        return Array.from(dedupe.values()).slice(0, 8);
    }, [localResults, remoteResults]);

    useEffect(() => {
        const normalizedQuery = query.trim();
        if (normalizedQuery.length < 2) {
            return undefined;
        }

        const abortController = new AbortController();
        const timer = setTimeout(async () => {
            setIsSearching(true);
            try {
                const delimiter = searchEndpoint.includes('?') ? '&' : '?';
                const response = await fetch(`${searchEndpoint}${delimiter}q=${encodeURIComponent(normalizedQuery)}`, {
                    signal: abortController.signal,
                    headers: { Accept: 'application/json' },
                });

                if (!response.ok) {
                    throw new Error(`Search request failed with status ${response.status}`);
                }

                const payload = await response.json();
                setRemoteResults(normalizeBackendResults(payload));
            } catch (error) {
                if (error.name !== 'AbortError') {
                    setRemoteResults([]);
                }
            } finally {
                if (!abortController.signal.aborted) {
                    setIsSearching(false);
                }
            }
        }, 250);

        return () => {
            abortController.abort();
            clearTimeout(timer);
        };
    }, [query, searchEndpoint]);

    useEffect(() => {
        const closeOnOutsideClick = (event) => {
            if (searchShellRef.current && !searchShellRef.current.contains(event.target)) {
                setIsSearchOpen(false);
            }
            if (notificationShellRef.current && !notificationShellRef.current.contains(event.target)) {
                setIsNotificationsOpen(false);
            }
            if (userShellRef.current && !userShellRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        };

        const closeOnEscape = (event) => {
            if (event.key === 'Escape') {
                setIsSearchOpen(false);
                setIsNotificationsOpen(false);
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', closeOnOutsideClick);
        document.addEventListener('keydown', closeOnEscape);
        return () => {
            document.removeEventListener('mousedown', closeOnOutsideClick);
            document.removeEventListener('keydown', closeOnEscape);
        };
    }, []);

    useEffect(() => {
        if (isOverlayActive) {
            document.body.classList.add('admin-ui-lock');
        } else {
            document.body.classList.remove('admin-ui-lock');
        }

        return () => {
            document.body.classList.remove('admin-ui-lock');
        };
    }, [isOverlayActive]);

    const closeAllPopoverPanels = () => {
        setIsSearchOpen(false);
        setIsNotificationsOpen(false);
        setIsUserMenuOpen(false);
        setRemoteResults([]);
    };

    const openSearchResult = (result) => {
        navigate(result.to || '/admin');
        setQuery('');
        setIsSearchOpen(false);
        setRemoteResults([]);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        if (mergedResults.length > 0) {
            openSearchResult(mergedResults[0]);
            return;
        }

        if (query.trim()) {
            navigate('/admin');
            setIsSearchOpen(false);
        }
    };

    const handleProfileAction = (action) => {
        if (action === 'signout') {
            navigate('/login');
        } else if (action === 'profile') {
            navigate('/admin/settings/profile');
        } else if (action === 'help') {
            navigate('/admin/staff/directory');
        } else if (action === 'preferences') {
            navigate('/admin/settings/profile');
        }

        setIsUserMenuOpen(false);
    };

    return (
        <header className="admin-navbar">
            {isOverlayActive && (
                <button
                    type="button"
                    className="admin-global-overlay"
                    aria-label="Close active menu"
                    onClick={closeAllPopoverPanels}
                />
            )}

            <div className="admin-navbar-title-wrap">
                <button
                    type="button"
                    className="admin-sidebar-toggle-btn"
                    aria-label="Toggle sidebar"
                    onClick={onToggleSidebar}
                    title="Toggle sidebar"
                >
                    <FiMenu size={16} />
                </button>
                <h1 className="admin-navbar-title">{getTitle(pathname)}</h1>
            </div>

            <div className="admin-navbar-actions">
                <form
                    className={`admin-search-shell ${isSearchOpen ? 'is-open' : ''}`}
                    ref={searchShellRef}
                    onSubmit={handleSearchSubmit}
                    role="search"
                >
                    <label className="admin-search" aria-label="Search dashboard">
                        <FiSearch size={16} />
                        <input
                            type="search"
                            placeholder="Search anything..."
                            value={query}
                            onFocus={() => {
                                setIsNotificationsOpen(false);
                                setIsUserMenuOpen(false);
                                setIsSearchOpen(true);
                            }}
                            onChange={(event) => {
                                const nextQuery = event.target.value;
                                setQuery(nextQuery);
                                if (nextQuery.trim().length < 2) {
                                    setRemoteResults([]);
                                    setIsSearching(false);
                                }
                                setIsNotificationsOpen(false);
                                setIsUserMenuOpen(false);
                                setIsSearchOpen(true);
                            }}
                        />
                    </label>

                    {isSearchOpen && query.trim() && (
                        <div className="admin-flyout admin-search-flyout" role="listbox" aria-label="Search results">
                            {isSearching && <p className="admin-flyout-note">Searching...</p>}

                            {!isSearching && mergedResults.length === 0 && (
                                <p className="admin-flyout-note">No matches found.</p>
                            )}

                            {!isSearching &&
                                mergedResults.map((result) => (
                                    <button
                                        key={result.id}
                                        type="button"
                                        className="admin-flyout-item"
                                        onClick={() => openSearchResult(result)}
                                    >
                                        <span className="admin-flyout-title">{result.title}</span>
                                        <span className="admin-flyout-subtitle">{result.description}</span>
                                    </button>
                                ))}
                        </div>
                    )}
                </form>

                <div className="admin-popover-shell" ref={notificationShellRef}>
                    <button
                        type="button"
                        className="admin-icon-btn"
                        aria-label="Notifications"
                        onClick={() => {
                            setIsNotificationsOpen((prev) => !prev);
                            setIsUserMenuOpen(false);
                            setIsSearchOpen(false);
                        }}
                    >
                        <FiBell size={17} />
                        <span className="admin-dot" />
                    </button>

                    {isNotificationsOpen && (
                        <div className="admin-flyout admin-notification-flyout" role="dialog" aria-label="Notifications">
                            <div className="admin-flyout-head">
                                <h3>Notifications</h3>
                                <button type="button" className="admin-clear-btn">Mark all read</button>
                            </div>
                            <div className="admin-notification-list">
                                {notifications.map((notification) => (
                                    <article key={notification.id} className={`admin-notice-card tone-${notification.tone}`}>
                                        <p>{notification.title}</p>
                                        <span>
                                            <FiClock size={12} />
                                            {notification.time}
                                        </span>
                                    </article>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="admin-popover-shell" ref={userShellRef}>
                    <button
                        type="button"
                        className="admin-user-btn"
                        aria-label="Open profile menu"
                        onClick={() => {
                            setIsUserMenuOpen((prev) => !prev);
                            setIsNotificationsOpen(false);
                            setIsSearchOpen(false);
                        }}
                    >
                        <span className="admin-avatar">RS</span>
                        <FiChevronDown size={15} />
                    </button>

                    {isUserMenuOpen && (
                        <div className="admin-flyout admin-user-flyout" role="menu" aria-label="User menu">
                            <button type="button" className="admin-flyout-item admin-user-item" onClick={() => handleProfileAction('profile')}>
                                <FiUser size={14} />
                                <span>Profile</span>
                            </button>
                            <button type="button" className="admin-flyout-item admin-user-item" onClick={() => handleProfileAction('preferences')}>
                                <FiSettings size={14} />
                                <span>Account Preferences</span>
                            </button>
                            <button type="button" className="admin-flyout-item admin-user-item" onClick={() => handleProfileAction('help')}>
                                <FiHelpCircle size={14} />
                                <span>Support Center</span>
                            </button>
                            <button type="button" className="admin-flyout-item admin-user-item is-danger" onClick={() => handleProfileAction('signout')}>
                                <FiLogOut size={14} />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
