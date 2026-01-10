🚀 Next.js Portfolio with Hybrid Splunk Telemetry
A Full-Stack Telemetry Pipeline demonstrating a "Cloud-Buffer" architecture. > This project decouples data generation (Public Web) from data analysis (Private Splunk) to ensure zero-downtime logging without exposing the internal Splunk HEC to the public internet.

🏗️ Architecture
This is not just a website; it is a fault-tolerant logging system.

Code snippet

graph LR
    User[👤 Visitor] -- Hovers/Clicks --> NextJS[⚛️ Next.js App]
    NextJS -- JSON Logs --> Axiom[☁️ Axiom Cloud Buffer]
    Axiom -- Stored Safely (24/7) --> AxiomDB[(Log Storage)]
    
    subgraph "Private Network (Your Laptop)"
        Python[🐍 Bridge Script] -- Pulls Data --> Axiom
        Python -- Pushes via HEC --> Splunk[🦅 Local Splunk]
    end
Frontend (Data Source): Captures user interactions (hovers on skills, page views) in real-time.

Cloud Buffer (Axiom): Acts as a serverless queue. Captures 100% of traffic even when the analysis machine is offline.

The Bridge (Python): A custom ingestion script that fetches logs from the cloud and pushes them to Splunk Enterprise via HTTP Event Collector (HEC).

🛠️ Features
Real-Time Cloud Logging: Logs reach Axiom in milliseconds.

Asynchronous Ingestion: Splunk stays safe behind the firewall; the Python script handles the "ETL" (Extract, Transform, Load).

Splunk HEC Integration: Uses token-based authentication for secure data entry.

Live "Search" Tab: The website includes a public-facing dashboard that queries the Axiom API directly to show live stats to visitors.

⚙️ Installation & Setup
1. Prerequisites
Node.js (for the website)

Python 3.x (for the bridge script)

Splunk Enterprise (Local or Cloud)

Axiom Account (Free tier works perfectly)

2. The Website (Next.js)
Clone the repo and install dependencies:

Bash

git clone https://github.com/yourusername/your-repo.git
cd your-repo
npm install
Configure Secrets: Do NOT commit your tokens. Create a .env.local file:

Code snippet

NEXT_PUBLIC_AXIOM_DATASET="portfolio-logs"
NEXT_PUBLIC_AXIOM_TOKEN="xaat-your-axiom-api-token"
Run the dev server:

Bash

npm run dev
# Open http://localhost:3000
3. The Splunk Bridge (Python)
This script lives in splunk_bridge/ (or wherever you placed it).

Install Python Dependencies:

Bash

pip install requests
Configure the Script: Open axiom_to_splunk.py and update the configuration section.

⚠️ SECURITY WARNING: Since this is a public repo, utilize environment variables or a .env file for your Python script, or add axiom_to_splunk.py to your .gitignore so you don't accidentally publish your Splunk HEC token!

Python

# Configuration inside axiom_to_splunk.py
AXIOM_TOKEN = "xaat-your-axiom-token"
AXIOM_DATASET = "portfolio-logs"
SPLUNK_HEC_URL = "https://127.0.0.1:8088/services/collector"
SPLUNK_HEC_TOKEN = "your-splunk-hec-token-here"
🚀 How to Use
Step 1: Generate Traffic
Go to the deployed website (or localhost).

Hover over your Skills.

Click on Projects.

Result: Logs are sent instantly to the Axiom Cloud Buffer.

Step 2: Run the Bridge
On your local machine, run the Python script to "download" the logs into Splunk.

Bash

python axiom_to_splunk.py
Output:

Plaintext

--- STARTING CLOUD-TO-SPLUNK BRIDGE ---
1. Pulling logs from Axiom (portfolio-logs)...
   SUCCESS: Downloaded 42 logs from Cloud.
2. Pushing 42 events to Local Splunk...
   VICTORY: Data indexed in Splunk!
Step 3: Analyze in Splunk
Open Splunk Enterprise and run this SPL query:

Code snippet

index="main" source="axiom-cloud" 
| stats count by details 
| sort - count
📂 Project Structure
Plaintext

.
├── src/
│   ├── app/
│   │   ├── page.js          # Main Portfolio UI
│   │   └── api/
│   │       └── stats/       # API Route to fetch Axiom logs for UI
├── splunk_bridge/
│   └── axiom_to_splunk.py   # The "Bridge" Script
├── .env.local               # Secrets (Not committed)
└── README.md                # Documentation
🤝 Contributing
Feel free to fork this project to build your own telemetry pipeline!

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

🛡️ Security Note
This project uses Environment Variables to manage secrets.

NEXT_PUBLIC_AXIOM_TOKEN is used for client-side queries (Read/Write).

Splunk HEC tokens are stored only locally and are never exposed to the client.
