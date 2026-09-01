import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  Activity,
  AlertTriangle,
  Bell,
  Building2,
  Camera,
  CarFront,
  Check,
  ChevronDown,
  ChevronRight,
  CircleDot,
  CloudSun,
  Code2,
  Command,
  Cpu,
  Droplets,
  Eye,
  EyeOff,
  Fan,
  Gauge,
  HardDrive,
  Info,
  LayoutDashboard,
  Lightbulb,
  ListTree,
  LockKeyhole,
  LogOut,
  Maximize2,
  Menu,
  MessageSquareText,
  MonitorPlay,
  Moon,
  MoreHorizontal,
  Network,
  PanelLeftClose,
  PanelLeftOpen,
  Play,
  Plus,
  Radio,
  RefreshCw,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Siren,
  SlidersHorizontal,
  Sun,
  Thermometer,
  TrafficCone,
  Truck,
  Unlock,
  UploadCloud,
  UserCog,
  Users,
  Video,
  Waves,
  Wind,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type Role = 'superadmin' | 'admin' | 'user'
type Theme = 'light' | 'dark'
type VmsTone = 'amber' | 'red' | 'green' | 'white'
type VmsMotion = 'static' | 'pulse' | 'marquee'
type NavId =
  | 'overview'
  | 'vms'
  | 'cameras'
  | 'vehicles'
  | 'environment'
  | 'power'
  | 'alerts'
  | 'devices'
  | 'users'
  | 'organizations'
  | 'permissions'
  | 'menus'

type DemoUser = {
  name: string
  email: string
  password: string
  role: Role
  roleLabel: string
  org: string
  initials: string
}

type NavItem = {
  id: NavId
  label: string
  icon: LucideIcon
  roles: Role[]
}

type DetailState = {
  title: string
  subtitle?: string
  content: ReactNode
} | null

type VmsTemplate = {
  id: string
  name: string
  category: string
  headline: string
  detail: string
  badge?: string
  tone: VmsTone
  icon: LucideIcon
}

const DEMO_USERS: DemoUser[] = [
  {
    name: 'ศิริพร ผู้ดูแลระบบกลาง',
    email: 'superadmin@tunnel.go.th',
    password: 'Demo@123',
    role: 'superadmin',
    roleLabel: 'Super Admin',
    org: 'สป. สำนักอำนวยความปลอดภัย',
    initials: 'สส',
  },
  {
    name: 'ธนา ผู้ดูแลศูนย์',
    email: 'admin@tunnel.go.th',
    password: 'Demo@123',
    role: 'admin',
    roleLabel: 'Admin',
    org: 'ศูนย์ควบคุมอุโมงค์ เขต 1',
    initials: 'ธผ',
  },
  {
    name: 'กิตติ เจ้าหน้าที่เฝ้าระวัง',
    email: 'user@tunnel.go.th',
    password: 'Demo@123',
    role: 'user',
    roleLabel: 'Operator',
    org: 'อุโมงค์คลองไผ่',
    initials: 'กจ',
  },
]

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: 'ศูนย์ปฏิบัติการ',
    items: [
      { id: 'overview', label: 'ภาพรวมอุโมงค์', icon: LayoutDashboard, roles: ['superadmin', 'admin', 'user'] },
      { id: 'alerts', label: 'เหตุการณ์และแจ้งเตือน', icon: Siren, roles: ['superadmin', 'admin', 'user'] },
    ],
  },
  {
    label: 'ระบบภาคสนาม',
    items: [
      { id: 'vms', label: 'ป้าย VMS และสื่อ', icon: MonitorPlay, roles: ['superadmin', 'admin', 'user'] },
      { id: 'cameras', label: 'กล้องและ AI Incident', icon: Camera, roles: ['superadmin', 'admin', 'user'] },
      { id: 'vehicles', label: 'จำแนกประเภทรถ', icon: CarFront, roles: ['superadmin', 'admin', 'user'] },
      { id: 'environment', label: 'สภาพแวดล้อมและน้ำ', icon: Wind, roles: ['superadmin', 'admin', 'user'] },
      { id: 'power', label: 'ไฟฟ้าและระบบสำรอง', icon: Zap, roles: ['superadmin', 'admin', 'user'] },
    ],
  },
  {
    label: 'งานบริหารระบบ',
    items: [
      { id: 'devices', label: 'Device Management', icon: Cpu, roles: ['superadmin', 'admin'] },
      { id: 'users', label: 'ผู้ใช้งาน', icon: Users, roles: ['superadmin', 'admin'] },
      { id: 'organizations', label: 'โครงสร้างหน่วยงาน', icon: Building2, roles: ['superadmin'] },
      { id: 'permissions', label: 'สิทธิ์การใช้งาน', icon: ShieldCheck, roles: ['superadmin'] },
      { id: 'menus', label: 'เมนูระบบ', icon: ListTree, roles: ['superadmin'] },
    ],
  },
]

const sensorTrend = [
  { time: '10:00', co2: 510, humidity: 68, water: 22, pm25: 19 },
  { time: '11:00', co2: 535, humidity: 69, water: 24, pm25: 21 },
  { time: '12:00', co2: 572, humidity: 71, water: 28, pm25: 26 },
  { time: '13:00', co2: 618, humidity: 73, water: 31, pm25: 31 },
  { time: '14:00', co2: 588, humidity: 72, water: 29, pm25: 28 },
  { time: '15:00', co2: 560, humidity: 70, water: 25, pm25: 23 },
]

const trafficData = [
  { time: '08', inbound: 382, outbound: 310 },
  { time: '09', inbound: 458, outbound: 346 },
  { time: '10', inbound: 421, outbound: 388 },
  { time: '11', inbound: 396, outbound: 402 },
  { time: '12', inbound: 512, outbound: 448 },
  { time: '13', inbound: 548, outbound: 477 },
  { time: '14', inbound: 601, outbound: 520 },
]

const vehicleTypes = [
  { name: 'รถยนต์', value: 5842, color: '#2367f2' },
  { name: 'รถกระบะ', value: 2480, color: '#4d8bff' },
  { name: 'รถบรรทุก', value: 962, color: '#ff7900' },
  { name: 'รถจักรยานยนต์', value: 740, color: '#173f78' },
  { name: 'รถโดยสาร', value: 382, color: '#8cb6ff' },
]

const alerts = [
  { id: 'INC-02841', level: 'critical', title: 'ตรวจพบรถหยุดนิ่งผิดปกติ', location: 'กล้อง CAM-07 · กม. 2+450', time: '14:32:08', status: 'กำลังตรวจสอบ' },
  { id: 'ENV-01872', level: 'warning', title: 'ระดับน้ำเพิ่มขึ้นต่อเนื่อง', location: 'Water Sensor WS-03 · จุดต่ำสุด', time: '14:27:41', status: 'เฝ้าระวัง' },
  { id: 'DEV-00928', level: 'info', title: 'VMS-04 กลับมาออนไลน์', location: 'ทางออกทิศเหนือ', time: '14:18:10', status: 'เรียบร้อย' },
  { id: 'PWR-00439', level: 'warning', title: 'UPS-A เหลือกำลังสำรอง 68%', location: 'ห้องควบคุมไฟฟ้า A', time: '13:55:02', status: 'รับทราบแล้ว' },
]

const devices = [
  { id: 'VMS-01', name: 'ป้าย VMS ทางเข้าเหนือ', type: 'VMS', protocol: 'MQTT', ip: '10.20.1.41', health: 98, status: 'online', firmware: 'v2.4.1' },
  { id: 'CAM-07', name: 'กล้อง AI กม. 2+450', type: 'Camera AI', protocol: 'RTSP', ip: '10.20.2.27', health: 92, status: 'online', firmware: 'v4.8.0' },
  { id: 'WS-03', name: 'วัดระดับน้ำจุดต่ำสุด', type: 'Water Sensor', protocol: 'Modbus', ip: '10.20.3.13', health: 86, status: 'warning', firmware: 'v1.9.3' },
  { id: 'ENV-05', name: 'วัดก๊าซและคุณภาพอากาศ', type: 'Environment', protocol: 'MQTT', ip: '10.20.3.25', health: 96, status: 'online', firmware: 'v3.1.0' },
  { id: 'ESP-GW-09', name: 'Gateway ระบายน้ำโซน B', type: 'ESP32 Gateway', protocol: 'MQTT', ip: '10.20.4.19', health: 74, status: 'maintenance', firmware: 'v0.8.7' },
]

const TUNNEL_IMAGES = [
  '/images/tunnel-interior.webp',
  '/images/tunnel-entrance.webp',
]

const VMS_TEMPLATES: VmsTemplate[] = [
  { id: 'incident', name: 'เหตุฉุกเฉิน', category: 'Emergency', headline: 'โปรดลดความเร็ว', detail: 'ข้างหน้ามีเหตุฉุกเฉิน', badge: '60', tone: 'amber', icon: AlertTriangle },
  { id: 'speed', name: 'จำกัดความเร็ว', category: 'Speed control', headline: 'จำกัดความเร็ว', detail: 'เพื่อความปลอดภัยในอุโมงค์', badge: '60', tone: 'white', icon: Gauge },
  { id: 'lane', name: 'ปิดช่องทาง', category: 'Lane control', headline: 'ช่องทางซ้ายปิด', detail: 'โปรดเบี่ยงเข้าช่องทางขวา', badge: '×', tone: 'red', icon: TrafficCone },
  { id: 'flood', name: 'ระดับน้ำสูง', category: 'Flood warning', headline: 'ระวังน้ำท่วมผิวจราจร', detail: 'ลดความเร็วและเว้นระยะห่าง', badge: '30', tone: 'amber', icon: Waves },
  { id: 'air', name: 'ระบายอากาศ', category: 'Air quality', headline: 'ระบบระบายอากาศทำงาน', detail: 'โปรดปิดกระจกขณะผ่านอุโมงค์', tone: 'green', icon: Wind },
  { id: 'traffic', name: 'การจราจรหนาแน่น', category: 'Traffic', headline: 'การจราจรชะลอตัว', detail: 'รักษาระยะห่างจากรถคันหน้า', badge: '40', tone: 'amber', icon: CarFront },
  { id: 'maintenance', name: 'งานซ่อมบำรุง', category: 'Maintenance', headline: 'มีงานซ่อมบำรุง', detail: 'โปรดปฏิบัติตามสัญญาณเจ้าหน้าที่', tone: 'amber', icon: Settings2 },
  { id: 'general', name: 'ข้อความทั่วไป', category: 'Information', headline: 'ขับขี่ปลอดภัย', detail: 'เปิดไฟหน้าและคาดเข็มขัดนิรภัย', tone: 'green', icon: Info },
]

