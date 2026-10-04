export const LINKS={linkedin:"https://www.linkedin.com/in/didier-luboya",instagram:"https://www.instagram.com/didierlb_7"};
export const SKILLS={
 "Cloud & Azure":["Azure VMs & VNets","AKS & Docker","Azure SQL (HA)","Blob / File / Queue","Databricks","App Service","Elastic SAN"],
 "Automation & DevOps":["Terraform","PowerShell","Bash","Ansible","CI/CD pipelines","Git & GitHub"],
 "Identity & Security":["Azure AD & ID","RBAC & GPOs","One Identity Manager","CyberArk"],
 "Systems & Monitoring":["Linux (Ubuntu, CentOS, AIX)","Windows Server","VMware","Azure Monitor","SAS Viya"],
 "Blockchain":["Ethereum","Polygon","Smart contracts","NFT minting & trading"],
 "Web Development":["React.js","Node.js & Express","PHP, .NET, Java","PostgreSQL, MySQL, MongoDB","REST APIs & JWT"]
};
export const JOBS=[
 {role:"Cloud Infrastructure Engineer",co:"Capgemini",when:"Sep 2025 – Present · Kraków, Poland",pts:["Manage enterprise-scale cloud and virtual infrastructure across Windows, Linux and AIX environments","Maintain an accurate infrastructure inventory (VMs, storage, networks, OS, applications) aligned with CMDB best practices","Administer storage resources: provisioning, capacity monitoring and allocation across virtual and physical systems","Automate provisioning, patching and configuration with PowerShell, improving consistency and auditability","Engineer secure systems using RBAC, Active Directory, GPOs and hardened OS baselines","Monitor performance, availability and security events, and lead incident resolution","Support system migrations and asset lifecycle transitions with minimal downtime","Collaborate with cross-functional teams across multiple workstreams and time zones"]},
 {role:"Azure Cloud Infrastructure Engineer",co:"Microsoft",when:"Jan 2024 – Sep 2025 · Kraków, Poland",pts:["Provisioned and managed Azure VMs (Linux/Windows) and storage, ensuring performance, cost efficiency and compliance with security policies","Automated Azure deployments with Terraform and CLI scripting, cutting manual provisioning time and configuration drift","Built and maintained secure, high-performance VNets for reliable connectivity between services and hybrid environments","Administered Azure Storage (Blob, File, Queue) and disks, resolving performance, availability and redundancy issues","Deployed and managed AKS clusters with Docker, ensuring efficient scaling and uptime","Integrated CI/CD pipelines for infrastructure and application deployments, reducing release times","Provisioned and optimised Azure SQL Databases with high availability, cluster failover and automated backups","Troubleshot deployment, configuration and connectivity issues, using SAS Viya log analytics and anomaly detection to correlate CPU, memory and network metrics with application failures and find root causes"]},
 {role:"NFT & Blockchain Engineer",co:"Emperium Capital",when:"2022 – 2023 · Dubai, UAE",pts:["Developed investment tokens for a trading platform using Ethereum and Polygon smart contracts","Built a platform for trading NFTs, including NFT creation and minting"]},
 {role:"Full-Stack Web Developer (Freelance)",co:"Angika Technology",when:"Sep 2021 – Present · Bengaluru, India",pts:["Develop responsive web apps with React.js, EJS and JavaScript","Build back-end services with Node.js, Express.js, PHP and .NET on PostgreSQL","Design RESTful APIs with JWT authentication, and explored blockchain integration","Configure and maintain MySQL and PostgreSQL, with backup strategies, data security and high availability","Maintain Apache for PHP development"]},
 {role:"Senior Web Researcher · French Market",co:"Action-Edge",when:"Apr 2021 – Aug 2022 · Ahmedabad, India",pts:["Led research on the French market, collecting and analysing data to shape new business strategy","Built data models and forecasts to predict market trends and plan the next market moves","Designed database systems and SQL ETL scripts to gather and structure survey data","Supported application and database integrations"]},
 {role:"IT Specialist",co:"Gubagoo",when:"Feb 2020 – Dec 2020 · Bengaluru, India",pts:["Delivered customer support for vehicle leasing and financing","Maintained accurate CRM records and improved customer satisfaction"]},
 {role:"Web Administrator",co:"SVJK School",when:"Jan 2019 – Jan 2020 · Bengaluru, India",pts:["Deployed web apps on Azure App Service, ensuring high availability and security","Monitored and optimised application performance with Azure Diagnostics and built-in monitoring tools","Migrated data from on-premises environments to Azure with integrity, minimal downtime and secure transfer"]},
 {role:"Web Developer (Intern)",co:"Angikatech",when:"Feb 2018 – Jan 2019 · Bengaluru, India",pts:["Built responsive websites with HTML, CSS and JavaScript","Developed dynamic web apps with PHP and integrated CMS platforms such as WordPress","Used Azure Dev/Test Labs for efficient testing workflows"]}
];
export const ABOUT="I'm a cloud engineer and software developer based in Kraków, Poland. I design and run secure cloud infrastructure on Azure, automate it with Terraform and PowerShell, and build the web applications that run on top of it. I started in web development, moved into cloud and system design, and I'm comfortable working across the whole stack. I speak French (native) and English (fluent).";
export const EDU=[
 {deg:"MSc Computer Engineering",school:"Vistula University · Warsaw, Poland",years:"2022 – 2024"},
 {deg:"MSc Computer Science",school:"Bangalore University · India",years:"2019 – 2021"},
 {deg:"Bachelor of Computer Applications",school:"Bangalore University · India",years:"2016 – 2019"}
];
export const SERVICES=[["Infrastructure Consulting","Architecture reviews, design and roadmaps for your company infrastructure."],["Azure Infrastructure & IaC","Secure, cost-efficient Azure environments automated with Terraform."],["Kubernetes & Containers","AKS clusters and Docker workloads that scale and stay up."],["Identity & Access","Azure AD, RBAC and Group Policy models done right."],["Migration & Operations","On-prem to cloud migrations, monitoring and incident response."],["Web Development","React front-ends connected to a solid cloud backend."]];

export const OUT={
 whoami:()=>["Didier Luboya","Cloud Engineer · Web Developer · System Design specialist","MSc Computer Engineering · Vistula University"],
 skills:()=>Object.entries(SKILLS).map(([k,v])=>k.padEnd(22)+"→ "+v.join(", ")),
 education:()=>EDU.map(e=>e.deg+" — "+e.school+" ("+e.years+")"),
 experience:()=>JOBS.map(j=>j.role+" @ "+j.co+" ("+j.when+")"),
 services:()=>SERVICES.map(s=>"• "+s[0]),
 contact:()=>["email    : didierluboya7@gmail.com","phone    : +48 515 595 109","location : Kraków, Poland","languages: French (native), English (fluent)","linkedin : linkedin.com/in/didier-luboya","instagram: instagram.com/didierlb_7"],
 neofetch:()=>["didier@cloud","------------","OS      : Linux (Ubuntu)","Cloud   : Azure","Focus   : Azure, Terraform, AKS","Identity: Active Directory","Shell   : bash 5.2","Uptime  : 7+ years in tech"]
};
export const CMDS=["whoami","skills","experience","education","services","contact","neofetch","help","clear"];
