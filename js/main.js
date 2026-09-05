document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       1. SMOOTH NAVIGATION
    ===================================================== */

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", function (event) {

            const targetId = this.getAttribute("href");

            if (targetId === "#") return;

            const target = document.querySelector(targetId);

            if (target) {

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        });

    });


    /* =====================================================
       2. CURRENT YEAR
    ===================================================== */

    const yearElement = document.querySelector("#currentYear");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }


    /* =====================================================
       3. HEADER SHADOW ON SCROLL
    ===================================================== */

    const header = document.querySelector(".site-header");

    if (header) {

        window.addEventListener("scroll", () => {

            if (window.scrollY > 20) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }

        });

    }


    /* =====================================================
       4. MOBILE MENU
    ===================================================== */

    const mobileMenuBtn = document.querySelector("#mobileMenuBtn");
    const mainNav = document.querySelector(".main-nav");

    if (mobileMenuBtn && mainNav) {

        mobileMenuBtn.addEventListener("click", () => {

            const isOpen = mainNav.classList.toggle("mobile-open");

            mobileMenuBtn.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );

            mobileMenuBtn.setAttribute(
                "aria-label",
                isOpen
                    ? "Close navigation menu"
                    : "Open navigation menu"
            );

        });


        /* Close mobile menu after clicking a link */

        mainNav.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                mainNav.classList.remove("mobile-open");

                mobileMenuBtn.setAttribute(
                    "aria-expanded",
                    "false"
                );

                mobileMenuBtn.setAttribute(
                    "aria-label",
                    "Open navigation menu"
                );

            });

        });

    }


    /* =====================================================
       5. LOAD SERVICES
    ===================================================== */

    loadServices();


    /* =====================================================
       6. LOAD INDUSTRIES
    ===================================================== */

    loadIndustries();

});


/* =========================================================
   SERVICES
========================================================= */

async function loadServices() {

    const servicesGrid =
        document.querySelector(".services-grid");

    if (!servicesGrid) return;

    try {

        const response =
            await fetch("data/services.json");

        if (!response.ok) {

            throw new Error(
                `HTTP error: ${response.status}`
            );

        }

        const data = await response.json();

        if (
            !data.services ||
            !Array.isArray(data.services)
        ) {

            throw new Error(
                "Invalid services.json structure"
            );

        }

        renderServices(
            data.services,
            servicesGrid
        );

    } catch (error) {

        console.error(
            "Unable to load services:",
            error
        );

        servicesGrid.innerHTML = `
            <p>
                Services could not be loaded.
                Please try again.
            </p>
        `;

    }

}


/* =========================================================
   RENDER SERVICES
========================================================= */

function renderServices(services, container) {

    container.innerHTML = "";

    services.forEach((service, index) => {

        const number =
            String(index + 1).padStart(2, "0");

        const icon =
            getServiceIcon(service.id);

        const card =
            document.createElement("a");

        card.className = "service-card";

        card.href =
            `services/${service.id}/index.html`;

        card.innerHTML = `

            <div class="service-icon">
                ${icon}
            </div>

            <span class="service-number">
                ${number}
            </span>

            <h3>
                ${escapeHTML(service.name)}
            </h3>

            <p>
                ${escapeHTML(
                    service.shortDescription
                )}
            </p>

            <span class="service-link">
                Explore
                ${escapeHTML(
                    getShortName(service.name)
                )}
                →
            </span>

        `;

        container.appendChild(card);

    });

}


/* =========================================================
   SERVICE ICONS
========================================================= */

function getServiceIcon(id) {

    const icons = {

        "ai-solutions":
            "✦",

        "web-development":
            "⌘",

        "accounting-finance":
            "▣",

        "data-analytics":
            "◫",

        "digital-marketing":
            "↗",

        "media-production":
            "▶"

    };

    return icons[id] || "◆";

}


/* =========================================================
   SERVICE SHORT NAMES
========================================================= */

function getShortName(name) {

    const shortNames = {

        "AI Solutions":
            "AI",

        "Web Development":
            "Web Development",

        "Accounting & Finance":
            "Accounting",

        "Data & Analytics":
            "Analytics",

        "Digital Marketing":
            "Digital Marketing",

        "Media & Content":
            "Media"

    };

    return shortNames[name] || name;

}


/* =========================================================
   INDUSTRIES
========================================================= */

async function loadIndustries() {

    const industriesGrid =
        document.querySelector("#industriesGrid");

    if (!industriesGrid) return;

    try {

        const response =
            await fetch("data/industries.json");

        if (!response.ok) {

            throw new Error(
                `HTTP error: ${response.status}`
            );

        }

        const data = await response.json();

        if (
            !data.industries ||
            !Array.isArray(data.industries)
        ) {

            throw new Error(
                "Invalid industries.json structure"
            );

        }

        renderIndustries(
            data.industries,
            industriesGrid
        );

    } catch (error) {

        console.error(
            "Unable to load industries:",
            error
        );

        industriesGrid.innerHTML = `
            <p>
                Industries could not be loaded.
                Please try again.
            </p>
        `;

    }

}


/* =========================================================
   RENDER INDUSTRIES
========================================================= */

function renderIndustries(
    industries,
    container
) {

    container.innerHTML = "";

    industries.forEach((industry, index) => {

        const number =
            String(index + 1).padStart(2, "0");

        const card =
            document.createElement("a");

        card.className = "industry-card";

        /*
         * Your current industries.json uses:
         * finance
         * education
         * retail
         * healthcare
         * professional-services
         * startups
         *
         * Some existing folders use different names.
         * The mapping below connects the JSON IDs
         * with your actual folder names.
         */

        const folderMap = {

            "finance":
                "finance-accounting",

            "education":
                "Education",

            "retail":
                "retail-ecommerce",

            "healthcare":
                "healthcare",

            "professional-services":
                "professional-services",

            "startups":
                "startups"

        };

        const folder =
            folderMap[industry.id] ||
            industry.id;

        card.href =
            `industries/${folder}/index.html`;

        card.innerHTML = `

            <span class="industry-number">
                ${number}
            </span>

            <h3>
                ${escapeHTML(industry.name)}
            </h3>

            <p>
                ${escapeHTML(
                    industry.description
                )}
            </p>

            <span class="industry-link">
                Explore Industry →
            </span>

        `;

        container.appendChild(card);

    });

}


/* =========================================================
   SECURITY / HTML ESCAPE
========================================================= */

function escapeHTML(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}