function getCameraImage(id: string) {
  const cameraNumber = Number(id.replace(/\D/g, '')) || 1
  return TUNNEL_IMAGES[(cameraNumber - 1) % TUNNEL_IMAGES.length]
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat('th-TH', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date)
}

function StatusBadge({ level, children }: { level: 'ok' | 'warning' | 'critical' | 'info' | 'neutral'; children: ReactNode }) {
  return <span className={`status-badge status-${level}`}><span className="status-mark" aria-hidden="true" />{children}</span>
}

function IconButton({ label, children, onClick, active = false, className = '' }: { label: string; children: ReactNode; onClick?: () => void; active?: boolean; className?: string }) {
  return <button className={`icon-button ${active ? 'active' : ''} ${className}`} aria-label={label} title={label} onClick={onClick}>{children}</button>
}

function Panel({ title, subtitle, action, children, className = '', onOpen }: { title: string; subtitle?: string; action?: ReactNode; children: ReactNode; className?: string; onOpen?: () => void }) {
  return (
    <section
      className={`panel ${onOpen ? 'panel-openable' : ''} ${className}`}
      onDoubleClick={onOpen}
      tabIndex={onOpen ? 0 : undefined}
      onKeyDown={(event) => { if (onOpen && (event.key === 'Enter' || event.key === ' ')) onOpen() }}
    >
      <div className="panel-header">
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        <div className="panel-actions">
          {action}
          {onOpen && <Maximize2 size={16} aria-label="เปิดมุมมองขนาดใหญ่" />}
        </div>
      </div>
      {children}
    </section>
  )
}

function MetricCard({ icon: Icon, label, value, unit, trend, state = 'normal' }: { icon: LucideIcon; label: string; value: string; unit: string; trend: string; state?: 'normal' | 'warning' | 'critical' }) {
  return (
    <article className={`metric-card metric-${state}`}>
      <div className="metric-icon"><Icon size={19} /></div>
      <div className="metric-copy">
        <span>{label}</span>
        <strong>{value}<small>{unit}</small></strong>
        <em>{trend}</em>
      </div>
    </article>
  )
}

function MiniStat({ label, value, note, icon: Icon, accent = 'teal' }: { label: string; value: string; note: string; icon: LucideIcon; accent?: string }) {
  return (
    <article className={`mini-stat accent-${accent}`}>
      <div className="mini-stat-top"><span>{label}</span><Icon size={19} /></div>
      <strong>{value}</strong>
      <p>{note}</p>
    </article>
  )
}

function CameraFeed({ id, location, state = 'normal', onOpen }: { id: string; location: string; state?: 'normal' | 'incident'; onOpen?: () => void }) {
  return (
    <button className={`camera-feed camera-${state}`} onDoubleClick={onOpen} onClick={onOpen} aria-label={`เปิดภาพสด ${id} ${location}`}>
      <div className="camera-visual" aria-hidden="true">
        <img className="camera-image" src={getCameraImage(id)} alt="" loading="lazy" />
        <div className="camera-grid" />
        <div className="camera-focus"><span /></div>
        {state === 'incident' && <div className="incident-box">AI: STOPPED VEHICLE</div>}
      </div>
      <div className="camera-overlay">
        <span className="live-label"><i />LIVE</span>
        <span>{id}</span>
      </div>
      <div className="camera-caption"><span>{location}</span><Maximize2 size={14} /></div>
    </button>
  )
}

function LoginScreen({ onLogin, theme, toggleTheme, colorBlind, toggleColorBlind }: { onLogin: (user: DemoUser) => void; theme: Theme; toggleTheme: () => void; colorBlind: boolean; toggleColorBlind: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    const user = DEMO_USERS.find((item) => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password)
    if (!user) {
      setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาเลือกบัญชีทดลองด้านล่าง')
      return
    }
    onLogin(user)
  }

  const chooseDemo = (user: DemoUser) => {
    setEmail(user.email)
    setPassword(user.password)
    setError('')
  }

  return (
    <main className="login-page">
      <div className="login-orb orb-one" />
      <div className="login-orb orb-two" />
      <header className="login-topbar">
        <div className="brand-lockup">
          <div className="brand-symbol"><Waves size={23} /></div>
          <div><strong>TMCS</strong><span>Tunnel Monitoring & Control System</span></div>
        </div>
        <div className="login-tools">
          <IconButton label={colorBlind ? 'ปิดโหมดตาบอดสี' : 'เปิดโหมดตาบอดสี'} onClick={toggleColorBlind} active={colorBlind}><Eye size={18} /></IconButton>
          <IconButton label={theme === 'dark' ? 'ใช้ธีมสว่าง' : 'ใช้ธีมมืด'} onClick={toggleTheme}>{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</IconButton>
        </div>
      </header>

      <div className="login-shell">
        <section className="login-intro">
          <div className="tmcs-title">
            <StatusBadge level="ok">SYSTEM ONLINE</StatusBadge>
            <h1>TMCS</h1>
            <p>Tunnel Monitoring &amp; Control System</p>
            <span>ระบบติดตามและควบคุมอุโมงค์</span>
          </div>
          <figure className="login-scene">
            <img src="/images/tunnel-entrance.webp" alt="ทางเข้าอุโมงค์บนทางหลวง" fetchPriority="high" width="1440" height="1080" />
            <figcaption>
              <span><Radio size={14} /> LIVE OVERVIEW</span>
              <strong>อุโมงค์คลองไผ่ · การจราจรปกติ</strong>
              <small>46 devices · 21 cameras · อัปเดตแบบ near real-time</small>
            </figcaption>
            <div className="scene-health"><i /><span><b>92%</b> System health</span></div>
          </figure>
          <div className="login-capabilities">
            <div><Radio size={18} /><span><strong>Near real-time</strong>ข้อมูลสดจากภาคสนาม</span></div>
            <div><ShieldCheck size={18} /><span><strong>Role-based access</strong>แยกสิทธิ์ตามหน่วยงาน</span></div>
            <div><Eye size={18} /><span><strong>Accessible UI</strong>รองรับตาบอดสีและธีมมืด</span></div>
          </div>
        </section>

        <section className="login-card">
          <div className="login-card-heading">
            <span className="eyebrow">SECURE ACCESS</span>
            <h2>เข้าสู่ระบบควบคุม</h2>
            <p>เลือกบัญชีทดลองหรือกรอกข้อมูลเข้าสู่ระบบ</p>
          </div>
          <form onSubmit={submit}>
            <label>อีเมลผู้ใช้งาน
              <div className="input-wrap"><UserCog size={18} /><input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="name@tunnel.go.th" required /></div>
            </label>
            <label>รหัสผ่าน
              <div className="input-wrap"><LockKeyhole size={18} /><input value={password} onChange={(event) => setPassword(event.target.value)} type={showPassword ? 'text' : 'password'} placeholder="••••••••" required /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
            </label>
            {error && <div className="form-error"><AlertTriangle size={16} />{error}</div>}
            <div className="login-options"><label className="check-label"><input type="checkbox" /> จดจำอุปกรณ์นี้</label><button type="button" className="text-button">ลืมรหัสผ่าน?</button></div>
            <button className="primary-button login-submit" type="submit">เข้าสู่ระบบ <ChevronRight size={18} /></button>
          </form>
          <div className="demo-divider"><span>บัญชีทดลอง 3 ระดับ</span></div>
          <div className="demo-users">
            {DEMO_USERS.map((user) => (
              <button type="button" key={user.role} onClick={() => chooseDemo(user)} className={email === user.email ? 'selected' : ''}>
                <span className={`role-dot role-${user.role}`} />
                <span><strong>{user.roleLabel}</strong><small>{user.email}</small></span>
                {email === user.email && <Check size={16} />}
              </button>
            ))}
          </div>
          <p className="demo-password">รหัสผ่านทุกบัญชี: <code>Demo@123</code></p>
        </section>
      </div>
      <footer className="login-footer"><span>Mockup สำหรับการออกแบบและทดสอบแนวทางเท่านั้น · ภาพประกอบจาก Unsplash</span><span>One Web Center · Version 0.2</span></footer>
    </main>
  )
}

function Sidebar({ active, setActive, user, collapsed, setCollapsed, mobileOpen, setMobileOpen, onLogout }: { active: NavId; setActive: (id: NavId) => void; user: DemoUser; collapsed: boolean; setCollapsed: (value: boolean) => void; mobileOpen: boolean; setMobileOpen: (value: boolean) => void; onLogout: () => void }) {
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-brand">
        <div className="brand-symbol"><Waves size={22} /></div>
        {!collapsed && <div><strong><span>TMCS</span></strong><small>TUNNEL MONITORING & CONTROL</small></div>}
        <button className="mobile-sidebar-close" onClick={() => setMobileOpen(false)} aria-label="ปิดเมนู"><X size={20} /></button>
      </div>
      <div className="org-summary">
        <div className="org-icon"><Building2 size={18} /></div>
        {!collapsed && <div><small>หน่วยงานปัจจุบัน</small><strong>{user.org}</strong></div>}
      </div>
      <nav aria-label="เมนูหลัก">
        {navGroups.map((group) => {
          const visible = group.items.filter((item) => item.roles.includes(user.role))
          if (!visible.length) return null
          return (
            <div className="nav-group" key={group.label}>
              {!collapsed && <span className="nav-label">{group.label}</span>}
              {visible.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    className={active === item.id ? 'active' : ''}
                    onClick={() => { setActive(item.id); setMobileOpen(false) }}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon size={19} />
                    {!collapsed && <span>{item.label}</span>}
                    {item.id === 'alerts' && <em>2</em>}
                  </button>
                )
              })}
            </div>
          )
        })}
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-user">
          <span className="avatar">{user.initials}</span>
          {!collapsed && <div><strong>{user.name}</strong><small>{user.roleLabel}</small></div>}
          {!collapsed && <IconButton label="ออกจากระบบ" onClick={onLogout}><LogOut size={17} /></IconButton>}
        </div>
        <button className="collapse-button" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          {!collapsed && <span>ย่อแถบเมนู</span>}
        </button>
      </div>
    </aside>
  )
}

