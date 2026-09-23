import { useState, useMemo } from "react";
import UserAvatar from "../ui/UserAvatar";
import CustomSelect from "../ui/CustomSelect";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LabelList,
} from "recharts";

// Custom Tooltip untuk Area Chart Tren Membaca
function AreaTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-3.5 py-2 rounded-xl shadow-md border border-[#D8E6DE] text-xs">
        <p className="font-bold text-[#1A1A1A]">{label}</p>
        <p className="text-[#39BF81] font-semibold flex items-center gap-1.5 mt-0.5">
          <span className="w-2 h-2 rounded-full bg-[#39BF81] inline-block" />
          <span>{payload[0].value} sesi dibaca</span>
        </p>
      </div>
    );
  }
  return null;
}

// Custom Tooltip untuk Donut Chart Distribusi Pengguna
function DonutTooltip({ active, payload, total }) {
  if (active && payload && payload.length) {
    const data = payload[0];
    const pct = total > 0 ? Math.round((data.value / total) * 100) : 0;
    return (
      <div className="bg-white px-3.5 py-2 rounded-xl shadow-md border border-[#D8E6DE] text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: data.payload.color }} />
          <span className="font-bold text-[#1A1A1A]">{data.name}:</span>
          <span className="font-semibold text-[#39BF81]">{data.value} orang</span>
          <span className="text-[#5C6B64] font-mono">({pct}%)</span>
        </div>
      </div>
    );
  }
  return null;
}

// Custom Tooltip untuk Bar Chart Top 5 Buku
function BarTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-white px-3.5 py-2.5 rounded-xl shadow-md border border-[#D8E6DE] text-xs max-w-xs">
        <p className="font-bold text-[#1A1A1A] leading-snug">{item.fullName}</p>
        <p className="text-[#39BF81] font-semibold mt-1 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#39BF81] inline-block" />
          <span>Total: {item.total} kali dibaca siswa</span>
        </p>
      </div>
    );
  }
  return null;
}

const EMPTY_LOGS = [];

