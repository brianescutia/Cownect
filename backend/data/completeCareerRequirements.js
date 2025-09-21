// backend/data/completeCareerRequirements.js
// Complete database of 55 careers with entry requirements and UC Davis resources

const completeCareerRequirements = {
    // ============= SOFTWARE/CS FOCUSED (20 careers) =============

    "Software Engineer (Full Stack)": {
        category: "Software Engineering",
        description: "Build end-to-end web applications, from database to user interface",
        education: {
            primary: "BS in Computer Science, Software Engineering, or related field",
            alternative: "Bootcamp certification + strong portfolio",
            requiredCourses: ["ECS 36A/B/C (Programming)", "ECS 60 (Data Structures)", "ECS 162 (Web Programming)", "ECS 165A (Database Systems)"]
        },
        technicalSkills: {
            required: ["JavaScript/TypeScript", "React or Angular", "Node.js or Python", "SQL", "Git", "REST APIs"],
            preferred: ["Docker", "AWS/Cloud", "GraphQL", "CI/CD", "Testing frameworks"],
            tools: ["VS Code", "GitHub", "Postman", "Chrome DevTools"]
        },
        experience: {
            portfolio: "3-5 full-stack projects on GitHub",
            internships: "1+ software development internship preferred",
            projects: ["Personal website", "CRUD application", "API integration project", "Mobile-responsive app"]
        },
        certifications: {
            optional: ["AWS Certified Developer", "Meta Front-End Developer", "Google Associate Cloud Engineer"],
            recommended: ["freeCodeCamp Full Stack", "The Odin Project"]
        },
        ucDavisResources: {
            primaryClubs: ["HackDavis", "CodeLab", "#include", "AggieWorks"],
            courses: ["ECS 162 (Web Programming)", "ECS 165A (Database Systems)", "ECS 160 (Software Engineering)", "ECS 171 (Machine Learning)"],
            events: ["HackDavis", "Tech Talk Tuesdays", "CoE Career Fair"],
            professors: ["Prof. Xin Liu", "Prof. Premkumar Devanbu", "Prof. Vladimir Filkov"]
        },
        careerProgression: [
            { level: "Entry", title: "Junior Developer", salary: "$85k-$110k", years: "0-2" },
            { level: "Mid", title: "Software Engineer II", salary: "$110k-$150k", years: "2-5" },
            { level: "Senior", title: "Staff Engineer", salary: "$150k-$220k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$110k-$180k",
            entrySalary: "$85k-$110k",
            seniorSalary: "$150k-$250k",
            jobGrowth: "+22% (2024-2034)",
            totalJobs: "1.8M in US",
            remotePercentage: "78",
            topLocations: ["San Francisco", "Seattle", "Austin", "NYC", "Remote"],
            demandLevel: "Very High"
        },
        realJobPostings: [
            "Google: New Grad Software Engineer - Mountain View, CA",
            "Meta: Software Engineer, University Grad - Menlo Park, CA",
            "Microsoft: Software Development Engineer - Redmond, WA"
        ],
        skillGaps: [
            { skill: "System Design", importance: "Critical", timeToLearn: "3-6 months" },
            { skill: "Cloud Architecture", importance: "High", timeToLearn: "2-4 months" },
            { skill: "Testing/TDD", importance: "Medium", timeToLearn: "1-2 months" }
        ]
    },

    "Frontend Engineer": {
        category: "Software Engineering",
        description: "Create user interfaces and experiences for web applications",
        education: {
            primary: "BS in Computer Science, Design, or related field",
            alternative: "Bootcamp + strong design portfolio",
            requiredCourses: ["ECS 162 (Web Programming)", "ECS 164 (Computer Graphics)", "DES 117 (Web Design)"]
        },
        technicalSkills: {
            required: ["HTML/CSS", "JavaScript", "React/Vue/Angular", "Responsive Design", "Git"],
            preferred: ["TypeScript", "Webpack", "Sass/Less", "Testing (Jest)", "Accessibility"],
            tools: ["Figma", "Chrome DevTools", "VS Code", "Storybook"]
        },
        experience: {
            portfolio: "5+ responsive web projects",
            internships: "Frontend or design internship helpful",
            projects: ["Portfolio website", "Interactive web app", "Component library", "Progressive Web App"]
        },
        certifications: {
            optional: ["Meta Front-End Developer Certificate", "Google UX Design Certificate"],
            recommended: ["freeCodeCamp Responsive Web Design"]
        },
        ucDavisResources: {
            primaryClubs: ["Design Interactive", "HackDavis", "Women in Computer Science"],
            courses: ["ECS 162 (Web Programming)", "ECS 164 (Computer Graphics)", "DES 117 (Web Design)"],
            events: ["Design workshops", "HackDavis", "Frontend meetups"],
            professors: ["Prof. Xin Liu", "Prof. Nina Amenta"]
        },
        careerProgression: [
            { level: "Entry", title: "Junior Frontend Developer", salary: "$75k-$100k", years: "0-2" },
            { level: "Mid", title: "Frontend Engineer", salary: "$100k-$140k", years: "2-5" },
            { level: "Senior", title: "Senior Frontend Engineer", salary: "$140k-$190k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$95k-$150k",
            entrySalary: "$75k-$100k",
            seniorSalary: "$140k-$190k",
            jobGrowth: "+13% (2024-2034)",
            totalJobs: "195,000 in US",
            remotePercentage: "82",
            topLocations: ["San Francisco", "New York", "Los Angeles", "Seattle", "Remote"],
            demandLevel: "High"
        },
        realJobPostings: [
            "Airbnb: New Grad Frontend Engineer - San Francisco, CA",
            "Spotify: Junior Frontend Developer - New York, NY",
            "Adobe: Entry Level UI Engineer - San Jose, CA"
        ],
        skillGaps: [
            { skill: "Performance Optimization", importance: "Critical", timeToLearn: "2-3 months" },
            { skill: "Accessibility Standards", importance: "High", timeToLearn: "1-2 months" },
            { skill: "State Management", importance: "Medium", timeToLearn: "2-3 months" }
        ]
    },

    "Backend Engineer": {
        category: "Software Engineering",
        description: "Build server-side logic, databases, and application architecture",
        education: {
            primary: "BS in Computer Science or Software Engineering",
            alternative: "Strong programming background + system design knowledge",
            requiredCourses: ["ECS 60 (Data Structures)", "ECS 140A (Programming Languages)", "ECS 165A (Database Systems)", "ECS 150 (Operating Systems)"]
        },
        technicalSkills: {
            required: ["Python/Java/Go", "SQL", "REST APIs", "Database design", "Git"],
            preferred: ["Microservices", "Message queues", "Docker", "Redis", "GraphQL"],
            tools: ["Postman", "Docker", "PostgreSQL/MySQL", "AWS/GCP"]
        },
        experience: {
            portfolio: "3+ backend API projects",
            internships: "Backend or full-stack internship",
            projects: ["RESTful API", "Database design project", "Authentication system", "Microservices architecture"]
        },
        certifications: {
            optional: ["AWS Certified Solutions Architect", "Google Cloud Professional"],
            recommended: ["Docker Certified Associate"]
        },
        ucDavisResources: {
            primaryClubs: ["Google Developer Student Club", "CodeLab"],
            courses: ["ECS 165A (Database Systems)", "ECS 150 (Operating Systems)", "ECS 153 (Computer Security)"],
            events: ["System Design workshops", "Tech talks", "Hackathons"],
            professors: ["Prof. Mohammad Sadoghi", "Prof. Joël Porquet-Lupine"]
        },
        careerProgression: [
            { level: "Entry", title: "Junior Backend Developer", salary: "$80k-$105k", years: "0-2" },
            { level: "Mid", title: "Backend Engineer", salary: "$105k-$145k", years: "2-5" },
            { level: "Senior", title: "Senior Backend Engineer", salary: "$145k-$200k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$100k-$165k",
            entrySalary: "$80k-$105k",
            seniorSalary: "$145k-$200k",
            jobGrowth: "+22% (2024-2034)",
            totalJobs: "412,000 in US",
            remotePercentage: "75",
            topLocations: ["San Francisco", "Seattle", "Austin", "New York", "Remote"],
            demandLevel: "Very High"
        },
        realJobPostings: [
            "Amazon: New Grad Backend Engineer - Seattle, WA",
            "Stripe: Junior Backend Developer - San Francisco, CA",
            "Databricks: Entry Level Software Engineer, Backend - Mountain View, CA"
        ],
        skillGaps: [
            { skill: "Database Optimization", importance: "Critical", timeToLearn: "3-4 months" },
            { skill: "Distributed Systems", importance: "High", timeToLearn: "4-6 months" },
            { skill: "API Security", importance: "Medium", timeToLearn: "2-3 months" }
        ]
    },

    "Web Developer": {
        category: "Software Engineering",
        description: "Create and maintain websites and web applications",
        education: {
            primary: "BS in Computer Science, Web Development, or related",
            alternative: "Bootcamp or self-taught with portfolio",
            requiredCourses: ["ECS 162 (Web Programming)", "ECS 189M (Web Programming)"]
        },
        technicalSkills: {
            required: ["HTML/CSS", "JavaScript", "Responsive design", "Git", "Basic SEO"],
            preferred: ["WordPress", "React/Vue", "PHP", "Web hosting", "Analytics"],
            tools: ["VS Code", "Browser DevTools", "FTP clients", "CMS platforms"]
        },
        experience: {
            portfolio: "5-7 websites with varied functionality",
            internships: "Web development or digital agency internship",
            projects: ["Business website", "E-commerce site", "Blog platform", "Landing page with animations"]
        },
        certifications: {
            optional: ["Google Analytics Certified", "HubSpot Content Marketing"],
            recommended: ["freeCodeCamp Web Development"]
        },
        ucDavisResources: {
            primaryClubs: ["Web Development Club", "Design Interactive", "#include"],
            courses: ["ECS 162 (Web Programming)", "DES 117 (Web Design)"],
            events: ["Web dev workshops", "Freelance panels"],
            professors: ["Prof. Xin Liu"]
        },
        careerProgression: [
            { level: "Entry", title: "Junior Web Developer", salary: "$65k-$85k", years: "0-2" },
            { level: "Mid", title: "Web Developer", salary: "$85k-$115k", years: "2-5" },
            { level: "Senior", title: "Senior Web Developer", salary: "$115k-$145k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$75k-$120k",
            entrySalary: "$65k-$85k",
            seniorSalary: "$115k-$145k",
            jobGrowth: "+13% (2024-2034)",
            totalJobs: "185,000 in US",
            remotePercentage: "85",
            topLocations: ["Los Angeles", "New York", "Chicago", "Dallas", "Remote"],
            demandLevel: "High"
        },
        realJobPostings: [
            "Shopify: Junior Web Developer - Toronto, ON/Remote",
            "Wix: Entry Level Frontend Web Developer - San Francisco, CA",
            "GoDaddy: New Grad Web Developer - Phoenix, AZ"
        ],
        skillGaps: [
            { skill: "Performance Optimization", importance: "Critical", timeToLearn: "2-3 months" },
            { skill: "SEO Best Practices", importance: "High", timeToLearn: "1-2 months" },
            { skill: "CMS Development", importance: "Medium", timeToLearn: "2-3 months" }
        ]
    },

    "Mobile Developer (iOS/Android)": {
        category: "Software Engineering",
        description: "Build native or cross-platform mobile applications",
        education: {
            primary: "BS in Computer Science or Software Engineering",
            alternative: "Bootcamp + published apps",
            requiredCourses: ["ECS 189E (iOS Development)", "ECS 193A/B (Senior Design)"]
        },
        technicalSkills: {
            required: ["Swift/Kotlin", "iOS/Android SDK", "Mobile UI patterns", "Git", "REST APIs"],
            preferred: ["React Native/Flutter", "Firebase", "Push notifications", "App Store optimization"],
            tools: ["Xcode/Android Studio", "Figma", "TestFlight", "Firebase Console"]
        },
        experience: {
            portfolio: "2-3 published apps on App Store/Play Store",
            internships: "Mobile development internship at tech company",
            projects: ["Weather app with API", "Social media clone", "E-commerce mobile app", "AR/Camera feature app"]
        },
        certifications: {
            optional: ["Google Associate Android Developer", "iOS App Development with Swift"],
            recommended: ["Meta React Native Certification"]
        },
        ucDavisResources: {
            primaryClubs: ["Swift Coding Club", "HackDavis", "CodeLab"],
            courses: ["ECS 189E (iOS Development)", "ECS 164 (Computer Graphics)"],
            events: ["Mobile app competitions", "Demo days"],
            professors: ["Prof. Xin Liu", "Prof. Nina Amenta"]
        },
        careerProgression: [
            { level: "Entry", title: "Junior Mobile Developer", salary: "$75k-$100k", years: "0-2" },
            { level: "Mid", title: "Mobile Engineer", salary: "$100k-$140k", years: "2-5" },
            { level: "Senior", title: "Senior Mobile Engineer", salary: "$140k-$185k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$95k-$155k",
            entrySalary: "$75k-$100k",
            seniorSalary: "$140k-$185k",
            jobGrowth: "+21% (2024-2034)",
            totalJobs: "174,000 in US",
            remotePercentage: "68",
            topLocations: ["San Francisco", "Seattle", "New York", "Austin", "Remote"],
            demandLevel: "High"
        },
        realJobPostings: [
            "Uber: New Grad Mobile Engineer - San Francisco, CA",
            "Snap Inc: Junior iOS Developer - Los Angeles, CA",
            "DoorDash: Entry Level Android Engineer - San Francisco, CA"
        ],
        skillGaps: [
            { skill: "Cross-Platform Development", importance: "Critical", timeToLearn: "3-4 months" },
            { skill: "Mobile Security", importance: "High", timeToLearn: "2-3 months" },
            { skill: "App Performance", importance: "Medium", timeToLearn: "2-3 months" }
        ]
    },

    "DevOps Engineer": {
        category: "Software Engineering",
        description: "Bridge development and operations through automation and CI/CD",
        education: {
            primary: "BS in Computer Science, IT, or related",
            alternative: "System admin experience + certifications",
            requiredCourses: ["ECS 150 (Operating Systems)", "ECS 152A/B (Networks)", "ECS 154A (Computer Architecture)"]
        },
        technicalSkills: {
            required: ["Linux", "Docker", "CI/CD", "Git", "Scripting (Python/Bash)"],
            preferred: ["Kubernetes", "Terraform", "AWS/Azure/GCP", "Monitoring tools", "Ansible"],
            tools: ["Jenkins", "GitLab CI", "Prometheus", "Grafana", "ELK Stack"]
        },
        experience: {
            portfolio: "3-4 infrastructure automation projects",
            internships: "DevOps, SRE, or cloud engineering internship",
            projects: ["CI/CD pipeline setup", "Container orchestration project", "Infrastructure as Code implementation", "Monitoring dashboard"]
        },
        certifications: {
            optional: ["AWS Solutions Architect", "Certified Kubernetes Administrator", "HashiCorp Terraform"],
            recommended: ["Docker Certified Associate", "Linux Foundation Certified"]
        },
        ucDavisResources: {
            primaryClubs: ["AggieWorks", "Google Developer Student Club"],
            courses: ["ECS 150 (Operating Systems)", "ECS 152A/B (Networks)", "ECS 153 (Security)"],
            events: ["DevOps meetups", "Cloud workshops"],
            professors: ["Prof. Joël Porquet-Lupine", "Prof. Matthew Farrens"]
        },
        careerProgression: [
            { level: "Entry", title: "Junior DevOps Engineer", salary: "$80k-$110k", years: "0-2" },
            { level: "Mid", title: "DevOps Engineer", salary: "$110k-$150k", years: "2-5" },
            { level: "Senior", title: "Senior DevOps/SRE", salary: "$150k-$210k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$115k-$175k",
            entrySalary: "$80k-$110k",
            seniorSalary: "$150k-$210k",
            jobGrowth: "+25% (2024-2034)",
            totalJobs: "165,000 in US",
            remotePercentage: "85",
            topLocations: ["San Francisco", "Seattle", "Austin", "Denver", "Remote"],
            demandLevel: "Very High"
        },
        realJobPostings: [
            "Netflix: Junior DevOps Engineer - Los Gatos, CA",
            "Datadog: New Grad Site Reliability Engineer - New York, NY",
            "HashiCorp: Entry Level Cloud Engineer - San Francisco, CA/Remote"
        ],
        skillGaps: [
            { skill: "Kubernetes", importance: "Critical", timeToLearn: "3-4 months" },
            { skill: "Cloud Architecture", importance: "High", timeToLearn: "4-5 months" },
            { skill: "Infrastructure as Code", importance: "Medium", timeToLearn: "2-3 months" }
        ]
    },

    "Site Reliability Engineer (SRE)": {
        category: "Software Engineering",
        description: "Ensure system reliability, availability, and performance at scale",
        education: {
            primary: "BS in Computer Science or Software Engineering",
            alternative: "Strong systems background + DevOps experience",
            requiredCourses: ["ECS 150 (Operating Systems)", "ECS 152A/B (Networks)", "ECS 251 (Operating System Models)"]
        },
        technicalSkills: {
            required: ["Linux", "Python/Go", "Monitoring", "Incident management", "Cloud platforms"],
            preferred: ["Kubernetes", "Service mesh", "Chaos engineering", "SLO/SLI", "Terraform"],
            tools: ["Datadog", "PagerDuty", "Grafana", "Prometheus", "Terraform"]
        },
        experience: {
            portfolio: "3-4 reliability and monitoring projects",
            internships: "SRE, DevOps, or infrastructure internship",
            projects: ["Monitoring system implementation", "Chaos engineering experiment", "Incident response automation", "SLO dashboard"]
        },
        certifications: {
            optional: ["Google Cloud Professional SRE", "AWS DevOps Professional"],
            recommended: ["Site Reliability Engineering Foundation"]
        },
        ucDavisResources: {
            primaryClubs: ["AggieWorks", "Google Developer Student Club"],
            courses: ["ECS 150", "ECS 152A/B", "ECS 251"],
            events: ["SRE workshops", "Reliability engineering talks"],
            professors: ["Prof. Joël Porquet-Lupine"]
        },
        careerProgression: [
            { level: "Entry", title: "Junior SRE", salary: "$95k-$125k", years: "0-2" },
            { level: "Mid", title: "Site Reliability Engineer", salary: "$125k-$165k", years: "2-5" },
            { level: "Senior", title: "Senior SRE", salary: "$165k-$220k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$125k-$185k",
            entrySalary: "$95k-$125k",
            seniorSalary: "$165k-$220k",
            jobGrowth: "+25% (2024-2034)",
            totalJobs: "78,000 in US",
            remotePercentage: "80",
            topLocations: ["San Francisco", "Seattle", "New York", "Austin", "Remote"],
            demandLevel: "Very High"
        },
        realJobPostings: [
            "Google: University Graduate SRE - Mountain View, CA",
            "LinkedIn: New Grad Site Reliability Engineer - Sunnyvale, CA",
            "Cloudflare: Junior SRE - San Francisco, CA/Austin, TX"
        ],
        skillGaps: [
            { skill: "Incident Management", importance: "Critical", timeToLearn: "2-3 months" },
            { skill: "Service Mesh", importance: "High", timeToLearn: "3-4 months" },
            { skill: "Chaos Engineering", importance: "Medium", timeToLearn: "2-3 months" }
        ]
    },

    "Graphics/Rendering Engineer": {
        category: "Software Engineering",
        description: "Develop graphics engines and rendering systems",
        education: {
            primary: "BS in Computer Science with graphics focus",
            alternative: "Strong math background + graphics portfolio",
            requiredCourses: ["ECS 175 (Computer Graphics)", "ECS 177 (Advanced Computer Graphics)", "MAT 22A (Linear Algebra)"]
        },
        technicalSkills: {
            required: ["C++", "OpenGL/DirectX", "Linear algebra", "3D math", "Shaders"],
            preferred: ["Vulkan", "Ray tracing", "Physics engines", "GPU programming"],
            tools: ["Visual Studio", "RenderDoc", "Unity/Unreal", "Blender"]
        },
        experience: {
            portfolio: "3-4 graphics programming projects",
            internships: "Game development or graphics software internship",
            projects: ["3D renderer from scratch", "Shader effects library", "Ray tracer implementation", "Particle system"]
        },
        certifications: {
            optional: ["Unity Certified Professional", "NVIDIA Deep Learning"],
            recommended: ["Computer Graphics courses on Coursera"]
        },
        ucDavisResources: {
            primaryClubs: ["Game Development and Arts Club"],
            courses: ["ECS 175 (Computer Graphics)", "ECS 177 (Advanced Graphics)"],
            events: ["Graphics programming workshops", "Game jams"],
            professors: ["Prof. Nina Amenta", "Prof. Michael Neff"]
        },
        careerProgression: [
            { level: "Entry", title: "Junior Graphics Programmer", salary: "$85k-$115k", years: "0-2" },
            { level: "Mid", title: "Graphics Engineer", salary: "$115k-$155k", years: "2-5" },
            { level: "Senior", title: "Senior Rendering Engineer", salary: "$155k-$200k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$110k-$170k",
            entrySalary: "$85k-$115k",
            seniorSalary: "$155k-$200k",
            jobGrowth: "+15% (2024-2034)",
            totalJobs: "42,000 in US",
            remotePercentage: "45",
            topLocations: ["Los Angeles", "San Francisco", "Seattle", "Austin", "Remote"],
            demandLevel: "Moderate"
        },
        realJobPostings: [
            "NVIDIA: New College Grad - Graphics Software Engineer - Santa Clara, CA",
            "Epic Games: Junior Graphics Programmer - Cary, NC",
            "Unity Technologies: Entry Level Rendering Engineer - San Francisco, CA"
        ],
        skillGaps: [
            { skill: "GPU Optimization", importance: "Critical", timeToLearn: "4-5 months" },
            { skill: "Ray Tracing", importance: "High", timeToLearn: "3-4 months" },
            { skill: "Shader Programming", importance: "Medium", timeToLearn: "2-3 months" }
        ]
    },

    "Blockchain Developer": {
        category: "Software Engineering",
        description: "Build decentralized applications and smart contracts",
        education: {
            primary: "BS in Computer Science or related",
            alternative: "Strong programming background + blockchain portfolio",
            requiredCourses: ["ECS 155 (Computer Security)", "ECS 153 (Computer Security)", "ECS 189F (Blockchain)"]
        },
        technicalSkills: {
            required: ["Solidity", "Web3.js", "Ethereum", "Smart contracts", "Cryptography"],
            preferred: ["Rust", "Go", "DeFi protocols", "Layer 2 solutions"],
            tools: ["Truffle", "Hardhat", "MetaMask", "Remix IDE"]
        },
        experience: {
            portfolio: "3-4 deployed smart contracts or DApps",
            internships: "Blockchain or Web3 company internship",
            projects: ["DeFi application", "NFT marketplace", "DAO implementation", "Token contract with tests"]
        },
        certifications: {
            optional: ["Certified Blockchain Developer", "ConsenSys Blockchain Developer"],
            recommended: ["CryptoZombies course completion"]
        },
        ucDavisResources: {
            primaryClubs: ["Blockchain at Davis", "HackDavis", "Google Developer Student Club"],
            courses: ["ECS 155 (Cryptography)", "ECS 153 (Computer Security)"],
            events: ["Blockchain workshops", "Web3 hackathons"],
            professors: ["Prof. Matthew Franklin"]
        },
        careerProgression: [
            { level: "Entry", title: "Junior Blockchain Developer", salary: "$90k-$120k", years: "0-2" },
            { level: "Mid", title: "Blockchain Engineer", salary: "$120k-$160k", years: "2-5" },
            { level: "Senior", title: "Senior Blockchain Architect", salary: "$160k-$220k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$120k-$180k",
            entrySalary: "$90k-$120k",
            seniorSalary: "$160k-$220k",
            jobGrowth: "+18% (2024-2034)",
            totalJobs: "28,000 in US",
            remotePercentage: "90",
            topLocations: ["San Francisco", "New York", "Miami", "Austin", "Remote"],
            demandLevel: "Moderate"
        },
        realJobPostings: [
            "Coinbase: New Grad Blockchain Engineer - San Francisco, CA/Remote",
            "ConsenSys: Junior Smart Contract Developer - Remote",
            "Polygon: Entry Level Protocol Engineer - Remote"
        ],
        skillGaps: [
            { skill: "DeFi Protocols", importance: "Critical", timeToLearn: "3-4 months" },
            { skill: "Security Auditing", importance: "High", timeToLearn: "4-5 months" },
            { skill: "Layer 2 Solutions", importance: "Medium", timeToLearn: "2-3 months" }
        ]
    },

    "AR/VR Developer": {
        category: "Software Engineering",
        description: "Create immersive augmented and virtual reality experiences",
        education: {
            primary: "BS in Computer Science or Game Development",
            alternative: "Strong 3D programming + AR/VR portfolio",
            requiredCourses: ["ECS 175 (Computer Graphics)", "ECS 189L (Game Development)", "ECS 163 (Information Interfaces)"]
        },
        technicalSkills: {
            required: ["Unity/Unreal", "C#/C++", "3D math", "AR/VR SDKs"],
            preferred: ["Computer vision", "3D modeling", "Spatial audio", "Hand tracking"],
            tools: ["Unity", "Unreal Engine", "ARCore/ARKit", "Oculus SDK"]
        },
        experience: {
            portfolio: "2-3 AR/VR applications or experiences",
            internships: "AR/VR or game development internship",
            projects: ["VR game prototype", "AR mobile app", "Mixed reality experience", "360° video application"]
        },
        certifications: {
            optional: ["Unity Certified XR Developer", "Meta Spark AR Certification"],
            recommended: ["Unity Learn XR pathway"]
        },
        ucDavisResources: {
            primaryClubs: ["Game Development and Arts Club", "VR Club at UC Davis"],
            courses: ["ECS 175 (Computer Graphics)", "ECS 189L (Game Development)"],
            events: ["VR/AR showcases", "Game jams"],
            professors: ["Prof. Michael Neff"]
        },
        careerProgression: [
            { level: "Entry", title: "Junior AR/VR Developer", salary: "$80k-$110k", years: "0-2" },
            { level: "Mid", title: "XR Engineer", salary: "$110k-$150k", years: "2-5" },
            { level: "Senior", title: "Senior XR Developer", salary: "$150k-$195k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$105k-$165k",
            entrySalary: "$80k-$110k",
            seniorSalary: "$150k-$195k",
            jobGrowth: "+23% (2024-2034)",
            totalJobs: "35,000 in US",
            remotePercentage: "60",
            topLocations: ["San Francisco", "Los Angeles", "Seattle", "Austin", "Remote"],
            demandLevel: "High"
        },
        realJobPostings: [
            "Meta Reality Labs: New Grad AR/VR Engineer - Menlo Park, CA",
            "Magic Leap: Junior Mixed Reality Developer - Plantation, FL",
            "Niantic: Entry Level AR Engineer - San Francisco, CA"
        ],
        skillGaps: [
            { skill: "Spatial Computing", importance: "Critical", timeToLearn: "3-4 months" },
            { skill: "Computer Vision", importance: "High", timeToLearn: "4-5 months" },
            { skill: "3D Optimization", importance: "Medium", timeToLearn: "2-3 months" }
        ]
    },

    // DATA & AI (9 careers)

    "Data Scientist": {
        category: "Data & Analytics",
        description: "Extract insights from data using statistical and machine learning methods",
        education: {
            primary: "BS in Data Science, Statistics, Computer Science, or Math",
            alternative: "Strong math background + bootcamp",
            requiredCourses: ["STA 141A/B/C (Statistical Computing)", "ECS 171 (Machine Learning)", "MAT 135A (Probability)"]
        },
        technicalSkills: {
            required: ["Python/R", "SQL", "Statistics", "Data visualization", "Pandas/NumPy"],
            preferred: ["Machine Learning", "Deep Learning", "Spark", "Tableau/PowerBI", "A/B testing"],
            tools: ["Jupyter", "Git", "AWS/GCP", "Tableau", "Excel"]
        },
        experience: {
            portfolio: "4-5 data science projects with business impact",
            internships: "Data science or analytics internship",
            projects: ["Predictive modeling project", "A/B testing analysis", "Data pipeline automation", "ML web application"]
        },
        certifications: {
            optional: ["Google Data Analytics Professional", "IBM Data Science Professional"],
            recommended: ["Kaggle competitions", "DataCamp certifications"]
        },
        ucDavisResources: {
            primaryClubs: ["Davis Data Science Club", "AI Student Collective", "Aggie Sports Analytics"],
            courses: ["STA 141A/B/C", "ECS 171", "STA 135", "STA 142A/B"],
            events: ["DataFest", "ML workshops", "Research symposiums"],
            professors: ["Prof. Naoki Saito", "Prof. Thomas Lee", "Prof. Cho-Jui Hsieh"]
        },
        careerProgression: [
            { level: "Entry", title: "Junior Data Scientist", salary: "$85k-$115k", years: "0-2" },
            { level: "Mid", title: "Data Scientist II", salary: "$115k-$145k", years: "2-5" },
            { level: "Senior", title: "Senior Data Scientist", salary: "$145k-$185k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$95k-$165k",
            entrySalary: "$85k-$115k",
            seniorSalary: "$145k-$185k",
            jobGrowth: "+35% (2024-2034)",
            totalJobs: "192,000 in US",
            remotePercentage: "72",
            topLocations: ["San Francisco", "New York", "Seattle", "Boston", "Remote"],
            demandLevel: "Very High"
        },
        realJobPostings: [
            "Meta: Data Scientist, University Grad - Menlo Park, CA",
            "Airbnb: New Grad Data Scientist - San Francisco, CA",
            "Netflix: Junior Data Scientist - Los Gatos, CA"
        ],
        skillGaps: [
            { skill: "Statistical Modeling", importance: "Critical", timeToLearn: "3-4 months" },
            { skill: "Business Communication", importance: "High", timeToLearn: "2-3 months" },
            { skill: "Cloud Platforms", importance: "Medium", timeToLearn: "2-3 months" }
        ]
    },

    "Data Analyst": {
        category: "Data & Analytics",
        description: "Analyze data to help organizations make data-driven decisions",
        education: {
            primary: "BS in Statistics, Business Analytics, Economics, or related",
            alternative: "Any degree + strong analytical skills",
            requiredCourses: ["STA 100 (Applied Statistics)", "STA 141A (Statistical Computing)", "ECN 102 (Analysis of Economic Data)"]
        },
        technicalSkills: {
            required: ["Excel", "SQL", "Data visualization", "Basic statistics"],
            preferred: ["Python/R", "Tableau/PowerBI", "Google Analytics", "A/B testing"],
            tools: ["Excel", "Tableau", "SQL Server", "Google Analytics"]
        },
        experience: {
            portfolio: "3-4 data analysis projects with insights",
            internships: "Business analyst or data analyst internship",
            projects: ["Sales dashboard", "Customer segmentation analysis", "Market research report", "KPI tracking system"]
        },
        certifications: {
            optional: ["Google Data Analytics Certificate", "Microsoft Power BI Data Analyst"],
            recommended: ["SQL certifications", "Tableau Desktop Specialist"]
        },
        ucDavisResources: {
            primaryClubs: ["Davis Data Science Club", "Aggie Sports Analytics"],
            courses: ["STA 141A", "ECN 102", "STA 100"],
            events: ["DataFest", "Analytics workshops"],
            professors: ["Prof. James Sharpnack"]
        },
        careerProgression: [
            { level: "Entry", title: "Junior Data Analyst", salary: "$55k-$75k", years: "0-2" },
            { level: "Mid", title: "Data Analyst II", salary: "$75k-$95k", years: "2-5" },
            { level: "Senior", title: "Senior Data Analyst", salary: "$95k-$120k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$65k-$95k",
            entrySalary: "$55k-$75k",
            seniorSalary: "$95k-$120k",
            jobGrowth: "+23% (2024-2034)",
            totalJobs: "485,000 in US",
            remotePercentage: "65",
            topLocations: ["New York", "Chicago", "Dallas", "Atlanta", "Remote"],
            demandLevel: "High"
        },
        realJobPostings: [
            "JPMorgan Chase: Entry Level Data Analyst - New York, NY",
            "Target: Junior Business Data Analyst - Minneapolis, MN",
            "Spotify: New Grad Data Analyst - New York, NY"
        ],
        skillGaps: [
            { skill: "Advanced SQL", importance: "Critical", timeToLearn: "2-3 months" },
            { skill: "Dashboard Creation", importance: "High", timeToLearn: "2-3 months" },
            { skill: "Statistical Analysis", importance: "Medium", timeToLearn: "3-4 months" }
        ]
    },

    "Machine Learning Engineer": {
        category: "AI & ML",
        description: "Build and deploy machine learning models at scale",
        education: {
            primary: "BS in Computer Science, Data Science, or Mathematics",
            alternative: "Strong programming + ML course certificates",
            requiredCourses: ["ECS 171 (Machine Learning)", "ECS 170 (Artificial Intelligence)", "STA 141B/C (Statistical Computing)"]
        },
        technicalSkills: {
            required: ["Python", "TensorFlow/PyTorch", "Scikit-learn", "SQL", "Git"],
            preferred: ["MLOps", "Docker", "Cloud ML services", "Spark", "CUDA"],
            tools: ["Jupyter", "MLflow", "Kubeflow", "AWS SageMaker"]
        },
        experience: {
            portfolio: "3-4 ML projects with deployed models",
            internships: "ML engineering or data science internship",
            projects: ["End-to-end ML pipeline", "Deep learning project", "Model deployment API", "Real-time prediction system"]
        },
        certifications: {
            optional: ["Google Professional ML Engineer", "AWS Machine Learning Specialty"],
            recommended: ["Deep Learning Specialization", "fast.ai courses"]
        },
        ucDavisResources: {
            primaryClubs: ["AI Student Collective", "Davis Data Science Club"],
            courses: ["ECS 171", "ECS 170", "ECS 189G (Deep Learning)"],
            events: ["AI/ML workshops", "Research talks"],
            professors: ["Prof. Cho-Jui Hsieh", "Prof. Ian Davidson"]
        },
        careerProgression: [
            { level: "Entry", title: "Junior ML Engineer", salary: "$105k-$135k", years: "0-2" },
            { level: "Mid", title: "Machine Learning Engineer", salary: "$135k-$175k", years: "2-5" },
            { level: "Senior", title: "Senior ML Engineer", salary: "$175k-$230k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$130k-$195k",
            entrySalary: "$105k-$135k",
            seniorSalary: "$175k-$230k",
            jobGrowth: "+40% (2024-2034)",
            totalJobs: "89,000 in US",
            remotePercentage: "70",
            topLocations: ["San Francisco", "Seattle", "New York", "Boston", "Remote"],
            demandLevel: "Very High"
        },
        realJobPostings: [
            "OpenAI: Machine Learning Engineer, New Grad - San Francisco, CA",
            "Tesla: Junior ML Engineer, Autopilot - Palo Alto, CA",
            "Apple: Entry Level ML Engineer - Cupertino, CA"
        ],
        skillGaps: [
            { skill: "Model Deployment", importance: "Critical", timeToLearn: "3-4 months" },
            { skill: "Deep Learning", importance: "High", timeToLearn: "4-6 months" },
            { skill: "MLOps", importance: "Medium", timeToLearn: "3-4 months" }
        ]
    },

    "ML Infrastructure Engineer": {
        category: "AI & ML",
        description: "Build infrastructure for training and deploying ML models",
        education: {
            primary: "BS in Computer Science or Software Engineering",
            alternative: "Strong systems programming + ML knowledge",
            requiredCourses: ["ECS 171 (Machine Learning)", "ECS 150 (Operating Systems)", "ECS 251 (Operating System Models)"]
        },
        technicalSkills: {
            required: ["Python", "Docker/K8s", "Cloud platforms", "MLOps", "CI/CD"],
            preferred: ["Kubeflow", "MLflow", "Spark", "GPU optimization"],
            tools: ["Kubernetes", "Airflow", "TensorFlow Extended", "Ray"]
        },
        experience: {
            portfolio: "3-4 ML infrastructure projects",
            internships: "ML platform or infrastructure internship",
            projects: ["ML training pipeline", "Model serving infrastructure", "Feature store implementation", "Distributed training system"]
        },
        certifications: {
            optional: ["Kubernetes Certified", "AWS ML Specialty"],
            recommended: ["MLOps Specialization"]
        },
        ucDavisResources: {
            primaryClubs: ["AI Student Collective", "AggieWorks"],
            courses: ["ECS 171", "ECS 150", "ECS 251"],
            events: ["MLOps workshops", "Infrastructure talks"],
            professors: ["Prof. Cho-Jui Hsieh"]
        },
        careerProgression: [
            { level: "Entry", title: "Junior ML Infrastructure Engineer", salary: "$100k-$130k", years: "0-2" },
            { level: "Mid", title: "ML Infrastructure Engineer", salary: "$130k-$170k", years: "2-5" },
            { level: "Senior", title: "Senior ML Platform Engineer", salary: "$170k-$220k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$135k-$200k",
            entrySalary: "$100k-$130k",
            seniorSalary: "$170k-$220k",
            jobGrowth: "+35% (2024-2034)",
            totalJobs: "42,000 in US",
            remotePercentage: "75",
            topLocations: ["San Francisco", "Seattle", "New York", "Austin", "Remote"],
            demandLevel: "High"
        },
        realJobPostings: [
            "Uber: New Grad ML Infrastructure Engineer - San Francisco, CA",
            "Pinterest: Junior ML Platform Engineer - San Francisco, CA/Remote",
            "Instacart: Entry Level MLOps Engineer - San Francisco, CA"
        ],
        skillGaps: [
            { skill: "Distributed Systems", importance: "Critical", timeToLearn: "4-5 months" },
            { skill: "GPU Optimization", importance: "High", timeToLearn: "3-4 months" },
            { skill: "Container Orchestration", importance: "Medium", timeToLearn: "2-3 months" }
        ]
    },

    "Computer Vision Engineer": {
        category: "AI & ML",
        description: "Develop systems that can interpret and analyze visual information",
        education: {
            primary: "BS/MS in Computer Science with CV focus",
            alternative: "Strong ML background + CV projects",
            requiredCourses: ["ECS 174 (Computer Vision)", "ECS 171 (Machine Learning)", "ECS 189G (Deep Learning)"]
        },
        technicalSkills: {
            required: ["Python", "OpenCV", "Deep Learning", "CNN architectures", "C++"],
            preferred: ["CUDA", "3D vision", "SLAM", "Edge deployment"],
            tools: ["PyTorch/TensorFlow", "OpenCV", "YOLO", "CUDA Toolkit"]
        },
        experience: {
            portfolio: "3-4 computer vision projects",
            internships: "Computer vision or AI research internship",
            projects: ["Object detection system", "Image segmentation project", "Face recognition app", "3D reconstruction"]
        },
        certifications: {
            optional: ["NVIDIA Deep Learning Institute", "OpenCV AI Courses"],
            recommended: ["Deep Learning Specialization"]
        },
        ucDavisResources: {
            primaryClubs: ["AI Student Collective", "Cyclone RoboSub"],
            courses: ["ECS 174 (Computer Vision)", "ECS 171"],
            events: ["Computer vision workshops", "AI research talks"],
            professors: ["Prof. Yong Jae Lee"]
        },
        careerProgression: [
            { level: "Entry", title: "Junior CV Engineer", salary: "$95k-$125k", years: "0-2" },
            { level: "Mid", title: "Computer Vision Engineer", salary: "$125k-$165k", years: "2-5" },
            { level: "Senior", title: "Senior CV Engineer", salary: "$165k-$210k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$125k-$185k",
            entrySalary: "$95k-$125k",
            seniorSalary: "$165k-$210k",
            jobGrowth: "+28% (2024-2034)",
            totalJobs: "58,000 in US",
            remotePercentage: "55",
            topLocations: ["San Francisco", "Pittsburgh", "Boston", "Seattle", "Remote"],
            demandLevel: "High"
        },
        realJobPostings: [
            "Tesla: Computer Vision Engineer, Autopilot - Palo Alto, CA",
            "Amazon: New Grad Computer Vision Scientist - Seattle, WA",
            "Apple: Junior Computer Vision Engineer - Cupertino, CA"
        ],
        skillGaps: [
            { skill: "3D Computer Vision", importance: "Critical", timeToLearn: "4-5 months" },
            { skill: "Edge Deployment", importance: "High", timeToLearn: "3-4 months" },
            { skill: "Real-time Processing", importance: "Medium", timeToLearn: "2-3 months" }
        ]
    },

    // HARDWARE/ELECTRICAL (12 careers)

    "Embedded Systems Engineer": {
        category: "Hardware/Electrical Engineering",
        description: "Design and program embedded systems for hardware devices",
        education: {
            primary: "BS in Electrical Engineering, Computer Engineering, or CS",
            alternative: "Electronics background + embedded projects",
            requiredCourses: ["EEC 172 (Embedded Systems)", "EEC 180A/B (Digital Systems)", "ECS 150 (Operating Systems)"]
        },
        technicalSkills: {
            required: ["C/C++", "Microcontrollers", "Hardware debugging", "Circuit basics", "RTOS"],
            preferred: ["ARM architecture", "I2C/SPI/UART", "PCB design", "Assembly", "Linux embedded"],
            tools: ["Oscilloscope", "Logic analyzer", "JTAG debugger", "Keil/IAR", "Arduino/STM32"]
        },
        experience: {
            portfolio: "3-4 embedded systems projects",
            internships: "Embedded systems or hardware engineering internship",
            projects: ["IoT device with sensors", "RTOS implementation", "Communication protocol project", "Low-power embedded system"]
        },
        certifications: {
            optional: ["ARM Accredited Engineer", "Certified Embedded Systems Engineer"],
            recommended: ["Embedded Systems courses on Coursera"]
        },
        ucDavisResources: {
            primaryClubs: ["The Hardware Club @ UC Davis", "IEEE", "Davis Robotics Club"],
            courses: ["EEC 172", "EEC 180A/B", "ECS 150"],
            events: ["Hardware hackathons", "Robotics competitions"],
            professors: ["Prof. Houman Homayoun", "Prof. Venkatesh Akella"]
        },
        careerProgression: [
            { level: "Entry", title: "Junior Embedded Engineer", salary: "$75k-$95k", years: "0-2" },
            { level: "Mid", title: "Embedded Systems Engineer", salary: "$95k-$125k", years: "2-5" },
            { level: "Senior", title: "Senior Embedded Engineer", salary: "$125k-$165k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$95k-$145k",
            entrySalary: "$75k-$95k",
            seniorSalary: "$125k-$165k",
            jobGrowth: "+18% (2024-2034)",
            totalJobs: "138,000 in US",
            remotePercentage: "35",
            topLocations: ["San Jose", "Austin", "Phoenix", "Boston", "San Diego"],
            demandLevel: "High"
        },
        realJobPostings: [
            "Qualcomm: New College Grad Embedded Software Engineer - San Diego, CA",
            "Texas Instruments: Entry Level Embedded Systems Engineer - Dallas, TX",
            "Intel: Junior Firmware Engineer - Santa Clara, CA"
        ],
        skillGaps: [
            { skill: "RTOS Programming", importance: "Critical", timeToLearn: "3-4 months" },
            { skill: "Hardware Debugging", importance: "High", timeToLearn: "2-3 months" },
            { skill: "Power Optimization", importance: "Medium", timeToLearn: "2-3 months" }
        ]
    },

    "Hardware Design Engineer": {
        category: "Hardware/Electrical Engineering",
        description: "Design and test physical hardware components and systems",
        education: {
            primary: "BS in Electrical Engineering or Computer Engineering",
            alternative: "Strong electronics background + projects",
            requiredCourses: ["EEC 180A/B (Digital Systems)", "EEC 110A/B (Electronic Circuits)", "EEC 112 (Communication Electronics)"]
        },
        technicalSkills: {
            required: ["VHDL/Verilog", "PCB design", "Circuit analysis", "CAD tools", "Testing"],
            preferred: ["FPGA", "Signal integrity", "Power analysis", "EMC compliance", "Python"],
            tools: ["Cadence", "Altium", "LTSpice", "Oscilloscope", "Signal analyzer"]
        },
        experience: {
            portfolio: "3-4 hardware design projects",
            internships: "Hardware engineering or circuit design internship",
            projects: ["PCB design project", "FPGA implementation", "Analog circuit design", "Mixed-signal system"]
        },
        certifications: {
            optional: ["IPC CID (PCB Design)", "Altium Designer Certification"],
            recommended: ["Hardware design courses"]
        },
        ucDavisResources: {
            primaryClubs: ["The Hardware Club @ UC Davis", "IEEE"],
            courses: ["EEC 180A/B", "EEC 110A/B", "EEC 172"],
            events: ["Hardware design workshops", "IEEE competitions"],
            professors: ["Prof. Bevan Baas", "Prof. Rajeevan Amirtharajah"]
        },
        careerProgression: [
            { level: "Entry", title: "Junior Hardware Engineer", salary: "$80k-$100k", years: "0-2" },
            { level: "Mid", title: "Hardware Design Engineer", salary: "$100k-$135k", years: "2-5" },
            { level: "Senior", title: "Senior Hardware Engineer", salary: "$135k-$175k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$95k-$155k",
            entrySalary: "$80k-$100k",
            seniorSalary: "$135k-$175k",
            jobGrowth: "+5% (2024-2034)",
            totalJobs: "78,000 in US",
            remotePercentage: "25",
            topLocations: ["San Jose", "Austin", "Phoenix", "Portland", "Boston"],
            demandLevel: "Moderate"
        },
        realJobPostings: [
            "AMD: New College Grad Hardware Engineer - Austin, TX",
            "Broadcom: Entry Level Hardware Design Engineer - San Jose, CA",
            "Micron: Junior Hardware Development Engineer - Boise, ID"
        ],
        skillGaps: [
            { skill: "Signal Integrity", importance: "Critical", timeToLearn: "3-4 months" },
            { skill: "Power Analysis", importance: "High", timeToLearn: "2-3 months" },
            { skill: "EMC Compliance", importance: "Medium", timeToLearn: "2-3 months" }
        ]
    },

    "FPGA Engineer": {
        category: "Hardware/Electrical Engineering",
        description: "Design and implement digital circuits on FPGAs",
        education: {
            primary: "BS in Electrical or Computer Engineering",
            alternative: "Digital design experience + FPGA projects",
            requiredCourses: ["EEC 180B (Digital Systems II)", "EEC 281 (VLSI)", "EEC 172 (Embedded Systems)"]
        },
        technicalSkills: {
            required: ["VHDL/Verilog", "FPGA tools", "Digital design", "Timing analysis", "Debugging"],
            preferred: ["SystemVerilog", "HLS", "DSP", "High-speed interfaces", "Python"],
            tools: ["Vivado", "Quartus", "ModelSim", "ChipScope", "SignalTap"]
        },
        experience: {
            portfolio: "3-4 FPGA implementation projects",
            internships: "FPGA or digital design internship",
            projects: ["Signal processing on FPGA", "High-speed interface implementation", "Custom processor design", "Hardware accelerator"]
        },
        certifications: {
            optional: ["Xilinx/Intel FPGA Certifications"],
            recommended: ["FPGA design courses"]
        },
        ucDavisResources: {
            primaryClubs: ["The Hardware Club @ UC Davis", "IEEE"],
            courses: ["EEC 180B", "EEC 281 (VLSI)", "EEC 172"],
            events: ["FPGA workshops", "Digital design competitions"],
            professors: ["Prof. Bevan Baas"]
        },
        careerProgression: [
            { level: "Entry", title: "Junior FPGA Engineer", salary: "$85k-$110k", years: "0-2" },
            { level: "Mid", title: "FPGA Design Engineer", salary: "$110k-$145k", years: "2-5" },
            { level: "Senior", title: "Senior FPGA Engineer", salary: "$145k-$185k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$105k-$165k",
            entrySalary: "$85k-$110k",
            seniorSalary: "$145k-$185k",
            jobGrowth: "+7% (2024-2034)",
            totalJobs: "32,000 in US",
            remotePercentage: "30",
            topLocations: ["San Jose", "Austin", "Colorado Springs", "Phoenix", "Boston"],
            demandLevel: "Moderate"
        },
        realJobPostings: [
            "Xilinx (AMD): New Grad FPGA Engineer - San Jose, CA",
            "Lockheed Martin: Entry Level FPGA Developer - Denver, CO",
            "Intel: Junior Programmable Solutions Engineer - San Jose, CA"
        ],
        skillGaps: [
            { skill: "High-Level Synthesis", importance: "Critical", timeToLearn: "3-4 months" },
            { skill: "Timing Closure", importance: "High", timeToLearn: "2-3 months" },
            { skill: "Hardware Verification", importance: "Medium", timeToLearn: "3-4 months" }
        ]
    },
    // COMPLETED DATA FOR UNFINISHED CAREERS

    // ============= HARDWARE/ELECTRICAL CONTINUED =============

    // COMPLETED DATA FOR UNFINISHED CAREERS

    // ============= HARDWARE/ELECTRICAL CONTINUED =============

    "Digital Design Engineer": {
        category: "Hardware/Electrical Engineering",
        description: "Design digital logic circuits and systems",
        education: {
            primary: "BS in Electrical or Computer Engineering",
            alternative: "Strong digital logic background + FPGA/ASIC projects",
            requiredCourses: ["EEC 180A/B (Digital Systems)", "EEC 281 (VLSI Design)", "EEC 116 (VLSI Design)"]
        },
        technicalSkills: {
            required: ["Verilog/VHDL", "Digital logic", "Timing analysis", "Synthesis", "Verification"],
            preferred: ["SystemVerilog", "UVM", "Scripting", "ASIC design", "Python/Perl"],
            tools: ["Synopsys Design Compiler", "Cadence", "Mentor Graphics", "ModelSim"]
        },
        experience: {
            portfolio: "3-4 digital design projects with verification",
            internships: "Digital design or ASIC/FPGA internship",
            projects: ["CPU design in Verilog", "UART communication module", "Memory controller implementation", "Digital filter design"]
        },
        certifications: {
            optional: ["Synopsys Certification", "Cadence Digital Design Badge"],
            recommended: ["SystemVerilog for Verification"]
        },
        ucDavisResources: {
            primaryClubs: ["IEEE", "Eta Kappa Nu", "The Hardware Club @ UC Davis"],
            courses: ["EEC 180A/B", "EEC 281", "EEC 116"],
            events: ["IEEE Design Competition", "VLSI Symposium"],
            professors: ["Prof. Bevan Baas", "Prof. Venkatesh Akella"]
        },
        careerProgression: [
            { level: "Entry", title: "Junior Digital Design Engineer", salary: "$85k-$110k", years: "0-2" },
            { level: "Mid", title: "Digital Design Engineer", salary: "$110k-$145k", years: "2-5" },
            { level: "Senior", title: "Senior Digital Design Engineer", salary: "$145k-$185k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$100k-$160k",
            entrySalary: "$85k-$110k",
            seniorSalary: "$145k-$185k",
            jobGrowth: "+6% (2024-2034)",
            totalJobs: "45,000 in US",
            remotePercentage: "30",
            topLocations: ["San Jose", "Austin", "Phoenix", "Portland", "Raleigh"],
            demandLevel: "Moderate"
        },
        realJobPostings: [
            "Marvell: New College Grad Digital Design Engineer - Santa Clara, CA",
            "Cadence: Entry Level Digital Design Engineer - San Jose, CA",
            "Synopsys: Junior RTL Design Engineer - Mountain View, CA"
        ],
        skillGaps: [
            { skill: "UVM Verification", importance: "Critical", timeToLearn: "3-4 months" },
            { skill: "Low Power Design", importance: "High", timeToLearn: "2-3 months" },
            { skill: "DFT", importance: "Medium", timeToLearn: "2-3 months" }
        ]
    },

    "RF Engineer": {
        category: "Hardware/Electrical Engineering",
        description: "Design and optimize radio frequency systems",
        education: {
            primary: "BS in Electrical Engineering with RF focus",
            alternative: "Physics degree + RF experience",
            requiredCourses: ["EEC 130A/B (Electromagnetics)", "EEC 132A/B (RF/Microwave)", "EEC 133 (EM Radiation)"]
        },
        technicalSkills: {
            required: ["RF circuit design", "Antenna theory", "EM simulation", "Network analyzers", "Smith charts"],
            preferred: ["5G/6G", "Radar systems", "Microwave engineering", "HFSS/ADS", "Matlab"],
            tools: ["Vector Network Analyzer", "Spectrum Analyzer", "HFSS", "ADS", "CST"]
        },
        experience: {
            portfolio: "3-4 RF design and measurement projects",
            internships: "RF engineering or telecommunications internship",
            projects: ["Antenna design and testing", "RF amplifier design", "Filter design project", "Wireless communication system"]
        },
        certifications: {
            optional: ["iNARTE EMC Certification", "NCEES PE License"],
            recommended: ["RF Engineering Certificate Programs"]
        },
        ucDavisResources: {
            primaryClubs: ["IEEE", "Ham Radio Club"],
            courses: ["EEC 130A/B", "EEC 132A/B", "EEC 133"],
            events: ["Antenna Design Workshop", "RF Symposium"],
            professors: ["Prof. Xiaoguang Liu", "Prof. William Putnam"]
        },
        careerProgression: [
            { level: "Entry", title: "Junior RF Engineer", salary: "$85k-$110k", years: "0-2" },
            { level: "Mid", title: "RF Design Engineer", salary: "$110k-$145k", years: "2-5" },
            { level: "Senior", title: "Senior RF Engineer", salary: "$145k-$190k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$105k-$165k",
            entrySalary: "$85k-$110k",
            seniorSalary: "$145k-$190k",
            jobGrowth: "+8% (2024-2034)",
            totalJobs: "38,000 in US",
            remotePercentage: "25",
            topLocations: ["San Diego", "San Jose", "Dallas", "Phoenix", "Denver"],
            demandLevel: "Moderate"
        },
        realJobPostings: [
            "Keysight Technologies: New Grad RF Engineer - Santa Rosa, CA",
            "Skyworks Solutions: Entry Level RF Design Engineer - Irvine, CA",
            "Qorvo: Junior RF Applications Engineer - San Jose, CA"
        ],
        skillGaps: [
            { skill: "5G NR Standards", importance: "Critical", timeToLearn: "3-4 months" },
            { skill: "mmWave Design", importance: "High", timeToLearn: "4-5 months" },
            { skill: "EMC Compliance", importance: "Medium", timeToLearn: "2-3 months" }
        ]
    },

    "Power Systems Engineer": {
        category: "Hardware/Electrical Engineering",
        description: "Design and maintain electrical power systems",
        education: {
            primary: "BS in Electrical Engineering",
            alternative: "BS in Energy Engineering or related",
            requiredCourses: ["EEC 157 (Power Systems)", "EEC 158 (Power Electronics)", "EEC 143 (Power System Analysis)"]
        },
        technicalSkills: {
            required: ["Power electronics", "Circuit analysis", "Control systems", "MATLAB", "Power flow analysis"],
            preferred: ["Renewable energy", "Smart grid", "Power quality", "SCADA", "ETAP/PSS/E"],
            tools: ["MATLAB/Simulink", "ETAP", "PowerWorld", "AutoCAD Electrical", "PSCAD"]
        },
        experience: {
            portfolio: "3-4 power system design and analysis projects",
            internships: "Power utility or renewable energy internship",
            projects: ["Solar inverter design", "Power distribution analysis", "Motor control system", "Grid stability simulation"]
        },
        certifications: {
            optional: ["PE License (Electrical)", "NABCEP Solar Certification"],
            recommended: ["Power Systems Analysis Certificate"]
        },
        ucDavisResources: {
            primaryClubs: ["IEEE PES", "Formula Racing at UC Davis (FRUCD)", "EcoCAR"],
            courses: ["EEC 157", "EEC 158", "EEC 143"],
            events: ["Energy Summit", "Smart Grid Workshop"],
            professors: ["Prof. Diego Rosso", "Prof. Rajeevan Amirtharajah"]
        },
        careerProgression: [
            { level: "Entry", title: "Junior Power Systems Engineer", salary: "$75k-$95k", years: "0-2" },
            { level: "Mid", title: "Power Systems Engineer", salary: "$95k-$125k", years: "2-5" },
            { level: "Senior", title: "Senior Power Systems Engineer", salary: "$125k-$165k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$95k-$150k",
            entrySalary: "$75k-$95k",
            seniorSalary: "$125k-$165k",
            jobGrowth: "+10% (2024-2034)",
            totalJobs: "82,000 in US",
            remotePercentage: "20",
            topLocations: ["Houston", "Phoenix", "Denver", "Portland", "Atlanta"],
            demandLevel: "Moderate"
        },
        realJobPostings: [
            "PG&E: New Grad Power Systems Engineer - San Francisco, CA",
            "Tesla Energy: Entry Level Power Electronics Engineer - Fremont, CA",
            "Southern California Edison: Junior Distribution Engineer - Rosemead, CA"
        ],
        skillGaps: [
            { skill: "Grid Integration", importance: "Critical", timeToLearn: "3-4 months" },
            { skill: "Battery Storage Systems", importance: "High", timeToLearn: "2-3 months" },
            { skill: "Protection Coordination", importance: "Medium", timeToLearn: "2-3 months" }
        ]
    },

    "Control Systems Engineer": {
        category: "Hardware/Electrical Engineering",
        description: "Design and implement control systems for various applications",
        education: {
            primary: "BS in Electrical or Mechanical Engineering",
            alternative: "BS in Aerospace Engineering or Robotics",
            requiredCourses: ["EEC 157 (Control Systems)", "MAE 143A (Signals & Systems)", "EEC 150A (Signals and Systems)"]
        },
        technicalSkills: {
            required: ["Control theory", "MATLAB/Simulink", "PID controllers", "System modeling", "Laplace transforms"],
            preferred: ["Robotics", "PLC programming", "State-space", "Adaptive control", "Kalman filters"],
            tools: ["MATLAB/Simulink", "LabVIEW", "PLC software", "Python", "C++"]
        },
        experience: {
            portfolio: "3-4 control system design projects",
            internships: "Controls, robotics, or automation internship",
            projects: ["Inverted pendulum control", "Temperature control system", "Motor speed controller", "Quadcopter stabilization"]
        },
        certifications: {
            optional: ["Certified Control Systems Technician (CCST)", "LabVIEW CLAD"],
            recommended: ["MATLAB Control Systems Certification"]
        },
        ucDavisResources: {
            primaryClubs: ["Davis Robotics Club", "Cyclone RoboSub", "EcoCAR", "AMAT"],
            courses: ["EEC 157", "MAE 143A", "EEC 150A"],
            events: ["Robotics Competition", "Control Systems Workshop"],
            professors: ["Prof. Soheil Ghiasi", "Prof. Zhaodan Kong"]
        },
        careerProgression: [
            { level: "Entry", title: "Junior Controls Engineer", salary: "$80k-$100k", years: "0-2" },
            { level: "Mid", title: "Control Systems Engineer", salary: "$100k-$130k", years: "2-5" },
            { level: "Senior", title: "Senior Controls Engineer", salary: "$130k-$170k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$95k-$145k",
            entrySalary: "$80k-$100k",
            seniorSalary: "$130k-$170k",
            jobGrowth: "+12% (2024-2034)",
            totalJobs: "68,000 in US",
            remotePercentage: "35",
            topLocations: ["Detroit", "Houston", "Phoenix", "San Jose", "Seattle"],
            demandLevel: "Moderate"
        },
        realJobPostings: [
            "Raytheon Technologies: Entry Level Controls Engineer - Tucson, AZ",
            "Honeywell: New Grad Control Systems Engineer - Phoenix, AZ",
            "Boeing: Junior Flight Controls Engineer - Seattle, WA"
        ],
        skillGaps: [
            { skill: "Model Predictive Control", importance: "Critical", timeToLearn: "3-4 months" },
            { skill: "Robust Control", importance: "High", timeToLearn: "3-4 months" },
            { skill: "System Identification", importance: "Medium", timeToLearn: "2-3 months" }
        ]
    },

    "Signal Processing Engineer": {
        category: "Hardware/Electrical Engineering",
        description: "Develop algorithms for processing digital signals",
        education: {
            primary: "BS in Electrical Engineering or Computer Engineering",
            alternative: "BS in Mathematics or Physics with DSP focus",
            requiredCourses: ["EEC 150A/B (Signals & Systems)", "EEC 201 (Digital Signal Processing)", "EEC 160 (Signal Analysis)"]
        },
        technicalSkills: {
            required: ["DSP algorithms", "MATLAB", "C/C++", "FFT", "Filter design", "Fourier analysis"],
            preferred: ["FPGA", "Audio/Video processing", "Communications", "Real-time systems", "Python"],
            tools: ["MATLAB", "Python/NumPy", "GNU Radio", "LabVIEW", "Xilinx System Generator"]
        },
        experience: {
            portfolio: "3-4 signal processing implementation projects",
            internships: "DSP, communications, or audio/video processing internship",
            projects: ["Audio equalizer design", "Image compression algorithm", "Adaptive filter implementation", "Software-defined radio"]
        },
        certifications: {
            optional: ["MathWorks Signal Processing Certification"],
            recommended: ["DSP courses on Coursera/edX"]
        },
        ucDavisResources: {
            primaryClubs: ["IEEE", "The Hardware Club @ UC Davis", "Ham Radio Club"],
            courses: ["EEC 150A/B", "EEC 201", "EEC 160"],
            events: ["DSP Workshop", "Communications Symposium"],
            professors: ["Prof. Zhi Ding", "Prof. Bernard Levy"]
        },
        careerProgression: [
            { level: "Entry", title: "Junior DSP Engineer", salary: "$85k-$110k", years: "0-2" },
            { level: "Mid", title: "Signal Processing Engineer", salary: "$110k-$145k", years: "2-5" },
            { level: "Senior", title: "Senior DSP Engineer", salary: "$145k-$185k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$100k-$155k",
            entrySalary: "$85k-$110k",
            seniorSalary: "$145k-$185k",
            jobGrowth: "+10% (2024-2034)",
            totalJobs: "42,000 in US",
            remotePercentage: "40",
            topLocations: ["San Diego", "Boston", "Austin", "San Jose", "Denver"],
            demandLevel: "Moderate"
        },
        realJobPostings: [
            "Qualcomm: New Grad DSP Engineer - San Diego, CA",
            "Dolby Laboratories: Junior Audio Signal Processing Engineer - San Francisco, CA",
            "L3Harris: Entry Level Signal Processing Engineer - Melbourne, FL"
        ],
        skillGaps: [
            { skill: "Adaptive Algorithms", importance: "Critical", timeToLearn: "3-4 months" },
            { skill: "Machine Learning for DSP", importance: "High", timeToLearn: "3-4 months" },
            { skill: "Real-time Processing", importance: "Medium", timeToLearn: "2-3 months" }
        ]
    },

    "Firmware Engineer": {
        category: "Hardware/Electrical Engineering",
        description: "Develop low-level software for hardware devices",
        education: {
            primary: "BS in Computer Engineering or Electrical Engineering",
            alternative: "BS in Computer Science with embedded focus",
            requiredCourses: ["EEC 172 (Embedded Systems)", "ECS 150 (Operating Systems)", "EEC 180A/B (Digital Systems)"]
        },
        technicalSkills: {
            required: ["C/C++", "Assembly", "RTOS", "Hardware interfaces", "Debugging", "Bare-metal programming"],
            preferred: ["Bootloaders", "Device drivers", "Power management", "Security", "Python"],
            tools: ["JTAG debuggers", "Oscilloscope", "Logic analyzer", "Git", "GCC toolchain"]
        },
        experience: {
            portfolio: "3-4 firmware development projects",
            internships: "Firmware, embedded systems, or hardware internship",
            projects: ["Bootloader implementation", "Device driver development", "RTOS porting project", "Low-power firmware optimization"]
        },
        certifications: {
            optional: ["Certified Embedded Systems Engineer", "ARM Accredited Engineer"],
            recommended: ["Real-Time Operating Systems certification"]
        },
        ucDavisResources: {
            primaryClubs: ["The Hardware Club @ UC Davis", "Davis Robotics Club", "IEEE"],
            courses: ["EEC 172", "ECS 150", "EEC 180A/B"],
            events: ["Embedded Systems Workshop", "Hardware Hackathon"],
            professors: ["Prof. Houman Homayoun", "Prof. Venkatesh Akella"]
        },
        careerProgression: [
            { level: "Entry", title: "Junior Firmware Engineer", salary: "$80k-$105k", years: "0-2" },
            { level: "Mid", title: "Firmware Engineer", salary: "$105k-$135k", years: "2-5" },
            { level: "Senior", title: "Senior Firmware Engineer", salary: "$135k-$175k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$95k-$150k",
            entrySalary: "$80k-$105k",
            seniorSalary: "$135k-$175k",
            jobGrowth: "+15% (2024-2034)",
            totalJobs: "92,000 in US",
            remotePercentage: "40",
            topLocations: ["San Jose", "Austin", "San Diego", "Boston", "Seattle"],
            demandLevel: "High"
        },
        realJobPostings: [
            "Apple: Firmware Engineer - New College Grad - Cupertino, CA",
            "Western Digital: Entry Level Firmware Developer - San Jose, CA",
            "Nvidia: Junior Firmware Engineer - Santa Clara, CA"
        ],
        skillGaps: [
            { skill: "Secure Boot", importance: "Critical", timeToLearn: "3-4 months" },
            { skill: "Power Management", importance: "High", timeToLearn: "2-3 months" },
            { skill: "Hardware Bring-up", importance: "Medium", timeToLearn: "3-4 months" }
        ]
    },

    "PCB Design Engineer": {
        category: "Hardware/Electrical Engineering",
        description: "Design printed circuit boards for electronic devices",
        education: {
            primary: "BS in Electrical Engineering",
            alternative: "BS in Electronics Engineering Technology",
            requiredCourses: ["EEC 110A/B (Electronic Circuits)", "EEC 172 (Embedded Systems)", "EEC 118 (Digital IC Design)"]
        },
        technicalSkills: {
            required: ["PCB CAD tools", "Circuit design", "Signal integrity", "DFM", "Testing", "Schematic capture"],
            preferred: ["High-speed design", "RF layout", "Thermal management", "EMC", "3D modeling"],
            tools: ["Altium Designer", "KiCAD", "Cadence Allegro", "LTSpice", "SolidWorks"]
        },
        experience: {
            portfolio: "3-4 PCB designs from schematic to fabrication",
            internships: "Hardware design or PCB layout internship",
            projects: ["4-layer PCB design", "High-speed digital board", "Mixed-signal PCB", "RF circuit board design"]
        },
        certifications: {
            optional: ["IPC CID (Certified Interconnect Designer)", "IPC-A-610 Certification"],
            recommended: ["Altium Designer Associate Certification"]
        },
        ucDavisResources: {
            primaryClubs: ["The Hardware Club @ UC Davis", "IEEE", "Formula Racing at UC Davis"],
            courses: ["EEC 110A/B", "EEC 172", "EEC 118"],
            events: ["PCB Design Workshop", "Hardware Design Competition"],
            professors: ["Prof. Andre Knoesen", "Prof. Houman Homayoun"]
        },
        careerProgression: [
            { level: "Entry", title: "Junior PCB Designer", salary: "$70k-$90k", years: "0-2" },
            { level: "Mid", title: "PCB Design Engineer", salary: "$90k-$120k", years: "2-5" },
            { level: "Senior", title: "Senior PCB Design Engineer", salary: "$120k-$155k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$85k-$135k",
            entrySalary: "$70k-$90k",
            seniorSalary: "$120k-$155k",
            jobGrowth: "+6% (2024-2034)",
            totalJobs: "48,000 in US",
            remotePercentage: "35",
            topLocations: ["San Jose", "Austin", "Phoenix", "Portland", "San Diego"],
            demandLevel: "Moderate"
        },
        realJobPostings: [
            "Flex Ltd: Entry Level PCB Designer - San Jose, CA",
            "Jabil: Junior PCB Design Engineer - St. Petersburg, FL",
            "Sanmina: New Grad Hardware Layout Engineer - Huntsville, AL"
        ],
        skillGaps: [
            { skill: "High-Speed Design", importance: "Critical", timeToLearn: "3-4 months" },
            { skill: "EMC Compliance", importance: "High", timeToLearn: "2-3 months" },
            { skill: "Flex/Rigid-Flex Design", importance: "Medium", timeToLearn: "2-3 months" }
        ]
    },

    "Hardware Security Engineer": {
        category: "Hardware/Electrical Engineering",
        description: "Secure hardware systems against threats",
        education: {
            primary: "BS in Computer/Electrical Engineering",
            alternative: "BS in Cybersecurity with hardware focus",
            requiredCourses: ["ECS 153 (Computer Security)", "ECS 155 (Cryptography)", "EEC 172 (Embedded Systems)"]
        },
        technicalSkills: {
            required: ["Hardware security", "Cryptography", "Side-channel attacks", "Secure boot", "Threat modeling"],
            preferred: ["Reverse engineering", "Fault injection", "TPM/HSM", "Secure coding", "FPGA security"],
            tools: ["ChipWhisperer", "IDA Pro", "JTAG/SWD debuggers", "Oscilloscope", "Python"]
        },
        experience: {
            portfolio: "3-4 hardware security projects or vulnerability assessments",
            internships: "Security research or hardware security internship",
            projects: ["Side-channel attack implementation", "Secure boot design", "Hardware vulnerability assessment", "Cryptographic accelerator"]
        },
        certifications: {
            optional: ["Certified Hardware Security Professional", "GIAC Reverse Engineering"],
            recommended: ["Hardware Security Training by NCC Group"]
        },
        ucDavisResources: {
            primaryClubs: ["Cyber Security Club at UC Davis", "IEEE", "The Hardware Club"],
            courses: ["ECS 153", "ECS 155", "EEC 172"],
            events: ["Security CTF competitions", "Hardware Security Workshop"],
            professors: ["Prof. Matthew Bishop", "Prof. Houman Homayoun"]
        },
        careerProgression: [
            { level: "Entry", title: "Junior Hardware Security Engineer", salary: "$95k-$120k", years: "0-2" },
            { level: "Mid", title: "Hardware Security Engineer", salary: "$120k-$155k", years: "2-5" },
            { level: "Senior", title: "Senior Hardware Security Engineer", salary: "$155k-$200k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$110k-$170k",
            entrySalary: "$95k-$120k",
            seniorSalary: "$155k-$200k",
            jobGrowth: "+20% (2024-2034)",
            totalJobs: "28,000 in US",
            remotePercentage: "45",
            topLocations: ["San Jose", "Austin", "Boston", "Reston", "San Diego"],
            demandLevel: "High"
        },
        realJobPostings: [
            "Intel: New Grad Hardware Security Engineer - Santa Clara, CA",
            "AMD: Entry Level Security Architect - Austin, TX",
            "Microsoft: Junior Hardware Security Engineer - Redmond, WA"
        ],
        skillGaps: [
            { skill: "Fault Injection Attacks", importance: "Critical", timeToLearn: "3-4 months" },
            { skill: "Secure IC Design", importance: "High", timeToLearn: "4-5 months" },
            { skill: "Post-Quantum Crypto", importance: "Medium", timeToLearn: "3-4 months" }
        ]
    },

    // ============= AEROSPACE CONTINUED =============

    "Aerospace Software Engineer": {
        category: "Aerospace Engineering",
        description: "Develop software for spacecraft, satellites, and aviation systems",
        education: {
            primary: "BS in Aerospace Engineering, Computer Science, or Computer Engineering",
            alternative: "BS in Physics or Math with programming experience",
            requiredCourses: ["MAE 143B (Spacecraft Dynamics)", "ECS 150 (Operating Systems)", "EEC 172 (Embedded Systems)"]
        },
        technicalSkills: {
            required: ["C/C++", "Real-time systems", "Embedded programming", "MATLAB", "Git", "Linux"],
            preferred: ["DO-178C", "Model-based design", "Flight dynamics", "GNC algorithms", "Python"],
            tools: ["Simulink", "STK", "GMAT", "ROS", "Jenkins"]
        },
        experience: {
            portfolio: "3-4 aerospace software projects",
            internships: "Aerospace, defense, or space technology internship",
            projects: ["Satellite tracking software", "Flight simulator", "Orbit determination tool", "Telemetry processing system"]
        },
        certifications: {
            optional: ["DO-178C Training Certificate", "NASA Software Engineering Certificate"],
            recommended: ["Aerospace software standards courses"]
        },
        ucDavisResources: {
            primaryClubs: ["Aggie Space Initiative", "Space and Satellite Systems Club", "AIAA"],
            courses: ["MAE 143B", "ECS 150", "EEC 172"],
            events: ["CubeSat Workshop", "Space Apps Challenge"],
            professors: ["Prof. Nesrin Sarigul-Klijn", "Prof. Stephen Robinson"]
        },
        careerProgression: [
            { level: "Entry", title: "Junior Aerospace Software Engineer", salary: "$85k-$110k", years: "0-2" },
            { level: "Mid", title: "Aerospace Software Engineer", salary: "$110k-$145k", years: "2-5" },
            { level: "Senior", title: "Senior Aerospace Software Engineer", salary: "$145k-$185k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$100k-$160k",
            entrySalary: "$85k-$110k",
            seniorSalary: "$145k-$185k",
            jobGrowth: "+8% (2024-2034)",
            totalJobs: "52,000 in US",
            remotePercentage: "30",
            topLocations: ["Los Angeles", "Seattle", "Houston", "Denver", "Huntsville"],
            demandLevel: "Moderate"
        },
        realJobPostings: [
            "SpaceX: Software Engineer (Starship) - Hawthorne, CA",
            "Blue Origin: New Grad Flight Software Engineer - Kent, WA",
            "Northrop Grumman: Entry Level Embedded Software Engineer - Redondo Beach, CA"
        ],
        skillGaps: [
            { skill: "Safety-Critical Software", importance: "Critical", timeToLearn: "3-4 months" },
            { skill: "GNC Algorithms", importance: "High", timeToLearn: "4-5 months" },
            { skill: "Mission Planning", importance: "Medium", timeToLearn: "2-3 months" }
        ]
    },

    "Systems Integration Engineer": {
        category: "Aerospace Engineering",
        description: "Integrate complex aerospace systems and subsystems",
        education: {
            primary: "BS in Aerospace or Systems Engineering",
            alternative: "BS in Mechanical or Electrical Engineering",
            requiredCourses: ["MAE 143A/B (Aerospace Systems)", "ENG 6 (Engineering Problem Solving)", "MAE 189 (Systems Engineering)"]
        },
        technicalSkills: {
            required: ["Systems engineering", "Integration testing", "Requirements management", "DOORS", "Technical documentation"],
            preferred: ["Model-based systems engineering", "V&V", "Risk management", "MBSE tools", "Configuration management"],
            tools: ["DOORS", "Jama", "MATLAB/Simulink", "Cameo Systems Modeler", "Windchill"]
        },
        experience: {
            portfolio: "3-4 system integration or requirements management projects",
            internships: "Systems engineering or aerospace integration internship",
            projects: ["Requirements traceability matrix", "System interface documentation", "Integration test plan", "Risk assessment project"]
        },
        certifications: {
            optional: ["INCOSE CSEP", "PMI-ACP"],
            recommended: ["Systems Engineering Fundamentals"]
        },
        ucDavisResources: {
            primaryClubs: ["Aggie Space Initiative", "SSS Club", "EcoCAR", "Hyperloop at UC Davis"],
            courses: ["MAE 143A/B", "ENG 6", "MAE 189"],
            events: ["Systems Engineering Symposium", "Design Reviews"],
            professors: ["Prof. Stephen Robinson", "Prof. Case van Dam"]
        },
        careerProgression: [
            { level: "Entry", title: "Junior Systems Engineer", salary: "$80k-$105k", years: "0-2" },
            { level: "Mid", title: "Systems Integration Engineer", salary: "$105k-$135k", years: "2-5" },
            { level: "Senior", title: "Senior Systems Engineer", salary: "$135k-$175k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$95k-$150k",
            entrySalary: "$80k-$105k",
            seniorSalary: "$135k-$175k",
            jobGrowth: "+10% (2024-2034)",
            totalJobs: "68,000 in US",
            remotePercentage: "25",
            topLocations: ["Los Angeles", "Washington DC", "Houston", "Phoenix", "Denver"],
            demandLevel: "Moderate"
        },
        realJobPostings: [
            "Boeing: Entry Level Systems Engineer - Huntington Beach, CA",
            "Lockheed Martin: New Grad Systems Integration Engineer - Denver, CO",
            "Raytheon: Junior Systems Engineer - Tucson, AZ"
        ],
        skillGaps: [
            { skill: "MBSE Tools", importance: "Critical", timeToLearn: "3-4 months" },
            { skill: "Verification Methods", importance: "High", timeToLearn: "2-3 months" },
            { skill: "Interface Control", importance: "Medium", timeToLearn: "2-3 months" }
        ]
    },

    "Avionics Engineer": {
        category: "Aerospace Engineering",
        description: "Design and maintain aircraft electronic systems",
        education: {
            primary: "BS in Electrical or Aerospace Engineering",
            alternative: "BS in Computer Engineering with aerospace focus",
            requiredCourses: ["EEC 172 (Embedded Systems)", "MAE 143B (Aerospace Systems)", "EEC 157 (Control Systems)"]
        },
        technicalSkills: {
            required: ["Avionics systems", "DO-254/DO-178", "Embedded systems", "Testing", "ARINC protocols"],
            preferred: ["Flight control systems", "Navigation", "Communication systems", "MIL-STD", "CAN bus"],
            tools: ["LabVIEW", "DOORS", "Vector CANalyzer", "MATLAB", "Oscilloscope"]
        },
        experience: {
            portfolio: "3-4 avionics or embedded aerospace projects",
            internships: "Avionics, aerospace, or defense electronics internship",
            projects: ["Flight data acquisition system", "Avionics test bench", "Communication protocol implementation", "Navigation system simulation"]
        },
        certifications: {
            optional: ["FAA Avionics Certification", "DO-178C/DO-254 Training"],
            recommended: ["Avionics Systems courses"]
        },
        ucDavisResources: {
            primaryClubs: ["Aggie Space Initiative", "SSS Club", "APRL", "AIAA"],
            courses: ["EEC 172", "MAE 143B", "EEC 157"],
            events: ["Aerospace Electronics Workshop", "Aviation Safety Seminar"],
            professors: ["Prof. Ron Hess", "Prof. Nesrin Sarigul-Klijn"]
        },
        careerProgression: [
            { level: "Entry", title: "Junior Avionics Engineer", salary: "$80k-$105k", years: "0-2" },
            { level: "Mid", title: "Avionics Engineer", salary: "$105k-$135k", years: "2-5" },
            { level: "Senior", title: "Senior Avionics Engineer", salary: "$135k-$170k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$95k-$145k",
            entrySalary: "$80k-$105k",
            seniorSalary: "$135k-$170k",
            jobGrowth: "+7% (2024-2034)",
            totalJobs: "45,000 in US",
            remotePercentage: "20",
            topLocations: ["Seattle", "Los Angeles", "Wichita", "Fort Worth", "Phoenix"],
            demandLevel: "Moderate"
        },
        realJobPostings: [
            "Collins Aerospace: New Grad Avionics Engineer - Cedar Rapids, IA",
            "Garmin: Entry Level Aviation Software Engineer - Olathe, KS",
            "Honeywell Aerospace: Junior Avionics Systems Engineer - Phoenix, AZ"
        ],
        skillGaps: [
            { skill: "DO-178C Compliance", importance: "Critical", timeToLearn: "3-4 months" },
            { skill: "ARINC Protocols", importance: "High", timeToLearn: "2-3 months" },
            { skill: "Safety Analysis", importance: "Medium", timeToLearn: "2-3 months" }
        ]
    },

    "Autonomous Systems Engineer (Drones/UAV)": {
        category: "Aerospace Engineering",
        description: "Develop autonomous systems for unmanned aerial vehicles",
        education: {
            primary: "BS in Aerospace, Robotics, or Computer Engineering",
            alternative: "BS in Computer Science with robotics focus",
            requiredCourses: ["ECS 174 (Computer Vision)", "EEC 157 (Control Systems)", "MAE 143A (Flight Mechanics)"]
        },
        technicalSkills: {
            required: ["ROS", "Computer vision", "Path planning", "Control systems", "C++/Python", "Linux"],
            preferred: ["SLAM", "Sensor fusion", "PX4/ArduPilot", "Machine learning", "Gazebo"],
            tools: ["ROS/ROS2", "MATLAB", "QGroundControl", "Mission Planner", "Gazebo"]
        },
        experience: {
            portfolio: "3-4 autonomous UAV or robotics projects",
            internships: "Drone technology, robotics, or autonomous systems internship",
            projects: ["Autonomous drone navigation", "Object detection for UAV", "Swarm coordination system", "Indoor SLAM implementation"]
        },
        certifications: {
            optional: ["FAA Part 107 Remote Pilot", "ROS Developer Certification"],
            recommended: ["Udacity Flying Car Nanodegree"]
        },
        ucDavisResources: {
            primaryClubs: ["Cyclone RoboSub", "Aggie Space Initiative", "SSS Club", "Davis Robotics Club"],
            courses: ["ECS 174", "EEC 157", "MAE 143A"],
            events: ["UAV Competition", "Robotics Showcase"],
            professors: ["Prof. Zhaodan Kong", "Prof. YangQuan Chen"]
        },
        careerProgression: [
            { level: "Entry", title: "Junior Autonomy Engineer", salary: "$90k-$115k", years: "0-2" },
            { level: "Mid", title: "UAV Autonomy Engineer", salary: "$115k-$150k", years: "2-5" },
            { level: "Senior", title: "Senior Autonomous Systems Engineer", salary: "$150k-$195k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$105k-$165k",
            entrySalary: "$90k-$115k",
            seniorSalary: "$150k-$195k",
            jobGrowth: "+25% (2024-2034)",
            totalJobs: "32,000 in US",
            remotePercentage: "50",
            topLocations: ["San Francisco", "Pittsburgh", "San Diego", "Austin", "Denver"],
            demandLevel: "High"
        },
        realJobPostings: [
            "Zipline: Autonomy Engineer - New Grad - South San Francisco, CA",
            "Skydio: Junior Autonomy Software Engineer - Redwood City, CA",
            "Wing (Alphabet): Entry Level UAV Software Engineer - Palo Alto, CA"
        ],
        skillGaps: [
            { skill: "SLAM Algorithms", importance: "Critical", timeToLearn: "4-5 months" },
            { skill: "Multi-Agent Systems", importance: "High", timeToLearn: "3-4 months" },
            { skill: "FAA Regulations", importance: "Medium", timeToLearn: "1-2 months" }
        ]
    },

    // ============= BIOMEDICAL CONTINUED =============

    "Medical Device Software Engineer": {
        category: "Biomedical Engineering",
        description: "Develop software for medical devices and healthcare systems",
        education: {
            primary: "BS in Biomedical Engineering, CS, or Electrical Engineering",
            alternative: "BS in any engineering with medical device experience",
            requiredCourses: ["BIM 106 (Medical Device Engineering)", "ECS 153 (Computer Security)", "EEC 172 (Embedded Systems)"]
        },
        technicalSkills: {
            required: ["C/C++", "Python", "Medical standards (FDA)", "Real-time systems", "Testing", "Documentation"],
            preferred: ["IEC 62304", "ISO 13485", "DICOM", "HL7", "Risk management"],
            tools: ["Git", "JIRA", "Static analysis tools", "Unit testing frameworks", "MATLAB"]
        },
        experience: {
            portfolio: "3-4 medical device or healthcare software projects",
            internships: "Medical device company or healthcare technology internship",
            projects: ["Patient monitoring system", "Medical data visualization tool", "Device communication interface", "Safety-critical control system"]
        },
        certifications: {
            optional: ["Regulatory Affairs Certification", "IEC 62304 Training"],
            recommended: ["FDA Software Validation course"]
        },
        ucDavisResources: {
            primaryClubs: ["Biomedical Engineering Society (BMES)", "Neurotech @ UCDavis", "Design for America"],
            courses: ["BIM 106", "ECS 153", "EEC 172"],
            events: ["Medical Device Symposium", "FDA Workshop"],
            professors: ["Prof. Tingrui Pan", "Prof. Erkin Seker"]
        },
        careerProgression: [
            { level: "Entry", title: "Junior Medical Device Software Engineer", salary: "$80k-$105k", years: "0-2" },
            { level: "Mid", title: "Medical Device Software Engineer", salary: "$105k-$140k", years: "2-5" },
            { level: "Senior", title: "Senior Medical Software Engineer", salary: "$140k-$180k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$95k-$155k",
            entrySalary: "$80k-$105k",
            seniorSalary: "$140k-$180k",
            jobGrowth: "+17% (2024-2034)",
            totalJobs: "78,000 in US",
            remotePercentage: "45",
            topLocations: ["San Francisco Bay Area", "Boston", "Minneapolis", "San Diego", "Remote"],
            demandLevel: "High"
        },
        realJobPostings: [
            "Medtronic: New College Grad Software Engineer - Minneapolis, MN",
            "Abbott: Entry Level Medical Device Software Developer - Sunnyvale, CA",
            "Boston Scientific: Junior Embedded Software Engineer - Marlborough, MA"
        ],
        skillGaps: [
            { skill: "FDA Compliance", importance: "Critical", timeToLearn: "3-4 months" },
            { skill: "Risk Management", importance: "High", timeToLearn: "2-3 months" },
            { skill: "V&V Testing", importance: "Medium", timeToLearn: "2-3 months" }
        ]
    },

    "Clinical Systems Engineer": {
        category: "Biomedical Engineering",
        description: "Implement and maintain clinical information systems",
        education: {
            primary: "BS in Biomedical Engineering or Health Informatics",
            alternative: "BS in Computer Science with healthcare focus",
            requiredCourses: ["BIM 106", "ECS 165A (Database Systems)", "STA 135 (Multivariate Data Analysis)"]
        },
        technicalSkills: {
            required: ["HL7/FHIR", "SQL", "Clinical workflows", "EMR/EHR systems", "Data integration"],
            preferred: ["HIPAA compliance", "Interoperability", "Data analytics", "Epic/Cerner", "Python"],
            tools: ["Epic", "Cerner", "SQL Server", "Tableau", "Mirth Connect"]
        },
        experience: {
            portfolio: "3-4 healthcare IT or clinical systems projects",
            internships: "Hospital IT, health informatics, or clinical systems internship",
            projects: ["HL7 interface implementation", "Clinical dashboard", "EHR data extraction tool", "Patient workflow optimization"]
        },
        certifications: {
            optional: ["Epic Certification", "Cerner Certification", "CHPS (Certified in Healthcare Privacy)"],
            recommended: ["HL7 Fundamentals"]
        },
        ucDavisResources: {
            primaryClubs: ["Biomedical Engineering Society", "Pre-Health Organizations"],
            courses: ["BIM 106", "ECS 165A", "PHR 180 (Healthcare Systems)"],
            events: ["Health Tech Symposium", "Clinical Informatics Workshop"],
            professors: ["Prof. David Rocke", "Prof. Chen-Nee Chuah"]
        },
        careerProgression: [
            { level: "Entry", title: "Junior Clinical Systems Analyst", salary: "$70k-$90k", years: "0-2" },
            { level: "Mid", title: "Clinical Systems Engineer", salary: "$90k-$120k", years: "2-5" },
            { level: "Senior", title: "Senior Clinical Systems Engineer", salary: "$120k-$155k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$85k-$135k",
            entrySalary: "$70k-$90k",
            seniorSalary: "$120k-$155k",
            jobGrowth: "+15% (2024-2034)",
            totalJobs: "95,000 in US",
            remotePercentage: "60",
            topLocations: ["Boston", "Chicago", "Dallas", "San Francisco", "Remote"],
            demandLevel: "High"
        },
        realJobPostings: [
            "Epic Systems: Technical Solutions Engineer - Madison, WI",
            "Cerner (Oracle Health): New Grad Systems Engineer - Kansas City, MO",
            "Kaiser Permanente: Junior Clinical Systems Analyst - Oakland, CA"
        ],
        skillGaps: [
            { skill: "Healthcare Workflows", importance: "Critical", timeToLearn: "3-4 months" },
            { skill: "Interoperability Standards", importance: "High", timeToLearn: "2-3 months" },
            { skill: "HIPAA Compliance", importance: "Medium", timeToLearn: "1-2 months" }
        ]
    },

    // Continuing with remaining careers...
    "Bioinformatics Engineer": {
        category: "Biomedical Engineering",
        description: "Analyze biological data using computational methods",
        education: {
            primary: "BS in Bioinformatics, Computational Biology, or CS with Bio minor",
            alternative: "BS in Biology with strong programming skills",
            requiredCourses: ["BIS 180L (Genomics)", "STA 141 (Statistical Computing)", "ECS 124 (Theory of Computation)"]
        },
        technicalSkills: {
            required: ["Python/R", "SQL", "Linux", "Statistics", "Genomics tools", "Git"],
            preferred: ["Machine learning", "Cloud computing", "Docker", "Workflow managers", "HPC"],
            tools: ["Bioconductor", "Galaxy", "Nextflow", "AWS/GCP", "Jupyter"]
        },
        experience: {
            portfolio: "3-4 bioinformatics analysis projects",
            internships: "Biotech, pharmaceutical, or research lab internship",
            projects: ["Genomic data pipeline", "RNA-seq analysis tool", "Variant calling pipeline", "Drug-target interaction predictor"]
        },
        certifications: {
            optional: ["Google Cloud Professional Data Engineer", "AWS Certified Solutions Architect"],
            recommended: ["Coursera Bioinformatics Specialization"]
        },
        ucDavisResources: {
            primaryClubs: ["Biomedical Engineering Society", "Davis Data Science Club", "CodeLab"],
            courses: ["BIS 180L", "STA 141", "ECS 124"],
            events: ["Bioinformatics Symposium", "Genomics Workshop"],
            professors: ["Prof. Ian Korf", "Prof. David Begun"]
        },
        careerProgression: [
            { level: "Entry", title: "Junior Bioinformatics Analyst", salary: "$75k-$95k", years: "0-2" },
            { level: "Mid", title: "Bioinformatics Engineer", salary: "$95k-$125k", years: "2-5" },
            { level: "Senior", title: "Senior Bioinformatics Engineer", salary: "$125k-$165k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$85k-$135k",
            entrySalary: "$75k-$95k",
            seniorSalary: "$125k-$165k",
            jobGrowth: "+31% (2024-2034)",
            totalJobs: "42,000 in US",
            remotePercentage: "70",
            topLocations: ["San Francisco Bay Area", "Boston", "San Diego", "Seattle", "Remote"],
            demandLevel: "High"
        },
        realJobPostings: [
            "Illumina: New Grad Bioinformatics Engineer - San Diego, CA",
            "23andMe: Junior Computational Biologist - Sunnyvale, CA",
            "Genentech: Entry Level Bioinformatics Analyst - South San Francisco, CA"
        ],
        skillGaps: [
            { skill: "NGS Data Analysis", importance: "Critical", timeToLearn: "3-4 months" },
            { skill: "Cloud Computing", importance: "High", timeToLearn: "2-3 months" },
            { skill: "Statistical Genomics", importance: "Medium", timeToLearn: "3-4 months" }
        ]
    },

    "Healthcare Data Analyst": {
        category: "Biomedical Engineering",
        description: "Analyze healthcare data to improve patient outcomes",
        education: {
            primary: "BS in Health Informatics, Statistics, or related",
            alternative: "BS in any field with healthcare analytics experience",
            requiredCourses: ["STA 141A (Statistical Computing)", "PHR 180 (Healthcare Systems)", "STA 135 (Multivariate Analysis)"]
        },
        technicalSkills: {
            required: ["SQL", "Excel", "Healthcare analytics", "HIPAA", "Reporting", "Data visualization"],
            preferred: ["Python/R", "Tableau", "Clinical knowledge", "Machine learning", "SAS"],
            tools: ["Tableau", "Power BI", "SQL Server", "Excel", "R/Python"]
        },
        experience: {
            portfolio: "3-4 healthcare data analysis projects",
            internships: "Hospital, health insurance, or healthcare analytics internship",
            projects: ["Patient outcome analysis", "Healthcare cost prediction model", "Clinical quality dashboard", "Population health report"]
        },
        certifications: {
            optional: ["Certified Health Data Analyst (CHDA)", "Healthcare Analytics Certificate"],
            recommended: ["HIPAA Training Certificate"]
        },
        ucDavisResources: {
            primaryClubs: ["BMES", "Davis Data Driven Change", "Public Health Brigade"],
            courses: ["STA 141A", "PHR 180", "STA 135"],
            events: ["Health Analytics Workshop", "Population Health Symposium"],
            professors: ["Prof. Nick Anderson", "Prof. Miriam Nuño"]
        },
        careerProgression: [
            { level: "Entry", title: "Junior Healthcare Data Analyst", salary: "$60k-$80k", years: "0-2" },
            { level: "Mid", title: "Healthcare Data Analyst", salary: "$80k-$105k", years: "2-5" },
            { level: "Senior", title: "Senior Healthcare Data Analyst", salary: "$105k-$135k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$70k-$110k",
            entrySalary: "$60k-$80k",
            seniorSalary: "$105k-$135k",
            jobGrowth: "+20% (2024-2034)",
            totalJobs: "125,000 in US",
            remotePercentage: "65",
            topLocations: ["Chicago", "Dallas", "Phoenix", "Atlanta", "Remote"],
            demandLevel: "High"
        },
        realJobPostings: [
            "UnitedHealth Group: Entry Level Healthcare Data Analyst - Minneapolis, MN",
            "Anthem: Junior Data Analyst - Indianapolis, IN",
            "CVS Health: New Grad Healthcare Analytics Associate - Woonsocket, RI"
        ],
        skillGaps: [
            { skill: "Healthcare Metrics", importance: "Critical", timeToLearn: "2-3 months" },
            { skill: "Claims Data Analysis", importance: "High", timeToLearn: "2-3 months" },
            { skill: "Population Health", importance: "Medium", timeToLearn: "2-3 months" }
        ]
    },

    "Medical Imaging Software Developer": {
        category: "Biomedical Engineering",
        description: "Develop software for medical imaging systems",
        education: {
            primary: "BS in Biomedical Engineering or Computer Science",
            alternative: "BS in Physics or Electrical Engineering with imaging focus",
            requiredCourses: ["ECS 174 (Computer Vision)", "BIM 106 (Medical Device Engineering)", "ECS 175 (Computer Graphics)"]
        },
        technicalSkills: {
            required: ["C++", "Image processing", "DICOM", "Computer vision", "Python", "3D visualization"],
            preferred: ["GPU programming", "Machine learning", "3D reconstruction", "ITK/VTK", "CUDA"],
            tools: ["ITK/VTK", "3D Slicer", "OpenCV", "PyTorch", "MATLAB"]
        },
        experience: {
            portfolio: "3-4 medical imaging or visualization projects",
            internships: "Medical imaging company or research lab internship",
            projects: ["DICOM viewer application", "Image segmentation tool", "3D reconstruction from MRI/CT", "AI-based diagnosis assistant"]
        },
        certifications: {
            optional: ["NVIDIA Deep Learning for Medical Imaging"],
            recommended: ["Medical Imaging courses on Coursera"]
        },
        ucDavisResources: {
            primaryClubs: ["BMES", "Neurotech @ UCDavis", "AI Student Collective"],
            courses: ["ECS 174", "BIM 106", "ECS 175"],
            events: ["Medical Imaging Workshop", "Computer Vision Symposium"],
            professors: ["Prof. Jinyi Qi", "Prof. Simon Cherry"]
        },
        careerProgression: [
            { level: "Entry", title: "Junior Medical Imaging Developer", salary: "$85k-$110k", years: "0-2" },
            { level: "Mid", title: "Medical Imaging Software Engineer", salary: "$110k-$145k", years: "2-5" },
            { level: "Senior", title: "Senior Medical Imaging Engineer", salary: "$145k-$185k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$100k-$160k",
            entrySalary: "$85k-$110k",
            seniorSalary: "$145k-$185k",
            jobGrowth: "+18% (2024-2034)",
            totalJobs: "28,000 in US",
            remotePercentage: "50",
            topLocations: ["Boston", "San Francisco Bay Area", "Cleveland", "Chicago", "Remote"],
            demandLevel: "High"
        },
        realJobPostings: [
            "GE Healthcare: New Grad Software Engineer - Medical Imaging - Waukesha, WI",
            "Siemens Healthineers: Junior Imaging Software Developer - Princeton, NJ",
            "Canon Medical: Entry Level Software Engineer - Tustin, CA"
        ],
        skillGaps: [
            { skill: "GPU Acceleration", importance: "Critical", timeToLearn: "3-4 months" },
            { skill: "Deep Learning for Imaging", importance: "High", timeToLearn: "4-5 months" },
            { skill: "DICOM Standards", importance: "Medium", timeToLearn: "2-3 months" }
        ]
    },

    // ============= INDUSTRIAL/MANUFACTURING CONTINUED =============

    "Industrial Software Engineer": {
        category: "Industrial Engineering",
        description: "Develop software for industrial automation and manufacturing",
        education: {
            primary: "BS in Computer Science or Industrial Engineering",
            alternative: "BS in any engineering with programming experience",
            requiredCourses: ["ENG 6 (Engineering Problem Solving)", "ECS 150 (Operating Systems)", "ECS 152B (Computer Networks)"]
        },
        technicalSkills: {
            required: ["PLC programming", "SCADA", "HMI development", "Python", "SQL", "Industrial protocols"],
            preferred: ["MES systems", "OPC UA", "Industrial IoT", "Robotics", "C++"],
            tools: ["Rockwell Studio 5000", "Siemens TIA Portal", "Ignition SCADA", "Node-RED", "Git"]
        },
        experience: {
            portfolio: "3-4 industrial automation projects",
            internships: "Manufacturing, automation, or industrial software internship",
            projects: ["PLC control program", "SCADA system dashboard", "Production data pipeline", "HMI interface design"]
        },
        certifications: {
            optional: ["Rockwell Automation Certificate", "Siemens Certified Programmer"],
            recommended: ["ISA CAP Associate"]
        },
        ucDavisResources: {
            primaryClubs: ["Society of Manufacturing Engineers (SME)", "The Hardware Club @ UC Davis", "IEEE"],
            courses: ["ENG 6", "ECS 150", "ECS 152B"],
            events: ["Manufacturing Tech Expo", "Industry 4.0 Workshop"],
            professors: ["Prof. Prasant Mohapatra", "Prof. Barbara Linke"]
        },
        careerProgression: [
            { level: "Entry", title: "Junior Industrial Software Engineer", salary: "$75k-$95k", years: "0-2" },
            { level: "Mid", title: "Industrial Software Engineer", salary: "$95k-$125k", years: "2-5" },
            { level: "Senior", title: "Senior Industrial Software Engineer", salary: "$125k-$165k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$90k-$140k",
            entrySalary: "$75k-$95k",
            seniorSalary: "$125k-$165k",
            jobGrowth: "+15% (2024-2034)",
            totalJobs: "85,000 in US",
            remotePercentage: "40",
            topLocations: ["Houston", "Detroit", "Chicago", "Phoenix", "Milwaukee"],
            demandLevel: "High"
        },
        realJobPostings: [
            "Rockwell Automation: New Grad Software Engineer - Milwaukee, WI",
            "Siemens Digital Industries: Junior Industrial Software Developer - Houston, TX",
            "ABB: Entry Level Automation Engineer - Cleveland, OH"
        ],
        skillGaps: [
            { skill: "PLC Programming", importance: "Critical", timeToLearn: "3-4 months" },
            { skill: "Industrial Networks", importance: "High", timeToLearn: "2-3 months" },
            { skill: "MES Integration", importance: "Medium", timeToLearn: "2-3 months" }
        ]
    },

    "Automation Engineer": {
        category: "Industrial Engineering",
        description: "Design and implement automated systems for manufacturing",
        education: {
            primary: "BS in Mechanical, Electrical, or Industrial Engineering",
            alternative: "BS in Robotics or Mechatronics Engineering",
            requiredCourses: ["EEC 157 (Control Systems)", "MAE 143A (Signals & Systems)", "EME 150A (Mechanical Design)"]
        },
        technicalSkills: {
            required: ["PLC programming", "Robotics", "Control systems", "CAD", "HMI"],
            preferred: ["Vision systems", "Motion control", "Safety systems", "Industry 4.0", "SCADA"],
            tools: ["Allen-Bradley PLCs", "FANUC robots", "AutoCAD", "SolidWorks", "LabVIEW"]
        },
        experience: {
            portfolio: "3-4 automation system projects",
            internships: "Manufacturing automation or robotics internship",
            projects: ["Robotic arm programming", "Automated assembly line design", "Vision-guided robot system", "Safety interlock system"]
        },
        certifications: {
            optional: ["FANUC Robotics Certification", "PMMI Mechatronics Certification"],
            recommended: ["ISA Automation Professional"]
        },
        ucDavisResources: {
            primaryClubs: ["SME", "Davis Robotics Club", "Cyclone RoboSub"],
            courses: ["EEC 157", "MAE 143A", "EME 150A"],
            events: ["Robotics Competition", "Automation Expo"],
            professors: ["Prof. Zhaodan Kong", "Prof. Jonathon Schofield"]
        },
        careerProgression: [
            { level: "Entry", title: "Junior Automation Engineer", salary: "$70k-$90k", years: "0-2" },
            { level: "Mid", title: "Automation Engineer", salary: "$90k-$120k", years: "2-5" },
            { level: "Senior", title: "Senior Automation Engineer", salary: "$120k-$155k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$85k-$130k",
            entrySalary: "$70k-$90k",
            seniorSalary: "$120k-$155k",
            jobGrowth: "+12% (2024-2034)",
            totalJobs: "92,000 in US",
            remotePercentage: "25",
            topLocations: ["Detroit", "Chicago", "Houston", "Phoenix", "Cincinnati"],
            demandLevel: "High"
        },
        realJobPostings: [
            "Tesla: Manufacturing Automation Engineer - Fremont, CA",
            "Amazon Robotics: New Grad Automation Engineer - North Reading, MA",
            "Procter & Gamble: Entry Level Controls Engineer - Cincinnati, OH"
        ],
        skillGaps: [
            { skill: "Robot Programming", importance: "Critical", timeToLearn: "3-4 months" },
            { skill: "Vision Systems", importance: "High", timeToLearn: "2-3 months" },
            { skill: "Safety Standards", importance: "Medium", timeToLearn: "1-2 months" }
        ]
    },

    "Industrial IoT Engineer": {
        category: "Industrial Engineering",
        description: "Implement IoT solutions for industrial applications",
        education: {
            primary: "BS in Computer Engineering or Electrical Engineering",
            alternative: "BS in Computer Science with IoT focus",
            requiredCourses: ["EEC 172 (Embedded Systems)", "ECS 152A (Computer Networks)", "ECS 165A (Database Systems)"]
        },
        technicalSkills: {
            required: ["IoT protocols", "Cloud platforms", "Embedded systems", "Data analytics", "MQTT", "Python"],
            preferred: ["Edge computing", "5G", "Time-series databases", "Security", "Machine learning"],
            tools: ["AWS IoT Core", "Azure IoT Hub", "Node-RED", "Grafana", "InfluxDB"]
        },
        experience: {
            portfolio: "3-4 IoT implementation projects",
            internships: "IoT, cloud computing, or industrial technology internship",
            projects: ["Sensor network deployment", "Predictive maintenance system", "Real-time monitoring dashboard", "Edge analytics implementation"]
        },
        certifications: {
            optional: ["AWS IoT Certification", "Azure IoT Developer"],
            recommended: ["CompTIA IoT+"]
        },
        ucDavisResources: {
            primaryClubs: ["The Hardware Club @ UC Davis", "SME", "IEEE"],
            courses: ["EEC 172", "ECS 152A", "ECS 165A"],
            events: ["IoT Workshop", "Smart Manufacturing Summit"],
            professors: ["Prof. Chen-Nee Chuah", "Prof. Dipak Ghosal"]
        },
        careerProgression: [
            { level: "Entry", title: "Junior IoT Engineer", salary: "$80k-$105k", years: "0-2" },
            { level: "Mid", title: "Industrial IoT Engineer", salary: "$105k-$135k", years: "2-5" },
            { level: "Senior", title: "Senior IoT Solutions Architect", salary: "$135k-$175k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$95k-$150k",
            entrySalary: "$80k-$105k",
            seniorSalary: "$135k-$175k",
            jobGrowth: "+22% (2024-2034)",
            totalJobs: "58,000 in US",
            remotePercentage: "55",
            topLocations: ["San Francisco", "Seattle", "Austin", "Chicago", "Boston"],
            demandLevel: "High"
        },
        realJobPostings: [
            "GE Digital: Entry Level IIoT Engineer - San Ramon, CA",
            "Honeywell: New Grad IoT Solutions Engineer - Atlanta, GA",
            "PTC: Junior Industrial IoT Developer - Boston, MA"
        ],
        skillGaps: [
            { skill: "Edge Computing", importance: "Critical", timeToLearn: "3-4 months" },
            { skill: "Time-Series Analysis", importance: "High", timeToLearn: "2-3 months" },
            { skill: "IoT Security", importance: "Medium", timeToLearn: "2-3 months" }
        ]
    },

    // ============= BUSINESS-TECH HYBRID CONTINUED =============

    "Technical Product Manager": {
        category: "Product Management",
        description: "Guide product development with technical expertise",
        education: {
            primary: "BS in CS, Engineering, or Business + technical minor",
            alternative: "BS in any field with strong technical and business skills",
            requiredCourses: ["MGT 180 (Entrepreneurship)", "ECS 193 (Senior Design)", "ECS 162 (Web Programming)"]
        },
        technicalSkills: {
            required: ["Product roadmapping", "Agile/Scrum", "Data analysis", "Basic coding", "SQL", "User stories"],
            preferred: ["A/B testing", "User research", "Financial modeling", "API design", "Analytics tools"],
            tools: ["JIRA", "Confluence", "Figma", "Google Analytics", "Mixpanel"]
        },
        experience: {
            portfolio: "3-4 product management projects or launches",
            internships: "Product management, program management, or startup internship",
            projects: ["Product spec document", "Feature prioritization framework", "User research study", "MVP launch"]
        },
        certifications: {
            optional: ["Certified Scrum Product Owner", "Pragmatic Marketing Certification"],
            recommended: ["Google PM Certificate"]
        },
        ucDavisResources: {
            primaryClubs: ["Product Space @ UC Davis", "AggieWorks", "HackDavis", "Entrepreneurship Association"],
            courses: ["MGT 180", "ECS 193", "ECS 162"],
            events: ["Product Management Workshop", "Startup Weekend"],
            professors: ["Prof. Hemant Bhargava", "Prof. Greta Hsu"]
        },
        careerProgression: [
            { level: "Entry", title: "Associate Product Manager", salary: "$95k-$125k", years: "0-2" },
            { level: "Mid", title: "Product Manager", salary: "$125k-$165k", years: "2-5" },
            { level: "Senior", title: "Senior Product Manager", salary: "$165k-$210k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$120k-$180k",
            entrySalary: "$95k-$125k",
            seniorSalary: "$165k-$210k",
            jobGrowth: "+19% (2024-2034)",
            totalJobs: "185,000 in US",
            remotePercentage: "75",
            topLocations: ["San Francisco", "Seattle", "New York", "Austin", "Remote"],
            demandLevel: "High"
        },
        realJobPostings: [
            "Google: Associate Product Manager - Mountain View, CA",
            "Microsoft: Program Manager - New Grad - Redmond, WA",
            "Uber: Associate Product Manager, University - San Francisco, CA"
        ],
        skillGaps: [
            { skill: "User Research", importance: "Critical", timeToLearn: "2-3 months" },
            { skill: "Data Analysis", importance: "High", timeToLearn: "3-4 months" },
            { skill: "Stakeholder Management", importance: "Medium", timeToLearn: "2-3 months" }
        ]
    },

    "Sales Engineer": {
        category: "Business-Tech",
        description: "Bridge technical products and customer needs",
        education: {
            primary: "BS in Engineering or CS",
            alternative: "BS in Business with strong technical skills",
            requiredCourses: ["CMN 1 (Public Speaking)", "MGT 11A (Intro to Management)", "ECS 189 (Advanced Topics)"]
        },
        technicalSkills: {
            required: ["Technical presentations", "Solution architecture", "CRM systems", "Demos", "Technical writing"],
            preferred: ["Industry knowledge", "Competitive analysis", "Pricing strategy", "Cloud platforms", "API integration"],
            tools: ["Salesforce", "PowerPoint", "Demo environments", "Slack", "Zoom"]
        },
        experience: {
            portfolio: "3-4 technical presentation or solution design projects",
            internships: "Sales engineering, solutions engineering, or customer success internship",
            projects: ["Technical demo script", "Solution architecture diagram", "ROI calculator", "Competitive analysis report"]
        },
        certifications: {
            optional: ["Salesforce Certified", "AWS Solutions Architect Associate"],
            recommended: ["Technical Sales Certification"]
        },
        ucDavisResources: {
            primaryClubs: ["The Davis Consulting Group", "Green Innovation Network", "Entrepreneurship Association"],
            courses: ["CMN 1", "MGT 11A", "ECS 189"],
            events: ["Sales Competition", "Tech Talk Series"],
            professors: ["Prof. Tim McNeil", "Prof. Andrew Hargadon"]
        },
        careerProgression: [
            { level: "Entry", title: "Junior Sales Engineer", salary: "$85k-$110k", years: "0-2" },
            { level: "Mid", title: "Sales Engineer", salary: "$110k-$145k", years: "2-5" },
            { level: "Senior", title: "Senior Solutions Engineer", salary: "$145k-$185k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$100k-$160k",
            entrySalary: "$85k-$110k",
            seniorSalary: "$145k-$185k",
            jobGrowth: "+15% (2024-2034)",
            totalJobs: "75,000 in US",
            remotePercentage: "60",
            topLocations: ["San Francisco", "Austin", "New York", "Chicago", "Remote"],
            demandLevel: "Moderate"
        },
        realJobPostings: [
            "Salesforce: New Grad Sales Engineer - San Francisco, CA",
            "Datadog: Solutions Engineer - New York, NY",
            "Snowflake: Sales Engineer, University - San Mateo, CA"
        ],
        skillGaps: [
            { skill: "Solution Architecture", importance: "Critical", timeToLearn: "3-4 months" },
            { skill: "Customer Communication", importance: "High", timeToLearn: "2-3 months" },
            { skill: "Technical Demos", importance: "Medium", timeToLearn: "1-2 months" }
        ]
    },

    "Research Engineer": {
        category: "Research & Development",
        description: "Conduct applied research and develop prototypes",
        education: {
            primary: "BS/MS in relevant engineering field",
            alternative: "BS with strong research experience",
            requiredCourses: ["ECS 189 (Advanced Topics)", "Graduate seminars", "Research methods courses"]
        },
        technicalSkills: {
            required: ["Research methods", "Prototyping", "Data analysis", "Technical writing", "Literature review", "Python/MATLAB"],
            preferred: ["Grant writing", "Patent process", "Simulation tools", "Publishing", "Machine learning"],
            tools: ["LaTeX", "Jupyter", "MATLAB", "Git", "Statistical software"]
        },
        experience: {
            portfolio: "3-4 research projects with documentation",
            internships: "Research lab or R&D department internship",
            projects: ["Published research paper", "Patent application", "Research prototype", "Conference presentation"]
        },
        certifications: {
            optional: ["Patent Agent Registration", "Grant Writing Certificate"],
            recommended: ["Research Methods courses"]
        },
        ucDavisResources: {
            primaryClubs: ["AI Student Collective", "Quantum Computing Society at Davis", "Undergraduate Research Club"],
            courses: ["ECS 189", "Graduate seminars", "Research units"],
            events: ["Undergraduate Research Conference", "Research Symposium"],
            professors: ["Multiple research faculty across departments"]
        },
        careerProgression: [
            { level: "Entry", title: "Junior Research Engineer", salary: "$75k-$95k", years: "0-2" },
            { level: "Mid", title: "Research Engineer", salary: "$95k-$125k", years: "2-5" },
            { level: "Senior", title: "Senior Research Engineer", salary: "$125k-$165k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$85k-$145k",
            entrySalary: "$75k-$95k",
            seniorSalary: "$125k-$165k",
            jobGrowth: "+12% (2024-2034)",
            totalJobs: "135,000 in US",
            remotePercentage: "40",
            topLocations: ["San Francisco Bay Area", "Boston", "Seattle", "Austin", "Research Triangle"],
            demandLevel: "Moderate"
        },
        realJobPostings: [
            "Meta AI Research: Research Engineer - Menlo Park, CA",
            "Microsoft Research: Research Engineer - Redmond, WA",
            "IBM Research: Entry Level Research Staff Member - Yorktown Heights, NY"
        ],
        skillGaps: [
            { skill: "Research Methodology", importance: "Critical", timeToLearn: "3-4 months" },
            { skill: "Technical Writing", importance: "High", timeToLearn: "2-3 months" },
            { skill: "Patent Process", importance: "Medium", timeToLearn: "2-3 months" }
        ]
    },

    "QA/Test Automation Engineer": {
        category: "Software Engineering",
        description: "Ensure software quality through testing",
        education: {
            primary: "BS in Computer Science or related",
            alternative: "Any technical degree with testing experience",
            requiredCourses: ["ECS 160 (Software Engineering)", "ECS 140A (Programming Languages)", "ECS 153 (Computer Security)"]
        },
        technicalSkills: {
            required: ["Test automation", "Selenium/Cypress", "Python/Java", "Git", "Test planning", "Bug tracking"],
            preferred: ["CI/CD", "Performance testing", "API testing", "Mobile testing", "Security testing"],
            tools: ["Selenium", "Cypress", "Jest", "Postman", "JIRA", "Jenkins"]
        },
        experience: {
            portfolio: "3-4 test automation projects",
            internships: "QA, software testing, or development internship",
            projects: ["Test automation framework", "API test suite", "Performance testing project", "Mobile app testing"]
        },
        certifications: {
            optional: ["ISTQB Certification", "Certified Software Test Engineer"],
            recommended: ["Selenium WebDriver certification"]
        },
        ucDavisResources: {
            primaryClubs: ["AggieWorks", "CodeLab", "#include"],
            courses: ["ECS 160", "ECS 140A", "ECS 153"],
            events: ["Testing Workshop", "Quality Assurance Seminar"],
            professors: ["Prof. Premkumar Devanbu", "Prof. Cindy Rubio-González"]
        },
        careerProgression: [
            { level: "Entry", title: "Junior QA Engineer", salary: "$70k-$90k", years: "0-2" },
            { level: "Mid", title: "QA Automation Engineer", salary: "$90k-$115k", years: "2-5" },
            { level: "Senior", title: "Senior Test Automation Engineer", salary: "$115k-$145k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$85k-$125k",
            entrySalary: "$70k-$90k",
            seniorSalary: "$115k-$145k",
            jobGrowth: "+17% (2024-2034)",
            totalJobs: "145,000 in US",
            remotePercentage: "70",
            topLocations: ["San Francisco", "Seattle", "Austin", "New York", "Remote"],
            demandLevel: "High"
        },
        realJobPostings: [
            "Apple: QA Engineer - New College Grad - Cupertino, CA",
            "Amazon: Software Development Engineer in Test - Seattle, WA",
            "PayPal: Entry Level Quality Engineer - San Jose, CA"
        ],
        skillGaps: [
            { skill: "Test Automation Frameworks", importance: "Critical", timeToLearn: "3-4 months" },
            { skill: "Performance Testing", importance: "High", timeToLearn: "2-3 months" },
            { skill: "CI/CD Integration", importance: "Medium", timeToLearn: "2-3 months" }
        ]
    },

    "Technical Writer": {
        category: "Communication",
        description: "Create technical documentation and user guides",
        education: {
            primary: "BS in Technical Writing, English, or technical field",
            alternative: "Any degree with strong writing skills",
            requiredCourses: ["ENL 115 (Technical Writing)", "CMN 150 (Organizational Communication)", "UWP 104 (Business Writing)"]
        },
        technicalSkills: {
            required: ["Writing", "Documentation tools", "Basic coding", "Version control", "Style guides"],
            preferred: ["API documentation", "Video creation", "Markdown", "XML/DITA", "Localization"],
            tools: ["MadCap Flare", "Adobe FrameMaker", "Confluence", "GitHub", "Snagit"]
        },
        experience: {
            portfolio: "4-5 technical documentation samples",
            internships: "Technical writing or documentation internship",
            projects: ["API documentation", "User manual", "Quick start guide", "Video tutorial series"]
        },
        certifications: {
            optional: ["Society for Technical Communication Certification"],
            recommended: ["Google Technical Writing Certificate"]
        },
        ucDavisResources: {
            primaryClubs: ["Science Says", "Computer Science Tutoring Club", "Professional Writing Club"],
            courses: ["ENL 115", "CMN 150", "UWP 104"],
            events: ["Technical Writing Workshop", "Documentation Best Practices"],
            professors: ["Prof. Carl Whithaus", "Prof. John Marx"]
        },
        careerProgression: [
            { level: "Entry", title: "Junior Technical Writer", salary: "$60k-$80k", years: "0-2" },
            { level: "Mid", title: "Technical Writer", salary: "$80k-$105k", years: "2-5" },
            { level: "Senior", title: "Senior Technical Writer", salary: "$105k-$135k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$75k-$115k",
            entrySalary: "$60k-$80k",
            seniorSalary: "$105k-$135k",
            jobGrowth: "+12% (2024-2034)",
            totalJobs: "58,000 in US",
            remotePercentage: "80",
            topLocations: ["San Francisco", "Seattle", "Austin", "Boston", "Remote"],
            demandLevel: "Moderate"
        },
        realJobPostings: [
            "Google: Technical Writer, New Grad - Mountain View, CA",
            "DocuSign: Junior Technical Writer - San Francisco, CA",
            "Splunk: Entry Level Documentation Engineer - San Jose, CA"
        ],
        skillGaps: [
            { skill: "API Documentation", importance: "Critical", timeToLearn: "2-3 months" },
            { skill: "Documentation Tools", importance: "High", timeToLearn: "2-3 months" },
            { skill: "Video Creation", importance: "Medium", timeToLearn: "1-2 months" }
        ]
    },

    "Developer Advocate": {
        category: "Developer Relations",
        description: "Bridge developers and products through education and advocacy",
        education: {
            primary: "BS in Computer Science or related",
            alternative: "Any technical degree with communication skills",
            requiredCourses: ["CMN 1 (Public Speaking)", "ECS 189 (Advanced Topics)", "ECS 188 (Ethics in CS)"]
        },
        technicalSkills: {
            required: ["Programming", "Public speaking", "Content creation", "Community building", "Technical writing"],
            preferred: ["Video production", "Event organizing", "Multiple languages", "Social media", "Analytics"],
            tools: ["GitHub", "YouTube/Twitch", "Discord/Slack", "OBS Studio", "Canva"]
        },
        experience: {
            portfolio: "Portfolio of technical content and community contributions",
            internships: "Developer relations, community management, or technical evangelist internship",
            projects: ["Technical blog series", "Conference talk", "Open source contributions", "Developer tutorial videos"]
        },
        certifications: {
            optional: ["Google Developer Expert", "Microsoft MVP"],
            recommended: ["Public speaking courses"]
        },
        ucDavisResources: {
            primaryClubs: ["Google Developer Student Club", "HackDavis", "CodeLab"],
            courses: ["CMN 1", "ECS 189", "ECS 188"],
            events: ["HackDavis", "Tech Talks", "Developer Meetups"],
            professors: ["Prof. Nina Amenta", "Prof. Norm Matloff"]
        },
        careerProgression: [
            { level: "Entry", title: "Junior Developer Advocate", salary: "$90k-$120k", years: "0-2" },
            { level: "Mid", title: "Developer Advocate", salary: "$120k-$155k", years: "2-5" },
            { level: "Senior", title: "Senior Developer Advocate", salary: "$155k-$195k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$110k-$170k",
            entrySalary: "$90k-$120k",
            seniorSalary: "$155k-$195k",
            jobGrowth: "+20% (2024-2034)",
            totalJobs: "25,000 in US",
            remotePercentage: "85",
            topLocations: ["San Francisco", "Seattle", "New York", "Austin", "Remote"],
            demandLevel: "High"
        },
        realJobPostings: [
            "Twilio: Developer Educator - San Francisco, CA/Remote",
            "MongoDB: Developer Advocate, New Grad - New York, NY",
            "GitHub: Junior Developer Advocate - Remote"
        ],
        skillGaps: [
            { skill: "Public Speaking", importance: "Critical", timeToLearn: "3-4 months" },
            { skill: "Content Creation", importance: "High", timeToLearn: "2-3 months" },
            { skill: "Community Management", importance: "Medium", timeToLearn: "2-3 months" }
        ]
    },

    "IT Support Engineer": {
        category: "Information Technology",
        description: "Provide technical support and maintain IT infrastructure",
        education: {
            primary: "BS in Information Technology or Computer Science",
            alternative: "Any degree with IT certifications",
            requiredCourses: ["ECS 152A (Computer Networks)", "ECS 153 (Computer Security)", "ECS 150 (Operating Systems)"]
        },
        technicalSkills: {
            required: ["Windows/Mac/Linux", "Networking", "Troubleshooting", "Help desk", "Active Directory"],
            preferred: ["Cloud services", "Scripting", "Security", "Virtualization", "Mobile device management"],
            tools: ["ServiceNow", "Active Directory", "Office 365", "Remote desktop tools", "Ticketing systems"]
        },
        experience: {
            portfolio: "Documentation of IT projects and solutions",
            internships: "IT support, help desk, or system administration internship",
            projects: ["Network setup project", "Help desk documentation", "Automation scripts", "Security audit"]
        },
        certifications: {
            optional: ["CompTIA A+", "CompTIA Network+", "Microsoft 365 Certified"],
            recommended: ["Google IT Support Professional Certificate"]
        },
        ucDavisResources: {
            primaryClubs: ["Computer Science Tutoring Club", "#include", "Cyber Security Club"],
            courses: ["ECS 152A", "ECS 153", "ECS 150"],
            events: ["IT Workshop", "Networking Basics"],
            professors: ["Prof. Karl Levitt", "Prof. Matt Bishop"]
        },
        careerProgression: [
            { level: "Entry", title: "IT Support Specialist", salary: "$45k-$60k", years: "0-2" },
            { level: "Mid", title: "IT Support Engineer", salary: "$60k-$80k", years: "2-5" },
            { level: "Senior", title: "Senior Systems Administrator", salary: "$80k-$105k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$55k-$85k",
            entrySalary: "$45k-$60k",
            seniorSalary: "$80k-$105k",
            jobGrowth: "+10% (2024-2034)",
            totalJobs: "385,000 in US",
            remotePercentage: "45",
            topLocations: ["New York", "Los Angeles", "Chicago", "Dallas", "Atlanta"],
            demandLevel: "Moderate"
        },
        realJobPostings: [
            "Google: IT Support Specialist - Mountain View, CA",
            "Apple: Mac Genius - Various Locations",
            "Amazon: IT Support Associate - Seattle, WA"
        ],
        skillGaps: [
            { skill: "Cloud Administration", importance: "Critical", timeToLearn: "3-4 months" },
            { skill: "Automation/Scripting", importance: "High", timeToLearn: "2-3 months" },
            { skill: "Security Basics", importance: "Medium", timeToLearn: "2-3 months" }
        ]
    },

    "Cybersecurity Engineer": {
        category: "Security",
        description: "Protect systems and data from cyber threats",
        education: {
            primary: "BS in Cybersecurity, Computer Science, or Information Security",
            alternative: "Any IT degree with security focus",
            requiredCourses: ["ECS 153 (Computer Security)", "ECS 152 (Computer Networks)", "ECS 155 (Cryptography)"]
        },
        technicalSkills: {
            required: ["Network security", "Linux", "Security tools", "Python", "Incident response", "Risk assessment"],
            preferred: ["Penetration testing", "SIEM tools", "Cloud security", "Forensics", "Compliance"],
            tools: ["Wireshark", "Metasploit", "Nmap", "Splunk", "Kali Linux"]
        },
        experience: {
            portfolio: "3-4 security projects or CTF participation",
            internships: "Security operations, penetration testing, or security analyst internship",
            projects: ["Vulnerability assessment", "Security audit report", "Incident response plan", "CTF writeups"]
        },
        certifications: {
            optional: ["CompTIA Security+", "CEH", "CISSP Associate"],
            recommended: ["Google Cybersecurity Certificate"]
        },
        ucDavisResources: {
            primaryClubs: ["Cyber Security Club at UC Davis", "Women in Security"],
            courses: ["ECS 153", "ECS 152", "ECS 155"],
            events: ["Capture The Flag competitions", "Security workshops"],
            professors: ["Prof. Matthew Bishop", "Prof. Karl Levitt"]
        },
        careerProgression: [
            { level: "Entry", title: "Junior Security Analyst", salary: "$85k-$110k", years: "0-2" },
            { level: "Mid", title: "Cybersecurity Engineer", salary: "$110k-$145k", years: "2-5" },
            { level: "Senior", title: "Senior Security Engineer", salary: "$145k-$195k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$105k-$165k",
            entrySalary: "$85k-$110k",
            seniorSalary: "$145k-$195k",
            jobGrowth: "+32% (2024-2034)",
            totalJobs: "165,000 in US",
            remotePercentage: "60",
            topLocations: ["Washington DC", "San Francisco", "New York", "Dallas", "Remote"],
            demandLevel: "Very High"
        },
        realJobPostings: [
            "Palo Alto Networks: New Grad Security Engineer - Santa Clara, CA",
            "CrowdStrike: University Grad Security Analyst - Austin, TX",
            "Microsoft: Security Engineer - New Grad - Redmond, WA"
        ],
        skillGaps: [
            { skill: "Cloud Security", importance: "Critical", timeToLearn: "3-4 months" },
            { skill: "Incident Response", importance: "High", timeToLearn: "2-3 months" },
            { skill: "Compliance Frameworks", importance: "Medium", timeToLearn: "2-3 months" }
        ]
    },

    "Game Developer": {
        category: "Software Engineering",
        description: "Design and build video games and interactive experiences",
        education: {
            primary: "BS in Computer Science or Game Development",
            alternative: "Any degree with strong programming and game portfolio",
            requiredCourses: ["ECS 189L (Game Development)", "ECS 175 (Computer Graphics)", "ECS 163 (Information Interfaces)"]
        },
        technicalSkills: {
            required: ["C++/C#", "Unity/Unreal", "Game design", "3D math", "Version control"],
            preferred: ["Graphics programming", "Networking", "AI", "Physics engines", "Shader programming"],
            tools: ["Unity", "Unreal Engine", "Visual Studio", "Perforce", "Blender"]
        },
        experience: {
            portfolio: "3-4 completed games or game prototypes",
            internships: "Game development studio or interactive media internship",
            projects: ["Complete 2D game", "3D game prototype", "Multiplayer game", "Game jam submission"]
        },
        certifications: {
            optional: ["Unity Certified Professional", "Unreal Engine Developer"],
            recommended: ["Game Design courses on Coursera"]
        },
        ucDavisResources: {
            primaryClubs: ["Game Development and Arts Club", "Women in Gaming at UC Davis"],
            courses: ["ECS 189L", "ECS 175", "ECS 163"],
            events: ["Game Jam", "GDC Student Day", "Game Showcase"],
            professors: ["Prof. Michael Neff", "Prof. Josh McCoy"]
        },
        careerProgression: [
            { level: "Entry", title: "Junior Game Developer", salary: "$70k-$95k", years: "0-2" },
            { level: "Mid", title: "Game Developer", salary: "$95k-$125k", years: "2-5" },
            { level: "Senior", title: "Senior Game Developer", salary: "$125k-$165k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$85k-$130k",
            entrySalary: "$70k-$95k",
            seniorSalary: "$125k-$165k",
            jobGrowth: "+16% (2024-2034)",
            totalJobs: "78,000 in US",
            remotePercentage: "55",
            topLocations: ["Los Angeles", "San Francisco", "Seattle", "Austin", "Remote"],
            demandLevel: "Moderate"
        },
        realJobPostings: [
            "Electronic Arts: Associate Software Engineer - Redwood City, CA",
            "Riot Games: Software Engineer I - Los Angeles, CA",
            "Blizzard Entertainment: Junior Game Developer - Irvine, CA"
        ],
        skillGaps: [
            { skill: "Game Engine Mastery", importance: "Critical", timeToLearn: "4-5 months" },
            { skill: "Multiplayer Networking", importance: "High", timeToLearn: "3-4 months" },
            { skill: "Game AI", importance: "Medium", timeToLearn: "2-3 months" }
        ]
    },

    "Wearable Technology Engineer": {
        category: "Biomedical Engineering",
        description: "Develop wearable health monitoring devices",
        education: {
            primary: "BS in Biomedical Engineering or Electrical Engineering",
            alternative: "BS in Computer Engineering with health tech focus",
            requiredCourses: ["BIM 106 (Medical Device Engineering)", "EEC 172 (Embedded Systems)", "EEC 136 (Electronic Design)"]
        },
        technicalSkills: {
            required: ["Embedded systems", "Sensor integration", "Mobile apps", "Data analytics", "Low-power design"],
            preferred: ["BLE", "Power optimization", "Health algorithms", "iOS/Android", "Machine learning"],
            tools: ["Arduino/ESP32", "BLE tools", "Android Studio/Xcode", "MATLAB", "Altium"]
        },
        experience: {
            portfolio: "3-4 wearable device projects",
            internships: "Wearable tech, medical device, or consumer electronics internship",
            projects: ["Fitness tracker prototype", "Health monitoring app", "Sensor data pipeline", "Battery optimization project"]
        },
        certifications: {
            optional: ["Bluetooth SIG Certification", "Apple HealthKit Certification"],
            recommended: ["Wearable Technology courses"]
        },
        ucDavisResources: {
            primaryClubs: ["Neurotech @ UCDavis", "BMES", "The Hardware Club"],
            courses: ["BIM 106", "EEC 172", "EEC 136"],
            events: ["Health Tech Symposium", "Wearables Workshop"],
            professors: ["Prof. Sanjay Joshi", "Prof. Tingrui Pan"]
        },
        careerProgression: [
            { level: "Entry", title: "Junior Wearables Engineer", salary: "$80k-$105k", years: "0-2" },
            { level: "Mid", title: "Wearable Technology Engineer", salary: "$105k-$135k", years: "2-5" },
            { level: "Senior", title: "Senior Wearables Engineer", salary: "$135k-$175k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$95k-$145k",
            entrySalary: "$80k-$105k",
            seniorSalary: "$135k-$175k",
            jobGrowth: "+25% (2024-2034)",
            totalJobs: "32,000 in US",
            remotePercentage: "50",
            topLocations: ["San Francisco Bay Area", "San Diego", "Boston", "Seattle", "Austin"],
            demandLevel: "High"
        },
        realJobPostings: [
            "Apple: Wearables Engineer - Cupertino, CA",
            "Fitbit (Google): Junior Hardware Engineer - San Francisco, CA",
            "Garmin: Entry Level Wearable Software Engineer - Olathe, KS"
        ],
        skillGaps: [
            { skill: "Ultra-Low Power Design", importance: "Critical", timeToLearn: "3-4 months" },
            { skill: "Biosensor Integration", importance: "High", timeToLearn: "2-3 months" },
            { skill: "FDA Regulations", importance: "Medium", timeToLearn: "2-3 months" }
        ]
    },

    "Health Tech Software Engineer": {
        category: "Biomedical Engineering",
        description: "Build digital health platforms and applications",
        education: {
            primary: "BS in Computer Science, Biomedical Engineering, or Health Informatics",
            alternative: "Any CS degree with healthcare interest",
            requiredCourses: ["BIM 106", "ECS 162 (Web Programming)", "ECS 165A (Database Systems)"]
        },
        technicalSkills: {
            required: ["Web/mobile development", "HIPAA", "APIs", "Cloud", "Database design"],
            preferred: ["Telemedicine", "EHR integration", "ML for health", "FHIR", "Security"],
            tools: ["React/React Native", "AWS/GCP", "PostgreSQL", "Docker", "Epic/Cerner APIs"]
        },
        experience: {
            portfolio: "3-4 health tech applications",
            internships: "Digital health, healthtech startup, or hospital IT internship",
            projects: ["Telemedicine platform", "Patient portal", "Health data dashboard", "Symptom checker app"]
        },
        certifications: {
            optional: ["AWS Healthcare Competency", "HIPAA Compliance Certification"],
            recommended: ["Digital Health courses"]
        },
        ucDavisResources: {
            primaryClubs: ["BMES", "HackDavis", "Design for America"],
            courses: ["BIM 106", "ECS 162", "ECS 165A"],
            events: ["Health Hackathon", "Digital Health Summit"],
            professors: ["Prof. Xin Liu", "Prof. Chen-Nee Chuah"]
        },
        careerProgression: [
            { level: "Entry", title: "Junior Health Tech Developer", salary: "$85k-$110k", years: "0-2" },
            { level: "Mid", title: "Health Tech Software Engineer", salary: "$110k-$145k", years: "2-5" },
            { level: "Senior", title: "Senior Digital Health Engineer", salary: "$145k-$185k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$100k-$160k",
            entrySalary: "$85k-$110k",
            seniorSalary: "$145k-$185k",
            jobGrowth: "+28% (2024-2034)",
            totalJobs: "95,000 in US",
            remotePercentage: "70",
            topLocations: ["San Francisco", "Boston", "New York", "Austin", "Remote"],
            demandLevel: "Very High"
        },
        realJobPostings: [
            "Teladoc Health: Software Engineer New Grad - Remote",
            "Oscar Health: Junior Backend Engineer - New York, NY",
            "Ro: Entry Level Full Stack Engineer - New York, NY"
        ],
        skillGaps: [
            { skill: "Healthcare Regulations", importance: "Critical", timeToLearn: "2-3 months" },
            { skill: "EHR Integration", importance: "High", timeToLearn: "3-4 months" },
            { skill: "Telemedicine Platforms", importance: "Medium", timeToLearn: "2-3 months" }
        ]
    },

    "Computational Biology Engineer": {
        category: "Biomedical Engineering",
        description: "Model biological systems computationally",
        education: {
            primary: "BS in Computational Biology, Bioinformatics, or Applied Math",
            alternative: "BS in Biology with strong programming skills",
            requiredCourses: ["BIS 180L (Genomics Lab)", "MAT 124 (Math Biology)", "STA 141 (Statistical Computing)"]
        },
        technicalSkills: {
            required: ["Python/R", "Mathematical modeling", "Simulation", "Statistics", "Linux"],
            preferred: ["Systems biology", "ML", "HPC", "Publication", "Julia"],
            tools: ["MATLAB", "R/Bioconductor", "Python scientific stack", "Git", "Cluster computing"]
        },
        experience: {
            portfolio: "3-4 computational biology projects",
            internships: "Research lab, biotech, or pharmaceutical company internship",
            projects: ["Gene expression analysis", "Protein folding simulation", "Drug interaction model", "Systems biology model"]
        },
        certifications: {
            optional: ["Bioinformatics Specialization (Coursera)"],
            recommended: ["Systems Biology courses"]
        },
        ucDavisResources: {
            primaryClubs: ["BMES", "AI Student Collective", "Data Science Club"],
            courses: ["BIS 180L", "MAT 124", "STA 141"],
            events: ["Computational Biology Symposium", "Research Seminars"],
            professors: ["Prof. Ilias Tagkopoulos", "Prof. David Koslicki"]
        },
        careerProgression: [
            { level: "Entry", title: "Junior Computational Biologist", salary: "$75k-$100k", years: "0-2" },
            { level: "Mid", title: "Computational Biology Engineer", salary: "$100k-$130k", years: "2-5" },
            { level: "Senior", title: "Senior Computational Biologist", salary: "$130k-$170k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$90k-$140k",
            entrySalary: "$75k-$100k",
            seniorSalary: "$130k-$170k",
            jobGrowth: "+23% (2024-2034)",
            totalJobs: "38,000 in US",
            remotePercentage: "65",
            topLocations: ["Boston", "San Francisco Bay Area", "San Diego", "Research Triangle", "Remote"],
            demandLevel: "High"
        },
        realJobPostings: [
            "Moderna: Computational Biologist - Cambridge, MA",
            "Ginkgo Bioworks: Junior Computational Biology Engineer - Boston, MA",
            "Zymergen: Entry Level Computational Biologist - Emeryville, CA"
        ],
        skillGaps: [
            { skill: "Systems Modeling", importance: "Critical", timeToLearn: "3-4 months" },
            { skill: "HPC/Cluster Computing", importance: "High", timeToLearn: "2-3 months" },
            { skill: "Biological Networks", importance: "Medium", timeToLearn: "3-4 months" }
        ]
    },

    "Medical Robotics Engineer": {
        category: "Biomedical Engineering",
        description: "Develop robotic systems for medical applications",
        education: {
            primary: "BS in Robotics, Mechanical, or Biomedical Engineering",
            alternative: "BS in Computer Engineering with robotics focus",
            requiredCourses: ["MAE 143A (Robotics)", "EEC 157 (Control Systems)", "BIM 106 (Medical Devices)"]
        },
        technicalSkills: {
            required: ["Robotics", "Control systems", "C++/Python", "ROS", "Safety", "Kinematics"],
            preferred: ["Computer vision", "Haptics", "FDA regulations", "Surgical robotics", "Real-time systems"],
            tools: ["ROS", "MATLAB/Simulink", "SolidWorks", "LabVIEW", "Force sensors"]
        },
        experience: {
            portfolio: "3-4 robotics projects with medical applications",
            internships: "Medical robotics, surgical robotics, or rehabilitation robotics internship",
            projects: ["Surgical tool prototype", "Rehabilitation robot", "Haptic feedback system", "Computer-assisted surgery tool"]
        },
        certifications: {
            optional: ["ROS Certification", "Medical Device Standards"],
            recommended: ["Robotics courses on Coursera"]
        },
        ucDavisResources: {
            primaryClubs: ["Davis Robotics Club", "Women in Robotics Club", "BMES"],
            courses: ["MAE 143A", "EEC 157", "BIM 106"],
            events: ["Robotics Competition", "Medical Robotics Symposium"],
            professors: ["Prof. Jonathon Schofield", "Prof. Sanjay Joshi"]
        },
        careerProgression: [
            { level: "Entry", title: "Junior Robotics Engineer", salary: "$85k-$110k", years: "0-2" },
            { level: "Mid", title: "Medical Robotics Engineer", salary: "$110k-$145k", years: "2-5" },
            { level: "Senior", title: "Senior Medical Robotics Engineer", salary: "$145k-$185k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$105k-$165k",
            entrySalary: "$85k-$110k",
            seniorSalary: "$145k-$185k",
            jobGrowth: "+20% (2024-2034)",
            totalJobs: "22,000 in US",
            remotePercentage: "30",
            topLocations: ["Boston", "San Francisco Bay Area", "Los Angeles", "Pittsburgh", "Minneapolis"],
            demandLevel: "High"
        },
        realJobPostings: [
            "Intuitive Surgical: New Grad Robotics Engineer - Sunnyvale, CA",
            "Stryker: Junior Medical Robotics Engineer - Kalamazoo, MI",
            "Johnson & Johnson: Entry Level Surgical Robotics Engineer - Santa Clara, CA"
        ],
        skillGaps: [
            { skill: "Haptic Feedback", importance: "Critical", timeToLearn: "3-4 months" },
            { skill: "FDA Compliance", importance: "High", timeToLearn: "2-3 months" },
            { skill: "Surgical Workflow", importance: "Medium", timeToLearn: "3-4 months" }
        ]
    },

    "Biomedical Signal Processing Engineer": {
        category: "Biomedical Engineering",
        description: "Process biological signals for diagnostics",
        education: {
            primary: "BS in Biomedical or Electrical Engineering",
            alternative: "BS in Computer Engineering with signal processing focus",
            requiredCourses: ["EEC 150A/B (Signals & Systems)", "BIM 106 (Medical Devices)", "STA 135 (Multivariate Analysis)"]
        },
        technicalSkills: {
            required: ["Signal processing", "MATLAB", "Python", "Statistics", "Filtering"],
            preferred: ["EEG/ECG/EMG", "Real-time processing", "ML", "Wavelet analysis", "Feature extraction"],
            tools: ["MATLAB", "Python/SciPy", "LabVIEW", "EEGLAB", "Biosignal toolboxes"]
        },
        experience: {
            portfolio: "3-4 biosignal processing projects",
            internships: "Medical device, neurotechnology, or research lab internship",
            projects: ["ECG analysis system", "EEG classification", "EMG pattern recognition", "Real-time signal monitor"]
        },
        certifications: {
            optional: ["Biomedical Signal Processing Certificate"],
            recommended: ["Digital Signal Processing courses"]
        },
        ucDavisResources: {
            primaryClubs: ["Neurotech @ UCDavis", "BMES", "IEEE"],
            courses: ["EEC 150A/B", "BIM 106", "STA 135"],
            events: ["Neurotechnology Workshop", "Signal Processing Seminar"],
            professors: ["Prof. Sanjay Joshi", "Prof. Karen Moxon"]
        },
        careerProgression: [
            { level: "Entry", title: "Junior Signal Processing Engineer", salary: "$80k-$105k", years: "0-2" },
            { level: "Mid", title: "Biomedical Signal Processing Engineer", salary: "$105k-$135k", years: "2-5" },
            { level: "Senior", title: "Senior Biosignal Engineer", salary: "$135k-$170k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$95k-$145k",
            entrySalary: "$80k-$105k",
            seniorSalary: "$135k-$170k",
            jobGrowth: "+18% (2024-2034)",
            totalJobs: "28,000 in US",
            remotePercentage: "45",
            topLocations: ["Boston", "San Francisco Bay Area", "Minneapolis", "Cleveland", "San Diego"],
            demandLevel: "Moderate"
        },
        realJobPostings: [
            "Medtronic: Signal Processing Engineer - Minneapolis, MN",
            "Neuralink: Neural Signal Processing Engineer - Fremont, CA",
            "Abbott: Junior Algorithm Engineer - Sunnyvale, CA"
        ],
        skillGaps: [
            { skill: "Real-time Processing", importance: "Critical", timeToLearn: "3-4 months" },
            { skill: "Clinical Applications", importance: "High", timeToLearn: "2-3 months" },
            { skill: "Machine Learning for Signals", importance: "Medium", timeToLearn: "3-4 months" }
        ]
    },

    "Quality Systems Engineer": {
        category: "Industrial Engineering",
        description: "Ensure quality in manufacturing processes",
        education: {
            primary: "BS in Industrial, Mechanical, or Quality Engineering",
            alternative: "BS in any engineering with quality focus",
            requiredCourses: ["STA 135 (Applied Statistics)", "ENG 6 (Engineering Problem Solving)", "IME 140 (Operations Research)"]
        },
        technicalSkills: {
            required: ["Quality control", "Statistical analysis", "ISO standards", "Root cause analysis", "Process improvement"],
            preferred: ["Six Sigma", "Lean manufacturing", "Automation", "SPC", "Minitab"],
            tools: ["Minitab", "JMP", "Excel", "Power BI", "Quality management software"]
        },
        experience: {
            portfolio: "3-4 quality improvement projects",
            internships: "Quality assurance, manufacturing, or process improvement internship",
            projects: ["Process capability study", "Root cause analysis", "Quality audit", "Lean implementation project"]
        },
        certifications: {
            optional: ["ASQ Certified Quality Engineer", "Six Sigma Green Belt"],
            recommended: ["ISO 9001 Lead Auditor"]
        },
        ucDavisResources: {
            primaryClubs: ["SME", "IEEE", "IISE"],
            courses: ["STA 135", "ENG 6", "IME 140"],
            events: ["Quality Summit", "Lean Workshop"],
            professors: ["Prof. Barbara Linke", "Prof. Prasant Mohapatra"]
        },
        careerProgression: [
            { level: "Entry", title: "Junior Quality Engineer", salary: "$65k-$85k", years: "0-2" },
            { level: "Mid", title: "Quality Systems Engineer", salary: "$85k-$110k", years: "2-5" },
            { level: "Senior", title: "Senior Quality Engineer", salary: "$110k-$140k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$80k-$120k",
            entrySalary: "$65k-$85k",
            seniorSalary: "$110k-$140k",
            jobGrowth: "+10% (2024-2034)",
            totalJobs: "125,000 in US",
            remotePercentage: "30",
            topLocations: ["Detroit", "Houston", "Phoenix", "Chicago", "Los Angeles"],
            demandLevel: "Moderate"
        },
        realJobPostings: [
            "Boeing: Quality Engineer I - Seattle, WA",
            "3M: Entry Level Quality Engineer - St. Paul, MN",
            "Johnson & Johnson: Junior Quality Systems Engineer - New Brunswick, NJ"
        ],
        skillGaps: [
            { skill: "Statistical Process Control", importance: "Critical", timeToLearn: "2-3 months" },
            { skill: "ISO Standards", importance: "High", timeToLearn: "2-3 months" },
            { skill: "Lean Six Sigma", importance: "Medium", timeToLearn: "3-4 months" }
        ]
    },

    "Factory Automation Developer": {
        category: "Industrial Engineering",
        description: "Program and optimize factory automation systems",
        education: {
            primary: "BS in Automation Engineering, Mechatronics, or Computer Engineering",
            alternative: "BS in any engineering with automation experience",
            requiredCourses: ["EEC 157 (Control Systems)", "EEC 172 (Embedded Systems)", "MAE 143A (Robotics)"]
        },
        technicalSkills: {
            required: ["PLC", "Robotics", "SCADA", "Industrial networks", "HMI development"],
            preferred: ["Vision systems", "AI/ML", "Digital twin", "MES integration", "OPC UA"],
            tools: ["Siemens TIA Portal", "ABB RobotStudio", "Ignition SCADA", "MATLAB", "Python"]
        },
        experience: {
            portfolio: "3-4 factory automation projects",
            internships: "Manufacturing automation or industrial robotics internship",
            projects: ["Automated production line", "Vision inspection system", "Digital twin simulation", "Predictive maintenance system"]
        },
        certifications: {
            optional: ["Siemens Certified Programmer", "FANUC Robotics Certification"],
            recommended: ["Industry 4.0 Certificate"]
        },
        ucDavisResources: {
            primaryClubs: ["SME", "Davis Robotics Club", "IEEE"],
            courses: ["EEC 157", "EEC 172", "MAE 143A"],
            events: ["Manufacturing Technology Expo", "Automation Workshop"],
            professors: ["Prof. Zhaodan Kong", "Prof. Barbara Linke"]
        },
        careerProgression: [
            { level: "Entry", title: "Junior Automation Developer", salary: "$75k-$95k", years: "0-2" },
            { level: "Mid", title: "Factory Automation Developer", salary: "$95k-$125k", years: "2-5" },
            { level: "Senior", title: "Senior Automation Engineer", salary: "$125k-$160k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$85k-$135k",
            entrySalary: "$75k-$95k",
            seniorSalary: "$125k-$160k",
            jobGrowth: "+14% (2024-2034)",
            totalJobs: "68,000 in US",
            remotePercentage: "35",
            topLocations: ["Detroit", "Cincinnati", "Milwaukee", "Houston", "Charlotte"],
            demandLevel: "High"
        },
        realJobPostings: [
            "Siemens: Factory Automation Engineer - Charlotte, NC",
            "Rockwell Automation: Junior Controls Developer - Milwaukee, WI",
            "KUKA Robotics: Entry Level Automation Engineer - Sterling Heights, MI"
        ],
        skillGaps: [
            { skill: "Digital Twin Technology", importance: "Critical", timeToLearn: "3-4 months" },
            { skill: "AI for Manufacturing", importance: "High", timeToLearn: "3-4 months" },
            { skill: "Industrial IoT", importance: "Medium", timeToLearn: "2-3 months" }
        ]
    },

    "Supply Chain Technology Analyst": {
        category: "Industrial Engineering",
        description: "Optimize supply chains with technology",
        education: {
            primary: "BS in Industrial Engineering, Supply Chain Management, or Information Systems",
            alternative: "BS in Business or Engineering with supply chain focus",
            requiredCourses: ["ENG 6 (Engineering Problem Solving)", "STA 141A (Statistical Computing)", "MGT 11B (Operations Management)"]
        },
        technicalSkills: {
            required: ["Data analysis", "SQL", "Supply chain software", "Excel", "Process mapping"],
            preferred: ["Python", "Simulation", "Blockchain", "IoT", "Tableau"],
            tools: ["SAP", "Oracle SCM", "Excel/Power BI", "Tableau", "AnyLogic"]
        },
        experience: {
            portfolio: "3-4 supply chain optimization projects",
            internships: "Supply chain, logistics, or operations internship",
            projects: ["Inventory optimization model", "Logistics dashboard", "Supply chain simulation", "Demand forecasting tool"]
        },
        certifications: {
            optional: ["APICS CSCP", "Six Sigma Green Belt", "SAP SCM Certification"],
            recommended: ["Supply Chain Analytics Certificate"]
        },
        ucDavisResources: {
            primaryClubs: ["Green Innovation Network", "Davis Consulting Group", "SME"],
            courses: ["ENG 6", "STA 141A", "MGT 11B"],
            events: ["Supply Chain Summit", "Operations Workshop"],
            professors: ["Prof. Roger Wets", "Prof. Barbara Linke"]
        },
        careerProgression: [
            { level: "Entry", title: "Junior Supply Chain Analyst", salary: "$60k-$80k", years: "0-2" },
            { level: "Mid", title: "Supply Chain Technology Analyst", salary: "$80k-$105k", years: "2-5" },
            { level: "Senior", title: "Senior Supply Chain Analyst", salary: "$105k-$135k", years: "5+" }
        ],
        marketData: {
            avgSalary: "$75k-$115k",
            entrySalary: "$60k-$80k",
            seniorSalary: "$105k-$135k",
            jobGrowth: "+18% (2024-2034)",
            totalJobs: "195,000 in US",
            remotePercentage: "55",
            topLocations: ["Chicago", "Dallas", "Atlanta", "Phoenix", "Remote"],
            demandLevel: "High"
        },
        realJobPostings: [
            "Amazon: Supply Chain Analyst - Seattle, WA",
            "Target: Junior Supply Chain Analyst - Minneapolis, MN",
            "FedEx: Entry Level Logistics Analyst - Memphis, TN"
        ],
        skillGaps: [
            { skill: "Supply Chain Analytics", importance: "Critical", timeToLearn: "3-4 months" },
            { skill: "ERP Systems", importance: "High", timeToLearn: "2-3 months" },
            { skill: "Demand Planning", importance: "Medium", timeToLearn: "2-3 months" }
        ]
    }
};

// Export helper functions
const careerHelpers = {
    getCareerByName: (name) => completeCareerRequirements[name],

    getCareersByCategory: (category) => {
        return Object.entries(completeCareerRequirements)
            .filter(([_, data]) => data.category === category)
            .map(([name, data]) => ({ name, ...data }));
    },

    getAllCareerNames: () => Object.keys(completeCareerRequirements),

    getRequiredSkillsForCareer: (careerName) => {
        const career = completeCareerRequirements[careerName];
        return career?.technicalSkills?.required || [];
    },

    getUCDavisResourcesForCareer: (careerName) => {
        const career = completeCareerRequirements[careerName];
        return career?.ucDavisResources || {};
    },

    getCareerProgression: (careerName) => {
        const career = completeCareerRequirements[careerName];
        return career?.careerProgression || [];
    }
};

// Export everything
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        completeCareerRequirements,
        careerHelpers,
        enhancedCareerOptions: Object.keys(completeCareerRequirements)
    };
}