function Header({ active, user, now, theme, setTheme, colorBlind, setColorBlind, onMenu, onAlert }: { active: NavId; user: DemoUser; now: Date; theme: Theme; setTheme: (theme: Theme) => void; colorBlind: boolean; setColorBlind: (value: boolean) => void; onMenu: () => void; onAlert: () => void }) {
  const activeItem = navGroups.flatMap((group) => group.items).find((item) => item.id === active)
  return (
    <header className="app-header">
      <div className="header-left">
        <IconButton label="เปิดเมนู" onClick={onMenu} className="mobile-menu-button"><Menu size={20} /></IconButton>
        <div><span className="header-path">ศูนย์ควบคุม / {activeItem?.label}</span><h1>{activeItem?.label}</h1></div>
      </div>
      <div className="header-right">
        <div className="realtime-chip"><span /><div><strong>LIVE</strong><small>{formatDateTime(now)}</small></div></div>
        <div className="header-search"><Search size={17} /><input aria-label="ค้นหาอุปกรณ์หรือเหตุการณ์" placeholder="ค้นหาอุปกรณ์ เหตุการณ์..." /><kbd>⌘ K</kbd></div>
        <IconButton label={colorBlind ? 'ปิดโหมดตาบอดสี' : 'เปิดโหมดตาบอดสี'} active={colorBlind} onClick={() => setColorBlind(!colorBlind)}><Eye size={18} /></IconButton>
        <IconButton label={theme === 'dark' ? 'ใช้ธีมสว่าง' : 'ใช้ธีมมืด'} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</IconButton>
        <IconButton label="ดูการแจ้งเตือนเร่งด่วน" onClick={onAlert} className="notification-button"><Bell size={19} /><span className="notification-count">2</span></IconButton>
        <div className="header-profile"><span className="avatar">{user.initials}</span><div><strong>{user.name.split(' ')[0]}</strong><small>{user.roleLabel}</small></div><ChevronDown size={15} /></div>
      </div>
    </header>
  )
}

function OverviewPage({ onOpen, goTo }: { onOpen: (detail: DetailState) => void; goTo: (id: NavId) => void }) {
  const cameraDetail = (
    <div className="modal-camera-layout">
      <CameraFeed id="CAM-07" location="กม. 2+450 · ช่องทางซ้าย" state="incident" />
      <div className="incident-detail-card">
        <StatusBadge level="critical">เหตุการณ์วิกฤต</StatusBadge>
        <h3>ตรวจพบรถหยุดนิ่งผิดปกติ</h3>
        <p>AI ตรวจพบยานพาหนะหยุดต่อเนื่องเกิน 18 วินาที ความมั่นใจ 94.8%</p>
        <dl><div><dt>เวลาเริ่ม</dt><dd>14:32:08</dd></div><div><dt>ช่องทาง</dt><dd>ขาเข้า · ช่อง 1</dd></div><div><dt>อุปกรณ์</dt><dd>CAM-07 / AI Edge-02</dd></div></dl>
        <div className="button-row"><button className="primary-button"><MonitorPlay size={17} />เปิด Live Stream</button><button className="secondary-button">รับทราบเหตุการณ์</button></div>
      </div>
    </div>
  )

  return (
    <div className="page-stack">
      <section className="urgent-banner" role="alert">
        <div className="urgent-icon"><Siren size={20} /></div>
        <div><strong>URGENT · ตรวจพบรถหยุดนิ่ง กม. 2+450</strong><span>CAM-07 · ขาเข้า ช่องทางซ้าย · ตรวจพบเมื่อ 14:32:08</span></div>
        <div className="urgent-actions"><button onClick={() => onOpen({ title: 'Incident Monitor · INC-02841', subtitle: 'ภาพสดและข้อมูลวิเคราะห์จาก AI', content: cameraDetail })}><MonitorPlay size={17} />เปิด Monitor</button><button aria-label="เมนูเหตุการณ์"><MoreHorizontal size={18} /></button></div>
      </section>

      <section className="overview-heading">
        <div><StatusBadge level="ok">อุโมงค์คลองไผ่ · Online</StatusBadge><h2>สถานการณ์โดยรวมอยู่ในเกณฑ์ควบคุม</h2><p>ข้อมูลล่าสุดจาก 46 อุปกรณ์ · อัปเดตเมื่อไม่กี่วินาทีที่ผ่านมา</p></div>
        <div className="heading-actions"><button className="secondary-button"><RefreshCw size={16} />รีเฟรชข้อมูล</button><button className="primary-button"><Command size={17} />เปิด Command Center</button></div>
      </section>

      <section className="stat-grid">
        <MiniStat label="อุปกรณ์ออนไลน์" value="43 / 46" note="93.5% พร้อมใช้งาน" icon={Cpu} accent="teal" />
        <MiniStat label="ปริมาณรถวันนี้" value="10,406" note="+8.2% เทียบเมื่อวาน" icon={CarFront} accent="blue" />
        <MiniStat label="เหตุการณ์เปิดอยู่" value="2" note="1 วิกฤต · 1 เฝ้าระวัง" icon={AlertTriangle} accent="amber" />
        <MiniStat label="คุณภาพอากาศ" value="ดี" note="AQI 42 · ปลอดภัย" icon={Wind} accent="violet" />
      </section>

      <section className="dashboard-grid dashboard-grid-top">
        <Panel
          title="Live Traffic Flow"
          subtitle="จำนวนรถผ่านอุโมงค์รายชั่วโมง"
          className="traffic-panel"
          action={<StatusBadge level="ok">ข้อมูลสด</StatusBadge>}
          onOpen={() => onOpen({ title: 'Live Traffic Flow', subtitle: 'ปริมาณรถแยกทิศทางตั้งแต่ 08:00–14:00 น.', content: <ChartLarge type="traffic" /> })}
        >
          <div className="chart-legend"><span><i className="legend-in" />ขาเข้า 3,318 คัน</span><span><i className="legend-out" />ขาออก 2,891 คัน</span></div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData} margin={{ top: 8, right: 2, left: -24, bottom: 0 }}>
                <defs><linearGradient id="inbound" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--chart-primary)" stopOpacity={0.34} /><stop offset="100%" stopColor="var(--chart-primary)" stopOpacity={0.02} /></linearGradient></defs>
                <CartesianGrid stroke="var(--grid-line)" vertical={false} />
                <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: 'var(--surface-raised)', border: '1px solid var(--border)', borderRadius: 12 }} />
                <Area type="monotone" dataKey="inbound" stroke="var(--chart-primary)" strokeWidth={2.5} fill="url(#inbound)" />
                <Area type="monotone" dataKey="outbound" stroke="var(--chart-secondary)" strokeWidth={2} fill="transparent" strokeDasharray="5 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Tunnel Health" subtitle="สุขภาพระบบแบบรวม" className="health-panel" onOpen={() => onOpen({ title: 'Tunnel Health', subtitle: 'สถานะความพร้อมของระบบหลักทั้งหมด', content: <HealthDetails /> })}>
          <div className="health-score"><div className="score-ring"><strong>92</strong><span>/100</span></div><div><StatusBadge level="ok">ระบบปกติ</StatusBadge><p>4 ระบบหลักพร้อมใช้งาน<br />1 ระบบควรเฝ้าระวัง</p></div></div>
          <div className="health-bars">
            {[['กล้องและ AI', 96], ['VMS', 100], ['Environment', 91], ['ไฟฟ้า', 94], ['ระบบระบายน้ำ', 78]].map(([label, value]) => <div key={String(label)}><span>{label}<b>{value}%</b></span><div className="progress-track"><i style={{ width: `${value}%` }} /></div></div>)}
          </div>
        </Panel>
      </section>

      <section className="dashboard-grid dashboard-grid-middle">
        <Panel title="Live Cameras" subtitle="ดับเบิลคลิกเพื่อดูภาพใหญ่" className="camera-panel" action={<button className="text-button" onClick={() => goTo('cameras')}>ดูกล้องทั้งหมด <ChevronRight size={15} /></button>}>
          <div className="camera-grid-layout">
            <CameraFeed id="CAM-01" location="ทางเข้าทิศเหนือ" />
            <CameraFeed id="CAM-07" location="กม. 2+450 · ขาเข้า" state="incident" onOpen={() => onOpen({ title: 'Live Camera · CAM-07', subtitle: 'กม. 2+450 · ขาเข้า ช่อง 1', content: cameraDetail })} />
            <CameraFeed id="CAM-12" location="จุดกลับรถฉุกเฉิน" />
            <CameraFeed id="CAM-18" location="ทางออกทิศใต้" />
          </div>
        </Panel>

        <Panel title="Environment Snapshot" subtitle="ค่าจากเซนเซอร์ภายในอุโมงค์" className="environment-panel" action={<button className="text-button" onClick={() => goTo('environment')}>ดูรายละเอียด <ChevronRight size={15} /></button>} onOpen={() => onOpen({ title: 'Environment Snapshot', subtitle: 'ข้อมูลเซนเซอร์ภายในอุโมงค์', content: <ChartLarge type="environment" /> })}>
          <div className="metric-grid">
            <MetricCard icon={CloudSun} label="CO₂" value="588" unit="ppm" trend="อยู่ในเกณฑ์ปกติ" />
            <MetricCard icon={Droplets} label="ความชื้น" value="72" unit="%RH" trend="สูงขึ้น 2%" state="warning" />
            <MetricCard icon={Thermometer} label="อุณหภูมิ" value="29.4" unit="°C" trend="คงที่" />
            <MetricCard icon={Waves} label="ระดับน้ำ" value="29" unit="cm" trend="ต่ำกว่าจุดเตือน 16 cm" state="warning" />
            <MetricCard icon={Wind} label="PM2.5" value="28" unit="µg/m³" trend="คุณภาพดี" />
            <MetricCard icon={Fan} label="ความเร็วลม" value="2.8" unit="m/s" trend="พัดลมทำงานปกติ" />
          </div>
        </Panel>
      </section>

      <section className="dashboard-grid dashboard-grid-bottom">
        <Panel title="Recent Incidents" subtitle="เหตุการณ์ล่าสุดภายในวันนี้" className="incident-panel" action={<button className="text-button" onClick={() => goTo('alerts')}>ดูทั้งหมด <ChevronRight size={15} /></button>}>
          <div className="event-list">
            {alerts.slice(0, 3).map((alert) => <EventRow key={alert.id} alert={alert} onClick={alert.level === 'critical' ? () => onOpen({ title: 'Incident Monitor · INC-02841', content: cameraDetail }) : undefined} />)}
          </div>
        </Panel>
        <Panel title="VMS Active Content" subtitle="ข้อความที่กำลังแสดงผล" className="vms-panel" action={<button className="text-button" onClick={() => goTo('vms')}>จัดการ VMS <ChevronRight size={15} /></button>} onOpen={() => onOpen({ title: 'VMS-01 · Live Content', subtitle: 'ป้ายทางเข้าทิศเหนือ', content: <VmsPreview large /> })}>
          <VmsPreview />
          <div className="vms-meta"><span><CircleDot size={14} />VMS-01 · ทางเข้าเหนือ</span><span>ส่งเมื่อ 14:30 · Admin</span></div>
        </Panel>
        <Panel title="Power & Backup" subtitle="แหล่งจ่ายไฟและ UPS" className="power-panel" action={<button className="text-button" onClick={() => goTo('power')}>ดูระบบไฟฟ้า <ChevronRight size={15} /></button>}>
          <div className="power-main"><div className="power-orb"><Zap size={25} /></div><div><span>กำลังไฟรวม</span><strong>184.6 <small>kW</small></strong></div><StatusBadge level="ok">GRID ON</StatusBadge></div>
          <div className="power-sources"><div><span><Lightbulb size={16} />Main Grid</span><b>Online</b></div><div><span><HardDrive size={16} />UPS-A</span><b className="warn-text">68%</b></div><div><span><Activity size={16} />Generator</span><b>Standby</b></div></div>
        </Panel>
      </section>
    </div>
  )
}

