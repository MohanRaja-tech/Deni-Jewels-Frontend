import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { reportAPI } from '../../services/api';
import {
    FiFileText, FiDownload, FiPackage, FiAlertTriangle,
    FiBarChart2, FiCheckCircle, FiLoader, FiCalendar
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminReports = () => {
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState(null);
    const [reportType, setReportType] = useState('full');

    const reportTypes = [
        {
            id: 'full',
            label: 'Full Inventory Report',
            description: 'Complete report with all products, pricing, categories, and stock alerts',
            icon: FiFileText,
            color: 'from-amber-500 to-amber-600',
        },
        {
            id: 'inventory',
            label: 'Product Listing',
            description: 'Detailed list of all products with current pricing and stock levels',
            icon: FiPackage,
            color: 'from-blue-500 to-blue-600',
        },
        {
            id: 'lowstock',
            label: 'Low Stock Report',
            description: 'Products with critically low or zero stock that need restocking',
            icon: FiAlertTriangle,
            color: 'from-red-500 to-red-600',
        },
    ];

    const generateReport = async () => {
        setLoading(true);
        try {
            const res = await reportAPI.generate(reportType);
            setReportData(res.data.data);
            toast.success('Report generated successfully!');
        } catch (error) {
            console.error('Error generating report:', error);
            toast.error('Failed to generate report');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        if (!amount && amount !== 0) return '—';
        return '₹' + Number(amount).toLocaleString('en-IN');
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    };

    const downloadPDF = () => {
        if (!reportData) return;

        const printWindow = window.open('', '_blank');
        const selectedType = reportTypes.find(t => t.id === reportType);
        const now = formatDate(reportData.generatedAt);

        let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Deni Jewellers - ${selectedType.label}</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    color: #333;
                    padding: 40px;
                    background: #fff;
                    line-height: 1.5;
                }
                .header {
                    text-align: center;
                    border-bottom: 3px solid #D4A853;
                    padding-bottom: 20px;
                    margin-bottom: 30px;
                }
                .header h1 {
                    font-size: 28px;
                    color: #D4A853;
                    margin-bottom: 5px;
                    letter-spacing: 2px;
                }
                .header h2 {
                    font-size: 18px;
                    color: #666;
                    font-weight: 400;
                }
                .header .date {
                    font-size: 12px;
                    color: #999;
                    margin-top: 8px;
                }
                .section {
                    margin-bottom: 30px;
                    page-break-inside: avoid;
                }
                .section h3 {
                    font-size: 16px;
                    color: #D4A853;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 8px;
                    margin-bottom: 15px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .summary-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 12px;
                    margin-bottom: 10px;
                }
                .summary-card {
                    background: #faf7f0;
                    border-radius: 8px;
                    padding: 15px;
                    text-align: center;
                    border: 1px solid #f0e6d0;
                }
                .summary-card .value {
                    font-size: 24px;
                    font-weight: bold;
                    color: #333;
                }
                .summary-card .label {
                    font-size: 11px;
                    color: #888;
                    text-transform: uppercase;
                    margin-top: 4px;
                    letter-spacing: 0.5px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 12px;
                }
                th {
                    background-color: #D4A853;
                    color: white;
                    padding: 10px 8px;
                    text-align: left;
                    font-weight: 600;
                    text-transform: uppercase;
                    font-size: 10px;
                    letter-spacing: 0.5px;
                }
                td {
                    padding: 8px;
                    border-bottom: 1px solid #f0f0f0;
                }
                tr:nth-child(even) {
                    background-color: #faf7f0;
                }
                tr:hover {
                    background-color: #f5f0e5;
                }
                .stock-badge {
                    display: inline-block;
                    padding: 2px 8px;
                    border-radius: 12px;
                    font-size: 10px;
                    font-weight: 600;
                }
                .stock-out { background: #fee2e2; color: #dc2626; }
                .stock-low { background: #fef3c7; color: #d97706; }
                .stock-ok { background: #dcfce7; color: #16a34a; }
                .status-enabled { color: #16a34a; }
                .status-disabled { color: #dc2626; }
                .text-right { text-align: right; }
                .text-center { text-align: center; }
                .capitalize { text-transform: capitalize; }
                .breakdown-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }
                .footer {
                    margin-top: 40px;
                    padding-top: 15px;
                    border-top: 1px solid #eee;
                    text-align: center;
                    font-size: 11px;
                    color: #bbb;
                }
                @media print {
                    body { padding: 20px; }
                    .no-print { display: none; }
                    table { page-break-inside: auto; }
                    tr { page-break-inside: avoid; page-break-after: auto; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>✦ Deni Jewellers ✦</h1>
                <h2>${selectedType.label}</h2>
                <p class="date">Generated on: ${now}</p>
            </div>`;

        // Summary Section
        html += `
            <div class="section">
                <h3>Inventory Summary</h3>
                <div class="summary-grid">
                    <div class="summary-card">
                        <div class="value">${reportData.summary.totalProducts}</div>
                        <div class="label">Total Products</div>
                    </div>
                    <div class="summary-card">
                        <div class="value">${reportData.summary.enabledProducts}</div>
                        <div class="label">Active</div>
                    </div>
                    <div class="summary-card">
                        <div class="value">${reportData.summary.totalStockQuantity}</div>
                        <div class="label">Total Stock</div>
                    </div>
                    <div class="summary-card">
                        <div class="value">${formatCurrency(reportData.summary.totalInventoryValue)}</div>
                        <div class="label">Total Value</div>
                    </div>
                </div>
            </div>`;

        // Category & Metal breakdowns
        html += `
            <div class="section">
                <h3>Distribution Analysis</h3>
                <div class="breakdown-grid">
                    <div>
                        <table>
                            <thead><tr><th>Category</th><th class="text-center">Products</th><th class="text-center">Stock</th></tr></thead>
                            <tbody>
                                ${reportData.categoryStats.map(cat => `
                                    <tr>
                                        <td>${cat._id}</td>
                                        <td class="text-center">${cat.count}</td>
                                        <td class="text-center">${cat.totalStock}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <table>
                            <thead><tr><th>Metal Type</th><th class="text-center">Products</th><th class="text-center">Avg Weight</th></tr></thead>
                            <tbody>
                                ${reportData.metalTypeStats.map(metal => `
                                    <tr>
                                        <td class="capitalize">${metal._id}</td>
                                        <td class="text-center">${metal.count}</td>
                                        <td class="text-center">${metal.avgWeight?.toFixed(2) || '—'}g</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>`;

        // Stock Distribution
        html += `
            <div class="section">
                <h3>Stock Health</h3>
                <div class="summary-grid">
                    <div class="summary-card">
                        <div class="value" style="color:#dc2626">${reportData.stockDistribution.outOfStock}</div>
                        <div class="label">Out of Stock</div>
                    </div>
                    <div class="summary-card">
                        <div class="value" style="color:#ea580c">${reportData.stockDistribution.critical}</div>
                        <div class="label">Critical (1-2)</div>
                    </div>
                    <div class="summary-card">
                        <div class="value" style="color:#d97706">${reportData.stockDistribution.low}</div>
                        <div class="label">Low (3-5)</div>
                    </div>
                    <div class="summary-card">
                        <div class="value" style="color:#16a34a">${reportData.stockDistribution.adequate + reportData.stockDistribution.high}</div>
                        <div class="label">Well Stocked (6+)</div>
                    </div>
                </div>
            </div>`;

        // Low Stock Items Table
        if (reportData.lowStockItems?.length > 0) {
            html += `
                <div class="section">
                    <h3>Low Stock Alerts</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>SKU</th>
                                <th>Category</th>
                                <th>Metal</th>
                                <th>Purity</th>
                                <th class="text-center">Stock</th>
                                <th class="text-right">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${reportData.lowStockItems.map(item => `
                                <tr>
                                    <td><strong>${item.name}</strong></td>
                                    <td>${item.sku || '—'}</td>
                                    <td>${item.category}</td>
                                    <td class="capitalize">${item.metalType}</td>
                                    <td>${item.purity}</td>
                                    <td class="text-center">
                                        <span class="stock-badge ${item.stockQuantity === 0 ? 'stock-out' : 'stock-low'}">
                                            ${item.stockQuantity === 0 ? 'Out' : item.stockQuantity + ' left'}
                                        </span>
                                    </td>
                                    <td class="text-right">${item.priceInfo ? formatCurrency(item.priceInfo.totalPrice) : '—'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>`;
        }

        // Full Product Table (for full and inventory reports)
        if (reportData.allProducts?.length > 0) {
            html += `
                <div class="section">
                    <h3>Complete Product Listing</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Product Name</th>
                                <th>SKU</th>
                                <th>Category</th>
                                <th>Metal</th>
                                <th>Purity</th>
                                <th class="text-right">Weight</th>
                                <th class="text-center">Stock</th>
                                <th class="text-center">Status</th>
                                <th class="text-right">Base</th>
                                <th class="text-right">Making</th>
                                <th class="text-right">GST</th>
                                <th class="text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${reportData.allProducts.map((p, i) => `
                                <tr>
                                    <td>${i + 1}</td>
                                    <td><strong>${p.name}</strong></td>
                                    <td>${p.sku || '—'}</td>
                                    <td>${p.category}</td>
                                    <td class="capitalize">${p.metalType}</td>
                                    <td>${p.purity}</td>
                                    <td class="text-right">${p.weight}g</td>
                                    <td class="text-center">
                                        <span class="stock-badge ${p.stockQuantity === 0 ? 'stock-out' : p.stockQuantity <= 5 ? 'stock-low' : 'stock-ok'}">
                                            ${p.stockQuantity}
                                        </span>
                                    </td>
                                    <td class="text-center ${p.isEnabled ? 'status-enabled' : 'status-disabled'}">
                                        ${p.isEnabled ? '●' : '○'}
                                    </td>
                                    <td class="text-right">${p.priceInfo ? formatCurrency(p.priceInfo.basePrice) : '—'}</td>
                                    <td class="text-right">${p.priceInfo ? formatCurrency(p.priceInfo.makingCharge) : '—'}</td>
                                    <td class="text-right">${p.priceInfo ? formatCurrency(p.priceInfo.gstAmount) : '—'}</td>
                                    <td class="text-right"><strong>${p.priceInfo ? formatCurrency(p.priceInfo.totalPrice) : '—'}</strong></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>`;
        }

        html += `
            <div class="footer">
                <p>This report was generated by Deni Jewellers Admin System · All prices are inclusive of GST</p>
                <p>Prices are calculated based on live metal rates at the time of report generation</p>
            </div>
            <script>window.onload = function() { window.print(); }</script>
        </body></html>`;

        printWindow.document.write(html);
        printWindow.document.close();
    };

    const getStockBadgeClass = (qty) => {
        if (qty === 0) return 'bg-red-100 text-red-600';
        if (qty <= 5) return 'bg-amber-100 text-amber-600';
        return 'bg-green-100 text-green-600';
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-gray-800">Reports</h1>
                    <p className="text-sm text-gray-400 mt-1">Generate and download inventory reports</p>
                </div>
                {reportData && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={downloadPDF}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 
                            text-white rounded-xl font-medium text-sm shadow-lg shadow-primary-200 
                            hover:shadow-xl hover:shadow-primary-300 transition-all duration-200 hover:scale-105"
                        id="download-report-btn"
                    >
                        <FiDownload className="w-4 h-4" />
                        Download / Print
                    </motion.button>
                )}
            </div>

            {/* Report Type Selector */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
                {reportTypes.map((type, i) => {
                    const Icon = type.icon;
                    const isSelected = reportType === type.id;
                    return (
                        <motion.button
                            key={type.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => { setReportType(type.id); setReportData(null); }}
                            id={`report-type-${type.id}`}
                            className={`p-5 rounded-2xl text-left transition-all duration-200 border-2
                                ${isSelected
                                    ? 'border-primary-400 bg-primary-50/70 shadow-lg shadow-primary-100'
                                    : 'border-transparent glass-card hover:border-primary-200'
                                }`}
                        >
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${type.color}
                                flex items-center justify-center mb-3`}>
                                <Icon className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="font-semibold text-gray-800 text-sm mb-1">{type.label}</h3>
                            <p className="text-xs text-gray-400 leading-relaxed">{type.description}</p>
                            {isSelected && (
                                <motion.div
                                    layoutId="selected-indicator"
                                    className="mt-3 flex items-center gap-1 text-xs text-primary-600 font-medium"
                                >
                                    <FiCheckCircle className="w-3.5 h-3.5" />
                                    Selected
                                </motion.div>
                            )}
                        </motion.button>
                    );
                })}
            </div>

            {/* Generate Button */}
            <motion.button
                onClick={generateReport}
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className={`w-full py-4 rounded-2xl font-medium text-sm transition-all duration-200 mb-8
                    flex items-center justify-center gap-2
                    ${loading
                        ? 'bg-gray-100 text-gray-400 cursor-wait'
                        : 'bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg shadow-gray-300 hover:shadow-xl'
                    }`}
                id="generate-report-btn"
            >
                {loading ? (
                    <>
                        <FiLoader className="w-4 h-4 animate-spin" />
                        Generating Report...
                    </>
                ) : (
                    <>
                        <FiBarChart2 className="w-4 h-4" />
                        Generate Report
                    </>
                )}
            </motion.button>

            {/* Report Preview */}
            <AnimatePresence>
                {reportData && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Generated Timestamp */}
                        <div className="flex items-center gap-2 mb-4 text-xs text-gray-400">
                            <FiCalendar className="w-3.5 h-3.5" />
                            Report generated on {formatDate(reportData.generatedAt)}
                        </div>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            {[
                                { label: 'Total Products', value: reportData.summary.totalProducts, color: 'from-blue-500 to-blue-600' },
                                { label: 'Active', value: reportData.summary.enabledProducts, color: 'from-green-500 to-green-600' },
                                { label: 'Total Stock', value: reportData.summary.totalStockQuantity, color: 'from-indigo-500 to-indigo-600' },
                                { label: 'Inventory Value', value: formatCurrency(reportData.summary.totalInventoryValue), color: 'from-amber-500 to-amber-600' },
                            ].map(({ label, value, color }, i) => (
                                <motion.div
                                    key={label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="glass-card p-4"
                                >
                                    <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${color} mb-2`} />
                                    <p className="text-xl font-bold text-gray-800">{value}</p>
                                    <p className="text-xs text-gray-400 mt-1">{label}</p>
                                </motion.div>
                            ))}
                        </div>

                        <div className="grid lg:grid-cols-2 gap-6 mb-6">
                            {/* Category Distribution */}
                            <div className="glass-card p-6">
                                <h3 className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wider">Category Breakdown</h3>
                                <div className="space-y-3">
                                    {reportData.categoryStats.map((cat) => (
                                        <div key={cat._id} className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600 font-medium">{cat._id}</span>
                                            <div className="flex items-center gap-3">
                                                <div className="w-28 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${(cat.count / reportData.summary.totalProducts) * 100}%` }}
                                                        transition={{ duration: 0.5, delay: 0.2 }}
                                                        className="h-full bg-gradient-to-r from-primary-400 to-primary-500 rounded-full"
                                                    />
                                                </div>
                                                <span className="text-xs text-gray-500 w-20 text-right">
                                                    {cat.count} prod · {cat.totalStock} stk
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Stock Health Distribution */}
                            <div className="glass-card p-6">
                                <h3 className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wider">Stock Health</h3>
                                <div className="space-y-3">
                                    {[
                                        { label: 'Out of Stock', value: reportData.stockDistribution.outOfStock, color: 'bg-red-500', textColor: 'text-red-600' },
                                        { label: 'Critical (1-2)', value: reportData.stockDistribution.critical, color: 'bg-orange-500', textColor: 'text-orange-600' },
                                        { label: 'Low (3-5)', value: reportData.stockDistribution.low, color: 'bg-amber-500', textColor: 'text-amber-600' },
                                        { label: 'Adequate (6-20)', value: reportData.stockDistribution.adequate, color: 'bg-green-400', textColor: 'text-green-600' },
                                        { label: 'High (20+)', value: reportData.stockDistribution.high, color: 'bg-emerald-500', textColor: 'text-emerald-600' },
                                    ].map((item) => (
                                        <div key={item.label} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                                                <span className="text-sm text-gray-600">{item.label}</span>
                                            </div>
                                            <span className={`text-sm font-semibold ${item.textColor}`}>{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Metal Type Distribution */}
                        <div className="glass-card p-6 mb-6">
                            <h3 className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wider">Metal Type Distribution</h3>
                            <div className="grid md:grid-cols-4 gap-4">
                                {reportData.metalTypeStats.map((metal) => (
                                    <div key={metal._id} className="bg-gray-50 rounded-xl p-4 text-center">
                                        <p className="text-lg font-bold text-gray-800">{metal.count}</p>
                                        <p className="text-xs text-gray-400 capitalize mt-1">{metal._id}</p>
                                        <p className="text-xs text-gray-300 mt-0.5">Avg {metal.avgWeight?.toFixed(2) || '—'}g</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Low Stock Table */}
                        {reportData.lowStockItems?.length > 0 && (
                            <div className="glass-card p-6 mb-6">
                                <h3 className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wider flex items-center gap-2">
                                    <FiAlertTriangle className="w-4 h-4 text-amber-500" />
                                    Low Stock Alerts ({reportData.lowStockItems.length})
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-100">
                                                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">Product</th>
                                                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">Category</th>
                                                <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400">Metal</th>
                                                <th className="text-center py-2 px-3 text-xs font-semibold text-gray-400">Stock</th>
                                                <th className="text-right py-2 px-3 text-xs font-semibold text-gray-400">Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reportData.lowStockItems.map((item) => (
                                                <tr key={item._id} className="border-b border-gray-50 hover:bg-amber-50/30 transition-colors">
                                                    <td className="py-2.5 px-3 font-medium text-gray-700">{item.name}</td>
                                                    <td className="py-2.5 px-3 text-gray-500">{item.category}</td>
                                                    <td className="py-2.5 px-3 text-gray-500 capitalize">{item.metalType}</td>
                                                    <td className="py-2.5 px-3 text-center">
                                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStockBadgeClass(item.stockQuantity)}`}>
                                                            {item.stockQuantity === 0 ? 'Out' : `${item.stockQuantity} left`}
                                                        </span>
                                                    </td>
                                                    <td className="py-2.5 px-3 text-right font-medium text-gray-700">
                                                        {item.priceInfo ? formatCurrency(item.priceInfo.totalPrice) : '—'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Full Product Listing */}
                        {reportData.allProducts?.length > 0 && (
                            <div className="glass-card p-6">
                                <h3 className="text-sm font-semibold text-gray-800 mb-4 uppercase tracking-wider">
                                    Complete Product Listing ({reportData.allProducts.length})
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-100">
                                                <th className="text-left py-2 px-2 text-xs font-semibold text-gray-400">#</th>
                                                <th className="text-left py-2 px-2 text-xs font-semibold text-gray-400">Product</th>
                                                <th className="text-left py-2 px-2 text-xs font-semibold text-gray-400">SKU</th>
                                                <th className="text-left py-2 px-2 text-xs font-semibold text-gray-400">Category</th>
                                                <th className="text-left py-2 px-2 text-xs font-semibold text-gray-400">Metal</th>
                                                <th className="text-right py-2 px-2 text-xs font-semibold text-gray-400">Weight</th>
                                                <th className="text-center py-2 px-2 text-xs font-semibold text-gray-400">Stock</th>
                                                <th className="text-center py-2 px-2 text-xs font-semibold text-gray-400">Status</th>
                                                <th className="text-right py-2 px-2 text-xs font-semibold text-gray-400">Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reportData.allProducts.map((product, index) => (
                                                <tr key={product._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                                    <td className="py-2 px-2 text-gray-400">{index + 1}</td>
                                                    <td className="py-2 px-2 font-medium text-gray-700">{product.name}</td>
                                                    <td className="py-2 px-2 text-gray-400 text-xs">{product.sku || '—'}</td>
                                                    <td className="py-2 px-2 text-gray-500">{product.category}</td>
                                                    <td className="py-2 px-2 text-gray-500 capitalize">{product.metalType}</td>
                                                    <td className="py-2 px-2 text-right text-gray-500">{product.weight}g</td>
                                                    <td className="py-2 px-2 text-center">
                                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStockBadgeClass(product.stockQuantity)}`}>
                                                            {product.stockQuantity}
                                                        </span>
                                                    </td>
                                                    <td className="py-2 px-2 text-center">
                                                        <span className={`text-xs ${product.isEnabled ? 'text-green-500' : 'text-red-400'}`}>
                                                            {product.isEnabled ? '● Active' : '○ Disabled'}
                                                        </span>
                                                    </td>
                                                    <td className="py-2 px-2 text-right font-medium text-gray-700">
                                                        {product.priceInfo ? formatCurrency(product.priceInfo.totalPrice) : '—'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminReports;
