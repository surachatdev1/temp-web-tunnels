# TMCS — Tunnel Monitoring & Control System

React mockup สำหรับระบบ Monitoring และ Backoffice ของอุโมงค์ ภายใต้ สป. สำนักอำนวยความปลอดภัย

## Demo accounts

| Role | Email | Password | Scope |
|---|---|---|---|
| Super Admin | `superadmin@tunnel.go.th` | `Demo@123` | ทุกหน่วยงานและทุกเมนู |
| Admin | `admin@tunnel.go.th` | `Demo@123` | ศูนย์ควบคุมและ Backoffice ระดับหน่วยงาน |
| Operator | `user@tunnel.go.th` | `Demo@123` | Monitoring และรับทราบเหตุการณ์ |

> บัญชีและการยืนยันตัวตนในรุ่นนี้เป็น client-side mockup ห้ามใช้เป็น production authentication

## Included modules

- Dashboard รวมแบบ near real-time พร้อมเปิด widget เป็นมุมมองขนาดใหญ่
- VMS composer สำหรับข้อความ ภาพ วิดีโอ และ Media 3D
- กล้องสดจำลองและ AI incident timeline
- Vehicle classification และ traffic analytics
- CO₂, PM2.5, ความชื้น, อุณหภูมิ, ลม และระดับน้ำ
- Power, current, UPS, generator และสถานะไฟเลี้ยง
- Urgent notifications พร้อมปุ่มเปิด Incident Monitor
- Device fleet และ ESP32 provisioning / code preview / serial monitor mockup
- User, organization, permission และ menu management
- Light, dark และ color-blind mode
- ภาพอุโมงค์แบบ WebP ที่เก็บภายในโปรเจกต์ ไม่พึ่ง hotlink ตอนใช้งาน

## Local development

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

## Production boundary

ส่วนควบคุมปั๊มน้ำ, Web Serial, firmware burning, live video, MQTT/WebSocket และคำสั่ง VMS เป็น UX mockup เท่านั้น ก่อนใช้งานจริงต้องเชื่อม Backend API, SSO/RBAC, audit log, device certificate, signed firmware, approval workflow และระบบ streaming ที่เหมาะสม

## Image credits

ภาพอุโมงค์ต้นฉบับโดย [viktor rejent](https://unsplash.com/@viktor_rejent) ภายใต้ Unsplash License และแปลงเป็น WebP สำหรับ mockup นี้