function EventRow({ alert, onClick }: { alert: typeof alerts[number]; onClick?: () => void }) {
  const levelMap = { critical: 'critical', warning: 'warning', info: 'info' } as const
  return (
    <button className="event-row" onClick={onClick}>
      <span className={`event-icon event-${alert.level}`}>{alert.level === 'critical' ? <Siren size={17} /> : alert.level === 'warning' ? <AlertTriangle size={17} /> : <Info size={17} />}</span>
      <span className="event-copy"><strong>{alert.title}</strong><small>{alert.location}</small></span>
      <span className="event-time"><b>{alert.time}</b><StatusBadge level={levelMap[alert.level as keyof typeof levelMap]}>{alert.status}</StatusBadge></span>
    </button>
  )
}

function VmsPreview({
  large = false,
  template = VMS_TEMPLATES[0],
  headline,
  detail,
  badge,
  tone,
  motion = 'static',
}: {
  large?: boolean
  template?: VmsTemplate
  headline?: string
  detail?: string
  badge?: string
  tone?: VmsTone
  motion?: VmsMotion
}) {
  const Icon = template.icon
  const previewHeadline = headline ?? template.headline
  const previewDetail = detail ?? template.detail
  const previewBadge = badge === '' ? undefined : (badge ?? template.badge)
  const previewTone = tone ?? template.tone

  return (
    <div
      className={`vms-preview vms-tone-${previewTone} vms-motion-${motion} ${large ? 'vms-large' : ''}`}
      role="img"
      aria-label={`ตัวอย่างป้าย VMS: ${previewHeadline} ${previewDetail}`}
    >
      <div className="vms-dots" />
      <div className="vms-scanline" />
      <div className="vms-content">
        <Icon size={large ? 48 : 27} aria-hidden="true" />
        <div><strong>{previewHeadline || 'กรอกข้อความบนป้าย'}</strong>{previewDetail ? <span>{previewDetail}</span> : null}</div>
        {previewBadge ? <b>{previewBadge}</b> : null}
      </div>
    </div>
  )
}

