import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  BedDouble,
  Utensils,
  Receipt,
  CreditCard,
  CalendarDays,
  Download,
  ArrowUpRight,
} from "lucide-react";

import { getDashboardReport } from "../../services/reports";

const periodLabels = {
  today: "Today",
  week: "This Week",
  month: "This Month",
  year: "This Year",
};

function Reports() {
  const [dateRange, setDateRange] = useState("month");
  const [reportType, setReportType] = useState("All Reports");

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadReport();
  }, [dateRange]);

  async function loadReport() {
    try {
      setLoading(true);
      setError("");

      const data = await getDashboardReport(dateRange);

      setReport(data);
    } catch (err) {
      setError(
        err.message || "Failed to load reports"
      );
    } finally {
      setLoading(false);
    }
  }

  const formatAmount = (amount) => {
    return `KSh ${Number(amount || 0).toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return "—";
    }

    return new Date(
      `${dateString}T00:00:00`
    ).toLocaleDateString("en-KE", {
      day: "2-digit",
      month: "short",
    });
  };

  const getOccupancyStyle = (occupancy) => {
    if (occupancy >= 75) {
      return "bg-green-500";
    }

    if (occupancy >= 60) {
      return "bg-yellow-500";
    }

    return "bg-red-500";
  };

  const maxRevenue = useMemo(() => {
    if (!report?.daily_revenue?.length) {
      return 0;
    }

    return Math.max(
      ...report.daily_revenue.map(
        (item) => Number(item.revenue) || 0
      )
    );
  }, [report]);

  const revenueBreakdownTotal =
    Number(report?.financial?.room_revenue || 0) +
    Number(report?.financial?.restaurant_revenue || 0) +
    Number(report?.financial?.other_revenue || 0);

  function exportReport() {
    if (!report) {
      return;
    }

    const rows = [];

    rows.push([
      "Hostivo Report",
      periodLabels[dateRange],
    ]);

    rows.push([]);

    rows.push([
      "Financial Metric",
      "Amount",
    ]);

    rows.push([
      "Total Revenue",
      report.financial.total_revenue,
    ]);

    rows.push([
      "Room Revenue",
      report.financial.room_revenue,
    ]);

    rows.push([
      "Restaurant Revenue",
      report.financial.restaurant_revenue,
    ]);

    rows.push([
      "Other Revenue",
      report.financial.other_revenue,
    ]);

    rows.push([
      "Total Expenses",
      report.financial.total_expenses,
    ]);

    rows.push([
      "Net Income",
      report.financial.net_income,
    ]);

    rows.push([]);

    rows.push([
      "Room Performance",
    ]);

    rows.push([
      "Room",
      "Type",
      "Bookings",
      "Nights",
      "Revenue",
      "Occupancy",
    ]);

    report.rooms.performance.forEach((room) => {
      rows.push([
        room.room,
        room.type,
        room.bookings,
        room.nights,
        room.revenue,
        `${room.occupancy}%`,
      ]);
    });

    rows.push([]);

    rows.push([
      "Top-Selling Menu Items",
    ]);

    rows.push([
      "Menu Item",
      "Category",
      "Orders",
      "Revenue",
    ]);

    report.menu.top_items.forEach((item) => {
      rows.push([
        item.name,
        item.category,
        item.orders,
        item.revenue,
      ]);
    });

    const csv = rows
      .map((row) =>
        row
          .map((value) => {
            const text = String(
              value ?? ""
            ).replace(/"/g, '""');

            return `"${text}"`;
          })
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      [csv],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = `hostivo-report-${dateRange}.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mb-8">
          <h1
            className="text-2xl font-bold"
            style={{ color: "#102A43" }}
          >
            Reports
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Analyze your hotel's financial and operational performance.
          </p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#102A43]" />

          <p className="text-sm text-gray-500">
            Loading reports...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mb-8">
          <h1
            className="text-2xl font-bold"
            style={{ color: "#102A43" }}
          >
            Reports
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Analyze your hotel's financial and operational performance.
          </p>
        </div>

        <div className="rounded-xl border border-red-100 bg-red-50 p-6">
          <p className="font-semibold text-red-700">
            Failed to load reports
          </p>

          <p className="mt-1 text-sm text-red-600">
            {error}
          </p>

          <button
            onClick={loadReport}
            className="mt-4 rounded-lg bg-[#102A43] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!report) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: "#102A43" }}
          >
            Reports
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Analyze your hotel's financial and operational performance.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          {/* Date Range */}
          <div className="relative">
            <CalendarDays
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <select
              value={dateRange}
              onChange={(e) =>
                setDateRange(e.target.value)
              }
              className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-8 text-sm text-gray-600 outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C] sm:w-auto"
            >
              <option value="today">
                Today
              </option>

              <option value="week">
                This Week
              </option>

              <option value="month">
                This Month
              </option>

              <option value="year">
                This Year
              </option>
            </select>
          </div>

          {/* Report Type */}
          <select
            value={reportType}
            onChange={(e) =>
              setReportType(e.target.value)
            }
            className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-600 outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
          >
            <option>All Reports</option>
            <option>Financial Reports</option>
            <option>Room Reports</option>
            <option>Restaurant Reports</option>
          </select>

          {/* Export */}
          <button
            onClick={exportReport}
            className="flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            style={{
              backgroundColor: "#102A43",
            }}
          >
            <Download size={17} />
            Export
          </button>
        </div>
      </div>

      {/* Financial Statistics */}
      {(reportType === "All Reports" ||
        reportType === "Financial Reports") && (
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* Revenue */}
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Total Revenue
                </p>

                <h2
                  className="mt-2 text-2xl font-bold"
                  style={{ color: "#102A43" }}
                >
                  {formatAmount(
                    report.financial.total_revenue
                  )}
                </h2>

                <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                  <ArrowUpRight size={14} />
                  Completed payments
                </div>
              </div>

              <div className="rounded-lg bg-green-50 p-3 text-green-600">
                <TrendingUp size={22} />
              </div>
            </div>
          </div>

          {/* Expenses */}
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Total Expenses
                </p>

                <h2
                  className="mt-2 text-2xl font-bold"
                  style={{ color: "#102A43" }}
                >
                  {formatAmount(
                    report.financial.total_expenses
                  )}
                </h2>

                <p className="mt-2 text-xs text-gray-500">
                  Paid expenses
                </p>
              </div>

              <div className="rounded-lg bg-red-50 p-3 text-red-600">
                <Receipt size={22} />
              </div>
            </div>
          </div>

          {/* Net Income */}
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Net Income
                </p>

                <h2
                  className="mt-2 text-2xl font-bold"
                  style={{ color: "#102A43" }}
                >
                  {formatAmount(
                    report.financial.net_income
                  )}
                </h2>

                <p className="mt-2 text-xs text-gray-500">
                  Revenue minus paid expenses
                </p>
              </div>

              <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                <BarChart3 size={22} />
              </div>
            </div>
          </div>

          {/* Payments */}
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Payments Collected
                </p>

                <h2
                  className="mt-2 text-2xl font-bold"
                  style={{ color: "#102A43" }}
                >
                  {formatAmount(
                    report.financial.total_revenue
                  )}
                </h2>

                <p className="mt-2 text-xs text-gray-500">
                  Completed payments
                </p>
              </div>

              <div className="rounded-lg bg-green-50 p-3 text-green-600">
                <CreditCard size={22} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Overview + Breakdown */}
      {(reportType === "All Reports" ||
        reportType === "Financial Reports") && (
        <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* Revenue Chart */}
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm xl:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2
                  className="text-lg font-semibold"
                  style={{ color: "#102A43" }}
                >
                  Revenue Overview
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Daily completed payment revenue
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-2 text-gray-500">
                <BarChart3 size={20} />
              </div>
            </div>

            {report.daily_revenue.length === 0 ? (
              <div className="flex h-72 items-center justify-center text-sm text-gray-400">
                No revenue data for this period.
              </div>
            ) : (
              <div className="flex h-72 items-end gap-2 overflow-x-auto sm:gap-4">
                {report.daily_revenue.map(
                  (item) => {
                    const revenue =
                      Number(item.revenue) || 0;

                    const height =
                      maxRevenue > 0
                        ? (revenue / maxRevenue) * 100
                        : 0;

                    return (
                      <div
                        key={item.date}
                        className="flex h-full min-w-12 flex-1 flex-col items-center justify-end"
                      >
                        <div className="mb-2 text-center">
                          <span className="text-xs font-medium text-gray-500">
                            {revenue > 0
                              ? formatAmount(
                                  revenue
                                ).replace(
                                  "KSh ",
                                  ""
                                )
                              : "0"}
                          </span>
                        </div>

                        <div className="flex h-52 w-full items-end justify-center">
                          <div
                            className="w-full max-w-10 rounded-t-md transition-all duration-300 hover:opacity-80"
                            style={{
                              height: `${Math.max(
                                height,
                                revenue > 0
                                  ? 3
                                  : 0
                              )}%`,
                              backgroundColor:
                                "#C89B3C",
                            }}
                          />
                        </div>

                        <span className="mt-3 text-xs font-medium text-gray-500">
                          {dateRange === "today"
                            ? formatDate(
                                item.date
                              )
                            : item.day}
                        </span>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </div>

          {/* Revenue Breakdown */}
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2
              className="text-lg font-semibold"
              style={{ color: "#102A43" }}
            >
              Revenue Breakdown
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Completed payments by business area
            </p>

            <div className="mt-8 space-y-6">
              {/* Rooms */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-md bg-blue-50 p-2 text-blue-600">
                      <BedDouble size={17} />
                    </div>

                    <span className="text-sm font-medium text-gray-700">
                      Rooms
                    </span>
                  </div>

                  <span className="text-sm font-semibold text-gray-800">
                    {formatAmount(
                      report.financial.room_revenue
                    )}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${
                        revenueBreakdownTotal > 0
                          ? (
                              (report.financial
                                .room_revenue /
                                revenueBreakdownTotal) *
                              100
                            ).toFixed(0)
                          : 0
                      }%`,
                      backgroundColor:
                        "#102A43",
                    }}
                  />
                </div>
              </div>

              {/* Restaurant */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-md bg-yellow-50 p-2 text-yellow-600">
                      <Utensils size={17} />
                    </div>

                    <span className="text-sm font-medium text-gray-700">
                      Restaurant
                    </span>
                  </div>

                  <span className="text-sm font-semibold text-gray-800">
                    {formatAmount(
                      report.financial
                        .restaurant_revenue
                    )}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${
                        revenueBreakdownTotal > 0
                          ? (
                              (report.financial
                                .restaurant_revenue /
                                revenueBreakdownTotal) *
                              100
                            ).toFixed(0)
                          : 0
                      }%`,
                      backgroundColor:
                        "#C89B3C",
                    }}
                  />
                </div>
              </div>

              {/* Other */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-md bg-gray-100 p-2 text-gray-600">
                      <CreditCard size={17} />
                    </div>

                    <span className="text-sm font-medium text-gray-700">
                      Other
                    </span>
                  </div>

                  <span className="text-sm font-semibold text-gray-800">
                    {formatAmount(
                      report.financial
                        .other_revenue
                    )}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-gray-500"
                    style={{
                      width: `${
                        revenueBreakdownTotal > 0
                          ? (
                              (report.financial
                                .other_revenue /
                                revenueBreakdownTotal) *
                              100
                            ).toFixed(0)
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Room Performance */}
      {(reportType === "All Reports" ||
        reportType === "Room Reports") && (
        <div className="mb-8 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-gray-100 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2
                className="text-lg font-semibold"
                style={{ color: "#102A43" }}
              >
                Room Performance
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Performance of individual rooms
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-2 text-gray-500">
              <BedDouble size={20} />
            </div>
          </div>

          {report.rooms.performance.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-400">
              No room performance data for this period.
            </div>
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Room
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Type
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Bookings
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Nights
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Revenue
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Occupancy
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {report.rooms.performance.map(
                      (room) => (
                        <tr
                          key={room.room}
                          className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                        >
                          <td className="px-6 py-4">
                            <span
                              className="font-semibold"
                              style={{
                                color: "#102A43",
                              }}
                            >
                              Room {room.room}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-sm text-gray-600">
                            {room.type}
                          </td>

                          <td className="px-6 py-4 text-sm text-gray-600">
                            {room.bookings}
                          </td>

                          <td className="px-6 py-4 text-sm text-gray-600">
                            {room.nights}
                          </td>

                          <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                            {formatAmount(
                              room.revenue
                            )}
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-100">
                                <div
                                  className={`h-full rounded-full ${getOccupancyStyle(
                                    room.occupancy
                                  )}`}
                                  style={{
                                    width: `${Math.min(
                                      room.occupancy,
                                      100
                                    )}%`,
                                  }}
                                />
                              </div>

                              <span className="text-sm font-medium text-gray-600">
                                {room.occupancy}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile */}
              <div className="divide-y divide-gray-100 md:hidden">
                {report.rooms.performance.map(
                  (room) => (
                    <div
                      key={room.room}
                      className="p-5"
                    >
                      <div className="mb-4 flex items-start justify-between">
                        <div>
                          <p
                            className="font-semibold"
                            style={{
                              color: "#102A43",
                            }}
                          >
                            Room {room.room}
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            {room.type}
                          </p>
                        </div>

                        <span className="text-sm font-semibold text-gray-800">
                          {formatAmount(
                            room.revenue
                          )}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-400">
                            Bookings
                          </p>

                          <p className="mt-1 text-sm font-medium text-gray-700">
                            {room.bookings}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400">
                            Nights
                          </p>

                          <p className="mt-1 text-sm font-medium text-gray-700">
                            {room.nights}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            Occupancy
                          </span>

                          <span className="text-xs font-semibold text-gray-600">
                            {room.occupancy}%
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className={`h-full rounded-full ${getOccupancyStyle(
                              room.occupancy
                            )}`}
                            style={{
                              width: `${Math.min(
                                room.occupancy,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Top Selling Menu Items */}
      {(reportType === "All Reports" ||
        reportType === "Restaurant Reports") && (
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-gray-100 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2
                className="text-lg font-semibold"
                style={{ color: "#102A43" }}
              >
                Top-Selling Menu Items
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Best-performing restaurant items
              </p>
            </div>

            <div className="rounded-lg bg-yellow-50 p-2 text-yellow-600">
              <Utensils size={20} />
            </div>
          </div>

          {report.menu.top_items.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-400">
              No completed menu sales for this period.
            </div>
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Menu Item
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Category
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Quantity Sold
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Revenue
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {report.menu.top_items.map(
                      (item, index) => (
                        <tr
                          key={`${item.name}-${index}`}
                          className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                                style={{
                                  backgroundColor:
                                    "#102A43",
                                }}
                              >
                                {index + 1}
                              </div>

                              <span className="text-sm font-medium text-gray-800">
                                {item.name}
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-sm text-gray-600">
                            {item.category}
                          </td>

                          <td className="px-6 py-4 text-sm font-medium text-gray-700">
                            {item.orders}
                          </td>

                          <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                            {formatAmount(
                              item.revenue
                            )}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile */}
              <div className="divide-y divide-gray-100 md:hidden">
                {report.menu.top_items.map(
                  (item, index) => (
                    <div
                      key={`${item.name}-${index}`}
                      className="flex items-center gap-4 p-5"
                    >
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                        style={{
                          backgroundColor:
                            "#102A43",
                        }}
                      >
                        {index + 1}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-gray-800">
                          {item.name}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {item.category} •{" "}
                          {item.orders} sold
                        </p>
                      </div>

                      <span className="text-sm font-semibold text-gray-800">
                        {formatAmount(
                          item.revenue
                        )}
                      </span>
                    </div>
                  )
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Reports;