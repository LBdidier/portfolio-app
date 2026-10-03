export const LINKS={linkedin:"https://www.linkedin.com/in/didier-luboya",instagram:"https://www.instagram.com/didierlb_7"};
export const SKILLS={
 "Cloud & Azure":["Azure VMs & VNets","AKS & Docker","Azure SQL (HA)","Blob / File / Queue","Databricks","App Service","Elastic SAN"],
 "Automation & DevOps":["Terraform","PowerShell","Bash","Ansible","CI/CD pipelines","Git & GitHub"],
 "Identity & Security":["Azure AD & ID","RBAC & GPOs","One Identity Manager","CyberArk"],
 "Systems & Monitoring":["Linux (Ubuntu, CentOS, AIX)","Windows Server","VMware","Azure Monitor","SAS Viya"],
 "Web Development":["React.js","Node.js & Express","PHP, .NET, Java","PostgreSQL, MySQL, MongoDB","REST APIs & JWT"]
};
export const JOBS=[
 {role:"Cloud System Engineer",co:"Capgemini",when:"Sep 2025 – Present · Kraków",pts:["Manage enterprise cloud and virtual infrastructure across Windows, Linux and AIX","Automate provisioning, patching and configuration with PowerShell","Engineer secure systems with RBAC, AD, GPOs and hardened OS baselines","Lead incident resolution and support system migrations with minimal downtime"]},
 {role:"Azure Cloud Infrastructure Engineer",co:"LTIMindtree (Microsoft)",when:"Jan 2024 – Sep 2025 · Kraków",pts:["Provisioned Azure VMs, VNets and storage; automated deployments with Terraform and CLI","Deployed and scaled AKS clusters with Docker; built CI/CD pipelines","Ran Azure SQL with high availability, failover and automated backups","Troubleshot incidents using SAS Viya log analytics and anomaly detection"]},
 {role:"Full-Stack Web Developer (Freelance)",co:"Angika Technology",when:"Sep 2021 – Present",pts:["Build web apps with React, Node.js, Express, PHP and .NET"]},
 {role:"Senior Web Researcher",co:"Action-Edge",when:"Apr 2021 – Aug 2022",pts:["Built React front-ends and Node/Express APIs with JWT authentication","Managed PostgreSQL and MySQL with backup and security strategies"]},
 {role:"Web Administrator",co:"SVJK School",when:"Jan 2019 – Jan 2020",pts:["Deployed apps on Azure App Service and migrated on-prem data to Azure"]}
];
export const SERVICES=[["Infrastructure Consulting","Architecture reviews, design and roadmaps for your company infrastructure."],["Azure Infrastructure & IaC","Secure, cost-efficient Azure environments automated with Terraform."],["Kubernetes & Containers","AKS clusters and Docker workloads that scale and stay up."],["Identity & Access","Azure AD, RBAC and Group Policy models done right."],["Migration & Operations","On-prem to cloud migrations, monitoring and incident response."],["Web Development","React front-ends connected to a solid cloud backend."]];

export const OUT={
 whoami:()=>["Didier Luboya","Cloud Engineer · Web Developer · System Design specialist","MSc Computer Engineering · Vistula University"],
 skills:()=>Object.entries(SKILLS).map(([k,v])=>k.padEnd(22)+"→ "+v.join(", ")),
 experience:()=>JOBS.map(j=>j.role+" @ "+j.co+" ("+j.when+")"),
 services:()=>SERVICES.map(s=>"• "+s[0]),
 contact:()=>["email    : didierluboya7@gmail.com","location : Kraków, Poland","languages: French (native), English (fluent)","linkedin : linkedin.com/in/didier-luboya","instagram: instagram.com/didierlb_7"],
 neofetch:()=>["didier@cloud","------------","OS      : Linux (Ubuntu)","Cloud   : Azure","Focus   : Azure, Terraform, AKS","Identity: Active Directory","Shell   : bash 5.2","Uptime  : 7+ years in tech"]
};
export const CMDS=["whoami","skills","experience","services","contact","neofetch","help","clear"];