function ChartLarge({ type }: { type: 'traffic' | 'environment' }) {
  return (
    <div className="large-chart">
      <ResponsiveContainer width="100%" height="100%">
        {type === 'traffic' ? (
          <AreaChart data={trafficData}><CartesianGrid stroke="var(--grid-line)" vertical={false} /><XAxis dataKey="time" /><YAxis /><Tooltip /><Area type="monotone" dataKey="inbound" stroke="var(--chart-primary)" fill="var(--chart-fill)" strokeWidth={3} /><Area type="monotone" dataKey="outbound" stroke="var(--chart-secondary)" fill="transparent" strokeWidth={2} /></AreaChart>
        ) : (
          <AreaChart data={sensorTrend}><CartesianGrid stroke="var(--grid-line)" vertical={false} /><XAxis dataKey="time" /><YAxis /><Tooltip /><Area type="monotone" dataKey="humidity" stroke="var(--chart-secondary)" fill="var(--chart-fill)" strokeWidth={3} /><Area type="monotone" dataKey="water" stroke="var(--warning)" fill="transparent" strokeWidth={2} /></AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}

function HealthDetails() {
  return <div className="health-detail-grid">{devices.map((device) => <div key={device.id}><span className={`device-dot ${device.status}`} /><div><strong>{device.name}</strong><small>{device.id} · {device.protocol}</small></div><b>{device.health}%</b></div>)}</div>
}

function VmsPage({ role, onOpen }: { role: Role; onOpen: (detail: DetailState) => void }) {
  const [contentType, setContentType] = useState<'text' | 'image' | 'video' | '3d'>('text')
  const [templateId, setTemplateId] = useState(VMS_TEMPLATES[0].id)
  const [headline, setHeadline] = useState(VMS_TEMPLATES[0].headline)
  const [detail, setDetail] = useState(VMS_TEMPLATES[0].detail)
  const [badge, setBadge] = useState(VMS_TEMPLATES[0].badge ?? '')
  const [tone, setTone] = useState<VmsTone>(VMS_TEMPLATES[0].tone)
  const [motion, setMotion] = useState<VmsMotion>('static')
  const canControl = role !== 'user'
  const selectedTemplate = VMS_TEMPLATES.find((template) => template.id === templateId) ?? VMS_TEMPLATES[0]

  const applyTemplate = (template: VmsTemplate) => {
    setTemplateId(template.id)
    setHeadline(template.headline)
    setDetail(template.detail)
    setBadge(template.badge ?? '')
    setTone(template.tone)
  }

  const livePreview = (
    <VmsPreview
      large
      template={selectedTemplate}
      headline={headline}
      detail={detail}
      badge={badge}
      tone={tone}
      motion={motion}
    />
  )

  return (
    <div className="page-stack">
      <PageTitle eyebrow="FIELD DISPLAY" title="ป้าย VMS และ Media Control" description="ตรวจสอบและจัดการเนื้อหาบนป้ายจากศูนย์กลาง รองรับข้อความ ภาพ วิดีโอ และสื่อ 3D" action={canControl ? <button className="primary-button"><Plus size={17} />สร้างรายการแสดงผล</button> : <StatusBadge level="neutral">สิทธิ์ดูข้อมูลเท่านั้น</StatusBadge>} />
      <section className="stat-grid compact">
        <MiniStat label="ป้ายทั้งหมด" value="8" note="7 online · 1 maintenance" icon={MonitorPlay} />
        <MiniStat label="กำลังแสดงผล" value="6" note="2 ป้ายใช้ default content" icon={Play} accent="blue" />
        <MiniStat label="รายการตามเวลา" value="4" note="ถัดไป 17:30 น." icon={Activity} accent="violet" />
        <MiniStat label="อัตราสำเร็จ" value="99.2%" note="ย้อนหลัง 30 วัน" icon={Check} accent="teal" />
      </section>
      <div className="split-layout vms-workspace">
        <Panel title="Content Composer" subtitle="ออกแบบเนื้อหาและดูตัวอย่างก่อนส่ง">
          <div className="segmented-control" role="tablist">
            {([['text', MessageSquareText, 'ข้อความ'], ['image', UploadCloud, 'ภาพ'], ['video', Video, 'วิดีโอ'], ['3d', BoxIcon, 'Media 3D']] as const).map(([id, Icon, label]) => <button key={id} role="tab" aria-selected={contentType === id} className={contentType === id ? 'active' : ''} onClick={() => setContentType(id)}><Icon size={16} />{label}</button>)}
          </div>
          {contentType === 'text' ? (
            <div className="composer-form">
              <section className="vms-template-picker" aria-labelledby="vms-template-title">
                <div className="template-picker-heading">
                  <div><h3 id="vms-template-title">รูปแบบป้ายพร้อมใช้</h3><p>เลือกแม่แบบแล้วปรับข้อความต่อได้ทันที</p></div>
                  <span>{VMS_TEMPLATES.length} รูปแบบ</span>
                </div>
                <div className="vms-template-grid">
                  {VMS_TEMPLATES.map((template) => {
                    const TemplateIcon = template.icon
                    const active = template.id === templateId
                    return (
                      <button
                        type="button"
                        key={template.id}
                        className={`vms-template-card tone-${template.tone} ${active ? 'active' : ''}`}
                        aria-pressed={active}
                        onClick={() => applyTemplate(template)}
                        disabled={!canControl}
                      >
                        <span className="template-sign"><TemplateIcon size={18} /><i>{template.badge ?? '•••'}</i></span>
                        <span><strong>{template.name}</strong><small>{template.category}</small></span>
                        {active ? <Check size={15} className="template-check" /> : null}
                      </button>
                    )
                  })}
                </div>
              </section>
              <div className="vms-copy-fields">
                <label>ข้อความหลัก<input value={headline} onChange={(event) => setHeadline(event.target.value)} maxLength={32} disabled={!canControl} /><small>{headline.length}/32 ตัวอักษร</small></label>
                <label>ข้อความรอง<input value={detail} onChange={(event) => setDetail(event.target.value)} maxLength={48} disabled={!canControl} /><small>{detail.length}/48 ตัวอักษร</small></label>
              </div>
              <div className="form-three-col">
                <label>สีข้อความ<select value={tone} onChange={(event) => setTone(event.target.value as VmsTone)} disabled={!canControl}><option value="amber">เหลืองมาตรฐาน</option><option value="white">ขาว</option><option value="red">แดงแจ้งเตือน</option><option value="green">เขียวแนะนำ</option></select></label>
                <label>รูปแบบการแสดง<select value={motion} onChange={(event) => setMotion(event.target.value as VmsMotion)} disabled={!canControl}><option value="static">คงที่</option><option value="pulse">กระพริบแจ้งเตือน</option><option value="marquee">เลื่อนจากขวา</option></select></label>
                <label>สัญลักษณ์กำกับ<select value={badge} onChange={(event) => setBadge(event.target.value)} disabled={!canControl}><option value="">ไม่แสดง</option><option value="30">จำกัด 30</option><option value="40">จำกัด 40</option><option value="60">จำกัด 60</option><option value="80">จำกัด 80</option><option value="×">ปิดช่องทาง</option></select></label>
              </div>
            </div>
          ) : (
            <div className="media-dropzone"><UploadCloud size={27} /><strong>วางไฟล์ {contentType === 'image' ? 'ภาพ' : contentType === 'video' ? 'วิดีโอ' : 'โมเดล 3D'} ที่นี่</strong><span>หรือเลือกจาก Media Library</span><button className="secondary-button">เลือกไฟล์</button></div>
          )}
          <div className="composer-preview">
            <div className="preview-heading"><span><i />LIVE PREVIEW</span><small>VMS-01 · 1920 × 480 px</small></div>
            {livePreview}
            <div className="preview-meta"><span>แม่แบบ: <b>{selectedTemplate.name}</b></span><span>การแสดงผล: <b>{motion === 'static' ? 'คงที่' : motion === 'pulse' ? 'กระพริบ' : 'เลื่อนข้อความ'}</b></span><em>ตัวอย่างเท่านั้น · ยังไม่ส่งไปยังป้าย</em></div>
          </div>
          <div className="button-row right"><button className="secondary-button">บันทึกฉบับร่าง</button><button className="primary-button" disabled={!canControl}><Send size={16} />ส่งไปยังป้าย</button></div>
        </Panel>
        <Panel title="VMS Devices" subtitle="สถานะป้ายที่อยู่ในขอบเขตหน่วยงาน">
          <div className="device-card-list">
            {['VMS-01 ทางเข้าเหนือ', 'VMS-02 ทางเข้าทิศใต้', 'VMS-03 กม. 1+200', 'VMS-04 ทางออกเหนือ', 'VMS-05 ทางออกใต้'].map((name, index) => <button key={name} onClick={() => onOpen({ title: `${name} · Live Preview`, subtitle: `${selectedTemplate.name} · ตัวอย่างจาก Content Composer`, content: livePreview })}><span className={`device-status-orb ${index === 3 ? 'offline' : ''}`}><MonitorPlay size={18} /></span><span><strong>{name}</strong><small>{index === 3 ? 'Maintenance · 28 นาที' : `Online · ${34 + index} ms`}</small></span><StatusBadge level={index === 3 ? 'warning' : 'ok'}>{index === 3 ? 'ซ่อมบำรุง' : 'ออนไลน์'}</StatusBadge><ChevronRight size={16} /></button>)}
          </div>
        </Panel>
      </div>
    </div>
  )
}

function BoxIcon({ size = 18 }: { size?: number }) {
  return <Network size={size} />
}

function CamerasPage({ onOpen }: { onOpen: (detail: DetailState) => void }) {
  const [filter, setFilter] = useState('all')
  const feeds = [
    ['CAM-01', 'ทางเข้าทิศเหนือ', 'normal'], ['CAM-03', 'กม. 0+800 · ขาออก', 'normal'], ['CAM-07', 'กม. 2+450 · ขาเข้า', 'incident'], ['CAM-09', 'กม. 3+100 · ขาออก', 'normal'], ['CAM-12', 'จุดกลับรถฉุกเฉิน', 'normal'], ['CAM-15', 'ห้องระบบระบายอากาศ', 'normal'], ['CAM-18', 'ทางออกทิศใต้', 'normal'], ['CAM-21', 'ลานพักฉุกเฉิน', 'normal'],
  ] as const
  return (
    <div className="page-stack">
      <PageTitle eyebrow="VIDEO ANALYTICS" title="กล้องและ AI Incident Detection" description="ภาพสดจากกล้องภาคสนาม พร้อมระบบวิเคราะห์อุบัติเหตุและอุบัติการณ์อัตโนมัติ" action={<button className="primary-button"><LayoutDashboard size={17} />Video Wall</button>} />
      <div className="filter-bar"><div className="segmented-control"><button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>กล้องทั้งหมด <b>21</b></button><button onClick={() => setFilter('incident')} className={filter === 'incident' ? 'active' : ''}>มีเหตุการณ์ <b>1</b></button><button onClick={() => setFilter('offline')} className={filter === 'offline' ? 'active' : ''}>ออฟไลน์ <b>0</b></button></div><div className="filter-actions"><button className="secondary-button"><SlidersHorizontal size={16} />ตัวกรอง</button><button className="secondary-button"><RefreshCw size={16} />รีเฟรช</button></div></div>
      <div className="full-camera-grid">
        {feeds.filter((feed) => filter === 'all' || (filter === 'incident' && feed[2] === 'incident')).map(([id, location, state]) => <CameraFeed key={id} id={id} location={location} state={state} onOpen={() => onOpen({ title: `Live Camera · ${id}`, subtitle: location, content: <div className="modal-camera-layout"><CameraFeed id={id} location={location} state={state} /><div className="stream-controls"><StatusBadge level={state === 'incident' ? 'critical' : 'ok'}>{state === 'incident' ? 'AI Incident' : 'Live Stream'}</StatusBadge><h3>{location}</h3><p>RTSP → Media Gateway → WebRTC · Latency 620 ms</p><div className="button-row"><button className="secondary-button"><Video size={16} />บันทึกคลิป</button><button className="primary-button"><Maximize2 size={16} />เต็มหน้าจอ</button></div></div></div> })} />)}
      </div>
      <Panel title="AI Detection Timeline" subtitle="เหตุการณ์ที่ตรวจพบในช่วง 24 ชั่วโมง">
        <div className="timeline-list">
          <EventRow alert={alerts[0]} />
          <div className="timeline-row"><span className="event-icon event-info"><CarFront size={17} /></span><span><strong>ตรวจพบรถย้อนศรช่วงสั้น</strong><small>CAM-03 · ตรวจสอบแล้วว่าเป็นรถซ่อมบำรุง</small></span><time>11:08:22</time><StatusBadge level="ok">ปิดเหตุการณ์</StatusBadge></div>
          <div className="timeline-row"><span className="event-icon event-warning"><TrafficCone size={17} /></span><span><strong>พบวัตถุตกหล่นบนช่องทาง</strong><small>CAM-09 · เจ้าหน้าที่เก็บออกแล้ว</small></span><time>09:41:03</time><StatusBadge level="ok">ปิดเหตุการณ์</StatusBadge></div>
        </div>
      </Panel>
    </div>
  )
}

function VehiclesPage({ onOpen }: { onOpen: (detail: DetailState) => void }) {
  return (
    <div className="page-stack">
      <PageTitle eyebrow="TRAFFIC INTELLIGENCE" title="จำแนกประเภทรถ" description="สถิติและแนวโน้มการจราจรจาก Vehicle Classification Sensor แบบ near real-time" action={<button className="secondary-button"><UploadCloud size={16} />ส่งออกรายงาน</button>} />
      <section className="stat-grid compact"><MiniStat label="รถผ่านวันนี้" value="10,406" note="เพิ่มขึ้น 8.2%" icon={CarFront} /><MiniStat label="ความเร็วเฉลี่ย" value="62 km/h" note="อยู่ในเกณฑ์ที่กำหนด" icon={Gauge} accent="blue" /><MiniStat label="รถหนัก" value="9.2%" note="962 คันวันนี้" icon={Truck} accent="amber" /><MiniStat label="ความแม่นยำ AI" value="97.8%" note="ตรวจเทียบล่าสุด 13:00" icon={ShieldCheck} accent="violet" /></section>
      <div className="dashboard-grid vehicle-grid">
        <Panel title="Traffic Volume by Hour" subtitle="จำนวนรถแยกทิศทาง" className="traffic-panel" onOpen={() => onOpen({ title: 'Traffic Volume by Hour', content: <ChartLarge type="traffic" /> })}><div className="chart-wrap tall"><ResponsiveContainer width="100%" height="100%"><BarChart data={trafficData}><CartesianGrid stroke="var(--grid-line)" vertical={false} /><XAxis dataKey="time" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} /><Tooltip /><Bar dataKey="inbound" fill="var(--chart-primary)" radius={[6, 6, 0, 0]} /><Bar dataKey="outbound" fill="var(--chart-secondary)" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div></Panel>
        <Panel title="Vehicle Classification" subtitle="สัดส่วนรถ 5 ประเภท" className="classification-panel">
          <div className="pie-layout"><div className="pie-wrap"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={vehicleTypes} dataKey="value" innerRadius={65} outerRadius={92} paddingAngle={3}>{vehicleTypes.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer><div className="pie-center"><strong>10.4K</strong><span>ทั้งหมด</span></div></div><div className="vehicle-legend">{vehicleTypes.map((item) => <div key={item.name}><i style={{ background: item.color }} /><span>{item.name}<small>{item.value.toLocaleString()} คัน</small></span><b>{Math.round(item.value / 10406 * 100)}%</b></div>)}</div></div>
        </Panel>
      </div>
      <Panel title="Classification Sensors" subtitle="จุดตรวจจับและสถานะอุปกรณ์"><div className="data-table-wrap"><table><thead><tr><th>อุปกรณ์</th><th>ตำแหน่ง</th><th>ทิศทาง</th><th>รถวันนี้</th><th>ความแม่นยำ</th><th>สถานะ</th></tr></thead><tbody>{[['CLS-01', 'ทางเข้าเหนือ', 'ขาเข้า', '5,842', '98.1%'], ['CLS-02', 'ทางออกเหนือ', 'ขาออก', '4,564', '97.4%'], ['CLS-03', 'กม. 2+400', 'ทั้งสองทิศ', '10,211', '97.8%']].map((row) => <tr key={row[0]}>{row.map((cell, index) => <td key={cell}>{index === 0 ? <strong>{cell}</strong> : cell}</td>)}<td><StatusBadge level="ok">ออนไลน์</StatusBadge></td></tr>)}</tbody></table></div></Panel>
    </div>
  )
}

function EnvironmentPage({ role, onOpen }: { role: Role; onOpen: (detail: DetailState) => void }) {
  const [pumpRequested, setPumpRequested] = useState(false)
  const metrics = [
    { label: 'CO₂', value: '588', unit: 'ppm', icon: CloudSun, note: 'เกณฑ์ปกติ < 1,000', state: 'normal' as const },
    { label: 'PM2.5', value: '28', unit: 'µg/m³', icon: Wind, note: 'คุณภาพอากาศดี', state: 'normal' as const },
    { label: 'ความชื้น', value: '72', unit: '%RH', icon: Droplets, note: 'เฝ้าระวัง > 75%', state: 'warning' as const },
    { label: 'อุณหภูมิ', value: '29.4', unit: '°C', icon: Thermometer, note: 'ปกติ 24–32°C', state: 'normal' as const },
    { label: 'ระดับน้ำ', value: '29', unit: 'cm', icon: Waves, note: 'จุดเตือน 45 cm', state: 'warning' as const },
    { label: 'ความเร็วลม', value: '2.8', unit: 'm/s', icon: Fan, note: 'ระบบระบายอากาศปกติ', state: 'normal' as const },
  ]
  return (
    <div className="page-stack">
      <PageTitle eyebrow="ENVIRONMENT & DRAINAGE" title="สภาพแวดล้อมและระดับน้ำ" description="เฝ้าระวังอากาศ ก๊าซ ความชื้น อุณหภูมิ และน้ำ เพื่อสนับสนุนการตัดสินใจของเจ้าหน้าที่" action={<StatusBadge level="warning">Water WS-03 · เฝ้าระวัง</StatusBadge>} />
      <div className="environment-metrics">{metrics.map((metric) => <MetricCard key={metric.label} icon={metric.icon} label={metric.label} value={metric.value} unit={metric.unit} trend={metric.note} state={metric.state} />)}</div>
      <div className="dashboard-grid environment-detail-grid">
        <Panel title="Sensor Trend" subtitle="แนวโน้ม 6 ชั่วโมงล่าสุด" className="environment-trend" onOpen={() => onOpen({ title: 'Sensor Trend · 6 Hours', content: <ChartLarge type="environment" /> })}>
          <div className="chart-wrap tall"><ResponsiveContainer width="100%" height="100%"><AreaChart data={sensorTrend}><CartesianGrid stroke="var(--grid-line)" vertical={false} /><XAxis dataKey="time" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} /><Tooltip /><Area type="monotone" dataKey="humidity" stroke="var(--chart-secondary)" fill="var(--chart-fill)" strokeWidth={2.5} /><Area type="monotone" dataKey="water" stroke="var(--warning)" fill="transparent" strokeWidth={2.5} /></AreaChart></ResponsiveContainer></div>
        </Panel>
        <Panel title="Drainage Decision Support" subtitle="คำแนะนำจากระดับน้ำและพยากรณ์">
          <div className="water-gauge-layout"><div className="water-tank"><div className="water-fill" style={{ height: '42%' }}><Waves size={34} /></div><span className="level-line line-danger">70 cm</span><span className="level-line line-warning">45 cm</span></div><div className="water-copy"><StatusBadge level="warning">ระดับเฝ้าระวัง</StatusBadge><strong>29 cm</strong><span>เพิ่มขึ้น 7 cm ใน 2 ชั่วโมง</span><div className="decision-box"><Info size={18} /><p><b>คำแนะนำ:</b> เตรียม Pump-B ให้พร้อม หากระดับน้ำถึง 45 cm ให้ส่งคำขออนุมัติเปิดปั๊ม</p></div></div></div>
          <div className="pump-row"><div><span className="device-status-orb"><Activity size={18} /></span><span><strong>Pump-A</strong><small>Standby · ไฟเลี้ยงปกติ</small></span></div><StatusBadge level="ok">พร้อมใช้งาน</StatusBadge></div>
          <div className="pump-row"><div><span className="device-status-orb"><Activity size={18} /></span><span><strong>Pump-B</strong><small>Standby · ไฟเลี้ยงปกติ</small></span></div><StatusBadge level="ok">พร้อมใช้งาน</StatusBadge></div>
          <div className="scope-note"><AlertTriangle size={17} /><span><strong>รอยืนยันขอบเขตการควบคุม</strong>หน้านี้แสดงคำแนะนำและ approval flow โดยยังไม่สั่งเปิด/ปิดอุปกรณ์จริง</span></div>
          <button className="primary-button full-button" disabled={role === 'user' || pumpRequested} onClick={() => setPumpRequested(true)}>{pumpRequested ? <><Check size={17} />ส่งคำขอแล้ว</> : <><Unlock size={17} />ส่งคำขออนุมัติเปิด Pump-B</>}</button>
        </Panel>
      </div>
    </div>
  )
}

function PowerPage() {
  return (
    <div className="page-stack">
      <PageTitle eyebrow="POWER MONITORING" title="ไฟฟ้าและระบบสำรอง" description="ติดตามกระแสไฟ แหล่งจ่าย UPS และ Generator เพื่อรู้ทันทีเมื่อระบบดับหรือไฟเลี้ยงผิดปกติ" action={<StatusBadge level="ok">Main Grid · Online</StatusBadge>} />
      <section className="power-flow panel">
        <div className="power-node source"><Zap size={24} /><strong>PEA Main Grid</strong><span>22 kV · Online</span></div><div className="power-line active"><i /></div><div className="power-node"><Settings2 size={24} /><strong>MDB-A</strong><span>400 V · 184.6 kW</span></div><div className="power-line active"><i /></div><div className="power-node"><HardDrive size={24} /><strong>UPS-A</strong><span>68% · 42 min</span></div><div className="power-line active"><i /></div><div className="power-node load"><Cpu size={24} /><strong>Tunnel Load</strong><span>46 devices</span></div>
      </section>
      <section className="stat-grid compact"><MiniStat label="แรงดันไฟฟ้า" value="398 V" note="L-L เฉลี่ย · ปกติ" icon={Zap} /><MiniStat label="กระแสรวม" value="286 A" note="68% ของ rated current" icon={Activity} accent="blue" /><MiniStat label="Power Factor" value="0.96" note="ประสิทธิภาพดี" icon={Gauge} accent="violet" /><MiniStat label="พลังงานวันนี้" value="2,814 kWh" note="-3.1% จากค่าเฉลี่ย" icon={Lightbulb} accent="amber" /></section>
      <div className="dashboard-grid power-detail-grid">
        <Panel title="Load Profile" subtitle="กำลังไฟฟ้ารวมวันนี้"><div className="chart-wrap tall"><ResponsiveContainer width="100%" height="100%"><AreaChart data={trafficData.map((item) => ({ ...item, load: Math.round(item.inbound / 3 + 22) }))}><CartesianGrid stroke="var(--grid-line)" vertical={false} /><XAxis dataKey="time" /><YAxis /><Tooltip /><Area dataKey="load" type="monotone" stroke="var(--chart-primary)" fill="var(--chart-fill)" strokeWidth={3} /></AreaChart></ResponsiveContainer></div></Panel>
        <Panel title="Power Sources" subtitle="สถานะแหล่งจ่ายหลักและสำรอง"><div className="source-list">{[['Main Grid', 'PEA Feed A', 'Online', 'ok', '398 V'], ['UPS-A', 'Control & Network', 'Discharging', 'warning', '68%'], ['Generator-01', 'Emergency Load', 'Standby', 'info', 'พร้อมสตาร์ต'], ['Solar Auxiliary', 'Office Load', 'Online', 'ok', '12.4 kW']].map(([name, target, status, level, value]) => <div key={name}><span className={`source-icon source-${level}`}><Zap size={18} /></span><span><strong>{name}</strong><small>{target}</small></span><b>{value}</b><StatusBadge level={level as 'ok' | 'warning' | 'info'}>{status}</StatusBadge></div>)}</div></Panel>
      </div>
    </div>
  )
}

function AlertsPage({ onOpen }: { onOpen: (detail: DetailState) => void }) {
  const [acknowledged, setAcknowledged] = useState<string[]>([])
  return (
    <div className="page-stack">
      <PageTitle eyebrow="INCIDENT COMMAND" title="เหตุการณ์และการแจ้งเตือน" description="รวมการแจ้งเตือนจากทุกอุปกรณ์ จัดลำดับความเร่งด่วน และเปิด Monitor ได้ทันที" action={<button className="secondary-button"><SlidersHorizontal size={16} />ตั้งค่ากฎแจ้งเตือน</button>} />
      <section className="alert-summary"><div className="critical-card"><span><Siren size={23} /></span><div><strong>1</strong><small>วิกฤต</small></div><b>ต้องดำเนินการทันที</b></div><div><span><AlertTriangle size={23} /></span><div><strong>2</strong><small>เฝ้าระวัง</small></div><b>กำลังติดตาม</b></div><div><span><Info size={23} /></span><div><strong>7</strong><small>ข้อมูล</small></div><b>ย้อนหลัง 24 ชม.</b></div><div><span><Check size={23} /></span><div><strong>18</strong><small>ปิดแล้ว</small></div><b>วันนี้</b></div></section>
      <Panel title="Active Alerts" subtitle="เหตุการณ์ที่ยังไม่ปิด">
        <div className="alert-table">
          {alerts.map((alert) => (
            <div key={alert.id} className={`alert-record alert-${alert.level}`}>
              <span className="alert-severity">{alert.level === 'critical' ? <Siren size={20} /> : alert.level === 'warning' ? <AlertTriangle size={20} /> : <Info size={20} />}</span>
              <span className="alert-record-copy"><small>{alert.id}</small><strong>{alert.title}</strong><span>{alert.location}</span></span>
              <span className="alert-record-time"><b>{alert.time}</b><small>27 ส.ค. 2569</small></span>
              <StatusBadge level={alert.level as 'critical' | 'warning' | 'info'}>{acknowledged.includes(alert.id) ? 'รับทราบแล้ว' : alert.status}</StatusBadge>
              <div className="record-actions"><button className="secondary-button" onClick={() => setAcknowledged((items) => [...items, alert.id])} disabled={acknowledged.includes(alert.id)}><Check size={15} />รับทราบ</button><button className="primary-button" onClick={() => onOpen({ title: `${alert.id} · Incident Monitor`, subtitle: alert.location, content: <IncidentDetail alert={alert} /> })}><MonitorPlay size={15} />Monitor</button></div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}

function IncidentDetail({ alert }: { alert: typeof alerts[number] }) {
  return <div className="incident-modal"><div className="incident-modal-main"><CameraFeed id="CAM-07" location={alert.location} state={alert.level === 'critical' ? 'incident' : 'normal'} /></div><div className="incident-detail-card"><StatusBadge level={alert.level as 'critical' | 'warning' | 'info'}>{alert.status}</StatusBadge><h3>{alert.title}</h3><p>{alert.location}</p><dl><div><dt>Incident ID</dt><dd>{alert.id}</dd></div><div><dt>เวลา</dt><dd>{alert.time}</dd></div><div><dt>ผู้รับผิดชอบ</dt><dd>เวรศูนย์ควบคุม A</dd></div></dl><label>บันทึกการดำเนินการ<textarea rows={3} placeholder="ระบุสิ่งที่ตรวจสอบหรือดำเนินการ..." /></label><button className="primary-button full-button"><Check size={16} />บันทึกและรับทราบ</button></div></div>
}

function DevicesPage() {
  const [tab, setTab] = useState<'fleet' | 'center'>('fleet')
  const [deviceName, setDeviceName] = useState('water-pump-gateway-b')
  const [connected, setConnected] = useState(false)
  const [burning, setBurning] = useState(false)
  const [burned, setBurned] = useState(false)
  const code = `// One Web Center · ESP32 device profile\n#include <WiFi.h>\n#include <PubSubClient.h>\n\nconst char* DEVICE_NAME = "${deviceName}";\nconst char* MQTT_TOPIC = "tunnel/devices/${deviceName}/telemetry";\n\nvoid setup() {\n  Serial.begin(115200);\n  connectNetwork();\n  registerDevice(DEVICE_NAME);\n}\n\nvoid loop() {\n  publishTelemetry(MQTT_TOPIC);\n  delay(2000);\n}`

  const burn = () => {
    if (!connected) return
    setBurning(true)
    setBurned(false)
    window.setTimeout(() => { setBurning(false); setBurned(true) }, 1600)
  }

  return (
    <div className="page-stack">
      <PageTitle eyebrow="ONE WEB CENTER" title="Device Management" description="ลงทะเบียน ตรวจสุขภาพ ตั้งค่า และเตรียม firmware สำหรับอุปกรณ์ภาคสนามจากศูนย์กลาง" action={<button className="primary-button"><Plus size={17} />เพิ่มอุปกรณ์</button>} />
      <div className="page-tabs"><button className={tab === 'fleet' ? 'active' : ''} onClick={() => setTab('fleet')}><Cpu size={17} />Device Fleet</button><button className={tab === 'center' ? 'active' : ''} onClick={() => setTab('center')}><Code2 size={17} />ESP32 Provisioning</button></div>
      {tab === 'fleet' ? (
        <>
          <section className="stat-grid compact"><MiniStat label="อุปกรณ์ทั้งหมด" value="46" note="5 ประเภทอุปกรณ์" icon={Cpu} /><MiniStat label="ออนไลน์" value="43" note="93.5% availability" icon={Radio} accent="blue" /><MiniStat label="ต้องดูแล" value="2" note="1 warning · 1 maintenance" icon={AlertTriangle} accent="amber" /><MiniStat label="Firmware ล่าสุด" value="89%" note="41 จาก 46 อุปกรณ์" icon={RefreshCw} accent="violet" /></section>
          <Panel title="Device Fleet" subtitle="อุปกรณ์ในอุโมงค์คลองไผ่"><div className="table-toolbar"><div className="header-search"><Search size={17} /><input placeholder="ค้นหาชื่อ Device, IP, Protocol..." /></div><button className="secondary-button"><SlidersHorizontal size={16} />ตัวกรอง</button></div><div className="data-table-wrap"><table><thead><tr><th>อุปกรณ์</th><th>ประเภท</th><th>Protocol / IP</th><th>Health</th><th>Firmware</th><th>สถานะ</th><th /></tr></thead><tbody>{devices.map((device) => <tr key={device.id}><td><div className="table-device"><span className={`device-dot ${device.status}`} /><span><strong>{device.name}</strong><small>{device.id}</small></span></div></td><td>{device.type}</td><td><strong>{device.protocol}</strong><small className="table-sub">{device.ip}</small></td><td><div className="health-cell"><div className="progress-track"><i style={{ width: `${device.health}%` }} /></div><b>{device.health}%</b></div></td><td>{device.firmware}</td><td><StatusBadge level={device.status === 'online' ? 'ok' : 'warning'}>{device.status === 'online' ? 'ออนไลน์' : device.status === 'warning' ? 'เฝ้าระวัง' : 'ซ่อมบำรุง'}</StatusBadge></td><td><IconButton label={`จัดการ ${device.name}`}><MoreHorizontal size={17} /></IconButton></td></tr>)}</tbody></table></div></Panel>
        </>
      ) : (
        <div className="provision-layout">
          <Panel title="Device & Connection" subtitle="เลือกโปรไฟล์แล้วเชื่อมต่ออุปกรณ์ผ่าน Web Serial">
            <label className="field-label">Device profile<select><option>ESP32 · Drainage Gateway</option><option>ESP32 · Environment Sensor</option><option>ESP32 · Power Meter Bridge</option></select></label>
            <label className="field-label">Device name<input value={deviceName} onChange={(event) => setDeviceName(event.target.value.replace(/[^a-z0-9-]/g, ''))} /></label>
            <div className={`connection-card ${connected ? 'connected' : ''}`}><span><Cpu size={25} /></span><div><strong>{connected ? 'ESP32-S3 connected' : 'ยังไม่ได้เชื่อมต่ออุปกรณ์'}</strong><small>{connected ? 'USB Serial · COM6 · 921600 baud' : 'เชื่อมต่อ ESP32 ด้วยสาย USB แล้วกด Connect'}</small></div><button className={connected ? 'secondary-button' : 'primary-button'} onClick={() => { setConnected(!connected); setBurned(false) }}>{connected ? 'Disconnect' : 'Connect device'}</button></div>
            <div className="firmware-info"><div><span>Firmware template</span><strong>drainage-gateway v0.9.2</strong></div><div><span>Board</span><strong>ESP32-S3 DevKitC-1</strong></div><div><span>Partition</span><strong>Default 4MB with SPIFFS</strong></div></div>
            <button className="primary-button full-button burn-button" disabled={!connected || burning} onClick={burn}>{burning ? <><RefreshCw className="spin" size={18} />กำลังเขียน Firmware…</> : burned ? <><Check size={18} />เขียน Firmware สำเร็จ</> : <><Zap size={18} />Burn bootloader & firmware</>}</button>
            <p className="security-hint"><ShieldCheck size={15} />Mockup นี้จำลอง Web Serial เท่านั้น ระบบจริงต้องลงนาม firmware, ตรวจสิทธิ์ installer และบันทึก audit trail</p>
          </Panel>
          <Panel title="Code Preview" subtitle="ค่าจะเปลี่ยนตาม Device name ก่อน burn" action={<StatusBadge level={connected ? 'ok' : 'neutral'}>{connected ? 'Serial connected' : 'Preview only'}</StatusBadge>}>
            <pre className="code-preview"><code>{code}</code></pre>
            <div className="serial-monitor"><div><span><CircleDot size={14} />SERIAL MONITOR</span><span>115200 baud</span></div><pre>{connected ? `[14:42:01] Booting ESP32-S3...\n[14:42:02] Device: ${deviceName}\n[14:42:03] WiFi connected · RSSI -51 dBm\n[14:42:03] MQTT connected · broker tunnel-mq-01\n[14:42:05] Telemetry published · water_level=29cm${burned ? '\n[14:42:08] Firmware verified · SHA256 OK' : ''}` : 'Connect a device to view serial output…'}</pre></div>
          </Panel>
        </div>
      )}
    </div>
  )
}

function UsersPage({ role }: { role: Role }) {
  return (
    <div className="page-stack"><PageTitle eyebrow="IDENTITY & ACCESS" title="จัดการผู้ใช้งาน" description={role === 'superadmin' ? 'จัดการผู้ใช้ทุกหน่วยงาน กำหนดบทบาทและขอบเขตการเข้าถึง' : 'จัดการผู้ใช้ภายในศูนย์ควบคุมของคุณ'} action={<button className="primary-button"><Plus size={17} />เพิ่มผู้ใช้งาน</button>} /><section className="stat-grid compact"><MiniStat label="ผู้ใช้ทั้งหมด" value={role === 'superadmin' ? '128' : '24'} note="ใช้งาน 112 คน" icon={Users} /><MiniStat label="กำลังออนไลน์" value="18" note="ใน 4 ศูนย์ควบคุม" icon={Radio} accent="blue" /><MiniStat label="Admin" value="12" note="ครอบคลุม 8 หน่วยงาน" icon={UserCog} accent="violet" /><MiniStat label="รอตรวจสอบ" value="3" note="คำขอสิทธิ์ใหม่" icon={AlertTriangle} accent="amber" /></section><Panel title="User Directory" subtitle="บัญชีที่อยู่ภายใต้ขอบเขตการดูแล"><div className="table-toolbar"><div className="header-search"><Search size={17} /><input placeholder="ค้นหาชื่อ อีเมล หรือหน่วยงาน..." /></div><button className="secondary-button"><SlidersHorizontal size={16} />ตัวกรอง</button></div><div className="data-table-wrap"><table><thead><tr><th>ผู้ใช้งาน</th><th>หน่วยงาน</th><th>บทบาท</th><th>เข้าใช้ล่าสุด</th><th>สถานะ</th><th /></tr></thead><tbody>{DEMO_USERS.concat([{ ...DEMO_USERS[2], name: 'รัตนา เจ้าหน้าที่เทคนิค', email: 'rattana@tunnel.go.th', initials: 'รจ' }]).map((user) => <tr key={user.email}><td><div className="user-cell"><span className="avatar">{user.initials}</span><span><strong>{user.name}</strong><small>{user.email}</small></span></div></td><td>{user.org}</td><td><StatusBadge level={user.role === 'superadmin' ? 'info' : user.role === 'admin' ? 'warning' : 'neutral'}>{user.roleLabel}</StatusBadge></td><td>วันนี้ · 14:{user.role === 'user' ? '28' : '40'}</td><td><StatusBadge level="ok">Active</StatusBadge></td><td><IconButton label={`จัดการ ${user.name}`}><MoreHorizontal size={17} /></IconButton></td></tr>)}</tbody></table></div></Panel></div>
  )
}

function OrganizationsPage() {
  return (
    <div className="page-stack"><PageTitle eyebrow="MULTI-ORGANIZATION" title="โครงสร้างหน่วยงาน" description="กำหนดลำดับชั้นหน่วยงาน ศูนย์ควบคุม และอุโมงค์ เพื่อแยกข้อมูลและสิทธิ์อย่างชัดเจน" action={<button className="primary-button"><Plus size={17} />เพิ่มหน่วยงาน</button>} /><div className="org-layout"><Panel title="Organization Tree" subtitle="โครงสร้างจากหน่วยงานสูงสุดลงสู่อุโมงค์"><div className="org-tree"><div className="tree-node root"><span><Building2 size={19} /></span><div><strong>สป. สำนักอำนวยความปลอดภัย</strong><small>Root organization · 128 users</small></div><StatusBadge level="info">ROOT</StatusBadge></div><div className="tree-branch"><OrgTreeNode name="ศูนย์ควบคุมอุโมงค์ เขต 1" detail="4 อุโมงค์ · 46 ผู้ใช้" active><OrgTreeNode name="อุโมงค์คลองไผ่" detail="46 devices · 24 users" /><OrgTreeNode name="อุโมงค์เขาใหญ่" detail="38 devices · 18 users" /></OrgTreeNode><OrgTreeNode name="ศูนย์ควบคุมอุโมงค์ เขต 2" detail="3 อุโมงค์ · 35 ผู้ใช้" /><OrgTreeNode name="ศูนย์ทดสอบและฝึกอบรม" detail="1 Test Lab · 12 ผู้ใช้" /></div></div></Panel><Panel title="Organization Detail" subtitle="ศูนย์ควบคุมอุโมงค์ เขต 1"><div className="org-detail-card"><span className="org-big-icon"><Building2 size={30} /></span><h3>ศูนย์ควบคุมอุโมงค์ เขต 1</h3><p>หน่วยงานระดับศูนย์ควบคุม ภายใต้ สป. สำนักอำนวยความปลอดภัย</p><dl><div><dt>Organization code</dt><dd>TOC-REGION-01</dd></div><div><dt>ผู้ดูแล</dt><dd>ธนา ผู้ดูแลศูนย์</dd></div><div><dt>หน่วยงานย่อย</dt><dd>4 อุโมงค์</dd></div><div><dt>จำนวนอุปกรณ์</dt><dd>164 อุปกรณ์</dd></div></dl><div className="button-row"><button className="secondary-button">แก้ไขข้อมูล</button><button className="primary-button">ดูสมาชิก</button></div></div></Panel></div></div>
  )
}

function OrgTreeNode({ name, detail, active = false, children }: { name: string; detail: string; active?: boolean; children?: ReactNode }) {
  return <div className="tree-group"><button className={`tree-node ${active ? 'active' : ''}`}><span><Building2 size={17} /></span><div><strong>{name}</strong><small>{detail}</small></div><ChevronRight size={16} /></button>{children && <div className="tree-children">{children}</div>}</div>
}

function PermissionsPage() {
  const permissions = [
    ['Dashboard & Monitoring', true, true, true], ['Incident acknowledgement', true, true, true], ['VMS content publish', true, true, false], ['Pump control approval', true, true, false], ['Device provisioning', true, true, false], ['User management', true, true, false], ['Organization management', true, false, false], ['Permission & Menu management', true, false, false],
  ]
  return <div className="page-stack"><PageTitle eyebrow="ROLE-BASED ACCESS" title="สิทธิ์การใช้งาน" description="กำหนดความสามารถตามบทบาท และจำกัดขอบเขตข้อมูลตามลำดับชั้นหน่วยงาน" action={<button className="primary-button"><Plus size={17} />สร้างบทบาท</button>} /><div className="role-cards"><RoleCard role="Super Admin" icon={ShieldCheck} detail="บริหารระบบและทุกหน่วยงาน" users="3 users" /><RoleCard role="Admin" icon={UserCog} detail="บริหารภายในหน่วยงานตนเอง" users="12 users" /><RoleCard role="Operator" icon={Eye} detail="เฝ้าระวังและรับทราบเหตุการณ์" users="113 users" /></div><Panel title="Permission Matrix" subtitle="สิทธิ์พื้นฐานของแต่ละบทบาท"><div className="permission-table"><div className="permission-head"><span>ความสามารถ</span><b>Super Admin</b><b>Admin</b><b>Operator</b></div>{permissions.map(([name, superRole, admin, user]) => <div key={String(name)}><span>{name as string}</span>{[superRole, admin, user].map((allowed, index) => <b key={index} className={allowed ? 'allowed' : 'denied'}>{allowed ? <Check size={17} /> : <X size={17} />}</b>)}</div>)}</div></Panel></div>
}

function RoleCard({ role, icon: Icon, detail, users }: { role: string; icon: LucideIcon; detail: string; users: string }) {
  return <article><span><Icon size={22} /></span><div><strong>{role}</strong><p>{detail}</p><small>{users}</small></div><IconButton label={`แก้ไข ${role}`}><MoreHorizontal size={17} /></IconButton></article>
}

function MenusPage() {
  return <div className="page-stack"><PageTitle eyebrow="SYSTEM NAVIGATION" title="จัดการเมนูระบบ" description="กำหนดลำดับ การแสดงผล และบทบาทที่เข้าถึงเมนูในแต่ละโมดูล" action={<button className="primary-button"><Plus size={17} />เพิ่มเมนู</button>} /><Panel title="Menu Structure" subtitle="ลากเพื่อจัดลำดับเมนู (mockup)"><div className="menu-management">{navGroups.map((group) => <div key={group.label}><div className="menu-group-title"><span><ListTree size={17} />{group.label}</span><StatusBadge level="ok">เปิดใช้งาน</StatusBadge></div>{group.items.map((item, index) => { const Icon = item.icon; return <div className="menu-record" key={item.id}><span className="drag-handle">⋮⋮</span><span className="menu-icon"><Icon size={18} /></span><span><strong>{item.label}</strong><small>/{item.id} · ลำดับ {index + 1}</small></span><span className="role-chips">{item.roles.map((role) => <i key={role}>{role}</i>)}</span><label className="switch"><input type="checkbox" defaultChecked /><span /></label><IconButton label={`ตั้งค่า ${item.label}`}><Settings2 size={17} /></IconButton></div>})}</div>)}</div></Panel></div>
}

function PageTitle({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return <section className="page-title"><div><span>{eyebrow}</span><h2>{title}</h2><p>{description}</p></div>{action && <div className="page-title-actions">{action}</div>}</section>
}

function WidgetModal({ detail, onClose }: { detail: NonNullable<DetailState>; onClose: () => void }) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><section className="widget-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><header><div><span>EXPANDED MONITOR</span><h2 id="modal-title">{detail.title}</h2>{detail.subtitle && <p>{detail.subtitle}</p>}</div><IconButton label="ปิดหน้าต่าง" onClick={onClose}><X size={20} /></IconButton></header><div className="widget-modal-content">{detail.content}</div></section></div>
}

function NotificationPopover({ onClose, onMonitor }: { onClose: () => void; onMonitor: () => void }) {
  return <div className="notification-popover"><div className="popover-header"><div><span>การแจ้งเตือน</span><small>2 รายการต้องดำเนินการ</small></div><IconButton label="ปิด" onClick={onClose}><X size={17} /></IconButton></div><div className="popover-alert critical"><span><Siren size={18} /></span><div><strong>รถหยุดนิ่งผิดปกติ</strong><small>CAM-07 · 14:32:08</small></div><button onClick={onMonitor}>Monitor</button></div><div className="popover-alert warning"><span><Waves size={18} /></span><div><strong>ระดับน้ำเพิ่มต่อเนื่อง</strong><small>WS-03 · 14:27:41</small></div><button>ดูข้อมูล</button></div><button className="popover-footer">ดูการแจ้งเตือนทั้งหมด <ChevronRight size={15} /></button></div>
}

function AccessDenied({ goHome }: { goHome: () => void }) {
  return <div className="access-denied"><span><LockKeyhole size={34} /></span><h2>ไม่มีสิทธิ์เข้าถึงหน้านี้</h2><p>บทบาทปัจจุบันไม่สามารถใช้งานโมดูลนี้ได้</p><button className="primary-button" onClick={goHome}>กลับหน้าภาพรวม</button></div>
}

function App() {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('tunnel-theme') as Theme) || 'light')
  const [colorBlind, setColorBlind] = useState(() => localStorage.getItem('tunnel-colorblind') === 'true')
  const [user, setUser] = useState<DemoUser | null>(() => {
    const stored = localStorage.getItem('tunnel-demo-user')
    return DEMO_USERS.find((item) => item.email === stored) || null
  })
  const [active, setActive] = useState<NavId>('overview')
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [detail, setDetail] = useState<DetailState>(null)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('tunnel-theme', theme)
  }, [theme])
  useEffect(() => {
    document.documentElement.dataset.colorblind = colorBlind ? 'true' : 'false'
    localStorage.setItem('tunnel-colorblind', String(colorBlind))
  }, [colorBlind])
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const allowed = useMemo(() => {
    if (!user) return []
    return navGroups.flatMap((group) => group.items).filter((item) => item.roles.includes(user.role)).map((item) => item.id)
  }, [user])

  const login = (demoUser: DemoUser) => {
    localStorage.setItem('tunnel-demo-user', demoUser.email)
    setUser(demoUser)
    setActive('overview')
  }

  const logout = () => {
    localStorage.removeItem('tunnel-demo-user')
    setUser(null)
    setActive('overview')
  }

  if (!user) return <LoginScreen onLogin={login} theme={theme} toggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} colorBlind={colorBlind} toggleColorBlind={() => setColorBlind(!colorBlind)} />

  const renderPage = () => {
    if (!allowed.includes(active)) return <AccessDenied goHome={() => setActive('overview')} />
    switch (active) {
      case 'overview': return <OverviewPage onOpen={setDetail} goTo={setActive} />
      case 'vms': return <VmsPage role={user.role} onOpen={setDetail} />
      case 'cameras': return <CamerasPage onOpen={setDetail} />
      case 'vehicles': return <VehiclesPage onOpen={setDetail} />
      case 'environment': return <EnvironmentPage role={user.role} onOpen={setDetail} />
      case 'power': return <PowerPage />
      case 'alerts': return <AlertsPage onOpen={setDetail} />
      case 'devices': return <DevicesPage />
      case 'users': return <UsersPage role={user.role} />
      case 'organizations': return <OrganizationsPage />
      case 'permissions': return <PermissionsPage />
      case 'menus': return <MenusPage />
      default: return <OverviewPage onOpen={setDetail} goTo={setActive} />
    }
  }

  return (
    <div className="app-shell">
      <Sidebar active={active} setActive={setActive} user={user} collapsed={collapsed} setCollapsed={setCollapsed} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} onLogout={logout} />
      {mobileOpen && <button className="mobile-overlay" aria-label="ปิดเมนู" onClick={() => setMobileOpen(false)} />}
      <div className={`app-main ${collapsed ? 'sidebar-collapsed' : ''}`}>
        <Header active={active} user={user} now={now} theme={theme} setTheme={setTheme} colorBlind={colorBlind} setColorBlind={setColorBlind} onMenu={() => setMobileOpen(true)} onAlert={() => setNotificationsOpen((value) => !value)} />
        {notificationsOpen && <NotificationPopover onClose={() => setNotificationsOpen(false)} onMonitor={() => { setNotificationsOpen(false); setActive('alerts') }} />}
        <main className="page-content">{renderPage()}</main>
      </div>
      {detail && <WidgetModal detail={detail} onClose={() => setDetail(null)} />}
    </div>
  )
}

export default App
