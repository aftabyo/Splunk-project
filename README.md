🚀 Real-Time Infrastructure Observability Pipeline
A production-grade observability pipeline that streams live frontend telemetry from a Next.js application to a local Splunk Enterprise instance. The connection is secured via a permanent Cloudflare Zero Trust Tunnel, providing a hybrid-cloud bridge for real-time monitoring and behavioral analytics.



🛠️ Tech Stack
SIEM/Monitoring: Splunk Enterprise (HEC & Management API)

Connectivity: Cloudflare Zero Trust (Tunnels)

Frontend: Next.js (React)

Backend: Node.js / Vercel Serverless Functions

Analytics: SPL (Splunk Processing Language)

🏗️ System Architecture
Data Source: A Next.js portfolio captures user interactions (resume hovers, clicks).

Transport: Events are sent via a custom API route to a secure Cloudflare endpoint.

Tunnel: The Cloudflare Tunnel acts as a secure "hole" in the local firewall, routing traffic directly to the Splunk HEC.

Ingestion: Splunk indexes the JSON payloads in real-time.

Visualization: Custom SPL dashboards visualize visitor engagement and system health.

📊 Key Features
Zero-Exposure Security: No open ports on the local network; secured via Cloudflare’s encrypted tunnel.

High Fidelity Tracking: Captures visitor IP, action types, and millisecond-precision timestamps.

Real-Time Analytics: Dashboards update instantly as users interact with the live site.

Scalable Logic: Decoupled architecture allows for adding more data sources without reconfiguring the core pipeline.

🚀 How to Run Locally
1. Splunk Setup
Enable HTTP Event Collector (HEC) in Splunk.

Create a new HEC token and set the source type to _json.

Ensure port 8088 (HEC) and 8089 (Management) are active.

2. Cloudflare Tunnel
Install cloudflared on your local machine.

Map a public hostname (e.g., splunk.yourdomain.com) to localhost:8088.

3. Environment Variables
Create a .env.local file with:

Code snippet

SPLUNK_HEC_URL=https://your-tunnel-url.com/services/collector/event
SPLUNK_HEC_TOKEN=your-token-here

🔍 How to Test the Live Pipeline (The "Aha!" Moment)
This project is designed for interactive verification. You can see the data move from the browser to my local Splunk instance in under 1 second:

Visit the Live Portfolio: Open localhost by npm run dev in your browser.

Trigger an Event: Hover your mouse over the "My Resume" button or click on any project link.

The API Call: Behind the scenes, a Next.js API route captures this interaction and sends a secure JSON payload through the Cloudflare Tunnel.

Real-Time Verification: On my local Splunk instance, run this search query:

Splunk SPL

index="main" | table _time, action, details, _raw


The Result: You will see a live log entry containing your interaction, your approximate location (via IP), and the exact timestamp of the hover.

<img width="1906" height="976" alt="image" src="https://github.com/user-attachments/assets/74945ff5-92e0-4220-ad2b-c360bf4b870d" />

<img width="1916" height="838" alt="image" src="https://github.com/user-attachments/assets/6d9f9aad-cb47-4f40-94bc-486f7e223ad2" />

