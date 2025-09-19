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
            jobGrowth: "+13%",
            demandLevel: "High",
            remotePercentage: "82",
            topCompanies: ["Airbnb", "Netflix", "Uber", "Pinterest"]
        }
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
            jobGrowth: "+22%",
            demandLevel: "Very High",
            remotePercentage: "75"
        }
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
            jobGrowth: "+13%",
            demandLevel: "High",
            remotePercentage: "85"
        }
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
            jobGrowth: "+21%",
            demandLevel: "High",
            remotePercentage: "68"
        }
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
            jobGrowth: "+25%",
            demandLevel: "Very High",
            remotePercentage: "85"
        }
    },

    // Continue with remaining 49 careers...
    // [Due to length constraints, I'll provide a condensed format for the remaining careers]

    "Site Reliability Engineer (SRE)": {
        category: "Software Engineering",
        description: "Ensure system reliability, availability, and performance at scale",
        education: { primary: "BS in Computer Science or Software Engineering" },
        technicalSkills: {
            required: ["Linux", "Python/Go", "Monitoring", "Incident management", "Cloud platforms"],
            preferred: ["Kubernetes", "Service mesh", "Chaos engineering", "SLO/SLI", "Terraform"]
        },
        ucDavisResources: {
            primaryClubs: ["AggieWorks", "Google Developer Student Club"],
            courses: ["ECS 150", "ECS 152A/B", "ECS 251"],
            professors: ["Prof. Joël Porquet-Lupine"]
        },
        marketData: { avgSalary: "$125k-$185k", jobGrowth: "+25%", demandLevel: "Very High" }
    },

    "Graphics/Rendering Engineer": {
        category: "Software Engineering",
        description: "Develop graphics engines and rendering systems",
        education: { primary: "BS in Computer Science with graphics focus" },
        technicalSkills: {
            required: ["C++", "OpenGL/DirectX", "Linear algebra", "3D math", "Shaders"],
            preferred: ["Vulkan", "Ray tracing", "Physics engines", "GPU programming"]
        },
        ucDavisResources: {
            primaryClubs: ["Game Development and Arts Club"],
            courses: ["ECS 175 (Computer Graphics)", "ECS 177 (Advanced Graphics)"],
            professors: ["Prof. Nina Amenta", "Prof. Michael Neff"]
        },
        marketData: { avgSalary: "$110k-$170k", jobGrowth: "+15%", demandLevel: "Moderate" }
    },

    "Blockchain Developer": {
        category: "Software Engineering",
        description: "Build decentralized applications and smart contracts",
        education: { primary: "BS in Computer Science or related" },
        technicalSkills: {
            required: ["Solidity", "Web3.js", "Ethereum", "Smart contracts", "Cryptography"],
            preferred: ["Rust", "Go", "DeFi protocols", "Layer 2 solutions"]
        },
        ucDavisResources: {
            primaryClubs: ["HackDavis", "Google Developer Student Club"],
            courses: ["ECS 155 (Cryptography)", "ECS 153 (Computer Security)"],
            professors: ["Prof. Matthew Franklin"]
        },
        marketData: { avgSalary: "$120k-$180k", jobGrowth: "+18%", demandLevel: "Moderate" }
    },

    "AR/VR Developer": {
        category: "Software Engineering",
        description: "Create immersive augmented and virtual reality experiences",
        education: { primary: "BS in Computer Science or Game Development" },
        technicalSkills: {
            required: ["Unity/Unreal", "C#/C++", "3D math", "AR/VR SDKs"],
            preferred: ["Computer vision", "3D modeling", "Spatial audio", "Hand tracking"]
        },
        ucDavisResources: {
            primaryClubs: ["Game Development and Arts Club"],
            courses: ["ECS 175 (Computer Graphics)", "ECS 189L (Game Development)"],
            professors: ["Prof. Michael Neff"]
        },
        marketData: { avgSalary: "$105k-$165k", jobGrowth: "+23%", demandLevel: "Growing" }
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
        ucDavisResources: {
            primaryClubs: ["Davis Data Science Club", "AI Student Collective", "Aggie Sports Analytics"],
            courses: ["STA 141A/B/C", "ECS 171", "STA 135", "STA 142A/B"],
            events: ["DataFest", "ML workshops", "Research symposiums"],
            professors: ["Prof. Naoki Saito", "Prof. Thomas Lee", "Prof. Cho-Jui Hsieh"]
        },
        marketData: { avgSalary: "$95k-$165k", jobGrowth: "+35%", demandLevel: "Very High" }
    },

    "Data Analyst": {
        category: "Data & Analytics",
        description: "Analyze data to help organizations make data-driven decisions",
        education: { primary: "BS in Statistics, Business Analytics, Economics, or related" },
        technicalSkills: {
            required: ["Excel", "SQL", "Data visualization", "Basic statistics"],
            preferred: ["Python/R", "Tableau/PowerBI", "Google Analytics", "A/B testing"]
        },
        ucDavisResources: {
            primaryClubs: ["Davis Data Science Club", "Aggie Sports Analytics"],
            courses: ["STA 141A", "ECN 102", "STA 100"],
            professors: ["Prof. James Sharpnack"]
        },
        marketData: { avgSalary: "$65k-$95k", jobGrowth: "+23%", demandLevel: "High" }
    },

    "Machine Learning Engineer": {
        category: "AI & ML",
        description: "Build and deploy machine learning models at scale",
        education: { primary: "BS in Computer Science, Data Science, or Mathematics" },
        technicalSkills: {
            required: ["Python", "TensorFlow/PyTorch", "Scikit-learn", "SQL", "Git"],
            preferred: ["MLOps", "Docker", "Cloud ML services", "Spark", "CUDA"]
        },
        ucDavisResources: {
            primaryClubs: ["AI Student Collective", "Davis Data Science Club"],
            courses: ["ECS 171", "ECS 170", "ECS 189G (Deep Learning)"],
            professors: ["Prof. Cho-Jui Hsieh", "Prof. Ian Davidson"]
        },
        marketData: { avgSalary: "$130k-$195k", jobGrowth: "+40%", demandLevel: "Very High" }
    },

    "ML Infrastructure Engineer": {
        category: "AI & ML",
        description: "Build infrastructure for training and deploying ML models",
        education: { primary: "BS in Computer Science or Software Engineering" },
        technicalSkills: {
            required: ["Python", "Docker/K8s", "Cloud platforms", "MLOps", "CI/CD"],
            preferred: ["Kubeflow", "MLflow", "Spark", "GPU optimization"]
        },
        ucDavisResources: {
            primaryClubs: ["AI Student Collective", "AggieWorks"],
            courses: ["ECS 171", "ECS 150", "ECS 251"],
            professors: ["Prof. Cho-Jui Hsieh"]
        },
        marketData: { avgSalary: "$135k-$200k", jobGrowth: "+35%", demandLevel: "High" }
    },

    "Computer Vision Engineer": {
        category: "AI & ML",
        description: "Develop systems that can interpret and analyze visual information",
        education: { primary: "BS/MS in Computer Science with CV focus" },
        technicalSkills: {
            required: ["Python", "OpenCV", "Deep Learning", "CNN architectures", "C++"],
            preferred: ["CUDA", "3D vision", "SLAM", "Edge deployment"]
        },
        ucDavisResources: {
            primaryClubs: ["AI Student Collective", "Cyclone RoboSub"],
            courses: ["ECS 174 (Computer Vision)", "ECS 171"],
            professors: ["Prof. Yong Jae Lee"]
        },
        marketData: { avgSalary: "$125k-$185k", jobGrowth: "+28%", demandLevel: "High" }
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
        ucDavisResources: {
            primaryClubs: ["The Hardware Club @ UC Davis", "IEEE", "Davis Robotics Club"],
            courses: ["EEC 172", "EEC 180A/B", "ECS 150"],
            events: ["Hardware hackathons", "Robotics competitions"],
            professors: ["Prof. Houman Homayoun", "Prof. Venkatesh Akella"]
        },
        marketData: { avgSalary: "$95k-$145k", jobGrowth: "+18%", demandLevel: "High" }
    },

    "Hardware Design Engineer": {
        category: "Hardware/Electrical Engineering",
        description: "Design and test physical hardware components and systems",
        education: { primary: "BS in Electrical Engineering or Computer Engineering" },
        technicalSkills: {
            required: ["VHDL/Verilog", "PCB design", "Circuit analysis", "CAD tools", "Testing"],
            preferred: ["FPGA", "Signal integrity", "Power analysis", "EMC compliance", "Python"]
        },
        ucDavisResources: {
            primaryClubs: ["The Hardware Club @ UC Davis", "IEEE"],
            courses: ["EEC 180A/B", "EEC 110A/B", "EEC 172"],
            professors: ["Prof. Bevan Baas", "Prof. Rajeevan Amirtharajah"]
        },
        marketData: { avgSalary: "$95k-$155k", jobGrowth: "+5%", demandLevel: "Moderate" }
    },

    "FPGA Engineer": {
        category: "Hardware/Electrical Engineering",
        description: "Design and implement digital circuits on FPGAs",
        education: { primary: "BS in Electrical or Computer Engineering" },
        technicalSkills: {
            required: ["VHDL/Verilog", "FPGA tools", "Digital design", "Timing analysis", "Debugging"],
            preferred: ["SystemVerilog", "HLS", "DSP", "High-speed interfaces", "Python"]
        },
        ucDavisResources: {
            primaryClubs: ["The Hardware Club @ UC Davis", "IEEE"],
            courses: ["EEC 180B", "EEC 281 (VLSI)", "EEC 172"],
            professors: ["Prof. Bevan Baas"]
        },
        marketData: { avgSalary: "$105k-$165k", jobGrowth: "+7%", demandLevel: "Moderate" }
    },

    "Digital Design Engineer": {
        category: "Hardware/Electrical Engineering",
        description: "Design digital logic circuits and systems",
        education: { primary: "BS in Electrical or Computer Engineering" },
        technicalSkills: {
            required: ["Verilog/VHDL", "Digital logic", "Timing analysis", "Synthesis", "Verification"],
            preferred: ["SystemVerilog", "UVM", "Scripting", "ASIC design"]
        },
        ucDavisResources: {
            primaryClubs: ["IEEE", "Eta Kappa Nu"],
            courses: ["EEC 180A/B", "EEC 281"],
            professors: ["Prof. Bevan Baas"]
        },
        marketData: { avgSalary: "$100k-$160k", jobGrowth: "+6%", demandLevel: "Moderate" }
    },

    "RF Engineer": {
        category: "Hardware/Electrical Engineering",
        description: "Design and optimize radio frequency systems",
        education: { primary: "BS in Electrical Engineering with RF focus" },
        technicalSkills: {
            required: ["RF circuit design", "Antenna theory", "EM simulation", "Network analyzers"],
            preferred: ["5G/6G", "Radar systems", "Microwave engineering"]
        },
        ucDavisResources: {
            primaryClubs: ["IEEE"],
            courses: ["EEC 130A/B (Electromagnetics)", "EEC 132A/B (RF/Microwave)"],
            professors: ["Prof. Xiaoguang Liu"]
        },
        marketData: { avgSalary: "$105k-$165k", jobGrowth: "+8%", demandLevel: "Moderate" }
    },

    "Power Systems Engineer": {
        category: "Hardware/Electrical Engineering",
        description: "Design and maintain electrical power systems",
        education: { primary: "BS in Electrical Engineering" },
        technicalSkills: {
            required: ["Power electronics", "Circuit analysis", "Control systems", "MATLAB"],
            preferred: ["Renewable energy", "Smart grid", "Power quality", "SCADA"]
        },
        ucDavisResources: {
            primaryClubs: ["IEEE", "Formula Racing at UC Davis (FRUCD)", "EcoCAR"],
            courses: ["EEC 157 (Power Systems)", "EEC 158 (Power Electronics)"],
            professors: ["Prof. Diego Rosso"]
        },
        marketData: { avgSalary: "$95k-$150k", jobGrowth: "+10%", demandLevel: "Moderate" }
    },

    "Control Systems Engineer": {
        category: "Hardware/Electrical Engineering",
        description: "Design and implement control systems for various applications",
        education: { primary: "BS in Electrical or Mechanical Engineering" },
        technicalSkills: {
            required: ["Control theory", "MATLAB/Simulink", "PID controllers", "System modeling"],
            preferred: ["Robotics", "PLC programming", "State-space", "Adaptive control"]
        },
        ucDavisResources: {
            primaryClubs: ["Davis Robotics Club", "Cyclone RoboSub", "EcoCAR"],
            courses: ["EEC 157 (Control Systems)", "MAE 143A (Signals & Systems)"],
            professors: ["Prof. Soheil Ghiasi"]
        },
        marketData: { avgSalary: "$95k-$145k", jobGrowth: "+12%", demandLevel: "Moderate" }
    },

    "Signal Processing Engineer": {
        category: "Hardware/Electrical Engineering",
        description: "Develop algorithms for processing digital signals",
        education: { primary: "BS in Electrical Engineering or Computer Engineering" },
        technicalSkills: {
            required: ["DSP algorithms", "MATLAB", "C/C++", "FFT", "Filter design"],
            preferred: ["FPGA", "Audio/Video processing", "Communications", "Real-time systems"]
        },
        ucDavisResources: {
            primaryClubs: ["IEEE", "The Hardware Club @ UC Davis"],
            courses: ["EEC 150A/B (Signals & Systems)", "EEC 201 (Digital Signal Processing)"],
            professors: ["Prof. Zhi Ding"]
        },
        marketData: { avgSalary: "$100k-$155k", jobGrowth: "+10%", demandLevel: "Moderate" }
    },

    "Firmware Engineer": {
        category: "Hardware/Electrical Engineering",
        description: "Develop low-level software for hardware devices",
        education: { primary: "BS in Computer Engineering or Electrical Engineering" },
        technicalSkills: {
            required: ["C/C++", "Assembly", "RTOS", "Hardware interfaces", "Debugging"],
            preferred: ["Bootloaders", "Device drivers", "Power management", "Security"]
        },
        ucDavisResources: {
            primaryClubs: ["The Hardware Club @ UC Davis", "Davis Robotics Club"],
            courses: ["EEC 172", "ECS 150", "EEC 180A/B"],
            professors: ["Prof. Houman Homayoun"]
        },
        marketData: { avgSalary: "$95k-$150k", jobGrowth: "+15%", demandLevel: "High" }
    },

    "PCB Design Engineer": {
        category: "Hardware/Electrical Engineering",
        description: "Design printed circuit boards for electronic devices",
        education: { primary: "BS in Electrical Engineering" },
        technicalSkills: {
            required: ["PCB CAD tools", "Circuit design", "Signal integrity", "DFM", "Testing"],
            preferred: ["High-speed design", "RF layout", "Thermal management", "EMC"]
        },
        ucDavisResources: {
            primaryClubs: ["The Hardware Club @ UC Davis", "IEEE"],
            courses: ["EEC 110A/B", "EEC 172"],
            professors: ["Prof. Andre Knoesen"]
        },
        marketData: { avgSalary: "$85k-$135k", jobGrowth: "+6%", demandLevel: "Moderate" }
    },

    "Hardware Security Engineer": {
        category: "Hardware/Electrical Engineering",
        description: "Secure hardware systems against threats",
        education: { primary: "BS in Computer/Electrical Engineering" },
        technicalSkills: {
            required: ["Hardware security", "Cryptography", "Side-channel attacks", "Secure boot"],
            preferred: ["Reverse engineering", "Fault injection", "TPM/HSM", "Secure coding"]
        },
        ucDavisResources: {
            primaryClubs: ["Cyber Security Club at UC Davis", "IEEE"],
            courses: ["ECS 153", "ECS 155", "EEC 172"],
            professors: ["Prof. Matthew Bishop"]
        },
        marketData: { avgSalary: "$110k-$170k", jobGrowth: "+20%", demandLevel: "Growing" }
    },

    // AEROSPACE (4 careers)

    "Aerospace Software Engineer": {
        category: "Aerospace Engineering",
        description: "Develop software for spacecraft, satellites, and aviation systems",
        education: { primary: "BS in Aerospace Engineering, Computer Science, or Computer Engineering" },
        technicalSkills: {
            required: ["C/C++", "Real-time systems", "Embedded programming", "MATLAB", "Git"],
            preferred: ["DO-178C", "Model-based design", "Flight dynamics", "GNC algorithms"]
        },
        ucDavisResources: {
            primaryClubs: ["Aggie Space Initiative", "Space and Satellite Systems (SSS) Club", "AMAT"],
            courses: ["MAE 143B (Aerospace)", "ECS 150", "EEC 172"],
            professors: ["Prof. Nesrin Sarigul-Klijn"]
        },
        marketData: { avgSalary: "$100k-$160k", jobGrowth: "+8%", demandLevel: "Moderate" }
    },

    "Systems Integration Engineer": {
        category: "Aerospace Engineering",
        description: "Integrate complex aerospace systems and subsystems",
        education: { primary: "BS in Aerospace or Systems Engineering" },
        technicalSkills: {
            required: ["Systems engineering", "Integration testing", "Requirements management", "DOORS"],
            preferred: ["Model-based systems engineering", "V&V", "Risk management"]
        },
        ucDavisResources: {
            primaryClubs: ["Aggie Space Initiative", "SSS Club", "EcoCAR"],
            courses: ["MAE 143A/B", "ENG 6"],
            professors: ["Prof. Stephen Robinson"]
        },
        marketData: { avgSalary: "$95k-$150k", jobGrowth: "+10%", demandLevel: "Moderate" }
    },

    "Avionics Engineer": {
        category: "Aerospace Engineering",
        description: "Design and maintain aircraft electronic systems",
        education: { primary: "BS in Electrical or Aerospace Engineering" },
        technicalSkills: {
            required: ["Avionics systems", "DO-254/DO-178", "Embedded systems", "Testing"],
            preferred: ["Flight control systems", "Navigation", "Communication systems"]
        },
        ucDavisResources: {
            primaryClubs: ["Aggie Space Initiative", "SSS Club", "APRL"],
            courses: ["EEC 172", "MAE 143B", "EEC 157"],
            professors: ["Prof. Ron Hess"]
        },
        marketData: { avgSalary: "$95k-$145k", jobGrowth: "+7%", demandLevel: "Moderate" }
    },

    "Autonomous Systems Engineer (Drones/UAV)": {
        category: "Aerospace Engineering",
        description: "Develop autonomous systems for unmanned aerial vehicles",
        education: { primary: "BS in Aerospace, Robotics, or Computer Engineering" },
        technicalSkills: {
            required: ["ROS", "Computer vision", "Path planning", "Control systems", "C++/Python"],
            preferred: ["SLAM", "Sensor fusion", "PX4/ArduPilot", "Machine learning"]
        },
        ucDavisResources: {
            primaryClubs: ["Cyclone RoboSub", "Aggie Space Initiative", "SSS Club"],
            courses: ["ECS 174", "EEC 157", "MAE 143A"],
            professors: ["Prof. Zhaodan Kong"]
        },
        marketData: { avgSalary: "$105k-$165k", jobGrowth: "+25%", demandLevel: "High" }
    },

    // BIOMEDICAL (10 careers)

    "Medical Device Software Engineer": {
        category: "Biomedical Engineering",
        description: "Develop software for medical devices and healthcare systems",
        education: { primary: "BS in Biomedical Engineering, CS, or Electrical Engineering" },
        technicalSkills: {
            required: ["C/C++", "Python", "Medical standards (FDA)", "Real-time systems", "Testing"],
            preferred: ["IEC 62304", "ISO 13485", "DICOM", "HL7", "Risk management"]
        },
        ucDavisResources: {
            primaryClubs: ["Biomedical Engineering Society (BES)", "Neurotech @ UCDavis"],
            courses: ["BIM 106", "ECS 153", "EEC 172"],
            professors: ["Prof. Tingrui Pan", "Prof. Erkin Seker"]
        },
        marketData: { avgSalary: "$95k-$155k", jobGrowth: "+17%", demandLevel: "High" }
    },

    "Clinical Systems Engineer": {
        category: "Biomedical Engineering",
        description: "Implement and maintain clinical information systems",
        education: { primary: "BS in Biomedical Engineering or Health Informatics" },
        technicalSkills: {
            required: ["HL7/FHIR", "SQL", "Clinical workflows", "EMR/EHR systems"],
            preferred: ["HIPAA compliance", "Interoperability", "Data analytics"]
        },
        ucDavisResources: {
            primaryClubs: ["Biomedical Engineering Society (BES)"],
            courses: ["BIM 106", "ECS 165A"],
            professors: ["Prof. David Rocke"]
        },
        marketData: { avgSalary: "$85k-$135k", jobGrowth: "+15%", demandLevel: "High" }
    },

    "Bioinformatics Engineer": {
        category: "Biomedical Engineering",
        description: "Analyze biological data using computational methods",
        education: { primary: "BS in Bioinformatics, Computational Biology, or CS with Bio minor" },
        technicalSkills: {
            required: ["Python/R", "SQL", "Linux", "Statistics", "Genomics tools"],
            preferred: ["Machine learning", "Cloud computing", "Docker", "Workflow managers", "HPC"]
        },
        ucDavisResources: {
            primaryClubs: ["Biomedical Engineering Society (BES)", "Davis Data Science Club"],
            courses: ["BIS 180L", "STA 141", "ECS 124"],
            professors: ["Prof. Ian Korf"]
        },
        marketData: { avgSalary: "$85k-$135k", jobGrowth: "+31%", demandLevel: "High" }
    },

    "Healthcare Data Analyst": {
        category: "Biomedical Engineering",
        description: "Analyze healthcare data to improve patient outcomes",
        education: { primary: "BS in Health Informatics, Statistics, or related" },
        technicalSkills: {
            required: ["SQL", "Excel", "Healthcare analytics", "HIPAA", "Reporting"],
            preferred: ["Python/R", "Tableau", "Clinical knowledge", "Machine learning"]
        },
        ucDavisResources: {
            primaryClubs: ["BES", "Davis Data Driven Change"],
            courses: ["STA 141A", "PHR 180"],
            professors: ["Prof. Nick Anderson"]
        },
        marketData: { avgSalary: "$70k-$110k", jobGrowth: "+20%", demandLevel: "High" }
    },

    "Medical Imaging Software Developer": {
        category: "Biomedical Engineering",
        description: "Develop software for medical imaging systems",
        education: { primary: "BS in Biomedical Engineering or Computer Science" },
        technicalSkills: {
            required: ["C++", "Image processing", "DICOM", "Computer vision", "Python"],
            preferred: ["GPU programming", "Machine learning", "3D reconstruction", "ITK/VTK"]
        },
        ucDavisResources: {
            primaryClubs: ["BES", "Neurotech @ UCDavis"],
            courses: ["ECS 174", "BIM 106"],
            professors: ["Prof. Jinyi Qi"]
        },
        marketData: { avgSalary: "$100k-$160k", jobGrowth: "+18%", demandLevel: "High" }
    },

    // INDUSTRIAL/MANUFACTURING (6 careers)

    "Industrial Software Engineer": {
        category: "Industrial Engineering",
        description: "Develop software for industrial automation and manufacturing",
        education: { primary: "BS in Computer Science or Industrial Engineering" },
        technicalSkills: {
            required: ["PLC programming", "SCADA", "HMI development", "Python", "SQL"],
            preferred: ["MES systems", "OPC UA", "Industrial IoT", "Robotics"]
        },
        ucDavisResources: {
            primaryClubs: ["Society of Manufacturing Engineers (SME)", "The Hardware Club @ UC Davis"],
            courses: ["ENG 6", "ECS 150"],
            professors: ["Prof. Prasant Mohapatra"]
        },
        marketData: { avgSalary: "$90k-$140k", jobGrowth: "+15%", demandLevel: "High" }
    },

    "Automation Engineer": {
        category: "Industrial Engineering",
        description: "Design and implement automated systems for manufacturing",
        education: { primary: "BS in Mechanical, Electrical, or Industrial Engineering" },
        technicalSkills: {
            required: ["PLC programming", "Robotics", "Control systems", "CAD", "HMI"],
            preferred: ["Vision systems", "Motion control", "Safety systems", "Industry 4.0"]
        },
        ucDavisResources: {
            primaryClubs: ["SME", "Davis Robotics Club", "Cyclone RoboSub"],
            courses: ["EEC 157", "MAE 143A"],
            professors: ["Prof. Zhaodan Kong"]
        },
        marketData: { avgSalary: "$85k-$130k", jobGrowth: "+12%", demandLevel: "High" }
    },

    "Industrial IoT Engineer": {
        category: "Industrial Engineering",
        description: "Implement IoT solutions for industrial applications",
        education: { primary: "BS in Computer Engineering or Electrical Engineering" },
        technicalSkills: {
            required: ["IoT protocols", "Cloud platforms", "Embedded systems", "Data analytics"],
            preferred: ["Edge computing", "5G", "Time-series databases", "Security"]
        },
        ucDavisResources: {
            primaryClubs: ["The Hardware Club @ UC Davis", "SME"],
            courses: ["EEC 172", "ECS 152A"],
            professors: ["Prof. Chen-Nee Chuah"]
        },
        marketData: { avgSalary: "$95k-$150k", jobGrowth: "+22%", demandLevel: "High" }
    },

    // BUSINESS-TECH HYBRID (3 careers)

    "Technical Product Manager": {
        category: "Product Management",
        description: "Guide product development with technical expertise",
        education: { primary: "BS in CS, Engineering, or Business + technical minor" },
        technicalSkills: {
            required: ["Product roadmapping", "Agile/Scrum", "Data analysis", "Basic coding", "SQL"],
            preferred: ["A/B testing", "User research", "Financial modeling", "API design"]
        },
        ucDavisResources: {
            primaryClubs: ["Product Space @ UC Davis", "AggieWorks", "HackDavis"],
            courses: ["MGT 180", "ECS 193", "ECS 162"],
            professors: ["Prof. Hemant Bhargava"]
        },
        marketData: { avgSalary: "$120k-$180k", jobGrowth: "+19%", demandLevel: "High" }
    },

    "Sales Engineer": {
        category: "Business-Tech",
        description: "Bridge technical products and customer needs",
        education: { primary: "BS in Engineering or CS" },
        technicalSkills: {
            required: ["Technical presentations", "Solution architecture", "CRM systems", "Demos"],
            preferred: ["Industry knowledge", "Competitive analysis", "Pricing strategy"]
        },
        ucDavisResources: {
            primaryClubs: ["The Davis Consulting Group", "Green Innovation Network"],
            courses: ["CMN 1", "MGT 11A"],
            professors: ["Prof. Tim McNeil"]
        },
        marketData: { avgSalary: "$100k-$160k", jobGrowth: "+15%", demandLevel: "Moderate" }
    },

    "Research Engineer": {
        category: "Research & Development",
        description: "Conduct applied research and develop prototypes",
        education: { primary: "BS/MS in relevant engineering field" },
        technicalSkills: {
            required: ["Research methods", "Prototyping", "Data analysis", "Technical writing"],
            preferred: ["Grant writing", "Patent process", "Simulation tools", "Publishing"]
        },
        ucDavisResources: {
            primaryClubs: ["AI Student Collective", "Quantum Computing Society at Davis"],
            courses: ["ECS 189", "Graduate seminars"],
            professors: ["Multiple research faculty"]
        },
        marketData: { avgSalary: "$85k-$145k", jobGrowth: "+12%", demandLevel: "Moderate" }
    },

    // SUPPORT ROLES (remaining careers)

    "QA/Test Automation Engineer": {
        category: "Software Engineering",
        description: "Ensure software quality through testing",
        education: { primary: "BS in Computer Science or related" },
        technicalSkills: {
            required: ["Test automation", "Selenium/Cypress", "Python/Java", "Git"],
            preferred: ["CI/CD", "Performance testing", "API testing"]
        },
        ucDavisResources: {
            primaryClubs: ["AggieWorks", "CodeLab"],
            courses: ["ECS 160"],
            professors: ["Prof. Premkumar Devanbu"]
        },
        marketData: { avgSalary: "$85k-$125k", jobGrowth: "+17%", demandLevel: "High" }
    },

    "Technical Writer": {
        category: "Communication",
        description: "Create technical documentation and user guides",
        education: { primary: "BS in Technical Writing, English, or technical field" },
        technicalSkills: {
            required: ["Writing", "Documentation tools", "Basic coding", "Version control"],
            preferred: ["API documentation", "Video creation", "Markdown"]
        },
        ucDavisResources: {
            primaryClubs: ["Science Says", "Computer Science Tutoring Club"],
            courses: ["ENL 115", "CMN 150"],
            professors: ["Prof. Carl Whithaus"]
        },
        marketData: { avgSalary: "$75k-$115k", jobGrowth: "+12%", demandLevel: "Moderate" }
    },

    "Developer Advocate": {
        category: "Developer Relations",
        description: "Bridge developers and products through education and advocacy",
        education: { primary: "BS in Computer Science or related" },
        technicalSkills: {
            required: ["Programming", "Public speaking", "Content creation", "Community building"],
            preferred: ["Video production", "Event organizing", "Multiple languages"]
        },
        ucDavisResources: {
            primaryClubs: ["Google Developer Student Club", "HackDavis"],
            courses: ["CMN 1", "ECS 189"],
            professors: ["Prof. Nina Amenta"]
        },
        marketData: { avgSalary: "$110k-$170k", jobGrowth: "+20%", demandLevel: "Growing" }
    },

    "IT Support Engineer": {
        category: "Information Technology",
        description: "Provide technical support and maintain IT infrastructure",
        education: { primary: "BS in Information Technology or Computer Science" },
        technicalSkills: {
            required: ["Windows/Mac/Linux", "Networking", "Troubleshooting", "Help desk"],
            preferred: ["Active Directory", "Cloud services", "Scripting", "Security"]
        },
        ucDavisResources: {
            primaryClubs: ["Computer Science Tutoring Club", "#include"],
            courses: ["ECS 152A", "ECS 153"],
            professors: ["Prof. Karl Levitt"]
        },
        marketData: { avgSalary: "$55k-$85k", jobGrowth: "+10%", demandLevel: "Moderate" }
    },

    "Cybersecurity Engineer": {
        category: "Security",
        description: "Protect systems and data from cyber threats",
        education: { primary: "BS in Cybersecurity, Computer Science, or Information Security" },
        technicalSkills: {
            required: ["Network security", "Linux", "Security tools", "Python", "Incident response"],
            preferred: ["Penetration testing", "SIEM tools", "Cloud security", "Forensics"]
        },
        ucDavisResources: {
            primaryClubs: ["Cyber Security Club at UC Davis"],
            courses: ["ECS 153", "ECS 152", "ECS 155"],
            professors: ["Prof. Matthew Bishop", "Prof. Karl Levitt"]
        },
        marketData: { avgSalary: "$105k-$165k", jobGrowth: "+32%", demandLevel: "Very High" }
    },

    "Game Developer": {
        category: "Software Engineering",
        description: "Design and build video games and interactive experiences",
        education: { primary: "BS in Computer Science or Game Development" },
        technicalSkills: {
            required: ["C++/C#", "Unity/Unreal", "Game design", "3D math", "Version control"],
            preferred: ["Graphics programming", "Networking", "AI", "Physics engines"]
        },
        ucDavisResources: {
            primaryClubs: ["Game Development and Arts Club", "Women in Gaming at UC Davis"],
            courses: ["ECS 189L", "ECS 175"],
            professors: ["Prof. Michael Neff"]
        },
        marketData: { avgSalary: "$85k-$130k", jobGrowth: "+16%", demandLevel: "Competitive" }
    },

    // Additional specialized roles
    "Wearable Technology Engineer": {
        category: "Biomedical Engineering",
        description: "Develop wearable health monitoring devices",
        technicalSkills: {
            required: ["Embedded systems", "Sensor integration", "Mobile apps", "Data analytics"],
            preferred: ["BLE", "Power optimization", "Health algorithms"]
        },
        ucDavisResources: {
            primaryClubs: ["Neurotech @ UCDavis", "BES"],
            courses: ["BIM 106", "EEC 172"]
        },
        marketData: { avgSalary: "$95k-$145k", jobGrowth: "+25%", demandLevel: "Growing" }
    },

    "Health Tech Software Engineer": {
        category: "Biomedical Engineering",
        description: "Build digital health platforms and applications",
        technicalSkills: {
            required: ["Web/mobile development", "HIPAA", "APIs", "Cloud"],
            preferred: ["Telemedicine", "EHR integration", "ML for health"]
        },
        ucDavisResources: {
            primaryClubs: ["BES", "HackDavis"],
            courses: ["BIM 106", "ECS 162"]
        },
        marketData: { avgSalary: "$100k-$160k", jobGrowth: "+28%", demandLevel: "Very High" }
    },

    "Computational Biology Engineer": {
        category: "Biomedical Engineering",
        description: "Model biological systems computationally",
        technicalSkills: {
            required: ["Python/R", "Mathematical modeling", "Simulation", "Statistics"],
            preferred: ["Systems biology", "ML", "HPC", "Publication"]
        },
        ucDavisResources: {
            primaryClubs: ["BES", "AI Student Collective"],
            courses: ["BIS 180L", "MAT 124"]
        },
        marketData: { avgSalary: "$90k-$140k", jobGrowth: "+23%", demandLevel: "Growing" }
    },

    "Medical Robotics Engineer": {
        category: "Biomedical Engineering",
        description: "Develop robotic systems for medical applications",
        technicalSkills: {
            required: ["Robotics", "Control systems", "C++/Python", "ROS", "Safety"],
            preferred: ["Computer vision", "Haptics", "FDA regulations"]
        },
        ucDavisResources: {
            primaryClubs: ["Davis Robotics Club", "Women in Robotics Club", "BES"],
            courses: ["MAE 143A", "EEC 157"]
        },
        marketData: { avgSalary: "$105k-$165k", jobGrowth: "+20%", demandLevel: "High" }
    },

    "Biomedical Signal Processing Engineer": {
        category: "Biomedical Engineering",
        description: "Process biological signals for diagnostics",
        technicalSkills: {
            required: ["Signal processing", "MATLAB", "Python", "Statistics"],
            preferred: ["EEG/ECG/EMG", "Real-time processing", "ML"]
        },
        ucDavisResources: {
            primaryClubs: ["Neurotech @ UCDavis", "BES"],
            courses: ["EEC 150A/B", "BIM 106"]
        },
        marketData: { avgSalary: "$95k-$145k", jobGrowth: "+18%", demandLevel: "Moderate" }
    },

    "Quality Systems Engineer": {
        category: "Industrial Engineering",
        description: "Ensure quality in manufacturing processes",
        technicalSkills: {
            required: ["Quality control", "Statistical analysis", "ISO standards", "Root cause analysis"],
            preferred: ["Six Sigma", "Lean manufacturing", "Automation"]
        },
        ucDavisResources: {
            primaryClubs: ["SME", "IEEE"],
            courses: ["STA 135", "ENG 6"]
        },
        marketData: { avgSalary: "$80k-$120k", jobGrowth: "+10%", demandLevel: "Moderate" }
    },

    "Factory Automation Developer": {
        category: "Industrial Engineering",
        description: "Program and optimize factory automation systems",
        technicalSkills: {
            required: ["PLC", "Robotics", "SCADA", "Industrial networks"],
            preferred: ["Vision systems", "AI/ML", "Digital twin"]
        },
        ucDavisResources: {
            primaryClubs: ["SME", "Davis Robotics Club"],
            courses: ["EEC 157", "EEC 172"]
        },
        marketData: { avgSalary: "$85k-$135k", jobGrowth: "+14%", demandLevel: "High" }
    },

    "Supply Chain Technology Analyst": {
        category: "Industrial Engineering",
        description: "Optimize supply chains with technology",
        technicalSkills: {
            required: ["Data analysis", "SQL", "Supply chain software", "Excel"],
            preferred: ["Python", "Simulation", "Blockchain", "IoT"]
        },
        ucDavisResources: {
            primaryClubs: ["Green Innovation Network", "Davis Consulting Group", "SME"],
            courses: ["ENG 6", "STA 141A"]
        },
        marketData: { avgSalary: "$75k-$115k", jobGrowth: "+18%", demandLevel: "High" }
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

module.exports = {
    completeCareerRequirements,
    careerHelpers,
    enhancedCareerOptions: Object.keys(completeCareerRequirements) // List of all 55 careers
};