export default function AdminOverviewTab({ stats, books, usersList }) {
  const [trendPeriod, setTrendPeriod] = useState("7d"); // '7d' | '30d' | '1y'

  // Multi-periode Tren Membaca dari API
  const trendData = stats?.reading_trends?.[trendPeriod] || (
    trendPeriod === "7d" ? stats?.daily_trend || [] : []
  );

  const totalPeriodReads = trendData.reduce((acc, curr) => acc + (curr.count || 0), 0);

  // 1. Data Recharts: Area Chart Tren Aktivitas Membaca
  const areaChartData = trendData.map((d) => ({
    name: d.label || d.day || d.month || d.date,
    sesi: d.count || 0,
  }));

  // User Distribution untuk Donut Chart
  const userStats = stats?.user_distribution || {
    siswa: usersList?.filter((u) => u.role === "siswa").length || 5,
    guru: usersList?.filter((u) => u.role === "guru").length || 1,
    admin: usersList?.filter((u) => u.role === "admin").length || 2,
    total: usersList?.length || stats?.summary?.total_users || 8,
  };

  const totalUsersCount = userStats.total || ((userStats.siswa || 0) + (userStats.guru || 0) + (userStats.admin || 0));

  const pctSiswa = totalUsersCount > 0 ? Math.round(((userStats.siswa || 0) / totalUsersCount) * 100) : 0;
  const pctGuru = totalUsersCount > 0 ? Math.round(((userStats.guru || 0) / totalUsersCount) * 100) : 0;
  const pctAdmin = totalUsersCount > 0 ? Math.max(0, 100 - pctSiswa - pctGuru) : 0;

  // 2. Data Recharts: Donut Chart Komposisi Pengguna
  const donutData = [
    { name: "Siswa", value: userStats.siswa || 0, color: "#369D6D" },
    { name: "Guru", value: userStats.guru || 0, color: "#10B981" },
    { name: "Admin", value: userStats.admin || 0, color: "#F59E0B" },
  ];

  // Platform Breakdown (Website vs Ponsel)
  const totalPlatform = (stats?.platform_stats?.web || 0) + (stats?.platform_stats?.mobile || 0);
  const webPct = totalPlatform > 0 ? Math.round(((stats?.platform_stats?.web || 0) / totalPlatform) * 100) : 100;
  const mobilePct = 100 - webPct;

  // Buku Terpopuler
  const popularList = (stats?.popular_books && stats.popular_books.length > 0)
    ? stats.popular_books
    : books.slice(0, 5).map((b) => ({
        id: b.id,
        judul: b.judul,
        total_dibaca: b.total_dibaca || 10,
      }));

  // 3. Data Recharts: Horizontal Bar Chart Top 5 Buku
  const horizontalBarHeight = popularList.length <= 2 ? 220 : popularList.length === 3 ? 260 : 300;
  const barChartData = [...popularList].reverse().map((p) => ({
    name: p.judul?.length > 28 ? `${p.judul.substring(0, 26)}...` : p.judul,
    fullName: p.judul,
    total: p.total_dibaca || 0,
  }));

  // State & Logika untuk Tabel Log Aktivitas Membaca Terkini (mirip Tabel Kelola Pengguna)
  const [logSearch, setLogSearch] = useState("");
  const [logPlatformFilter, setLogPlatformFilter] = useState("all");
  const [logCurrentPage, setLogCurrentPage] = useState(1);
  const [logSortConfig, setLogSortConfig] = useState({ key: "read_at", direction: "desc" });

  const rawRecentLogs = stats?.recent_logs || EMPTY_LOGS;

  const handleLogSort = (key) => {
    setLogSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
    setLogCurrentPage(1);
  };

  const renderLogSortIcon = (key) => {
    if (logSortConfig.key !== key) {
      return (
        <svg
          className="w-3 h-3 text-slate-400 opacity-50 group-hover:opacity-100 transition-opacity"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
      );
    }
    return logSortConfig.direction === "asc" ? (
      <svg className="w-3 h-3 text-[#39BF81]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-3 h-3 text-[#39BF81]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  const filteredAndSortedLogs = useMemo(() => {
    const q = (logSearch || "").toLowerCase().trim();
    const sourceLogs = stats?.recent_logs || EMPTY_LOGS;
    const result = sourceLogs.filter((log) => {
      // Filter platform
      let matchPlatform = true;
      if (logPlatformFilter !== "all") {
        const p = String(log.platform || "").toLowerCase();
        if (logPlatformFilter === "web") {
          matchPlatform = p === "web" || p === "website";
        } else if (logPlatformFilter === "mobile") {
          matchPlatform = p === "mobile" || p === "ponsel";
        }
      }

      // Filter pencarian: nama pembaca, judul buku, kelas, role
      const matchSearch =
        !q ||
        log.user?.name?.toLowerCase().includes(q) ||
        log.book?.judul?.toLowerCase().includes(q) ||
        log.user?.kelas?.toLowerCase().includes(q) ||
        log.user?.role?.toLowerCase().includes(q);

      return matchPlatform && matchSearch;
    });

    if (logSortConfig.key) {
      result.sort((a, b) => {
        let aVal = "";
        let bVal = "";

        if (logSortConfig.key === "reader") {
          aVal = a.user?.name || "";
          bVal = b.user?.name || "";
        } else if (logSortConfig.key === "book") {
          aVal = a.book?.judul || "";
          bVal = b.book?.judul || "";
        } else if (logSortConfig.key === "platform") {
          aVal = a.platform || "";
          bVal = b.platform || "";
        } else if (logSortConfig.key === "halaman") {
          const aNum = Number(a.halaman_terakhir || 1);
          const bNum = Number(b.halaman_terakhir || 1);
          return logSortConfig.direction === "asc" ? aNum - bNum : bNum - aNum;
        } else if (logSortConfig.key === "durasi") {
          const aDur = Number(a.durasi_detik || 0);
          const bDur = Number(b.durasi_detik || 0);
          return logSortConfig.direction === "asc" ? aDur - bDur : bDur - aDur;
        } else if (logSortConfig.key === "read_at") {
          const aTime = a.read_at ? new Date(a.read_at).getTime() : 0;
          const bTime = b.read_at ? new Date(b.read_at).getTime() : 0;
          return logSortConfig.direction === "asc" ? aTime - bTime : bTime - aTime;
        }

        const comp = aVal
          .toString()
          .localeCompare(bVal.toString(), undefined, { numeric: true, sensitivity: "base" });
        return logSortConfig.direction === "asc" ? comp : -comp;
      });
    }

    return result;
  }, [stats?.recent_logs, logSearch, logPlatformFilter, logSortConfig]);

  // Pagination untuk Log Aktivitas
  const LOGS_PAGE_SIZE = 6;
  const totalLogItems = filteredAndSortedLogs.length;
  const totalLogPages = Math.max(1, Math.ceil(totalLogItems / LOGS_PAGE_SIZE));
  const validLogCurrentPage = Math.min(Math.max(1, logCurrentPage), totalLogPages);
  const logStartIndex = (validLogCurrentPage - 1) * LOGS_PAGE_SIZE;
  const paginatedLogs = filteredAndSortedLogs.slice(logStartIndex, logStartIndex + LOGS_PAGE_SIZE);
  const logDisplayStart = totalLogItems === 0 ? 0 : logStartIndex + 1;
  const logDisplayEnd = Math.min(logStartIndex + LOGS_PAGE_SIZE, totalLogItems);

  const handleLogPageChange = (page) => {
    if (page >= 1 && page <= totalLogPages) {
      setLogCurrentPage(page);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-[#D8E6DE] shadow-xs space-y-3">
          <span className="text-xs font-semibold text-[#5C6B64] block">Total Judul Buku</span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight">{stats?.summary?.total_books ?? books.length}</span>
            <span className="text-[11px] text-[#5C6B64]">buku aktif</span>
          </div>
          <p className="text-[11px] text-[#5C6B64] pt-1 border-t border-[#D8E6DE]/60">Koleksi Kurikulum Merdeka & Nonteks SIBI</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#D8E6DE] shadow-xs space-y-3">
          <span className="text-xs font-semibold text-[#5C6B64] block">Total Kali Dibaca</span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight">{stats?.summary?.total_reads?.toLocaleString("id-ID") ?? "1.764"}</span>
            <span className="text-[11px] text-[#39BF81] font-semibold">sesi bacaan</span>
          </div>
          <p className="text-[11px] text-[#5C6B64] pt-1 border-t border-[#D8E6DE]/60">Akumulasi Website & Ponsel</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#D8E6DE] shadow-xs space-y-3">
          <span className="text-xs font-semibold text-[#5C6B64] block">Pembaca Hari Ini</span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight">{stats?.summary?.reads_today ?? 0}</span>
            <span className="text-[11px] text-[#39BF81] font-semibold">siswa aktif</span>
          </div>
          <p className="text-[11px] text-[#5C6B64] pt-1 border-t border-[#D8E6DE]/60">{stats?.summary?.reads_this_week ?? 60} sesi minggu ini</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#D8E6DE] shadow-xs space-y-3">
          <span className="text-xs font-semibold text-[#5C6B64] block">Total Anggota</span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight">{totalUsersCount}</span>
            <span className="text-[11px] text-[#5C6B64]">siswa & guru</span>
          </div>
          <p className="text-[11px] text-[#5C6B64] pt-1 border-t border-[#D8E6DE]/60">Terdaftar di database perpustakaan</p>
        </div>
      </section>

      {/* 2. Interactive Charts Grid (Area Chart Multi-Periode & Donut Chart Anggota) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tren Membaca (Recharts Smooth Spline Area Chart) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#D8E6DE] p-6 sm:p-7 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#39BF81] bg-[#E7F3EC] px-2.5 py-0.5 rounded-md border border-[#D8E6DE]">
                Diagram Aktivitas
              </span>
              <h3 className="text-base font-bold text-[#1A1A1A] mt-1.5">Tren Aktivitas Membaca</h3>
              <p className="text-xs text-[#5C6B64]">Frekuensi pembaca membuka dan membaca buku</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <span className="text-xs font-mono font-bold text-[#369D6D] block">
                  {totalPeriodReads} Sesi
                </span>
                <span className="text-[10px] text-[#5C6B64]">
                  {trendPeriod === "7d" ? "7 Hari Terakhir" : trendPeriod === "30d" ? "30 Hari Terakhir" : "1 Tahun Terakhir"}
                </span>
              </div>
              <CustomSelect
                value={trendPeriod}
                onChange={setTrendPeriod}
                options={[
                  { value: "7d", label: "7 Hari Terakhir" },
                  { value: "30d", label: "30 Hari Terakhir" },
                  { value: "1y", label: "1 Tahun Terakhir" },
                ]}
                align="right"
              />
            </div>
          </div>

          <div className="pt-2 w-full flex-1 flex flex-col justify-center min-h-[280px]">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart
                accessibilityLayer={false}
                data={areaChartData}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#369D6D" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#369D6D" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#5C6B64"
                  fontSize={11}
                  fontWeight={600}
                  tickLine={false}
                  axisLine={false}
                  dy={6}
                />
                <YAxis
                  stroke="#5C6B64"
                  fontSize={11}
                  fontWeight={600}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<AreaTooltip />} />
                <Area
                  type="monotone"
                  dataKey="sesi"
                  stroke="#369D6D"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#areaGradient)"
                  dot={{ fill: "#369D6D", stroke: "#ffffff", strokeWidth: 2, r: trendPeriod === "30d" ? 2 : 4 }}
                  activeDot={{ r: 6, fill: "#369D6D", stroke: "#ffffff", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-[#5C6B64] pt-2 border-t border-[#D8E6DE]/60">
            <span className="text-[11px] font-medium text-[#5C6B64]">
              Data riil waktu nyata dari rekaman pembacaan siswa & guru.
            </span>
            <span className="text-xs font-mono font-bold text-[#39BF81]">
              Total: {totalPeriodReads} Sesi
            </span>
          </div>
        </div>

        {/* Diagram Lingkaran Distribusi Pengguna (Donut Chart) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-[#D8E6DE] p-6 sm:p-7 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#39BF81] bg-[#E7F3EC] px-2.5 py-0.5 rounded-md border border-[#D8E6DE]">
                Komposisi Anggota
              </span>
              <h3 className="text-base font-bold text-[#1A1A1A] mt-1.5">Distribusi Pengguna</h3>
              <p className="text-xs text-[#5C6B64]">Perbandingan Siswa, Guru, dan Admin</p>
            </div>
            <span className="text-xs font-mono font-bold text-[#39BF81] bg-[#E7F3EC] px-2.5 py-1 rounded-xl border border-[#D8E6DE]">
              {totalUsersCount} Akun
            </span>
          </div>

          <div className="py-1 w-full flex items-center justify-center relative min-h-[230px]">
            <ResponsiveContainer width="100%" height={230}>
              <PieChart accessibilityLayer={false}>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<DonutTooltip total={totalUsersCount} />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Donut Hole Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[11px] font-semibold text-[#5C6B64] leading-tight">Total Anggota</span>
              <span className="text-xl font-bold text-[#1A1A1A] leading-tight mt-0.5">{totalUsersCount}</span>
            </div>
          </div>

          {/* Minimalist Legend (Tanpa Card Box) */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#D8E6DE]/60 text-xs px-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#369D6D] shrink-0" />
              <span className="text-[#5C6B64]">Siswa:</span>
              <span className="font-bold text-[#1A1A1A]">{userStats.siswa || 0}</span>
              <span className="text-[10px] text-[#5C6B64] font-mono">({pctSiswa}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shrink-0" />
              <span className="text-[#5C6B64]">Guru:</span>
              <span className="font-bold text-[#1A1A1A]">{userStats.guru || 0}</span>
              <span className="text-[10px] text-[#5C6B64] font-mono">({pctGuru}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] shrink-0" />
              <span className="text-[#5C6B64]">Admin:</span>
              <span className="font-bold text-[#1A1A1A]">{userStats.admin || 0}</span>
              <span className="text-[10px] text-[#5C6B64] font-mono">({pctAdmin}%)</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Top 5 Books (Full Width / Selebar Halaman Dashboard) */}
      <section className="bg-white rounded-3xl border border-[#D8E6DE] p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#39BF81] bg-[#E7F3EC] px-2.5 py-0.5 rounded-md border border-[#D8E6DE]">
              Peringkat Buku
            </span>
            <h3 className="text-base font-bold text-[#1A1A1A] mt-1.5">Top 5 Buku Terpopuler</h3>
            <p className="text-xs text-[#5C6B64]">Volume akumulasi pembacaan siswa tertinggi</p>
          </div>
          <span className="text-[10px] font-bold text-[#39BF81] bg-[#E7F3EC] px-3 py-1 rounded-full border border-[#D8E6DE]">
            SIBI Terlaris
          </span>
        </div>

        <div className="w-full pt-1 min-h-[220px]">
          <ResponsiveContainer width="100%" height={horizontalBarHeight}>
            <BarChart
              accessibilityLayer={false}
              layout="vertical"
              data={barChartData}
              margin={{ top: 10, right: 45, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
              <XAxis
                type="number"
                stroke="#5C6B64"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}x`}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#1A1A1A"
                fontSize={12}
                fontWeight={600}
                tickLine={false}
                axisLine={false}
                width={170}
              />
              <Tooltip content={<BarTooltip />} cursor={false} />
              <Bar
                dataKey="total"
                fill="#369D6D"
                radius={[0, 6, 6, 0]}
                barSize={18}
              >
                <LabelList
                  dataKey="total"
                  position="right"
                  formatter={(v) => `${v}x`}
                  style={{ fill: "#369D6D", fontSize: "11px", fontWeight: 700 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {popularList.length < 5 && (
          <div className="pt-3 border-t border-[#D8E6DE]/60 flex flex-wrap items-center justify-between gap-2 text-xs text-[#5C6B64]">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#369D6D] inline-block shrink-0"></span>
              Menampilkan {popularList.length} buku yang aktif dibaca
            </span>
            <span className="text-[11px] text-[#5C6B64]/80 italic">
              Buku lain otomatis bertambah saat dibaca siswa
            </span>
          </div>
        )}
      </section>

      {/* 4. Platform Pengguna & Sebaran Kategori SIBI (Side by Side 2 Kolom) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Platform Pengguna (Website vs Ponsel) */}
        <div className="bg-white rounded-3xl border border-[#D8E6DE] p-5 sm:p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#1A1A1A]">Platform Pengguna</h3>
              <p className="text-xs text-[#5C6B64]">Perbandingan pembaca Website vs Ponsel</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-[#369D6D]">
                Pengguna Website ({webPct}%)
              </span>
              <span className="text-teal-600">
                Ponsel ({mobilePct}%)
              </span>
            </div>
            <div className="w-full h-3.5 rounded-full bg-slate-100 overflow-hidden flex p-0.5 border border-[#D8E6DE]">
              <div className="h-full bg-[#369D6D] rounded-l-full transition-all duration-500" style={{ width: `${webPct}%` }} />
              <div className="h-full bg-teal-500 rounded-r-full transition-all duration-500" style={{ width: `${mobilePct}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-2xl bg-[#F8FAF9] border border-[#D8E6DE] space-y-0.5">
              <span className="text-[11px] text-[#5C6B64]">Pengguna Website</span>
              <span className="text-base font-bold text-[#1A1A1A] block">{stats?.platform_stats?.web || 0} Sesi</span>
              <span className="text-[10px] text-[#5C6B64]">PC / Laptop Siswa</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#F8FAF9] border border-[#D8E6DE] space-y-0.5">
              <span className="text-[11px] text-[#5C6B64]">Ponsel</span>
              <span className="text-base font-bold text-[#1A1A1A] block">{stats?.platform_stats?.mobile || 0} Sesi</span>
              <span className="text-[10px] text-[#5C6B64]">HP Siswa / Tablet</span>
            </div>
          </div>
        </div>

        {/* Sebaran Kategori SIBI */}
        <div className="bg-white rounded-3xl border border-[#D8E6DE] p-5 sm:p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-[#1A1A1A]">Sebaran Kategori SIBI</h3>
            <p className="text-xs text-[#5C6B64]">Distribusi jumlah buku berdasarkan kategori</p>
          </div>
          <div className="space-y-2.5">
            {(stats?.category_stats || []).slice(0, 4).map((cat, idx) => (
              <div key={cat.id || idx} className="flex items-center justify-between p-2.5 rounded-2xl bg-[#F8FAF9] border border-[#D8E6DE]">
                <span className="text-xs font-semibold text-[#1A1A1A] truncate max-w-50">{cat.nama}</span>
                <span className="text-xs font-mono font-bold text-[#39BF81] px-2 py-0.5 rounded-lg bg-white border border-[#D8E6DE]">
                  {cat.books_count} buku
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Log Realtime (Data Table Mirip Kelola Pengguna) */}
      <section className="bg-white rounded-3xl border border-[#D8E6DE] p-6 shadow-xs space-y-5">
        {/* Header Top: Title, Live Tracking Dot Merah & Toolbar Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-base font-bold text-[#1A1A1A]">Log Aktivitas Membaca Terkini</h3>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 border border-rose-200 text-rose-600">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                Live Tracking
              </span>
            </div>
            <p className="text-xs text-[#5C6B64]">
              Rekaman waktu nyata saat siswa dan guru membuka buku
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Filter Platform Custom Modern */}
            <CustomSelect
              value={logPlatformFilter}
              onChange={(val) => {
                setLogPlatformFilter(val);
                setLogCurrentPage(1);
              }}
              options={[
                { value: "all", label: `Semua Platform (${rawRecentLogs.length})` },
                { value: "web", label: "Website" },
                { value: "mobile", label: "Ponsel" },
              ]}
              className="w-full sm:w-auto"
            />

            {/* Kotak Pencarian */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Cari pembaca / buku / kelas..."
                value={logSearch}
                onChange={(e) => {
                  setLogSearch(e.target.value);
                  setLogCurrentPage(1);
                }}
                className="w-full pl-8 pr-3 py-2 bg-[#F8FAF9] border border-[#D8E6DE] rounded-xl text-xs text-[#1A1A1A] focus:outline-none focus:border-[#39BF81] transition-all"
              />
              <svg
                className="w-3.5 h-3.5 text-[#5C6B64] absolute left-2.5 top-2.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Tabel Data */}
        <div className="overflow-x-auto rounded-2xl border border-[#D8E6DE]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAF9] border-b border-[#D8E6DE] text-[#5C6B64] uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th
                  onClick={() => handleLogSort("reader")}
                  className="py-3 px-4 cursor-pointer select-none group hover:bg-[#E7F3EC]/60 transition-colors"
                  title="Klik untuk mengurutkan Pembaca"
                >
                  <div className="flex items-center gap-1.5">
                    <span className={logSortConfig.key === "reader" ? "text-[#369D6D] font-bold" : ""}>
                      Nama Pembaca
                    </span>
                    {renderLogSortIcon("reader")}
                  </div>
                </th>

                <th
                  onClick={() => handleLogSort("book")}
                  className="py-3 px-4 cursor-pointer select-none group hover:bg-[#E7F3EC]/60 transition-colors"
                  title="Klik untuk mengurutkan Judul Buku"
                >
                  <div className="flex items-center gap-1.5">
                    <span className={logSortConfig.key === "book" ? "text-[#369D6D] font-bold" : ""}>
                      Buku yang Dibaca
                    </span>
                    {renderLogSortIcon("book")}
                  </div>
                </th>

                <th
                  onClick={() => handleLogSort("platform")}
                  className="py-3 px-4 text-center cursor-pointer select-none group hover:bg-[#E7F3EC]/60 transition-colors"
                  title="Klik untuk mengurutkan Platform"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span className={logSortConfig.key === "platform" ? "text-[#369D6D] font-bold" : ""}>
                      Platform
                    </span>
                    {renderLogSortIcon("platform")}
                  </div>
                </th>

                <th
                  onClick={() => handleLogSort("halaman")}
                  className="py-3 px-4 text-center cursor-pointer select-none group hover:bg-[#E7F3EC]/60 transition-colors"
                  title="Klik untuk mengurutkan Halaman"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span className={logSortConfig.key === "halaman" ? "text-[#369D6D] font-bold" : ""}>
                      Halaman
                    </span>
                    {renderLogSortIcon("halaman")}
                  </div>
                </th>

                <th
                  onClick={() => handleLogSort("durasi")}
                  className="py-3 px-4 text-center cursor-pointer select-none group hover:bg-[#E7F3EC]/60 transition-colors"
                  title="Klik untuk mengurutkan Durasi"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span className={logSortConfig.key === "durasi" ? "text-[#369D6D] font-bold" : ""}>
                      Durasi
                    </span>
                    {renderLogSortIcon("durasi")}
                  </div>
                </th>

                <th
                  onClick={() => handleLogSort("read_at")}
                  className="py-3 px-4 text-right cursor-pointer select-none group hover:bg-[#E7F3EC]/60 transition-colors"
                  title="Klik untuk mengurutkan Waktu"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span className={logSortConfig.key === "read_at" ? "text-[#369D6D] font-bold" : ""}>
                      Waktu
                    </span>
                    {renderLogSortIcon("read_at")}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8E6DE]/60">
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-xs text-[#5C6B64]">
                    Tidak ada log aktivitas membaca yang cocok dengan filter atau pencarian.
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log, idx) => {
                  const isMobile = log.platform === "mobile" || log.platform === "ponsel";
                  return (
                    <tr key={log.id || idx} className="hover:bg-[#F8FAF9]/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <UserAvatar
                            src={log.user?.avatar}
                            name={log.user?.name || "Siswa"}
                            role={log.user?.role || "siswa"}
                            size="sm"
                          />
                          <div className="min-w-0">
                            <span className="font-bold text-[#1A1A1A] block truncate max-w-44 sm:max-w-xs">
                              {log.user?.name || "Anonim"}
                            </span>
                            <span className="text-[10px] text-[#5C6B64] font-medium">
                              {log.user?.role === "siswa"
                                ? log.user?.kelas
                                  ? log.user.kelas.startsWith("Kelas")
                                    ? log.user.kelas
                                    : `Kelas ${log.user.kelas}`
                                  : "-"
                                : log.user?.role || "Pembaca"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-[#1A1A1A] block line-clamp-1 max-w-56 sm:max-w-md" title={log.book?.judul}>
                          {log.book?.judul || "Buku"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isMobile
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          }`}
                        >
                          {isMobile ? "Ponsel" : "Website"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-[#5C6B64] font-medium">
                        Hal. {log.halaman_terakhir || 1}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-[#369D6D]">
                        {Math.floor((log.durasi_detik || 0) / 60)}m {(log.durasi_detik || 0) % 60}s
                      </td>
                      <td className="py-3 px-4 text-right text-[#5C6B64] font-mono text-[11px]">
                        {log.read_at
                          ? new Date(log.read_at).toLocaleTimeString("id-ID", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Bersih: Info & Tombol Pagination < 1 dari X > Berada di Tengah */}
        <div className="flex flex-col items-center justify-center gap-2 pt-2 text-xs text-[#5C6B64]">
          {totalLogPages > 1 && (
            <div className="flex items-center gap-1.5 bg-[#F8FAF9] border border-[#D8E6DE] rounded-xl px-2.5 py-1 shadow-2xs">
              {/* Tombol < (Sebelumnya) */}
              <button
                type="button"
                disabled={validLogCurrentPage === 1}
                onClick={() => handleLogPageChange(validLogCurrentPage - 1)}
                className="w-7 h-7 rounded-lg bg-white border border-[#D8E6DE] text-[#5C6B64] hover:text-[#39BF81] hover:border-[#39BF81] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center shadow-2xs"
                title="Halaman Sebelumnya"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Label: 1 dari X */}
              <span className="text-xs text-[#5C6B64] font-medium px-2.5 select-none">
                <strong className="text-[#1A1A1A] font-bold">{validLogCurrentPage}</strong> dari{" "}
                <strong className="text-[#1A1A1A] font-bold">{totalLogPages}</strong>
              </span>

              {/* Tombol > (Selanjutnya) */}
              <button
                type="button"
                disabled={validLogCurrentPage === totalLogPages}
                onClick={() => handleLogPageChange(validLogCurrentPage + 1)}
                className="w-7 h-7 rounded-lg bg-white border border-[#D8E6DE] text-[#5C6B64] hover:text-[#39BF81] hover:border-[#39BF81] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center shadow-2xs"
                title="Halaman Selanjutnya"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

          {/* Info data aktivitas */}
          <p className="text-center">
            Menampilkan <span className="font-semibold text-[#1A1A1A]">{logDisplayStart} - {logDisplayEnd}</span> dari{" "}
            <span className="font-semibold text-[#1A1A1A]">{totalLogItems}</span> aktivitas membaca
          </p>
        </div>
      </section>
    </div>
  );
}
